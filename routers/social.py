from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from jose import jwt, JWTError
from pydantic import BaseModel

from database import get_db
from models import User, SocialAccount
from Auth import check_role


router = APIRouter(
    prefix="/api/social",
    tags=["Social Media"]
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
# Request Model
# -----------------------------
class SocialAccountCreate(BaseModel):

    platform: str
    access_token: str
    refresh_token: str | None = None




# -----------------------------
# Connect Social Media Account
# -----------------------------
@router.post("/connect")
def connect_social_account(
    data: SocialAccountCreate,
    user=Depends(verify_token),
    db: Session = Depends(get_db)
):

    # Only creator can connect own accounts
    check_role(
        user,
        [
            "creator"
        ]
    )


    email = user.get("Email")


    current_user = db.query(User).filter(
        User.Email == email
    ).first()


    if not current_user:

        raise HTTPException(
            status_code=404,
            detail="User not found"
        )


    platform = data.platform.lower()



    existing_account = db.query(SocialAccount).filter(
        SocialAccount.user_id == current_user.id,
        SocialAccount.platform == platform
    ).first()



    if existing_account:

        raise HTTPException(
            status_code=400,
            detail="Platform already connected"
        )



    account = SocialAccount(

        user_id=current_user.id,

        platform=platform,

        access_token=data.access_token,

        refresh_token=data.refresh_token

    )


    db.add(account)

    db.commit()

    db.refresh(account)



    return {

        "message": f"{platform} connected successfully"

    }





# -----------------------------
# Get Connected Platforms
# -----------------------------
@router.get("/")
def get_connected_platforms(
    user=Depends(verify_token),
    db: Session = Depends(get_db)
):

    check_role(
        user,
        [
            "creator",
            "marketing team",
            "administrator"
        ]
    )


    email = user.get("Email")



    current_user = db.query(User).filter(
        User.Email == email
    ).first()



    if not current_user:

        raise HTTPException(
            status_code=404,
            detail="User not found"
        )



    accounts = db.query(SocialAccount).filter(
        SocialAccount.user_id == current_user.id
    ).all()



    return [

        {
            "id": account.id,
            "platform": account.platform,
            "connected": True
        }

        for account in accounts

    ]





# -----------------------------
# Disconnect Platform
# -----------------------------
@router.delete("/{platform}")
def disconnect_platform(
    platform: str,
    user=Depends(verify_token),
    db: Session = Depends(get_db)
):


    check_role(
        user,
        [
            "creator"
        ]
    )



    email = user.get("Email")



    current_user = db.query(User).filter(
        User.Email == email
    ).first()



    if not current_user:

        raise HTTPException(
            status_code=404,
            detail="User not found"
        )



    platform = platform.lower()



    account = db.query(SocialAccount).filter(
        SocialAccount.user_id == current_user.id,
        SocialAccount.platform == platform
    ).first()



    if not account:

        raise HTTPException(
            status_code=404,
            detail="Platform not connected"
        )



    db.delete(account)

    db.commit()



    return {

        "message": f"{platform} disconnected successfully"

    }





# -----------------------------
# Available Platforms
# -----------------------------
@router.get("/available")
def available_platforms():

    return {

        "platforms":[

            "youtube",
            "instagram",
            "facebook",
            "twitter",
            "linkedin"

        ]

    }