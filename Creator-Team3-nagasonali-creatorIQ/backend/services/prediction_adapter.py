from typing import Dict, List, Any
from services.regression_calculator import RegressionCalculator
from services.growth_calculator import GrowthCalculator
from services.statistics_service import StatisticsService
from services.forecast_calculator import ForecastCalculator

class PredictionAdapter:
    @staticmethod
    def get_instagram_predictions(snapshots: List[Any], current_followers: int, current_views: int) -> Dict[str, Any]:
        """
        Adapts real Instagram historical snapshots for OLS linear regression predictions.
        """
        if not snapshots or len(snapshots) < 3:
            return {
                "valid": False,
                "message": "Not enough historical data available. Connect Instagram and allow background sync to generate mathematical predictions."
            }

        dates_x = [(s.date - snapshots[0].date).total_seconds() / 86400.0 for s in snapshots]
        followers_y = [float(s.followers_count) for s in snapshots]
        views_y = [float(s.impressions or s.reach or (s.followers_count * 5)) for s in snapshots]

        ols_f = RegressionCalculator.calculate_ols_regression(dates_x, followers_y)
        ols_v = RegressionCalculator.calculate_ols_regression(dates_x, views_y)

        # Backtest confidence
        pred_f_backtest = [ols_f["slope"] * x + ols_f["intercept"] for x in dates_x]
        confidence = StatisticsService.calculate_mape_and_confidence(followers_y, pred_f_backtest)

        periods = [7, 30, 90]
        forecasts = []
        for days in periods:
            f_fc = ForecastCalculator.calculate_forecast_for_days(days, dates_x, followers_y, ols_f)
            v_fc = ForecastCalculator.calculate_forecast_for_days(days, dates_x, views_y, ols_v)
            
            forecasts.append({
                "period": f"Next {days} Days",
                "days": days,
                "predicted_followers": f_fc["expected"],
                "followers_lower": f_fc["lower_bound"],
                "followers_upper": f_fc["upper_bound"],
                "predicted_views": v_fc["expected"],
                "confidence": round(max(50.0, confidence["confidence_score"] - (days * 0.05)), 1)
            })

        return {
            "valid": True,
            "ols_equation": ols_f["equation"],
            "r2_score": ols_f["r2_score"],
            "confidence_score": confidence["confidence_score"],
            "confidence_tier": confidence["tier"],
            "predictions": forecasts
        }
