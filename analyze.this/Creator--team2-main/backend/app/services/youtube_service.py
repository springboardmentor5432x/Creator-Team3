import os
from urllib import response
import requests

from dotenv import load_dotenv

load_dotenv()

CLIENT_ID = os.getenv("YOUTUBE_CLIENT_ID")
CLIENT_SECRET = os.getenv("YOUTUBE_CLIENT_SECRET")
REDIRECT_URI = os.getenv("YOUTUBE_REDIRECT_URI")

print(CLIENT_ID)
print(CLIENT_SECRET)
print(REDIRECT_URI)


def exchange_code_for_token(code: str):
    url = "https://oauth2.googleapis.com/token"

    data = {
        "client_id": CLIENT_ID,
        "client_secret": CLIENT_SECRET,
        "code": code,
        "grant_type": "authorization_code",
        "redirect_uri": REDIRECT_URI,
    }

    response = requests.post(url, data=data)

    print(response.status_code)
    print(response.json())

    return response.json()

def get_channel_details(access_token: str):
    url = "https://www.googleapis.com/youtube/v3/channels"

    headers = {
        "Authorization": f"Bearer {access_token}"
    }

    params = {
        "part": "snippet,statistics",
        "mine":"true"
    }

    response = requests.get(
        url,
        headers=headers,
        params=params
    )

    print(response.status_code)
    print(response.text)
    return response.json()

def get_user_info(access_token: str):
    url = "https://www.googleapis.com/oauth2/v1/userinfo"

    headers = {
        "Authorization": f"Bearer {access_token}"
    }

    response = requests.get(url, headers=headers)

    print(response.json())

    return response.json()