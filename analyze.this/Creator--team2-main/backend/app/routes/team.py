from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.team_schema import TeamMemberCreate, TeamMemberResponse
from app.services.team_service import (
    create_team_member,
    get_team_members
)
from app.auth.oauth2 import get_current_user
from app.models.user import User

from app.services.team_service import (
    create_team_member,
    get_team_members,
    delete_team_member
)

from app.schemas.team_schema import (
    TeamMemberCreate,
    TeamMemberResponse,
    TeamMemberUpdate,
    TeamLogin
)
from app.services.team_service import (
    create_team_member,
    get_team_members,
    delete_team_member,
    update_team_member,
    login_team_member
)
from app.auth.roles import require_roles

router = APIRouter(prefix="/team", tags=["Team"])


@router.post("/", response_model=TeamMemberResponse)
def add_team_member(
    member: TeamMemberCreate,
    current_user = Depends(require_roles("creator")),
    db: Session = Depends(get_db)
):
    return create_team_member(
        db,
        member,
        current_user.id
    )

@router.get("/", response_model=list[TeamMemberResponse])
def list_team_members(
    current_user = Depends(require_roles("creator")),
    db: Session = Depends(get_db)
):
    return get_team_members(db, current_user.id)

@router.delete("/{member_id}")
def remove_team_member(
    member_id: int,
    current_user = Depends(require_roles("creator")),
    db: Session = Depends(get_db)
):
    return delete_team_member(
        db,
        member_id,
        current_user.id
    )

@router.put("/{member_id}", response_model=TeamMemberResponse)
def edit_team_member(
    member_id: int,
    member: TeamMemberUpdate,
    current_user = Depends(require_roles("creator")),
    db: Session = Depends(get_db)
):
    return update_team_member(
        db,
        member_id,
        current_user.id,
        member
    )

@router.post("/login")
def team_login(
    member: TeamLogin,
    db: Session = Depends(get_db)
):
    return login_team_member(member, db)