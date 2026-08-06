from apscheduler.schedulers.background import BackgroundScheduler
from database import SessionLocal
from models import User
from services.social_sync import SocialSyncService
from services.report_service import ReportService


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

def generate_automated_reports():
    db = SessionLocal()
    try:
        ReportService.send_scheduled_reports(db)
        print("Automated reports generated successfully.")
    except Exception as e:
        print("Report Scheduler Error:", e)
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
    
    scheduler.add_job(
        generate_automated_reports,
        "cron",
        hour=0, # Run at midnight daily
        minute=0,
        id="automated_reports",
        replace_existing=True,
    )

    scheduler.start()
    print("Scheduler Started...")