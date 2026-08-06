from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from jose import jwt, JWTError

from database import get_db
from models import User, Prediction
from Auth import check_role


router = APIRouter(
    prefix="/api/prediction",
    tags=["Prediction"]
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
# Get All Predictions
# -----------------------------
@router.get("/")
def get_predictions(
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


    predictions = db.query(Prediction).filter(
        Prediction.user_id == current_user.id
    ).all()


    return predictions



# -----------------------------
# Follower Growth Forecast
# -----------------------------
@router.get("/followers")
def get_follower_prediction(
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


    data = db.query(Prediction).filter(
        Prediction.user_id == current_user.id,
        Prediction.prediction_type == "followers"
    ).all()


    return [
        {
            "predicted_followers": item.predicted_followers,
            "confidence": item.confidence,
            "generated_at": item.generated_at
        }
        for item in data
    ]



# -----------------------------
# Reach Prediction
# -----------------------------
@router.get("/reach")
def get_reach_prediction(
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


    data = db.query(Prediction).filter(
        Prediction.user_id == current_user.id,
        Prediction.prediction_type == "reach"
    ).all()


    return [
        {
            "predicted_reach": item.predicted_reach,
            "confidence": item.confidence,
            "generated_at": item.generated_at
        }
        for item in data
    ]



# -----------------------------
# Views Prediction
# -----------------------------
@router.get("/views")
def get_views_prediction(
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


    data = db.query(Prediction).filter(
        Prediction.user_id == current_user.id,
        Prediction.prediction_type == "views"
    ).all()


    return [
        {
            "predicted_views": item.predicted_views,
            "confidence": item.confidence,
            "generated_at": item.generated_at
        }
        for item in data
    ]