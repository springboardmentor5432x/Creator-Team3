from sqlalchemy.orm import Session
from fastapi import HTTPException
from sqlalchemy import func, desc, asc
from datetime import datetime, timedelta

from app.models.content import Content
from app.models.user import User
from app.auth.oauth2 import get_current_user


# -----------------------------
# Helper Function
# -----------------------------
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


# -----------------------------
# Create Content
# -----------------------------
def create_content(content, db: Session, current_user: User):
    # Calculate Engagement Rate
    if content.reach > 0:
        engagement_rate = (
            (
                content.likes
                + content.comments
                + content.shares
                + content.saves
            ) / content.reach
        ) * 100
    else:
        engagement_rate = 0

    new_content = Content(
        creator_id=current_user.id,
        title=content.title,
        thumbnail=content.thumbnail,
        platform=content.platform,
        description=content.description,
        content_type=content.content_type,
        publish_date=content.publish_date,
        views=content.views,
        likes=content.likes,
        comments=content.comments,
        shares=content.shares,
        saves=content.saves,
        watch_time=content.watch_time,
        reach=content.reach,
        engagement_rate=engagement_rate,
    )

    db.add(new_content)
    db.commit()
    db.refresh(new_content)

    return {
        "message": "Content added successfully",
        "content_id": new_content.id,
        "engagement_rate": round(engagement_rate, 2),
    }


# -----------------------------
# Serialize Content
# -----------------------------
def serialize_content(content: Content):
    return {
        "id": content.id,
        "title": content.title,
        "thumbnail": content.thumbnail,
        "platform": content.platform,
        "description": content.description,
        "content_type": content.content_type,
        "publish_date": content.publish_date,
        "views": content.views,
        "likes": content.likes,
        "comments": content.comments,
        "shares": content.shares,
        "saves": content.saves,
        "watch_time": content.watch_time,
        "reach": content.reach,
        "engagement_rate": round(content.engagement_rate or 0, 2),
        "created_at": (
            content.created_at.isoformat()
            if content.created_at
            else None
        ),
        "creator_id": content.creator_id,
    }


# -----------------------------
# Get All Content
# -----------------------------
def get_all_content(
    db: Session,
    current_user: User,
    platform=None,
    search=None,
    page=1,
    limit=10,
    sort_by="created_at",
    order="desc",
    period="30d",
):
    query = db.query(Content)

    # Creators can only view their own content
    if current_user.role == "creator":
        query = query.filter(
            Content.creator_id == current_user.id
        )

    # Platform Filter
    if platform:
        query = query.filter(
            Content.platform == platform
        )

    # Search by Title
    if search:
        query = query.filter(
            Content.title.ilike(f"%{search}%")
        )

    # Filter by Time Period
    start_date, end_date = _get_period_bounds(period)

    if start_date:
        query = query.filter(
            Content.created_at >= start_date
        )

    if end_date:
        query = query.filter(
            Content.created_at < end_date
        )

    # Allowed Sorting Fields
    allowed_sort_fields = {
        "views": Content.views,
        "likes": Content.likes,
        "comments": Content.comments,
        "shares": Content.shares,
        "saves": Content.saves,
        "watch_time": Content.watch_time,
        "reach": Content.reach,
        "engagement_rate": Content.engagement_rate,
        "publish_date": Content.publish_date,
        "created_at": Content.created_at,
    }

    sort_column = allowed_sort_fields.get(
        sort_by,
        Content.created_at
    )

    if order.lower() == "asc":
        query = query.order_by(asc(sort_column))
    else:
        query = query.order_by(desc(sort_column))

    total = query.count()

    results = (
        query.offset((page - 1) * limit)
        .limit(limit)
        .all()
    )

    return {
        "page": page,
        "limit": limit,
        "total": total,
        "data": [serialize_content(item) for item in results],
    }


# -----------------------------
# Delete Content
# -----------------------------
def delete_content(content_id: int, db: Session, current_user: User):

    content = (
        db.query(Content)
        .filter(Content.id == content_id)
        .first()
    )

    if not content:
        raise HTTPException(
            status_code=404,
            detail="Content not found"
        )

    if (
        current_user.role == "creator"
        and content.creator_id != current_user.id
    ):
        raise HTTPException(
            status_code=403,
            detail="Not authorized to delete this content"
        )

    db.delete(content)
    db.commit()

    return {
        "message": "Content deleted successfully"
    }


