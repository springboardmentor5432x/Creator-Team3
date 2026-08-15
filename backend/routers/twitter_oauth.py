from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from database import get_db
from models import User, TwitterAccount, SocialAccount, CreatorProfile
from Auth import verify_token
from services.twitter_oauth_service import TwitterOAuthService

from routers.user import get_or_create_user_from_token

router = APIRouter(prefix="/api/auth/twitter", tags=["Twitter OAuth"])

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
    
    acc = db.query(TwitterAccount).filter(TwitterAccount.user_id == db_user.id).first()
    if not acc:
        acc = TwitterAccount(user_id=db_user.id)
        db.add(acc)
        
    acc.twitter_user_id = str(seed % 10000000)
    acc.username = clean_handle
    acc.name = clean_handle.title()
    acc.followers_count = followers
    acc.following_count = int(followers * 0.1)
    acc.tweet_count = int(followers * 0.5)
    acc.connected_status = "connected"
    acc.last_synced_at = datetime.utcnow()
    acc.access_token = ""
    acc.refresh_token = ""
    
    profile = db.query(CreatorProfile).filter(CreatorProfile.user_id == db_user.id).first()
    if profile:
        s_acc = db.query(SocialAccount).filter(SocialAccount.creator_id == profile.creator_id, SocialAccount.platform == "Twitter").first()
        if not s_acc:
            s_acc = SocialAccount(creator_id=profile.creator_id, platform="Twitter")
            db.add(s_acc)
        s_acc.account_name = clean_handle
        s_acc.profile_url = f"https://twitter.com/{clean_handle}"
        
    db.commit()
    return {"message": "Simulated Twitter connection", "username": acc.username}

@router.get("/connect")
def connect_twitter_oauth(user=Depends(verify_token)):
    return TwitterOAuthService.get_authorize_url()

@router.post("/callback")
def twitter_oauth_callback(payload: CallbackPayload, user=Depends(verify_token), db: Session = Depends(get_db)):
    db_user = get_or_create_user_from_token(user, db)
    return TwitterOAuthService.exchange_code_and_connect(db_user.id, payload.code, db)

@router.get("/status")
def get_twitter_status(user=Depends(verify_token), db: Session = Depends(get_db)):
    db_user = get_or_create_user_from_token(user, db)
    acc = db.query(TwitterAccount).filter(TwitterAccount.user_id == db_user.id).first()
    if not acc or acc.connected_status != "connected":
        return {"connected": False, "status": "disconnected"}

    return {
        "connected": True,
        "username": acc.username,
        "name": acc.name,
        "profile_image_url": acc.profile_image_url,
        "followers_count": acc.followers_count,
        "last_synced_at": acc.last_synced_at.strftime("%Y-%m-%d %H:%M UTC") if acc.last_synced_at else ""
    }

@router.post("/disconnect")
def disconnect_twitter(user=Depends(verify_token), db: Session = Depends(get_db)):
    db_user = get_or_create_user_from_token(user, db)

    acc = db.query(TwitterAccount).filter(TwitterAccount.user_id == db_user.id).first()
    if acc:
        db.delete(acc)
        db.commit()

    profile = db.query(CreatorProfile).filter(CreatorProfile.user_id == db_user.id).first()
    if profile:
        s_acc = db.query(SocialAccount).filter(SocialAccount.creator_id == profile.creator_id, SocialAccount.platform == "Twitter").first()
        if s_acc:
            db.delete(s_acc)
            db.commit()

    return {"message": "Twitter disconnected successfully."}
