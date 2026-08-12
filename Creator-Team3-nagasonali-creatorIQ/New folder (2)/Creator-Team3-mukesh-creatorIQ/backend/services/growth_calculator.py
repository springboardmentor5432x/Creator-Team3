from typing import Dict, List, Any

class GrowthCalculator:
    @staticmethod
    def calculate_moving_average(series: List[float], window: int) -> Dict[str, Any]:
        """Calculates moving average, previous window average, difference, and trend direction."""
        n = len(series)
        if n < window:
            window = max(1, n)
            
        current_window = series[-window:]
        curr_avg = sum(current_window) / len(current_window) if current_window else 0.0

        if n >= window * 2:
            prev_window = series[-(window * 2):-window]
            prev_avg = sum(prev_window) / len(prev_window)
        elif n > window:
            prev_window = series[:-window]
            prev_avg = sum(prev_window) / len(prev_window)
        else:
            prev_avg = curr_avg

        diff = curr_avg - prev_avg
        growth_rate = ((diff / prev_avg) * 100.0) if prev_avg > 0 else 0.0
        
        if diff > 0.01:
            trend = "Increasing"
        elif diff < -0.01:
            trend = "Decreasing"
        else:
            trend = "Stable"

        return {
            "window_days": window,
            "current_average": round(curr_avg, 2),
            "previous_average": round(prev_avg, 2),
            "difference": round(diff, 2),
            "growth_rate_pct": round(growth_rate, 2),
            "trend_direction": trend
        }

    @staticmethod
    def calculate_velocity_and_acceleration(series: List[float], dates_in_days: List[float]) -> Dict[str, Any]:
        """
        Calculates Velocity (Change/Time, e.g. Followers/day) and Acceleration (change in velocity/day^2).
        """
        n = len(series)
        if n < 2:
            return {
                "velocity_per_day": 0.0,
                "acceleration_per_day2": 0.0,
                "velocity_text": "0/day",
                "acceleration_text": "0/day²"
            }

        # Velocity over recent 7 data points (or full series)
        recent_count = min(7, n)
        recent_y = series[-recent_count:]
        recent_x = dates_in_days[-recent_count:]

        total_time_delta = max(1.0, recent_x[-1] - recent_x[0])
        total_val_delta = recent_y[-1] - recent_y[0]
        
        velocity = total_val_delta / total_time_delta

        # Acceleration: compare velocity of first half vs second half of recent points
        half = recent_count // 2
        if half >= 1 and recent_count >= 4:
            v1_time = max(1.0, recent_x[half] - recent_x[0])
            v1 = (recent_y[half] - recent_y[0]) / v1_time

            v2_time = max(1.0, recent_x[-1] - recent_x[half])
            v2 = (recent_y[-1] - recent_y[half]) / v2_time

            accel_time = max(1.0, (recent_x[-1] + recent_x[half])/2 - (recent_x[half] + recent_x[0])/2)
            acceleration = (v2 - v1) / accel_time
        else:
            acceleration = 0.0

        vel_sign = "+" if velocity >= 0 else ""
        acc_sign = "+" if acceleration >= 0 else ""

        return {
            "velocity_per_day": round(velocity, 2),
            "acceleration_per_day2": round(acceleration, 2),
            "velocity_text": f"{vel_sign}{round(velocity, 1)}/day",
            "acceleration_text": f"{acc_sign}{round(acceleration, 2)}/day²"
        }
