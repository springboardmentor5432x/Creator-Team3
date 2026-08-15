from fastapi import APIRouter, Depends

from app.core.security import get_current_user
from app.models.user import User

router = APIRouter(prefix="/analytics", tags=["analytics"])


@router.get("/overview")
def get_overview(current_user: User = Depends(get_current_user)):
    """
    Placeholder analytics endpoint for Milestone 1.

    Milestone 2 will replace this dummy payload with real data pulled from
    the YouTube / Instagram APIs and stored via the ingestion pipeline.
    For now it proves the full stack works end-to-end: DB -> Auth -> API -> Chart.
    """
    dummy_data = [
        {"date": "2026-06-01", "views": 1200, "likes": 340, "comments": 45},
        {"date": "2026-06-08", "views": 1850, "likes": 410, "comments": 62},
        {"date": "2026-06-15", "views": 1600, "likes": 380, "comments": 55},
        {"date": "2026-06-22", "views": 2300, "likes": 520, "comments": 80},
        {"date": "2026-06-29", "views": 2100, "likes": 490, "comments": 71},
        {"date": "2026-07-04", "views": 2750, "likes": 610, "comments": 95},
    ]
    return {
        "user": current_user.email,
        "summary": {
            "total_views": sum(d["views"] for d in dummy_data),
            "total_likes": sum(d["likes"] for d in dummy_data),
            "total_comments": sum(d["comments"] for d in dummy_data),
        },
        "timeseries": dummy_data,
    }
