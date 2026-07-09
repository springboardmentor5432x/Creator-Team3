from sqlalchemy import Column, Integer, String
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    Username = Column(String)
    Email = Column(String, unique=True, index=True)
    phone = Column(String)
    Password = Column(String)
    role = Column(String)