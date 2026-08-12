from pydantic import BaseModel, Field
from typing import Optional

class AudienceCreate(BaseModel):
    country: str
    age_group: str
    gender: str

    followers: int = Field(..., ge=0)

    growth_rate: float = Field(..., ge=0)



class AudienceUpdate(BaseModel):
    country: Optional[str] = None
    age_group: Optional[str] = None
    gender: Optional[str] = None

    followers: Optional[int] = Field(None, ge=0)
    growth_rate: Optional[float] = Field(None, ge=0)

class AudienceResponse(BaseModel):
    id: int
    country: str
    age_group: str
    gender: str
    followers: int
    growth_rate: float

    class Config:
        from_attributes = True