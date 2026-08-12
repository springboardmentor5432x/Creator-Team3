from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from database import get_db
from models import User, InstagramAccount, SocialAccount, CreatorProfile
from Auth import verify_token
from services.instagram_oauth_service import InstagramOAuthService

from routers.user import get_or_create_user_from_token

router = APIRouter(prefix="/api/auth/instagram", tags=["Instagram OAuth"])

class CallbackPayload(BaseModel):
    code: str

@router.get("/connect")
def connect_instagram_oauth(user=Depends(verify_token)):
    return InstagramOAuthService.get_authorize_url()

@router.post("/callback")
def instagram_oauth_callback(payload: CallbackPayload, user=Depends(verify_token), db: Session = Depends(get_db)):
    db_user = get_or_create_user_from_token(user, db)
    return InstagramOAuthService.exchange_code_and_connect(db_user.id, payload.code, db)

@router.get("/status")
def get_instagram_status(user=Depends(verify_token), db: Session = Depends(get_db)):
    db_user = get_or_create_user_from_token(user, db)
    acc = db.query(InstagramAccount).filter(InstagramAccount.user_id == db_user.id).first()
    if not acc or acc.connected_status != "connected":
        return {"connected": False, "status": "disconnected"}

    return {
        "connected": True,
        "username": acc.username,
        "name": acc.name,
        "profile_picture_url": acc.profile_picture_url,
        "followers_count": acc.followers_count,
        "last_synced_at": acc.last_synced_at.strftime("%Y-%m-%d %H:%M UTC") if acc.last_synced_at else ""
    }

@router.post("/disconnect")
def disconnect_instagram(user=Depends(verify_token), db: Session = Depends(get_db)):
    db_user = get_or_create_user_from_token(user, db)

    acc = db.query(InstagramAccount).filter(InstagramAccount.user_id == db_user.id).first()
    if acc:
        db.delete(acc)
        db.commit()

    profile = db.query(CreatorProfile).filter(CreatorProfile.user_id == db_user.id).first()
    if profile:
        s_acc = db.query(SocialAccount).filter(SocialAccount.creator_id == profile.creator_id, SocialAccount.platform == "Instagram").first()
        if s_acc:
            db.delete(s_acc)
            db.commit()

    return {"message": "Instagram disconnected successfully."}
