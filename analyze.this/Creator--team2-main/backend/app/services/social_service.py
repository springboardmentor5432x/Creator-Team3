from sqlalchemy.orm import Session

from app.models.social_account import SocialAccount
from app.models.user import User
from app.schemas.social_schema import SocialAccountCreate


def connect_social_account(
    db: Session,
    data: SocialAccountCreate,
    current_user: User,
):
    account = SocialAccount(
        platform=data.platform,
        account_name=data.account_name,
        account_id=data.account_id,
        access_token=data.access_token,
        creator_id=current_user.id,
    )

    db.add(account)
    db.commit()
    db.refresh(account)

    return account


def get_social_accounts(
    db: Session,
    current_user: User,
):
    return (
        db.query(SocialAccount)
        .filter(
            SocialAccount.creator_id == current_user.id
        )
        .all()
    )