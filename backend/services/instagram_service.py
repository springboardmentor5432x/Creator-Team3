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

    def compute_instagram_intelligence(self, media_items: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Calculates momentum, content type breakdowns, and mock historical charts."""
        intelligence = {
            "content_breakdown": {},
            "momentum_signals": [],
            "chart_data": [],
            "insight": None,
            "funnel": {},
            "engagement_breakdown": {},
            "saves_shares_intel": []
        }
        
        if not media_items:
            return intelligence
            
        # 1. Content Breakdown (Reels vs Posts vs Carousels)
        breakdown = {
            "REELS": {"reach": 0, "engagement": 0, "saves": 0, "shares": 0, "count": 0},
            "POSTS": {"reach": 0, "engagement": 0, "saves": 0, "shares": 0, "count": 0},
            "CAROUSELS": {"reach": 0, "engagement": 0, "saves": 0, "shares": 0, "count": 0}
        }
        
        total_likes = 0
        total_comments = 0
        total_saves = 0
        total_shares = 0
        total_impressions = 0
        total_reach = 0

        for m in media_items:
            m_type = "REELS" if m["media_type"] == "VIDEO" else ("CAROUSELS" if m["media_type"] == "CAROUSEL_ALBUM" else "POSTS")
            b = breakdown[m_type]
            b["count"] += 1
            b["reach"] += m.get("reach", 0)
            
            # Since instagrapi doesn't provide saves/shares, we mock them based on likes for the authenticated intelligence
            likes = m.get("like_count", 0)
            comments = m.get("comments_count", 0)
            mock_saves = int(likes * 0.15) # Mock 15% of likes
            mock_shares = int(likes * 0.08) # Mock 8% of likes
            
            m["saved"] = mock_saves
            m["shares"] = mock_shares
            
            eng_val = likes + comments + mock_saves + mock_shares
            b["saves"] += mock_saves
            b["shares"] += mock_shares
            
            # calculate engagement rate for this post
            reach_val = m.get("reach", 0) or m.get("video_views", 0) or 1000 # fallback to 1000 to prevent div0
            if reach_val == 0: reach_val = 1000
            m["engagement_rate"] = round((eng_val / reach_val) * 100, 2)
            b["engagement"] += m["engagement_rate"]
            
            total_likes += likes
            total_comments += comments
            total_saves += mock_saves
            total_shares += mock_shares
            total_reach += reach_val
            total_impressions += int(reach_val * 1.4) # Mock impressions
            
        for k, v in breakdown.items():
            if v["count"] > 0:
                v["reach"] = int(v["reach"] / v["count"])
                v["engagement"] = round(v["engagement"] / v["count"], 1)
                v["saves"] = int(v["saves"] / v["count"])
                v["shares"] = int(v["shares"] / v["count"])
                
        intelligence["content_breakdown"] = breakdown
        
        # CreatorIQ Insight
        best_type = max([k for k in breakdown.keys() if breakdown[k]["count"] > 0], key=lambda k: breakdown[k]["engagement"], default="POSTS")
        intelligence["insight"] = f"Your {best_type.lower().capitalize()} generate the highest average engagement ({breakdown[best_type]['engagement']}%). Consider doubling down on this format."
        if breakdown["CAROUSELS"]["count"] > 0 and breakdown["CAROUSELS"]["saves"] > breakdown["POSTS"]["saves"]:
            intelligence["insight"] = f"Carousels generate {round(breakdown['CAROUSELS']['saves'] / max(1, breakdown['POSTS']['saves']), 1)}× more saves than your average image posts."

        # 2. Momentum Signals (Top 3 recent posts)
        avg_reach = total_reach / len(media_items)
        for idx, m in enumerate(media_items[:3]):
            perf_ratio = m.get("reach", 0) / avg_reach if avg_reach > 0 else 1.0
            momentum = "Average"
            perf_score = int(perf_ratio * 100)
            if perf_score > 120: momentum = "🔥 Exploding"
            elif perf_score > 90: momentum = "📈 Growing"
            else: momentum = "⚠️ Underperforming"
            
            m["performance_score"] = perf_score
            m["momentum"] = momentum
            
            intelligence["momentum_signals"].append({
                "id": m["media_id"],
                "title": m["caption"][:40] + "..." if m["caption"] else "Instagram Post",
                "momentum": momentum,
                "score": perf_score
            })
            
        # 3. Funnel
        profile_visits = int(total_reach * 0.12)
        follows = int(profile_visits * 0.08)
        intelligence["funnel"] = {
            "impressions": total_impressions,
            "reach": total_reach,
            "profile_visits": profile_visits,
            "follows": follows
        }
        
        # 4. Engagement Breakdown
        total_eng = total_likes + total_comments + total_saves + total_shares
        if total_eng > 0:
            intelligence["engagement_breakdown"] = {
                "likes": round((total_likes / total_eng) * 100, 1),
                "comments": round((total_comments / total_eng) * 100, 1),
                "saves": round((total_saves / total_eng) * 100, 1),
                "shares": round((total_shares / total_eng) * 100, 1)
            }
            
        # 5. Saves and Shares Intel
        sorted_by_saves = sorted(media_items, key=lambda x: x.get("saved", 0), reverse=True)
        for m in sorted_by_saves[:2]:
            intelligence["saves_shares_intel"].append({
                "id": m["media_id"],
                "thumbnail_url": m["thumbnail_url"],
                "saves": m.get("saved", 0),
                "shares": m.get("shares", 0),
                "label": "Highly Saveable" if m.get("saved", 0) > m.get("shares", 0) else "Highly Shareable"
            })
            
        # 6. Mock Chart Data (6 months)
        import random
        base_views = total_reach / 10 if total_reach > 0 else 50000
        months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]
        for i, month in enumerate(months):
            trend = 1.0 + (i * 0.05)
            intelligence["chart_data"].append({
                "month": month,
                "reach": int(base_views * trend * random.uniform(0.9, 1.1)),
                "impressions": int(base_views * 1.4 * trend * random.uniform(0.9, 1.1)),
                "engagement": round(5.0 * random.uniform(0.9, 1.1), 1)
            })

        return intelligence

