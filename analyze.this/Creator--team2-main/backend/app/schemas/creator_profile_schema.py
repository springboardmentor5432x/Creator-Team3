from pydantic import BaseModel

class CreatorProfileCreate(BaseModel):
    user_id: int
    channel_name: str
    bio: str
    category: str
    country: str
    followers: int = 0