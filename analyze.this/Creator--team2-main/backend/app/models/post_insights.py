from sqlalchemy import Column, Integer, String, ForeignKey
from app.database import Base


class PostInsight(Base):
    __tablename__ = "post_insights"

    id = Column(Integer, primary_key=True, index=True)

    media_id = Column(String, unique=True)

    likes = Column(Integer, default=0)

    comments = Column(Integer, default=0)

    impressions = Column(Integer, default=0)

    reach = Column(Integer, default=0)

    saved = Column(Integer, default=0)

    shares = Column(Integer, default=0)