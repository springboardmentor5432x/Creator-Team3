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
