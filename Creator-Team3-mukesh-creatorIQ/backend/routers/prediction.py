from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from database import get_db
from models import User
from Auth import verify_token
from services.prediction_aggregator import PredictionAggregator

router = APIRouter(prefix="/api/prediction", tags=["Prediction"])

@router.get("")
def get_predictions(
    platform: str = Query("overall"),
    days: int = Query(30, description="Target prediction period in days"),
    uploads_per_week: float = Query(3.0),
    avg_views_per_video: float = Query(25000.0),
    engagement_rate: float = Query(5.5),
    cpm: float = Query(4.50),
    user=Depends(verify_token),
    db: Session = Depends(get_db)
):
    email = user.get("Email")
    db_user = db.query(User).filter(User.Email == email).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    return PredictionAggregator.get_prediction_data(db_user.id, platform, days, db)

@router.get("/forecast")
def get_prediction_forecast(platform: str = "overall", user=Depends(verify_token), db: Session = Depends(get_db)):
    email = user.get("Email")
    db_user = db.query(User).filter(User.Email == email).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    return PredictionAggregator.generate_prediction(db_user.id, platform, db)
