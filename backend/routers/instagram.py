from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional

from database import get_db
from models import User
from Auth import verify_token
from services.instagram_service import InstagramService
from services.instagram_repository import InstagramRepository
from services.instagram_analytics_service import InstagramAnalyticsService
from services.instagram_sync_service import InstagramSyncService

router = APIRouter(prefix="/api/instagram", tags=["Instagram Private API"])

class ConnectInstagramRequest(BaseModel):
    username: str
    password: str

@router.get("/profile")
def get_instagram_profile(user=Depends(verify_token), db: Session = Depends(get_db)):
    email = user.get("Email")
    db_user = db.query(User).filter(User.Email == email).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    return InstagramAnalyticsService.get_live_profile_and_analytics(db_user.id, db)

@router.get("/analytics")
def get_instagram_analytics(user=Depends(verify_token), db: Session = Depends(get_db)):
    email = user.get("Email")
    db_user = db.query(User).filter(User.Email == email).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    return InstagramAnalyticsService.get_live_profile_and_analytics(db_user.id, db)

@router.get("/media")
def get_instagram_media(sort_by: str = Query("newest"), user=Depends(verify_token), db: Session = Depends(get_db)):
    email = user.get("Email")
    db_user = db.query(User).filter(User.Email == email).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    return InstagramAnalyticsService.get_sorted_media(db_user.id, sort_by, db)

@router.get("/growth")
def get_instagram_growth(days: int = Query(30), user=Depends(verify_token), db: Session = Depends(get_db)):
    email = user.get("Email")
    db_user = db.query(User).filter(User.Email == email).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    return InstagramAnalyticsService.get_growth_analytics(db_user.id, days, db)

@router.get("/revenue-estimate")
def get_instagram_revenue_estimate(user=Depends(verify_token), db: Session = Depends(get_db)):
    email = user.get("Email")
    db_user = db.query(User).filter(User.Email == email).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    data = InstagramAnalyticsService.get_live_profile_and_analytics(db_user.id, db)
    return data.get("revenue_estimate", {"is_estimated": True, "estimatedMonthlyRevenue": 0.0})

@router.get("/predictions")
def get_instagram_predictions(user=Depends(verify_token), db: Session = Depends(get_db)):
    email = user.get("Email")
    db_user = db.query(User).filter(User.Email == email).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    return InstagramAnalyticsService.get_predictions(db_user.id, db)

@router.post("/connect")
def connect_instagram(payload: ConnectInstagramRequest, user=Depends(verify_token), db: Session = Depends(get_db)):
    email = user.get("Email")
    db_user = db.query(User).filter(User.Email == email).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    # Login via Instagrapi
    login_result = InstagramService.login(payload.username, payload.password)
    
    if "error" in login_result:
        raise HTTPException(status_code=401, detail=f"Instagram Login Failed: {login_result['error']}")

    account_info = login_result["user_info"]
    session_data = login_result["session_data"]

    account = InstagramRepository.save_or_update_account(
        db_user.id,
        account_info,
        access_token=str(session_data), # Storing the session dump dict string
        expires_in=31536000, # 1 year approx
        db=db
    )

    # Register SocialAccount for Active Social Connections list
    from models import CreatorProfile, SocialAccount
    profile = db.query(CreatorProfile).filter(CreatorProfile.user_id == db_user.id).first()
    if not profile:
        profile = CreatorProfile(user_id=db_user.id, platform="Instagram", followers=account.followers_count)
        db.add(profile)
        db.commit()
        db.refresh(profile)

    existing_sa = db.query(SocialAccount).filter(
        SocialAccount.creator_id == profile.creator_id,
        SocialAccount.platform == "Instagram"
    ).first()
    if existing_sa:
        existing_sa.account_name = f"@{account.username}"
        existing_sa.followers = account.followers_count
    else:
        new_sa = SocialAccount(
            creator_id=profile.creator_id,
            platform="Instagram",
            account_name=f"@{account.username}",
            followers=account.followers_count
        )
        db.add(new_sa)
    db.commit()

    # Perform initial sync
    InstagramSyncService.sync_instagram_account(db_user.id, db)

    return {
        "status": "connected",
        "message": "Instagram account connected successfully via Instagrapi",
        "username": account.username,
        "followers_count": account.followers_count
    }

@router.post("/disconnect")
def disconnect_instagram(user=Depends(verify_token), db: Session = Depends(get_db)):
    email = user.get("Email")
    db_user = db.query(User).filter(User.Email == email).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    success = InstagramRepository.disconnect_account(db_user.id, db)

    from models import CreatorProfile, SocialAccount
    profile = db.query(CreatorProfile).filter(CreatorProfile.user_id == db_user.id).first()
    if profile:
        sa = db.query(SocialAccount).filter(
            SocialAccount.creator_id == profile.creator_id,
            SocialAccount.platform == "Instagram"
        ).first()
        if sa:
            db.delete(sa)
            db.commit()

    return {"message": "Disconnected Instagram account successfully"}

@router.post("/sync")
def sync_instagram_data(user=Depends(verify_token), db: Session = Depends(get_db)):
    email = user.get("Email")
    db_user = db.query(User).filter(User.Email == email).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    return InstagramSyncService.sync_instagram_account(db_user.id, db)

@router.get("/sync-status")
def get_sync_status(user=Depends(verify_token), db: Session = Depends(get_db)):
    email = user.get("Email")
    db_user = db.query(User).filter(User.Email == email).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    account = InstagramRepository.get_account_by_user_id(db_user.id, db)
    if not account:
        return {"connected": False, "status": "disconnected"}

    return {
        "connected": True,
        "status": account.connected_status,
        "username": account.username,
        "last_synced_at": account.last_synced_at.strftime("%Y-%m-%d %H:%M UTC") if account.last_synced_at else "Never",
        "token_expires_at": account.token_expires_at.strftime("%Y-%m-%d") if account.token_expires_at else "Never"
    }
