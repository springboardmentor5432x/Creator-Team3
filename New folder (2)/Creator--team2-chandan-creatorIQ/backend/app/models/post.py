from sqlalchemy import Column, Integer, String, Text, Float

from app.database import Base


class InstagramPost(Base):
    __tablename__ = "instagram_posts"

    id = Column(Integer, primary_key=True, index=True)

    media_id = Column(String, unique=True, nullable=False)

    caption = Column(Text)

    media_type = Column(String)

    media_url = Column(Text)

    permalink = Column(Text)

    timestamp = Column(String)

    # Analytics
    like_count = Column(Integer, default=0)

    comments_count = Column(Integer, default=0)

    reach = Column(Integer, default=0)

    impressions = Column(Integer, default=0)

    saved = Column(Integer, default=0)

    engagement_rate = Column(Float, default=0.0)