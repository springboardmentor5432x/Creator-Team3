import bcrypt
from database import SessionLocal, engine, Base
from models import User, CreatorProfile

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
        print("Seed database successfully populated!")
    else:
        print("Database already contains data, skipping seed.")
except Exception as e:
    print(f"Error seeding database: {e}")
finally:
    db.close()
