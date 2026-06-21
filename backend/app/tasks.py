import json
from concurrent.futures import ThreadPoolExecutor
from sqlalchemy.orm import Session

from app.config import settings
from app.database import SessionLocal
from app.models import ScanReport
from app.analyzer import extract_and_scan_zip

# Thread pool for fallback running if Celery is disabled
executor = ThreadPoolExecutor(max_workers=3)

# Initialize Celery if configured
celery_app = None
if settings.USE_CELERY:
    try:
        from celery import Celery
        celery_app = Celery(
            "reviora_tasks",
            broker=settings.CELERY_BROKER_URL,
            backend=settings.CELERY_RESULT_BACKEND
        )
    except Exception as e:
        print(f"Failed to load Celery, falling back to ThreadPool: {e}")
        celery_app = None

# Celery Task definition
if celery_app:
    @celery_app.task(name="tasks.run_code_scan")
    def run_code_scan_celery(report_id: int, zip_path: str):
        db = SessionLocal()
        try:
            perform_scan_and_save(db, report_id, zip_path)
        finally:
            db.close()

def run_code_scan_sync(report_id: int, zip_path: str):
    db = SessionLocal()
    try:
        perform_scan_and_save(db, report_id, zip_path)
    finally:
        db.close()

def perform_scan_and_save(db: Session, report_id: int, zip_path: str):
    report = db.query(ScanReport).filter(ScanReport.id == report_id).first()
    if not report:
        return

    try:
        # Perform heuristic regex scan
        results = extract_and_scan_zip(zip_path)
        
        # Save results
        report.health_score = results["health_score"]
        report.bug_count = results["bug_count"]
        report.vulnerability_count = results["vulnerability_count"]
        report.smell_count = results["smell_count"]
        report.findings = json.dumps(results["findings"])
        report.generated_docs = json.dumps(results["generated_docs"])
        report.status = "completed"
    except Exception as e:
        report.status = "failed"
        print(f"Scanning failed for report {report_id}: {e}")
        
    db.commit()

def start_scan_job(db: Session, report_id: int, zip_path: str):
    # If Celery is enabled, delegate to celery queue
    if settings.USE_CELERY and celery_app:
        try:
            run_code_scan_celery.delay(report_id, zip_path)
            return
        except Exception as e:
            print(f"Failed to queue celery job, using thread pool fallback: {e}")

    # Fallback: run in background thread pool to prevent blocking FastAPI request
    executor.submit(run_code_scan_sync, report_id, zip_path)
