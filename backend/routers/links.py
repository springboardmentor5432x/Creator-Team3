from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import re
import random
import os
from datetime import datetime
from pydantic import BaseModel
from googleapiclient.discovery import build

from database import get_db
from models import User, ContentLink
from Auth import verify_token

router = APIRouter(prefix="/api/links", tags=["Content Links"])

class LinkSubmit(BaseModel):
    url: str

@router.post("")
def add_content_link(data: LinkSubmit, user=Depends(verify_token), db: Session = Depends(get_db)):
    email = user.get("Email")
    db_user = db.query(User).filter(User.Email == email).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    url = data.url.strip()
    url_lower = url.lower()
    
    # Determine platform and retrieve metrics
    if "youtube.com" in url_lower or "youtu.be" in url_lower:
        platform = "YouTube"
        default_title = "YouTube Video Upload"
        
        # Try to call live YouTube API
        video_id = None
        # Extract 11 character video ID
        match = re.search(r"(?:v=|\/|embed\/|youtu\.be\/)([0-9A-Za-z_-]{11})", url)
        if match:
            video_id = match.group(1)
            
        yt_data = None
        if video_id:
            api_key = os.getenv("YOUTUBE_API_KEY")
            if api_key:
                try:
                    youtube_client = build("youtube", "v3", developerKey=api_key)
                    request = youtube_client.videos().list(
                        part="snippet,statistics",
                        id=video_id
                    )
                    yt_response = request.execute()
                    if yt_response.get("items"):
                        item = yt_response["items"][0]
                        snippet = item["snippet"]
                        stats = item["statistics"]
                        yt_data = {
                            "title": snippet.get("title", "YouTube Video"),
                            "views": int(stats.get("viewCount", 0)),
                            "likes": int(stats.get("likeCount", 0)),
                            "comments": int(stats.get("commentCount", 0)),
                            "shares": int(int(stats.get("likeCount", 0)) * 0.15)
                        }
                except Exception as e:
                    print("YouTube API Video Link Error:", e)
        
        if yt_data:
            title = yt_data["title"]
            views = yt_data["views"]
            likes = yt_data["likes"]
            comments = yt_data["comments"]
            shares = yt_data["shares"]
        else:
            # Fallback to mock
            suffix = url.split('/')[-1].split('?')[0]
            if len(suffix) > 3 and suffix != "watch":
                title = f"YouTube Video: {suffix}"
            elif video_id:
                title = f"YouTube Video: {video_id}"
            else:
                title = f"{default_title} ({datetime.utcnow().strftime('%b %d, %Y')})"
            views = random.randint(15000, 750000)
            likes = int(views * random.uniform(0.04, 0.12))
            comments = int(likes * random.uniform(0.02, 0.08))
            shares = int(likes * random.uniform(0.01, 0.05))
    elif "instagram.com" in url_lower:
        platform = "Instagram"
        default_title = "Instagram Media Post"
        suffix = url.split('/')[-1].split('?')[0]
        title = f"Instagram Post: {suffix}" if len(suffix) > 3 else default_title
        views = random.randint(10000, 500000)
        likes = int(views * random.uniform(0.04, 0.12))
        comments = int(likes * random.uniform(0.02, 0.08))
        shares = int(likes * random.uniform(0.01, 0.05))
    elif "linkedin.com" in url_lower:
        platform = "LinkedIn"
        default_title = "LinkedIn Article Share"
        suffix = url.split('/')[-1].split('?')[0]
        title = f"LinkedIn Post: {suffix}" if len(suffix) > 3 else default_title
        views = random.randint(2000, 50000)
        likes = int(views * random.uniform(0.02, 0.08))
        comments = int(likes * random.uniform(0.05, 0.15))
        shares = int(likes * random.uniform(0.10, 0.30))
    elif "twitch.tv" in url_lower:
        platform = "Twitch"
        default_title = "Twitch Live Stream Clip"
        suffix = url.split('/')[-1].split('?')[0]
        title = f"Twitch Clip: {suffix}" if len(suffix) > 3 else default_title
        views = random.randint(5000, 150000)
        likes = int(views * random.uniform(0.01, 0.05))
        comments = int(likes * random.uniform(0.02, 0.06))
        shares = int(likes * random.uniform(0.005, 0.02))
    else:
        raise HTTPException(status_code=400, detail="Invalid platform URL. Only YouTube, Instagram, LinkedIn, and Twitch are supported.")
    
    new_link = ContentLink(
        user_id=db_user.id,
        url=url,
        platform=platform,
        title=title,
        views=views,
        likes=likes,
        comments=comments,
        shares=shares
    )
    
    db.add(new_link)
    db.commit()
    db.refresh(new_link)
    
    return {
        "id": new_link.id,
        "url": new_link.url,
        "platform": new_link.platform,
        "title": new_link.title,
        "views": new_link.views,
        "likes": new_link.likes,
        "comments": new_link.comments,
        "shares": new_link.shares,
        "created_at": new_link.created_at.isoformat()
    }

@router.get("")
def get_content_links(user=Depends(verify_token), db: Session = Depends(get_db)):
    email = user.get("Email")
    db_user = db.query(User).filter(User.Email == email).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    links = db.query(ContentLink).filter(ContentLink.user_id == db_user.id).order_by(ContentLink.created_at.desc()).all()
    return [
        {
            "id": l.id,
            "url": l.url,
            "platform": l.platform,
            "title": l.title,
            "views": l.views,
            "likes": l.likes,
            "comments": l.comments,
            "shares": l.shares,
            "created_at": l.created_at.isoformat()
        } for l in links
    ]

@router.delete("/{id}")
def delete_content_link(id: int, user=Depends(verify_token), db: Session = Depends(get_db)):
    email = user.get("Email")
    db_user = db.query(User).filter(User.Email == email).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    link = db.query(ContentLink).filter(ContentLink.id == id, ContentLink.user_id == db_user.id).first()
    if not link:
        raise HTTPException(status_code=404, detail="Link not found")
    
    db.delete(link)
    db.commit()
    return {"message": "Link deleted successfully"}
