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
async def connect_twitch_oauth(user=Depends(verify_token)):
    return await TwitchOAuthService.get_authorize_url()

@router.post("/callback")
async def twitch_oauth_callback(payload: CallbackPayload, user=Depends(verify_token), db: Session = Depends(get_db)):
    db_user = get_or_create_user_from_token(user, db)
    return await TwitchOAuthService.exchange_code_and_connect(db_user.id, payload.code, db)

class MockTwitchConnectRequest(BaseModel):
    username: str

@router.post("/mock-connect")
def twitch_mock_connect(payload: MockTwitchConnectRequest, user=Depends(verify_token), db: Session = Depends(get_db)):
    from datetime import datetime
    import requests
    db_user = get_or_create_user_from_token(user, db)
    username = payload.username.strip().replace('@', '')
    
    # Fetch real data from Twitch GQL using public client ID
    headers = {'Client-ID': 'kimne78kx3ncx6brgo4mv6wki5h1ko'}
    query = """
    query {
        user(login: "%s") {
            id
            login
            displayName
            description
            profileImageURL(width: 300)
            followers {
                totalCount
            }
        }
    }
    """ % username
    
    res = requests.post('https://gql.twitch.tv/gql', json={'query': query}, headers=headers)
    if not res.ok:
        raise HTTPException(status_code=400, detail="Failed to fetch Twitch profile")
        
    data = res.json()
    if "data" not in data or data["data"].get("user") is None:
        raise HTTPException(status_code=404, detail="Twitch user not found")
        
    user_data = data["data"]["user"]
    followers = user_data.get("followers", {}).get("totalCount", 0)
    display_name = user_data.get("displayName", username)
    profile_image_url = user_data.get("profileImageURL", "")
    twitch_user_id = user_data.get("id", f"gql_{username}")

    # 1. Update or create TwitchAccount
    account = db.query(TwitchAccount).filter(TwitchAccount.user_id == db_user.id).first()
    if not account:
        account = TwitchAccount(user_id=db_user.id, twitch_user_id=twitch_user_id, login=username)
        db.add(account)
    
    account.login = username
    account.display_name = display_name
    account.profile_image_url = profile_image_url
    account.followers_count = followers
    account.connected_status = "connected"
    account.last_synced_at = datetime.utcnow()
    db.commit()

    # 2. Update SocialAccount
    profile = db.query(CreatorProfile).filter(CreatorProfile.user_id == db_user.id).first()
    if not profile:
        profile = CreatorProfile(user_id=db_user.id, platform="Twitch")
        db.add(profile)
        db.commit()
        db.refresh(profile)

    s_acc = db.query(SocialAccount).filter(SocialAccount.creator_id == profile.creator_id, SocialAccount.platform == "Twitch").first()
    if not s_acc:
        s_acc = SocialAccount(creator_id=profile.creator_id, platform="Twitch", account_name=username, followers=followers)
        db.add(s_acc)
    else:
        s_acc.account_name = username
        s_acc.followers = followers
    db.commit()

    return {"status": "connected", "username": username}

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
