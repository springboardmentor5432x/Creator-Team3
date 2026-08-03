from collections import defaultdict
import re

from sqlalchemy.orm import Session
from sqlalchemy import func

from app.models.content import Content
from app.models.audience_history import AudienceHistory
from app.schemas.growth_schema import (
    HashtagAnalytics,
    ReachPrediction,
    AudienceForecast,
)


def get_hashtag_analytics(db: Session):
    hashtag_data = defaultdict(
        lambda: {
            "posts": 0,
            "views": 0,
            "reach": 0,
            "engagement": 0,
        }
    )

    contents = db.query(Content).all()

    for content in contents:
        text = f"{content.title or ''} {content.caption or ''}"

        hashtags = re.findall(r"#\w+", text)

        for tag in hashtags:
            tag = tag.lower()

            hashtag_data[tag]["posts"] += 1
            hashtag_data[tag]["views"] += content.views
            hashtag_data[tag]["reach"] += content.reach
            hashtag_data[tag]["engagement"] += content.engagement_rate

    result = []

    for tag, value in hashtag_data.items():

        avg_engagement = (
            value["engagement"] / value["posts"]
            if value["posts"]
            else 0
        )

        result.append(
            HashtagAnalytics(
                hashtag=tag,
                total_posts=value["posts"],
                total_views=value["views"],
                total_reach=value["reach"],
                average_engagement=round(avg_engagement, 2),
            )
        )

    result.sort(
        key=lambda x: x.total_reach,
        reverse=True,
    )

    return result


def predict_reach(db: Session):

    contents = db.query(Content).all()

    if not contents:
        return ReachPrediction(
            average_reach=0,
            predicted_reach=0,
            confidence="Low",
        )

    avg_reach = (
        db.query(func.avg(Content.reach))
        .scalar()
    ) or 0

    avg_engagement = (
        db.query(func.avg(Content.engagement_rate))
        .scalar()
    ) or 0

    predicted = int(
        avg_reach +
        (avg_reach * (avg_engagement / 100))
    )

    confidence = "Medium"

    if avg_engagement > 10:
        confidence = "High"
    elif avg_engagement < 5:
        confidence = "Low"

    return ReachPrediction(
        average_reach=round(avg_reach, 2),
        predicted_reach=predicted,
        confidence=confidence,
    )


def forecast_audience_growth(db: Session):

    history = (
        db.query(AudienceHistory)
        .order_by(AudienceHistory.recorded_at.asc())
        .all()
    )

    if len(history) < 2:
        return AudienceForecast(
            current_followers=0,
            average_daily_growth=0,
            predicted_followers_30_days=0,
            expected_growth=0,
        )

    first = history[0]
    last = history[-1]

    days = (last.recorded_at - first.recorded_at).days

    if days == 0:
        days = 1

    growth = last.followers - first.followers

    average_daily_growth = growth / days

    predicted = int(
        last.followers +
        (average_daily_growth * 30)
    )

    return AudienceForecast(
        current_followers=last.followers,
        average_daily_growth=round(average_daily_growth, 2),
        predicted_followers_30_days=predicted,
        expected_growth=predicted - last.followers,
    )