from sqlalchemy.orm import Session

from app.models.team_member import TeamMember
from app.schemas.team_schema import TeamMemberCreate
from app.auth.password import hash_password
from app.auth.password import verify_password
from app.auth.jwt_handler import create_access_token
from fastapi import HTTPException

def create_team_member(db: Session, member: TeamMemberCreate, creator_id: int):
    new_member = TeamMember(
    name=member.name,
    email=member.email,
    password=hash_password(member.password),
    role=member.role,
    creator_id=creator_id
)

    db.add(new_member)
    db.commit()
    db.refresh(new_member)

    return new_member

def get_team_members(db: Session, creator_id: int):
    return (
        db.query(TeamMember)
        .filter(TeamMember.creator_id == creator_id)
        .all()
    )

from fastapi import HTTPException

def delete_team_member(db: Session, member_id: int, creator_id: int):
    member = (
        db.query(TeamMember)
        .filter(
            TeamMember.id == member_id,
            TeamMember.creator_id == creator_id
        )
        .first()
    )

    if not member:
        raise HTTPException(
            status_code=404,
            detail="Team member not found"
        )

    db.delete(member)
    db.commit()

    return {"message": "Team member deleted successfully"}

def update_team_member(
    db: Session,
    member_id: int,
    creator_id: int,
    member
):
    team_member = (
        db.query(TeamMember)
        .filter(
            TeamMember.id == member_id,
            TeamMember.creator_id == creator_id
        )
        .first()
    )

    if not team_member:
        raise HTTPException(
            status_code=404,
            detail="Team member not found"
        )

    team_member.name = member.name
    team_member.email = member.email
    team_member.role = member.role

    db.commit()
    db.refresh(team_member)

    return team_member

def login_team_member(member, db: Session):
    existing_member = (
        db.query(TeamMember)
        .filter(TeamMember.email == member.email)
        .first()
    )

    if not existing_member:
        raise HTTPException(
            status_code=404,
            detail="Team member not found"
        )

    if not verify_password(
        member.password,
        existing_member.password
    ):
        raise HTTPException(
            status_code=401,
            detail="Incorrect password"
        )

    access_token = create_access_token(
        data={
            "sub": existing_member.email,
            "role": existing_member.role,
            "type": "team_member"
        }
    )

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }
