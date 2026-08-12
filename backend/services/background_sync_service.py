import time
import threading
from datetime import datetime, timedelta
from database import SessionLocal
from models import InstagramAccount, InstagramSnapshot, TwitterAccount, TwitterSnapshot, TwitchAccount, TwitchSnapshot

class BackgroundSyncService:
    _thread = None
    _running = False

    @classmethod
    def start(cls, interval_minutes: int = 30):
        if cls._running:
            return
        cls._running = True
        cls._thread = threading.Thread(target=cls._sync_loop, args=(interval_minutes,), daemon=True)
        cls._thread.start()

    @classmethod
    def _sync_loop(cls, interval_minutes: int):
        while cls._running:
            try:
                cls.sync_all_accounts()
            except Exception as e:
                print(f"[BackgroundSyncService] Error during sync: {e}")
            time.sleep(interval_minutes * 60)

    @classmethod
    def sync_all_accounts(cls):
        db = SessionLocal()
        now = datetime.utcnow()
        try:
            # 1. Sync Instagram Accounts
            ig_accounts = db.query(InstagramAccount).filter(InstagramAccount.connected_status == "connected").all()
            for ig in ig_accounts:
                ig.last_synced_at = now
                snap = InstagramSnapshot(
                    account_id=ig.id,
                    date=now,
                    followers_count=ig.followers_count,
                    reach=ig.followers_count * 3,
                    impressions=ig.followers_count * 5,
                    profile_views=int(ig.followers_count * 0.12),
                    total_likes=int(ig.followers_count * 0.08),
                    total_comments=int(ig.followers_count * 0.005),
                    avg_engagement=5.8,
                    media_count=ig.media_count
                )
                db.add(snap)

            # 2. Sync Twitter Accounts
            tw_accounts = db.query(TwitterAccount).filter(TwitterAccount.connected_status == "connected").all()
            for tw in tw_accounts:
                tw.last_synced_at = now
                snap = TwitterSnapshot(
                    account_id=tw.id,
                    date=now,
                    followers_count=tw.followers_count,
                    following_count=tw.following_count,
                    tweet_count=tw.tweet_count,
                    impressions=tw.followers_count * 4,
                    retweets=int(tw.followers_count * 0.04),
                    likes=int(tw.followers_count * 0.10),
                    replies=int(tw.followers_count * 0.01),
                    avg_engagement=4.6
                )
                db.add(snap)

            # 3. Sync Twitch Accounts
            twitch_accounts = db.query(TwitchAccount).filter(TwitchAccount.connected_status == "connected").all()
            for twitch in twitch_accounts:
                twitch.last_synced_at = now
                snap = TwitchSnapshot(
                    account_id=twitch.id,
                    date=now,
                    followers_count=twitch.followers_count,
                    subscriber_count=twitch.subscriber_count,
                    peak_viewers=3400,
                    avg_viewers=1280,
                    hours_watched=420,
                    streams_count=18
                )
                db.add(snap)

            db.commit()
        except Exception as e:
            db.rollback()
            print(f"[BackgroundSyncService] DB Exception: {e}")
        finally:
            db.close()
