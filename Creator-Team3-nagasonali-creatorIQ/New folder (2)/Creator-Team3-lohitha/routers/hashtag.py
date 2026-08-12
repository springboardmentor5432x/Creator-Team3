from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from jose import jwt, JWTError

from database import get_db
from models import User, Hashtag
from Auth import check_role


router = APIRouter(
    prefix="/api/hashtag",
    tags=["Hashtag"]
)


SECRET_KEY = "creatoriq_secret_key"
ALGORITHM = "HS256"

security = HTTPBearer()



# -----------------------------
# JWT Verification
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
# Get All Hashtag Data
# -----------------------------
@router.get("/")
def get_hashtags(
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


    data = db.query(Hashtag).filter(
        Hashtag.user_id == current_user.id
    ).all()


    return data



# -----------------------------
# Top Performing Hashtags
# -----------------------------
@router.get("/top")
def get_top_hashtags(
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


    data = db.query(Hashtag).filter(
        Hashtag.user_id == current_user.id
    ).order_by(
        Hashtag.trend_score.desc()
    ).limit(5).all()


    return [
        {
            "hashtag": item.hashtag,
            "usage_count": item.usage_count,
            "reach": item.reach,
            "engagement_rate": item.engagement_rate,
            "trend_score": item.trend_score
        }
        for item in data
    ]



# -----------------------------
# Trending Hashtags
# -----------------------------
@router.get("/trending")
def get_trending_hashtags(
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


    data = db.query(Hashtag).filter(
        Hashtag.user_id == current_user.id
    ).order_by(
        Hashtag.usage_count.desc()
    ).all()


    return [
        {
            "hashtag": item.hashtag,
            "usage_count": item.usage_count,
            "reach": item.reach,
            "trend_score": item.trend_score
        }
        for item in data
    ]