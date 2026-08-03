from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database import Base


class CreatorProfile(Base):
    __tablename__ = "creator_profile"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        unique=True,
        nullable=False
    )

    channel_name = Column(String(150), nullable=False)
    bio = Column(Text, nullable=True)
    category = Column(String(100), nullable=True)
    country = Column(String(100), nullable=True)
    followers = Column(Integer, default=0)

    created_at = Column(
        DateTime,
        server_default=func.now()
    )

    updated_at = Column(
        DateTime,
        server_default=func.now(),
        onupdate=func.now()
    )

    # Relationship with User
    user = relationship(
        "User",
        back_populates="creator_profile"
    )