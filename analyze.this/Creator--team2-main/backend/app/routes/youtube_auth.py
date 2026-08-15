import os
from urllib.parse import urlencode

from fastapi import APIRouter
from dotenv import load_dotenv

from app.services.youtube_service import (
    exchange_code_for_token,
    get_channel_details,
    get_user_info,
)

load_dotenv()

router = APIRouter(
    prefix="/auth/youtube",
    tags=["YouTube OAuth"]
)

CLIENT_ID = os.getenv("YOUTUBE_CLIENT_ID")
REDIRECT_URI = os.getenv("YOUTUBE_REDIRECT_URI")

SCOPES = [
    "https://www.googleapis.com/auth/youtube.readonly"
]


@router.get("/login")
def youtube_login():

    params = {
        "client_id": CLIENT_ID,
        "redirect_uri": REDIRECT_URI,
        "response_type": "code",
        "scope": " ".join(SCOPES),
        "access_type": "offline",
        "prompt": "consent",
    }

    authorization_url = (
        "https://accounts.google.com/o/oauth2/v2/auth?"
        + urlencode(params)
    )

    return {
        "login_url": authorization_url
    }


@router.get("/callback")
def youtube_callback(code: str):

    token = exchange_code_for_token(code)

    print("TOKEN RESPONSE:", token)

    if "access_token" not in token:
        return {
            "error": "Failed to get access token",
            "google_response": token
        }

    access_token = token["access_token"]

    print("USER INFO START")
    get_user_info(access_token)
    user= get_user_info(access_token)
    print("USER INFO:", user)
    

    channel = get_channel_details(access_token)

    return channel