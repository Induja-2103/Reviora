import json
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Dict, Any

from app.database import get_db
from app.models import User, Repository, ScanReport
from app.schemas import ScanReportResponse
from app.auth import get_current_user

router = APIRouter(prefix="/reports", tags=["Reports & Analytics"])

@router.get("", response_model=List[ScanReportResponse])
def get_reports_list(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Query all reports belonging to the user's repositories
    reports = db.query(ScanReport).join(Repository).filter(
        Repository.user_id == current_user.id
    ).order_by(ScanReport.created_at.desc()).all()
    
    # We parse the findings from JSON string to list for schema serialization
    parsed_reports = []
    for r in reports:
        report_data = {
            "id": r.id,
            "repository_id": r.repository_id,
            "health_score": r.health_score,
            "status": r.status,
            "bug_count": r.bug_count,
            "vulnerability_count": r.vulnerability_count,
            "smell_count": r.smell_count,
            "findings": json.loads(r.findings) if r.findings else [],
            "generated_docs": json.loads(r.generated_docs) if r.generated_docs else {},
            "created_at": r.created_at
        }
        parsed_reports.append(report_data)
        
    return parsed_reports

@router.get("/{id}", response_model=ScanReportResponse)
def get_report_detail(
    id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    report = db.query(ScanReport).join(Repository).filter(
        ScanReport.id == id,
        Repository.user_id == current_user.id
    ).first()
    
    if not report:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Scan report not found or access denied"
        )
        
    return {
        "id": report.id,
        "repository_id": report.repository_id,
        "health_score": report.health_score,
        "status": report.status,
        "bug_count": report.bug_count,
        "vulnerability_count": report.vulnerability_count,
        "smell_count": report.smell_count,
        "findings": json.loads(report.findings) if report.findings else [],
        "generated_docs": json.loads(report.generated_docs) if report.generated_docs else {},
        "created_at": report.created_at
    }
