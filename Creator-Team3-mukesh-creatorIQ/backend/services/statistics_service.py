import math
from typing import Dict, List, Tuple, Any

class StatisticsService:
    @staticmethod
    def validate_historical_data(y_vals: List[float], min_records: int = 3) -> Dict[str, Any]:
        """
        Validates historical data sufficiency:
        1. Minimum sample size >= min_records
        2. No nulls or NaN values
        3. Variance > 0
        """
        if not y_vals or len(y_vals) < min_records:
            return {
                "valid": False,
                "message": "Not enough historical data available. Minimum 3 historical snapshots required."
            }

        if any(v is None or math.isnan(v) for v in y_vals):
            return {
                "valid": False,
                "message": "Invalid historical records detected containing null values."
            }

        mean_val = sum(y_vals) / len(y_vals)
        variance = sum((y - mean_val) ** 2 for y in y_vals)
        if variance == 0:
            return {
                "valid": False,
                "message": "Historical data variance is zero (constant values across snapshots)."
            }

        return {"valid": True, "message": "Data validated successfully."}

    @staticmethod
    def calculate_mape_and_confidence(y_actual: List[float], y_predicted: List[float]) -> Dict[str, Any]:
        """
        Calculates Mean Absolute Percentage Error (MAPE) and derived Confidence Score:
        MAPE = (100 / N) * sum(|actual - predicted| / actual)
        Confidence = max(0, min(100, 100 - MAPE))
        """
        n = len(y_actual)
        if n == 0 or len(y_predicted) != n:
            return {"mape": 0.0, "confidence_score": 0.0, "tier": "Low", "accuracy_pct": 0.0}

        mape_sum = 0.0
        valid_count = 0
        for act, pred in zip(y_actual, y_predicted):
            if act > 0:
                mape_sum += (abs(act - pred) / act)
                valid_count += 1

        mape = (mape_sum / valid_count * 100.0) if valid_count > 0 else 15.0
        mape = round(mape, 2)

        confidence_score = round(max(0.0, min(100.0, 100.0 - mape)), 1)
        accuracy_pct = round(max(0.0, min(100.0, 100.0 - (mape * 0.75))), 1)

        if confidence_score >= 85.0:
            tier = "High"
        elif confidence_score >= 70.0:
            tier = "Medium"
        else:
            tier = "Low"

        return {
            "mape": mape,
            "confidence_score": confidence_score,
            "accuracy_pct": accuracy_pct,
            "tier": tier
        }

    @staticmethod
    def get_confidence_tier(score: float) -> Tuple[str, str]:
        if score >= 85.0:
            return "High", "High statistical consistency in historical curve"
        elif score >= 70.0:
            return "Medium", "Moderate growth curve variance detected"
        else:
            return "Low", "High metric variance requires additional snapshots"
