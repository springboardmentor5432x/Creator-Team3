from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, engine

# Models
from app.models.user import User
from app.models.creator_profile import CreatorProfile
from app.models.content import Content
from app.models.analytics import Analytics
from app.models.user_settings import UserSettings
from app.models.team_member import TeamMember
from app.models.audience import Audience
from app.models.audience_history import AudienceHistory
from app.models.social_account import SocialAccount
from app.models.post import InstagramPost
from app.models.post_insights import PostInsight
from app.models.revenue import Sponsorship, AdRevenue

# Routers
from app.routes.auth import router as auth_router
from app.routes.creator_profile import router as creator_profile_router
from app.routes.content import router as content_router
from app.routes.analytics import router as analytics_router
from app.routes.dashboard import router as dashboard_router
from app.routes.settings import router as settings_router
from app.routes.team import router as team_router
from app.routes.audience import router as audience_router
from app.routes.social import router as social_router
from app.routes.instagram_auth import router as instagram_router
from app.routes.instagram_api import router as instagram_api_router
from app.routes import growth, revenue
from app.routes.youtube_auth import router as youtube_router
from app.routes.facebook_auth import router as facebook_router

# Create tables
Base.metadata.create_all(bind=engine, checkfirst=True)

app = FastAPI(
    title="CreatorIQ API",
    version="1.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(auth_router)
app.include_router(creator_profile_router)
app.include_router(content_router)
app.include_router(analytics_router)
app.include_router(dashboard_router)
app.include_router(settings_router)
app.include_router(team_router)
app.include_router(audience_router)
app.include_router(social_router)
app.include_router(instagram_router)
app.include_router(instagram_api_router)
app.include_router(growth.router)
app.include_router(revenue.router)
app.include_router(youtube_router)
app.include_router(facebook_router)

@app.get("/")
def home():
    return {"message": "Backend running successfully"}