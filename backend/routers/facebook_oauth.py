from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from database import get_db
from models import User, FacebookAccount, SocialAccount, CreatorProfile
from Auth import verify_token
from services.facebook_oauth_service import FacebookOAuthService

from routers.user import get_or_create_user_from_token

router = APIRouter(prefix="/api/auth/facebook", tags=["Facebook OAuth"])


class CallbackPayload(BaseModel):
    code: str

class SimulatePayload(BaseModel):
    handle: str

@router.post("/simulate_connect")
def simulate_connect(payload: SimulatePayload, user=Depends(verify_token), db: Session = Depends(get_db)):
    from datetime import datetime
    import hashlib
    db_user = get_or_create_user_from_token(user, db)
    
    clean_handle = payload.handle.replace("@", "").strip()
    if not clean_handle:
        raise HTTPException(status_code=400, detail="Handle is required")
        
    seed = int(hashlib.md5(clean_handle.encode('utf-8')).hexdigest(), 16)
    followers = 10000 + (seed % 5000000)
    
    acc = db.query(FacebookAccount).filter(FacebookAccount.user_id == db_user.id).first()
    if not acc:
        acc = FacebookAccount(user_id=db_user.id)
        db.add(acc)
        
    acc.facebook_page_id = str(seed % 10000000)
    acc.page_name = clean_handle.title()
    acc.page_link = f"https://facebook.com/{clean_handle}"
    acc.followers_count = followers
    acc.category = "Public Figure"
    acc.connected_status = "connected"
    acc.last_synced_at = datetime.utcnow()
    # also set access_token to empty string so it doesn't fail NOT NULL constraint if it has one
    acc.access_token = ""
    
    profile = db.query(CreatorProfile).filter(CreatorProfile.user_id == db_user.id).first()
    if profile:
        s_acc = db.query(SocialAccount).filter(SocialAccount.creator_id == profile.creator_id, SocialAccount.platform == "Facebook").first()
        if not s_acc:
            s_acc = SocialAccount(creator_id=profile.creator_id, platform="Facebook")
            db.add(s_acc)
        s_acc.account_name = clean_handle
        s_acc.profile_url = acc.page_link
        
    db.commit()
    return {"message": "Simulated Facebook connection", "page_name": acc.page_name}


@router.get("/connect")
def connect_facebook_oauth(user=Depends(verify_token)):
    return FacebookOAuthService.get_authorize_url()


@router.post("/callback")
def facebook_oauth_callback(payload: CallbackPayload, user=Depends(verify_token), db: Session = Depends(get_db)):
    db_user = get_or_create_user_from_token(user, db)
    return FacebookOAuthService.exchange_code_and_connect(db_user.id, payload.code, db)


@router.get("/status")
def get_facebook_status(user=Depends(verify_token), db: Session = Depends(get_db)):
    db_user = get_or_create_user_from_token(user, db)
    acc = db.query(FacebookAccount).filter(FacebookAccount.user_id == db_user.id).first()
    if not acc or acc.connected_status != "connected":
        return {"connected": False, "status": "disconnected"}

    return {
        "connected": True,
        "page_name": acc.page_name,
        "category": acc.category,
        "profile_picture_url": acc.profile_picture_url,
        "page_link": acc.page_link,
        "followers_count": acc.followers_count,
        "is_verified": acc.is_verified,
        "last_synced_at": acc.last_synced_at.strftime("%Y-%m-%d %H:%M UTC") if acc.last_synced_at else ""
    }


@router.post("/disconnect")
def disconnect_facebook(user=Depends(verify_token), db: Session = Depends(get_db)):
    db_user = get_or_create_user_from_token(user, db)

    acc = db.query(FacebookAccount).filter(FacebookAccount.user_id == db_user.id).first()
    if acc:
        db.delete(acc)
        db.commit()

    profile = db.query(CreatorProfile).filter(CreatorProfile.user_id == db_user.id).first()
    if profile:
        s_acc = db.query(SocialAccount).filter(SocialAccount.creator_id == profile.creator_id, SocialAccount.platform == "Facebook").first()
        if s_acc:
            db.delete(s_acc)
            db.commit()

    return {"message": "Facebook Page disconnected successfully."}
