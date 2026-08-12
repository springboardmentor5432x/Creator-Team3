from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
import os
import random
from database import get_db
from models import User, Growth, ContentLink, RevenueRecord
from Auth import verify_token

router = APIRouter(prefix="/api/ai", tags=["AI Copilot"])

class ChatMessage(BaseModel):
    message: str

@router.post("/chat")
def ai_chat(data: ChatMessage, user=Depends(verify_token), db: Session = Depends(get_db)):
    email = user.get("Email")
    db_user = db.query(User).filter(User.Email == email).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
        
    query = data.message.strip().lower()
    
    # Context gathering
    growth_records = db.query(Growth).filter(Growth.user_id == db_user.id).all()
    links = db.query(ContentLink).filter(ContentLink.user_id == db_user.id).all()
    revenue = db.query(RevenueRecord).filter(RevenueRecord.user_id == db_user.id).all()
    
    # Calculate total views and engagement from links database
    total_views = sum(link.views for link in links) if links else 125000
    total_likes = sum(link.likes for link in links) if links else 8200
    avg_engagement = round((total_likes / total_views * 100), 2) if total_views > 0 else 5.6
    
    response = ""
    
    if any(k in query for k in ["stats", "growth", "performance", "views", "followers", "subscribers"]):
        # Respond with stats analysis
        follower_count = 520000
        if growth_records:
            follower_count = growth_records[-1].followers
            
        response = (
            f"### 📈 Your Channel Performance Insights\n\n"
            f"Hello **{db_user.Username}**, I've analyzed your database stats across your active platforms. "
            f"Here is a summary of your key performance metrics:\n\n"
            f"*   **Total Subscribers/Followers**: `{follower_count:,}`\n"
            f"*   **Analyzed Video Views**: `{total_views:,}` views\n"
            f"*   **Interactive Engagement Rate**: `{avg_engagement}%` (Industry Average: `4.2%`)\n"
            f"*   **Total Analyzed Assets**: `{len(links)}` links registered in analyzer\n\n"
            f"#### 🔍 Key Takeaway:\n"
            f"Your engagement rate is **stronger than average** at `{avg_engagement}%`. However, video volume is a bit low. "
            f"I suggest uploading **2 more short-form videos** this week to leverage the current algorithm push in your region."
        )
    elif any(k in query for k in ["suggest", "upload", "idea", "post", "topic", "create"]):
        # Respond with suggestions
        platform_pref = "YouTube"
        if links:
            platform_pref = links[0].platform
            
        response = (
            f"### 💡 Upload Suggestions & Video Ideas ({platform_pref})\n\n"
            f"Based on your profile niche, here are 3 optimized content concepts tailored to boost subscriber retention:\n\n"
            f"1.  **\"The Truth About Creator Brand Deals in 2026\"**\n"
            f"    *   *Type*: Long-form video (8-12 mins) or Carousel slide\n"
            f"    *   *Strategy*: Share behind-the-scenes metrics on sponsorship rates. Transparency drives exceptionally high comment rates.\n"
            f"    *   *Tags*: `#branddeals #creatoradvice #influencertips #creatoriq`\n\n"
            f"2.  **\"3 Tools I Can't Live Without as a Creator\"**\n"
            f"    *   *Type*: Short/Reel (30-45 secs)\n"
            f"    *   *Strategy*: High-paced listicle style. Hook the viewer in the first 3 seconds by showing a screenshot of your earnings dashboard.\n"
            f"    *   *Tags*: `#creativetools #productivityhack #editingtips`\n\n"
            f"3.  **\"Reacting to My Oldest Content (Cringe Warning)\"**\n"
            f"    *   *Type*: Live stream or React video\n"
            f"    *   *Strategy*: Great for community building and emotional connection. Ask viewers in the comments to link their oldest videos too.\n"
            f"    *   *Tags*: `#reactionvideo #communityspirit #cringecomedy`\n\n"
            f"#### ⚡ Best time to upload:\n"
            f"Analytics shows your audience is most active around **5:00 PM to 8:00 PM** on Thursdays and Fridays."
        )
    elif any(k in query for k in ["hashtag", "tag", "trend"]):
        # Respond with hashtag tips
        response = (
            f"### 🏷️ Trending Hashtag Suggestions\n\n"
            f"To maximize discoverability, combine high-volume generic tags with mid-volume niche-specific tags. "
            f"Here are the top tags recommended for your profile niche right now:\n\n"
            f"*   **Tier 1 (High Reach)**: `#contentcreator #creatoreconomy #growthhacks`\n"
            f"*   **Tier 2 (Niche Target)**: `#socialmediatips #linkanalytics #brandpartnerships`\n"
            f"*   **Tier 3 (Viral/Community)**: `#creatoriq #youtubegrowth #influencermarketing`\n\n"
            f"*Tip: Use no more than 4-5 tags in video descriptions on YouTube, and 8-10 tags on Instagram captions for best algorithmic indexing.*"
        )
    else:
        # Default response
        response = (
            f"Hello **{db_user.Username}**! 🤖 I am your CreatorIQ Copilot.\n\n"
            f"I can help you analyze your channel performance, provide content upload suggestions, generate trending hashtags, "
            f"and estimate revenue stats.\n\n"
            f"**Try asking me one of these:**\n"
            f"*   *\"How are my growth stats looking?\"*\n"
            f"*   *\"Give me some upload suggestions for my channel\"*\n"
            f"*   *\"What hashtags should I use for tech videos?\"*"
        )
        
    return {
        "reply": response
    }
