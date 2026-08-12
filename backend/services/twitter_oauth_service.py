import os
import requests
from typing import Dict, Any, Optional
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from models import TwitterAccount, TwitterSnapshot, CreatorProfile, SocialAccount

class TwitterOAuthService:
    TWITTER_AUTH_URL = "https://twitter.com/i/oauth2/authorize"
    TWITTER_TOKEN_URL = "https://api.twitter.com/2/oauth2/token"
    TWITTER_API_URL = "https://api.twitter.com/2"

    @classmethod
    def check_config(cls) -> Dict[str, Any]:
        client_id = os.getenv("TWITTER_CLIENT_ID", "").strip()
        client_secret = os.getenv("TWITTER_CLIENT_SECRET", "").strip()
        redirect_uri = os.getenv("TWITTER_REDIRECT_URI", "").strip()
        configured = bool(client_id and client_secret and redirect_uri and not client_id.startswith("twitter_"))
        return {
            "configured": configured,
            "client_id": client_id if configured else "Not Configured",
            "redirect_uri": redirect_uri or "Not Configured",
            "message": "Twitter Developer App configured" if configured else "Twitter Developer credentials are not configured in backend/.env."
        }

    @classmethod
    def get_authorize_url(cls, state: str = "creatoriq_twitter_state") -> Dict[str, Any]:
        cfg = cls.check_config()
        if not cfg["configured"]:
            return {"configured": False, "error": cfg["message"]}

        client_id = os.getenv("TWITTER_CLIENT_ID")
        redirect_uri = os.getenv("TWITTER_REDIRECT_URI")
        scopes = "tweet.read%20users.read%20follows.read%20offline.access"
        url = f"{cls.TWITTER_AUTH_URL}?response_type=code&client_id={client_id}&redirect_uri={redirect_uri}&scope={scopes}&state={state}&code_challenge=challenge&code_challenge_method=plain"
        return {"configured": True, "authorization_url": url}

    @classmethod
    def exchange_code_and_connect(cls, user_id: int, code: str, db: Session) -> Dict[str, Any]:
        cfg = cls.check_config()
        if not cfg["configured"]:
            return {"status": "developer_app_not_configured", "error": cfg["message"]}

        if not code or code.startswith("oauth_code_"):
            return {
                "status": "error",
                "error": "Real Twitter OAuth authorization code required. Please log in via Twitter / X OAuth 2.0."
            }

        client_id = os.getenv("TWITTER_CLIENT_ID")
        client_secret = os.getenv("TWITTER_CLIENT_SECRET")
        redirect_uri = os.getenv("TWITTER_REDIRECT_URI")

        try:
            payload = {
                "code": code,
                "grant_type": "authorization_code",
                "client_id": client_id,
                "redirect_uri": redirect_uri,
                "code_verifier": "challenge"
            }
            res = requests.post(cls.TWITTER_TOKEN_URL, data=payload, auth=(client_id, client_secret), timeout=10)
            token_data = res.json()
            access_token = token_data.get("access_token")

            if not access_token:
                return {
                    "status": "error",
                    "error": token_data.get("error_description", "Failed to exchange Twitter OAuth authorization code.")
                }

            headers = {"Authorization": f"Bearer {access_token}"}
            me_res = requests.get(
                f"{cls.TWITTER_API_URL}/users/me?user.fields=profile_image_url,public_metrics,description",
                headers=headers,
                timeout=10
            ).json()

            user_data = me_res.get("data", {})
            if not user_data.get("id"):
                return {"status": "error", "error": "Failed to fetch user metrics from Twitter API v2."}

            return cls._save_twitter_account(user_id, user_data, access_token, token_data.get("refresh_token", ""), db)

        except Exception as e:
            return {"status": "error", "error": f"Twitter API connection failed: {str(e)}"}

    @classmethod
    def _save_twitter_account(cls, user_id: int, data: Dict[str, Any], token: str, refresh_token: str, db: Session) -> Dict[str, Any]:
        metrics = data.get("public_metrics", {})
        tw_id = str(data.get("id"))

        account = db.query(TwitterAccount).filter(TwitterAccount.user_id == user_id).first()
        if not account:
            account = TwitterAccount(user_id=user_id, twitter_user_id=tw_id, username=data.get("username", "twitter_creator"))
            db.add(account)
            db.commit()
            db.refresh(account)

        account.username = data.get("username", account.username)
        account.name = data.get("name", account.name)
        account.profile_image_url = data.get("profile_image_url", account.profile_image_url)
        account.followers_count = metrics.get("followers_count", 0)
        account.following_count = metrics.get("following_count", 0)
        account.tweet_count = metrics.get("tweet_count", 0)
        account.listed_count = metrics.get("listed_count", 0)
        account.access_token = token
        account.refresh_token = refresh_token
        account.connected_status = "connected"
        account.last_synced_at = datetime.utcnow()
        db.commit()

        # Update SocialAccount
        profile = db.query(CreatorProfile).filter(CreatorProfile.user_id == user_id).first()
        if profile:
            s_acc = db.query(SocialAccount).filter(SocialAccount.creator_id == profile.creator_id, SocialAccount.platform == "Twitter").first()
            if not s_acc:
                s_acc = SocialAccount(creator_id=profile.creator_id, platform="Twitter", account_name=account.username, followers=account.followers_count)
                db.add(s_acc)
            else:
                s_acc.account_name = account.username
                s_acc.followers = account.followers_count
            db.commit()

        return {
            "status": "connected",
            "platform": "Twitter",
            "username": account.username,
            "followers_count": account.followers_count,
            "last_synced_at": account.last_synced_at.strftime("%Y-%m-%d %H:%M UTC")
        }
