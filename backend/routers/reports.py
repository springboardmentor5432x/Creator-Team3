from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
import os

from database import get_db
from models import User, ReportHistory
from Auth import verify_token
from services.report_service import ReportService
from services.email_service import EmailService

router = APIRouter(prefix="/api/reports", tags=["Reports"])

@router.get("/history")
def get_report_history(user=Depends(verify_token), db: Session = Depends(get_db)):
    email = user.get("Email")
    db_user = db.query(User).filter(User.Email == email).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
        
    history = db.query(ReportHistory).filter(ReportHistory.user_id == db_user.id).order_by(ReportHistory.generated_date.desc()).all()
    
    return [
        {
            "id": r.id,
            "name": r.report_name,
            "type": r.report_type,
            "format": r.format,
            "period": r.report_period,
            "url": r.file_path,
            "date": r.generated_date.isoformat()
        } for r in history
    ]

@router.post("/generate")
def generate_report(request: dict, background_tasks: BackgroundTasks, user=Depends(verify_token), db: Session = Depends(get_db)):
    email = user.get("Email")
    db_user = db.query(User).filter(User.Email == email).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
        
    period = request.get("period", "Weekly")
    format = request.get("format", "PDF")
    
    # Generate the report synchronously so the user can download it immediately
    history = ReportService.generate_report(db, db_user.id, period, format)
    if not history:
        raise HTTPException(status_code=500, detail="Failed to generate report")
    
    # Mock sending the email in the background
    background_tasks.add_task(
        EmailService.send_report_email, 
        user_email=db_user.Email, 
        report_name=history.report_name, 
        file_path=history.file_path
    )
    
    return {
        "message": f"Successfully generated {period} report in {format} format.",
        "report": {
            "id": history.id,
            "name": history.report_name,
            "type": history.report_type,
            "format": history.format,
            "period": history.report_period,
            "url": history.file_path,
            "date": history.generated_date.isoformat()
        }
    }
