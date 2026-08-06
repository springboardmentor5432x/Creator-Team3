from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from datetime import datetime, timedelta

from database import get_db
from models import User, CreatorProfile, SocialAccount
from Auth import verify_token
from routers.user import get_or_create_user_from_token
from services.youtube_service import YouTubeService
from services.youtube_analytics_service import YouTubeAnalyticsService

router = APIRouter(prefix="/api/youtube", tags=["YouTube"])


def _get_youtube_account(user, db: Session):
    """Look up the user's connected YouTube SocialAccount."""
    db_user = get_or_create_user_from_token(user, db)
    profile = db.query(CreatorProfile).filter(CreatorProfile.user_id == db_user.id).first()
    if not profile:
        return None, None
    account = db.query(SocialAccount).filter(
        SocialAccount.creator_id == profile.creator_id,
        SocialAccount.platform == "YouTube"
    ).first()
    return db_user, account


def _default_dates(start_date: str = None, end_date: str = None):
    if not end_date:
        end_date = datetime.utcnow().strftime("%Y-%m-%d")
    if not start_date:
        start_date = (datetime.utcnow() - timedelta(days=28)).strftime("%Y-%m-%d")
    return start_date, end_date


# ── Channel Dashboard (Data API v3) ──
@router.get("/dashboard")
def youtube_dashboard(user=Depends(verify_token), db: Session = Depends(get_db)):
    db_user, account = _get_youtube_account(user, db)
    if not account:
        return {"connected": False, "reason": "No YouTube account connected. Go to Settings to connect."}

    yt = YouTubeService()
    handle = account.channel_handle or account.account_name or ""
    data = yt.get_channel_details(handle)
    return data


# ── Analytics Overview ──
@router.get("/analytics/overview")
def analytics_overview(
    start_date: str = Query(None), end_date: str = Query(None),
    user=Depends(verify_token), db: Session = Depends(get_db)
):
    db_user, account = _get_youtube_account(user, db)
    if not account:
        return {"connected": False}
    sd, ed = _default_dates(start_date, end_date)
    # No OAuth token stored on SocialAccount — return unavailable
    access_token = getattr(account, 'access_token', None) or None
    return YouTubeAnalyticsService.get_overview(access_token, sd, ed)


# ── Daily Metrics ──
@router.get("/analytics/daily")
def analytics_daily(
    start_date: str = Query(None), end_date: str = Query(None),
    user=Depends(verify_token), db: Session = Depends(get_db)
):
    db_user, account = _get_youtube_account(user, db)
    if not account:
        return {"connected": False}
    sd, ed = _default_dates(start_date, end_date)
    access_token = getattr(account, 'access_token', None) or None
    return YouTubeAnalyticsService.get_daily_metrics(access_token, sd, ed)


# ── Traffic Sources ──
@router.get("/analytics/traffic")
def analytics_traffic(
    start_date: str = Query(None), end_date: str = Query(None),
    user=Depends(verify_token), db: Session = Depends(get_db)
):
    db_user, account = _get_youtube_account(user, db)
    if not account:
        return {"connected": False}
    sd, ed = _default_dates(start_date, end_date)
    access_token = getattr(account, 'access_token', None) or None
    return YouTubeAnalyticsService.get_traffic_sources(access_token, sd, ed)


# ── Demographics ──
@router.get("/analytics/demographics")
def analytics_demographics(
    start_date: str = Query(None), end_date: str = Query(None),
    user=Depends(verify_token), db: Session = Depends(get_db)
):
    db_user, account = _get_youtube_account(user, db)
    if not account:
        return {"connected": False}
    sd, ed = _default_dates(start_date, end_date)
    access_token = getattr(account, 'access_token', None) or None
    return YouTubeAnalyticsService.get_demographics(access_token, sd, ed)


# ── Geography ──
@router.get("/analytics/geography")
def analytics_geography(
    start_date: str = Query(None), end_date: str = Query(None),
    user=Depends(verify_token), db: Session = Depends(get_db)
):
    db_user, account = _get_youtube_account(user, db)
    if not account:
        return {"connected": False}
    sd, ed = _default_dates(start_date, end_date)
    access_token = getattr(account, 'access_token', None) or None
    return YouTubeAnalyticsService.get_geography(access_token, sd, ed)


# ── Devices ──
@router.get("/analytics/devices")
def analytics_devices(
    start_date: str = Query(None), end_date: str = Query(None),
    user=Depends(verify_token), db: Session = Depends(get_db)
):
    db_user, account = _get_youtube_account(user, db)
    if not account:
        return {"connected": False}
    sd, ed = _default_dates(start_date, end_date)
    access_token = getattr(account, 'access_token', None) or None
    return YouTubeAnalyticsService.get_devices(access_token, sd, ed)


# ── Revenue ──
@router.get("/analytics/revenue")
def analytics_revenue(
    start_date: str = Query(None), end_date: str = Query(None),
    user=Depends(verify_token), db: Session = Depends(get_db)
):
    db_user, account = _get_youtube_account(user, db)
    if not account:
        return {"connected": False}
    sd, ed = _default_dates(start_date, end_date)
    access_token = getattr(account, 'access_token', None) or None
    return YouTubeAnalyticsService.get_revenue(access_token, sd, ed)


# ── Top Videos (Analytics) ──
@router.get("/analytics/top-videos")
def analytics_top_videos(
    start_date: str = Query(None), end_date: str = Query(None),
    max_results: int = Query(10),
    user=Depends(verify_token), db: Session = Depends(get_db)
):
    db_user, account = _get_youtube_account(user, db)
    if not account:
        return {"connected": False}
    sd, ed = _default_dates(start_date, end_date)
    access_token = getattr(account, 'access_token', None) or None
    return YouTubeAnalyticsService.get_top_videos(access_token, sd, ed, max_results)


# ── Search Terms ──
@router.get("/analytics/search-terms")
def analytics_search_terms(
    start_date: str = Query(None), end_date: str = Query(None),
    user=Depends(verify_token), db: Session = Depends(get_db)
):
    db_user, account = _get_youtube_account(user, db)
    if not account:
        return {"connected": False}
    sd, ed = _default_dates(start_date, end_date)
    access_token = getattr(account, 'access_token', None) or None
    return YouTubeAnalyticsService.get_search_terms(access_token, sd, ed)


# ── Video Library (Data API) ──
@router.get("/videos")
def get_videos(
    page: int = Query(1), per_page: int = Query(50),
    user=Depends(verify_token), db: Session = Depends(get_db)
):
    db_user, account = _get_youtube_account(user, db)
    if not account:
        return {"connected": False}

    yt = YouTubeService()
    handle = account.channel_handle or account.account_name or ""
    data = yt.get_channel_details(handle)
    videos = data.get("recent_videos", [])
    return {"data": videos, "total": len(videos), "page": page}
