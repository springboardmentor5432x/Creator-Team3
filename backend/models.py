from sqlalchemy import Column, Integer, String, Float, ForeignKey, Boolean, DateTime, Date
from sqlalchemy.orm import relationship
from database import Base
from datetime import datetime

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    Username = Column(String, nullable=False)
    Email = Column(String, unique=True, index=True, nullable=False)
    phone = Column(String, nullable=False)
    Password = Column(String, nullable=False)
    role = Column(String, nullable=False)

    creator_profiles = relationship("CreatorProfile", back_populates="user", cascade="all, delete-orphan")
    agency_profiles = relationship("AgencyProfile", back_populates="user", cascade="all, delete-orphan")
    notifications = relationship("Notification", back_populates="user", cascade="all, delete-orphan")
    content_links = relationship("ContentLink", back_populates="user", cascade="all, delete-orphan")
    revenue_records = relationship("RevenueRecord", back_populates="user", cascade="all, delete-orphan")
    growth_records = relationship("Growth", back_populates="user", cascade="all, delete-orphan")
    hashtag_records = relationship("Hashtag", back_populates="user", cascade="all, delete-orphan")
    prediction_records = relationship("Prediction", back_populates="user", cascade="all, delete-orphan")
    campaigns = relationship("Campaign", back_populates="user", cascade="all, delete-orphan")
    user_settings = relationship("UserSetting", back_populates="user", cascade="all, delete-orphan")
    instagram_accounts = relationship("InstagramAccount", back_populates="user", cascade="all, delete-orphan")
    sponsorship_deals = relationship("SponsorshipDeal", back_populates="user", cascade="all, delete-orphan")
    affiliate_products = relationship("AffiliateProduct", back_populates="user", cascade="all, delete-orphan")
    subscription_tiers = relationship("SubscriptionTier", back_populates="user", cascade="all, delete-orphan")
    report_histories = relationship("ReportHistory", back_populates="user", cascade="all, delete-orphan")

class ReportHistory(Base):
    __tablename__ = "report_history"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    report_name = Column(String, nullable=False)
    report_type = Column(String, nullable=False)
    format = Column(String, nullable=False)
    report_period = Column(String, nullable=False)
    file_path = Column(String, nullable=False)
    generated_date = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="report_histories")

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

class AgencyProfile(Base):
    __tablename__ = "agency_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    agency_name = Column(String, default="")
    company_name = Column(String, default="")
    website = Column(String, default="")
    industry = Column(String, default="")
    location = Column(String, default="")
    description = Column(String, default="")

    user = relationship("User", back_populates="agency_profiles")

class SocialAccount(Base):
    __tablename__ = "social_accounts"

    account_id = Column(Integer, primary_key=True, index=True)
    creator_id = Column(Integer, ForeignKey("creator_profile.creator_id", ondelete="CASCADE"), nullable=False)
    platform = Column(String, nullable=False)
    account_name = Column(String, nullable=False)
    followers = Column(Integer, default=0)
    channel_id = Column(String, default="")
    channel_handle = Column(String, default="")
    thumbnail_url = Column(String, default="")

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
    demographics = Column(String, default="")
    age = Column(String, default="")
    gender = Column(String, default="")
    location = Column(String, default="")
    country = Column(String, default="")
    city = Column(String, default="")
    region = Column(String, default="")
    device = Column(String, default="")
    active_hours = Column(String, default="")
    most_active_days = Column(String, default="")

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

    user = relationship("User", back_populates="notifications")

class ContentLink(Base):
    __tablename__ = "content_links"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    url = Column(String, nullable=False)
    platform = Column(String, nullable=False)  # "YouTube", "Instagram", "LinkedIn", "Twitch"
    title = Column(String, nullable=False)
    thumbnail_url = Column(String, default="")
    views = Column(Integer, default=0)
    likes = Column(Integer, default=0)
    comments = Column(Integer, default=0)
    shares = Column(Integer, default=0)
    saves = Column(Integer, default=0)
    watch_time_sec = Column(Integer, default=0)
    reach = Column(Integer, default=0)
    publish_date = Column(DateTime, default=datetime.utcnow)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="content_links")

