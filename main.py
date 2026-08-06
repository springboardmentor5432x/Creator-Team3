from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware




from database import engine, Base
import models

from routers import (
    user,
    analytics,
    audience_api,
    growth,
    content,
    social,
    notifications,
    admin,
    prediction,
    hashtag,
    agency,
    report
)


app = FastAPI(
    title="CreatorIQ Backend",
    description="Creator Analytics and Content Performance Dashboard API",
    version="1.0.0"
)


# Import all models so SQLAlchemy can detect tables
from models import *


# Check loaded database tables
print(Base.metadata.tables.keys())


# Create database tables
Base.metadata.create_all(bind=engine)



# -----------------------------
# CORS Configuration
# -----------------------------

app.add_middleware(
    CORSMiddleware,

    allow_origins=["*"],

    allow_credentials=True,

    allow_methods=["*"],

    allow_headers=["*"],
)



# -----------------------------
# Include Routers
# -----------------------------

app.include_router(user.router)

app.include_router(analytics.router)

app.include_router(audience_api.router)

app.include_router(growth.router)

app.include_router(content.router)

app.include_router(social.router)

app.include_router(notifications.router)

app.include_router(admin.router)

app.include_router(prediction.router)

app.include_router(hashtag.router)

app.include_router(agency.router)

app.include_router(report.router)




# -----------------------------
# Home API
# -----------------------------

@app.get("/")
def home():

    return {
        "message": "Welcome to CreatorIQ Backend"
    }