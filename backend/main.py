from fastapi import FastAPI, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr, Field
import bcrypt
from jose import jwt, JWTError
from sqlalchemy.orm import Session
from database import engine, Base, get_db
from models import User, CreatorProfile, Notification

app = FastAPI()

# Enable CORS for frontend local server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)
# Using direct bcrypt for hashing and verification
SECRET_KEY = "creatoriq_secret_key"
ALGORITHM = "HS256"
security = HTTPBearer()


class UserRegister(BaseModel):
    Username: str = Field(..., min_length=3, max_length=30)
    Email: EmailStr
    phone: str = Field(..., min_length=10, max_length=10)
    Password: str = Field(..., min_length=8)
    role: str
class UserLogin(BaseModel):
    Email: str
    Password: str

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


@app.get("/")
def home():
    return {"message": "Welcome to CreatorIQ Backend"}


@app.get("/about")
def about():
    return {"message": "This is CreatorIQ Backend API"}


@app.get("/contact")
def contact():
    return {
        "email": "creatoriq@gmail.com",
        "phone": "9876543210"
    }


@app.post("/register")
def register(user: UserRegister, db: Session = Depends(get_db)):

    # Check if user already exists
    existing_user = db.query(User).filter(User.Email == user.Email).first()
    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )
    existing_phone = db.query(User).filter(User.phone == user.phone).first()

    if existing_phone:
        raise HTTPException(
        status_code=400,
        detail="Phone number already registered"
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

    return {
        "message": "User registered successfully"
    }
@app.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):

    stored_user = db.query(User).filter(User.Email == user.Email).first()

    if stored_user is None:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    if not bcrypt.checkpw(user.Password.encode('utf-8'), stored_user.Password.encode('utf-8')):
        raise HTTPException(
            status_code=401,
            detail="Invalid password"
        )

    token = jwt.encode(
        {
            "Email": stored_user.Email,
            "role": stored_user.role
        },
        SECRET_KEY,
        algorithm=ALGORITHM
    )

    return {
        "access_token": token,
        "token_type": "bearer"
    }
@app.get("/user")
def get_user(credentials: HTTPAuthorizationCredentials = Depends(security)):

    token = credentials.credentials

    print("Received Token:", token)

    try:
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )

        print("Payload:", payload)

        return {
            "message": "Authorized User",
            "user": payload
        }

    except JWTError as e:
        print("JWT Error:", repr(e))
        raise HTTPException(
            status_code=401,
            detail="Invalid Token"
        )