class RevenueRecord(Base):
    __tablename__ = "revenue_records"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    source = Column(String, nullable=False)  # "AdSense", "Sponsorship", "Affiliate", "Merch"
    amount = Column(Float, default=0.0)
    description = Column(String, default="")
    date = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="revenue_records")

class SponsorshipDeal(Base):
    __tablename__ = "sponsorship_deals"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    brand_name = Column(String, nullable=False)
    campaign_name = Column(String, nullable=False)
    amount = Column(Float, default=0.0)
    start_date = Column(DateTime, default=datetime.utcnow)
    end_date = Column(DateTime, default=datetime.utcnow)
    status = Column(String, default="Active")
    payment_status = Column(String, default="Pending")

    user = relationship("User", back_populates="sponsorship_deals")

class AffiliateProduct(Base):
    __tablename__ = "affiliate_products"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    product_name = Column(String, nullable=False)
    tracking_link = Column(String, nullable=False)
    platform = Column(String, default="General")
    clicks = Column(Integer, default=0)
    conversions = Column(Integer, default=0)
    commission_rate = Column(Float, default=10.0)
    total_earnings = Column(Float, default=0.0)

    user = relationship("User", back_populates="affiliate_products")

class SubscriptionTier(Base):
    __tablename__ = "subscription_tiers"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    tier_name = Column(String, nullable=False)
    price = Column(Float, default=4.99)
    members_count = Column(Integer, default=0)
    perks = Column(String, default="")
    monthly_revenue = Column(Float, default=0.0)

    user = relationship("User", back_populates="subscription_tiers")

class Growth(Base):
    __tablename__ = "growth"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    date = Column(DateTime, default=datetime.utcnow)
    followers = Column(Integer, default=0)
    views = Column(Integer, default=0)
    reach = Column(Integer, default=0)
    engagement_rate = Column(Float, default=0.0)
    growth_percentage = Column(Float, default=0.0)

    user = relationship("User", back_populates="growth_records")

class Hashtag(Base):
    __tablename__ = "hashtags"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    hashtag = Column(String, nullable=False)
    usage_count = Column(Integer, default=0)
    reach = Column(Integer, default=0)
    engagement_rate = Column(Float, default=0.0)
    trend_score = Column(Float, default=0.0)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="hashtag_records")

class Prediction(Base):
    __tablename__ = "predictions"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    prediction_type = Column(String, nullable=False)  # "followers", "views", "reach"
    predicted_views = Column(Integer, default=0)
    predicted_followers = Column(Integer, default=0)
    predicted_reach = Column(Integer, default=0)
    confidence = Column(Float, default=0.0)
    generated_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="prediction_records")

class Campaign(Base):
    __tablename__ = "campaigns"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    name = Column(String, nullable=False)
    creators = Column(Integer, default=0)
    reach = Column(String, default="0")
    engagement = Column(String, default="0.0%")
    status = Column(String, default="Active")
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="campaigns")

class UserSetting(Base):
    __tablename__ = "user_settings"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, unique=True)
    
    # CPM & AdSense Settings
    cpm_us = Column(Float, default=10.0)
    cpm_india = Column(Float, default=1.2)
    cpm_europe = Column(Float, default=6.5)
    cpm_asia = Column(Float, default=3.0)
    default_cpm = Column(Float, default=4.5)
    monetization_rate = Column(Float, default=0.8) # 80%
    
    # Sponsorship Settings
    sponsorship_rate_per_follower = Column(Float, default=0.005) # $0.005 / follower adjusted by engagement
    
    # Affiliate Settings
    affiliate_ctr = Column(Float, default=2.5) # 2.5%
    affiliate_conversion_rate = Column(Float, default=3.0) # 3.0%
    affiliate_commission = Column(Float, default=10.0) # 10%
    
    # Subscription Settings
    subscription_price = Column(Float, default=4.99)
    subscription_member_pct = Column(Float, default=1.5) # 1.5% of subscribers pay
    subscription_retention = Column(Float, default=85.0) # 85% retention
    
    # Theme & Display Preference
    active_theme = Column(String, default="midnight")

    user = relationship("User", back_populates="user_settings")

