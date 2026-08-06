import os
import requests
from dotenv import load_dotenv
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models.post import InstagramPost
from app.models.audience_history import AudienceHistory
load_dotenv()

APP_ID = os.getenv("INSTAGRAM_APP_ID")
APP_SECRET = os.getenv("INSTAGRAM_APP_SECRET")
REDIRECT_URI = os.getenv("INSTAGRAM_REDIRECT_URI")
PAGE_TOKEN = os.getenv("PAGE_ACCESS_TOKEN")
IG_ID = os.getenv("INSTAGRAM_BUSINESS_ID")

def exchange_code_for_token(code: str):
    url = "https://graph.facebook.com/v25.0/oauth/access_token"

    params = {
        "client_id": APP_ID,
        "client_secret": APP_SECRET,
        "redirect_uri": REDIRECT_URI,
        "code": code,
    }

    response = requests.get(url, params=params)

    return response.json()

def get_profile():

    url = f"https://graph.facebook.com/v25.0/{IG_ID}"

    params = {
        "fields":
        "username,name,followers_count,follows_count,media_count,profile_picture_url",

        "access_token": PAGE_TOKEN
    }

    return requests.get(url, params=params).json()

def get_posts():

    url = f"https://graph.facebook.com/v25.0/{IG_ID}/media"

    params = {
        "fields":
"id,caption,media_type,media_url,permalink,timestamp,like_count,comments_count",

        "access_token": PAGE_TOKEN
    }

    response = requests.get(url, params=params)
    return response.json()

def sync_posts():
    db: Session = SessionLocal()

    try:
        posts = get_posts()

        if "data" not in posts:
            return posts

        saved = 0

        for post in posts["data"]:

            existing = db.query(InstagramPost).filter(
                InstagramPost.media_id == post["id"]
            ).first()

            if existing:
                continue

            likes = post.get("like_count", 0)
            comments = post.get("comments_count", 0)

            engagement = 0.0
            followers = get_profile().get("followers_count", 0)

            if followers > 0:
                engagement = ((likes + comments) / followers) * 100

            new_post = InstagramPost(
                media_id=post["id"],
                caption=post.get("caption"),
                media_type=post.get("media_type"),
                media_url=post.get("media_url"),
                permalink=post.get("permalink"),
                timestamp=post.get("timestamp"),

                like_count=likes,
                comments_count=comments,
                engagement_rate=round(engagement, 2)
            )

            db.add(new_post)
            saved += 1

        db.commit()

        return {
            "message": "Posts synchronized successfully",
            "new_posts_saved": saved
        }

    finally:
        db.close()


def get_saved_posts():
    db = SessionLocal()

    try:
        posts = db.query(InstagramPost).all()

        return [
            {
                "media_id": p.media_id,
                "caption": p.caption,
                "media_type": p.media_type,
                "media_url": p.media_url,
                "permalink": p.permalink,
                "timestamp": p.timestamp,
                "like_count": p.like_count,
                "comments_count": p.comments_count,
                "reach": p.reach,
                "impressions": p.impressions,
                "saved": p.saved,
                "engagement_rate": p.engagement_rate,
            }
            for p in posts
        ]

    finally:
        db.close()

def get_analytics():
    db = SessionLocal()

    try:
        posts = db.query(InstagramPost).all()

        total_posts = len(posts)
        total_likes = sum(post.like_count for post in posts)
        total_comments = sum(post.comments_count for post in posts)
        total_views = sum(post.reach or 0 for post in posts)

        if total_views == 0:
            total_views = sum((post.like_count or 0) + (post.comments_count or 0) for post in posts)

        avg_engagement = 0

        if total_posts > 0:
            avg_engagement = round(
                sum(post.engagement_rate for post in posts) / total_posts,
                2
            )

        top_post = None

        if posts:
            best = max(
                posts,
                key=lambda p: p.like_count + p.comments_count
            )

            top_post = {
                "media_id": best.media_id,
                "caption": best.caption,
                "likes": best.like_count,
                "comments": best.comments_count,
                "engagement_rate": best.engagement_rate
            }

        return {
            "total_posts": total_posts,
            "total_views": total_views,
            "total_likes": total_likes,
            "total_comments": total_comments,
            "average_engagement": avg_engagement,
            "top_post": top_post
        }

    finally:
        db.close()


def save_audience_snapshot():
    db = SessionLocal()

    try:
        profile = get_profile()

        snapshot = AudienceHistory(
            followers=profile.get("followers_count", 0),
            following=profile.get("follows_count", 0)
        )

        db.add(snapshot)
        db.commit()

        return {
            "message": "Audience snapshot saved"
        }

    finally:
        db.close()

def get_audience_growth():
    db = SessionLocal()

    try:
        history = (
            db.query(AudienceHistory)
            .order_by(AudienceHistory.recorded_at.asc())
            .all()
        )

        if len(history) < 2:
            return {
                "message": "Not enough audience history."
            }

        first = history[0]
        latest = history[-1]

        follower_growth = latest.followers - first.followers
        following_growth = latest.following - first.following

        growth_percent = 0

        if first.followers > 0:
            growth_percent = round(
                (follower_growth / first.followers) * 100,
                2
            )

        return {
            "starting_followers": first.followers,
            "current_followers": latest.followers,
            "follower_growth": follower_growth,
            "growth_percentage": growth_percent,
            "following_growth": following_growth,
            "total_snapshots": len(history)
        }

    finally:
        db.close()

def get_post_trends():
    db = SessionLocal()

    try:
        posts = db.query(InstagramPost).all()

        if not posts:
            return {"message": "No posts found"}

        best_post = max(
            posts,
            key=lambda p: p.like_count + p.comments_count
        )

        worst_post = min(
            posts,
            key=lambda p: p.like_count + p.comments_count
        )

        most_liked = max(
            posts,
            key=lambda p: p.like_count
        )

        most_commented = max(
            posts,
            key=lambda p: p.comments_count
        )

        ranking = sorted(
            posts,
            key=lambda p: p.engagement_rate,
            reverse=True
        )

        return {
            "best_performing_post": {
                "media_id": best_post.media_id,
                "likes": best_post.like_count,
                "comments": best_post.comments_count,
                "engagement_rate": best_post.engagement_rate
            },

            "worst_performing_post": {
                "media_id": worst_post.media_id,
                "likes": worst_post.like_count,
                "comments": worst_post.comments_count,
                "engagement_rate": worst_post.engagement_rate
            },

            "most_liked_post": {
                "media_id": most_liked.media_id,
                "likes": most_liked.like_count
            },

            "most_commented_post": {
                "media_id": most_commented.media_id,
                "comments": most_commented.comments_count
            },

            "engagement_ranking": [
                {
                    "media_id": post.media_id,
                    "engagement_rate": post.engagement_rate
                }
                for post in ranking
            ]
        }

    finally:
        db.close()