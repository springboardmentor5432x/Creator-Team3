import os
from urllib.parse import urlencode
from dotenv import load_dotenv

load_dotenv()

APP_ID = os.getenv("INSTAGRAM_APP_ID")
REDIRECT_URI = os.getenv("INSTAGRAM_REDIRECT_URI")

def get_login_url():
    params = {
        "client_id": APP_ID,
        "redirect_uri": REDIRECT_URI,
        "response_type": "code",
        "scope": ",".join([
    "public_profile",
    "pages_show_list",
    "pages_read_engagement",
    "instagram_basic",
    "business_management"
])
    }

    return "https://www.facebook.com/v25.0/dialog/oauth?" + urlencode(params)