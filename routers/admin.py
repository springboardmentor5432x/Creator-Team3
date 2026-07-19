from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from jose import jwt, JWTError

from database import get_db
from models import User
from Auth import check_role


router = APIRouter(
    prefix="/api/admin",
    tags=["Admin"]
)


SECRET_KEY = "creatoriq_secret_key"
ALGORITHM = "HS256"

security = HTTPBearer()


# -----------------------------
# JWT Verification
# -----------------------------
def verify_token(
    credentials: HTTPAuthorizationCredentials = Depends(security)
):

    token = credentials.credentials

    try:
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )

        return payload

    except JWTError:
        raise HTTPException(
            status_code=401,
            detail="Invalid Token"
        )



# -----------------------------
# Get All Users (Admin Only)
# -----------------------------
@router.get("/users")
def get_users(
    user=Depends(verify_token),
    db: Session = Depends(get_db)
):

    check_role(
        user,
        [
            "administrator"
        ]
    )


    users = db.query(User).all()


    return [
        {
            "id": u.id,
            "Username": u.Username,
            "Email": u.Email,
            "phone": u.phone,
            "role": u.role
        }
        for u in users
    ]



# -----------------------------
# Get Single User
# -----------------------------
@router.get("/users/{id}")
def get_user_by_id(
    id: int,
    user=Depends(verify_token),
    db: Session = Depends(get_db)
):

    check_role(
        user,
        [
            "administrator"
        ]
    )


    target_user = db.query(User).filter(
        User.id == id
    ).first()


    if not target_user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )


    return {
        "id": target_user.id,
        "Username": target_user.Username,
        "Email": target_user.Email,
        "phone": target_user.phone,
        "role": target_user.role
    }



# -----------------------------
# Delete User (Admin Only)
# -----------------------------
@router.delete("/users/{id}")
def delete_user(
    id: int,
    user=Depends(verify_token),
    db: Session = Depends(get_db)
):

    check_role(
        user,
        [
            "administrator"
        ]
    )


    email = user.get("Email")


    current_admin = db.query(User).filter(
        User.Email == email
    ).first()


    if current_admin and current_admin.id == id:
        raise HTTPException(
            status_code=400,
            detail="Cannot delete your own admin account"
        )


    target_user = db.query(User).filter(
        User.id == id
    ).first()


    if not target_user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )


    db.delete(target_user)

    db.commit()


    return {
        "message": "User deleted successfully"
    }



# -----------------------------
# Update User Role (Admin Only)
# -----------------------------
@router.put("/users/{id}/role")
def update_user_role(
    id: int,
    new_role: str,
    user=Depends(verify_token),
    db: Session = Depends(get_db)
):

    check_role(
        user,
        [
            "administrator"
        ]
    )


    target_user = db.query(User).filter(
        User.id == id
    ).first()


    if not target_user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )


    allowed_roles = [
        "creator",
        "agency",
        "marketing team",
        "administrator"
    ]


    new_role = new_role.lower()


    if new_role not in allowed_roles:
        raise HTTPException(
            status_code=400,
            detail="Invalid role"
        )


    target_user.role = new_role


    db.commit()
    db.refresh(target_user)


    return {
        "message": "Role updated successfully",
        "new_role": target_user.role
    }