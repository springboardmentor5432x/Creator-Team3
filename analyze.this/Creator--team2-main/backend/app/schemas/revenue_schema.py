from datetime import date
from pydantic import BaseModel


# ---------- Sponsorship ----------

class SponsorshipCreate(BaseModel):
    brand_name: str
    campaign_name: str
    platform: str
    amount: float
    status: str
    start_date: date
    end_date: date


class SponsorshipResponse(SponsorshipCreate):
    id: int

    class Config:
        from_attributes = True


# ---------- Ad Revenue ----------

class AdRevenueCreate(BaseModel):
    platform: str
    revenue: float
    month: int
    year: int


class AdRevenueResponse(AdRevenueCreate):
    id: int

    class Config:
        from_attributes = True


# ---------- Earnings Report ----------

class EarningsReport(BaseModel):
    sponsorship_income: float
    ad_income: float
    total_income: float


# ---------- Revenue Trend ----------

class RevenueTrend(BaseModel):
    month: str
    revenue: float


# ---------- Monetization Analytics ----------

class MonetizationAnalytics(BaseModel):
    highest_revenue_source: str
    lowest_revenue_source: str
    average_monthly_revenue: float
    total_revenue: float


# ---------- Financial Insights ----------

class FinancialInsight(BaseModel):
    insight: str

class PlatformRevenue(BaseModel):
    platform: str
    revenue: float

class RevenueSummary(BaseModel):
    total_sponsorships: int
    total_ad_entries: int
    total_revenue: float