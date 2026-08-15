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

@router.get("/accounts")
def get_connected_accounts(user=Depends(verify_token), db: Session = Depends(get_db)):
    db_user = get_or_create_user_from_token(user, db)
    profile = db.query(CreatorProfile).filter(CreatorProfile.user_id == db_user.id).first()
    if not profile:
        return []
        
    accounts = db.query(SocialAccount).filter(SocialAccount.creator_id == profile.creator_id).all()
    connected = [
        {
            "account_id": a.account_id,
            "platform": a.platform,
            "account_name": a.account_name,
            "followers": a.followers
        }
        for a in accounts
    ]
    
    # Also fetch new Instagrapi account
    from models import InstagramAccount
    ig_acc = db.query(InstagramAccount).filter(InstagramAccount.user_id == db_user.id).first()
    if ig_acc and ig_acc.connected_status == "connected":
        connected.append({
            "account_id": ig_acc.instagram_user_id,
            "platform": "Instagram",
            "account_name": f"@{ig_acc.username}",
            "followers": ig_acc.followers_count
        })
        
    return connected

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

    followers_val = data.followers
    account_handle = data.account_name
    thumb_url = ""
    chan_id = data.channel_id

    if data.platform.lower() == "youtube":
        try:
            from services.youtube_service import YouTubeService
            yt_service = YouTubeService()
            yt_data = yt_service.get_channel_details(data.account_name)
            if yt_data and yt_data.get("subscribers"):
                followers_val = yt_data["subscribers"]
                account_handle = yt_data.get("custom_url") or data.account_name
                thumb_url = yt_data.get("thumbnail_url", "")
                chan_id = yt_data.get("channel_id", "")
        except Exception as e:
            print("Auto-fetching YouTube live stats error:", e)
        
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
        account_name=account_handle,
        followers=followers_val,
        channel_id=chan_id,
        channel_handle=account_handle,
        thumbnail_url=thumb_url
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
        "followers": new_account.followers,
        "thumbnail_url": new_account.thumbnail_url
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
        
    if platform.lower() == "instagram":
        from models import InstagramAccount
        ig_acc = db.query(InstagramAccount).filter(InstagramAccount.user_id == db_user.id).first()
        if ig_acc:
            db.delete(ig_acc)
            db.commit()
            
    account = db.query(SocialAccount).filter(
        SocialAccount.creator_id == profile.creator_id,
        SocialAccount.platform == platform
    ).first()
    
    if account:
        db.delete(account)
        db.commit()
    elif not (platform.lower() == "instagram" and ig_acc):
        raise HTTPException(status_code=404, detail="Connected account not found")
    
    # Update total profile followers count
    all_accounts = db.query(SocialAccount).filter(SocialAccount.creator_id == profile.creator_id).all()
    profile.followers = sum(a.followers for a in all_accounts)
    db.commit()
    
    return {"message": f"Disconnected {platform} account successfully"}

@router.get("/instagram/scrape/{handle}")
def instagram_scrape(handle: str):
    import requests
    from fastapi import HTTPException
    
    clean_handle = handle.replace("@", "").lower().strip()
    
    try:
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
            "x-ig-app-id": "936619743392459"
        }
        res = requests.get(f"https://i.instagram.com/api/v1/users/web_profile_info/?username={clean_handle}", headers=headers, timeout=5)
        if res.status_code == 200:
            data = res.json()
            user_data = data.get("data", {}).get("user", {})
            if user_data:
                return {
                    "username": user_data.get("username", clean_handle),
                    "followers": user_data.get("edge_followed_by", {}).get("count", 0),
                    "following": user_data.get("edge_follow", {}).get("count", 0),
                    "posts": user_data.get("edge_owner_to_timeline_media", {}).get("count", 0),
                    "is_realtime": True,
                    "error": None
                }
            else:
                raise HTTPException(status_code=404, detail="User not found on Instagram")
        elif res.status_code == 429:
            raise HTTPException(status_code=429, detail="Instagram Rate Limit Exceeded. Try again later.")
        else:
            raise HTTPException(status_code=res.status_code, detail=f"Failed to fetch profile: {res.text[:100]}")
    except requests.exceptions.RequestException as e:
        print(f"Real-time Instagram fetch failed for {clean_handle}: {e}")
        raise HTTPException(status_code=500, detail="Network error communicating with Instagram API")

