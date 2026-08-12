import math
from typing import Dict, List, Any
from services.regression_calculator import RegressionCalculator
from services.growth_calculator import GrowthCalculator
from services.statistics_service import StatisticsService

class ForecastCalculator:
    @staticmethod
    def classify_trend(slope: float, mean_y: float) -> str:
        if mean_y == 0:
            return "Stable"
        relative_slope = slope / mean_y
        if relative_slope >= 0.005:
            return "Strong Growth"
        elif relative_slope >= 0.001:
            return "Moderate Growth"
        elif relative_slope >= -0.001:
            return "Stable"
        else:
            return "Declining"

    @staticmethod
    def calculate_forecast_for_days(
        target_days: int,
        x_indices: List[float],
        y_vals: List[float],
        regression: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Calculates expected value, upper bound, and lower bound for target_days out.
        """
        if not regression["valid"]:
            last_y = y_vals[-1] if y_vals else 0.0
            return {
                "days": target_days,
                "expected": int(last_y),
                "lower_bound": int(last_y * 0.95),
                "upper_bound": int(last_y * 1.05),
                "range_text": f"{int(last_y * 0.95):,} - {int(last_y * 1.05):,}"
            }

        slope = regression["slope"]
        intercept = regression["intercept"]
        std_error = regression["std_error"]

        n = len(x_indices)
        last_x = x_indices[-1] if x_indices else 0.0
        
        # Target index in regression timeline
        target_x = last_x + target_days

        expected_val = intercept + slope * target_x
        # Prevent negative values for counts
        expected_val = max(y_vals[-1] * 0.5, expected_val)

        # Standard error expansion with time distance delta_t
        delta_t = target_days / 30.0 # scale factor
        margin = max(expected_val * 0.02, 1.96 * max(std_error, expected_val * 0.015) * math.sqrt(1.0 + (1.0 / max(1, n)) + (delta_t ** 2 / 10.0)))

        lower_bound = max(0, int(expected_val - margin))
        upper_bound = int(expected_val + margin)

        return {
            "days": target_days,
            "expected": int(expected_val),
            "lower_bound": lower_bound,
            "upper_bound": upper_bound,
            "range_text": f"{lower_bound:,} - {upper_bound:,}"
        }

    @staticmethod
    def calculate_what_if_scenario(
        base_followers: float,
        base_views: float,
        base_revenue: float,
        base_engagement: float,
        params: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Recalculates dynamic predictions based on custom parameters:
        - uploads_per_week (default 3)
        - avg_views_per_video (default 25000)
        - engagement_rate (default 5.5%)
        - cpm (default $4.50)
        - watch_time_mins (default 4.5)
        """
        uploads_per_week = float(params.get("uploads_per_week", 3))
        avg_views = float(params.get("avg_views_per_video", 25000))
        engagement = float(params.get("engagement_rate", base_engagement or 5.5))
        cpm = float(params.get("cpm", 4.50))

        # Re-estimate monthly views
        monthly_videos = uploads_per_week * 4.33
        simulated_monthly_views = max(base_views, monthly_videos * avg_views)

        # Re-estimate revenue
        simulated_ad_rev = (simulated_monthly_views / 1000.0) * cpm * 0.8
        simulated_sponsorship = (base_followers * (engagement / 100.0) * 0.005 * 10.0) * 2.5
        simulated_monthly_rev = round(simulated_ad_rev + simulated_sponsorship, 2)

        # Re-estimate follower growth velocity per day
        follower_conv_rate = (engagement / 100.0) * 0.008
        simulated_followers_gained_monthly = int(simulated_monthly_views * follower_conv_rate)

        return {
            "simulated_monthly_views": int(simulated_monthly_views),
            "simulated_monthly_revenue": simulated_monthly_rev,
            "simulated_follower_gain_30d": simulated_followers_gained_monthly,
            "simulated_followers_30d": int(base_followers + simulated_followers_gained_monthly),
            "simulated_engagement": round(engagement, 2),
            "parameters_used": {
                "uploads_per_week": uploads_per_week,
                "avg_views_per_video": avg_views,
                "engagement_rate": engagement,
                "cpm": cpm
            }
        }
