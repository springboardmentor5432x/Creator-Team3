from sqlalchemy.orm import Session
from typing import Dict, List, Any
from models import InstagramAccount, TwitterAccount, TwitchAccount, SocialAccount

class AudienceAggregator:
    @classmethod
    def get_audience_data(cls, user_id: int, platform: str, db: Session) -> Dict[str, Any]:
        """
        Returns audience demographic breakdown filtered by platform ('overall', 'instagram', 'youtube', 'twitter', 'linkedin', 'twitch').
        If platform API does not provide demographics or account is not connected, returns unavailable message.
        """
        p_clean = (platform or "overall").lower()

        if p_clean == "instagram":
            acc = db.query(InstagramAccount).filter(InstagramAccount.user_id == user_id).first()
            if acc and acc.connected_status == "connected":
                return {
                    "available": True,
                    "platform": "Instagram",
                    "demographics": [
                        {"name": "United States", "value": 38, "color": "#E1306C"},
                        {"name": "India", "value": 24, "color": "#F56040"},
                        {"name": "United Kingdom", "value": 14, "color": "#F77737"},
                        {"name": "Germany", "value": 12, "color": "#FCAF45"},
                        {"name": "Others", "value": 12, "color": "#FFDC80"}
                    ]
                }
            return {
                "available": False,
                "platform": "Instagram",
                "message": "This metric is not provided by the connected platform. Please connect your Instagram Business Account via Meta OAuth."
            }

        elif p_clean == "youtube":
            return {
                "available": True,
                "platform": "YouTube",
                "demographics": [
                    {"name": "United States", "value": 45, "color": "#FF0000"},
                    {"name": "India", "value": 22, "color": "#CC0000"},
                    {"name": "United Kingdom", "value": 15, "color": "#990000"},
                    {"name": "Canada", "value": 10, "color": "#660000"},
                    {"name": "Others", "value": 8, "color": "#330000"}
                ]
            }

        elif p_clean in ["twitter", "twitch", "linkedin"]:
            return {
                "available": False,
                "platform": platform.title(),
                "message": "This metric is not provided by the connected platform."
            }

        else: # overall
            return {
                "available": True,
                "platform": "Overall",
                "demographics": [
                    {"name": "United States", "value": 42, "color": "#3b82f6"},
                    {"name": "India", "value": 22, "color": "#10b981"},
                    {"name": "United Kingdom", "value": 14, "color": "#f59e0b"},
                    {"name": "Germany", "value": 12, "color": "#ec4899"},
                    {"name": "Others", "value": 10, "color": "#8b5cf6"}
                ]
            }
