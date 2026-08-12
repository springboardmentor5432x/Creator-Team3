from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db

from app.schemas.revenue_schema import (
    SponsorshipCreate,
    SponsorshipResponse,
    AdRevenueCreate,
    AdRevenueResponse,
    EarningsReport,
    RevenueTrend,
    MonetizationAnalytics,
    FinancialInsight,
    PlatformRevenue,
    RevenueSummary
)

from app.services.revenue_service import (
    create_sponsorship,
    get_sponsorships,
    create_ad_revenue,
    get_ad_revenue,
    get_earnings_report,
    get_revenue_trends,
    get_monetization_analytics,
    get_financial_insights,
    update_sponsorship,
    delete_sponsorship,
    update_ad_revenue,
    delete_ad_revenue,
    get_platform_revenue,
    get_revenue_summary
)

router = APIRouter(
    prefix="/revenue",
    tags=["Revenue Analytics"]
)


@router.post(
    "/sponsorships",
    response_model=SponsorshipResponse
)
def add_sponsorship(
    sponsorship: SponsorshipCreate,
    db: Session = Depends(get_db),
):
    return create_sponsorship(
        db,
        sponsorship,
        creator_id=1
    )


@router.get(
    "/sponsorships",
    response_model=list[SponsorshipResponse]
)
def sponsorships(
    db: Session = Depends(get_db),
):
    return get_sponsorships(db)


@router.post(
    "/ad",
    response_model=AdRevenueResponse
)
def add_ad_revenue(
    revenue: AdRevenueCreate,
    db: Session = Depends(get_db),
):
    return create_ad_revenue(
        db,
        revenue,
        creator_id=1
    )


@router.get(
    "/ad",
    response_model=list[AdRevenueResponse]
)
def ad_revenue(
    db: Session = Depends(get_db),
):
    return get_ad_revenue(db)


@router.get(
    "/report",
    response_model=EarningsReport
)
def earnings_report(
    db: Session = Depends(get_db),
):
    return get_earnings_report(db)


@router.get(
    "/trends",
    response_model=list[RevenueTrend]
)
def revenue_trends(
    db: Session = Depends(get_db),
):
    return get_revenue_trends(db)


@router.get(
    "/analytics",
    response_model=MonetizationAnalytics
)
def monetization_analytics(
    db: Session = Depends(get_db),
):
    return get_monetization_analytics(db)


@router.get(
    "/insights",
    response_model=list[FinancialInsight]
)
def financial_insights(
    db: Session = Depends(get_db),
):
    return get_financial_insights(db)

@router.put(
    "/sponsorships/{sponsorship_id}",
    response_model=SponsorshipResponse,
)
def edit_sponsorship(
    sponsorship_id: int,
    sponsorship: SponsorshipCreate,
    db: Session = Depends(get_db),
):
    return update_sponsorship(
        db,
        sponsorship_id,
        sponsorship,
    )

@router.delete("/sponsorships/{sponsorship_id}")
def remove_sponsorship(
    sponsorship_id: int,
    db: Session = Depends(get_db),
):
    return delete_sponsorship(
        db,
        sponsorship_id,
    )

@router.put(
    "/ad/{revenue_id}",
    response_model=AdRevenueResponse,
)
def edit_ad_revenue(
    revenue_id: int,
    revenue: AdRevenueCreate,
    db: Session = Depends(get_db),
):
    return update_ad_revenue(
        db,
        revenue_id,
        revenue,
    )

@router.delete("/ad/{revenue_id}")
def remove_ad_revenue(
    revenue_id: int,
    db: Session = Depends(get_db),
):
    return delete_ad_revenue(
        db,
        revenue_id,
    )
@router.get(
    "/platforms",
    response_model=list[PlatformRevenue]
)
def platform_revenue(
    db: Session = Depends(get_db),
):
    return get_platform_revenue(db)

@router.get(
    "/summary",
    response_model=RevenueSummary,
)
def revenue_summary(
    db: Session = Depends(get_db),
):
    return get_revenue_summary(db)