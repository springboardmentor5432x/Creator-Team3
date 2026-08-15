from fastapi import APIRouter, Depends

from sqlalchemy.orm import Session

from app.database import get_db
from app.auth.oauth2 import get_current_user
from app.models.user import User
from app.models.user_settings import UserSettings
from app.schemas.settings_schema import (
    ProfileSettingsUpdate,
    SecuritySettingsUpdate,
    NotificationSettingsUpdate,
    AppearanceSettingsUpdate,
)
from app.services.settings_service import (
    update_profile_settings,
    update_security_settings,
    update_notification_settings,
    update_appearance_settings,
)
from app.services.settings_service import (
    get_user_settings,
    update_profile_settings,
    update_security_settings,
    update_notification_settings,
    update_appearance_settings,
)

router = APIRouter()


@router.get("/settings/profile")
def get_profile_settings(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    settings = (
        db.query(UserSettings)
        .filter(UserSettings.user_id == current_user.id)
        .first()
    )
    return {
        "name": current_user.name,
        "email": current_user.email,
        "role": current_user.role,
        "bio": settings.bio if settings else "",
        "dateOfBirth": settings.date_of_birth if settings else "",
        "location": settings.location if settings else "",
        "website": settings.website if settings else "",
    }


@router.put("/settings/profile")
def update_profile(
    payload: ProfileSettingsUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return update_profile_settings(db, current_user.id, payload)


@router.put("/settings/security")
def update_security(
    payload: SecuritySettingsUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return update_security_settings(db, current_user.id, payload)


@router.put("/settings/notifications")
def update_notifications(
    payload: NotificationSettingsUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return update_notification_settings(db, current_user.id, payload)


@router.put("/settings/appearance")
def update_appearance(
    payload: AppearanceSettingsUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return update_appearance_settings(db, current_user.id, payload)

@router.get("/settings")
def get_settings(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_user_settings(db, current_user.id)