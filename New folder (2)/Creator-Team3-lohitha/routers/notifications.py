from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from jose import jwt, JWTError

from database import get_db
from models import User, Notification
from Auth import check_role

router = APIRouter(
    prefix="/api/notifications",
    tags=["Notifications"]
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


# Get notifications
@router.get("/")
def get_notifications(
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


    notifications = db.query(Notification).filter(
        Notification.user_id == current_user.id
    ).order_by(
        Notification.created_at.desc()
    ).all()


    # Create default notifications if empty
    if not notifications:

        default_notifications = [

            Notification(
                user_id=current_user.id,
                title="🎉 Welcome to CreatorIQ!",
                message="Welcome to your Creator Analytics dashboard.",
                type="system",
                read=False
            ),

            Notification(
                user_id=current_user.id,
                title="📈 Milestone Reached",
                message="Your views crossed 8M.",
                type="milestone",
                read=False
            ),

            Notification(
                user_id=current_user.id,
                title="⚠️ Connect Platform",
                message="Connect your social media accounts.",
                type="alert",
                read=False
            )

        ]


        for notification in default_notifications:
            db.add(notification)


        db.commit()


        notifications = db.query(Notification).filter(
            Notification.user_id == current_user.id
        ).order_by(
            Notification.created_at.desc()
        ).all()



    return [

        {
            "id": notification.id,
            "title": notification.title,
            "message": notification.message,
            "type": notification.type,
            "read": notification.read,
            "created_at": notification.created_at
        }

        for notification in notifications

    ]



# Mark one notification as read
@router.post("/{id}/read")
def mark_notification_read(
    id: int,
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


    notification = db.query(Notification).filter(
        Notification.id == id,
        Notification.user_id == current_user.id
    ).first()


    if not notification:
        raise HTTPException(
            status_code=404,
            detail="Notification not found"
        )


    notification.read = True

    db.commit()


    return {
        "message": "Notification marked as read"
    }



# Mark all notifications as read
@router.post("/read-all")
def mark_all_read(
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


    db.query(Notification).filter(
        Notification.user_id == current_user.id
    ).update(
        {
            Notification.read: True
        }
    )


    db.commit()


    return {
        "message": "All notifications marked as read"
    }



# Clear all notifications
@router.delete("/clear")
def clear_notifications(
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


    db.query(Notification).filter(
        Notification.user_id == current_user.id
    ).delete()


    db.commit()


    return {
        "message": "All notifications cleared"
    }