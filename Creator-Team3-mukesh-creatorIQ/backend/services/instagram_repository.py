from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from typing import Optional, List, Dict, Any
from models import InstagramAccount, InstagramMedia, InstagramSnapshot

class InstagramRepository:
    @staticmethod
    def get_account_by_user_id(user_id: int, db: Session) -> Optional[InstagramAccount]:
        return db.query(InstagramAccount).filter(
            InstagramAccount.user_id == user_id,
            InstagramAccount.connected_status == "connected"
        ).first()

    @staticmethod
    def save_or_update_account(user_id: int, account_data: Dict[str, Any], access_token: str, expires_in: int, db: Session) -> InstagramAccount:
        account = db.query(InstagramAccount).filter(
            InstagramAccount.user_id == user_id,
            InstagramAccount.instagram_user_id == account_data["instagram_user_id"]
        ).first()

        safe_token = access_token or "EAAG_LIVE_META_GRAPH_ACCESS_TOKEN_LIVE"
        expiry_dt = datetime.utcnow() + timedelta(seconds=expires_in) if expires_in else datetime.utcnow() + timedelta(days=60)

        if not account:
            account = InstagramAccount(
                user_id=user_id,
                instagram_user_id=account_data["instagram_user_id"],
                facebook_page_id=account_data.get("facebook_page_id", ""),
                username=account_data.get("username", "instagram_creator"),
                name=account_data.get("name", "Instagram Business"),
                profile_picture_url=account_data.get("profile_picture_url", ""),
                biography=account_data.get("biography", ""),
                followers_count=account_data.get("followers_count", 0),
                follows_count=account_data.get("follows_count", 0),
                media_count=account_data.get("media_count", 0),
                access_token=safe_token,
                token_expires_at=expiry_dt,
                connected_status="connected",
                connected_since=datetime.utcnow(),
                last_synced_at=datetime.utcnow()
            )
            db.add(account)
        else:
            account.username = account_data.get("username", account.username)
            account.name = account_data.get("name", account.name)
            account.profile_picture_url = account_data.get("profile_picture_url", account.profile_picture_url)
            account.biography = account_data.get("biography", account.biography)
            account.followers_count = account_data.get("followers_count", account.followers_count)
            account.follows_count = account_data.get("follows_count", account.follows_count)
            account.media_count = account_data.get("media_count", account.media_count)
            account.access_token = safe_token
            account.token_expires_at = expiry_dt
            account.connected_status = "connected"
            account.last_synced_at = datetime.utcnow()

        db.commit()
        db.refresh(account)
        return account

    @staticmethod
    def disconnect_account(user_id: int, db: Session) -> bool:
        account = db.query(InstagramAccount).filter(InstagramAccount.user_id == user_id).first()
        if account:
            account.connected_status = "disconnected"
            db.commit()
            return True
        return False

    @staticmethod
    def save_media_items(account_id: int, media_list: List[Dict[str, Any]], db: Session):
        for m in media_list:
            media = db.query(InstagramMedia).filter(
                InstagramMedia.account_id == account_id,
                InstagramMedia.media_id == m["media_id"]
            ).first()

            ts = datetime.utcnow()
            if m.get("timestamp"):
                try:
                    ts = datetime.fromisoformat(m["timestamp"].replace('Z', ''))
                except Exception:
                    pass

            if not media:
                media = InstagramMedia(
                    account_id=account_id,
                    media_id=m["media_id"],
                    caption=m.get("caption", ""),
                    media_type=m.get("media_type", "IMAGE"),
                    media_url=m.get("media_url", ""),
                    thumbnail_url=m.get("thumbnail_url", ""),
                    permalink=m.get("permalink", ""),
                    timestamp=ts,
                    like_count=m.get("like_count", 0),
                    comments_count=m.get("comments_count", 0),
                    reach=m.get("reach", 0),
                    impressions=m.get("impressions", 0),
                    saved=m.get("saved", 0),
                    video_views=m.get("video_views", 0)
                )
                db.add(media)
            else:
                media.like_count = m.get("like_count", media.like_count)
                media.comments_count = m.get("comments_count", media.comments_count)
                media.reach = m.get("reach", media.reach)
                media.impressions = m.get("impressions", media.impressions)
                media.saved = m.get("saved", media.saved)
                media.video_views = m.get("video_views", media.video_views)

        db.commit()

    @staticmethod
    def get_account_media(account_id: int, db: Session, sort_by: str = "newest") -> List[InstagramMedia]:
        query = db.query(InstagramMedia).filter(InstagramMedia.account_id == account_id)
        if sort_by == "highest_engagement":
            query = query.order_by((InstagramMedia.like_count + InstagramMedia.comments_count).desc())
        elif sort_by == "most_viewed":
            query = query.order_by(InstagramMedia.impressions.desc())
        elif sort_by == "most_liked":
            query = query.order_by(InstagramMedia.like_count.desc())
        elif sort_by == "most_commented":
            query = query.order_by(InstagramMedia.comments_count.desc())
        elif sort_by == "oldest":
            query = query.order_by(InstagramMedia.timestamp.asc())
        else: # newest
            query = query.order_by(InstagramMedia.timestamp.desc())

        return query.all()

    @staticmethod
    def save_snapshot(account_id: int, snapshot_data: Dict[str, Any], db: Session) -> InstagramSnapshot:
        today = datetime.utcnow().date()
        existing = db.query(InstagramSnapshot).filter(
            InstagramSnapshot.account_id == account_id,
            InstagramSnapshot.date >= datetime.combine(today, datetime.min.time())
        ).first()

        if existing:
            for k, v in snapshot_data.items():
                if hasattr(existing, k):
                    setattr(existing, k, v)
            db.commit()
            return existing
        else:
            snap = InstagramSnapshot(account_id=account_id, **snapshot_data)
            db.add(snap)
            db.commit()
            db.refresh(snap)
            return snap

    @staticmethod
    def get_snapshots(account_id: int, days: int, db: Session) -> List[InstagramSnapshot]:
        cutoff = datetime.utcnow() - timedelta(days=days)
        return db.query(InstagramSnapshot).filter(
            InstagramSnapshot.account_id == account_id,
            InstagramSnapshot.date >= cutoff
        ).order_by(InstagramSnapshot.date.asc()).all()
