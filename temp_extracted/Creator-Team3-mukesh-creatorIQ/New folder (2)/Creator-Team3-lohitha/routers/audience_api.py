from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from jose import jwt, JWTError

from database import get_db
from models import User, Audience
from Auth import check_role


router = APIRouter(
    prefix="/api/audience",
    tags=["Audience"]
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
# Complete Audience Information
# -----------------------------
@router.get("/")
def get_audience(
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


    audience_data = db.query(Audience).filter(
        Audience.user_id == current_user.id
    ).all()


    return audience_data



# -----------------------------
# Age & Gender Distribution
# -----------------------------
@router.get("/demographics")
def get_demographics(
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


    data = db.query(Audience).filter(
        Audience.user_id == current_user.id
    ).all()


    return [
        {
            "age_group": item.age_group,
            "gender": item.gender,
            "percentage": item.percentage
        }
        for item in data
    ]



# -----------------------------
# Geographic Location
# -----------------------------
@router.get("/location")
def get_location(
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


    data = db.query(Audience).filter(
        Audience.user_id == current_user.id
    ).all()


    return [
        {
            "location": item.location,
            "country": item.country,
            "percentage": item.percentage
        }
        for item in data
    ]



# -----------------------------
# Device Usage
# -----------------------------
@router.get("/device")
def get_device_usage(
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


    data = db.query(Audience).filter(
        Audience.user_id == current_user.id
    ).all()


    return [
        {
            "device": item.device,
            "percentage": item.percentage
        }
        for item in data
    ]



# -----------------------------
# Audience Active Hours
# -----------------------------
@router.get("/active-hours")
def get_active_hours(
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


    data = db.query(Audience).filter(
        Audience.user_id == current_user.id
    ).all()


    return [
        {
            "active_hours": item.active_hours,
            "percentage": item.percentage
        }
        for item in data
    ]