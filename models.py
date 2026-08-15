from sqlalchemy import (
    Column,
    Integer,
    String,
    Float,
    Boolean,
    DateTime,
    ForeignKey
)

from sqlalchemy.orm import relationship
from database import Base
from datetime import datetime



# =========================
# User Table
# =========================

class User(Base):

    __tablename__ = "users"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    Username = Column(
        String,
        nullable=False
    )

    Email = Column(
        String,
        unique=True,
        nullable=False,
        index=True
    )

    phone = Column(
        String,
        unique=True,
        nullable=False
    )

    Password = Column(
        String,
        nullable=False
    )

    role = Column(
        String,
        nullable=False
    )


    # Relationships

    creator_profile = relationship(
        "CreatorProfile",
        back_populates="user",
        cascade="all, delete"
    )


    agency_profile = relationship(
        "AgencyProfile",
        back_populates="user",
        cascade="all, delete"
    )


    analytics = relationship(
        "Analytics",
        back_populates="user",
        cascade="all, delete"
    )


    content = relationship(
        "Content",
        back_populates="user",
        cascade="all, delete"
    )


    audience = relationship(
        "Audience",
        back_populates="user",
        cascade="all, delete"
    )


    growth = relationship(
        "Growth",
        back_populates="user",
        cascade="all, delete"
    )


    hashtags = relationship(
        "Hashtag",
        back_populates="user",
        cascade="all, delete"
    )


    predictions = relationship(
        "Prediction",
        back_populates="user",
        cascade="all, delete"
    )


    social_accounts = relationship(
        "SocialAccount",
        back_populates="user",
        cascade="all, delete"
    )


    notifications = relationship(
        "Notification",
        back_populates="user",
        cascade="all, delete"
    )




# =========================
# Creator Profile
# =========================

class CreatorProfile(Base):

    __tablename__ = "creator_profiles"


    id = Column(
        Integer,
        primary_key=True
    )


    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        unique=True
    )


    bio = Column(String)

    language = Column(String)

    region = Column(String)

    platform = Column(String)

    followers = Column(
        Integer,
        default=0
    )


    engagement_rate = Column(
        Float,
        default=0
    )


    user = relationship(
        "User",
        back_populates="creator_profile"
    )




# =========================
# Agency Profile
# =========================

class AgencyProfile(Base):

    __tablename__ = "agency_profiles"


    id = Column(
        Integer,
        primary_key=True
    )


    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        unique=True
    )


    agency_name = Column(String)

    company_name = Column(String)

    website = Column(String)

    industry = Column(String)

    location = Column(String)

    description = Column(String)


    user = relationship(
        "User",
        back_populates="agency_profile"
    )




# =========================
# Analytics
# =========================

class Analytics(Base):

    __tablename__ = "analytics"

    id = Column(Integer, primary_key=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id")
    )

    platform = Column(String)

    followers = Column(Integer, default=0)

    views = Column(Integer, default=0)

    unique_viewers = Column(Integer, default=0)   # NEW

    likes = Column(Integer, default=0)

    comments = Column(Integer, default=0)

    shares = Column(Integer, default=0)

    saves = Column(Integer, default=0)

    watch_time = Column(Float, default=0)

    reach = Column(Integer, default=0)

    impressions = Column(Integer, default=0)

    engagement_rate = Column(Float, default=0)
    video_title = Column(String)
    content_title = Column(String)
    
    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )
    user = relationship(
    "User",
    back_populates="analytics"
)



# =========================
# Content
# =========================

class Content(Base):

    __tablename__ = "content"


    id = Column(Integer, primary_key=True)


    user_id = Column(
        Integer,
        ForeignKey("users.id")
    )


    title = Column(String)

    platform = Column(String)

    category = Column(String)

    hashtag = Column(String)

    views = Column(Integer, default=0)

    likes = Column(Integer, default=0)

    comments = Column(Integer, default=0)

    shares = Column(Integer, default=0)

    saves = Column(Integer, default=0)

    reach = Column(Integer, default=0)

    impressions = Column(Integer, default=0)

    watch_time = Column(Float, default=0)

    engagement_rate = Column(Float, default=0)


    uploaded_date = Column(
        DateTime,
        default=datetime.utcnow
    )


    user = relationship(
        "User",
        back_populates="content"
    )




