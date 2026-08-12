from googleapiclient.discovery import build
from dotenv import load_dotenv
import os

load_dotenv()

API_KEY = os.getenv("YOUTUBE_API_KEY")

youtube = build(
    "youtube",
    "v3",
    developerKey=API_KEY
)
def get_channel_stats(channel_id):
    request = youtube.channels().list(
        part="snippet,statistics",
        id=channel_id
    )

    response = request.execute()

    if not response["items"]:
        return {"error": "Channel not found"}

    channel = response["items"][0]

    return {
        "channel_id": channel["id"],
        "channel_name": channel["snippet"]["title"],
        "description": channel["snippet"]["description"],
        "country": channel["snippet"].get("country"),
        "subscribers": int(channel["statistics"]["subscriberCount"]),
        "views": int(channel["statistics"]["viewCount"]),
        "videos": int(channel["statistics"]["videoCount"])
    }