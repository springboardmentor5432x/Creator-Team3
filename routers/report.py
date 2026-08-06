from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from jose import jwt, JWTError
from datetime import datetime, timedelta
from fastapi.responses import FileResponse
from reportlab.pdfgen import canvas

from database import get_db
from models import User, Analytics, ReportHistory
from models import Audience
from Auth import check_role
from openpyxl import Workbook

router = APIRouter(
    prefix="/api/reports",
    tags=["Reports"]
)
SECRET_KEY = "creatoriq_secret_key"
ALGORITHM = "HS256"

security = HTTPBearer()
def verify_token(
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    token = credentials.credentials

    try:
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )
        return payload

    except JWTError:
        raise HTTPException(
            status_code=401,
            detail="Invalid Token"
        )

# -----------------------------
# Generate Report
# -----------------------------
@router.get("/generate")
def generate_report(
    user=Depends(verify_token),
    db: Session = Depends(get_db)
):
    check_role(
        user,
        [
            "creator",
            "marketing team",
            "administrator"
        ]
    )

    email = user.get("Email")

    current_user = db.query(User).filter(
        User.Email == email
    ).first()

    if not current_user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    analytics = db.query(Analytics).filter(
        Analytics.user_id == current_user.id
    ).all()

    if not analytics:
        raise HTTPException(
            status_code=404,
            detail="No analytics data found"
        )

    total_views = sum(item.views or 0 for item in analytics)

    total_followers = analytics[-1].followers if analytics else 0

    total_reach = sum(item.reach or 0 for item in analytics)

    total_impressions = sum(item.impressions or 0 for item in analytics)

    average_engagement = (
        sum(item.engagement_rate or 0 for item in analytics)
        / len(analytics)
    )
    history = ReportHistory(
    user_id=current_user.id,
    report_name="Analytics Report",
    report_type="General",
    report_period="Overall",
    generated_date=datetime.utcnow(),
    download_status=False,
    file_path=""
)
    db.add(history)
    db.commit()
    best_content = max(
    analytics,
    key=lambda x: x.views
)

    return {
        "total_posts": len(analytics),
        "total_views": total_views,
        "total_followers": total_followers,
        "total_reach": total_reach,
        "total_impressions": total_impressions,
        "average_engagement_rate": round(average_engagement, 2),
        "best_content_title": best_content.content_title,
        "best_video_title": best_content.video_title,
        "best_content_views": best_content.views,
        "best_platform": best_content.platform,
    }
@router.get("/weekly")
def weekly_report(
    user=Depends(verify_token),
    db: Session = Depends(get_db)
):

    check_role(
        user,
        [
            "creator",
            "marketing team",
            "administrator"
        ]
    )

    email = user.get("Email")

    current_user = db.query(User).filter(
        User.Email == email
    ).first()

    if not current_user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    last_week = datetime.utcnow() - timedelta(days=7)

    analytics = db.query(Analytics).filter(
        Analytics.user_id == current_user.id,
        Analytics.created_at >= last_week
    ).all()

    if not analytics:
        return {}

    best_content = max(
        analytics,
        key=lambda x: x.views
    )

    return {
        "total_views": sum(a.views or 0 for a in analytics),
        "new_followers": analytics[-1].followers if analytics else 0,
        "engagement_rate": round(
            sum(a.engagement_rate or 0 for a in analytics) / len(analytics),
            2
        ),
        "best_content_title": best_content.content_title,
        "best_video_title": best_content.video_title,
        "best_content_views": best_content.views,
        "best_performing_platform": best_content.platform
    }

