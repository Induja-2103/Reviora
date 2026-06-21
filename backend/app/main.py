from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database import engine, Base, SessionLocal
from app.routers import auth, repo, analysis, reports, chat
from app.models import User
from app.auth import get_password_hash
import secrets

# Automatically create tables in database (SQLite auto-migrations)
Base.metadata.create_all(bind=engine)

# Auto-seed default user if not exists
def seed_database():
    db = SessionLocal()
    try:
        demo_user = db.query(User).filter(User.email == "demo@reviora.ai").first()
        if not demo_user:
            hashed_pwd = get_password_hash("demopass123")
            demo_user = User(
                username="demo",
                email="demo@reviora.ai",
                hashed_password=hashed_pwd,
                api_key=f"rev_{secrets.token_hex(16)}"
            )
            db.add(demo_user)
            db.commit()
            print("Demo user (demo@reviora.ai / demopass123) successfully seeded.")
    except Exception as e:
        print(f"Error seeding database: {e}")
    finally:
        db.close()

seed_database()

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Backend API for Reviora AI-Powered Code Review Platform",
    version="1.0.0"
)

# CORS configurations for React Vite frontend connection
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Accept requests from all origins (for local development)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes
app.include_router(auth.router)
app.include_router(repo.router)
app.include_router(analysis.router)
app.include_router(reports.router)
app.include_router(chat.router)

@app.get("/")
def read_root():
    return {
        "status": "healthy",
        "message": "Welcome to the Reviora AI Code Analyzer API. Access documentation at /docs"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
