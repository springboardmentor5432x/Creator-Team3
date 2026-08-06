from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, timedelta

from app.models.content import Content
from app.models.user import User
from app.database import SessionLocal
from app.models.post import InstagramPost
from app.services.instagram_service import get_profile
from app.models.audience_history import AudienceHistory


def _get_period_bounds(period: str | None = None):
    if not period:
        return None, None

    key = (period or "30d").lower()
    now = datetime.utcnow()

    if key in {"7d", "7", "last7", "last7days"}:
        return now - timedelta(days=7), now
    if key in {"30d", "30", "last30", "last30days"}:
        return now - timedelta(days=30), now
    if key in {"90d", "90", "last90", "last90days"}:
        return now - timedelta(days=90), now
    if key in {"prev7d", "previous7d"}:
        return now - timedelta(days=14), now - timedelta(days=7)
    if key in {"prev30d", "previous30d"}:
        return now - timedelta(days=60), now - timedelta(days=30)
    if key in {"prev90d", "previous90d"}:
        return now - timedelta(days=180), now - timedelta(days=90)

    return None, None


def get_dashboard_summary(db: Session, current_user: "User", period: str = "30d"):
    if current_user.role == "creator":
        q = db.query(Content).filter(Content.creator_id == current_user.id)
    else:
        q = db.query(Content)

    start_date, end_date = _get_period_bounds(period)
    if start_date:
        q = q.filter(Content.created_at >= start_date)
    if end_date:
        q = q.filter(Content.created_at < end_date)

    total_posts = q.count()

    total_views = q.with_entities(func.sum(Content.views)).scalar() or 0

    total_likes = q.with_entities(func.sum(Content.likes)).scalar() or 0

    engagement_rate = 0

    if total_views > 0:
        engagement_rate = round(
            (total_likes / total_views) * 100,
            2
        )

    return {
        "total_posts": total_posts,
        "total_views": total_views,
        "total_likes": total_likes,
        "engagement_rate": engagement_rate
    }

def get_instagram_dashboard():
    db = SessionLocal()

    try:
        profile = get_profile()

        posts = db.query(InstagramPost).all()
        total_likes = sum(p.like_count for p in posts)
        total_comments = sum(p.comments_count for p in posts)
        total_views = sum(p.reach or 0 for p in posts)

        if total_views == 0:
            total_views = sum((p.like_count or 0) + (p.comments_count or 0) for p in posts)

        avg_engagement = round(
            sum(p.engagement_rate for p in posts) / len(posts),
            2
        ) if posts else 0

        images = sum(1 for p in posts if p.media_type == "IMAGE")
        videos = sum(1 for p in posts if p.media_type == "VIDEO")
        reels = sum(1 for p in posts if p.media_type == "REEL")

        return {
            "username": profile.get("username"),
            "name": profile.get("name"),
            "followers": profile.get("followers_count", 0),
            "following": profile.get("follows_count", 0),
            "total_posts": len(posts),
            "total_views": total_views,
            "total_likes": total_likes,
            "total_comments": total_comments,
            "average_engagement": avg_engagement,
            "images": images,
            "videos": videos,
            "reels": reels
        }

    finally:
        db.close()

def get_dashboard_data():
    db: Session = SessionLocal()

    try:
        posts = db.query(InstagramPost).all()

        total_posts = len(posts)
        total_likes = sum(p.like_count for p in posts)
        total_comments = sum(p.comments_count for p in posts)

        avg_engagement = round(
            sum(p.engagement_rate for p in posts) / total_posts,
            2
        ) if total_posts else 0

        best_post = None

        if posts:
            best = max(
                posts,
                key=lambda p: p.like_count + p.comments_count
            )

            best_post = {
                "media_id": best.media_id,
                "likes": best.like_count,
                "comments": best.comments_count,
                "engagement_rate": best.engagement_rate
            }

        history = (
            db.query(AudienceHistory)
            .order_by(AudienceHistory.recorded_at.asc())
            .all()
        )

        growth = 0

        if len(history) >= 2:
            growth = history[-1].followers - history[0].followers

        return {
            "overview": {
                "total_posts": total_posts,
                "total_likes": total_likes,
                "total_comments": total_comments,
                "average_engagement": avg_engagement
            },
            "audience": {
                "follower_growth": growth,
                "current_followers": history[-1].followers if history else 0
            },
            "top_post": best_post
        }

    finally:
        db.close()