import bcrypt
from datetime import datetime, timedelta
from database import SessionLocal, engine, Base
from models import (
    User, CreatorProfile, ContentLink, SponsorshipDeal, AffiliateProduct, 
    SubscriptionTier, AudienceData, SocialAccount
)

# Create tables if not exist
Base.metadata.create_all(bind=engine)

db = SessionLocal()

try:
    # Check if seed already exists
    existing = db.query(User).first()
    if not existing:
        # Hash password 'Password123!'
        hashed = bcrypt.hashpw("Password123!".encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        
        users = [
            User(Username="Creator User", Email="creator@example.com", phone="9876543210", Password=hashed, role="Creator"),
            User(Username="Brand Agency User", Email="brand@example.com", phone="9876543210", Password=hashed, role="Brand Agency"),
            User(Username="Admin User", Email="admin@example.com", phone="9876543210", Password=hashed, role="Admin")
        ]
        
        for u in users:
            db.add(u)
        db.commit()
        
        # Add Creator profile details
        creator_user = db.query(User).filter(User.Email == "creator@example.com").first()
        profile = CreatorProfile(
            user_id=creator_user.id,
            platform="YouTube",
            followers=520000,
            engagement_rate=5.6,
            bio="Tech enthusiast & content creator.",
            language="English",
            region="United States"
        )
        db.add(profile)
        db.commit()

        # Seed sample Content Links
        content_items = [
            ContentLink(
                user_id=creator_user.id,
                url="https://youtube.com/watch?v=sample1",
                platform="YouTube",
                title="AI Automation Guide 2026",
                thumbnail_url="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500",
                views=2400000,
                likes=142000,
                comments=12400,
                shares=8900,
                saves=6500,
                watch_time_sec=1800000,
                reach=3100000,
                publish_date=datetime.utcnow() - timedelta(days=5)
            ),
            ContentLink(
                user_id=creator_user.id,
                url="https://youtube.com/watch?v=sample2",
                platform="YouTube",
                title="React 19 & Next.js Architecture",
                thumbnail_url="https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=500",
                views=1800000,
                likes=98000,
                comments=8100,
                shares=5400,
                saves=4200,
                watch_time_sec=1400000,
                reach=2200000,
                publish_date=datetime.utcnow() - timedelta(days=12)
            ),
            ContentLink(
                user_id=creator_user.id,
                url="https://instagram.com/p/sample3",
                platform="Instagram",
                title="Summer Reel Breakdown",
                thumbnail_url="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500",
                views=1500000,
                likes=110000,
                comments=6900,
                shares=14200,
                saves=9800,
                watch_time_sec=450000,
                reach=1900000,
                publish_date=datetime.utcnow() - timedelta(days=18)
            ),
            ContentLink(
                user_id=creator_user.id,
                url="https://linkedin.com/posts/sample4",
                platform="LinkedIn",
                title="FastAPI Microservices Playbook",
                thumbnail_url="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500",
                views=850000,
                likes=45000,
                comments=3200,
                shares=2800,
                saves=1900,
                watch_time_sec=280000,
                reach=1100000,
                publish_date=datetime.utcnow() - timedelta(days=25)
            )
        ]
        for item in content_items:
            db.add(item)

        # Seed Sponsorship Deals
        sponsorships = [
            SponsorshipDeal(user_id=creator_user.id, brand_name="TechGear Pro", campaign_name="Q3 Developer Setup", amount=4500.0, status="Active", payment_status="Paid", start_date=datetime.utcnow() - timedelta(days=30), end_date=datetime.utcnow() + timedelta(days=30)),
            SponsorshipDeal(user_id=creator_user.id, brand_name="CloudScale AI", campaign_name="AI Backend Masterclass", amount=6200.0, status="Active", payment_status="Invoiced", start_date=datetime.utcnow() - timedelta(days=15), end_date=datetime.utcnow() + timedelta(days=45)),
            SponsorshipDeal(user_id=creator_user.id, brand_name="CodeStream", campaign_name="IDE Integration Showcase", amount=3200.0, status="Completed", payment_status="Paid", start_date=datetime.utcnow() - timedelta(days=60), end_date=datetime.utcnow() - timedelta(days=10))
        ]
        for s in sponsorships:
            db.add(s)

        # Seed Affiliate Products
        affiliates = [
            AffiliateProduct(user_id=creator_user.id, product_name="Ultimate Web Dev Equipment Kit", tracking_link="creatoriq.link/dev-setup", platform="Amazon", clicks=14200, conversions=426, commission_rate=12.0, total_earnings=2840.0),
            AffiliateProduct(user_id=creator_user.id, product_name="AI Video Editing Masterclass", tracking_link="creatoriq.link/ai-video", platform="Impact", clicks=9800, conversions=392, commission_rate=20.0, total_earnings=3920.0),
            AffiliateProduct(user_id=creator_user.id, product_name="FastAPI & React Boilerplate Pro", tracking_link="creatoriq.link/stack-template", platform="Gumroad", clicks=7400, conversions=296, commission_rate=15.0, total_earnings=2220.0),
            AffiliateProduct(user_id=creator_user.id, product_name="Custom Mechanical Keyboard", tracking_link="creatoriq.link/keyboard", platform="ShareASale", clicks=5100, conversions=102, commission_rate=8.0, total_earnings=612.0)
        ]
        for a in affiliates:
            db.add(a)

        # Seed Subscription Tiers
        tiers = [
            SubscriptionTier(user_id=creator_user.id, tier_name="Tier 1: Insider Member", price=4.99, members_count=1240, perks="Exclusive badge, Discord role, private chat", monthly_revenue=6187.60),
            SubscriptionTier(user_id=creator_user.id, tier_name="Tier 2: Code Master", price=9.99, members_count=580, perks="GitHub repo access, monthly Q&A, source code", monthly_revenue=5794.20),
            SubscriptionTier(user_id=creator_user.id, tier_name="Tier 3: VIP Supporter", price=24.99, members_count=140, perks="1-on-1 code reviews, direct advisory, name in credits", monthly_revenue=3498.60)
        ]
        for t in tiers:
            db.add(t)

        db.commit()
        print("Seed database successfully populated with complete production models!")
    else:
        print("Database already contains data, updating schema metadata if needed.")
except Exception as e:
    print(f"Error seeding database: {e}")
finally:
    db.close()

