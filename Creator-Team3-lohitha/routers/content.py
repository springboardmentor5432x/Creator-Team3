from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from jose import jwt, JWTError
from pydantic import BaseModel

from database import get_db
from models import User, Content
from Auth import check_role


router = APIRouter(
    prefix="/api/content",
    tags=["Content"]
)


SECRET_KEY = "creatoriq_secret_key"
ALGORITHM = "HS256"

security = HTTPBearer()


# JWT verification
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



# Request model
class ContentCreate(BaseModel):

    title: str
    platform: str
    category: str
    views: int = 0
    likes: int = 0
    comments: int = 0



# Add new content
@router.post("/")
def create_content(
    data: ContentCreate,
    user=Depends(verify_token),
    db: Session = Depends(get_db)
):

    check_role(
        user,
        ["creator", "administrator"]
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


    content = Content(

        user_id=current_user.id,

        title=data.title,

        platform=data.platform,

        category=data.category,

        views=data.views,

        likes=data.likes,

        comments=data.comments

    )


    db.add(content)

    db.commit()

    db.refresh(content)


    return {
        "message": "Content added successfully",
        "content_id": content.id
    }




# Get all creator content
@router.get("/")
def get_content(
    user=Depends(verify_token),
    db: Session = Depends(get_db)
):

    check_role(user, ["creator"])

    email = user.get("Email")


    current_user = db.query(User).filter(
        User.Email == email
    ).first()


    contents = db.query(Content).filter(
        Content.user_id == current_user.id
    ).all()


    return contents




# Update content
@router.put("/{content_id}")
def update_content(
    content_id: int,
    data: ContentCreate,
    user=Depends(verify_token),
    db: Session = Depends(get_db)
):
    check_role(
    user,
    ["creator", "administrator"]
)

    content = db.query(Content).filter(
        Content.id == content_id
    ).first()


    if not content:
        raise HTTPException(
            status_code=404,
            detail="Content not found"
        )


    content.title = data.title
    content.platform = data.platform
    content.category = data.category
    content.views = data.views
    content.likes = data.likes
    content.comments = data.comments


    db.commit()


    return {
        "message": "Content updated successfully"
    }




# Delete content
@router.delete("/{content_id}")
def delete_content(
    content_id: int,
    user=Depends(verify_token),
    db: Session = Depends(get_db)
):
    check_role(
    user,
    ["creator", "administrator"]
)

    content = db.query(Content).filter(
        Content.id == content_id
    ).first()


    if not content:
        raise HTTPException(
            status_code=404,
            detail="Content not found"
        )


    db.delete(content)

    db.commit()


    return {
        "message": "Content deleted successfully"
    }