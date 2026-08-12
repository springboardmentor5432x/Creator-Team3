from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.services.dashboard_service import get_dashboard_summary, get_instagram_dashboard, get_dashboard_data
from app.auth.rbac import require_role
from app.models.user import User

router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"]
)

@router.get("", include_in_schema=False)
@router.get("/", include_in_schema=False)
def dashboard(
    period: str = "30d",
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["creator", "agency", "marketing_team", "administrator"])),
):
    return get_dashboard_summary(db, current_user, period)

@router.get("/instagram")
def instagram_dashboard():
    return get_instagram_dashboard()

@router.get("/data")
def dashboard_data():
    return get_dashboard_data()