class InstagramAccount(Base):
    __tablename__ = "instagram_accounts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    
    instagram_user_id = Column(String, nullable=False, index=True)
    facebook_page_id = Column(String, default="")
    username = Column(String, nullable=False)
    name = Column(String, default="")
    profile_picture_url = Column(String, default="")
    biography = Column(String, default="")
    
    followers_count = Column(Integer, default=0)
    follows_count = Column(Integer, default=0)
    media_count = Column(Integer, default=0)
    
    account_type = Column(String, default="BUSINESS") # BUSINESS or CREATOR
    business_category = Column(String, default="")
    is_verified = Column(Boolean, default=False)
    
    access_token = Column(String, default="") # Long-lived token
    token_expires_at = Column(DateTime, nullable=True)
    connected_status = Column(String, default="connected") # connected, expired, disconnected
    
    connected_since = Column(DateTime, default=datetime.utcnow)
    last_synced_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="instagram_accounts")
    media = relationship("InstagramMedia", back_populates="instagram_account", cascade="all, delete-orphan")
    snapshots = relationship("InstagramSnapshot", back_populates="instagram_account", cascade="all, delete-orphan")

class InstagramMedia(Base):
    __tablename__ = "instagram_media"

    id = Column(Integer, primary_key=True, index=True)
    account_id = Column(Integer, ForeignKey("instagram_accounts.id", ondelete="CASCADE"), nullable=False)
    
    media_id = Column(String, nullable=False, index=True)
    caption = Column(String, default="")
    media_type = Column(String, nullable=False) # IMAGE, VIDEO, CAROUSEL_ALBUM, REELS
    media_url = Column(String, default="")
    thumbnail_url = Column(String, default="")
    permalink = Column(String, default="")
    timestamp = Column(DateTime, default=datetime.utcnow)
    
    like_count = Column(Integer, default=0)
    comments_count = Column(Integer, default=0)
    reach = Column(Integer, default=0)
    impressions = Column(Integer, default=0)
    saved = Column(Integer, default=0)
    video_views = Column(Integer, default=0)
    engagement_rate = Column(Float, default=0.0)

    instagram_account = relationship("InstagramAccount", back_populates="media")

class InstagramSnapshot(Base):
    __tablename__ = "instagram_snapshots"

    id = Column(Integer, primary_key=True, index=True)
    account_id = Column(Integer, ForeignKey("instagram_accounts.id", ondelete="CASCADE"), nullable=False)
    
    date = Column(DateTime, default=datetime.utcnow, index=True)
    followers_count = Column(Integer, default=0)
    reach = Column(Integer, default=0)
    impressions = Column(Integer, default=0)
    profile_views = Column(Integer, default=0)
    website_clicks = Column(Integer, default=0)
    email_contacts = Column(Integer, default=0)
    phone_clicks = Column(Integer, default=0)
    
    total_likes = Column(Integer, default=0)
    total_comments = Column(Integer, default=0)
    avg_engagement = Column(Float, default=0.0)
    media_count = Column(Integer, default=0)
    estimated_revenue = Column(Float, default=0.0)

    instagram_account = relationship("InstagramAccount", back_populates="snapshots")

class FacebookAccount(Base):
    """
    Official Facebook Page connection via the Meta Graph API (Facebook Login
    for Business). Mirrors the InstagramAccount pattern: we store the Page's
    own long-lived Page Access Token (returned directly by /me/accounts),
    which does not expire unless the user revokes access or changes their
    password, so token_expires_at is typically left null for Facebook.
    """
    __tablename__ = "facebook_accounts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)

    facebook_page_id = Column(String, nullable=False, index=True)
    page_name = Column(String, nullable=False)
    category = Column(String, default="")
    about = Column(String, default="")
    profile_picture_url = Column(String, default="")
    page_link = Column(String, default="")

    followers_count = Column(Integer, default=0)  # fan_count
    is_verified = Column(Boolean, default=False)

    access_token = Column(String, default="")  # Page Access Token (Graph API)
    token_expires_at = Column(DateTime, nullable=True)
    connected_status = Column(String, default="connected")  # connected, expired, disconnected

    connected_since = Column(DateTime, default=datetime.utcnow)
    last_synced_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User")

