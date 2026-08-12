from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from database import get_db
from models import User, LinkedInAccount, SocialAccount, CreatorProfile
from Auth import verify_token
from services.linkedin_oauth_service import LinkedInOAuthService

from routers.user import get_or_create_user_from_token

router = APIRouter(prefix="/api/auth/linkedin", tags=["LinkedIn OAuth"])

class CallbackPayload(BaseModel):
    code: str

@router.get("/connect")
def connect_linkedin_oauth(user=Depends(verify_token)):
    return LinkedInOAuthService.get_authorize_url()

@router.post("/callback")
def linkedin_oauth_callback(payload: CallbackPayload, user=Depends(verify_token), db: Session = Depends(get_db)):
    db_user = get_or_create_user_from_token(user, db)
    return LinkedInOAuthService.exchange_code_and_connect(db_user.id, payload.code, db)

@router.get("/status")
def get_linkedin_status(user=Depends(verify_token), db: Session = Depends(get_db)):
    db_user = get_or_create_user_from_token(user, db)
    acc = db.query(LinkedInAccount).filter(LinkedInAccount.user_id == db_user.id).first()
    if not acc or acc.connected_status != "connected":
        return {"connected": False, "status": "disconnected"}

    return {
        "connected": True,
        "name": acc.name,
        "email": acc.email,
        "profile_picture_url": acc.profile_picture_url,
        "followers_count": acc.followers_count,
        "last_synced_at": acc.last_synced_at.strftime("%Y-%m-%d %H:%M UTC") if acc.last_synced_at else ""
    }

@router.post("/disconnect")
def disconnect_linkedin(user=Depends(verify_token), db: Session = Depends(get_db)):
    db_user = get_or_create_user_from_token(user, db)

    acc = db.query(LinkedInAccount).filter(LinkedInAccount.user_id == db_user.id).first()
    if acc:
        db.delete(acc)
        db.commit()

    profile = db.query(CreatorProfile).filter(CreatorProfile.user_id == db_user.id).first()
    if profile:
        s_acc = db.query(SocialAccount).filter(SocialAccount.creator_id == profile.creator_id, SocialAccount.platform == "LinkedIn").first()
        if s_acc:
            db.delete(s_acc)
            db.commit()

    return {"message": "LinkedIn disconnected successfully."}
