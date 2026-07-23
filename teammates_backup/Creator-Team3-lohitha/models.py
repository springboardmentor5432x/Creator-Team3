from sqlalchemy import Column, Integer, String, Float, ForeignKey, Boolean, DateTime
from sqlalchemy.orm import relationship
from database import Base
from datetime import datetime

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    Username = Column(String)
    Email = Column(String, unique=True, index=True)
    phone = Column(String)
    Password = Column(String)
    role = Column(String)

    creator_profiles = relationship("CreatorProfile", back_populates="user", cascade="all, delete-orphan")

class CreatorProfile(Base):
    __tablename__ = "creator_profile"

    creator_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    platform = Column(String, nullable=False)
    followers = Column(Integer, default=0)
    engagement_rate = Column(Float, default=0.0)
    bio = Column(String, default="")
    language = Column(String, default="English")
    region = Column(String, default="United States")

    user = relationship("User", back_populates="creator_profiles")
    social_accounts = relationship("SocialAccount", back_populates="creator_profile", cascade="all, delete-orphan")
    analytics_data = relationship("AnalyticsData", back_populates="creator_profile", cascade="all, delete-orphan")

class SocialAccount(Base):
    __tablename__ = "social_accounts"

    account_id = Column(Integer, primary_key=True, index=True)
    creator_id = Column(Integer, ForeignKey("creator_profile.creator_id", ondelete="CASCADE"), nullable=False)
    platform = Column(String, nullable=False)
    account_name = Column(String, nullable=False)
    followers = Column(Integer, default=0)

    creator_profile = relationship("CreatorProfile", back_populates="social_accounts")
    audience_data = relationship("AudienceData", back_populates="social_account", cascade="all, delete-orphan")

class AnalyticsData(Base):
    __tablename__ = "analytics_data"

    analytics_id = Column(Integer, primary_key=True, index=True)
    creator_id = Column(Integer, ForeignKey("creator_profile.creator_id", ondelete="CASCADE"), nullable=False)
    views = Column(Integer, default=0)
    likes = Column(Integer, default=0)
    comments = Column(Integer, default=0)
    shares = Column(Integer, default=0)

    creator_profile = relationship("CreatorProfile", back_populates="analytics_data")

class AudienceData(Base):
    __tablename__ = "audience_data"

    audience_id = Column(Integer, primary_key=True, index=True)
    account_id = Column(Integer, ForeignKey("social_accounts.account_id", ondelete="CASCADE"), nullable=False)
    demographics = Column(String)
    age = Column(String)
    gender = Column(String)
    location = Column(String)

    social_account = relationship("SocialAccount", back_populates="audience_data")

class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    title = Column(String, nullable=False)
    message = Column(String, nullable=False)
    type = Column(String, nullable=False)  # "alert", "milestone", "system"
    read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class ContentLink(Base):
    __tablename__ = "content_links"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    url = Column(String, nullable=False)
    platform = Column(String, nullable=False)  # "youtube", "instagram", "linkedin", "twitch"
    title = Column(String, nullable=False)
    views = Column(Integer, default=0)
    likes = Column(Integer, default=0)
    comments = Column(Integer, default=0)
    shares = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)

class RevenueRecord(Base):
    __tablename__ = "revenue_records"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    source = Column(String, nullable=False)  # "AdSense", "Sponsorship", "Affiliate", "Merch"
    amount = Column(Float, default=0.0)
    description = Column(String, default="")
    date = Column(DateTime, default=datetime.utcnow)