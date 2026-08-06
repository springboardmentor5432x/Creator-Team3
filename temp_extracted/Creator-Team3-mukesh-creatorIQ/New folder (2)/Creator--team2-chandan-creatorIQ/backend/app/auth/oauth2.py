from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt

from app.auth.jwt_handler import SECRET_KEY, ALGORITHM
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.models.team_member import TeamMember
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/token")



def verify_token(token: str):
    try:
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )

        email = payload.get("sub")
        user_type = payload.get("type", "creator")

        if email is None:
            raise HTTPException(
                status_code=401,
                detail="Invalid Token"
            )

        return {
            "email": email,
            "type": user_type
        }

    except JWTError:
        raise HTTPException(
            status_code=401,
            detail="Invalid Token"
        )
    
def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):
    token_data = verify_token(token)

    if token_data["type"] == "team_member":
        user = (
            db.query(TeamMember)
            .filter(TeamMember.email == token_data["email"])
            .first()
        )
    else:
        user = (
            db.query(User)
            .filter(User.email == token_data["email"])
            .first()
        )

    if user is None:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    return user
