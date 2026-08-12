from fastapi import FastAPI, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import bcrypt
import random
import re
from datetime import datetime, timedelta
from jose import jwt, JWTError
from sqlalchemy.orm import Session
from database import engine, Base, get_db
from models import User, CreatorProfile, Notification, ContentLink, RevenueRecord

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
    Username: str
    Email: str
    phone: str
    Password: str
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

class LinkSubmit(BaseModel):
    url: str

class RevenueSubmit(BaseModel):
    source: str
    amount: float
    description: str = ""
    date: str = None


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

@app.post("/api/links")
def add_content_link(data: LinkSubmit, credentials: HTTPAuthorizationCredentials = Depends(security), db: Session = Depends(get_db)):
    token = credentials.credentials
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("Email")
        user = db.query(User).filter(User.Email == email).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        url = data.url.strip()
        url_lower = url.lower()
        
        # Determine platform
        if "youtube.com" in url_lower or "youtu.be" in url_lower:
            platform = "YouTube"
            default_title = "YouTube Video Upload"
        elif "instagram.com" in url_lower:
            platform = "Instagram"
            default_title = "Instagram Media Post"
        elif "linkedin.com" in url_lower:
            platform = "LinkedIn"
            default_title = "LinkedIn Article Share"
        elif "twitch.tv" in url_lower:
            platform = "Twitch"
            default_title = "Twitch Live Stream Clip"
        else:
            raise HTTPException(status_code=400, detail="Invalid platform URL. Only YouTube, Instagram, LinkedIn, and Twitch are supported.")
        
        # Try to make a pretty title from URL path or suffix
        suffix = url.split('/')[-1].split('?')[0]
        if len(suffix) > 3 and suffix != "watch":
            title = f"{platform} Content: {suffix}"
        else:
            # Check for YouTube watch query parameter
            match = re.search(r"[?&]v=([^&#]+)", url)
            if match:
                title = f"YouTube Video: {match.group(1)}"
            else:
                title = f"{default_title} ({datetime.utcnow().strftime('%b %d, %Y')})"
        
        # Generate high-fidelity mock metrics
        views = random.randint(15000, 750000)
        likes = int(views * random.uniform(0.04, 0.12))
        comments = int(likes * random.uniform(0.02, 0.08))
        shares = int(likes * random.uniform(0.01, 0.05))
        
        new_link = ContentLink(
            user_id=user.id,
            url=url,
            platform=platform,
            title=title,
            views=views,
            likes=likes,
            comments=comments,
            shares=shares
        )
        
        db.add(new_link)
        db.commit()
        db.refresh(new_link)
        
        return {
            "id": new_link.id,
            "url": new_link.url,
            "platform": new_link.platform,
            "title": new_link.title,
            "views": new_link.views,
            "likes": new_link.likes,
            "comments": new_link.comments,
            "shares": new_link.shares,
            "created_at": new_link.created_at.isoformat()
        }
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid Token")

@app.get("/api/links")
def get_content_links(credentials: HTTPAuthorizationCredentials = Depends(security), db: Session = Depends(get_db)):
    token = credentials.credentials
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("Email")
        user = db.query(User).filter(User.Email == email).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        links = db.query(ContentLink).filter(ContentLink.user_id == user.id).order_by(ContentLink.created_at.desc()).all()
        return [
            {
                "id": l.id,
                "url": l.url,
                "platform": l.platform,
                "title": l.title,
                "views": l.views,
                "likes": l.likes,
                "comments": l.comments,
                "shares": l.shares,
                "created_at": l.created_at.isoformat()
            } for l in links
        ]
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid Token")

@app.delete("/api/links/{id}")
def delete_content_link(id: int, credentials: HTTPAuthorizationCredentials = Depends(security), db: Session = Depends(get_db)):
    token = credentials.credentials
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("Email")
        user = db.query(User).filter(User.Email == email).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        link = db.query(ContentLink).filter(ContentLink.id == id, ContentLink.user_id == user.id).first()
        if not link:
            raise HTTPException(status_code=404, detail="Link not found")
        
        db.delete(link)
        db.commit()
        return {"message": "Link deleted successfully"}
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid Token")

