import math
from typing import Dict, List, Tuple, Any

class RegressionCalculator:
    @staticmethod
    def calculate_ols_regression(x_vals: List[float], y_vals: List[float]) -> Dict[str, Any]:
        """
        Calculates Ordinary Least Squares (OLS) Linear Regression: y = mx + b.
        Returns slope, intercept, R2 score, standard error of estimate, and equation string.
        """
        n = len(x_vals)
        if n < 2 or len(y_vals) != n:
            return {
                "slope": 0.0,
                "intercept": y_vals[0] if y_vals else 0.0,
                "r2_score": 0.0,
                "std_error": 0.0,
                "equation": f"y = 0x + {round(y_vals[0] if y_vals else 0, 2)}",
                "valid": False
            }

        sum_x = sum(x_vals)
        sum_y = sum(y_vals)
        sum_xy = sum(x * y for x, y in zip(x_vals, y_vals))
        sum_xx = sum(x * x for x in x_vals)
        mean_y = sum_y / n

        denom = (n * sum_xx - sum_x * sum_x)
        if denom == 0:
            return {
                "slope": 0.0,
                "intercept": round(mean_y, 2),
                "r2_score": 0.0,
                "std_error": 0.0,
                "equation": f"y = 0x + {round(mean_y, 2)}",
                "valid": False
            }

        slope = (n * sum_xy - sum_x * sum_y) / denom
        intercept = (sum_y - slope * sum_x) / n

        # Fitted values and errors
        y_pred = [slope * x + intercept for x in x_vals]
        
        sst = sum((y - mean_y) ** 2 for y in y_vals)
        ssr = sum((yp - mean_y) ** 2 for yp in y_pred)
        sse = sum((y - yp) ** 2 for y, yp in zip(y_vals, y_pred))

        r2_score = max(0.0, min(1.0, ssr / sst)) if sst > 0 else 1.0
        std_error = math.sqrt(sse / max(1, n - 2)) if n > 2 else 0.0

        # Sign formatting for equation string
        sign = "+" if intercept >= 0 else "-"
        equation = f"y = {round(slope, 4)}x {sign} {round(abs(intercept), 2)}"

        return {
            "slope": round(slope, 4),
            "intercept": round(intercept, 4),
            "r2_score": round(r2_score, 4),
            "std_error": round(std_error, 4),
            "equation": equation,
            "valid": True
        }