# =========================
# Audience
# =========================

class Audience(Base):

    __tablename__ = "audience"


    id = Column(Integer, primary_key=True)


    user_id = Column(
        Integer,
        ForeignKey("users.id")
    )


    age_group = Column(String)

    gender = Column(String)

    location = Column(String)

    country = Column(String)

    device = Column(String)

    active_hours = Column(String)

    percentage = Column(Float)
    most_active_days = Column(String)
    peak_engagement_time = Column(String)
    activity_trend = Column(String)
    city = Column(String)
    region = Column(String)


    user = relationship(
        "User",
        back_populates="audience"
    )




# =========================
# Growth
# =========================

class Growth(Base):

    __tablename__ = "growth"


    id = Column(Integer, primary_key=True)


    user_id = Column(
        Integer,
        ForeignKey("users.id")
    )


    date = Column(
        DateTime,
        default=datetime.utcnow
    )


    followers = Column(Integer)

    views = Column(Integer)

    reach = Column(Integer)

    engagement_rate = Column(Float)

    growth_percentage = Column(Float)


    user = relationship(
        "User",
        back_populates="growth"
    )




# =========================
# Hashtag
# =========================

class Hashtag(Base):

    __tablename__ = "hashtags"


    id = Column(Integer, primary_key=True)


    user_id = Column(
        Integer,
        ForeignKey("users.id")
    )


    hashtag = Column(String)

    usage_count = Column(Integer)

    reach = Column(Integer)

    engagement_rate = Column(Float)

    trend_score = Column(Float)


    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )


    user = relationship(
        "User",
        back_populates="hashtags"
    )




# =========================
# Prediction
# =========================

class Prediction(Base):

    __tablename__ = "predictions"


    id = Column(Integer, primary_key=True)


    user_id = Column(
        Integer,
        ForeignKey("users.id")
    )


    prediction_type = Column(String)


    predicted_views = Column(Integer)

    predicted_followers = Column(Integer)

    predicted_reach = Column(Integer)


    confidence = Column(Float)


    generated_at = Column(
        DateTime,
        default=datetime.utcnow
    )


    user = relationship(
        "User",
        back_populates="predictions"
    )




# =========================
# Social Accounts
# =========================

class SocialAccount(Base):

    __tablename__ = "social_accounts"

    id = Column(
        Integer,
        primary_key=True
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )

    platform = Column(
        String,
        nullable=False
    )

    account_name = Column(
        String,
        nullable=True
    )

    access_token = Column(
        String,
        nullable=False
    )

    refresh_token = Column(
        String,
        nullable=True
    )

    connected_at = Column(
        DateTime,
        default=datetime.utcnow
    )


    user = relationship(
        "User",
        back_populates="social_accounts"
    )




# =========================
# Notifications
# =========================

class Notification(Base):

    __tablename__ = "notifications"


    id = Column(Integer, primary_key=True)


    user_id = Column(
        Integer,
        ForeignKey("users.id")
    )


    title = Column(String)

    message = Column(String)

    type = Column(String)


    read = Column(
        Boolean,
        default=False
    )


    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )


    user = relationship(
        "User",
        back_populates="notifications"
    )
class ReportHistory(Base):

    __tablename__ = "report_history"

    id = Column(
        Integer,
        primary_key=True
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id")
    )

    report_name = Column(String)

    report_type = Column(String)

    report_period = Column(String)

    generated_date = Column(
        DateTime,
        default=datetime.utcnow
    )

    download_status = Column(
        Boolean,
        default=False
    )

    file_path = Column(String)

    user = relationship(
        "User"
    )