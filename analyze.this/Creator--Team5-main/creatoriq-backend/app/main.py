from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, engine
from app.core.config import settings
from app.routers import auth, users, analytics

# Import models so they register with Base.metadata before create_all runs
from app.models import user, creator_profile, agency_profile  # noqa: F401

app = FastAPI(title="CreatorIQ API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_ORIGIN],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(users.router)
app.include_router(analytics.router)


@app.on_event("startup")
def on_startup():
    # For Milestone 1 simplicity we auto-create tables.
    # Once you introduce Alembic migrations (recommended before Milestone 2),
    # remove this and rely on `alembic upgrade head` instead.
    Base.metadata.create_all(bind=engine)


@app.get("/")
def root():
    return {"status": "ok", "service": "CreatorIQ API"}
