from fastapi import APIRouter
import requests
import os
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()

ACCESS_TOKEN = os.getenv("INSTAGRAM_ACCESS_TOKEN")


@router.get("/instagram/profile")
def get_instagram_profile():

    url = "https://graph.instagram.com/me"

    params = {
        "fields": "id,username,followers_count,follows_count,media_count",
        "access_token": ACCESS_TOKEN
    }

    response = requests.get(url, params=params)

    return response.json()

@router.get("/instagram/media")
def get_instagram_media():
    url = "https://graph.instagram.com/me/media"

    params = {
        "fields": "id,caption,media_type,media_url,permalink,thumbnail_url,timestamp",
        "access_token": ACCESS_TOKEN
    }

    response = requests.get(url, params=params)
    return response.json()
@router.get("/instagram/media/{media_id}")
def get_media_details(media_id: str):

    url = f"https://graph.instagram.com/{media_id}"

    params = {
        "fields": "id,caption,media_type,media_url,permalink,timestamp",
        "access_token": ACCESS_TOKEN
    }

    response = requests.get(url, params=params)

    return response.json()
@router.get("/instagram/media/{media_id}/insights")
def get_media_insights(media_id: str):

    url = f"https://graph.instagram.com/{media_id}/insights"

    params = {
        "metric": "likes,comments",
        "access_token": ACCESS_TOKEN
    }

    response = requests.get(url, params=params)

    return response.json()