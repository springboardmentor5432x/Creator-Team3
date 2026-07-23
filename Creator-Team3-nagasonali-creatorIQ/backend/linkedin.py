from fastapi import APIRouter, Request
from fastapi.responses import RedirectResponse
from dotenv import load_dotenv
import requests
import os
from urllib.parse import urlencode

load_dotenv()

router = APIRouter()

CLIENT_ID = os.getenv("LINKEDIN_CLIENT_ID")
CLIENT_SECRET = os.getenv("LINKEDIN_CLIENT_SECRET")
REDIRECT_URI = os.getenv("LINKEDIN_REDIRECT_URI")


@router.get("/auth/linkedin/login")
def linkedin_login():

    params = {
        "response_type": "code",
        "client_id": CLIENT_ID,
        "redirect_uri": REDIRECT_URI,
        "scope": "openid profile email"
    }

    auth_url = (
        "https://www.linkedin.com/oauth/v2/authorization?"
        + urlencode(params)
    )

    return RedirectResponse(auth_url)


@router.get("/auth/linkedin/callback")
def linkedin_callback(request: Request):

    code = request.query_params.get("code")

    if not code:
        return {
            "error": "No authorization code received from LinkedIn"
        }

    token_response = requests.post(
        "https://www.linkedin.com/oauth/v2/accessToken",
        data={
            "grant_type": "authorization_code",
            "code": code,
            "client_id": CLIENT_ID,
            "client_secret": CLIENT_SECRET,
            "redirect_uri": REDIRECT_URI,
        },
    )

    print("TOKEN STATUS:", token_response.status_code)
    print("TOKEN RESPONSE:", token_response.text)

    token_data = token_response.json()

    access_token = token_data.get("access_token")

    if not access_token:
        return {
            "error": "Failed to get access token",
            "linkedin_response": token_data
        }

    profile_response = requests.get(
        "https://api.linkedin.com/v2/userinfo",
        headers={
            "Authorization": f"Bearer {access_token}"
        }
    )

    print("PROFILE STATUS:", profile_response.status_code)
    print("PROFILE RESPONSE:", profile_response.text)

    return profile_response.json()