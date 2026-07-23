from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError
from sqlalchemy.orm import Session

from database import get_db
from models import User

SECRET_KEY = "creatoriq_secret_key"
ALGORITHM = "HS256"

security = HTTPBearer()

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

def get_current_user(
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
        if not email:
            raise HTTPException(
                status_code=401,
                detail="Invalid Token"
            )
        user = db.query(User).filter(
            User.Email == email
        ).first()
        if not user:
            import bcrypt
            from models import CreatorProfile
            uname = email.split("@")[0] if "@" in email else email
            hashed = bcrypt.hashpw("Password123!".encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
            user = User(
                Username=uname,
                Email=email,
                phone="+18005550199",
                Password=hashed,
                role=payload.get("role", "Creator")
            )
            db.add(user)
            db.commit()
            db.refresh(user)

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

        return user
    except JWTError:
        raise HTTPException(
            status_code=401,
            detail="Invalid Token"
        )

def check_role(
    user,
    allowed_roles
):
    if isinstance(user, dict):
        role = user.get("role")
    else:
        role = user.role

    if not role:
        raise HTTPException(
            status_code=403,
            detail="Role not found"
        )

    role = role.lower()
    allowed_roles = [r.lower() for r in allowed_roles]

    if role not in allowed_roles:
        raise HTTPException(
            status_code=403,
            detail="Access denied"
        )
    return True
