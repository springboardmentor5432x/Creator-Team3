from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db

from app.models.user import User

from app.schemas.audience_schema import (
    AudienceCreate,
    AudienceUpdate
)



from app.auth.rbac import require_role

from app.services.audience_service import (
    create_audience,
    get_all_audience,
    get_audience_analytics,
    get_audience_demographics,
    get_audience_growth,
    update_audience,
    delete_audience,
    compare_audience
)
from typing import Optional

router = APIRouter(tags=["Audience"])


@router.post("/audience")
def add_audience(
    audience: AudienceCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_role(
            ["creator", "agency", "administrator"]
        )
    ),
):
    return create_audience(
        db,
        audience,
        current_user,
    )




@router.get("/audience")
def audience_list(
    country: Optional[str] = None,
    gender: Optional[str] = None,
    age_group: Optional[str] = None,
    page: int = 1,
    limit: int = 10,
    sort_by: str = "created_at",
    order: str = "desc",
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_role(
            [
                "creator",
                "agency",
                "marketing_team",
                "administrator",
            ]
        )
    ),
):
    return get_all_audience(
        db,
        current_user,
        country,
        gender,
        age_group,
        page,
        limit,
        sort_by,
        order,
    )

@router.get("/audience/analytics")
def audience_analytics(
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_role(
            [
                "creator",
                "agency",
                "marketing_team",
                "administrator",
            ]
        )
    ),
):
    return get_audience_analytics(
        db,
        current_user,
    )

@router.get("/audience/demographics")
def audience_demographics(
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_role(
            [
                "creator",
                "agency",
                "marketing_team",
                "administrator",
            ]
        )
    ),
):
    return get_audience_demographics(
        db,
        current_user,
    )

@router.get("/audience/growth")
def audience_growth(
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_role(
            [
                "creator",
                "agency",
                "marketing_team",
                "administrator",
            ]
        )
    ),
):
    return get_audience_growth(
        db,
        current_user,
    )
@router.put("/audience/{audience_id}")
def edit_audience(
    audience_id: int,
    audience: AudienceUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_role(
            [
                "creator",
                "agency",
                "administrator",
            ]
        )
    ),
):
    return update_audience(
        audience_id,
        audience,
        db,
        current_user,
    )

@router.delete("/audience/{audience_id}")
def remove_audience(
    audience_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_role(
            [
                "creator",
                "agency",
                "administrator",
            ]
        )
    ),
):
    return delete_audience(
        audience_id,
        db,
        current_user,
    )


@router.get("/audience/compare")
def compare_two_audience(
    audience1: int,
    audience2: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_role(
            [
                "creator",
                "agency",
                "marketing_team",
                "administrator",
            ]
        )
    ),
):
    return compare_audience(
        audience1,
        audience2,
        db,
        current_user,
    )