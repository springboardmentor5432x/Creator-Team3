from typing import Dict, Any

class RevenueEstimator:
    @staticmethod
    def calculate_instagram_revenue_estimate(
        followers_count: int,
        total_views: int,
        avg_engagement: float,
        reach: int,
        cpm: float = 6.50,
        sponsorship_rate: float = 0.006,
        affiliate_conv: float = 2.5
    ) -> Dict[str, Any]:
        """
        Calculates Instagram Estimated Earnings.
        Every metric is mathematically derived and clearly labeled 'Estimated'.
        """
        # 1. Estimated Reels / Ad Value
        est_ad_value = (max(total_views, followers_count * 5) / 1000.0) * cpm * 0.75

        # 2. Estimated Sponsorship Value per sponsored post
        est_sponsorship_per_post = followers_count * (avg_engagement / 100.0) * sponsorship_rate * 12.0
        monthly_sponsorship_est = est_sponsorship_per_post * 2.0 # ~2 sponsored posts/mo

        # 3. Estimated Affiliate Revenue
        affiliate_clicks = reach * 0.02
        affiliate_conversions = affiliate_clicks * (affiliate_conv / 100.0)
        monthly_affiliate_est = affiliate_conversions * 45.0 * 0.10 # $45 order, 10% commission

        total_monthly_est = round(est_ad_value + monthly_sponsorship_est + monthly_affiliate_est, 2)
        total_annual_est = round(total_monthly_est * 12.0, 2)

        return {
            "is_estimated": True,
            "label": "Estimated Revenue",
            "estimatedMonthlyRevenue": total_monthly_est,
            "estimatedAnnualRevenue": total_annual_est,
            "estimatedSponsorshipPerPost": round(est_sponsorship_per_post, 2),
            "breakdown": [
                {"source": "Sponsorship Posts (Est.)", "amount": round(monthly_sponsorship_est, 2), "percentage": round((monthly_sponsorship_est / max(1, total_monthly_est)) * 100, 1)},
                {"source": "Reels & Video Ads (Est.)", "amount": round(est_ad_value, 2), "percentage": round((est_ad_value / max(1, total_monthly_est)) * 100, 1)},
                {"source": "Affiliate Marketing (Est.)", "amount": round(monthly_affiliate_est, 2), "percentage": round((monthly_affiliate_est / max(1, total_monthly_est)) * 100, 1)}
            ]
        }
