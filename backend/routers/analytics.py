from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from database import get_db
from models import User, CreatorProfile, SocialAccount
from Auth import verify_token
from services.growth_service import GrowthService
from services.analytics_service import AnalyticsService
from services.analytics_aggregator import AnalyticsAggregator
from services.growth_aggregator import GrowthAggregator
from services.audience_aggregator import AudienceAggregator

from routers.user import get_or_create_user_from_token

router = APIRouter(prefix="/api/analytics", tags=["Analytics"])

@router.get("/aggregated")
def get_aggregated_dashboard(user=Depends(verify_token), db: Session = Depends(get_db)):
    db_user = get_or_create_user_from_token(user, db)
    return AnalyticsAggregator.get_aggregated_dashboard_data(db_user.id, db)

@router.get("/platform/{platform}")
def get_platform_dashboard(platform: str, handle: str = Query(None), user=Depends(verify_token), db: Session = Depends(get_db)):
    db_user = get_or_create_user_from_token(user, db)

    p_clean = platform.lower()
    if p_clean == "instagram":
        from models import InstagramAccount
        from services.instagram_analytics_service import InstagramAnalyticsService
        acc = db.query(InstagramAccount).filter(InstagramAccount.user_id == db_user.id).first()
        if acc and acc.connected_status == "connected":
            return InstagramAnalyticsService.get_live_profile_and_analytics(db_user.id, db)
        return {"connected": False, "platform": "Instagram", "message": "Connect your Instagram Professional Account via Meta OAuth."}

    elif p_clean == "twitter":
        from models import TwitterAccount
        acc = db.query(TwitterAccount).filter(TwitterAccount.user_id == db_user.id).first()
        if acc and acc.connected_status == "connected":
            return {
                "connected": True,
                "platform": "Twitter / X",
                "channel_name": acc.name or acc.username,
                "custom_url": f"@{acc.username}",
                "thumbnail_url": acc.profile_image_url,
                "followers": acc.followers_count,
                "following": acc.following_count,
                "tweets": acc.tweet_count,
                "impressions": acc.followers_count * 4,
                "retweets": int(acc.followers_count * 0.04),
                "likes": int(acc.followers_count * 0.10),
                "replies": int(acc.followers_count * 0.01),
                "engagement": 4.6
            }
        return {"connected": False, "platform": "Twitter", "message": "Connect your Twitter / X account via OAuth."}

    elif p_clean == "twitch":
        from models import TwitchAccount
        acc = db.query(TwitchAccount).filter(TwitchAccount.user_id == db_user.id).first()
        if acc and acc.connected_status == "connected":
            return {
                "connected": True,
                "platform": "Twitch",
                "channel_name": acc.display_name or acc.login,
                "custom_url": f"@{acc.login}",
                "thumbnail_url": acc.profile_image_url,
                "followers": acc.followers_count,
                "subscribers": acc.subscriber_count,
                "views": acc.view_count,
                "peak_viewers": 3400,
                "avg_viewers": 1280,
                "hours_watched": 420,
                "streams_count": 18
            }
        return {"connected": False, "platform": "Twitch", "message": "Connect your Twitch account via OAuth."}

    elif p_clean == "youtube":
        from services.youtube_service import YouTubeService
        yt = YouTubeService()
        if handle:
            return yt.get_channel_details(handle)
        
        profile = db.query(CreatorProfile).filter(CreatorProfile.user_id == db_user.id).first()
        social_acc = db.query(SocialAccount).filter(SocialAccount.creator_id == profile.creator_id, SocialAccount.platform == "YouTube").first() if profile else None
        target_handle = social_acc.account_name if social_acc else ""
        return yt.get_channel_details(target_handle)

    else:
        return {"connected": False, "platform": platform.title(), "message": f"{platform.title()} account not connected."}

@router.get("")
def get_analytics(user=Depends(verify_token), db: Session = Depends(get_db)):
    email = user.get("Email")
    db_user = db.query(User).filter(User.Email == email).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    return AnalyticsAggregator.get_aggregated_dashboard_data(db_user.id, db)

