import os
from urllib.parse import urlencode
from dotenv import load_dotenv
from fastapi import APIRouter
from app.services.facebook_service import exchange_code_for_token, get_user_profile, get_user_pages

load_dotenv()

router = APIRouter(
    prefix="/auth/facebook",
    tags=["Facebook OAuth"]
)

APP_ID = os.getenv("FACEBOOK_APP_ID")
REDIRECT_URI = os.getenv("FACEBOOK_REDIRECT_URI")

SCOPES = [
    "public_profile",
    
]

@router.get("/login")
def facebook_login():

    params = {
        "client_id": APP_ID,
        "redirect_uri": REDIRECT_URI,
        "scope": ",".join(SCOPES),
        "response_type": "code",
    }

    login_url = (
        "https://www.facebook.com/v25.0/dialog/oauth?"
        + urlencode(params)
    )

    return {
        "login_url": login_url
    }


@router.get("/callback")
def facebook_callback(code: str):

    token = exchange_code_for_token(code)

    access_token = token["access_token"]

    profile = get_user_profile(access_token)

    pages = get_user_pages(access_token)

    return {
        "profile": profile,
        "pages": pages
    }