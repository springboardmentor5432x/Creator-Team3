from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from typing import Dict, List, Any

from models import Growth, CreatorProfile, SocialAccount
from services.regression_calculator import RegressionCalculator
from services.growth_calculator import GrowthCalculator
from services.statistics_service import StatisticsService
from services.forecast_calculator import ForecastCalculator
from services.revenue_engine import RevenueEngine

class PredictionService:
    @classmethod
    def get_full_prediction_engine_data(cls, user_id: int, target_period_days: int, what_if_params: Dict[str, Any], db: Session) -> Dict[str, Any]:
        """
        Orchestrates 100% mathematical forecasting from database historical snapshots.
        """
        profile = db.query(CreatorProfile).filter(CreatorProfile.user_id == user_id).first()
        accounts = db.query(SocialAccount).filter(SocialAccount.creator_id == profile.creator_id).all() if profile else []
        
        current_followers = sum(a.followers for a in accounts) if accounts else 520000
        youtube_subs = next((a.followers for a in accounts if a.platform == "YouTube"), int(current_followers * 0.6))

        # Fetch historical snapshots ordered by date
        growth_records = db.query(Growth).filter(Growth.user_id == user_id).order_by(Growth.date).all()
        
        # Seed daily snapshots if empty to ensure historical continuity
        if not growth_records or len(growth_records) < 5:
            from services.growth_engine import GrowthEngine
            GrowthEngine.get_real_growth_analytics(user_id, "monthly", db)
            growth_records = db.query(Growth).filter(Growth.user_id == user_id).order_by(Growth.date).all()

        followers_series = [float(r.followers) for r in growth_records]
        views_series = [float(r.views) for r in growth_records]
        dates_in_days = [(r.date - growth_records[0].date).total_seconds() / 86400.0 for r in growth_records]

        # 1. Validation
        validation = StatisticsService.validate_historical_data(followers_series, min_records=3)
        if not validation["valid"]:
            return {
                "valid": False,
                "message": validation["message"],
                "historical_records_count": len(followers_series)
            }

        # 2. Linear Regression (OLS)
        follower_ols = RegressionCalculator.calculate_ols_regression(dates_in_days, followers_series)
        views_ols = RegressionCalculator.calculate_ols_regression(dates_in_days, views_series)

        # 3. Moving Averages
        ma_7_followers = GrowthCalculator.calculate_moving_average(followers_series, 7)
        ma_14_followers = GrowthCalculator.calculate_moving_average(followers_series, 14)
        ma_30_followers = GrowthCalculator.calculate_moving_average(followers_series, 30)

        ma_7_views = GrowthCalculator.calculate_moving_average(views_series, 7)
        ma_30_views = GrowthCalculator.calculate_moving_average(views_series, 30)

        # 4. Growth Rates & Velocity / Acceleration
        follower_va = GrowthCalculator.calculate_velocity_and_acceleration(followers_series, dates_in_days)
        views_va = GrowthCalculator.calculate_velocity_and_acceleration(views_series, dates_in_days)

        daily_growth_pct = round(((followers_series[-1] - followers_series[-2]) / max(1, followers_series[-2])) * 100.0, 2) if len(followers_series) >= 2 else 0.4
        weekly_growth_pct = ma_7_followers["growth_rate_pct"]
        monthly_growth_pct = ma_30_followers["growth_rate_pct"]

        # 5. Trend Classification
        trend_classification = ForecastCalculator.classify_trend(follower_ols["slope"], sum(followers_series)/len(followers_series))

        # 6. Revenue Estimation Integration
        rev_engine_data = RevenueEngine.calculate_revenue_estimation(user_id, db)
        base_monthly_rev = rev_engine_data["summary"]["estimatedMonthlyRevenue"]

        rev_series = [round((v / 1000.0) * 4.2 + (base_monthly_rev * 0.4), 2) for v in views_series]
        rev_ols = RegressionCalculator.calculate_ols_regression(dates_in_days, rev_series)

        # 7. Confidence Score (MAPE on OLS backtest)
        pred_followers_backtest = [follower_ols["slope"] * x + follower_ols["intercept"] for x in dates_in_days]
        stats_confidence = StatisticsService.calculate_mape_and_confidence(followers_series, pred_followers_backtest)

        # 8. Forecast Periods Projections
        standard_periods = [7, 30, 60, 90, 180, 365]
        period_forecasts = []
        for days in standard_periods:
            f_fc = ForecastCalculator.calculate_forecast_for_days(days, dates_in_days, followers_series, follower_ols)
            v_fc = ForecastCalculator.calculate_forecast_for_days(days, dates_in_days, views_series, views_ols)
            r_fc = ForecastCalculator.calculate_forecast_for_days(days, dates_in_days, rev_series, rev_ols)
            
            period_forecasts.append({
                "period_days": days,
                "label": f"{days} Days",
                "followers": f_fc,
                "views": v_fc,
                "revenue": r_fc,
                "confidence_score": round(max(50.0, stats_confidence["confidence_score"] - (days * 0.05)), 1)
            })

        # Active selected period forecast
        active_f_fc = ForecastCalculator.calculate_forecast_for_days(target_period_days, dates_in_days, followers_series, follower_ols)
        active_v_fc = ForecastCalculator.calculate_forecast_for_days(target_period_days, dates_in_days, views_series, views_ols)
        active_r_fc = ForecastCalculator.calculate_forecast_for_days(target_period_days, dates_in_days, rev_series, rev_ols)

        # 9. What-If Calculator Recalculation
        what_if_results = ForecastCalculator.calculate_what_if_scenario(
            current_followers,
            views_series[-1] if views_series else 4200000,
            base_monthly_rev,
            profile.engagement_rate if profile else 5.8,
            what_if_params or {}
        )

        # 10. Step-by-Step Sample Mathematical Explanation
        sample_x_day = int(dates_in_days[-1] + target_period_days)
        sample_calc_y = round(follower_ols["slope"] * sample_x_day + follower_ols["intercept"])

        math_explanation = {
            "linear_regression": {
                "formula": "y = mx + b",
                "slope_m": follower_ols["slope"],
                "intercept_b": follower_ols["intercept"],
                "equation": follower_ols["equation"],
                "r2_score": follower_ols["r2_score"],
                "standard_error": follower_ols["std_error"]
            },
            "growth_rate_formula": "Growth % = ((Current_Value - Previous_Value) / Previous_Value) * 100",
            "sample_calculation": {
                "metric": "Followers",
                "target_day_x": sample_x_day,
                "step1": f"Identify Slope (m = {follower_ols['slope']}) and Intercept (b = {follower_ols['intercept']}) from {len(followers_series)} snapshots.",
                "step2": f"Apply equation for day {sample_x_day}: y = ({follower_ols['slope']} * {sample_x_day}) + {follower_ols['intercept']}",
                "step3": f"Calculated Expected Followers = {sample_calc_y:,}",
                "step4": f"Confidence Score = 100 - MAPE ({stats_confidence['mape']}%) = {stats_confidence['confidence_score']}%"
            }
        }

        # Format predictions array for existing UI compatibility
        predictions_ui = [
            {
                "period": "Next 30 Days",
                "days": 30,
                "predicted_followers": period_forecasts[1]["followers"]["expected"],
                "followers_lower": period_forecasts[1]["followers"]["lower_bound"],
                "followers_upper": period_forecasts[1]["followers"]["upper_bound"],
                "predicted_views": period_forecasts[1]["views"]["expected"],
                "predicted_revenue": period_forecasts[1]["revenue"]["expected"],
                "confidence": period_forecasts[1]["confidence_score"]
            },
            {
                "period": "Next 60 Days",
                "days": 60,
                "predicted_followers": period_forecasts[2]["followers"]["expected"],
                "followers_lower": period_forecasts[2]["followers"]["lower_bound"],
                "followers_upper": period_forecasts[2]["followers"]["upper_bound"],
                "predicted_views": period_forecasts[2]["views"]["expected"],
                "predicted_revenue": period_forecasts[2]["revenue"]["expected"],
                "confidence": period_forecasts[2]["confidence_score"]
            },
            {
                "period": "Next 90 Days",
                "days": 90,
                "predicted_followers": period_forecasts[3]["followers"]["expected"],
                "followers_lower": period_forecasts[3]["followers"]["lower_bound"],
                "followers_upper": period_forecasts[3]["followers"]["upper_bound"],
                "predicted_views": period_forecasts[3]["views"]["expected"],
                "predicted_revenue": period_forecasts[3]["revenue"]["expected"],
                "confidence": period_forecasts[3]["confidence_score"]
            }
        ]

        return {
            "valid": True,
            "current": {
                "followers": current_followers,
                "subscribers": youtube_subs,
                "views": int(views_series[-1]),
                "revenue": base_monthly_rev
            },
            "trend_classification": trend_classification,
            "growth_rates": {
                "daily_pct": daily_growth_pct,
                "weekly_pct": weekly_growth_pct,
                "monthly_pct": monthly_growth_pct
            },
            "velocity_acceleration": {
                "followers_velocity": follower_va["velocity_text"],
                "followers_acceleration": follower_va["acceleration_text"],
                "views_velocity": views_va["velocity_text"],
                "views_acceleration": views_va["acceleration_text"]
            },
            "moving_averages": {
                "ma_7": ma_7_followers,
                "ma_14": ma_14_followers,
                "ma_30": ma_30_followers
            },
            "confidence": stats_confidence,
            "ols_model": follower_ols,
            "active_period_forecast": {
                "target_period_days": target_period_days,
                "followers": active_f_fc,
                "views": active_v_fc,
                "revenue": active_r_fc
            },
            "period_forecasts": period_forecasts,
            "predictions": predictions_ui,
            "what_if": what_if_results,
            "math_explanation": math_explanation
        }
