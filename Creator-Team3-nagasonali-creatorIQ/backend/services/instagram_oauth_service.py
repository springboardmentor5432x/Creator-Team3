import os
import requests
from typing import Dict, Any, Optional
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from models import InstagramAccount, InstagramSnapshot, CreatorProfile, SocialAccount

class InstagramOAuthService:
    META_GRAPH_URL = "https://graph.facebook.com/v19.0"

    @classmethod
    def check_config(cls) -> Dict[str, Any]:
        app_id = os.getenv("META_APP_ID", "").strip()
        app_secret = os.getenv("META_APP_SECRET", "").strip()
        redirect_uri = os.getenv("META_REDIRECT_URI", "").strip()
        configured = bool(app_id and app_secret and redirect_uri and not app_id.startswith("meta_"))
        return {
            "configured": configured,
            "app_id": app_id if configured else "Not Configured",
            "redirect_uri": redirect_uri or "Not Configured",
            "message": "Meta Developer App configured" if configured else "Meta Developer App credentials (META_APP_ID, META_APP_SECRET) are missing from backend/.env."
        }

    @classmethod
    def get_authorize_url(cls, state: str = "creatoriq_ig_state") -> Dict[str, Any]:
        cfg = cls.check_config()
        if not cfg["configured"]:
            return {"configured": False, "error": cfg["message"]}

        client_id = os.getenv("META_APP_ID")
        redirect_uri = os.getenv("META_REDIRECT_URI")
        scopes = "instagram_basic,instagram_manage_insights,pages_show_list,pages_read_engagement,business_management"
        url = f"https://www.facebook.com/v19.0/dialog/oauth?client_id={client_id}&redirect_uri={redirect_uri}&scope={scopes}&response_type=code&state={state}"
        return {"configured": True, "authorization_url": url}

    @classmethod
    def exchange_code_and_connect(cls, user_id: int, code: str, db: Session) -> Dict[str, Any]:
        cfg = cls.check_config()
        if not cfg["configured"]:
            return {"status": "developer_app_not_configured", "error": cfg["message"]}

        if not code or code.startswith("oauth_code_"):
            return {
                "status": "error",
                "error": "Real Meta OAuth authorization code required. Please log in via Facebook Login for Business."
            }

        client_id = os.getenv("META_APP_ID")
        client_secret = os.getenv("META_APP_SECRET")
        redirect_uri = os.getenv("META_REDIRECT_URI")

        try:
            # 1. Exchange short-lived token
            token_url = f"{cls.META_GRAPH_URL}/oauth/access_token"
            params = {
                "client_id": client_id,
                "client_secret": client_secret,
                "redirect_uri": redirect_uri,
                "code": code
            }
            res = requests.get(token_url, params=params, timeout=10)
            token_data = res.json()

            short_token = token_data.get("access_token")
            if not short_token:
                return {
                    "status": "error",
                    "error": token_data.get("error", {}).get("message", "Failed to exchange Meta OAuth authorization code.")
                }

            # 2. Exchange for long-lived token
            long_url = f"{cls.META_GRAPH_URL}/oauth/access_token"
            long_params = {
                "grant_type": "fb_exchange_token",
                "client_id": client_id,
                "client_secret": client_secret,
                "fb_exchange_token": short_token
            }
            long_res = requests.get(long_url, params=long_params, timeout=10).json()
            long_token = long_res.get("access_token", short_token)

            # 3. Query Facebook Pages -> Instagram Business Account ID
            me_url = f"{cls.META_GRAPH_URL}/me/accounts"
            me_res = requests.get(me_url, params={"access_token": long_token}, timeout=10).json()

            pages = me_res.get("data", [])
            ig_account_id = None
            fb_page_id = None

            for page in pages:
                p_id = page.get("id")
                page_info = requests.get(
                    f"{cls.META_GRAPH_URL}/{p_id}",
                    params={"fields": "instagram_business_account", "access_token": long_token},
                    timeout=10
                ).json()
                if "instagram_business_account" in page_info:
                    ig_account_id = page_info["instagram_business_account"].get("id")
                    fb_page_id = p_id
                    break

            if not ig_account_id:
                return {
                    "status": "error",
                    "error": "No Instagram Professional Account linked to your Facebook Pages."
                }

            # 4. Fetch Instagram Profile details from Graph API
            profile_url = f"{cls.META_GRAPH_URL}/{ig_account_id}"
            fields = "username,name,profile_picture_url,biography,followers_count,follows_count,media_count"
            profile_data = requests.get(profile_url, params={"fields": fields, "access_token": long_token}, timeout=10).json()

            return cls._save_instagram_account(user_id, profile_data, ig_account_id, fb_page_id, long_token, db)

        except Exception as e:
            return {"status": "error", "error": f"Meta Graph API connection failed: {str(e)}"}

    @classmethod
    def _save_instagram_account(cls, user_id: int, data: Dict[str, Any], ig_id: str, fb_id: str, token: str, db: Session) -> Dict[str, Any]:
        account = db.query(InstagramAccount).filter(InstagramAccount.user_id == user_id).first()
        if not account:
            account = InstagramAccount(user_id=user_id, instagram_user_id=ig_id, username=data.get("username", "creator"))
            db.add(account)
            db.commit()
            db.refresh(account)

        account.facebook_page_id = fb_id
        account.username = data.get("username", account.username)
        account.name = data.get("name", account.name)
        account.profile_picture_url = data.get("profile_picture_url", account.profile_picture_url)
        account.biography = data.get("biography", account.biography)
        account.followers_count = data.get("followers_count", 0)
        account.follows_count = data.get("follows_count", 0)
        account.media_count = data.get("media_count", 0)
        account.access_token = token
        account.connected_status = "connected"
        account.token_expires_at = datetime.utcnow() + timedelta(days=60)
        account.last_synced_at = datetime.utcnow()
        db.commit()

        # Update SocialAccount for main dashboard
        profile = db.query(CreatorProfile).filter(CreatorProfile.user_id == user_id).first()
        if profile:
            s_acc = db.query(SocialAccount).filter(SocialAccount.creator_id == profile.creator_id, SocialAccount.platform == "Instagram").first()
            if not s_acc:
                s_acc = SocialAccount(creator_id=profile.creator_id, platform="Instagram", account_name=account.username, followers=account.followers_count)
                db.add(s_acc)
            else:
                s_acc.account_name = account.username
                s_acc.followers = account.followers_count
            db.commit()

        return {
            "status": "connected",
            "platform": "Instagram",
            "username": account.username,
            "followers_count": account.followers_count,
            "last_synced_at": account.last_synced_at.strftime("%Y-%m-%d %H:%M UTC")
        }