class TwitterAccount(Base):
    __tablename__ = "twitter_accounts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    
    twitter_user_id = Column(String, nullable=False, index=True)
    username = Column(String, nullable=False)
    name = Column(String, default="")
    profile_image_url = Column(String, default="")
    
    followers_count = Column(Integer, default=0)
    following_count = Column(Integer, default=0)
    tweet_count = Column(Integer, default=0)
    listed_count = Column(Integer, default=0)
    
    access_token = Column(String, default="")
    refresh_token = Column(String, default="")
    token_expires_at = Column(DateTime, nullable=True)
    connected_status = Column(String, default="connected") # connected, expired, disconnected
    
    connected_since = Column(DateTime, default=datetime.utcnow)
    last_synced_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User")

class TwitterSnapshot(Base):
    __tablename__ = "twitter_snapshots"

    id = Column(Integer, primary_key=True, index=True)
    account_id = Column(Integer, ForeignKey("twitter_accounts.id", ondelete="CASCADE"), nullable=False)
    
    date = Column(DateTime, default=datetime.utcnow, index=True)
    followers_count = Column(Integer, default=0)
    following_count = Column(Integer, default=0)
    tweet_count = Column(Integer, default=0)
    impressions = Column(Integer, default=0)
    retweets = Column(Integer, default=0)
    likes = Column(Integer, default=0)
    replies = Column(Integer, default=0)
    avg_engagement = Column(Float, default=0.0)

class TwitchAccount(Base):
    __tablename__ = "twitch_accounts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    
    twitch_user_id = Column(String, nullable=False, index=True)
    login = Column(String, nullable=False)
    display_name = Column(String, default="")
    profile_image_url = Column(String, default="")
    broadcaster_type = Column(String, default="")
    
    followers_count = Column(Integer, default=0)
    subscriber_count = Column(Integer, default=0)
    view_count = Column(Integer, default=0)
    
    access_token = Column(String, default="")
    refresh_token = Column(String, default="")
    token_expires_at = Column(DateTime, nullable=True)
    connected_status = Column(String, default="connected")
    
    connected_since = Column(DateTime, default=datetime.utcnow)
    last_synced_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User")

class TwitchSnapshot(Base):
    __tablename__ = "twitch_snapshots"

    id = Column(Integer, primary_key=True, index=True)
    account_id = Column(Integer, ForeignKey("twitch_accounts.id", ondelete="CASCADE"), nullable=False)
    
    date = Column(DateTime, default=datetime.utcnow, index=True)
    followers_count = Column(Integer, default=0)
    subscriber_count = Column(Integer, default=0)
    peak_viewers = Column(Integer, default=0)
    avg_viewers = Column(Integer, default=0)
    hours_watched = Column(Integer, default=0)
    streams_count = Column(Integer, default=0)

class LinkedInAccount(Base):
    __tablename__ = "linkedin_accounts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)

    linkedin_user_id = Column(String, nullable=False, index=True)  # OpenID Connect "sub"
    name = Column(String, default="")
    email = Column(String, default="")
    profile_picture_url = Column(String, default="")
    headline = Column(String, default="")

    followers_count = Column(Integer, default=0)
    connections_count = Column(Integer, default=0)

    access_token = Column(String, default="")
    refresh_token = Column(String, default="")
    token_expires_at = Column(DateTime, nullable=True)
    connected_status = Column(String, default="connected")  # connected, expired, disconnected

    connected_since = Column(DateTime, default=datetime.utcnow)
    last_synced_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User")

class LinkedInSnapshot(Base):
    __tablename__ = "linkedin_snapshots"

    id = Column(Integer, primary_key=True, index=True)
    account_id = Column(Integer, ForeignKey("linkedin_accounts.id", ondelete="CASCADE"), nullable=False)

    date = Column(DateTime, default=datetime.utcnow, index=True)
    followers_count = Column(Integer, default=0)
    connections_count = Column(Integer, default=0)
    post_impressions = Column(Integer, default=0)
    profile_clicks = Column(Integer, default=0)
    avg_engagement = Column(Float, default=0.0)

class GrowthSnapshot(Base):
    __tablename__ = "growth_snapshots"

    id = Column(Integer, primary_key=True, index=True)
    creator_id = Column(Integer, ForeignKey("creator_profile.creator_id"))
    platform = Column(String)
    snapshot_date = Column(Date)
    followers = Column(Integer, default=0)
    views = Column(Integer, default=0)
    watch_time_hours = Column(Integer, default=0)
    engagement_rate = Column(Float, default=0.0)
