import os
from datetime import datetime
import pandas as pd
from fpdf import FPDF
from sqlalchemy.orm import Session

from models import ReportHistory, User, CreatorProfile, AnalyticsData, Growth, RevenueRecord, ContentLink
from services.email_service import EmailService

REPORTS_DIR = "static/reports"
os.makedirs(REPORTS_DIR, exist_ok=True)

class PDFReport(FPDF):
    def header(self):
        self.set_font("helvetica", "B", 15)
        self.cell(0, 10, "CreatorIQ Performance Report", align="C", new_x="LMARGIN", new_y="NEXT")
        self.ln(10)

    def footer(self):
        self.set_y(-15)
        self.set_font("helvetica", "I", 8)
        self.cell(0, 10, f"Page {self.page_no()}", align="C")

class ReportService:
    @staticmethod
    def generate_report(db: Session, user_id: int, period: str, format: str):
        """
        Generate a report (Weekly, Monthly, etc.) in PDF or Excel format.
        """
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            return None

        report_name = f"{period} Report - {datetime.utcnow().strftime('%Y-%m-%d')}"
        file_prefix = f"{user.id}_{period}_{int(datetime.utcnow().timestamp())}"
        
        # Fetch some mock or actual data for the report
        creators = db.query(CreatorProfile).filter(CreatorProfile.user_id == user_id).all()
        total_followers = sum(c.followers for c in creators)
        
        # Determine paths
        if format.lower() == "pdf":
            file_name = f"{file_prefix}.pdf"
            file_path = os.path.join(REPORTS_DIR, file_name)
            ReportService._build_pdf(user, period, total_followers, file_path)
        else:
            file_name = f"{file_prefix}.xlsx"
            file_path = os.path.join(REPORTS_DIR, file_name)
            ReportService._build_excel(user, period, total_followers, file_path)

        # Save History
        history = ReportHistory(
            user_id=user_id,
            report_name=report_name,
            report_type=period,
            format=format.upper(),
            report_period=f"Generated {datetime.utcnow().strftime('%B %d, %Y')}",
            file_path=f"/static/reports/{file_name}"
        )
        db.add(history)
        db.commit()
        db.refresh(history)

        return history

    @staticmethod
    def _build_pdf(user: User, period: str, followers: int, path: str):
        pdf = PDFReport()
        pdf.add_page()
        
        pdf.set_font("helvetica", "B", 12)
        pdf.cell(0, 10, f"Report Type: {period}", new_x="LMARGIN", new_y="NEXT")
        pdf.cell(0, 10, f"User: {user.Username} ({user.Email})", new_x="LMARGIN", new_y="NEXT")
        pdf.cell(0, 10, f"Total Followers: {followers}", new_x="LMARGIN", new_y="NEXT")
        
        pdf.ln(10)
        pdf.set_font("helvetica", "", 11)
        pdf.multi_cell(0, 10, "This is an automated performance report containing your most important metrics from the selected time period. Keep growing!")
        
        pdf.output(path)

    @staticmethod
    def _build_excel(user: User, period: str, followers: int, path: str):
        data = {
            "Metric": ["User", "Email", "Period", "Total Followers", "Status"],
            "Value": [user.Username, user.Email, period, followers, "Active"]
        }
        df = pd.DataFrame(data)
        df.to_excel(path, index=False)

    @staticmethod
    def send_scheduled_reports(db: Session):
        """
        Called by APScheduler to process any pending scheduled reports.
        """
        # In a real app, query ReportSchedule where next_run_date <= now()
        # For demonstration, we just mock this.
        pass
