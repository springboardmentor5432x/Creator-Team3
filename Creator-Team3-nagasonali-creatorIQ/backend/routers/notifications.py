from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from models import User, Notification
from Auth import verify_token

router = APIRouter(prefix="/api/notifications", tags=["Notifications"])

@router.get("")
def get_notifications(user=Depends(verify_token), db: Session = Depends(get_db)):
    email = user.get("Email")
    db_user = db.query(User).filter(User.Email == email).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    notifs = db.query(Notification).filter(Notification.user_id == db_user.id).order_by(Notification.created_at.desc()).all()
    
    if not notifs:
        default_notifs = [
            Notification(
                user_id=db_user.id,
                title="🎉 Welcome to CreatorIQ!",
                message="Welcome to your new Creator Analytics dashboard! Start by exploring your metrics or custom themes in the Settings view.",
                type="system",
                read=False
            ),
            Notification(
                user_id=db_user.id,
                title="📈 Milestone: Views Hit!",
                message="Congratulations! Your cumulative audience views crossed 8.4M overall views this month.",
                type="milestone",
                read=False
            ),
            Notification(
                user_id=db_user.id,
                title="⚠️ Sync LinkedIn Platform",
                message="Please configure your primary platform under settings to optimize custom data fetching.",
                type="alert",
                read=False
            )
        ]
        for n in default_notifs:
            db.add(n)
        db.commit()
        notifs = db.query(Notification).filter(Notification.user_id == db_user.id).order_by(Notification.created_at.desc()).all()
    
    return [
        {
            "id": n.id,
            "title": n.title,
            "message": n.message,
            "type": n.type,
            "read": n.read,
            "created_at": n.created_at.isoformat()
        } for n in notifs
    ]

@router.post("/{id}/read")
def mark_notification_read(id: int, user=Depends(verify_token), db: Session = Depends(get_db)):
    email = user.get("Email")
    db_user = db.query(User).filter(User.Email == email).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    notif = db.query(Notification).filter(Notification.id == id, Notification.user_id == db_user.id).first()
    if not notif:
        raise HTTPException(status_code=404, detail="Notification not found")
    
    notif.read = True
    db.commit()
    return {"message": "Notification marked as read"}

@router.post("/read-all")
def mark_all_notifications_read(user=Depends(verify_token), db: Session = Depends(get_db)):
    email = user.get("Email")
    db_user = db.query(User).filter(User.Email == email).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    db.query(Notification).filter(Notification.user_id == db_user.id).update({Notification.read: True})
    db.commit()
    return {"message": "All notifications marked as read"}

@router.delete("/clear")
def clear_notifications(user=Depends(verify_token), db: Session = Depends(get_db)):
    email = user.get("Email")
    db_user = db.query(User).filter(User.Email == email).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    db.query(Notification).filter(Notification.user_id == db_user.id).delete()
    db.commit()
    return {"message": "All notifications cleared"}
