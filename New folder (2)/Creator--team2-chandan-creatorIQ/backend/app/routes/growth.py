from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db

from app.services.growth_service import (
    get_hashtag_analytics,
    predict_reach,
    forecast_audience_growth,
)

from app.schemas.growth_schema import (
    HashtagAnalytics,
    ReachPrediction,
    AudienceForecast,
)

router = APIRouter(
    prefix="/growth",
    tags=["Growth & Trend Analysis"]
)


@router.get(
    "/hashtags",
    response_model=list[HashtagAnalytics]
)
def hashtag_analysis(
    db: Session = Depends(get_db),
):
    return get_hashtag_analytics(db)


@router.get(
    "/reach-prediction",
    response_model=ReachPrediction
)
def reach_prediction(
    db: Session = Depends(get_db),
):
    return predict_reach(db)


@router.get(
    "/audience-forecast",
    response_model=AudienceForecast
)
def audience_forecast(
    db: Session = Depends(get_db),
):
    return forecast_audience_growth(db)

