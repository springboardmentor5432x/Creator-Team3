from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.analytics_schema import AnalyticsCreate
from app.services.analytics_service import (
    create_analytics,
    get_analytics
)

router = APIRouter(
    prefix="/analytics",
    tags=["Analytics"]
)


@router.post("/")
def create_new_analytics(
    analytics: AnalyticsCreate,
    db: Session = Depends(get_db)
):
    return create_analytics(analytics, db)


@router.get("/")
def get_all_analytics(
    db: Session = Depends(get_db)
):
    return get_analytics(db)