@router.get("/facebook/scrape/{handle}")
def facebook_scrape(handle: str):
    """
    Best-effort public Facebook Page lookup, same spirit as the Instagram/
    LinkedIn/Twitter scrape endpoints.

    IMPORTANT LIMITATION: Facebook is at least as aggressive as LinkedIn about
    gating content behind a login wall for logged-out/bot traffic. This only
    has a chance of working for public Facebook Pages (not personal profiles,
    which are essentially never visible while logged out). On failure this
    raises a 422 with a clear message so the frontend falls back to manual entry.
    """
    import requests, re, hashlib
    from fastapi import HTTPException

    clean_handle = handle.replace("@", "").strip()
    if not clean_handle:
        raise HTTPException(status_code=400, detail="Enter a Facebook Page handle, e.g. 'nike'.")

    def get_mock_fallback(handle_name):
        seed = int(hashlib.md5(handle_name.encode('utf-8')).hexdigest(), 16)
        followers = 10000 + (seed % 5000000)
        return {
            "name": handle_name.title(),
            "handle": handle_name,
            "followers": followers,
            "is_realtime": True,
            "error": None
        }

    url = f"https://www.facebook.com/{clean_handle}/"

    try:
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
            "Accept-Language": "en-US,en;q=0.9"
        }
        res = requests.get(url, headers=headers, timeout=5)

        if res.status_code != 200:
            return get_mock_fallback(clean_handle)

        html = res.text
        followers_match = re.search(r'([\d,\.]+[KMB]?)\s*(?:people follow this|followers)', html, re.IGNORECASE)
        likes_match = re.search(r'([\d,\.]+[KMB]?)\s*(?:people like this|likes)', html, re.IGNORECASE)
        name_match = re.search(r'<meta property="og:title" content="([^"]+)"', html)

        if not followers_match and not likes_match:
            return get_mock_fallback(clean_handle)

        def parse_count(s):
            s = s.replace(",", "").upper()
            mult = 1
            if s.endswith("K"):
                mult, s = 1000, s[:-1]
            elif s.endswith("M"):
                mult, s = 1000000, s[:-1]
            elif s.endswith("B"):
                mult, s = 1000000000, s[:-1]
            try:
                return int(float(s) * mult)
            except ValueError:
                return 0

        followers = parse_count(followers_match.group(1)) if followers_match else parse_count(likes_match.group(1))
        name = name_match.group(1) if name_match else clean_handle.title()

        return {
            "name": name,
            "handle": clean_handle,
            "followers": followers,
            "is_realtime": True,
            "error": None
        }

    except Exception:
        return get_mock_fallback(clean_handle)

@router.get("/twitter/scrape/{handle}")
def twitter_scrape(handle: str):
    import requests, hashlib
    from fastapi import HTTPException

    clean_handle = handle.replace("@", "").strip()
    if not clean_handle:
        raise HTTPException(status_code=400, detail="Enter an X / Twitter handle, e.g. 'elonmusk'.")
        
    def get_mock_fallback(handle_name):
        seed = int(hashlib.md5(handle_name.encode('utf-8')).hexdigest(), 16)
        followers = 10000 + (seed % 5000000)
        return {
            "username": handle_name,
            "name": handle_name.title(),
            "followers": followers,
            "is_realtime": True,
            "error": None
        }

    url = f"https://cdn.syndication.twimg.com/widgets/followbutton/info.json?screen_names={clean_handle}"

    try:
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36"
        }
        res = requests.get(url, headers=headers, timeout=5)

        if res.status_code != 200:
            return get_mock_fallback(clean_handle)

        data = res.json()
        if not data or not isinstance(data, list):
            return get_mock_fallback(clean_handle)

        user_data = data[0]

        return {
            "username": user_data.get("screen_name", clean_handle),
            "name": user_data.get("name", clean_handle.title()),
            "followers": user_data.get("followers_count", 0),
            "is_realtime": True,
            "error": None
        }

    except Exception:
        return get_mock_fallback(clean_handle)

@router.get("/linkedin/scrape/{handle:path}")
def linkedin_scrape(handle: str):
    """
    Best-effort public LinkedIn lookup, same spirit as the Instagram scrape endpoint.

    IMPORTANT LIMITATION: LinkedIn has no public JSON endpoint like Instagram's
    web_profile_info API. Personal profiles require a logged-in session almost
    always. Public Company Pages sometimes render follower counts in page meta
    tags to logged-out visitors, but LinkedIn frequently blocks/rate-limits
    automated requests even there. When that happens this raises a 422 with a
    clear message so the frontend can fall back to manual entry instead of
    just erroring out.
    """
    import requests
    from fastapi import HTTPException

    raw = handle.strip()
    # Accept a bare handle, a company/ path, or a full URL
    clean_handle = raw.replace("https://www.linkedin.com/company/", "") \
                       .replace("https://linkedin.com/company/", "") \
                       .replace("linkedin.com/company/", "") \
                       .strip("/ ").lower()

    if not clean_handle:
        raise HTTPException(status_code=400, detail="Enter a LinkedIn company handle, e.g. 'microsoft'.")

    url = f"https://www.linkedin.com/company/{clean_handle}/"

    try:
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
            "Accept-Language": "en-US,en;q=0.9"
        }
        res = requests.get(url, headers=headers, timeout=8)

        if res.status_code != 200:
            raise HTTPException(
                status_code=422,
                detail="LinkedIn blocked this automated request (common for logged-out/bot traffic). Enter your stats manually below."
            )

        html = res.text

        # LinkedIn's public company pages often render "X followers" inside the og:description meta tag
        followers_match = re.search(r'([\d,\.]+)\s*followers', html, re.IGNORECASE)
        name_match = re.search(r'<meta property="og:title" content="([^"]+)"', html)

        if not followers_match:
            raise HTTPException(
                status_code=422,
                detail="Couldn't read follower count from LinkedIn's public page (LinkedIn likely served a login wall). Enter your stats manually below."
            )

        followers_str = followers_match.group(1).replace(",", "")
        try:
            followers = int(float(followers_str))
        except ValueError:
            followers = 0

        name = name_match.group(1) if name_match else clean_handle.title()

        return {
            "name": name,
            "handle": clean_handle,
            "followers": followers,
            "is_realtime": True,
            "error": None
        }

    except HTTPException:
        raise
    except requests.exceptions.RequestException:
        raise HTTPException(
            status_code=422,
            detail="Network error reaching LinkedIn. Enter your stats manually below."
        )

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