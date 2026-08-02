from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from jose import jwt, JWTError

from database import get_db
from models import Analytics, User
from Auth import check_role

router = APIRouter(
    prefix="/api/analytics",
    tags=["Analytics"]
)

SECRET_KEY = "creatoriq_secret_key"
ALGORITHM = "HS256"

security = HTTPBearer()


# -----------------------------
# Verify JWT Token
# -----------------------------
def verify_token(
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    token = credentials.credentials

    try:
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )
        return payload

    except JWTError:
        raise HTTPException(
            status_code=401,
            detail="Invalid Token"
        )


# -----------------------------
# Overall Analytics Dashboard
# -----------------------------
@router.get("/")
def get_analytics(
    user=Depends(verify_token),
    db: Session = Depends(get_db)
):

    check_role(
    user,
    ["creator", "administrator"]
)

    email = user.get("Email")

    current_user = db.query(User).filter(
        User.Email == email
    ).first()

    if not current_user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    analytics = db.query(Analytics).filter(
        Analytics.user_id == current_user.id
    ).all()

    return analytics


# -----------------------------
# Platform Analytics
# -----------------------------
@router.get("/platform/{platform_name}")
def get_platform_analytics(
    platform_name: str,
    user=Depends(verify_token),
    db: Session = Depends(get_db)
):
    check_role(
    user,
    ["creator", "administrator"]
)

    email = user.get("Email")

    current_user = db.query(User).filter(
        User.Email == email
    ).first()

    if not current_user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    data = db.query(Analytics).filter(
        Analytics.user_id == current_user.id,
        Analytics.platform == platform_name
    ).all()

    return data


# -----------------------------
# Views Trend
# -----------------------------
@router.get("/views")
def get_views(
    user=Depends(verify_token),
    db: Session = Depends(get_db)
):
    check_role(
    user,
    ["creator", "administrator"]
)

    email = user.get("Email")

    current_user = db.query(User).filter(
        User.Email == email
    ).first()

    if not current_user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    data = db.query(Analytics).filter(
        Analytics.user_id == current_user.id
    ).all()

    return [
        {
            "date": item.created_at,
            "platform": item.platform,
            "views": item.views
        }
        for item in data
    ]


# -----------------------------
# Followers Growth
# -----------------------------
@router.get("/followers")
def get_followers(
    user=Depends(verify_token),
    db: Session = Depends(get_db)
):
    check_role(
    user,
    ["creator", "administrator"]
)
    email = user.get("Email")

    current_user = db.query(User).filter(
        User.Email == email
    ).first()

    if not current_user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    data = db.query(Analytics).filter(
        Analytics.user_id == current_user.id
    ).all()

    return [
        {
            "date": item.created_at,
            "platform": item.platform,
            "followers": item.followers
        }
        for item in data
    ]

# -----------------------------
# Audience Engagement Insights
# -----------------------------
@router.get("/engagement")
def get_engagement(
    user=Depends(verify_token),
    db: Session = Depends(get_db)
):
    check_role(
        user,
        ["creator", "administrator"]
    )

    email = user.get("Email")

    current_user = db.query(User).filter(
        User.Email == email
    ).first()

    if not current_user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    data = db.query(Analytics).filter(
        Analytics.user_id == current_user.id
    ).order_by(
        Analytics.created_at
    ).all()

    return [
        {
            "date": item.created_at,
            "platform": item.platform,
            "likes": item.likes,
            "comments": item.comments,
            "shares": item.shares,
            "saves": item.saves,
            "engagement_rate": item.engagement_rate
        }
        for item in data
    ]
# -----------------------------
# Engagement Summary
# -----------------------------
@router.get("/engagement-summary")
def get_engagement_summary(
    user=Depends(verify_token),
    db: Session = Depends(get_db)
):
    check_role(
        user,
        ["creator", "administrator"]
    )

    email = user.get("Email")

    current_user = db.query(User).filter(
        User.Email == email
    ).first()

    if not current_user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    data = db.query(Analytics).filter(
        Analytics.user_id == current_user.id
    ).all()

    if not data:
        return {
            "total_likes": 0,
            "total_comments": 0,
            "total_shares": 0,
            "total_saves": 0,
            "average_engagement_rate": 0
        }

    total_likes = sum(item.likes or 0 for item in data)

    total_comments = sum(item.comments or 0 for item in data)

    total_shares = sum(item.shares or 0 for item in data)

    total_saves = sum(item.saves or 0 for item in data)

    average_engagement = (
        sum(item.engagement_rate or 0 for item in data)
        / len(data)
    )

    return {
        "total_likes": total_likes,
        "total_comments": total_comments,
        "total_shares": total_shares,
        "total_saves": total_saves,
        "average_engagement_rate": round(average_engagement, 2)
    }

