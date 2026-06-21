import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Reviora API"
    SECRET_KEY: str = os.getenv("SECRET_KEY", "super_secret_reviora_violet_neon_key_987654321")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days

    # Database: fallback to sqlite if postgres is not provided
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./reviora.db")

    # Redis/Celery configuration
    REDIS_URL: str = os.getenv("REDIS_URL", "redis://localhost:6379/0")
    CELERY_BROKER_URL: str = os.getenv("CELERY_BROKER_URL", "redis://localhost:6379/0")
    CELERY_RESULT_BACKEND: str = os.getenv("CELERY_RESULT_BACKEND", "redis://localhost:6379/0")
    
    # Enable Celery backend scans or run synchronously/thread pool
    USE_CELERY: bool = os.getenv("USE_CELERY", "false").lower() == "true"

    class Config:
        case_sensitive = True

settings = Settings()
