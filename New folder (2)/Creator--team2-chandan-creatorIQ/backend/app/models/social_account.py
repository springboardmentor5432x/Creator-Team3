from sqlalchemy import (
    Column,
    Integer,
    String,
    Boolean,
    ForeignKey,
    DateTime,
)
from sqlalchemy.orm import relationship
from datetime import datetime

from app.database import Base


class SocialAccount(Base):
    __tablename__ = "social_accounts"

    id = Column(Integer, primary_key=True, index=True)

    platform = Column(String, nullable=False)

    account_name = Column(String, nullable=False)

    account_id = Column(String, nullable=False)

    access_token = Column(String, nullable=True)

    is_connected = Column(Boolean, default=True)

    created_at = Column(DateTime, default=datetime.utcnow)

    creator_id = Column(
        Integer,
        ForeignKey("users.id")
    )

    creator = relationship(
        "User",
        back_populates="social_accounts"
    )