@app.get("/api/revenue")
def get_revenue_records(credentials: HTTPAuthorizationCredentials = Depends(security), db: Session = Depends(get_db)):
    token = credentials.credentials
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("Email")
        user = db.query(User).filter(User.Email == email).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        records = db.query(RevenueRecord).filter(RevenueRecord.user_id == user.id).order_by(RevenueRecord.date.desc()).all()
        
        if not records:
            now = datetime.utcnow()
            default_records = [
                # AdSense payouts
                RevenueRecord(user_id=user.id, source="AdSense", amount=2450.00, description="Monthly AdSense Payout", date=now - timedelta(days=150)),
                RevenueRecord(user_id=user.id, source="AdSense", amount=2890.00, description="Monthly AdSense Payout", date=now - timedelta(days=120)),
                RevenueRecord(user_id=user.id, source="AdSense", amount=3120.00, description="Monthly AdSense Payout", date=now - timedelta(days=90)),
                RevenueRecord(user_id=user.id, source="AdSense", amount=2750.00, description="Monthly AdSense Payout", date=now - timedelta(days=60)),
                RevenueRecord(user_id=user.id, source="AdSense", amount=3400.00, description="Monthly AdSense Payout", date=now - timedelta(days=30)),
                RevenueRecord(user_id=user.id, source="AdSense", amount=3850.00, description="Monthly AdSense Payout", date=now - timedelta(days=5)),
                
                # Sponsorship deals
                RevenueRecord(user_id=user.id, source="Sponsorship", amount=5000.00, description="NordVPN Video Integration", date=now - timedelta(days=110)),
                RevenueRecord(user_id=user.id, source="Sponsorship", amount=7500.00, description="Squarespace Dedicated Video", date=now - timedelta(days=75)),
                RevenueRecord(user_id=user.id, source="Sponsorship", amount=6200.00, description="Intel Core Ultra Sponsorship", date=now - timedelta(days=20)),
                
                # Affiliate links
                RevenueRecord(user_id=user.id, source="Affiliate", amount=450.00, description="Amazon Referrals", date=now - timedelta(days=105)),
                RevenueRecord(user_id=user.id, source="Affiliate", amount=610.00, description="Amazon Referrals", date=now - timedelta(days=45)),
                
                # Merchandise sales
                RevenueRecord(user_id=user.id, source="Merch", amount=1200.00, description="Hoodies Drop Payout", date=now - timedelta(days=40))
            ]
            for r in default_records:
                db.add(r)
            db.commit()
            records = db.query(RevenueRecord).filter(RevenueRecord.user_id == user.id).order_by(RevenueRecord.date.desc()).all()
            
        return [
            {
                "id": r.id,
                "source": r.source,
                "amount": r.amount,
                "description": r.description,
                "date": r.date.isoformat()
            } for r in records
        ]
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid Token")

@app.post("/api/revenue")
def add_revenue_record(data: RevenueSubmit, credentials: HTTPAuthorizationCredentials = Depends(security), db: Session = Depends(get_db)):
    token = credentials.credentials
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("Email")
        user = db.query(User).filter(User.Email == email).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        parsed_date = datetime.utcnow()
        if data.date:
            try:
                date_str = data.date.replace('Z', '')
                if 'T' in date_str:
                    parsed_date = datetime.fromisoformat(date_str)
                else:
                    parsed_date = datetime.strptime(date_str, "%Y-%m-%d")
            except Exception:
                pass
                
        new_record = RevenueRecord(
            user_id=user.id,
            source=data.source,
            amount=data.amount,
            description=data.description,
            date=parsed_date
        )
        
        db.add(new_record)
        db.commit()
        db.refresh(new_record)
        
        return {
            "id": new_record.id,
            "source": new_record.source,
            "amount": new_record.amount,
            "description": new_record.description,
            "date": new_record.date.isoformat()
        }
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid Token")

@app.delete("/api/revenue/{id}")
def delete_revenue_record(id: int, credentials: HTTPAuthorizationCredentials = Depends(security), db: Session = Depends(get_db)):
    token = credentials.credentials
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("Email")
        user = db.query(User).filter(User.Email == email).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        record = db.query(RevenueRecord).filter(RevenueRecord.id == id, RevenueRecord.user_id == user.id).first()
        if not record:
            raise HTTPException(status_code=404, detail="Record not found")
        
        db.delete(record)
        db.commit()
        return {"message": "Revenue record deleted successfully"}
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid Token")