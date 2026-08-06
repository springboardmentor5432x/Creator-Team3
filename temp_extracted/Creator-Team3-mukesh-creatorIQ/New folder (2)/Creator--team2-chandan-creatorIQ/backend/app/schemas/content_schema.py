from typing import Optional
from datetime import date
from pydantic import BaseModel, Field


# ----------------------------
# Create Content Schema
# ----------------------------
class ContentCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    thumbnail: Optional[str] = None
    platform: str = Field(..., min_length=2, max_length=50)

    creator_id: int
    description: str
    content_type: str
    publish_date: date

    views: int = Field(0, ge=0)
    likes: int = Field(0, ge=0)
    comments: int = Field(0, ge=0)
    shares: int = Field(0, ge=0)
    saves: int = Field(0, ge=0)

    watch_time: float = Field(0, ge=0)
    reach: int = Field(0, ge=0)


# ----------------------------
# Update Content Schema
# ----------------------------
class ContentUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    thumbnail: Optional[str] = None
    platform: Optional[str] = Field(None, min_length=2, max_length=50)

    creator_id: Optional[int] = None
    description: Optional[str] = None
    content_type: Optional[str] = None
    publish_date: Optional[date] = None

    views: Optional[int] = Field(None, ge=0)
    likes: Optional[int] = Field(None, ge=0)
    comments: Optional[int] = Field(None, ge=0)
    shares: Optional[int] = Field(None, ge=0)
    saves: Optional[int] = Field(None, ge=0)

    watch_time: Optional[float] = Field(None, ge=0)
    reach: Optional[int] = Field(None, ge=0)


# ----------------------------
# Response Schema
# ----------------------------
class ContentResponse(BaseModel):
    id: int
    creator_id: int

    title: str
    thumbnail: Optional[str]
    platform: str
    content_type: Optional[str]
    description: Optional[str]
    publish_date: Optional[date]

    views: int
    likes: int
    comments: int
    shares: int
    saves: int

    watch_time: float
    reach: int
    engagement_rate: float

    class Config:
        from_attributes = True