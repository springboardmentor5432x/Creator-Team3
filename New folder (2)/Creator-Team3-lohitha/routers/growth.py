from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from jose import jwt, JWTError

from database import get_db
from models import User, Growth
from Auth import check_role


router = APIRouter(
    prefix="/api/growth",
    tags=["Growth"]
)


SECRET_KEY = "creatoriq_secret_key"
ALGORITHM = "HS256"

security = HTTPBearer()



# JWT verification
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



# Get complete growth data
@router.get("/")
def get_growth(
    user=Depends(verify_token),
    db: Session = Depends(get_db)
):
    check_role(
        user,
        [
            "creator",
            "marketing team",
            "administrator"
        ]
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


    growth_data = db.query(Growth).filter(
        Growth.user_id == current_user.id
    ).all()


    return growth_data




# Followers growth
@router.get("/followers")
def get_followers_growth(
    user=Depends(verify_token),
    db: Session = Depends(get_db)
):
    check_role(
        user,
        [
            "creator",
            "marketing team",
            "administrator"
        ]
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


    data = db.query(Growth).filter(
        Growth.user_id == current_user.id
    ).all()


    return [
        {
            "date": item.date,
            "followers": item.followers
        }
        for item in data
    ]




# Views growth
@router.get("/views")
def get_views_growth(
    user=Depends(verify_token),
    db: Session = Depends(get_db)
):
    check_role(
        user,
        [
            "creator",
            "marketing team",
            "administrator"
        ]
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


    data = db.query(Growth).filter(
        Growth.user_id == current_user.id
    ).all()


    return [
        {
            "date": item.date,
            "views": item.views
        }
        for item in data
    ]



# Engagement growth
@router.get("/engagement")
def get_engagement_growth(
    user=Depends(verify_token),
    db: Session = Depends(get_db)
):
    check_role(
        user,
        [
            "creator",
            "marketing team",
            "administrator"
        ]
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


    data = db.query(Growth).filter(
        Growth.user_id == current_user.id
    ).all()


    return [
        {
            "date": item.date,
            "engagement_rate": item.engagement_rate
        }
        for item in data
    ]
# -----------------------------
# Reach Growth
# -----------------------------
@router.get("/reach")
def get_reach_growth(
    user=Depends(verify_token),
    db: Session = Depends(get_db)
):
    check_role(
        user,
        [
            "creator",
            "marketing team",
            "administrator"
        ]
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


    data = db.query(Growth).filter(
        Growth.user_id == current_user.id
    ).all()


    return [
        {
            "date": item.date,
            "reach": item.reach
        }
        for item in data
    ]
# -----------------------------
# Growth Trends
# -----------------------------
@router.get("/trends")
def get_growth_trends(
    user=Depends(verify_token),
    db: Session = Depends(get_db)
):
    check_role(
        user,
        [
            "creator",
            "marketing team",
            "administrator"
        ]
    )

    email = user.get("Email")

    current_user = db.query(User).filter(
        User.Email == email
    ).first()


    data = db.query(Growth).filter(
        Growth.user_id == current_user.id
    ).order_by(
        Growth.date
    ).all()


    return [
        {
            "date": item.date,
            "followers": item.followers,
            "views": item.views,
            "reach": item.reach,
            "growth_percentage": item.growth_percentage
        }
        for item in data
    ]
# -----------------------------
# Content Growth Tracking
# -----------------------------
@router.get("/content-growth")
def content_growth(
    user=Depends(verify_token),
    db: Session = Depends(get_db)
):
    check_role(
        user,
        [
            "creator",
            "marketing team",
            "administrator"
        ]
    )

    email = user.get("Email")

    current_user = db.query(User).filter(
        User.Email == email
    ).first()


    data = db.query(Growth).filter(
        Growth.user_id == current_user.id
    ).all()


    return [
        {
            "date": item.date,
            "views": item.views,
            "reach": item.reach,
            "engagement_rate": item.engagement_rate
        }
        for item in data
    ]
@router.get("/summary")
def get_growth_summary(
    user=Depends(verify_token),
    db: Session = Depends(get_db)
):
    check_role(
        user,
        [
            "creator",
            "marketing team",
            "administrator"
        ]
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

    growth_data = db.query(Growth).filter(
        Growth.user_id == current_user.id
    ).order_by(
        Growth.date.desc()
    ).all()

    if not growth_data:
        raise HTTPException(
            status_code=404,
            detail="Growth data not found"
        )

    latest = growth_data[0]

    total_followers = latest.followers

    # Default values
    new_followers = 0
    daily_growth = 0
    weekly_growth = 0
    monthly_growth = 0

    if len(growth_data) > 1:
        previous = growth_data[1]
        new_followers = latest.followers - previous.followers
        daily_growth = new_followers

    if len(growth_data) >= 7:
        weekly_growth = (
            latest.followers -
            growth_data[6].followers
        )

    if len(growth_data) >= 30:
        monthly_growth = (
            latest.followers -
            growth_data[29].followers
        )

    return {
        "total_followers": total_followers,
        "new_followers": new_followers,
        "daily_growth": daily_growth,
        "weekly_growth": weekly_growth,
        "monthly_growth": monthly_growth,
        "growth_percentage": latest.growth_percentage
    }