# -----------------------------
# Content Analytics Summary
# -----------------------------
def get_content_analytics(
    db: Session,
    current_user: User,
):
    query = db.query(Content)

    # Creators can only view their own analytics
    if current_user.role == "creator":
        query = query.filter(
            Content.creator_id == current_user.id
        )

    contents = query.all()

    if not contents:
        return {
            "message": "No content available."
        }

    total_posts = len(contents)
    total_views = sum(c.views or 0 for c in contents)
    total_likes = sum(c.likes or 0 for c in contents)
    total_comments = sum(c.comments or 0 for c in contents)
    total_shares = sum(c.shares or 0 for c in contents)
    total_saves = sum(c.saves or 0 for c in contents)
    total_watch_time = sum(c.watch_time or 0 for c in contents)
    total_reach = sum(c.reach or 0 for c in contents)

    avg_views = total_views / total_posts
    avg_likes = total_likes / total_posts
    avg_comments = total_comments / total_posts

    avg_engagement = (
        sum(c.engagement_rate or 0 for c in contents)
        / total_posts
    )

    best_post = max(
        contents,
        key=lambda c: c.engagement_rate or 0
    )

    worst_post = min(
        contents,
        key=lambda c: c.engagement_rate or 0
    )
    platform_distribution = {}

    for content in contents:
        platform_distribution[content.platform] = (
            platform_distribution.get(content.platform, 0) + 1
        )

    return {
        "summary": {
            "total_posts": total_posts,
            "total_views": total_views,
            "total_likes": total_likes,
            "total_comments": total_comments,
            "total_shares": total_shares,
            "total_saves": total_saves,
            "total_watch_time": round(total_watch_time, 2),
            "total_reach": total_reach,
        },

        "averages": {
            "average_views": round(avg_views, 2),
            "average_likes": round(avg_likes, 2),
            "average_comments": round(avg_comments, 2),
            "average_engagement_rate": round(avg_engagement, 2),
        },

        "best_post": {
            "title": best_post.title,
            "thumbnail": best_post.thumbnail,
            "platform": best_post.platform,
            "engagement_rate": round(best_post.engagement_rate, 2),
            "views": best_post.views,
            "likes": best_post.likes,
            "comments": best_post.comments,
            "shares": best_post.shares,
        },

        "worst_post": {
            "title": worst_post.title,
            "thumbnail": worst_post.thumbnail,
            "platform": worst_post.platform,
            "engagement_rate": round(worst_post.engagement_rate, 2),
            "views": worst_post.views,
            "likes": worst_post.likes,
            "comments": worst_post.comments,
            "shares": worst_post.shares,
        },

        "platform_distribution": platform_distribution,
    }


# -----------------------------
# Top Performing Content
# -----------------------------
def get_top_content(db: Session, current_user: User):

    query = db.query(Content)

    # Creators can only view their own content
    if current_user.role == "creator":
        query = query.filter(
            Content.creator_id == current_user.id
        )

    highest_views = query.order_by(
        Content.views.desc()
    ).first()

    highest_likes = query.order_by(
        Content.likes.desc()
    ).first()

    highest_comments = query.order_by(
        Content.comments.desc()
    ).first()

    highest_shares = query.order_by(
        Content.shares.desc()
    ).first()

    highest_watch_time = query.order_by(
        Content.watch_time.desc()
    ).first()

    highest_engagement = query.order_by(
        Content.engagement_rate.desc()
    ).first()

    return {
        "highest_views": {
            "title": highest_views.title if highest_views else None,
            "thumbnail": highest_views.thumbnail if highest_views else None,
            "platform": highest_views.platform if highest_views else None,
            "views": highest_views.views if highest_views else 0,
        },

        "highest_likes": {
            "title": highest_likes.title if highest_likes else None,
            "thumbnail": highest_likes.thumbnail if highest_likes else None,
            "platform": highest_likes.platform if highest_likes else None,
            "likes": highest_likes.likes if highest_likes else 0,
        },

        "highest_comments": {
            "title": highest_comments.title if highest_comments else None,
            "thumbnail": highest_comments.thumbnail if highest_comments else None,
            "platform": highest_comments.platform if highest_comments else None,
            "comments": highest_comments.comments if highest_comments else 0,
        },

        "highest_shares": {
            "title": highest_shares.title if highest_shares else None,
            "thumbnail": highest_shares.thumbnail if highest_shares else None,
            "platform": highest_shares.platform if highest_shares else None,
            "shares": highest_shares.shares if highest_shares else 0,
        },

        "highest_watch_time": {
            "title": highest_watch_time.title if highest_watch_time else None,
            "thumbnail": highest_watch_time.thumbnail if highest_watch_time else None,
            "platform": highest_watch_time.platform if highest_watch_time else None,
            "watch_time": highest_watch_time.watch_time if highest_watch_time else 0,
        },
        "highest_engagement_rate": {
            "title": highest_engagement.title if highest_engagement else None,
            "thumbnail": highest_engagement.thumbnail if highest_engagement else None,
            "platform": highest_engagement.platform if highest_engagement else None,
            "engagement_rate": round(
                highest_engagement.engagement_rate, 2
            ) if highest_engagement else 0,
        }
    }


