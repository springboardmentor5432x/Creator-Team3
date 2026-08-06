from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from database import get_db
from models import User, TwitchAccount, SocialAccount, CreatorProfile
from Auth import verify_token
from services.twitch_oauth_service import TwitchOAuthService

from routers.user import get_or_create_user_from_token

router = APIRouter(prefix="/api/auth/twitch", tags=["Twitch OAuth"])

class CallbackPayload(BaseModel):
    code: str

@router.get("/connect")
def connect_twitch_oauth(user=Depends(verify_token)):
    return TwitchOAuthService.get_authorize_url()

@router.post("/callback")
def twitch_oauth_callback(payload: CallbackPayload, user=Depends(verify_token), db: Session = Depends(get_db)):
    db_user = get_or_create_user_from_token(user, db)
    return TwitchOAuthService.exchange_code_and_connect(db_user.id, payload.code, db)

@router.get("/status")
def get_twitch_status(user=Depends(verify_token), db: Session = Depends(get_db)):
    db_user = get_or_create_user_from_token(user, db)
    acc = db.query(TwitchAccount).filter(TwitchAccount.user_id == db_user.id).first()
    if not acc or acc.connected_status != "connected":
        return {"connected": False, "status": "disconnected"}

    return {
        "connected": True,
        "username": acc.login,
        "display_name": acc.display_name,
        "profile_image_url": acc.profile_image_url,
        "followers_count": acc.followers_count,
        "last_synced_at": acc.last_synced_at.strftime("%Y-%m-%d %H:%M UTC") if acc.last_synced_at else ""
    }

@router.post("/disconnect")
def disconnect_twitch(user=Depends(verify_token), db: Session = Depends(get_db)):
    db_user = get_or_create_user_from_token(user, db)

    acc = db.query(TwitchAccount).filter(TwitchAccount.user_id == db_user.id).first()
    if acc:
        db.delete(acc)
        db.commit()

    profile = db.query(CreatorProfile).filter(CreatorProfile.user_id == db_user.id).first()
    if profile:
        s_acc = db.query(SocialAccount).filter(SocialAccount.creator_id == profile.creator_id, SocialAccount.platform == "Twitch").first()
        if s_acc:
            db.delete(s_acc)
            db.commit()

    return {"message": "Twitch disconnected successfully."}
