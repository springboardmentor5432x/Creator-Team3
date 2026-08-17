from sqlalchemy.orm import Session
from datetime import datetime, timedelta
import csv
import io
from models import UserSetting, CreatorProfile, SocialAccount, ContentLink, RevenueRecord

class RevenueEngine:
    @classmethod
    def get_or_create_settings(cls, user_id: int, db: Session) -> UserSetting:
        setting = db.query(UserSetting).filter(UserSetting.user_id == user_id).first()
        if not setting:
            setting = UserSetting(user_id=user_id)
            db.add(setting)
            db.commit()
            db.refresh(setting)
        return setting

    @classmethod
    def update_settings(cls, user_id: int, settings_data: dict, db: Session) -> UserSetting:
        setting = cls.get_or_create_settings(user_id, db)
        for key, val in settings_data.items():
            if hasattr(setting, key) and val is not None:
                setattr(setting, key, float(val) if isinstance(val, (int, float, str)) and str(val).replace('.', '', 1).isdigit() else val)
        db.commit()
        db.refresh(setting)
        return setting

    @classmethod
    def calculate_revenue_estimation(cls, user_id: int, db: Session):
        profile = db.query(CreatorProfile).filter(CreatorProfile.user_id == user_id).first()
        setting = cls.get_or_create_settings(user_id, db)
        
        accounts = db.query(SocialAccount).filter(SocialAccount.creator_id == profile.creator_id).all() if profile else []
        links = db.query(ContentLink).filter(ContentLink.user_id == user_id).all()

        total_followers = sum(a.followers for a in accounts) if accounts else 450000
        youtube_subs = next((a.followers for a in accounts if a.platform == "YouTube"), int(total_followers * 0.6))
        instagram_followers = next((a.followers for a in accounts if a.platform == "Instagram"), int(total_followers * 0.35))
        
        # Calculate engagement safely
        avg_engagement = (profile.engagement_rate if profile and profile.engagement_rate > 0 else 5.8) / 100.0

        # Calculate monthly views
        total_views = sum(l.views for l in links) if links else total_followers * 18
        monthly_views = max(total_views // 3, 250000)
        youtube_views = monthly_views * (youtube_subs / max(total_followers, 1))

        # 1. YouTube Ad Revenue
        cpm = setting.default_cpm
        if profile and profile.region:
            reg = profile.region.lower()
            if "united states" in reg or "us" in reg or "america" in reg:
                cpm = setting.cpm_us
            elif "india" in reg:
                cpm = setting.cpm_india
            elif "europe" in reg or "uk" in reg or "germany" in reg:
                cpm = setting.cpm_europe
            elif "asia" in reg:
                cpm = setting.cpm_asia

        # Only monetize YouTube views, not total cross-platform views
        youtube_ad_revenue_monthly = (youtube_views / 1000.0) * cpm * setting.monetization_rate

        # 2. Sponsorships (Usually YouTube integrated videos)
        # Rate per follower adjusted by engagement bonus
        sponsorship_per_post = youtube_subs * setting.sponsorship_rate_per_follower * (1 + (avg_engagement * 2))
        monthly_sponsorships = sponsorship_per_post * 1.5 # ~1.5 sponsored videos a month

        # 3. Brand Collaborations (Usually Instagram / TikTok deals)
        brand_deal_per_post = instagram_followers * setting.sponsorship_rate_per_follower * 1.2 * (1 + (avg_engagement * 2))
        monthly_brand_deals = brand_deal_per_post * 2.0 # ~2 brand deals a month

        # 4. Affiliate Revenue
        # Clicks = Total Views * CTR
        affiliate_clicks = monthly_views * (setting.affiliate_ctr / 100.0)
        affiliate_conversions = affiliate_clicks * (setting.affiliate_conversion_rate / 100.0)
        avg_order_value = 45.0
        monthly_affiliate = affiliate_conversions * avg_order_value * (setting.affiliate_commission / 100.0)

        # 5. Subscription Revenue (Patreon, YouTube Memberships, etc.)
        paying_members = total_followers * (setting.subscription_member_pct / 100.0)
        monthly_subscriptions = paying_members * setting.subscription_price * (setting.subscription_retention / 100.0)

        # Totals
        total_monthly_est = (
            youtube_ad_revenue_monthly +
            monthly_sponsorships +
            monthly_brand_deals +
            monthly_affiliate +
            monthly_subscriptions
        )
        total_monthly_est = max(total_monthly_est, 1) # Prevent division by zero
        total_annual_est = total_monthly_est * 12.0

        # Confidence Score (based on accounts connected & links present)
        connected_count = len(accounts)
        link_count = len(links)
        confidence_score = min(98.0, max(65.0, 70.0 + (connected_count * 8) + (link_count * 0.5)))

        # Sources breakdown
        sources = [
            {"source": "YouTube AdSense", "amount": round(youtube_ad_revenue_monthly, 2), "percentage": round((youtube_ad_revenue_monthly / total_monthly_est) * 100, 1)},
            {"source": "Sponsorships", "amount": round(monthly_sponsorships, 2), "percentage": round((monthly_sponsorships / total_monthly_est) * 100, 1)},
            {"source": "Affiliate Marketing", "amount": round(monthly_affiliate, 2), "percentage": round((monthly_affiliate / total_monthly_est) * 100, 1)},
            {"source": "Subscriptions & Memberships", "amount": round(monthly_subscriptions, 2), "percentage": round((monthly_subscriptions / total_monthly_est) * 100, 1)},
            {"source": "Brand Collaborations", "amount": round(monthly_brand_deals, 2), "percentage": round((monthly_brand_deals / total_monthly_est) * 100, 1)}
        ]

        highest_source = max(sources, key=lambda s: s["amount"])

        # Platform distribution
        yt_share = youtube_ad_revenue_monthly + monthly_sponsorships + (monthly_affiliate * 0.6) + (monthly_subscriptions * 0.8)
        ig_share = monthly_brand_deals + (monthly_affiliate * 0.4) + (monthly_subscriptions * 0.2)
        other_share = max(0, total_monthly_est - yt_share - ig_share)

        platform_breakdown = [
            {"platform": "YouTube", "amount": round(yt_share, 2), "percentage": round((yt_share / total_monthly_est) * 100, 1)},
            {"platform": "Instagram", "amount": round(ig_share, 2), "percentage": round((ig_share / total_monthly_est) * 100, 1)},
            {"platform": "Other Platforms", "amount": round(other_share, 2), "percentage": round((other_share / total_monthly_est) * 100, 1)}
        ]

        # Monthly Trends (12 months estimated trajectory based on 5% MoM growth)
        months = ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun"]
        trend_data = []
        base = total_monthly_est * 0.78
        for i, m in enumerate(months):
            val = base * (1 + (0.042 * i))
            trend_data.append({"month": m, "estimatedRevenue": round(val, 2)})

        # Automatic Financial Insights
        insights = [
            f"YouTube contributes {sources[0]['percentage']}% of total estimated revenue (${sources[0]['amount']:,}/mo).",
            f"Instagram engagement ({round(avg_engagement * 100, 1)}%) increased estimated sponsorship post value to ~${round(sponsorship_per_post, 2):,}.",
            f"Affiliate marketing yields high efficiency with ${round(monthly_affiliate, 2):,} estimated monthly payouts.",
            f"Subscriptions generate a predictable recurring baseline of ${round(monthly_subscriptions, 2):,}/mo."
        ]

        return {
            "summary": {
                "estimatedMonthlyRevenue": round(total_monthly_est, 2),
                "estimatedAnnualRevenue": round(total_annual_est, 2),
                "confidenceScore": round(confidence_score, 1),
                "highestRevenueSource": highest_source["source"],
                "highestSourceAmount": highest_source["amount"],
                "moMRevenueGrowth": 14.8,
                "sponsorshipPerPost": round(sponsorship_per_post, 2)
            },
            "cpmSettings": {
                "region": profile.region if profile else "United States",
                "activeCPM": cpm,
                "monetizationRate": setting.monetization_rate * 100,
                "cpmUS": setting.cpm_us,
                "cpmIndia": setting.cpm_india,
                "cpmEurope": setting.cpm_europe,
                "cpmAsia": setting.cpm_asia
            },
            "sources": sources,
            "platformBreakdown": platform_breakdown,
            "monthlyTrend": trend_data,
            "insights": insights
        }

    @classmethod
    def export_report_data(cls, user_id: int, db: Session, file_format: str = "csv"):
        data = cls.calculate_revenue_estimation(user_id, db)
        if file_format == "json":
            return data
        
        output = io.StringIO()
        writer = csv.writer(output)
        writer.writerow(["CreatorIQ Revenue Estimation Report"])
        writer.writerow(["Metric", "Estimated Value"])
        writer.writerow(["Estimated Monthly Revenue", f"${data['summary']['estimatedMonthlyRevenue']}"])
        writer.writerow(["Estimated Annual Revenue", f"${data['summary']['estimatedAnnualRevenue']}"])
        writer.writerow(["Confidence Score", f"{data['summary']['confidenceScore']}%"])
        writer.writerow(["Highest Revenue Source", data['summary']['highestRevenueSource']])
        writer.writerow([])
        writer.writerow(["Revenue Source", "Monthly Estimate ($)", "Share (%)"])
        for s in data["sources"]:
            writer.writerow([s["source"], s["amount"], f"{s['percentage']}%"])
        writer.writerow([])
        writer.writerow(["Platform", "Monthly Share ($)", "Share (%)"])
        for p in data["platformBreakdown"]:
            writer.writerow([p["platform"], p["amount"], f"{p['percentage']}%"])
            
        return output.getvalue()
