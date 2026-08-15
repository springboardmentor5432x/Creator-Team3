from pydantic import BaseModel


class ProfileSettingsUpdate(BaseModel):
    bio: str = ""
    dateOfBirth: str = ""
    location: str = ""
    website: str = ""
    role: str = ""


class SecuritySettingsUpdate(BaseModel):
    twoFactor: bool = False
    sessionTimeout: str = "30 minutes"


class NotificationSettingsUpdate(BaseModel):
    productUpdates: bool = True
    weeklyDigest: bool = True


class AppearanceSettingsUpdate(BaseModel):
    accent: str = "blue"
    density: str = "comfortable"

