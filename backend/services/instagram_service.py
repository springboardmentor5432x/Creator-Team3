import os
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional
from instagrapi import Client

class InstagramService:
    def __init__(self, session_data: Optional[Dict[str, Any]] = None):
        """Initializes instagrapi Client, optionally with an existing session."""
        self.client = Client()
        if session_data:
            self.client.set_settings(session_data)

    @classmethod
    def login(cls, username: str, password: str) -> Dict[str, Any]:
        """Logs into Instagram using username and password. Returns session dump or error."""
        try:
            cl = Client()
            cl.login(username, password)
            session_settings = cl.get_settings()
            
            # Fetch user info after successful login
            user_info = cl.user_info(cl.user_id)
            
            return {
                "status": "success",
                "session_data": session_settings,
                "user_info": {
                    "instagram_user_id": str(user_info.pk),
                    "username": user_info.username,
                    "name": user_info.full_name,
                    "profile_picture_url": str(user_info.profile_pic_url),
                    "biography": user_info.biography,
                    "followers_count": user_info.follower_count,
                    "follows_count": user_info.following_count,
                    "media_count": user_info.media_count,
                }
            }
        except Exception as e:
            return {"error": str(e)}

    def get_user_profile(self, ig_user_id: str) -> Dict[str, Any]:
        """Fetches live Instagram User Profile metrics using instagrapi."""
        try:
            user_info = self.client.user_info(ig_user_id)
            return {
                "id": str(user_info.pk),
                "username": user_info.username,
                "name": user_info.full_name,
                "profile_picture_url": str(user_info.profile_pic_url),
                "biography": user_info.biography,
                "followers_count": user_info.follower_count,
                "follows_count": user_info.following_count,
                "media_count": user_info.media_count,
                "website": user_info.external_url or ""
            }
        except Exception as e:
            print(f"Error fetching profile: {e}")
            return {}

    def get_account_insights(self, ig_user_id: str) -> Dict[str, Any]:
        """Fetches account-level insights. 
        Instagrapi doesn't directly support the Graph API business insights endpoint natively without complex requests.
        For now, we return estimated/placeholder metrics for reach/impressions if we can't scrape them directly."""
        # A more complex integration would scrape professional dashboard endpoints,
        # but for this basic instagrapi migration we return zeros or estimates.
        metrics = {
            "impressions": 0,
            "reach": 0,
            "profile_views": 0,
            "website_clicks": 0,
            "phone_call_clicks": 0,
            "email_contacts": 0
        }
        return metrics

    def get_user_media(self, ig_user_id: str, limit: int = 25) -> List[Dict[str, Any]]:
        """Fetches live media posts and basic metrics using instagrapi."""
        try:
            medias = self.client.user_medias(ig_user_id, limit)
            media_items = []
            for item in medias:
                # Map instagrapi media properties to our format
                m_type = "IMAGE"
                if item.media_type == 2: m_type = "VIDEO"
                elif item.media_type == 8: m_type = "CAROUSEL_ALBUM"

                media_url = str(item.thumbnail_url or item.video_url or "")
                if m_type == "CAROUSEL_ALBUM" and item.resources:
                    media_url = str(item.resources[0].thumbnail_url or item.resources[0].video_url or "")
                    
                permalink = f"https://www.instagram.com/p/{item.code}/"

                media_items.append({
                    "media_id": str(item.pk),
                    "caption": item.caption_text,
                    "media_type": m_type,
                    "media_url": media_url,
                    "thumbnail_url": media_url,
                    "permalink": permalink,
                    "timestamp": item.taken_at.isoformat() if item.taken_at else datetime.utcnow().isoformat(),
                    "like_count": item.like_count,
                    "comments_count": item.comment_count,
                    "reach": item.view_count or 0,
                    "impressions": item.view_count or 0,
                    "saved": 0,
                    "video_views": item.video_view_count or item.view_count or 0
                })
            return media_items
        except Exception as e:
            print(f"Error fetching media: {e}")
            return []
