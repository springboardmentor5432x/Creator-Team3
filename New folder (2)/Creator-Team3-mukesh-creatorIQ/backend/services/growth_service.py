from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from models import ContentLink, Growth, CreatorProfile, SocialAccount
from services.platform_service import PlatformService

class GrowthService:
    @classmethod
    def get_growth_data(cls, user_id: int, db: Session):
        profile = db.query(CreatorProfile).filter(CreatorProfile.user_id == user_id).first()
        if not profile:
            return []
            
        accounts = db.query(SocialAccount).filter(SocialAccount.creator_id == profile.creator_id).all()
        if not accounts:
            return []

        total_followers = sum(a.followers for a in accounts)
        connected_platforms = [a.platform for a in accounts]
        
        # Calculate current views from active platforms
        links = db.query(ContentLink).filter(
            ContentLink.user_id == user_id,
            ContentLink.platform.in_(connected_platforms)
        ).all()
        
        total_views = sum(l.views for l in links)
        if total_views == 0:
            total_views = total_followers * 15 # fallback views estimate

        # Baseline anchors
        baseline_followers = 520000.0
        baseline_views = 4200000.0
        
        followers_scale = total_followers / baseline_followers
        views_scale = total_views / baseline_views

        records = db.query(Growth).filter(Growth.user_id == user_id).order_by(Growth.date).all()
        
        # Seed initial growth template if empty
        if not records:
            now = datetime.utcnow()
            default_g = [
                Growth(user_id=user_id, date=now - timedelta(days=150), followers=502000, views=3500000, reach=4800000, engagement_rate=4.1, growth_percentage=2.1),
                Growth(user_id=user_id, date=now - timedelta(days=120), followers=508000, views=3650000, reach=4920000, engagement_rate=4.2, growth_percentage=1.2),
                Growth(user_id=user_id, date=now - timedelta(days=90), followers=512000, views=3820000, reach=5100000, engagement_rate=4.5, growth_percentage=0.8),
                Growth(user_id=user_id, date=now - timedelta(days=60), followers=515000, views=3990000, reach=5250000, engagement_rate=4.7, growth_percentage=0.6),
                Growth(user_id=user_id, date=now - timedelta(days=30), followers=518000, views=4120000, reach=5380000, engagement_rate=5.2, growth_percentage=0.6),
                Growth(user_id=user_id, date=now - timedelta(days=5), followers=520000, views=4200000, reach=5420000, engagement_rate=5.6, growth_percentage=0.4)
            ]
            for g in default_g:
                db.add(g)
            db.commit()
            records = db.query(Growth).filter(Growth.user_id == user_id).order_by(Growth.date).all()

        return [
            {
                "id": r.id,
                "date": r.date.strftime("%Y-%m-%d"),
                "followers": int(r.followers * followers_scale),
                "views": int(r.views * views_scale),
                "reach": int(r.reach * followers_scale * 1.1),
                "engagementRate": r.engagement_rate,
                "growthPercentage": r.growth_percentage
            }
            for r in records
        ]

    @classmethod
    def get_content_type_analysis(cls, user_id: int, db: Session):
        profile = db.query(CreatorProfile).filter(CreatorProfile.user_id == user_id).first()
        if not profile:
            return []
        accounts = db.query(SocialAccount).filter(SocialAccount.creator_id == profile.creator_id).all()
        if not accounts:
            return []
            
        total_followers = sum(a.followers for a in accounts)
        scale = total_followers / 520000.0

        categories = [
            {"type": "AI & Tech", "avgViews": int(450000 * scale), "avgLikes": int(38000 * scale), "avgComments": int(2800 * scale), "avgWatchTime": 320, "avgEngagement": 9.1, "growthRate": 12.4, "revenue": round(2025.00 * scale, 2)},
            {"type": "Product Reviews", "avgViews": int(280000 * scale), "avgLikes": int(19000 * scale), "avgComments": int(1400 * scale), "avgWatchTime": 240, "avgEngagement": 7.3, "growthRate": 8.1, "revenue": round(1680.00 * scale, 2)},
            {"type": "Educational", "avgViews": int(190000 * scale), "avgLikes": int(12000 * scale), "avgComments": int(850 * scale), "avgWatchTime": 410, "avgEngagement": 6.8, "growthRate": 5.2, "revenue": round(855.00 * scale, 2)},
            {"type": "Vlogs", "avgViews": int(120000 * scale), "avgLikes": int(8500 * scale), "avgComments": int(620 * scale), "avgWatchTime": 180, "avgEngagement": 7.6, "growthRate": 3.8, "revenue": round(540.00 * scale, 2)},
            {"type": "Lifestyle", "avgViews": int(95000 * scale), "avgLikes": int(6100 * scale), "avgComments": int(420 * scale), "avgWatchTime": 150, "avgEngagement": 6.9, "growthRate": 2.1, "revenue": round(285.00 * scale, 2)}
        ]
        return categories

    @classmethod
    def get_consistency_metrics(cls, user_id: int, db: Session):
        profile = db.query(CreatorProfile).filter(CreatorProfile.user_id == user_id).first()
        if not profile:
            return {"consistencyScore": 0, "weeklyUploads": 0, "monthlyUploads": 0}
            
        accounts = db.query(SocialAccount).filter(SocialAccount.creator_id == profile.creator_id).all()
        if not accounts:
            return {"consistencyScore": 0, "weeklyUploads": 0, "monthlyUploads": 0}
            
        connected_platforms = [a.platform for a in accounts]
        links = db.query(ContentLink).filter(
            ContentLink.user_id == user_id,
            ContentLink.platform.in_(connected_platforms)
        ).all()
        
        total_uploads = len(links)
        
        weekly_uploads = max(1, total_uploads // 4) if total_uploads > 0 else 0
        monthly_uploads = total_uploads
        missed = 0 if total_uploads > 8 else 2
        consistency_score = 100 if missed == 0 else 85
            
        return {
            "uploadFrequency": f"{weekly_uploads} videos / week" if weekly_uploads > 0 else "0 uploads / week",
            "missedUploads": missed,
            "consistencyScore": consistency_score,
            "weeklyUploads": weekly_uploads,
            "monthlyUploads": monthly_uploads
        }

    @classmethod
    def get_growth_trends_analysis(cls, user_id: int, db: Session):
        profile = db.query(CreatorProfile).filter(CreatorProfile.user_id == user_id).first()
        if not profile:
            return {}
        accounts = db.query(SocialAccount).filter(SocialAccount.creator_id == profile.creator_id).all()
        if not accounts:
            return {}
            
        connected_platforms = [a.platform for a in accounts]
        fastest = connected_platforms[0] if connected_platforms else "None"
        
        return {
            "bestMonth": "December 2025",
            "worstMonth": "September 2025",
            "fastestPlatform": fastest,
            "slowestPlatform": connected_platforms[-1] if connected_platforms else "None",
            "highestEngagementMonth": "June 2026",
            "mostViewedMonth": "December 2025",
            "bestUploadDay": "Thursday",
            "bestUploadTime": "6:00 PM EST",
            "bestPerformingCategory": "AI & Tech",
            "worstPerformingCategory": "Lifestyle"
        }
