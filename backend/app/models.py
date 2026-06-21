from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    api_key = Column(String(255), unique=True, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    repositories = relationship("Repository", back_populates="owner")
    chat_messages = relationship("ChatMessage", back_populates="user")


class Repository(Base):
    __tablename__ = "repositories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    owner_name = Column(String(100), nullable=True)  # GitHub owner or username
    source_type = Column(String(20), default="zip")  # "github" or "zip"
    zip_path = Column(String(255), nullable=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    owner = relationship("User", back_populates="repositories")
    reports = relationship("ScanReport", back_populates="repository", cascade="all, delete-orphan")


class ScanReport(Base):
    __tablename__ = "scan_reports"

    id = Column(Integer, primary_key=True, index=True)
    repository_id = Column(Integer, ForeignKey("repositories.id", ondelete="CASCADE"), nullable=False)
    health_score = Column(Integer, default=100)
    status = Column(String(20), default="pending")  # "pending", "completed", "failed"
    bug_count = Column(Integer, default=0)
    vulnerability_count = Column(Integer, default=0)
    smell_count = Column(Integer, default=0)
    performance_count = Column(Integer, default=0)
    best_practice_count = Column(Integer, default=0)
    coverage_count = Column(Integer, default=0)
    findings = Column(Text, nullable=True)  # JSON String of findings list
    generated_docs = Column(Text, nullable=True)  # JSON String of generated docs summary
    created_at = Column(DateTime, default=datetime.utcnow)

    repository = relationship("Repository", back_populates="reports")


class ChatMessage(Base):
    __tablename__ = "chat_messages"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    role = Column(String(20), nullable=False)  # "user" or "assistant"
    content = Column(Text, nullable=False)
    context_code = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="chat_messages")
