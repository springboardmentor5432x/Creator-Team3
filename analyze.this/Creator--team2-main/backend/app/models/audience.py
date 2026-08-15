from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime

from app.database import Base


class Audience(Base):

    __tablename__ = "audience"

    id = Column(Integer, primary_key=True, index=True)

    country = Column(String, nullable=False)

    age_group = Column(String, nullable=False)

    gender = Column(String, nullable=False)

    followers = Column(Integer, default=0)

    growth_rate = Column(Float, default=0)

    created_at = Column(DateTime, default=datetime.utcnow)

    creator_id = Column(Integer, ForeignKey("users.id"))

    creator = relationship("User", back_populates="audience")