# -----------------------------
# Platform Analytics
# -----------------------------
def get_platform_analytics(
    db: Session,
    current_user: User,
):

    query = db.query(Content)

    # Creators can only view their own analytics
    if current_user.role == "creator":
        query = query.filter(
            Content.creator_id == current_user.id
        )

    contents = query.all()

    platform_data = {}

    for content in contents:
        platform = content.platform

        if platform not in platform_data:
            platform_data[platform] = {
                "platform": platform,
                "posts": 0,
                "views": 0,
                "likes": 0,
                "comments": 0,
                "shares": 0,
                "saves": 0,
                "watch_time": 0,
                "reach": 0,
                "total_engagement": 0,
            }

        platform_data[platform]["posts"] += 1
        platform_data[platform]["views"] += content.views or 0
        platform_data[platform]["likes"] += content.likes or 0
        platform_data[platform]["comments"] += content.comments or 0
        platform_data[platform]["shares"] += content.shares or 0
        platform_data[platform]["saves"] += content.saves or 0
        platform_data[platform]["watch_time"] += content.watch_time or 0
        platform_data[platform]["reach"] += content.reach or 0
        platform_data[platform]["total_engagement"] += (
            content.engagement_rate or 0
        )

    result = []

    for platform in platform_data.values():

        avg_engagement = (
            platform["total_engagement"] / platform["posts"]
            if platform["posts"] > 0
            else 0
        )

        result.append({
            "platform": platform["platform"],
            "total_posts": platform["posts"],
            "total_views": platform["views"],
            "total_likes": platform["likes"],
            "total_comments": platform["comments"],
            "total_shares": platform["shares"],
            "total_saves": platform["saves"],
            "total_watch_time": round(
                platform["watch_time"], 2
            ),
            "total_reach": platform["reach"],
            "average_engagement_rate": round(
                avg_engagement, 2
            ),
        })

    return result


# -----------------------------
# Performance Trend Analysis
# -----------------------------
def get_content_trends(
    db: Session,
    current_user: User,
):

    query = db.query(Content)

    # Creators can only view their own content
    if current_user.role == "creator":
        query = query.filter(
            Content.creator_id == current_user.id
        )

    contents = (
        query.order_by(Content.publish_date.asc())
        .all()
    )

    trends = []

    for content in contents:

        trends.append({
            "date": (
                content.publish_date.strftime("%Y-%m-%d")
                if content.publish_date
                else None
            ),
            "title": content.title,
            "thumbnail": content.thumbnail,
            "platform": content.platform,
            "views": content.views,
            "likes": content.likes,
            "comments": content.comments,
            "shares": content.shares,
            "saves": content.saves,
            "watch_time": content.watch_time,
            "reach": content.reach,
            "engagement_rate": round(
                content.engagement_rate or 0,
                2
            ),
        })

    return trends


# -----------------------------
# Compare Content
# -----------------------------
def compare_content(
    db: Session,
    content1: int,
    content2: int,
    current_user: User,
):

    query = db.query(Content)

    # Creators can compare only their own content
    if current_user.role == "creator":
        query = query.filter(
            Content.creator_id == current_user.id
        )

    first = query.filter(
        Content.id == content1
    ).first()

    second = query.filter(
        Content.id == content2
    ).first()

    if not first or not second:
        raise HTTPException(
            status_code=404,
            detail="One or both content records not found."
        )

    return {
        "content_1": {
            "title": first.title,
            "thumbnail": first.thumbnail,
            "platform": first.platform,
            "publish_date": first.publish_date,
            "views": first.views,
            "likes": first.likes,
            "comments": first.comments,
            "shares": first.shares,
            "saves": first.saves,
            "watch_time": first.watch_time,
            "reach": first.reach,
            "engagement_rate": round(
                first.engagement_rate or 0,
                2
            ),
        },

        "content_2": {
            "title": second.title,
            "thumbnail": second.thumbnail,
            "platform": second.platform,
            "publish_date": second.publish_date,
            "views": second.views,
            "likes": second.likes,
            "comments": second.comments,
            "shares": second.shares,
            "saves": second.saves,
            "watch_time": second.watch_time,
            "reach": second.reach,
            "engagement_rate": round(
                second.engagement_rate or 0,
                2
            ),
        }
    }


