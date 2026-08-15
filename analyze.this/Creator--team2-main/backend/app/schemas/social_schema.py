from pydantic import BaseModel


class SocialAccountCreate(BaseModel):
    platform: str
    account_name: str
    account_id: str
    access_token: str | None = None


class SocialAccountResponse(BaseModel):
    id: int
    platform: str
    account_name: str
    account_id: str
    is_connected: bool

    class Config:
        from_attributes = True