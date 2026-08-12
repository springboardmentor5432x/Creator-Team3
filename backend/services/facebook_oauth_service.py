import os
import requests
from typing import Dict, Any, Optional
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from models import FacebookAccount, CreatorProfile, SocialAccount


class FacebookOAuthService:
    """
    Connects a Facebook Page using the official Meta Graph API
    (Facebook Login for Business), the production-recommended way to pull
    Page data - no scraping, no HTML parsing, no login-wall guesswork.

    Flow:
      1. Send the user to Facebook's OAuth dialog (get_authorize_url).
      2. Facebook redirects back with a `code`.
      3. Exchange the code for a short-lived User Access Token.
      4. Exchange that for a long-lived (~60 day) User Access Token.
      5. Call /me/accounts to list the Pages the user manages. Each Page
         entry already includes its own Page Access Token, which - for a
         Page tied to a long-lived User token - effectively does not expire
         until the user revokes access, changes their password, or the
         Page's admin list changes.
      6. Fetch Page fields (name, category, fan_count, picture, link, about)
         with that Page Access Token and persist everything.

    Reuses the same Meta App (META_APP_ID / META_APP_SECRET) as the
    Instagram integration, since both are products of one Meta Developer
    App - only the redirect URI and requested scopes differ.
    """

    META_GRAPH_URL = "https://graph.facebook.com/v19.0"

    @classmethod
    def check_config(cls) -> Dict[str, Any]:
        app_id = os.getenv("META_APP_ID", "").strip()
        app_secret = os.getenv("META_APP_SECRET", "").strip()
        redirect_uri = os.getenv("FACEBOOK_REDIRECT_URI", "").strip() or os.getenv("META_REDIRECT_URI", "").strip()
        configured = bool(app_id and app_secret and redirect_uri and not app_id.startswith("meta_"))
        return {
            "configured": configured,
            "app_id": app_id if configured else "Not Configured",
            "redirect_uri": redirect_uri or "Not Configured",
            "message": "Meta Developer App configured" if configured else "Meta Developer App credentials (META_APP_ID, META_APP_SECRET, FACEBOOK_REDIRECT_URI) are missing from backend/.env."
        }

    @classmethod
    def get_authorize_url(cls, state: str = "creatoriq_fb_state") -> Dict[str, Any]:
        cfg = cls.check_config()
        if not cfg["configured"]:
            return {"configured": False, "error": cfg["message"]}

        client_id = os.getenv("META_APP_ID")
        redirect_uri = os.getenv("FACEBOOK_REDIRECT_URI") or os.getenv("META_REDIRECT_URI")
        # pages_show_list + pages_read_engagement are enough to list a user's Pages
        # and read their public fields (name, category, fan_count, picture, link).
        # pages_read_user_content and read_insights are deliberately left out here:
        # Meta's OAuth dialog rejects them with "Invalid Scopes" until they've been
        # added under App Review > Permissions and Features in the Meta App Dashboard
        # (and, for real end users rather than just your own app admins/testers,
        # actually approved through App Review). Add them back to this string once
        # that's done, if/when you build real Page Insights reporting.
        scopes = "pages_show_list,pages_read_engagement"
        url = (
            f"https://www.facebook.com/v19.0/dialog/oauth?client_id={client_id}"
            f"&redirect_uri={redirect_uri}&scope={scopes}&response_type=code&state={state}"
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
                "error": "Real Meta OAuth authorization code required. Please log in via Facebook Login for Business."
            }

        client_id = os.getenv("META_APP_ID")
        client_secret = os.getenv("META_APP_SECRET")
        redirect_uri = os.getenv("FACEBOOK_REDIRECT_URI") or os.getenv("META_REDIRECT_URI")

        try:
            # 1. Exchange the authorization code for a short-lived User Access Token
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

            # 2. Exchange for a long-lived (~60 day) User Access Token
            long_url = f"{cls.META_GRAPH_URL}/oauth/access_token"
            long_params = {
                "grant_type": "fb_exchange_token",
                "client_id": client_id,
                "client_secret": client_secret,
                "fb_exchange_token": short_token
            }
            long_res = requests.get(long_url, params=long_params, timeout=10).json()
            long_token = long_res.get("access_token", short_token)

            # 3. List the Facebook Pages this user manages (each includes its own Page Access Token)
            accounts_url = f"{cls.META_GRAPH_URL}/me/accounts"
            accounts_res = requests.get(
                accounts_url,
                params={"fields": "id,name,access_token,category", "access_token": long_token},
                timeout=10
            ).json()

            pages = accounts_res.get("data", [])
            if "error" in accounts_res:
                return {
                    "status": "error",
                    "error": accounts_res["error"].get("message", "Failed to list Facebook Pages for this account.")
                }
            if not pages:
                return {
                    "status": "error",
                    "error": "No Facebook Pages found for this account. You need to be an admin of at least one Facebook Page."
                }

            # Connect the first Page the user administers (same single-account
            # pattern used for Instagram/LinkedIn/Twitter/Twitch elsewhere in the app)
            page = pages[0]
            page_id = page.get("id")
            page_token = page.get("access_token", long_token)

            # 4. Fetch full Page profile details using the Page Access Token
            profile_url = f"{cls.META_GRAPH_URL}/{page_id}"
            fields = "name,category,about,fan_count,link,picture{url},verification_status"
            profile_res = requests.get(profile_url, params={"fields": fields, "access_token": page_token}, timeout=10)
            profile_data = profile_res.json()

            if "error" in profile_data:
                return {
                    "status": "error",
                    "error": profile_data["error"].get("message", "Failed to fetch Facebook Page details.")
                }

            return cls._save_facebook_account(user_id, profile_data, page_id, page_token, db)

        except requests.exceptions.RequestException as e:
            return {"status": "error", "error": f"Network error reaching the Meta Graph API: {str(e)}"}
        except Exception as e:
            return {"status": "error", "error": f"Meta Graph API connection failed: {str(e)}"}

    @classmethod
    def _save_facebook_account(cls, user_id: int, data: Dict[str, Any], page_id: str, token: str, db: Session) -> Dict[str, Any]:
        account = db.query(FacebookAccount).filter(FacebookAccount.user_id == user_id).first()
        if not account:
            account = FacebookAccount(user_id=user_id, facebook_page_id=page_id, page_name=data.get("name", "Facebook Page"))
            db.add(account)
            db.commit()
            db.refresh(account)

        picture = data.get("picture", {})
        picture_url = picture.get("data", {}).get("url", "") if isinstance(picture, dict) else ""

        account.facebook_page_id = page_id
        account.page_name = data.get("name", account.page_name)
        account.category = data.get("category", account.category)
        account.about = data.get("about", account.about)
        account.profile_picture_url = picture_url or account.profile_picture_url
        account.page_link = data.get("link", account.page_link)
        account.followers_count = data.get("fan_count", 0)
        account.is_verified = data.get("verification_status") == "blue_verified"
        account.access_token = token
        account.connected_status = "connected"
        # Page Access Tokens derived from a long-lived User token generally don't
        # expire on a fixed schedule, but we track a 60-day check-in like Instagram.
        account.token_expires_at = datetime.utcnow() + timedelta(days=60)
        account.last_synced_at = datetime.utcnow()
        db.commit()

        # Mirror into the generic SocialAccount table so it shows up on the main dashboard
        profile = db.query(CreatorProfile).filter(CreatorProfile.user_id == user_id).first()
        if profile:
            s_acc = db.query(SocialAccount).filter(SocialAccount.creator_id == profile.creator_id, SocialAccount.platform == "Facebook").first()
            if not s_acc:
                s_acc = SocialAccount(creator_id=profile.creator_id, platform="Facebook", account_name=account.page_name, followers=account.followers_count)
                db.add(s_acc)
            else:
                s_acc.account_name = account.page_name
                s_acc.followers = account.followers_count
            db.commit()

        return {
            "status": "connected",
            "platform": "Facebook",
            "page_name": account.page_name,
            "followers_count": account.followers_count,
            "last_synced_at": account.last_synced_at.strftime("%Y-%m-%d %H:%M UTC")
        }

    @classmethod
    def fetch_page_insights(cls, account: FacebookAccount, metrics: Optional[str] = None) -> Dict[str, Any]:
        """
        Optional helper for pulling real Page Insights (reach, engagement, etc.)
        via the official /insights endpoint, for future analytics wiring.

        NOTE: this requires the `read_insights` permission, which is not part
        of the default OAuth scope requested in get_authorize_url() (Meta's
        dialog rejects it with "Invalid Scopes" until it's added under
        App Review > Permissions and Features in the Meta App Dashboard).
        Add it there, add it back to the scopes string, and have the user
        reconnect before calling this.
        """
        if not account or not account.access_token:
            return {"error": "No connected Facebook Page access token."}

        metrics = metrics or "page_impressions,page_engaged_users,page_fans"
        url = f"{cls.META_GRAPH_URL}/{account.facebook_page_id}/insights"
        try:
            res = requests.get(url, params={"metric": metrics, "access_token": account.access_token}, timeout=10)
            data = res.json()
            if "error" in data:
                return {"error": data["error"].get("message", "Failed to fetch Page insights.")}
            return data
        except requests.exceptions.RequestException as e:
            return {"error": f"Network error reaching the Meta Graph API: {str(e)}"}