# -----------------------------
# Reach & Impressions Analysis
# -----------------------------
@router.get("/reach")
def get_reach(
    user=Depends(verify_token),
    db: Session = Depends(get_db)
):
    check_role(
        user,
        ["creator", "administrator"]
    )

    email = user.get("Email")

    current_user = db.query(User).filter(
        User.Email == email
    ).first()

    if not current_user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    data = db.query(Analytics).filter(
        Analytics.user_id == current_user.id
    ).order_by(
        Analytics.created_at
    ).all()

    return [
        {
            "date": item.created_at,
            "platform": item.platform,
            "reach": item.reach,
            "impressions": item.impressions,
            "unique_viewers": item.unique_viewers,
            "views": item.views
        }
        for item in data
    ]
# -----------------------------
# Reach Summary
# -----------------------------
@router.get("/reach-summary")
def get_reach_summary(
    user=Depends(verify_token),
    db: Session = Depends(get_db)
):
    check_role(
        user,
        ["creator", "administrator"]
    )

    email = user.get("Email")

    current_user = db.query(User).filter(
        User.Email == email
    ).first()

    if not current_user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    data = db.query(Analytics).filter(
        Analytics.user_id == current_user.id
    ).all()

    if not data:
        return {
            "total_reach": 0,
            "total_impressions": 0,
            "total_unique_viewers": 0
        }

    total_reach = sum(item.reach or 0 for item in data)

    total_impressions = sum(item.impressions or 0 for item in data)

    total_unique_viewers = sum(item.unique_viewers or 0 for item in data)

    return {
        "total_reach": total_reach,
        "total_impressions": total_impressions,
        "total_unique_viewers": total_unique_viewers
    }
# -----------------------------
# Performance Trends
# -----------------------------
@router.get("/trends")
def get_trends(
    user=Depends(verify_token),
    db: Session = Depends(get_db)
):
    check_role(
    user,
    ["creator", "administrator"]
)

    email = user.get("Email")

    current_user = db.query(User).filter(
        User.Email == email
    ).first()


    if not current_user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )


    data = db.query(Analytics).filter(
        Analytics.user_id == current_user.id
    ).order_by(
        Analytics.created_at
    ).all()


    return [
        {
            "date": item.created_at,
            "platform": item.platform,
            "views": item.views,
            "followers": item.followers,
            "reach": item.reach,
            "engagement_rate": item.engagement_rate,
            "impressions":item.impressions
        }
        for item in data
    ]
# -----------------------------
# Analytics Summary KPI
# -----------------------------
@router.get("/summary")
def get_analytics_summary(
    user=Depends(verify_token),
    db: Session = Depends(get_db)
):
    check_role(
    user,
    ["creator", "administrator"]
)

    email = user.get("Email")

    current_user = db.query(User).filter(
        User.Email == email
    ).first()

    if not current_user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )


    data = db.query(Analytics).filter(
        Analytics.user_id == current_user.id
    ).all()


    if not data:
        return {
            "total_views": 0,
            "total_likes": 0,
            "total_comments": 0,
            "total_shares": 0,
            "total_reach": 0,
            "average_engagement_rate": 0
        }


    total_views = sum(
        item.views or 0 for item in data
    )

    total_likes = sum(
        item.likes or 0 for item in data
    )

    total_comments = sum(
        item.comments or 0 for item in data
    )

    total_shares = sum(
        item.shares or 0 for item in data
    )

    total_reach = sum(
        item.reach or 0 for item in data
    )


    avg_engagement = sum(
        item.engagement_rate or 0 for item in data
    ) / len(data)


    return {
        "total_views": total_views,
        "total_likes": total_likes,
        "total_comments": total_comments,
        "total_shares": total_shares,
        "total_reach": total_reach,
        "average_engagement_rate": round(avg_engagement, 2)
    }
# -----------------------------
# Top Performing Content
# -----------------------------
@router.get("/top-content")
def get_top_content(
    user=Depends(verify_token),
    db: Session = Depends(get_db)
):
    check_role(
    user,
    ["creator", "administrator"]
)

    email = user.get("Email")

    current_user = db.query(User).filter(
        User.Email == email
    ).first()

    if not current_user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )


    data = db.query(Analytics).filter(
        Analytics.user_id == current_user.id
    ).order_by(
        Analytics.views.desc()
    ).limit(5).all()


    return [
        {
            "platform": item.platform,
            "views": item.views,
            "likes": item.likes,
            "comments": item.comments,
            "shares": item.shares,
            "reach": item.reach,
            "engagement_rate": item.engagement_rate
        }
        for item in data
    ]
# -----------------------------
# Content Comparison
# -----------------------------
@router.get("/compare")
def compare_content(
    user=Depends(verify_token),
    db: Session = Depends(get_db)
):
    check_role(
    user,
    ["creator", "administrator"]
)

    email = user.get("Email")

    current_user = db.query(User).filter(
        User.Email == email
    ).first()

    if not current_user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )


    data = db.query(Analytics).filter(
        Analytics.user_id == current_user.id
    ).all()


    return [
        {
            "platform": item.platform,
            "views": item.views,
            "likes": item.likes,
            "comments": item.comments,
            "shares": item.shares,
            "saves": item.saves,
            "watch_time": item.watch_time,
            "reach": item.reach,
            "engagement_rate": item.engagement_rate
        }
        for item in data
    ]