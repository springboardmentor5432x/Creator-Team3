from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# Load environment variables globally on startup
load_dotenv()

from database import engine, Base
from routers import user, admin, analytics, prediction, hashtag, social, notifications, revenue, links, ai, campaign, instagram, instagram_oauth, twitter_oauth, twitch_oauth, linkedin_oauth, facebook_oauth, youtube_oauth, debug, team, youtube
from services.scheduler import start_scheduler

app = FastAPI(title="CreatorIQ Integrated API", version="1.0.0")

# Enable CORS for frontend local server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Database tables
Base.metadata.create_all(bind=engine)

@app.on_event("startup")
def startup_event():
    start_scheduler()

# Include Routers
app.include_router(user.router)
app.include_router(admin.router)
app.include_router(analytics.router)
app.include_router(prediction.router)
app.include_router(hashtag.router)
app.include_router(social.router)
app.include_router(notifications.router)
app.include_router(revenue.router)
app.include_router(links.router)
app.include_router(ai.router)
app.include_router(campaign.router)
app.include_router(team.router)
app.include_router(instagram.router)
app.include_router(instagram_oauth.router)
app.include_router(youtube.router)
app.include_router(twitter_oauth.router)
app.include_router(twitch_oauth.router)
app.include_router(linkedin_oauth.router)
app.include_router(facebook_oauth.router)
app.include_router(youtube_oauth.router)
app.include_router(debug.router)

@app.on_event("startup")
def startup_event():
    from services.background_sync_service import BackgroundSyncService
    BackgroundSyncService.start(30)

@app.get("/")
def home():
    return {"message": "Welcome to CreatorIQ Unified Backend"}
