from services.youtube_service import YouTubeService
from fastapi import APIRouter, Depends, Request, HTTPException
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session
from googleapiclient.discovery import build
from dotenv import load_dotenv
import requests
import re
import os
from urllib.parse import urlencode
from pydantic import BaseModel

from database import get_db
from models import User, CreatorProfile, SocialAccount
from Auth import verify_token

from routers.user import get_or_create_user_from_token

load_dotenv()

router = APIRouter(prefix="/api/social", tags=["Social Platforms"])

CLIENT_ID = os.getenv("LINKEDIN_CLIENT_ID")
CLIENT_SECRET = os.getenv("LINKEDIN_CLIENT_SECRET")
REDIRECT_URI = os.getenv("LINKEDIN_REDIRECT_URI")
YOUTUBE_API_KEY = os.getenv("YOUTUBE_API_KEY")
print("YOUTUBE_API_KEY =", YOUTUBE_API_KEY)

class SocialConnectRequest(BaseModel):
    platform: str
    account_name: str
    followers: int = 0

    channel_id: str = ""
    channel_handle: str = ""
    thumbnail_url: str = ""

@router.get("/accounts")
def get_connected_accounts(user=Depends(verify_token), db: Session = Depends(get_db)):
    db_user = get_or_create_user_from_token(user, db)
    profile = db.query(CreatorProfile).filter(CreatorProfile.user_id == db_user.id).first()
    if not profile:
        return []
        
    accounts = db.query(SocialAccount).filter(SocialAccount.creator_id == profile.creator_id).all()
    return [
        {
            "account_id": a.account_id,
            "platform": a.platform,
            "account_name": a.account_name,
            "followers": a.followers
        }
        for a in accounts
    ]

@router.post("/connect")
def connect_social_account(data: SocialConnectRequest, user=Depends(verify_token), db: Session = Depends(get_db)):
    db_user = get_or_create_user_from_token(user, db)
        
    # Get or create creator profile
    profile = db.query(CreatorProfile).filter(CreatorProfile.user_id == db_user.id).first()
    if not profile:
        profile = CreatorProfile(user_id=db_user.id, platform=data.platform, followers=data.followers)
        db.add(profile)
        db.commit()
        db.refresh(profile)
        
    # Delete existing connection for same platform to avoid duplicates
    existing = db.query(SocialAccount).filter(
        SocialAccount.creator_id == profile.creator_id,
        SocialAccount.platform == data.platform
    ).first()
    if existing:
        db.delete(existing)
        
    new_account = SocialAccount(
        creator_id=profile.creator_id,
        platform=data.platform,
        account_name=data.account_name,
        followers=data.followers,
        channel_id=data.channel_id
)
    db.add(new_account)
    db.commit()
    db.refresh(new_account)
    
    # Sync profile followers count as total
    all_accounts = db.query(SocialAccount).filter(SocialAccount.creator_id == profile.creator_id).all()
    profile.followers = sum(a.followers for a in all_accounts)
    db.commit()
    
    return {
        "status": "connected",
        "platform": new_account.platform,
        "account_name": new_account.account_name,
        "followers": new_account.followers
    }

@router.delete("/accounts/{platform}")
def disconnect_social_account(platform: str, user=Depends(verify_token), db: Session = Depends(get_db)):
    email = user.get("Email")
    db_user = db.query(User).filter(User.Email == email).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
        
    profile = db.query(CreatorProfile).filter(CreatorProfile.user_id == db_user.id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Creator profile not configured")
        
    account = db.query(SocialAccount).filter(
        SocialAccount.creator_id == profile.creator_id,
        SocialAccount.platform == platform
    ).first()
    if not account:
        raise HTTPException(status_code=404, detail="Connected account not found")
        
    db.delete(account)
    db.commit()
    
    # Update total profile followers count
    all_accounts = db.query(SocialAccount).filter(SocialAccount.creator_id == profile.creator_id).all()
    profile.followers = sum(a.followers for a in all_accounts)
    db.commit()
    
    return {"message": f"Disconnected {platform} account successfully"}

@router.get("/youtube/{channel_input:path}")
def youtube_channel(channel_input: str):

    if not YOUTUBE_API_KEY:
        raise HTTPException(
            status_code=500,
            detail="YouTube API key not configured."
        )

    try:
        youtube = build(
            "youtube",
            "v3",
            developerKey=YOUTUBE_API_KEY
        )

        channel_id = None

        # ----------------------------
        # Case 1 : Channel ID (UC...)
        # ----------------------------
        if channel_input.startswith("UC"):
            channel_id = channel_input

        # ----------------------------
        # Case 2 : Full URL
        # ----------------------------
        elif "youtube.com" in channel_input:

            m = re.search(r'@([^/?]+)', channel_input)

            if m:
                handle = m.group(1)

                search = youtube.search().list(
                    part="snippet",
                    q=handle,
                    type="channel",
                    maxResults=1
                ).execute()

                if search["items"]:
                    channel_id = search["items"][0]["snippet"]["channelId"]

        # ----------------------------
        # Case 3 : @handle
        # ----------------------------
        elif channel_input.startswith("@"):

            handle = channel_input[1:]

            search = youtube.search().list(
                part="snippet",
                q=handle,
                type="channel",
                maxResults=1
            ).execute()

            if search["items"]:
                channel_id = search["items"][0]["snippet"]["channelId"]

        # ----------------------------
        # Case 4 : Plain name
        # ----------------------------
        else:

            search = youtube.search().list(
                part="snippet",
                q=channel_input,
                type="channel",
                maxResults=1
            ).execute()

            if search["items"]:
                channel_id = search["items"][0]["snippet"]["channelId"]

        if not channel_id:
            raise HTTPException(
                status_code=404,
                detail="Channel not found."
            )

        response = youtube.channels().list(
            part="snippet,statistics",
            id=channel_id
        ).execute()

        if not response["items"]:
            raise HTTPException(
                status_code=404,
                detail="Channel not found."
            )

        channel = response["items"][0]

        return {
            "channel_id": channel["id"],
            "channel_name": channel["snippet"]["title"],
            "description": channel["snippet"]["description"],
            "country": channel["snippet"].get("country"),
            "subscribers": int(channel["statistics"]["subscriberCount"]),
            "views": int(channel["statistics"]["viewCount"]),
            "videos": int(channel["statistics"]["videoCount"])
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )
@router.get("/youtube-dashboard")
def youtube_dashboard(
    user=Depends(verify_token),
    db: Session = Depends(get_db)
):
    db_user = get_or_create_user_from_token(user, db)

    profile = (
        db.query(CreatorProfile)
        .filter(CreatorProfile.user_id == db_user.id)
        .first()
    )

    if not profile:
        raise HTTPException(status_code=404, detail="Creator profile not found")

    account = (
        db.query(SocialAccount)
        .filter(
            SocialAccount.creator_id == profile.creator_id,
            SocialAccount.platform == "YouTube"
        )
        .first()
    )

    if not account:
        return {
            "connected": False
        }

    youtube = YouTubeService()

    identifier = account.channel_id if account.channel_id else account.account_name

    print("Account Name:", account.account_name)
    print("Channel ID:", account.channel_id)
    print("Identifier:", identifier)

    try:
        result = youtube.get_channel_details(identifier)
        print(result)
        return result
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))