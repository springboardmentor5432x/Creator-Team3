import enum

from sqlalchemy import Column, Integer, String, DateTime, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database import Base


class UserRole(str, enum.Enum):
    creator = "creator"
    agency = "agency"
    marketing_team = "marketing_team"
    admin = "admin"


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(Enum(UserRole), nullable=False, default=UserRole.creator)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    creator_profile = relationship("CreatorProfile", back_populates="user", uselist=False)
    agency_profile = relationship("AgencyProfile", back_populates="user", uselist=False)
