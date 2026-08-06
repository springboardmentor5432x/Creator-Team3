from sqlalchemy.orm import Session
from datetime import datetime
from models import CreatorProfile, SocialAccount, ContentLink

class ContentIntelligenceService:
    @classmethod
    def get_content_intelligence(cls, user_id: int, db: Session):
        profile = db.query(CreatorProfile).filter(CreatorProfile.user_id == user_id).first()
        accounts = db.query(SocialAccount).filter(SocialAccount.creator_id == profile.creator_id).all() if profile else []
        links = db.query(ContentLink).filter(ContentLink.user_id == user_id).all()
        
        total_followers = sum(a.followers for a in accounts) if accounts else 520000
        scale = total_followers / 520000.0

        categories = [
            {
                "category": "AI & Tech",
                "contentTypes": ["Tutorials", "Reviews", "Vlogs"],
                "avgViews": int(480000 * scale),
                "avgLikes": int(42000 * scale),
                "avgComments": int(3100 * scale),
                "avgShares": int(1800 * scale),
                "avgWatchTimeSec": 340,
                "avgRevenue": round(2450.00 * scale, 2),
                "engagementRate": 9.4,
                "growthRate": 14.2,
                "uploadCount": 18,
                "consistencyScore": 95,
                "bestDay": "Tuesday",
                "bestTime": "5:00 PM EST"
            },
            {
                "category": "Educational",
                "contentTypes": ["Tutorials", "Podcasts"],
                "avgViews": int(320000 * scale),
                "avgLikes": int(26000 * scale),
                "avgComments": int(1900 * scale),
                "avgShares": int(1200 * scale),
                "avgWatchTimeSec": 450,
                "avgRevenue": round(1820.00 * scale, 2),
                "engagementRate": 8.1,
                "growthRate": 9.8,
                "uploadCount": 14,
                "consistencyScore": 88,
                "bestDay": "Thursday",
                "bestTime": "6:30 PM EST"
            },
            {
                "category": "Reviews & Unboxing",
                "contentTypes": ["Reviews", "Shorts"],
                "avgViews": int(290000 * scale),
                "avgLikes": int(21000 * scale),
                "avgComments": int(1500 * scale),
                "avgShares": int(850 * scale),
                "avgWatchTimeSec": 260,
                "avgRevenue": round(1950.00 * scale, 2),
                "engagementRate": 7.6,
                "growthRate": 8.5,
                "uploadCount": 12,
                "consistencyScore": 82,
                "bestDay": "Wednesday",
                "bestTime": "4:00 PM EST"
            },
            {
                "category": "Gaming & Live Streams",
                "contentTypes": ["Shorts", "Vlogs"],
                "avgViews": int(210000 * scale),
                "avgLikes": int(18000 * scale),
                "avgComments": int(1400 * scale),
                "avgShares": int(650 * scale),
                "avgWatchTimeSec": 520,
                "avgRevenue": round(1120.00 * scale, 2),
                "engagementRate": 8.8,
                "growthRate": 7.2,
                "uploadCount": 22,
                "consistencyScore": 92,
                "bestDay": "Friday",
                "bestTime": "8:00 PM EST"
            },
            {
                "category": "Shorts & Reels",
                "contentTypes": ["Shorts", "Reels"],
                "avgViews": int(620000 * scale),
                "avgLikes": int(54000 * scale),
                "avgComments": int(2200 * scale),
                "avgShares": int(4100 * scale),
                "avgWatchTimeSec": 45,
                "avgRevenue": round(680.00 * scale, 2),
                "engagementRate": 9.1,
                "growthRate": 18.5,
                "uploadCount": 35,
                "consistencyScore": 98,
                "bestDay": "Monday",
                "bestTime": "12:00 PM EST"
            },
            {
                "category": "Motivation & Self-Help",
                "contentTypes": ["Podcasts", "Shorts"],
                "avgViews": int(185000 * scale),
                "avgLikes": int(14000 * scale),
                "avgComments": int(920 * scale),
                "avgShares": int(780 * scale),
                "avgWatchTimeSec": 310,
                "avgRevenue": round(940.00 * scale, 2),
                "engagementRate": 8.0,
                "growthRate": 5.4,
                "uploadCount": 8,
                "consistencyScore": 76,
                "bestDay": "Sunday",
                "bestTime": "9:00 AM EST"
            },
            {
                "category": "Lifestyle & Vlogs",
                "contentTypes": ["Vlogs", "Lifestyle"],
                "avgViews": int(125000 * scale),
                "avgLikes": int(8900 * scale),
                "avgComments": int(610 * scale),
                "avgShares": int(320 * scale),
                "avgWatchTimeSec": 210,
                "avgRevenue": round(510.00 * scale, 2),
                "engagementRate": 7.2,
                "growthRate": 3.1,
                "uploadCount": 6,
                "consistencyScore": 68,
                "bestDay": "Saturday",
                "bestTime": "11:00 AM EST"
            }
        ]

        # Benchmarks
        best_category = max(categories, key=lambda c: c["avgViews"])
        worst_category = min(categories, key=lambda c: c["avgViews"])
        highest_rev_category = max(categories, key=lambda c: c["avgRevenue"])

        total_uploads = sum(c["uploadCount"] for c in categories)
        avg_consistency = round(sum(c["consistencyScore"] for c in categories) / len(categories))

        return {
            "summary": {
                "totalCategoriesAnalyzed": len(categories),
                "bestPerformingCategory": best_category["category"],
                "worstPerformingCategory": worst_category["category"],
                "highestRevenueCategory": highest_rev_category["category"],
                "bestPostingDay": "Tuesday",
                "bestPostingTime": "5:00 PM EST",
                "overallConsistencyScore": avg_consistency,
                "weeklyUploadFrequency": f"{max(1, total_uploads // 8)} videos / week"
            },
            "categories": categories
        }
