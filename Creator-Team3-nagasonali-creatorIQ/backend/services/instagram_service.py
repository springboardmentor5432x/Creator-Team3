import os
import requests
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional

class InstagramService:
    GRAPH_API_URL = "https://graph.facebook.com/v20.0"

    def __init__(self, access_token: str = ""):
        self.access_token = access_token
        self.app_id = os.getenv("META_APP_ID", "")
        self.app_secret = os.getenv("META_APP_SECRET", "")
        self.redirect_uri = os.getenv("META_REDIRECT_URI", "http://localhost:5173/settings")

    @classmethod
    def exchange_code_for_token(cls, code: str) -> Dict[str, Any]:
        """Exchanges Meta OAuth authorization code for short-lived user access token."""
        app_id = os.getenv("META_APP_ID", "")
        app_secret = os.getenv("META_APP_SECRET", "")
        redirect_uri = os.getenv("META_REDIRECT_URI", "http://localhost:5173/settings")

        url = f"{cls.GRAPH_API_URL}/oauth/access_token"
        params = {
            "client_id": app_id,
            "client_secret": app_secret,
            "redirect_uri": redirect_uri,
            "code": code
        }
        res = requests.get(url, params=params, timeout=10)
        return res.json()

    @classmethod
    def get_long_lived_token(cls, short_token: str) -> Dict[str, Any]:
        """Exchanges short-lived token for 60-day long-lived access token."""
        app_id = os.getenv("META_APP_ID", "")
        app_secret = os.getenv("META_APP_SECRET", "")

        url = f"{cls.GRAPH_API_URL}/oauth/access_token"
        params = {
            "grant_type": "fb_exchange_token",
            "client_id": app_id,
            "client_secret": app_secret,
            "fb_exchange_token": short_token
        }
        res = requests.get(url, params=params, timeout=10)
        return res.json()

    def get_instagram_business_account(self) -> Dict[str, Any]:
        """Fetches connected Facebook Pages and Instagram Business Account ID."""
        url = f"{self.GRAPH_API_URL}/me/accounts"
        params = {
            "fields": "id,name,instagram_business_account{id,username,name,profile_picture_url,biography,followers_count,follows_count,media_count}",
            "access_token": self.access_token
        }
        res = requests.get(url, params=params, timeout=10)
        data = res.json()
        
        if "error" in data:
            return {"error": data["error"]["message"], "code": data["error"].get("code")}
            
        pages = data.get("data", [])
        for page in pages:
            ig_account = page.get("instagram_business_account")
            if ig_account:
                return {
                    "facebook_page_id": page["id"],
                    "instagram_user_id": ig_account["id"],
                    "username": ig_account.get("username", ""),
                    "name": ig_account.get("name", ""),
                    "profile_picture_url": ig_account.get("profile_picture_url", ""),
                    "biography": ig_account.get("biography", ""),
                    "followers_count": ig_account.get("followers_count", 0),
                    "follows_count": ig_account.get("follows_count", 0),
                    "media_count": ig_account.get("media_count", 0)
                }
        return {"error": "No Instagram Business or Creator Account linked to connected Facebook Page."}

    def get_user_profile(self, ig_user_id: str) -> Dict[str, Any]:
        """Fetches live Instagram User Profile metrics."""
        url = f"{self.GRAPH_API_URL}/{ig_user_id}"
        params = {
            "fields": "id,username,name,profile_picture_url,biography,followers_count,follows_count,media_count,website",
            "access_token": self.access_token
        }
        res = requests.get(url, params=params, timeout=10)
        return res.json()

    def get_account_insights(self, ig_user_id: str) -> Dict[str, Any]:
        """Fetches live account-level Graph API insights metrics (impressions, reach, profile_views, website_clicks)."""
        url = f"{self.GRAPH_API_URL}/{ig_user_id}/insights"
        params = {
            "metric": "impressions,reach,profile_views,website_clicks,phone_call_clicks,email_contacts",
            "period": "day",
            "access_token": self.access_token
        }
        res = requests.get(url, params=params, timeout=10)
        data = res.json()
        
        metrics = {
            "impressions": 0,
            "reach": 0,
            "profile_views": 0,
            "website_clicks": 0,
            "phone_call_clicks": 0,
            "email_contacts": 0
        }
        
        if "data" in data:
            for item in data["data"]:
                m_name = item.get("name")
                m_values = item.get("values", [])
                val = sum(v.get("value", 0) for v in m_values) if m_values else 0
                if m_name in metrics:
                    metrics[m_name] = val
                    
        return metrics

    def get_user_media(self, ig_user_id: str, limit: int = 25) -> List[Dict[str, Any]]:
        """Fetches live media posts and metrics from Instagram Graph API."""
        url = f"{self.GRAPH_API_URL}/{ig_user_id}/media"
        params = {
            "fields": "id,caption,media_type,media_url,thumbnail_url,permalink,timestamp,like_count,comments_count,insights.metric(reach,impressions,saved,video_views)",
            "limit": limit,
            "access_token": self.access_token
        }
        res = requests.get(url, params=params, timeout=10)
        data = res.json()

        media_items = []
        for item in data.get("data", []):
            reach = 0
            impressions = 0
            saved = 0
            video_views = 0
            
            insights = item.get("insights", {}).get("data", [])
            for ins in insights:
                n = ins.get("name")
                v = ins.get("values", [{}])[0].get("value", 0)
                if n == "reach": reach = v
                elif n == "impressions": impressions = v
                elif n == "saved": saved = v
                elif n == "video_views": video_views = v

            media_items.append({
                "media_id": item["id"],
                "caption": item.get("caption", ""),
                "media_type": item.get("media_type", "IMAGE"),
                "media_url": item.get("media_url", ""),
                "thumbnail_url": item.get("thumbnail_url", item.get("media_url", "")),
                "permalink": item.get("permalink", ""),
                "timestamp": item.get("timestamp", datetime.utcnow().isoformat()),
                "like_count": item.get("like_count", 0),
                "comments_count": item.get("comments_count", 0),
                "reach": reach,
                "impressions": impressions,
                "saved": saved,
                "video_views": video_views
            })
            
        return media_items
