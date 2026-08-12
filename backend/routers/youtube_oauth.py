from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from database import get_db
from Auth import verify_token, get_current_user
from models import CreatorProfile, SocialAccount

router = APIRouter(prefix="/api/auth/youtube", tags=["YouTube OAuth"])

@router.post("/mock-connect")
def mock_connect_youtube(request: Request, db_user=Depends(get_current_user), db: Session = Depends(get_db)):
    profile = db.query(CreatorProfile).filter(CreatorProfile.user_id == db_user.id).first()
    
    if not profile:
        profile = CreatorProfile(user_id=db_user.id, creator_id=f"CR-{db_user.id}")
        db.add(profile)
        db.commit()

    # Create or update SocialAccount for YouTube
    acc = db.query(SocialAccount).filter(SocialAccount.creator_id == profile.creator_id, SocialAccount.platform == "YouTube").first()
    
    # We will use MKBHD as a highly active channel to act as the connected account for this mock
    if not acc:
        acc = SocialAccount(
            creator_id=profile.creator_id,
            platform="YouTube",
            account_name="mkbhd",
            followers=19800000,
            thumbnail_url="https://yt3.ggpht.com/lkH37D712tiyphnu0Id0D5MwwQ7IRuwgQLVD05iXlDNC1I68hOmH8n7vQ4-f3JgD1wXn1y6k",
            profile_url="https://youtube.com/@mkbhd",
            connected_status="connected",
            oauth_token="mock_youtube_token"
        )
        db.add(acc)
    else:
        acc.account_name = "mkbhd"
        acc.connected_status = "connected"
        acc.oauth_token = "mock_youtube_token"
        
    db.commit()
    
    return {"status": "success", "channel_name": acc.account_name, "message": "Successfully authenticated via mock Google OAuth."}
