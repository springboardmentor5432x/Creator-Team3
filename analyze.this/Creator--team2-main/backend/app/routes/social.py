from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.auth.oauth2 import get_current_user
from app.models.user import User
from app.schemas.social_schema import (
    SocialAccountCreate,
    SocialAccountResponse,
)
from app.services.social_service import (
    connect_social_account,
    get_social_accounts,
)

router = APIRouter(tags=["Social Media"])


@router.post(
    "/social/connect",
    response_model=SocialAccountResponse,
)
def connect(
    data: SocialAccountCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return connect_social_account(
        db,
        data,
        current_user,
    )


@router.get(
    "/social/accounts",
    response_model=list[SocialAccountResponse],
)
def accounts(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_social_accounts(
        db,
        current_user,
    )