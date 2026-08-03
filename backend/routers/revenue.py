from fastapi import APIRouter, Depends, HTTPException, Response, Query
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from pydantic import BaseModel

from database import get_db
from models import User, RevenueRecord
from Auth import verify_token
from services.revenue_engine import RevenueEngine

router = APIRouter(prefix="/api/revenue", tags=["Revenue"])

class RevenueSubmit(BaseModel):
    source: str
    amount: float
    description: str = ""
    date: str = None

class RevenueSettingsUpdate(BaseModel):
    cpm_us: float = None
    cpm_india: float = None
    cpm_europe: float = None
    cpm_asia: float = None
    default_cpm: float = None
    monetization_rate: float = None
    sponsorship_rate_per_follower: float = None
    affiliate_ctr: float = None
    affiliate_conversion_rate: float = None
    affiliate_commission: float = None
    subscription_price: float = None
    subscription_member_pct: float = None
    subscription_retention: float = None
    active_theme: str = None

@router.get("/estimate")
def get_revenue_estimation(user=Depends(verify_token), db: Session = Depends(get_db)):
    email = user.get("Email")
    db_user = db.query(User).filter(User.Email == email).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    return RevenueEngine.calculate_revenue_estimation(db_user.id, db)

@router.get("/settings")
def get_revenue_settings(user=Depends(verify_token), db: Session = Depends(get_db)):
    email = user.get("Email")
    db_user = db.query(User).filter(User.Email == email).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    setting = RevenueEngine.get_or_create_settings(db_user.id, db)
    return {
        "cpm_us": setting.cpm_us,
        "cpm_india": setting.cpm_india,
        "cpm_europe": setting.cpm_europe,
        "cpm_asia": setting.cpm_asia,
        "default_cpm": setting.default_cpm,
        "monetization_rate": setting.monetization_rate,
        "sponsorship_rate_per_follower": setting.sponsorship_rate_per_follower,
        "affiliate_ctr": setting.affiliate_ctr,
        "affiliate_conversion_rate": setting.affiliate_conversion_rate,
        "affiliate_commission": setting.affiliate_commission,
        "subscription_price": setting.subscription_price,
        "subscription_member_pct": setting.subscription_member_pct,
        "subscription_retention": setting.subscription_retention,
        "active_theme": setting.active_theme
    }

@router.post("/settings")
def update_revenue_settings(payload: RevenueSettingsUpdate, user=Depends(verify_token), db: Session = Depends(get_db)):
    email = user.get("Email")
    db_user = db.query(User).filter(User.Email == email).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    data_dict = {k: v for k, v in payload.dict().items() if v is not None}
    setting = RevenueEngine.update_settings(db_user.id, data_dict, db)
    return {"message": "Settings updated successfully", "active_theme": setting.active_theme}

@router.get("/export")
def export_earnings_report(format: str = Query("csv"), user=Depends(verify_token), db: Session = Depends(get_db)):
    email = user.get("Email")
    db_user = db.query(User).filter(User.Email == email).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
        
    report = RevenueEngine.export_report_data(db_user.id, db, file_format=format)
    if format == "json":
        return report
        
    return Response(
        content=report,
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=creatoriq_revenue_estimation_report.csv"}
    )

@router.get("")
def get_revenue_records(user=Depends(verify_token), db: Session = Depends(get_db)):
    email = user.get("Email")
    db_user = db.query(User).filter(User.Email == email).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    records = db.query(RevenueRecord).filter(RevenueRecord.user_id == db_user.id).order_by(RevenueRecord.date.desc()).all()
    return [
        {
            "id": r.id,
            "source": r.source,
            "amount": r.amount,
            "description": r.description,
            "date": r.date.isoformat()
        } for r in records
    ]

@router.post("")
def add_revenue_record(data: RevenueSubmit, user=Depends(verify_token), db: Session = Depends(get_db)):
    email = user.get("Email")
    db_user = db.query(User).filter(User.Email == email).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    parsed_date = datetime.utcnow()
    new_record = RevenueRecord(
        user_id=db_user.id,
        source=data.source,
        amount=data.amount,
        description=data.description,
        date=parsed_date
    )
    db.add(new_record)
    db.commit()
    db.refresh(new_record)
    
    return {
        "id": new_record.id,
        "source": new_record.source,
        "amount": new_record.amount,
        "description": new_record.description,
        "date": new_record.date.isoformat()
    }

@router.get("/sponsorships")
def get_sponsorships(user=Depends(verify_token), db: Session = Depends(get_db)):
    from models import SponsorshipDeal
    email = user.get("Email")
    db_user = db.query(User).filter(User.Email == email).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    deals = db.query(SponsorshipDeal).filter(SponsorshipDeal.user_id == db_user.id).all()
    return [
        {
            "id": d.id,
            "brandName": d.brand_name,
            "campaignName": d.campaign_name,
            "amount": d.amount,
            "startDate": d.start_date.strftime("%Y-%m-%d") if d.start_date else "2026-01-01",
            "endDate": d.end_date.strftime("%Y-%m-%d") if d.end_date else "2026-02-01",
            "status": d.status,
            "paymentStatus": d.payment_status
        } for d in deals
    ]

@router.get("/affiliates")
def get_affiliates(user=Depends(verify_token), db: Session = Depends(get_db)):
    from models import AffiliateProduct
    email = user.get("Email")
    db_user = db.query(User).filter(User.Email == email).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    products = db.query(AffiliateProduct).filter(AffiliateProduct.user_id == db_user.id).all()
    total_rev = sum(p.total_earnings for p in products)
    return {
        "totalRevenue": total_rev,
        "products": [
            {
                "id": p.id,
                "product": p.product_name,
                "link": p.tracking_link,
                "platform": p.platform,
                "clicks": p.clicks,
                "conversions": p.conversions,
                "convRate": f"{round((p.conversions / max(1, p.clicks)) * 100, 1)}%",
                "commissionRate": f"{p.commission_rate}%",
                "totalEarnings": f"${p.total_earnings:,.2f}"
            } for p in products
        ]
    }

@router.get("/subscriptions")
def get_subscriptions(user=Depends(verify_token), db: Session = Depends(get_db)):
    from models import SubscriptionTier
    email = user.get("Email")
    db_user = db.query(User).filter(User.Email == email).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    tiers = db.query(SubscriptionTier).filter(SubscriptionTier.user_id == db_user.id).all()
    total_mrr = sum(t.monthly_revenue for t in tiers)
    return {
        "mrr": total_mrr,
        "tiers": [
            {
                "id": t.id,
                "name": t.tier_name,
                "price": f"${t.price:.2f} / mo",
                "members": t.members_count,
                "perks": t.perks,
                "monthlyRevenue": f"${t.monthly_revenue:,.2f}"
            } for t in tiers
        ]
    }
