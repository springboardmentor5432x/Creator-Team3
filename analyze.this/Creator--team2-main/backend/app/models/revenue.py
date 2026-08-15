from sqlalchemy import (
    Column,
    Integer,
    String,
    Float,
    Date,
    DateTime,
    ForeignKey,
)
from sqlalchemy.orm import relationship
from datetime import datetime

from app.database import Base


class Sponsorship(Base):
    __tablename__ = "sponsorships"

    id = Column(Integer, primary_key=True, index=True)

    creator_id = Column(Integer, ForeignKey("users.id"))

    brand_name = Column(String, nullable=False)

    campaign_name = Column(String, nullable=False)

    platform = Column(String, nullable=False)

    amount = Column(Float, nullable=False)

    status = Column(String, default="Pending")

    start_date = Column(Date)

    end_date = Column(Date)

    created_at = Column(DateTime, default=datetime.utcnow)

    creator = relationship("User")


class AdRevenue(Base):
    __tablename__ = "ad_revenue"

    id = Column(Integer, primary_key=True, index=True)

    creator_id = Column(Integer, ForeignKey("users.id"))

    platform = Column(String, nullable=False)

    revenue = Column(Float, nullable=False)

    month = Column(Integer, nullable=False)

    year = Column(Integer, nullable=False)

    created_at = Column(DateTime, default=datetime.utcnow)

    creator = relationship("User")