# -----------------------------
# Update Content
# -----------------------------
def update_content(
    content_id: int,
    content_data,
    db: Session,
    current_user: User,
):

    content = (
        db.query(Content)
        .filter(Content.id == content_id)
        .first()
    )

    if not content:
        raise HTTPException(
            status_code=404,
            detail="Content not found"
        )

    if (
        current_user.role == "creator"
        and content.creator_id != current_user.id
    ):
        raise HTTPException(
            status_code=403,
            detail="Not authorized to update this content"
        )

    update_data = content_data.model_dump(
        exclude_unset=True
    )

    for key, value in update_data.items():
        setattr(content, key, value)

    # Recalculate Engagement Rate
    if content.reach and content.reach > 0:
        content.engagement_rate = (
            (
                (content.likes or 0)
                + (content.comments or 0)
                + (content.shares or 0)
                + (content.saves or 0)
            ) / content.reach
        ) * 100
    else:
        content.engagement_rate = 0

    db.commit()
    db.refresh(content)

    return {
        "message": "Content updated successfully",
        "content": serialize_content(content)
    }


# -----------------------------
# Get Content By ID
# -----------------------------
def get_content_by_id(
    content_id: int,
    db: Session,
):

    content = (
        db.query(Content)
        .filter(Content.id == content_id)
        .first()
    )

    if not content:
        raise HTTPException(
            status_code=404,
            detail="Content not found"
        )

    return serialize_content(content)


# -----------------------------
# Search Content
# -----------------------------
def search_content(
    title: str,
    db: Session,
):

    contents = (
        db.query(Content)
        .filter(Content.title.ilike(f"%{title}%"))
        .all()
    )

    return [
        serialize_content(content)
        for content in contents
    ]


# -----------------------------
# Filter Content
# -----------------------------
def filter_content(
    platform: str,
    db: Session,
):

    contents = (
        db.query(Content)
        .filter(Content.platform == platform)
        .all()
    )

    return [
        serialize_content(content)
        for content in contents
    ]


# -----------------------------
# Pagination
# -----------------------------
def get_paginated_content(
    page: int,
    limit: int,
    db: Session,
):

    offset = (page - 1) * limit

    total = db.query(Content).count()

    contents = (
        db.query(Content)
        .offset(offset)
        .limit(limit)
        .all()
    )

    return {
        "page": page,
        "limit": limit,
        "total_records": total,
        "total_pages": (
            (total + limit - 1) // limit
            if limit > 0 else 0
        ),
        "data": [
            serialize_content(content)
            for content in contents
        ]
    }


# -----------------------------
# Dashboard
# -----------------------------
def dashboard(
    db: Session,
    current_user: User,
):

    query = db.query(Content)

    if current_user.role == "creator":
        query = query.filter(
            Content.creator_id == current_user.id
        )

    contents = query.all()

    total_posts = len(contents)
    total_views = sum(
        content.views or 0
        for content in contents
    )

    total_likes = sum(
        content.likes or 0
        for content in contents
    )

    total_comments = sum(
        content.comments or 0
        for content in contents
    )
    total_shares = sum(
        content.shares or 0
        for content in contents
    )

    total_saves = sum(
        content.saves or 0
        for content in contents
    )

    total_watch_time = sum(
        content.watch_time or 0
        for content in contents
    )

    total_reach = sum(
        content.reach or 0
        for content in contents
    )

    average_engagement_rate = (
        round(
            sum(
                content.engagement_rate or 0
                for content in contents
            ) / total_posts,
            2
        )
        if total_posts > 0
        else 0
    )

    recent_posts = (
        query.order_by(
            Content.publish_date.desc()
        )
        .limit(5)
        .all()
    )

    return {
        "summary": {
            "total_posts": total_posts,
            "total_views": total_views,
            "total_likes": total_likes,
            "total_comments": total_comments,
            "total_shares": total_shares,
            "total_saves": total_saves,
            "total_watch_time": round(
                total_watch_time,
                2
            ),
            "total_reach": total_reach,
            "average_engagement_rate": average_engagement_rate,
        },

        "recent_posts": [
            serialize_content(post)
            for post in recent_posts
        ]
    }