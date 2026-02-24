from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import date
from app.database import get_db
from app import models, schemas

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("/", response_model=schemas.DashboardStats)
def get_dashboard(db: Session = Depends(get_db)):
    today = date.today()

    total_employees = db.query(models.Employee).count()
    total_records = db.query(models.Attendance).count()

    present_today = db.query(models.Attendance).filter(
        models.Attendance.date == today,
        models.Attendance.status == models.AttendanceStatus.present,
    ).count()

    absent_today = db.query(models.Attendance).filter(
        models.Attendance.date == today,
        models.Attendance.status == models.AttendanceStatus.absent,
    ).count()

    departments = [
        row[0]
        for row in db.query(models.Employee.department).distinct().all()
    ]

    return schemas.DashboardStats(
        total_employees=total_employees,
        total_attendance_records=total_records,
        present_today=present_today,
        absent_today=absent_today,
        departments=departments,
    )
