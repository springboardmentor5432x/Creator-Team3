from apscheduler.schedulers.background import BackgroundScheduler
from database import SessionLocal
from models import User
from services.social_sync import SocialSyncService


scheduler = BackgroundScheduler()


def update_growth():
    db = SessionLocal()

    try:
        users = db.query(User).all()

        for user in users:
            SocialSyncService.sync_growth(user.id, db)

        print("Growth data updated successfully.")

    except Exception as e:
        print("Scheduler Error:", e)

    finally:
        db.close()


def start_scheduler():
    scheduler.add_job(
        update_growth,
        "interval",
        minutes=1,      # Change to seconds=30 while testing if you want
        id="growth_sync",
        replace_existing=True,
    )

    scheduler.start()
    print("Scheduler Started...")