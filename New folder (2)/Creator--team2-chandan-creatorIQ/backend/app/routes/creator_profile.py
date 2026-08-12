from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.creator_profile_schema import CreatorProfileCreate
from app.services.creator_profile_service import (
    create_creator_profile,
    get_creator_profiles
)

router = APIRouter(
    prefix="/creator-profile",
    tags=["Creator Profile"]
)


@router.post("/")
def create_profile(
    profile: CreatorProfileCreate,
    db: Session = Depends(get_db)
):
    return create_creator_profile(profile, db)


@router.get("/")
def get_profiles(
    db: Session = Depends(get_db)
):
    return get_creator_profiles(db)