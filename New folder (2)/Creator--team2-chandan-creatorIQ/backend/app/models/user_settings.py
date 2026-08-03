from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, Float, Text
from sqlalchemy.orm import relationship

from app.database import Base


class UserSettings(Base):
    __tablename__ = "user_settings"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)

    # Profile UI fields
    bio = Column(Text, default="")
    date_of_birth = Column(String, default="")
    location = Column(String, default="")
    website = Column(String, default="")

    # Security UI fields
    two_factor = Column(Boolean, default=False)
    session_timeout = Column(String, default="30 minutes")

    # Notifications UI fields
    product_updates = Column(Boolean, default=True)
    weekly_digest = Column(Boolean, default=True)

    # Appearance UI fields
    accent = Column(String, default="blue")
    density = Column(String, default="comfortable")

    updated_at = Column(String, default="")

    user = relationship("User", back_populates="settings")

