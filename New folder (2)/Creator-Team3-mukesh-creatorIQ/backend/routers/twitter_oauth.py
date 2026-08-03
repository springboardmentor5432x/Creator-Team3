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
