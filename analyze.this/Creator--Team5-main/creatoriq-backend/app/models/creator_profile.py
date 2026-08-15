from sqlalchemy import Column, Integer, String, ForeignKey, JSON
from sqlalchemy.orm import relationship

from app.database import Base


class CreatorProfile(Base):
    __tablename__ = "creator_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    display_name = Column(String, nullable=False)
    # e.g. {"youtube": "@handle", "instagram": "@handle"}
    platform_handles = Column(JSON, default=dict)

    user = relationship("User", back_populates="creator_profile")
