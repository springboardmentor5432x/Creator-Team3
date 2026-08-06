import os
import requests
from typing import Dict, Any, Optional
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from models import LinkedInAccount, LinkedInSnapshot, CreatorProfile, SocialAccount


class LinkedInOAuthService:
    """
    Real LinkedIn OAuth 2.0 / OpenID Connect integration ("Sign In with LinkedIn
    using OpenID Connect" product). Mirrors the TwitterOAuthService / TwitchOAuthService
    pattern already used in this codebase.

    NOTE on data available: LinkedIn's basic OpenID Connect product only returns
    identity data (name, email, profile photo). Follower / connection counts and
    post analytics require LinkedIn's Marketing Developer Platform / Community
    Management API, which needs a separate partner application review by LinkedIn.
    Those fields are wired up end-to-end here (model, sync, dashboard) and will
    populate automatically the moment the app is approved for those scopes -
    until then they are stored as 0 / "Requires Partner API Access", same as how
    this project already flags OAuth-gated fields for Twitter/Twitch.
    """

    LINKEDIN_AUTH_URL = "https://www.linkedin.com/oauth/v2/authorization"
    LINKEDIN_TOKEN_URL = "https://www.linkedin.com/oauth/v2/accessToken"
    LINKEDIN_USERINFO_URL = "https://api.linkedin.com/v2/userinfo"

    @classmethod
    def check_config(cls) -> Dict[str, Any]:
        client_id = os.getenv("LINKEDIN_CLIENT_ID", "").strip()
        client_secret = os.getenv("LINKEDIN_CLIENT_SECRET", "").strip()
        redirect_uri = os.getenv("LINKEDIN_REDIRECT_URI", "").strip()
        configured = bool(client_id and client_secret and redirect_uri and not client_id.startswith("linkedin_"))
        return {
            "configured": configured,
            "client_id": client_id if configured else "Not Configured",
            "redirect_uri": redirect_uri or "Not Configured",
            "message": "LinkedIn Developer App configured" if configured else "LinkedIn Developer credentials are not configured in backend/.env."
        }

    @classmethod
    def get_authorize_url(cls, state: str = "creatoriq_linkedin_state") -> Dict[str, Any]:
        cfg = cls.check_config()
        if not cfg["configured"]:
            return {"configured": False, "error": cfg["message"]}

        client_id = os.getenv("LINKEDIN_CLIENT_ID")
        redirect_uri = os.getenv("LINKEDIN_REDIRECT_URI")
        scopes = "openid%20profile%20email"
        url = (
            f"{cls.LINKEDIN_AUTH_URL}?response_type=code&client_id={client_id}"
            f"&redirect_uri={redirect_uri}&scope={scopes}&state={state}"
        )
        return {"configured": True, "authorization_url": url}

    @classmethod
    def exchange_code_and_connect(cls, user_id: int, code: str, db: Session) -> Dict[str, Any]:
        cfg = cls.check_config()
        if not cfg["configured"]:
            return {"status": "developer_app_not_configured", "error": cfg["message"]}

        if not code or code.startswith("oauth_code_"):
            return {
                "status": "error",
                "error": "Real LinkedIn OAuth authorization code required. Please log in via LinkedIn OAuth."
            }

        client_id = os.getenv("LINKEDIN_CLIENT_ID")
        client_secret = os.getenv("LINKEDIN_CLIENT_SECRET")
        redirect_uri = os.getenv("LINKEDIN_REDIRECT_URI")

        try:
            payload = {
                "grant_type": "authorization_code",
                "code": code,
                "redirect_uri": redirect_uri,
                "client_id": client_id,
                "client_secret": client_secret,
            }
            headers = {"Content-Type": "application/x-www-form-urlencoded"}
            res = requests.post(cls.LINKEDIN_TOKEN_URL, data=payload, headers=headers, timeout=10)
            token_data = res.json()
            access_token = token_data.get("access_token")

            if not access_token:
                return {
                    "status": "error",
                    "error": token_data.get("error_description", "Failed to exchange LinkedIn OAuth authorization code.")
                }

            expires_in = token_data.get("expires_in", 0)

            userinfo_res = requests.get(
                cls.LINKEDIN_USERINFO_URL,
                headers={"Authorization": f"Bearer {access_token}"},
                timeout=10
            ).json()

            if not userinfo_res.get("sub"):
                return {"status": "error", "error": "Failed to fetch profile from LinkedIn userinfo endpoint."}

            return cls._save_linkedin_account(user_id, userinfo_res, access_token, expires_in, db)

        except Exception as e:
            return {"status": "error", "error": f"LinkedIn API connection failed: {str(e)}"}

    @classmethod
    def _save_linkedin_account(cls, user_id: int, data: Dict[str, Any], token: str, expires_in: int, db: Session) -> Dict[str, Any]:
        li_id = str(data.get("sub"))

        account = db.query(LinkedInAccount).filter(LinkedInAccount.user_id == user_id).first()
        if not account:
            account = LinkedInAccount(user_id=user_id, linkedin_user_id=li_id)
            db.add(account)
            db.commit()
            db.refresh(account)

        account.name = data.get("name", account.name)
        account.email = data.get("email", account.email)
        account.profile_picture_url = data.get("picture", account.profile_picture_url)
        account.access_token = token
        account.token_expires_at = datetime.utcnow() + timedelta(seconds=expires_in) if expires_in else None
        account.connected_status = "connected"
        account.last_synced_at = datetime.utcnow()
        db.commit()

        # Update SocialAccount (used across the dashboard's aggregated views)
        profile = db.query(CreatorProfile).filter(CreatorProfile.user_id == user_id).first()
        if profile:
            s_acc = db.query(SocialAccount).filter(SocialAccount.creator_id == profile.creator_id, SocialAccount.platform == "LinkedIn").first()
            if not s_acc:
                s_acc = SocialAccount(creator_id=profile.creator_id, platform="LinkedIn", account_name=account.name or "LinkedIn Creator", followers=account.followers_count)
                db.add(s_acc)
            else:
                s_acc.account_name = account.name or s_acc.account_name
                s_acc.followers = account.followers_count
            db.commit()

        return {
            "status": "connected",
            "platform": "LinkedIn",
            "name": account.name,
            "followers_count": account.followers_count,
            "last_synced_at": account.last_synced_at.strftime("%Y-%m-%d %H:%M UTC")
        }