@router.get("/views")
def get_views(user=Depends(verify_token)):
    return [
        {"month": "Jul 2025", "views": 580000, "likes": 85000, "comments": 6200, "shares": 3100},
        {"month": "Aug 2025", "views": 610000, "likes": 92000, "comments": 7200, "shares": 3400},
        {"month": "Sep 2025", "views": 590000, "likes": 88000, "comments": 6900, "shares": 3200},
        {"month": "Oct 2025", "views": 640000, "likes": 95000, "comments": 7500, "shares": 3600},
        {"month": "Nov 2025", "views": 680000, "likes": 101000, "comments": 7800, "shares": 3900},
        {"month": "Dec 2025", "views": 790000, "likes": 118000, "comments": 8400, "shares": 4800},
        {"month": "Jan 2026", "views": 720000, "likes": 105000, "comments": 8100, "shares": 4100},
        {"month": "Feb 2026", "views": 750000, "likes": 110000, "comments": 8300, "shares": 4300},
        {"month": "Mar 2026", "views": 810000, "likes": 122000, "comments": 8900, "shares": 4700},
        {"month": "Apr 2026", "views": 880000, "likes": 130000, "comments": 9400, "shares": 5100},
        {"month": "May 2026", "views": 920000, "likes": 138000, "comments": 9900, "shares": 5400},
        {"month": "Jun 2026", "views": 950000, "likes": 142000, "comments": 10100, "shares": 5600}
    ]

@router.get("/followers")
def get_followers(user=Depends(verify_token)):
    return [
        {"month": "Jul 2025", "count": 1010000, "netGain": 12000},
        {"month": "Aug 2025", "count": 1032000, "netGain": 22000},
        {"month": "Sep 2025", "count": 1051000, "netGain": 19000},
        {"month": "Oct 2025", "count": 1074000, "netGain": 23000},
        {"month": "Nov 2025", "count": 1098000, "netGain": 24000},
        {"month": "Dec 2025", "count": 1130000, "netGain": 32000},
        {"month": "Jan 2026", "count": 1152000, "netGain": 22000},
        {"month": "Feb 2026", "count": 1175000, "netGain": 23000},
        {"month": "Mar 2026", "count": 1198000, "netGain": 23000},
        {"month": "Apr 2026", "count": 1221000, "netGain": 23000},
        {"month": "May 2026", "count": 1240000, "netGain": 19000},
        {"month": "Jun 2026", "count": 1254300, "netGain": 14300}
    ]

@router.get("/audience")
def get_audience(platform: str = Query("overall"), user=Depends(verify_token), db: Session = Depends(get_db)):
    email = user.get("Email")
    db_user = db.query(User).filter(User.Email == email).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    return AudienceAggregator.get_audience_data(db_user.id, platform, db)

@router.get("/trending")
def get_trending(user=Depends(verify_token)):
    return [
        {"title": "Summer Reel", "platform": "Instagram", "views": "2.4M"},
        {"title": "Tech Review", "platform": "YouTube", "views": "1.8M"},
        {"title": "Travel Vlog", "platform": "TikTok", "views": "1.5M"}
    ]

@router.get("/top-content")
def get_top_content(user=Depends(verify_token)):
    return [
        {"title": "Summer Reel", "platform": "Instagram", "views": "2.4M", "engagement": "9.4%"},
        {"title": "Tech Review", "platform": "YouTube", "views": "1.8M", "engagement": "8.2%"},
        {"title": "Product Launch", "platform": "LinkedIn", "views": "1.3M", "engagement": "7.8%"}
    ]

@router.get("/compare")
def get_compare_content(user=Depends(verify_token)):
    return {
        "left": {"title": "Summer Reel", "views": "2.4M", "engagement": "9.4%"},
        "right": {"title": "Tech Review", "views": "1.8M", "engagement": "8.2%"}
    }

@router.get("/insights")
def get_ai_insights(user=Depends(verify_token), db: Session = Depends(get_db)):
    email = user.get("Email")
    db_user = db.query(User).filter(User.Email == email).first()
    if not db_user:
        return [
            "📈 Aggregated community engagement increased by 12% across all channels.",
            "🎥 YouTube Shorts and Instagram Reels generate 64% of top-of-funnel reach.",
            "🕒 Your optimal cross-posting window is Tuesday and Thursday at 7 PM EST.",
            "⭐ Multi-channel subscriber retention improved by +8.4% this month."
        ]

    agg = AnalyticsAggregator.get_aggregated_dashboard_data(db_user.id, db)
    return agg.get("insights", [])

@router.get("/real-growth")
def get_real_growth_analytics_api(platform: str = Query("overall"), timeframe: str = Query("monthly"), user=Depends(verify_token), db: Session = Depends(get_db)):
    email = user.get("Email")
    db_user = db.query(User).filter(User.Email == email).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    return GrowthAggregator.get_growth_data(db_user.id, platform, timeframe, db)

@router.get("/content-intelligence")
def get_content_intelligence_api(user=Depends(verify_token), db: Session = Depends(get_db)):
    email = user.get("Email")
    db_user = db.query(User).filter(User.Email == email).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    from services.content_intelligence_service import ContentIntelligenceService
    return ContentIntelligenceService.get_content_intelligence(db_user.id, db)
