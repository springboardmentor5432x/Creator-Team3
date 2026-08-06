import token

from fastapi import APIRouter
import os
import requests
from app.auth.instagram_oauth import get_login_url
from app.services.instagram_service import exchange_code_for_token

APP_ID = os.getenv("INSTAGRAM_APP_ID")
APP_SECRET = os.getenv("INSTAGRAM_APP_SECRET")

print("APP_ID =", APP_ID)
print("APP_SECRET =", APP_SECRET[:8] if APP_SECRET else None)

router = APIRouter(
    prefix="/auth/instagram",
    tags=["Instagram OAuth"]
)

@router.get("/login")
def instagram_login():
    return {
        "login_url": get_login_url()
    }

@router.get("/callback")
def instagram_callback(code: str):
    token = exchange_code_for_token(code)
    user_token = token["access_token"]

    pages = requests.get(
        "https://graph.facebook.com/v25.0/me/accounts",
        params={"access_token": user_token}
    ).json()

    page = pages["data"][0]
    page_token = page["access_token"]
    page_id = page["id"]

    instagram = requests.get(
        f"https://graph.facebook.com/v25.0/{page_id}",
        params={
            "fields": "instagram_business_account",
            "access_token": page_token
        }
    ).json()

    ig_id = instagram["instagram_business_account"]["id"]

    profile = requests.get(
        f"https://graph.facebook.com/v25.0/{ig_id}",
        params={
            "fields": "username,name,followers_count,follows_count,media_count,profile_picture_url",
            "access_token": page_token
        }
    ).json()

    return profile