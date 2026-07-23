from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from models import User
from Auth import verify_token, check_role

router = APIRouter(prefix="/api/admin", tags=["Admin"])

@router.get("/users")
def get_admin_users(user=Depends(verify_token), db: Session = Depends(get_db)):
    check_role(user, ["Admin", "administrator"])
    users = db.query(User).all()
    return [
        {
            "id": u.id,
            "Username": u.Username,
            "Email": u.Email,
            "phone": u.phone,
            "role": u.role
        } for u in users
    ]

@router.delete("/users/{id}")
def delete_user(id: int, user=Depends(verify_token), db: Session = Depends(get_db)):
    check_role(user, ["Admin", "administrator"])
    email = user.get("Email")
    current_user = db.query(User).filter(User.Email == email).first()
    if current_user and current_user.id == id:
        raise HTTPException(status_code=400, detail="Cannot delete your own admin account")
    
    target_user = db.query(User).filter(User.id == id).first()
    if not target_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    db.delete(target_user)
    db.commit()
    return {"message": "User deleted successfully"}
