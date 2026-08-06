from sqlalchemy.orm import Session
from sqlalchemy import func

from app.models.revenue import Sponsorship, AdRevenue
from app.schemas.revenue_schema import (
    SponsorshipCreate,
    AdRevenueCreate,
    EarningsReport,
    RevenueTrend,
    MonetizationAnalytics,
    FinancialInsight,
    RevenueSummary
)
from app.schemas.revenue_schema import PlatformRevenue

# -----------------------------
# Sponsorship CRUD
# -----------------------------

def create_sponsorship(
    db: Session,
    sponsorship: SponsorshipCreate,
    creator_id: int,
):
    db_sponsorship = Sponsorship(
        creator_id=creator_id,
        **sponsorship.model_dump()
    )

    db.add(db_sponsorship)
    db.commit()
    db.refresh(db_sponsorship)

    return db_sponsorship


def get_sponsorships(db: Session):
    return db.query(Sponsorship).all()


# -----------------------------
# Ad Revenue CRUD
# -----------------------------

def create_ad_revenue(
    db: Session,
    revenue: AdRevenueCreate,
    creator_id: int,
):
    db_revenue = AdRevenue(
        creator_id=creator_id,
        **revenue.model_dump()
    )

    db.add(db_revenue)
    db.commit()
    db.refresh(db_revenue)

    return db_revenue


def get_ad_revenue(db: Session):
    return db.query(AdRevenue).all()


# -----------------------------
# Earnings Report
# -----------------------------

def get_earnings_report(db: Session):

    sponsorship_income = (
        db.query(func.sum(Sponsorship.amount)).scalar()
        or 0
    )

    ad_income = (
        db.query(func.sum(AdRevenue.revenue)).scalar()
        or 0
    )

    return EarningsReport(
        sponsorship_income=sponsorship_income,
        ad_income=ad_income,
        total_income=sponsorship_income + ad_income,
    )


# -----------------------------
# Revenue Trends
# -----------------------------

def get_revenue_trends(db: Session):

    rows = (
        db.query(
            AdRevenue.month,
            func.sum(AdRevenue.revenue)
        )
        .group_by(AdRevenue.month)
        .order_by(AdRevenue.month)
        .all()
    )

    month_names = {
        1: "Jan",
        2: "Feb",
        3: "Mar",
        4: "Apr",
        5: "May",
        6: "Jun",
        7: "Jul",
        8: "Aug",
        9: "Sep",
        10: "Oct",
        11: "Nov",
        12: "Dec",
    }

    return [
        RevenueTrend(
            month=month_names.get(month, str(month)),
            revenue=total,
        )
        for month, total in rows
    ]


# -----------------------------
# Monetization Analytics
# -----------------------------

def get_monetization_analytics(db: Session):

    sponsorship_income = (
        db.query(func.sum(Sponsorship.amount)).scalar()
        or 0
    )

    ad_income = (
        db.query(func.sum(AdRevenue.revenue)).scalar()
        or 0
    )

    total = sponsorship_income + ad_income

    highest = (
        "Sponsorship"
        if sponsorship_income >= ad_income
        else "Ad Revenue"
    )

    lowest = (
        "Ad Revenue"
        if sponsorship_income >= ad_income
        else "Sponsorship"
    )

    average = total / 2 if total else 0

    return MonetizationAnalytics(
        highest_revenue_source=highest,
        lowest_revenue_source=lowest,
        average_monthly_revenue=round(average, 2),
        total_revenue=round(total, 2),
    )


# -----------------------------
# Financial Insights
# -----------------------------

def get_financial_insights(db: Session):

    report = get_earnings_report(db)

    insights = []

    if report.sponsorship_income > report.ad_income:
        insights.append(
            FinancialInsight(
                insight="Sponsorship is your highest revenue source."
            )
        )
    else:
        insights.append(
            FinancialInsight(
                insight="Ad Revenue is your highest revenue source."
            )
        )

    insights.append(
        FinancialInsight(
            insight=f"Total earnings are ₹{report.total_income:.2f}"
        )
    )

    return insights

from fastapi import HTTPException


def update_sponsorship(
    db: Session,
    sponsorship_id: int,
    sponsorship: SponsorshipCreate,
):
    db_sponsorship = (
        db.query(Sponsorship)
        .filter(Sponsorship.id == sponsorship_id)
        .first()
    )

    if not db_sponsorship:
        raise HTTPException(
            status_code=404,
            detail="Sponsorship not found"
        )

    for key, value in sponsorship.model_dump().items():
        setattr(db_sponsorship, key, value)

    db.commit()
    db.refresh(db_sponsorship)

    return db_sponsorship

def delete_sponsorship(
    db: Session,
    sponsorship_id: int,
):
    db_sponsorship = (
        db.query(Sponsorship)
        .filter(Sponsorship.id == sponsorship_id)
        .first()
    )

    if not db_sponsorship:
        raise HTTPException(
            status_code=404,
            detail="Sponsorship not found"
        )

    db.delete(db_sponsorship)
    db.commit()

    return {
        "message": "Sponsorship deleted successfully"
    }

from fastapi import HTTPException


def update_ad_revenue(
    db: Session,
    revenue_id: int,
    revenue: AdRevenueCreate,
):
    db_revenue = (
        db.query(AdRevenue)
        .filter(AdRevenue.id == revenue_id)
        .first()
    )

    if not db_revenue:
        raise HTTPException(
            status_code=404,
            detail="Ad Revenue not found"
        )

    for key, value in revenue.model_dump().items():
        setattr(db_revenue, key, value)

    db.commit()
    db.refresh(db_revenue)

    return db_revenue

def delete_ad_revenue(
    db: Session,
    revenue_id: int,
):
    db_revenue = (
        db.query(AdRevenue)
        .filter(AdRevenue.id == revenue_id)
        .first()
    )

    if not db_revenue:
        raise HTTPException(
            status_code=404,
            detail="Ad Revenue not found"
        )

    db.delete(db_revenue)
    db.commit()

    return {
        "message": "Ad Revenue deleted successfully"
    }

def get_platform_revenue(db: Session):

    rows = (
        db.query(
            AdRevenue.platform,
            func.sum(AdRevenue.revenue)
        )
        .group_by(AdRevenue.platform)
        .all()
    )

    return [
        PlatformRevenue(
            platform=platform,
            revenue=total
        )
        for platform, total in rows
    ]

def get_revenue_summary(db: Session):

    sponsorships = db.query(Sponsorship).count()

    ads = db.query(AdRevenue).count()

    sponsorship_income = (
        db.query(func.sum(Sponsorship.amount)).scalar()
        or 0
    )

    ad_income = (
        db.query(func.sum(AdRevenue.revenue)).scalar()
        or 0
    )

    return RevenueSummary(
        total_sponsorships=sponsorships,
        total_ad_entries=ads,
        total_revenue=sponsorship_income + ad_income,
    )