from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional, List, Dict, Any

from app.database import get_db
from app.models import User, ScanReport
from app.auth import get_current_user
from app.analyzer import scan_code_content, generate_docs_from_findings

router = APIRouter(prefix="/analysis", tags=["Code Analysis"])

class SnippetScanRequest(BaseModel):
    code: str
    language: Optional[str] = "python"
    filename: Optional[str] = "main.py"

@router.post("/bug-detection")
def scan_bugs(request: SnippetScanRequest, current_user: User = Depends(get_current_user)):
    findings = scan_code_content(request.filename, request.code)
    bugs = [f for f in findings if f["type"] == "bug"]
    return {
        "bug_count": len(bugs),
        "findings": bugs
    }

@router.post("/vulnerability-detection")
def scan_vulnerabilities(request: SnippetScanRequest, current_user: User = Depends(get_current_user)):
    findings = scan_code_content(request.filename, request.code)
    vulns = [f for f in findings if f["type"] == "vulnerability"]
    return {
        "vulnerability_count": len(vulns),
        "findings": vulns
    }

@router.post("/code-smell-detection")
def scan_code_smells(request: SnippetScanRequest, current_user: User = Depends(get_current_user)):
    findings = scan_code_content(request.filename, request.code)
    smells = [f for f in findings if f["type"] == "smell"]
    return {
        "smell_count": len(smells),
        "findings": smells
    }

@router.post("/generate-docs")
def generate_docs(request: SnippetScanRequest, current_user: User = Depends(get_current_user)):
    findings = scan_code_content(request.filename, request.code)
    docs = generate_docs_from_findings(findings, scanned_files=1)
    return {
        "readme": docs["readme"],
        "api_docs": docs["api_docs"]
    }
