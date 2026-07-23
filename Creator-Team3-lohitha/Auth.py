from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError
from sqlalchemy.orm import Session

from database import get_db
from models import User


SECRET_KEY = "creatoriq_secret_key"
ALGORITHM = "HS256"


security = HTTPBearer()



# ---------------------------------
# Verify JWT Token
# ---------------------------------

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



# ---------------------------------
# Get Current Logged In User
# ---------------------------------

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

            raise HTTPException(
                status_code=404,
                detail="User not found"
            )


        return user



    except JWTError:

        raise HTTPException(
            status_code=401,
            detail="Invalid Token"
        )



# ---------------------------------
# Role Based Access Control
# ---------------------------------

def check_role(
    user,
    allowed_roles
):


    # Supports JWT payload dictionary
    if isinstance(user, dict):

        role = user.get("role")


    # Supports database User object
    else:

        role = user.role



    if not role:

        raise HTTPException(
            status_code=403,
            detail="Role not found"
        )



    # Convert role into lowercase

    role = role.lower()



    # Convert allowed roles into lowercase

    allowed_roles = [
        r.lower()
        for r in allowed_roles
    ]



    if role not in allowed_roles:

        raise HTTPException(
            status_code=403,
            detail="Access denied"
        )


    return True