@router.get("/monthly")
def monthly_report(
    user=Depends(verify_token),
    db: Session = Depends(get_db)
):

    check_role(
        user,
        [
            "creator",
            "marketing team",
            "administrator"
        ]
    )

    email = user.get("Email")

    current_user = db.query(User).filter(
        User.Email == email
    ).first()

    if not current_user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    last_month = datetime.utcnow() - timedelta(days=30)

    analytics = db.query(Analytics).filter(
        Analytics.user_id == current_user.id,
        Analytics.created_at >= last_month
    ).all()

    if not analytics:
        return {}

    best_content = max(
        analytics,
        key=lambda x: x.views
    )

    return {
        "monthly_views": sum(a.views or 0 for a in analytics),

        "monthly_reach": sum(a.reach or 0 for a in analytics),

        "monthly_followers": analytics[-1].followers,

        "average_engagement": round(
            sum(a.engagement_rate or 0 for a in analytics)
            / len(analytics),
            2
        ),

        "best_content_title": best_content.content_title,

        "best_video_title": best_content.video_title,

        "best_content_views": best_content.views,

        "best_platform": best_content.platform
    }
@router.get("/quarterly")
def quarterly_report(
    user=Depends(verify_token),
    db: Session = Depends(get_db)
):

    check_role(
        user,
        [
            "creator",
            "marketing team",
            "administrator"
        ]
    )

    email = user.get("Email")

    current_user = db.query(User).filter(
        User.Email == email
    ).first()

    if not current_user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    last_quarter = datetime.utcnow() - timedelta(days=90)

    analytics = db.query(Analytics).filter(
        Analytics.user_id == current_user.id,
        Analytics.created_at >= last_quarter
    ).all()

    if not analytics:
        return {}

    best_content = max(
        analytics,
        key=lambda x: x.views
    )

    return {
        "quarter_views": sum(a.views or 0 for a in analytics),

        "quarter_reach": sum(a.reach or 0 for a in analytics),

        "quarter_followers": analytics[-1].followers,

        "average_engagement": round(
            sum(a.engagement_rate or 0 for a in analytics)
            / len(analytics),
            2
        ),

        "best_content_title": best_content.content_title,

        "best_video_title": best_content.video_title,

        "best_content_views": best_content.views,

        "best_platform": best_content.platform
    }
@router.get("/yearly")
def yearly_report(
    user=Depends(verify_token),
    db: Session = Depends(get_db)
):

    check_role(
        user,
        [
            "creator",
            "marketing team",
            "administrator"
        ]
    )

    email = user.get("Email")

    current_user = db.query(User).filter(
        User.Email == email
    ).first()

    if not current_user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    last_year = datetime.utcnow() - timedelta(days=365)

    analytics = db.query(Analytics).filter(
        Analytics.user_id == current_user.id,
        Analytics.created_at >= last_year
    ).all()

    if not analytics:
        return {}

    best_content = max(
        analytics,
        key=lambda x: x.views
    )

    return {
        "yearly_views": sum(a.views or 0 for a in analytics),

        "yearly_reach": sum(a.reach or 0 for a in analytics),

        "yearly_followers": analytics[-1].followers,

        "average_engagement": round(
            sum(a.engagement_rate or 0 for a in analytics)
            / len(analytics),
            2
        ),

        "best_content_title": best_content.content_title,

        "best_video_title": best_content.video_title,

        "best_content_views": best_content.views,

        "best_platform": best_content.platform
    }
@router.get("/download/pdf")
def download_pdf(
    user=Depends(verify_token),
    db: Session = Depends(get_db)
):
    check_role(
        user,
        ["creator", "marketing team", "administrator"]
    )

    email = user.get("Email")

    current_user = db.query(User).filter(
        User.Email == email
    ).first()

    if not current_user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    analytics = db.query(Analytics).filter(
        Analytics.user_id == current_user.id
    ).all()

    file_name = "creator_report.pdf"

    pdf = canvas.Canvas(file_name)

    pdf.setFont("Helvetica-Bold", 16)
    pdf.drawString(50, 800, "CreatorIQ Analytics Report")

    y = 770

    for item in analytics:
        pdf.setFont("Helvetica", 10)

    pdf.drawString(
        50,
        y,
        f"Content : {item.content_title}"
    )

    y -= 20

    pdf.drawString(
        50,
        y,
        f"Video : {item.video_title}"
    )

    y -= 20

    pdf.drawString(
        50,
        y,
        f"Platform : {item.platform}"
    )

    y -= 20

    pdf.drawString(
        50,
        y,
        f"Views : {item.views}   Followers : {item.followers}"
    )

    y -= 20

    pdf.drawString(
        50,
        y,
        f"Reach : {item.reach}   Impressions : {item.impressions}"
    )

    y -= 20

    pdf.drawString(
        50,
        y,
        f"Likes : {item.likes}   Comments : {item.comments}   Shares : {item.shares}"
    )

    y -= 20

    pdf.drawString(
        50,
        y,
        f"Engagement : {item.engagement_rate}%"
    )

    y -= 35

    if y < 80:
        pdf.showPage()
        y = 800
    pdf.save()
    history = db.query(ReportHistory).filter(
        ReportHistory.user_id == current_user.id
).order_by(
    ReportHistory.generated_date.desc()
).first()
    if history:
        history.file_path = file_name
    db.commit()

    return FileResponse(
        file_name,
        media_type="application/pdf",
        filename=file_name
    )
