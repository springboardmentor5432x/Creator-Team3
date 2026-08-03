from fastapi import APIRouter
from app.services.instagram_service import (
    get_profile,
    get_posts,
)
from app.services.instagram_service import sync_posts
from app.services.instagram_service import get_saved_posts
from app.services.instagram_service import get_analytics
router = APIRouter(
    prefix="/instagram",
    tags=["Instagram API"]
)
from app.services.instagram_service import save_audience_snapshot
from app.services.instagram_service import get_audience_growth
from app.services.instagram_service import get_post_trends

@router.get("/profile")
def profile():
    return get_profile()


@router.get("/posts")
def posts():
    return get_posts()

@router.post("/sync")
def sync():
    return sync_posts()

@router.get("/database-posts")
def database_posts():
    return get_saved_posts()

@router.get("/analytics")
def analytics():
    return get_analytics()

@router.post("/audience/snapshot")
def audience_snapshot():
    return save_audience_snapshot()

@router.get("/audience/growth")
def audience_growth():
    return get_audience_growth()

@router.get("/trends")
def trends():
    return get_post_trends()