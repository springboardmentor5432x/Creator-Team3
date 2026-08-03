from app.models.analytics import Analytics


def create_analytics(data, db):

    new_analytics = Analytics(
        content_id=data.content_id,
        views=data.views,
        likes=data.likes,
        comments=data.comments,
        shares=data.shares,
        saves=data.saves,
        watch_time=data.watch_time,
        reach=data.reach,
        engagement_rate=data.engagement_rate
    )

    db.add(new_analytics)
    db.commit()
    db.refresh(new_analytics)

    return {
        "message": "Analytics Created Successfully",
        "id": new_analytics.id
    }


def get_analytics(db):
    return db.query(Analytics).all()