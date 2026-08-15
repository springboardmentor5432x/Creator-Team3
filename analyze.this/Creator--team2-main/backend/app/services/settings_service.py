from datetime import datetime
from sqlalchemy.orm import Session

from app.models.user import User
from app.models.user_settings import UserSettings


def _get_or_create_settings(db: Session, user_id: int) -> UserSettings:
    settings = db.query(UserSettings).filter(UserSettings.user_id == user_id).first()
    if settings is None:
        settings = UserSettings(user_id=user_id)
        db.add(settings)
        db.commit()
        db.refresh(settings)
    return settings


def update_profile_settings(db: Session, user_id: int, payload):
    settings = _get_or_create_settings(db, user_id)
    user = db.query(User).filter(User.id == user_id).first()

    settings.bio = payload.bio
    settings.date_of_birth = payload.dateOfBirth
    settings.location = payload.location
    settings.website = payload.website
    settings.updated_at = datetime.utcnow().isoformat()

    if user is not None and payload.role:
        user.role = payload.role

    db.commit()
    db.refresh(settings)
    return {"message": "Profile settings updated"}


def update_security_settings(db: Session, user_id: int, payload):
    settings = _get_or_create_settings(db, user_id)
    settings.two_factor = payload.twoFactor
    settings.session_timeout = payload.sessionTimeout
    settings.updated_at = datetime.utcnow().isoformat()
    db.commit()
    db.refresh(settings)
    return {"message": "Security settings updated"}


def update_notification_settings(db: Session, user_id: int, payload):
    settings = _get_or_create_settings(db, user_id)
    settings.product_updates = payload.productUpdates
    settings.weekly_digest = payload.weeklyDigest
    settings.updated_at = datetime.utcnow().isoformat()
    db.commit()
    db.refresh(settings)
    return {"message": "Notification settings updated"}


def update_appearance_settings(db: Session, user_id: int, payload):
    settings = _get_or_create_settings(db, user_id)
    settings.accent = payload.accent
    settings.density = payload.density
    settings.updated_at = datetime.utcnow().isoformat()
    db.commit()
    db.refresh(settings)
    return {"message": "Appearance settings updated"}

def get_user_settings(db: Session, user_id: int):
    settings = _get_or_create_settings(db, user_id)

    return {
        "profile": {
            "bio": settings.bio,
            "dateOfBirth": settings.date_of_birth,
            "location": settings.location,
            "website": settings.website
        },
        "security": {
            "twoFactor": settings.two_factor,
            "sessionTimeout": settings.session_timeout
        },
        "notifications": {
            "productUpdates": settings.product_updates,
            "weeklyDigest": settings.weekly_digest
        },
        "appearance": {
            "accent": settings.accent,
            "density": settings.density
        },
        "updatedAt": settings.updated_at
    }