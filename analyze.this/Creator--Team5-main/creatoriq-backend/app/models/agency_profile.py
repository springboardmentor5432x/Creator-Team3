from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship

from app.database import Base


class AgencyProfile(Base):
    __tablename__ = "agency_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    agency_name = Column(String, nullable=False)

    user = relationship("User", back_populates="agency_profile")
