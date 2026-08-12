import math
from sqlalchemy.orm import Session
from typing import Dict, List, Any
from models import InstagramAccount, InstagramSnapshot, TwitterAccount, TwitterSnapshot, TwitchAccount, TwitchSnapshot, Growth

class PredictionAggregator:
    @classmethod
    def generate_prediction(cls, user_id: int, platform: str, db: Session) -> Dict[str, Any]:
        """
        Pure mathematical OLS Linear Regression engine (y = mx + b).
        Uses strictly historical DB snapshots. Zero random numbers or AI simulation.
        """
        p_clean = (platform or "overall").lower()
        points = []

        if p_clean == "instagram":
            acc = db.query(InstagramAccount).filter(InstagramAccount.user_id == user_id).first()
            if acc:
                snaps = db.query(InstagramSnapshot).filter(InstagramSnapshot.account_id == acc.id).order_by(InstagramSnapshot.date.asc()).all()
                points = [(i, s.followers_count) for i, s in enumerate(snaps)]
        elif p_clean == "twitter":
            acc = db.query(TwitterAccount).filter(TwitterAccount.user_id == user_id).first()
            if acc:
                snaps = db.query(TwitterSnapshot).filter(TwitterSnapshot.account_id == acc.id).order_by(TwitterSnapshot.date.asc()).all()
                points = [(i, s.followers_count) for i, s in enumerate(snaps)]
        elif p_clean == "twitch":
            acc = db.query(TwitchAccount).filter(TwitchAccount.user_id == user_id).first()
            if acc:
                snaps = db.query(TwitchSnapshot).filter(TwitchSnapshot.account_id == acc.id).order_by(TwitchSnapshot.date.asc()).all()
                points = [(i, s.followers_count) for i, s in enumerate(snaps)]
        else:
            # Overall growth records
            growths = db.query(Growth).filter(Growth.user_id == user_id).order_by(Growth.date.asc()).all()
            points = [(i, g.followers) for i, g in enumerate(growths)]

        n = len(points)
        if n < 2:
            return {
                "status": "insufficient_data",
                "platform": platform.title(),
                "message": "Not enough historical data available to generate predictions. At least 2-3 historical snapshots required."
            }

        # Compute OLS Regression (y = mx + b)
        sum_x = sum(pt[0] for pt in points)
        sum_y = sum(pt[1] for pt in points)
        sum_xy = sum(pt[0] * pt[1] for pt in points)
        sum_x2 = sum(pt[0] ** 2 for pt in points)

        denom = (n * sum_x2 - (sum_x ** 2))
        if denom == 0:
            m = 0.0
            b = sum_y / float(n)
        else:
            m = (n * sum_xy - (sum_x * sum_y)) / float(denom)
            b = (sum_y - (m * sum_x)) / float(n)

        # Calculate R^2 Confidence Coefficient
        mean_y = sum_y / float(n)
        ss_tot = sum((pt[1] - mean_y) ** 2 for pt in points)
        ss_res = sum((pt[1] - (m * pt[0] + b)) ** 2 for pt in points)
        r2 = 1.0 - (ss_res / float(ss_tot)) if ss_tot > 0 else 1.0
        confidence_pct = round(max(0.0, min(100.0, r2 * 100.0)), 2)

        # Generate 30-day forecast projection
        last_x = points[-1][0]
        forecast_30d = round(m * (last_x + 30) + b)
        forecast_60d = round(m * (last_x + 60) + b)

        trend_direction = "Strong Positive Growth" if m > 0 else ("Negative Decay" if m < 0 else "Neutral Baseline")

        return {
            "status": "success",
            "platform": platform.title(),
            "data_points_count": n,
            "equation": f"y = {m:.2f}x + {b:.2f}",
            "slope": round(m, 2),
            "intercept": round(b, 2),
            "r_squared": round(r2, 4),
            "confidence_percentage": confidence_pct,
            "current_value": points[-1][1],
            "forecast_30d": max(0, forecast_30d),
            "forecast_60d": max(0, forecast_60d),
            "prediction_interval": f"±{round(abs(m * 3.0), 2)}",
            "trend": trend_direction
        }