@router.get("/download/excel")
def download_excel(
    user=Depends(verify_token),
    db: Session = Depends(get_db)
):
    check_role(
        user,
        [
            "creator",
            "marketing team",
            "administrator"
        ]
    )

    email = user.get("Email")

    current_user = db.query(User).filter(
        User.Email == email
    ).first()

    if not current_user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    analytics = db.query(Analytics).filter(
        Analytics.user_id == current_user.id
    ).all()

    if not analytics:
        raise HTTPException(
            status_code=404,
            detail="No analytics data found"
        )

    workbook = Workbook()

    sheet = workbook.active
    sheet.title = "Analytics Report"

    sheet.append([
        "Content Title",
        "Video Title",
        "Platform",
        "Followers",
        "Views",
        "Reach",
        "Impressions",
        "Likes",
        "Comments",
        "Shares",
        "Engagement Rate"
    ])

    for item in analytics:
        sheet.append([
            item.content_title,
            item.video_title,
            item.platform,
            item.followers,
            item.views,
            item.reach,
            item.impressions,
            item.likes,
            item.comments,
            item.shares,
            item.engagement_rate
        ])

    file_name = "creator_report.xlsx"

    workbook.save(file_name)

    history = db.query(ReportHistory).filter(
        ReportHistory.user_id == current_user.id
    ).order_by(
        ReportHistory.generated_date.desc()
    ).first()

    if history:
        history.file_path = file_name
        history.download_status = True
        db.commit()

    return FileResponse(
        path=file_name,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        filename=file_name
    )
@router.get("/performance-alerts")
def performance_alerts(
    user=Depends(verify_token),
    db: Session = Depends(get_db)
):

    check_role(
        user,
        [
            "creator",
            "marketing team",
            "administrator"
        ]
    )

    email = user.get("Email")

    current_user = db.query(User).filter(
        User.Email == email
    ).first()
    if not current_user:
        raise HTTPException(
        status_code=404,
        detail="User not found"
    )

    analytics = db.query(Analytics).filter(
        Analytics.user_id == current_user.id
    ).order_by(
        Analytics.views.desc()
    ).first()

    if not analytics:
        return []

    alerts = []

    if analytics.views >= 100000:
        alerts.append("Video crossed 100K views")

    if analytics.followers >= 10000:
        alerts.append("Followers crossed 10K")

    if analytics.engagement_rate >= 10:
        alerts.append("Engagement increased significantly")
    if analytics.likes >= 1000:
        alerts.append("Post crossed 1000 likes")

    if analytics.comments >= 500:
        alerts.append("High audience interaction")

    if analytics.shares >= 100:
        alerts.append("Content shared over 100 times")

    return alerts
@router.get("/revenue")
def revenue_notifications():

    return [
        {
            "title": "Sponsorship Payment",
            "message": "₹15,000 credited"
        },
        {
            "title": "Affiliate Commission",
            "message": "Commission updated"
        },
        {
            "title": "Revenue Milestone",
            "message": "Revenue crossed ₹1,00,000"
        }
    ]
