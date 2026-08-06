from pydantic import BaseModel, EmailStr


class TeamMemberCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: str


class TeamMemberResponse(BaseModel):
    id: int
    name: str
    email: EmailStr
    role: str

    class Config:
        from_attributes = True

class TeamMemberUpdate(BaseModel):
    name: str
    email: EmailStr
    role: str

class TeamLogin(BaseModel):
    email: EmailStr
    password: str