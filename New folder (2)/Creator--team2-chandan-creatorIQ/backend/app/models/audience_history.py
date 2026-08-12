from sqlalchemy import Column, Integer, DateTime
from datetime import datetime

from app.database import Base


class AudienceHistory(Base):
    __tablename__ = "audience_history"

    id = Column(Integer, primary_key=True, index=True)

    followers = Column(Integer, nullable=False)

    following = Column(Integer, nullable=False)

    recorded_at = Column(DateTime, default=datetime.utcnow)