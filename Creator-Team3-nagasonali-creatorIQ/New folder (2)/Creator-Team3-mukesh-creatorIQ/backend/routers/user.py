from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
import bcrypt
import re
from jose import jwt, JWTError
from pydantic import BaseModel, EmailStr, Field

from database import get_db
from models import User, CreatorProfile
from Auth import security, SECRET_KEY, ALGORITHM, verify_token

router = APIRouter(tags=["User"])

def validate_password(password):
    if len(password) < 8:
        return False
    if not re.search(r"[A-Z]", password):
        return False
    if not re.search(r"[a-z]", password):
        return False
    if not re.search(r"[0-9]", password):
        return False
    if not re.search(r"[!@#$%^&*(),.?\":{}|<>]", password):
        return False
    return True

class UserRegister(BaseModel):
    Username: str = Field(..., min_length=3, max_length=30)
    Email: EmailStr
    phone: str = Field(..., min_length=5, max_length=20)
    Password: str = Field(..., min_length=8)
    role: str

class UserLogin(BaseModel):
    Email: str
    Password: str

class ForgotPassword(BaseModel):
    Email: EmailStr
    new_password: str

class ChangePassword(BaseModel):
    old_password: str
    new_password: str

class AccountUpdate(BaseModel):
    Username: str
    Email: str
    phone: str
    Password: str = None

class ProfileUpdate(BaseModel):
    bio: str
    language: str
    region: str
    platform: str

@router.post("/register")
def register(user: UserRegister, db: Session = Depends(get_db)):
    # Check if user already exists
    existing_user = db.query(User).filter(User.Email == user.Email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    existing_phone = db.query(User).filter(User.phone == user.phone).first()
    if existing_phone:
        raise HTTPException(status_code=400, detail="Phone number already registered")
    
    if not validate_password(user.Password):
        raise HTTPException(
            status_code=400,
            detail="Password must contain uppercase, lowercase, number and special character."
        )

    hashed_password = bcrypt.hashpw(user.Password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

    db_user = User(
        Username=user.Username,
        Email=user.Email,
        phone=user.phone,
        Password=hashed_password,
        role=user.role
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return {"message": "User registered successfully"}

@router.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):
    stored_user = db.query(User).filter(User.Email == user.Email).first()
    if stored_user is None:
        raise HTTPException(status_code=404, detail="User not found")

    if not bcrypt.checkpw(user.Password.encode('utf-8'), stored_user.Password.encode('utf-8')):
        raise HTTPException(status_code=401, detail="Invalid password")

    token = jwt.encode(
        {"Email": stored_user.Email, "role": stored_user.role},
        SECRET_KEY,
        algorithm=ALGORITHM
    )
    return {"access_token": token, "token_type": "bearer"}

@router.get("/user")
def get_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return {"message": "Authorized User", "user": payload}
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid Token")

@router.put("/change-password")
def change_password(data: ChangePassword, user=Depends(verify_token), db: Session = Depends(get_db)):
    email = user.get("Email")
    db_user = db.query(User).filter(User.Email == email).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    if not bcrypt.checkpw(data.old_password.encode('utf-8'), db_user.Password.encode('utf-8')):
        raise HTTPException(status_code=400, detail="Old password is incorrect")

    if not validate_password(data.new_password):
        raise HTTPException(
            status_code=400,
            detail="Password must contain uppercase, lowercase, number and special character."
        )

    hashed_password = bcrypt.hashpw(data.new_password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")
    db_user.Password = hashed_password
    db.commit()
    return {"message": "Password changed successfully"}

@router.put("/forgot-password")
def forgot_password(data: ForgotPassword, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.Email == data.Email).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="Email not found")

    if not validate_password(data.new_password):
        raise HTTPException(
            status_code=400,
            detail="Password must contain uppercase, lowercase, number and special character."
        )

    hashed_password = bcrypt.hashpw(data.new_password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")
    db_user.Password = hashed_password
    db.commit()
    return {"message": "Password reset successfully"}

def get_or_create_user_from_token(token_payload: dict, db: Session) -> User:
    email = token_payload.get("Email") or token_payload.get("sub") or "user@creatoriq.com"
    role = token_payload.get("role") or "Creator"
    
    db_user = db.query(User).filter(User.Email == email).first()
    if not db_user:
        uname = email.split("@")[0] if "@" in email else email
        hashed = bcrypt.hashpw("Password123!".encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        db_user = User(
            Username=uname,
            Email=email,
            phone="+18005550199",
            Password=hashed,
            role=role
        )
        db.add(db_user)
        db.commit()
        db.refresh(db_user)

    profile = db.query(CreatorProfile).filter(CreatorProfile.user_id == db_user.id).first()
    if not profile:
        profile = CreatorProfile(
            user_id=db_user.id,
            platform="YouTube",
            followers=520000,
            engagement_rate=5.6,
            bio="Tech enthusiast & content creator.",
            language="English",
            region="United States"
        )
        db.add(profile)
        db.commit()

    return db_user

@router.get("/api/user/details")
def get_user_details(user=Depends(verify_token), db: Session = Depends(get_db)):
    db_user = get_or_create_user_from_token(user, db)
    profile = db.query(CreatorProfile).filter(CreatorProfile.user_id == db_user.id).first()

    return {
        "account": {
            "Username": db_user.Username,
            "Email": db_user.Email,
            "phone": db_user.phone,
            "role": db_user.role
        },
        "profile": {
            "bio": profile.bio if profile else "",
            "language": profile.language if profile else "English",
            "region": profile.region if profile else "United States",
            "platform": profile.platform if profile else "YouTube"
        }
    }

@router.put("/api/user/account")
def update_user_account(data: AccountUpdate, user=Depends(verify_token), db: Session = Depends(get_db)):
    current_email = user.get("Email")
    db_user = db.query(User).filter(User.Email == current_email).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if data.Email != db_user.Email:
        existing = db.query(User).filter(User.Email == data.Email).first()
        if existing:
            raise HTTPException(status_code=400, detail="Email already in use")
    
    db_user.Username = data.Username
    db_user.Email = data.Email
    db_user.phone = data.phone
    if data.Password:
        if not validate_password(data.Password):
            raise HTTPException(
                status_code=400,
                detail="Password must contain uppercase, lowercase, number and special character."
            )
        db_user.Password = bcrypt.hashpw(data.Password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    
    db.commit()
    new_token = jwt.encode(
        {"Email": db_user.Email, "role": db_user.role},
        SECRET_KEY,
        algorithm=ALGORITHM
    )
    return {"message": "Account updated successfully", "access_token": new_token}

@router.put("/api/user/profile")
def update_user_profile(data: ProfileUpdate, user=Depends(verify_token), db: Session = Depends(get_db)):
    email = user.get("Email")
    db_user = db.query(User).filter(User.Email == email).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    profile = db.query(CreatorProfile).filter(CreatorProfile.user_id == db_user.id).first()
    if not profile:
        profile = CreatorProfile(user_id=db_user.id)
        db.add(profile)
    
    profile.bio = data.bio
    profile.language = data.language
    profile.region = data.region
    profile.platform = data.platform
    db.commit()
    return {"message": "Profile updated successfully"}
