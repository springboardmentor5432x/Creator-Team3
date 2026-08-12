import os
from typing import Dict, Any, Optional
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from models import TwitchAccount, TwitchSnapshot, CreatorProfile, SocialAccount

from twitchAPI.twitch import Twitch
from twitchAPI.oauth import UserAuthenticator
from twitchAPI.type import AuthScope

class TwitchOAuthService:
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
    async def get_authorize_url(cls, state: str = "creatoriq_twitch_state") -> Dict[str, Any]:
        cfg = cls.check_config()
        if not cfg["configured"]:
            return {"configured": False, "error": cfg["message"]}

        client_id = os.getenv("TWITCH_CLIENT_ID")
        client_secret = os.getenv("TWITCH_CLIENT_SECRET")
        redirect_uri = os.getenv("TWITCH_REDIRECT_URI")
        
        target_scope = [AuthScope.USER_READ_EMAIL, AuthScope.CHANNEL_READ_SUBSCRIPTIONS]

        twitch = await Twitch(client_id, client_secret)
        auth = UserAuthenticator(twitch, target_scope, force_verify=False, url=redirect_uri)
        url = auth.return_auth_url()
        
        # twitchAPI library doesn't automatically append our custom state in return_auth_url 
        # so we append it if missing, or it's just handled by their internal state.
        # But we'll just append it to match our previous behavior
        if "&state=" not in url:
            url += f"&state={state}"

        await twitch.close()
        
        return {"configured": True, "authorization_url": url}

    @classmethod
    async def exchange_code_and_connect(cls, user_id: int, code: str, db: Session) -> Dict[str, Any]:
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
        target_scope = [AuthScope.USER_READ_EMAIL, AuthScope.CHANNEL_READ_SUBSCRIPTIONS]

        twitch = await Twitch(client_id, client_secret)
        auth = UserAuthenticator(twitch, target_scope, force_verify=False, url=redirect_uri)

        try:
            # Exchange the code (user_token) for an access_token and refresh_token
            access_token, refresh_token = await auth.authenticate(user_token=code)
            
            # Set the user authentication context
            await twitch.set_user_authentication(access_token, target_scope, refresh_token)
            
            # Fetch user details using twitchAPI wrapper
            user_gen = await twitch.get_users()
            user_list = [u async for u in user_gen]
            
            if not user_list:
                await twitch.close()
                return {"status": "error", "error": "Failed to fetch channel details from Twitch."}

            u_data = user_list[0]
            
            result = cls._save_twitch_account(user_id, u_data, access_token, refresh_token, db)
            
            await twitch.close()
            return result
        except Exception as e:
            await twitch.close()
            return {"status": "error", "error": f"Twitch API connection failed: {str(e)}"}

    @classmethod
    def _save_twitch_account(cls, user_id: int, user_obj: Any, token: str, refresh_token: str, db: Session) -> Dict[str, Any]:
        tw_id = str(user_obj.id)

        account = db.query(TwitchAccount).filter(TwitchAccount.user_id == user_id).first()
        if not account:
            account = TwitchAccount(user_id=user_id, twitch_user_id=tw_id, login=user_obj.login or "twitch_creator")
            db.add(account)
            db.commit()
            db.refresh(account)

        account.login = user_obj.login or account.login
        account.display_name = user_obj.display_name or account.display_name
        account.profile_image_url = user_obj.profile_image_url or account.profile_image_url
        account.broadcaster_type = user_obj.broadcaster_type or account.broadcaster_type
        account.view_count = user_obj.view_count or 0
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
