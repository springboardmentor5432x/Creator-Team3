from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.auth.oauth2 import get_current_user
from app.models.user import User

from app.schemas.content_schema import (
    ContentCreate,
    ContentUpdate,
)

from app.services.content_service import (
    create_content,
    get_all_content,
    get_content_by_id,
    update_content,
    delete_content,
    dashboard,
    get_content_analytics,
    get_top_content,
    get_platform_analytics,
    get_content_trends,
    compare_content,
    search_content,
    filter_content,
    get_paginated_content,
)

router = APIRouter(
    prefix="/content",
    tags=["Content Analytics"]
)


# -----------------------------
# Create Content
# -----------------------------
@router.post("/")
def create_new_content(
    content: ContentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return create_content(
        content,
        db,
        current_user,
    )


# -----------------------------
# Content Performance Dashboard
# -----------------------------
@router.get("/")
def get_contents(
    search: str = None,
    platform: str = None,
    sort_by: str = "publish_date",
    sort_order: str = "desc",
    page: int = 1,
    limit: int = 10,
    period: str = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_all_content(
        db=db,
        current_user=current_user,
        search=search,
        platform=platform,
        sort_by=sort_by,
        order=sort_order,
        page=page,
        limit=limit,
        period=period,
    )


# -----------------------------
# Dashboard
# -----------------------------
@router.get("/dashboard")
def get_dashboard(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return dashboard(
        db,
        current_user,
    )


# -----------------------------
# Analytics Summary
# -----------------------------
@router.get("/analytics")
def analytics(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_content_analytics(
        db,
        current_user,
    )


# -----------------------------
# Top Performing Content
# -----------------------------
@router.get("/top-performing")
def top_content(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_top_content(
        db,
        current_user,
    )


# -----------------------------
# Platform Analytics
# -----------------------------
@router.get("/platform-analytics")
def platform_analytics(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_platform_analytics(
        db,
        current_user,
    )


# -----------------------------
# Performance Trends
# -----------------------------
@router.get("/trends")
def trends(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_content_trends(
        db,
        current_user,
    )


# -----------------------------
# Search Content
# -----------------------------
@router.get("/search")
def search(
    title: str,
    db: Session = Depends(get_db),
):
    return search_content(
        title,
        db,
    )


# -----------------------------
# Filter Content
# -----------------------------
@router.get("/filter")
def filter_by_platform(
    platform: str,
    db: Session = Depends(get_db),
):
    return filter_content(
        platform,
        db,
    )


# -----------------------------
# Pagination
# -----------------------------
@router.get("/pagination")
def pagination(
    page: int = 1,
    limit: int = 10,
    db: Session = Depends(get_db),
):
    return get_paginated_content(
        page,
        limit,
        db,
    )


# -----------------------------
# Compare Content
# -----------------------------
@router.get("/compare")
def compare(
    content1: int,
    content2: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return compare_content(
        db,
        content1,
        content2,
        current_user,
    )


# -----------------------------
# Get Single Content
# -----------------------------
@router.get("/{content_id}")
def get_single_content(
    content_id: int,
    db: Session = Depends(get_db),
):
    return get_content_by_id(
        content_id,
        db,
    )


# -----------------------------
# Update Content
# -----------------------------
@router.put("/{content_id}")
def edit_content(
    content_id: int,
    content: ContentUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return update_content(
        content_id,
        content,
        db,
        current_user,
    )


# -----------------------------
# Delete Content
# -----------------------------
@router.delete("/{content_id}")
def remove_content(
    content_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return delete_content(
        content_id,
        db,
        current_user,
    )