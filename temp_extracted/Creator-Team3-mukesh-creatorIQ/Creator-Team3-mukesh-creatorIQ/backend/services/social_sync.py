from sqlalchemy.orm import Session
from datetime import datetime
import random

from models import Growth, SocialAccount


class SocialSyncService:

    @staticmethod
    def sync_growth(user_id: int, db: Session):

        # Get all connected social accounts
        accounts = (
            db.query(SocialAccount)
            .join(SocialAccount.creator_profile)
            .filter_by(user_id=user_id)
            .all()
        )

        if not accounts:
            return False

        followers = sum(a.followers for a in accounts)

        # -------- Demo Real-Time Simulation --------
        followers += random.randint(10, 80)

        views = followers * random.randint(6, 10)

        reach = int(views * 0.75)

        engagement = round(random.uniform(3.5, 8.5), 2)

        growth = round(random.uniform(0.2, 2.5), 2)
        # ------------------------------------------

        record = Growth(
            user_id=user_id,
            date=datetime.utcnow(),
            followers=followers,
            views=views,
            reach=reach,
            engagement_rate=engagement,
            growth_percentage=growth,
        )

        db.add(record)
        db.commit()

        return True