# API routes for Analytics Dashboard
@app.get("/api/analytics")
def get_analytics(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    try:
        jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return {
            "kpiData": {
                "followers": {"label": "Total Followers", "value": 1254300, "change": 12.4, "status": "positive"},
                "views": {"label": "Total Views", "value": 8432000, "change": 8.2, "status": "positive"},
                "likes": {"label": "Total Likes", "value": 1240000, "change": 5.1, "status": "positive"},
                "comments": {"label": "Total Comments", "value": 89300, "change": -2.4, "status": "negative"},
                "shares": {"label": "Total Shares", "value": 45200, "change": 18.7, "status": "positive"},
                "watchTime": {"label": "Total Watch Time", "value": 345000, "change": 15.3, "status": "positive"},
                "engagementRate": {"label": "Engagement Rate", "value": 4.85, "change": 0.6, "status": "positive"}
            },
            "platformPerformance": [
                {"platform": "YouTube", "followers": 520000, "engagementRate": 5.6, "posts": 12, "views": 4200000, "likes": 580000, "comments": 48000, "shares": 12000, "watchTime": 215000, "color": "#FF0000"},
                {"platform": "Instagram", "followers": 450000, "engagementRate": 4.2, "posts": 38, "views": 1800000, "likes": 390000, "comments": 22000, "shares": 18000, "watchTime": 45000, "color": "#E1306C"},
                {"platform": "TikTok", "followers": 234300, "engagementRate": 7.8, "posts": 56, "views": 2432000, "likes": 270000, "comments": 19300, "shares": 15200, "watchTime": 85000, "color": "#000000"},
                {"platform": "Twitch", "followers": 50000, "engagementRate": 2.1, "posts": 15, "views": 0, "likes": 0, "comments": 0, "shares": 0, "watchTime": 0, "color": "#9146FF"}
            ]
        }
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid Token")

@app.get("/api/analytics/views")
def get_views(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    try:
        jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return [
            {"month": "Jul 2025", "views": 580000, "likes": 85000, "comments": 6200, "shares": 3100},
            {"month": "Aug 2025", "views": 610000, "likes": 92000, "comments": 7200, "shares": 3400},
            {"month": "Sep 2025", "views": 590000, "likes": 88000, "comments": 6900, "shares": 3200},
            {"month": "Oct 2025", "views": 640000, "likes": 95000, "comments": 7500, "shares": 3600},
            {"month": "Nov 2025", "views": 680000, "likes": 101000, "comments": 7800, "shares": 3900},
            {"month": "Dec 2025", "views": 790000, "likes": 118000, "comments": 8400, "shares": 4800},
            {"month": "Jan 2026", "views": 720000, "likes": 105000, "comments": 8100, "shares": 4100},
            {"month": "Feb 2026", "views": 750000, "likes": 110000, "comments": 8300, "shares": 4300},
            {"month": "Mar 2026", "views": 810000, "likes": 122000, "comments": 8900, "shares": 4700},
            {"month": "Apr 2026", "views": 880000, "likes": 130000, "comments": 9400, "shares": 5100},
            {"month": "May 2026", "views": 920000, "likes": 138000, "comments": 9900, "shares": 5400},
            {"month": "Jun 2026", "views": 950000, "likes": 142000, "comments": 10100, "shares": 5600}
        ]
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid Token")

@app.get("/api/analytics/followers")
def get_followers(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    try:
        jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return [
            {"month": "Jul 2025", "count": 1010000, "netGain": 12000},
            {"month": "Aug 2025", "count": 1032000, "netGain": 22000},
            {"month": "Sep 2025", "count": 1051000, "netGain": 19000},
            {"month": "Oct 2025", "count": 1074000, "netGain": 23000},
            {"month": "Nov 2025", "count": 1098000, "netGain": 24000},
            {"month": "Dec 2025", "count": 1130000, "netGain": 32000},
            {"month": "Jan 2026", "count": 1152000, "netGain": 22000},
            {"month": "Feb 2026", "count": 1175000, "netGain": 23000},
            {"month": "Mar 2026", "count": 1198000, "netGain": 23000},
            {"month": "Apr 2026", "count": 1221000, "netGain": 23000},
            {"month": "May 2026", "count": 1240000, "netGain": 19000},
            {"month": "Jun 2026", "count": 1254300, "netGain": 14300}
        ]
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid Token")

@app.get("/api/analytics/audience")
def get_audience(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    try:
        jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return [
            {"name": "Female", "value": 58},
            {"name": "Male", "value": 36},
            {"name": "Non-binary / Other", "value": 6}
        ]
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid Token")

@app.get("/api/user/details")
def get_user_details(credentials: HTTPAuthorizationCredentials = Depends(security), db: Session = Depends(get_db)):
    token = credentials.credentials
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("Email")
        user = db.query(User).filter(User.Email == email).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        profile = db.query(CreatorProfile).filter(CreatorProfile.user_id == user.id).first()
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

@app.put("/api/user/account")
def update_user_account(data: AccountUpdate, credentials: HTTPAuthorizationCredentials = Depends(security), db: Session = Depends(get_db)):
    token = credentials.credentials
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        current_email = payload.get("Email")
        user = db.query(User).filter(User.Email == current_email).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        if data.Email != user.Email:
            existing = db.query(User).filter(User.Email == data.Email).first()
            if existing:
                raise HTTPException(status_code=400, detail="Email already in use")
        
        user.Username = data.Username
        user.Email = data.Email
        user.phone = data.phone
        if data.Password:
            user.Password = bcrypt.hashpw(data.Password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        
        db.commit()
        
        new_token = jwt.encode(
            {"Email": user.Email, "role": user.role},
            SECRET_KEY,
            algorithm=ALGORITHM
        )
        return {"message": "Account updated successfully", "access_token": new_token}
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid Token")

@app.put("/api/user/profile")
def update_user_profile(data: ProfileUpdate, credentials: HTTPAuthorizationCredentials = Depends(security), db: Session = Depends(get_db)):
    token = credentials.credentials
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("Email")
        user = db.query(User).filter(User.Email == email).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        profile = db.query(CreatorProfile).filter(CreatorProfile.user_id == user.id).first()
        if not profile:
            profile = CreatorProfile(user_id=user.id)
            db.add(profile)
        
        profile.bio = data.bio
        profile.language = data.language
        profile.region = data.region
        profile.platform = data.platform
        
        db.commit()
        return {"message": "Profile updated successfully"}
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid Token")

@app.get("/api/notifications")
def get_notifications(credentials: HTTPAuthorizationCredentials = Depends(security), db: Session = Depends(get_db)):
    token = credentials.credentials
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("Email")
        user = db.query(User).filter(User.Email == email).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        # Fetch existing notifications for the user
        notifs = db.query(Notification).filter(Notification.user_id == user.id).order_by(Notification.created_at.desc()).all()
        
        # Seed default ones if none exist
        if not notifs:
            default_notifs = [
                Notification(
                    user_id=user.id,
                    title="🎉 Welcome to CreatorIQ!",
                    message="Welcome to your new Creator Analytics dashboard! Start by exploring your metrics or custom themes in the Settings view.",
                    type="system",
                    read=False
                ),
                Notification(
                    user_id=user.id,
                    title="📈 Milestone: Views Hit!",
                    message="Congratulations! Your cumulative audience views crossed 8.4M overall views this month.",
                    type="milestone",
                    read=False
                ),
                Notification(
                    user_id=user.id,
                    title="⚠️ Sync LinkedIn Platform",
                    message="Please configure your primary platform under settings to optimize custom data fetching.",
                    type="alert",
                    read=False
                )
            ]
            for n in default_notifs:
                db.add(n)
            db.commit()
            notifs = db.query(Notification).filter(Notification.user_id == user.id).order_by(Notification.created_at.desc()).all()
        
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
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid Token")

@app.post("/api/notifications/{id}/read")
def mark_notification_read(id: int, credentials: HTTPAuthorizationCredentials = Depends(security), db: Session = Depends(get_db)):
    token = credentials.credentials
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("Email")
        user = db.query(User).filter(User.Email == email).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        notif = db.query(Notification).filter(Notification.id == id, Notification.user_id == user.id).first()
        if not notif:
            raise HTTPException(status_code=404, detail="Notification not found")
        
        notif.read = True
        db.commit()
        return {"message": "Notification marked as read"}
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid Token")

@app.post("/api/notifications/read-all")
def mark_all_notifications_read(credentials: HTTPAuthorizationCredentials = Depends(security), db: Session = Depends(get_db)):
    token = credentials.credentials
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("Email")
        user = db.query(User).filter(User.Email == email).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        db.query(Notification).filter(Notification.user_id == user.id).update({Notification.read: True})
        db.commit()
        return {"message": "All notifications marked as read"}
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid Token")

@app.delete("/api/notifications/clear")
def clear_notifications(credentials: HTTPAuthorizationCredentials = Depends(security), db: Session = Depends(get_db)):
    token = credentials.credentials
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("Email")
        user = db.query(User).filter(User.Email == email).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        db.query(Notification).filter(Notification.user_id == user.id).delete()
        db.commit()
        return {"message": "All notifications cleared"}
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid Token")

@app.get("/api/admin/users")
def get_admin_users(credentials: HTTPAuthorizationCredentials = Depends(security), db: Session = Depends(get_db)):
    token = credentials.credentials
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        role = payload.get("role")
        if role != "Admin":
            raise HTTPException(status_code=403, detail="Forbidden: Admin access required")
        
        users = db.query(User).all()
        result = []
        for u in users:
            result.append({
                "id": u.id,
                "Username": u.Username,
                "Email": u.Email,
                "phone": u.phone,
                "role": u.role
            })
        return result
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid Token")

@app.delete("/api/admin/users/{id}")
def delete_user(id: int, credentials: HTTPAuthorizationCredentials = Depends(security), db: Session = Depends(get_db)):
    token = credentials.credentials
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        role = payload.get("role")
        if role != "Admin":
            raise HTTPException(status_code=403, detail="Forbidden: Admin access required")
        
        email = payload.get("Email")
        current_user = db.query(User).filter(User.Email == email).first()
        if current_user and current_user.id == id:
            raise HTTPException(status_code=400, detail="Cannot delete your own admin account")
        
        target_user = db.query(User).filter(User.id == id).first()
        if not target_user:
            raise HTTPException(status_code=404, detail="User not found")
        
        db.delete(target_user)
        db.commit()
        return {"message": "User deleted successfully"}
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid Token")