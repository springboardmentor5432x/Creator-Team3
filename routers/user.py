from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr, Field
import bcrypt
import re
from jose import jwt, JWTError

from database import get_db
from models import User, CreatorProfile
from Auth import check_role

router = APIRouter()

SECRET_KEY = "creatoriq_secret_key"
ALGORITHM = "HS256"
security = HTTPBearer()


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
    phone: str = Field(..., min_length=10, max_length=10)
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

    existing_user = db.query(User).filter(
        User.Email == user.Email
    ).first()

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )


    existing_phone = db.query(User).filter(
        User.phone == user.phone
    ).first()

    if existing_phone:
        raise HTTPException(
            status_code=400,
            detail="Phone number already registered"
        )


    if not validate_password(user.Password):
        raise HTTPException(
            status_code=400,
            detail="Password must contain uppercase, lowercase, number and special character."
        )


    # Role validation
    allowed_roles = [
        "creator",
        "agency",
        "marketing team",
        "administrator"
    ]

    user.role = user.role.lower()


    if user.role not in allowed_roles:
        raise HTTPException(
            status_code=400,
            detail="Invalid role"
        )


    hashed_password = bcrypt.hashpw(
        user.Password.encode("utf-8"),
        bcrypt.gensalt()
    ).decode("utf-8")


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


    return {
        "message": "User registered successfully"
    }
@router.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):

    stored_user = db.query(User).filter(
        User.Email == user.Email
    ).first()


    if stored_user is None:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )


    if not bcrypt.checkpw(
        user.Password.encode("utf-8"),
        stored_user.Password.encode("utf-8")
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid password"
        )


    token = jwt.encode(
        {
            "Email": stored_user.Email,
            "role": stored_user.role.lower()
        },
        SECRET_KEY,
        algorithm=ALGORITHM
    )


    return {
        "access_token": token,
        "token_type": "bearer"
    }

@router.get("/user")
def get_user(
    credentials: HTTPAuthorizationCredentials = Depends(security)
):

    token = credentials.credentials

    try:
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )
        return {
            "message": "Authorized User",
            "user": {
                "Email": payload.get("Email"),
                "role": payload.get("role")
            }
        }

    except JWTError:
        raise HTTPException(
            status_code=401,
            detail="Invalid Token"
        )
@router.put("/change-password")
def change_password(
    data: ChangePassword,
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    token = credentials.credentials

    try:
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )

        email = payload.get("Email")

        user = db.query(User).filter(User.Email == email).first()

        if not user:
            raise HTTPException(
                status_code=404,
                detail="User not found"
            )

        if not bcrypt.checkpw(
            data.old_password.encode("utf-8"),
            user.Password.encode("utf-8")
        ):
            raise HTTPException(
                status_code=400,
                detail="Old password is incorrect"
            )

        if not validate_password(data.new_password):
            raise HTTPException(
                status_code=400,
                detail="Password must contain uppercase, lowercase, number and special character."
            )

        hashed_password = bcrypt.hashpw(
            data.new_password.encode("utf-8"),
            bcrypt.gensalt()
        ).decode("utf-8")

        user.Password = hashed_password

        db.commit()
        db.refresh(user)

        return {
            "message": "Password changed successfully"
        }

    except JWTError:
        raise HTTPException(
            status_code=401,
            detail="Invalid Token"
        )


@router.put("/forgot-password")
def forgot_password(
    data: ForgotPassword,
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.Email == data.Email).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="Email not found"
        )

    if not validate_password(data.new_password):
        raise HTTPException(
            status_code=400,
            detail="Password must contain uppercase, lowercase, number and special character."
        )

    hashed_password = bcrypt.hashpw(
        data.new_password.encode("utf-8"),
        bcrypt.gensalt()
    ).decode("utf-8")

    user.Password = hashed_password

    db.commit()
    db.refresh(user)

    return {
        "message": "Password reset successfully"
    }


@router.get("/user/details")
def get_user_details(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    token = credentials.credentials

    try:
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )

        email = payload.get("Email")

        user = db.query(User).filter(User.Email == email).first()

        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        profile = db.query(CreatorProfile).filter(
            CreatorProfile.user_id == user.id
        ).first()

        if not profile:
            profile = CreatorProfile(
                user_id=user.id,
                platform="YouTube",
                followers=520000,
                engagement_rate=5.6,
                bio="Tech enthusiast & content creator.",
                language="English",
                region="United States"
            )

            db.add(profile)
            db.commit()
            db.refresh(profile)

        return {
            "account": {
                "Username": user.Username,
                "Email": user.Email,
                "phone": user.phone,
                "role": user.role
            },
            "profile": {
                "bio": profile.bio,
                "language": profile.language,
                "region": profile.region,
                "platform": profile.platform
            }
        }

    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid Token")
@router.put("/user/account")
def update_user_account(
    data: AccountUpdate,
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    token = credentials.credentials

    try:
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )

        current_email = payload.get("Email")

        user = db.query(User).filter(User.Email == current_email).first()

        if not user:
            raise HTTPException(
                status_code=404,
                detail="User not found"
            )

        if data.Email != user.Email:
            existing = db.query(User).filter(User.Email == data.Email).first()
            if existing:
                raise HTTPException(
                    status_code=400,
                    detail="Email already in use"
                )

        user.Username = data.Username
        user.Email = data.Email
        user.phone = data.phone

        if data.Password:
            user.Password = bcrypt.hashpw(
                data.Password.encode("utf-8"),
                bcrypt.gensalt()
            ).decode("utf-8")

        db.commit()

        new_token = jwt.encode(
            {
                "Email": user.Email,
                "role": user.role
            },
            SECRET_KEY,
            algorithm=ALGORITHM
        )

        return {
            "message": "Account updated successfully",
            "access_token": new_token
        }

    except JWTError:
        raise HTTPException(
            status_code=401,
            detail="Invalid Token"
        )


@router.put("/user/profile")
def update_user_profile(
    data: ProfileUpdate,
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    token = credentials.credentials

    try:
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )

        email = payload.get("Email")

        user = db.query(User).filter(User.Email == email).first()

        if not user:
            raise HTTPException(
                status_code=404,
                detail="User not found"
            )

        profile = db.query(CreatorProfile).filter(
            CreatorProfile.user_id == user.id
        ).first()

        if not profile:
            profile = CreatorProfile(user_id=user.id)
            db.add(profile)

        profile.bio = data.bio
        profile.language = data.language
        profile.region = data.region
        profile.platform = data.platform

        db.commit()

        return {
            "message": "Profile updated successfully"
        }

    except JWTError:
        raise HTTPException(
            status_code=401,
            detail="Invalid Token"
        )