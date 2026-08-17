from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional
from database import get_db
from models import User, TeamMember
from Auth import verify_token

router = APIRouter(prefix="/api/team", tags=["Team"])

class InviteRequest(BaseModel):
    email: str
    role: str

class RoleUpdateRequest(BaseModel):
    role: str

@router.get("")
def get_team_members(user=Depends(verify_token), db: Session = Depends(get_db)):
    email = user.get("Email")
    db_user = db.query(User).filter(User.Email == email).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    members = db.query(TeamMember).filter(TeamMember.workspace_owner_id == db_user.id).all()
    
    # Return members along with the owner
    result = []
    # Add owner
    result.append({
        "id": f"owner_{db_user.id}",
        "name": db_user.Username,
        "email": db_user.Email,
        "role": "Admin / Owner",
        "status": "Active",
        "avatar": f"https://api.dicebear.com/7.x/identicon/svg?seed={db_user.Username}"
    })
    
    for m in members:
        # If the invited user has signed up, we can fetch their real username/avatar
        member_name = m.member_email.split('@')[0]
        member_avatar = f"https://api.dicebear.com/7.x/identicon/svg?seed={m.member_email}"
        
        if m.member_user:
            member_name = m.member_user.Username
            member_avatar = f"https://api.dicebear.com/7.x/identicon/svg?seed={m.member_user.Username}"
            
        result.append({
            "id": m.id,
            "name": member_name,
            "email": m.member_email,
            "role": m.role,
            "status": m.status,
            "avatar": member_avatar
        })
        
    return result

@router.post("/invite")
def invite_member(req: InviteRequest, user=Depends(verify_token), db: Session = Depends(get_db)):
    email = user.get("Email")
    db_user = db.query(User).filter(User.Email == email).first()
    
    if req.email.lower() == db_user.Email.lower():
        raise HTTPException(status_code=400, detail="Cannot invite yourself")
        
    existing_member = db.query(TeamMember).filter(
        TeamMember.workspace_owner_id == db_user.id,
        TeamMember.member_email == req.email.lower()
    ).first()
    
    if existing_member:
        raise HTTPException(status_code=400, detail="User is already in your team")
        
    # Check if the invited user already exists in the system
    invited_user = db.query(User).filter(User.Email == req.email.lower()).first()
    
    new_member = TeamMember(
        workspace_owner_id=db_user.id,
        member_email=req.email.lower(),
        member_user_id=invited_user.id if invited_user else None,
        role=req.role,
        status="Active" if invited_user else "Pending Invite"
    )
    
    db.add(new_member)
    db.commit()
    db.refresh(new_member)
    
    return {"message": "Invite sent successfully", "member_id": new_member.id}

@router.put("/{member_id}/role")
def update_role(member_id: int, req: RoleUpdateRequest, user=Depends(verify_token), db: Session = Depends(get_db)):
    email = user.get("Email")
    db_user = db.query(User).filter(User.Email == email).first()
    
    member = db.query(TeamMember).filter(
        TeamMember.id == member_id,
        TeamMember.workspace_owner_id == db_user.id
    ).first()
    
    if not member:
        raise HTTPException(status_code=404, detail="Team member not found")
        
    member.role = req.role
    db.commit()
    return {"message": "Role updated successfully"}

@router.delete("/{member_id}")
def remove_member(member_id: int, user=Depends(verify_token), db: Session = Depends(get_db)):
    email = user.get("Email")
    db_user = db.query(User).filter(User.Email == email).first()
    
    member = db.query(TeamMember).filter(
        TeamMember.id == member_id,
        TeamMember.workspace_owner_id == db_user.id
    ).first()
    
    if not member:
        raise HTTPException(status_code=404, detail="Team member not found")
        
    db.delete(member)
    db.commit()
    return {"message": "Member removed successfully"}
