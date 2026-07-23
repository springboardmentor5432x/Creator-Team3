from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime
from pydantic import BaseModel

from database import get_db
from models import User, Campaign
from Auth import verify_token

router = APIRouter(prefix="/api/campaigns", tags=["Campaigns"])

class CampaignSubmit(BaseModel):
    name: str
    creators: int = 0
    reach: str = "0"
    engagement: str = "0.0%"
    status: str = "Active"

@router.get("")
def get_campaigns(user=Depends(verify_token), db: Session = Depends(get_db)):
    email = user.get("Email")
    db_user = db.query(User).filter(User.Email == email).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
        
    records = db.query(Campaign).filter(Campaign.user_id == db_user.id).order_by(Campaign.created_at.desc()).all()
    
    # If no records exist, seed defaults for the user so it isn't empty!
    if not records:
        default_campaigns = [
            Campaign(user_id=db_user.id, name="Summer Product Launch", creators=24, reach="2.4M", engagement="8.7%", status="Active"),
            Campaign(user_id=db_user.id, name="Influencer Awareness Campaign", creators=18, reach="1.8M", engagement="7.2%", status="Active"),
            Campaign(user_id=db_user.id, name="Q1 Product Placement", creators=12, reach="950K", engagement="5.8%", status="Completed")
        ]
        for c in default_campaigns:
            db.add(c)
        db.commit()
        records = db.query(Campaign).filter(Campaign.user_id == db_user.id).order_by(Campaign.created_at.desc()).all()
        
    return [
        {
            "id": c.id,
            "name": c.name,
            "creators": c.creators,
            "reach": c.reach,
            "engagement": c.engagement,
            "status": c.status,
            "created_at": c.created_at.isoformat()
        } for c in records
    ]

@router.post("")
def add_campaign(data: CampaignSubmit, user=Depends(verify_token), db: Session = Depends(get_db)):
    email = user.get("Email")
    db_user = db.query(User).filter(User.Email == email).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
        
    new_campaign = Campaign(
        user_id=db_user.id,
        name=data.name,
        creators=data.creators,
        reach=data.reach,
        engagement=data.engagement,
        status=data.status
    )
    db.add(new_campaign)
    db.commit()
    db.refresh(new_campaign)
    
    return {
        "id": new_campaign.id,
        "name": new_campaign.name,
        "creators": new_campaign.creators,
        "reach": new_campaign.reach,
        "engagement": new_campaign.engagement,
        "status": new_campaign.status,
        "created_at": new_campaign.created_at.isoformat()
    }
