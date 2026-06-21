import os
import shutil
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, status
from sqlalchemy.orm import Session
from typing import List, Optional

from app.database import get_db
from app.models import User, Repository, ScanReport
from app.schemas import RepositoryResponse, ScanReportResponse
from app.auth import get_current_user
from app.tasks import start_scan_job

router = APIRouter(prefix="/repo", tags=["Repository"])

UPLOAD_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/upload", response_model=ScanReportResponse)
def upload_repository(
    name: str = Form(...),
    source_type: str = Form("zip"),  # "zip" or "github"
    github_url: Optional[str] = Form(None),
    file: Optional[UploadFile] = File(None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Check duplicate names for this user
    existing_repo = db.query(Repository).filter(
        Repository.name == name,
        Repository.user_id == current_user.id
    ).first()
    if existing_repo:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Repository with this name already exists"
        )
        
    repo_zip_path = None
    
    if source_type == "zip":
        if not file:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Zip file is required for ZIP upload type"
            )
        # Save file to uploads folder
        file_extension = os.path.splitext(file.filename)[1].lower()
        if file_extension != ".zip":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Only ZIP archives are supported"
            )
        filename = f"{current_user.id}_{name}_{file.filename}"
        repo_zip_path = os.path.join(UPLOAD_DIR, filename)
        try:
            with open(repo_zip_path, "wb") as buffer:
                shutil.copyfileobj(file.file, buffer)
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to save file: {str(e)}"
            )
    elif source_type == "github":
        if not github_url:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="GitHub URL is required for GitHub source type"
            )
        # We simulate GitHub connections by creating a mock scan profile
        repo_zip_path = "MOCK_GITHUB"
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid source type. Use 'zip' or 'github'"
        )

    # Save Repository to DB
    new_repo = Repository(
        name=name,
        owner_name=github_url.split("/")[-2] if github_url and len(github_url.split("/")) >= 2 else current_user.username,
        source_type=source_type,
        zip_path=repo_zip_path,
        user_id=current_user.id
    )
    db.add(new_repo)
    db.commit()
    db.refresh(new_repo)
    
    # Initialize pending ScanReport in DB
    new_report = ScanReport(
        repository_id=new_repo.id,
        status="pending",
        health_score=100
    )
    db.add(new_report)
    db.commit()
    db.refresh(new_report)
    
    # Trigger background scan job
    start_scan_job(db, new_report.id, repo_zip_path)
    
    return new_report

@router.get("/list", response_model=List[RepositoryResponse])
def list_repositories(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    repos = db.query(Repository).filter(Repository.user_id == current_user.id).all()
    return repos

@router.delete("/{id}", status_code=status.HTTP_200_OK)
def delete_repository(
    id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    repo = db.query(Repository).filter(
        Repository.id == id,
        Repository.user_id == current_user.id
    ).first()
    if not repo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Repository not found or access denied"
        )
        
    # Clean up file if it exists
    if repo.zip_path and repo.zip_path != "MOCK_GITHUB" and os.path.exists(repo.zip_path):
        try:
            os.remove(repo.zip_path)
            extracted_folder = repo.zip_path.replace(".zip", "_extracted")
            if os.path.exists(extracted_folder):
                shutil.rmtree(extracted_folder)
        except Exception:
            pass
            
    db.delete(repo)
    db.commit()
    return {"detail": "Repository deleted successfully"}
