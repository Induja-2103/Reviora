from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List, Dict, Any
from datetime import datetime

# --- User Schemas ---
class UserBase(BaseModel):
    username: str
    email: EmailStr

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class APIKeyUpdate(BaseModel):
    api_key: str

class UserResponse(UserBase):
    id: int
    api_key: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse


# --- Repository Schemas ---
class RepositoryBase(BaseModel):
    name: str
    owner_name: Optional[str] = None
    source_type: str = "zip"  # "github" or "zip"

class RepositoryCreate(RepositoryBase):
    pass

class RepositoryResponse(RepositoryBase):
    id: int
    user_id: int
    created_at: datetime

    class Config:
        from_attributes = True


# --- Scan Findings Schemas ---
class Finding(BaseModel):
    id: str
    file_path: str
    line: int
    severity: str  # "high", "medium", "low"
    type: str  # "bug", "vulnerability", "smell"
    title: str
    description: str
    code_snippet: str
    suggested_fix: str

class ScanReportResponse(BaseModel):
    id: int
    repository_id: int
    health_score: int
    status: str
    bug_count: int
    vulnerability_count: int
    smell_count: int
    findings: Optional[List[Finding]] = None
    generated_docs: Optional[Dict[str, Any]] = None
    created_at: datetime

    class Config:
        from_attributes = True


# --- Chat Schemas ---
class ChatMessageBase(BaseModel):
    content: str
    context_code: Optional[str] = None

class ChatMessageCreate(ChatMessageBase):
    pass

class ChatMessageResponse(BaseModel):
    id: int
    role: str
    content: str
    context_code: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True
