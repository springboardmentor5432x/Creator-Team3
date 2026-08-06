import os
import requests
from typing import Dict, Any, Optional
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from models import TwitchAccount, TwitchSnapshot, CreatorProfile, SocialAccount

class TwitchOAuthService:
    TWITCH_AUTH_URL = "https://id.twitch.tv/oauth2/authorize"
    TWITCH_TOKEN_URL = "https://id.twitch.tv/oauth2/token"
    TWITCH_HELIX_URL = "https://api.twitch.tv/helix"

    @classmethod
    def check_config(cls) -> Dict[str, Any]:
        client_id = os.getenv("TWITCH_CLIENT_ID", "").strip()
        client_secret = os.getenv("TWITCH_CLIENT_SECRET", "").strip()
        redirect_uri = os.getenv("TWITCH_REDIRECT_URI", "").strip()
        configured = bool(client_id and client_secret and redirect_uri and not client_id.startswith("twitch_"))
        return {
            "configured": configured,
            "client_id": client_id if configured else "Not Configured",
            "redirect_uri": redirect_uri or "Not Configured",
            "message": "Twitch Developer App configured" if configured else "Twitch Developer application is not configured in backend/.env."
        }

    @classmethod
    def get_authorize_url(cls, state: str = "creatoriq_twitch_state") -> Dict[str, Any]:
        cfg = cls.check_config()
        if not cfg["configured"]:
            return {"configured": False, "error": cfg["message"]}

        client_id = os.getenv("TWITCH_CLIENT_ID")
        redirect_uri = os.getenv("TWITCH_REDIRECT_URI")
        scopes = "user:read:email%20channel:read:subscriptions"
        url = f"{cls.TWITCH_AUTH_URL}?client_id={client_id}&redirect_uri={redirect_uri}&response_type=code&scope={scopes}&state={state}"
        return {"configured": True, "authorization_url": url}

    @classmethod
    def exchange_code_and_connect(cls, user_id: int, code: str, db: Session) -> Dict[str, Any]:
        cfg = cls.check_config()
        if not cfg["configured"]:
            return {"status": "developer_app_not_configured", "error": cfg["message"]}

        if not code or code.startswith("oauth_code_"):
            return {
                "status": "error",
                "error": "Real Twitch OAuth authorization code required. Please log in via Twitch OAuth."
            }

        client_id = os.getenv("TWITCH_CLIENT_ID")
        client_secret = os.getenv("TWITCH_CLIENT_SECRET")
        redirect_uri = os.getenv("TWITCH_REDIRECT_URI")

        try:
            payload = {
                "client_id": client_id,
                "client_secret": client_secret,
                "code": code,
                "grant_type": "authorization_code",
                "redirect_uri": redirect_uri
            }
            res = requests.post(cls.TWITCH_TOKEN_URL, data=payload, timeout=10)
            token_data = res.json()
            access_token = token_data.get("access_token")

            if not access_token:
                return {
                    "status": "error",
                    "error": token_data.get("message", "Failed to exchange Twitch OAuth authorization code.")
                }

            headers = {
                "Client-ID": client_id,
                "Authorization": f"Bearer {access_token}"
            }
            user_res = requests.get(f"{cls.TWITCH_HELIX_URL}/users", headers=headers, timeout=10).json()
            user_list = user_res.get("data", [])

            if not user_list:
                return {"status": "error", "error": "Failed to fetch channel details from Twitch Helix API."}

            u_data = user_list[0]
            return cls._save_twitch_account(user_id, u_data, access_token, token_data.get("refresh_token", ""), db)

        except Exception as e:
            return {"status": "error", "error": f"Twitch Helix API connection failed: {str(e)}"}

    @classmethod
    def _save_twitch_account(cls, user_id: int, data: Dict[str, Any], token: str, refresh_token: str, db: Session) -> Dict[str, Any]:
        tw_id = str(data.get("id"))

        account = db.query(TwitchAccount).filter(TwitchAccount.user_id == user_id).first()
        if not account:
            account = TwitchAccount(user_id=user_id, twitch_user_id=tw_id, login=data.get("login", "twitch_creator"))
            db.add(account)
            db.commit()
            db.refresh(account)

        account.login = data.get("login", account.login)
        account.display_name = data.get("display_name", account.display_name)
        account.profile_image_url = data.get("profile_image_url", account.profile_image_url)
        account.broadcaster_type = data.get("broadcaster_type", account.broadcaster_type)
        account.view_count = data.get("view_count", 0)
        account.access_token = token
        account.refresh_token = refresh_token
        account.connected_status = "connected"
        account.last_synced_at = datetime.utcnow()
        db.commit()

        # Update SocialAccount
        profile = db.query(CreatorProfile).filter(CreatorProfile.user_id == user_id).first()
        if profile:
            s_acc = db.query(SocialAccount).filter(SocialAccount.creator_id == profile.creator_id, SocialAccount.platform == "Twitch").first()
            if not s_acc:
                s_acc = SocialAccount(creator_id=profile.creator_id, platform="Twitch", account_name=account.login, followers=account.followers_count)
                db.add(s_acc)
            else:
                s_acc.account_name = account.login
                s_acc.followers = account.followers_count
            db.commit()

        return {
            "status": "connected",
            "platform": "Twitch",
            "username": account.login,
            "followers_count": account.followers_count,
            "last_synced_at": account.last_synced_at.strftime("%Y-%m-%d %H:%M UTC")
        }