@router.get("/history")
def report_history(
    user=Depends(verify_token),
    db: Session = Depends(get_db)
):

    check_role(
        user,
        [
            "creator",
            "marketing team",
            "administrator"
        ]
    )

    email = user.get("Email")

    current_user = db.query(User).filter(
        User.Email == email
    ).first()

    if not current_user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    reports = db.query(ReportHistory).filter(
        ReportHistory.user_id == current_user.id
    ).order_by(
        ReportHistory.generated_date.desc()
    ).all()

    if not reports:
        raise HTTPException(
            status_code=404,
            detail="No reports found"
        )

    return [
        {
            "id": report.id,
            "report_name": report.report_name,
            "report_type": report.report_type,
            "report_period": report.report_period,
            "generated_date": report.generated_date,
            "download_status": report.download_status,
            "file_path": report.file_path
        }
        for report in reports
    ]
@router.post("/history/{id}/download")
def download_report(
    id: int,
    user=Depends(verify_token),
    db: Session = Depends(get_db)
):

    check_role(
        user,
        [
            "creator",
            "marketing team",
            "administrator"
        ]
    )

    email = user.get("Email")

    current_user = db.query(User).filter(
        User.Email == email
    ).first()

    if not current_user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    report = db.query(ReportHistory).filter(
        ReportHistory.id == id,
        ReportHistory.user_id == current_user.id
    ).first()

    if not report:
        raise HTTPException(
            status_code=404,
            detail="Report not found"
        )

    report.download_status = True

    db.commit()

    return {
        "message": "Download status updated"
    }
@router.get("/schedule")
def scheduled_reports():

   return {
    "Weekly":"Every Monday 9 AM",
    "Monthly":"1st Day of Month",
    "Quarterly":"Every 3 Months",
    "Yearly":"January 1"
}
@router.post("/send-email")
def send_email():

    return {
        "message": "Email notification sent successfully"
    }
# -----------------------------
# Growth Comparison
# -----------------------------
@router.get("/growth-comparison")
def growth_comparison(
    user=Depends(verify_token),
    db: Session = Depends(get_db)
):

    check_role(
        user,
        [
            "creator",
            "marketing team",
            "administrator"
        ]
    )

    email = user.get("Email")

    current_user = db.query(User).filter(
        User.Email == email
    ).first()

    if not current_user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    analytics = db.query(Analytics).filter(
        Analytics.user_id == current_user.id
    ).order_by(
        Analytics.created_at
    ).all()

    if not analytics:
        raise HTTPException(
            status_code=404,
            detail="No analytics data found"
        )

    return [
    {
        "date": item.created_at,
        "content_title": item.content_title,
        "video_title": item.video_title,
        "platform": item.platform,
        "views": item.views,
        "followers": item.followers,
        "reach": item.reach,
        "impressions": item.impressions,
        "likes": item.likes,
        "comments": item.comments,
        "shares": item.shares,
        "engagement_rate": item.engagement_rate
    }
    for item in analytics
]
@router.get("/audience-summary")
def audience_summary(
    user=Depends(verify_token),
    db: Session = Depends(get_db)
):

    check_role(
        user,
        [
            "creator",
            "marketing team",
            "administrator"
        ]
    )

    email = user.get("Email")

    current_user = db.query(User).filter(
        User.Email == email
    ).first()

    if not current_user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    audience = db.query(Audience).filter(
        Audience.user_id == current_user.id
    ).all()

    if not audience:
        raise HTTPException(
            status_code=404,
            detail="No audience data found"
        )
    return {
    "total_records": len(audience),
    "audience": [
        {
            "age_group": item.age_group,
            "gender": item.gender,
            "country": item.country,
            "city": item.city,
            "region": item.region,
            "device": item.device,
            "active_hours": item.active_hours,
            "most_active_days": item.most_active_days,
            "peak_engagement_time": item.peak_engagement_time,
            "activity_trend": item.activity_trend,
            "percentage": item.percentage
        }
        for item in audience
    ]
}