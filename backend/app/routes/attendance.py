import uuid
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import date
from app.database import get_db
from app import models, schemas

router = APIRouter(prefix="/attendance", tags=["Attendance"])


@router.post(
    "/",
    response_model=schemas.AttendanceResponse,
    status_code=status.HTTP_201_CREATED,
    responses={400: {"model": schemas.ErrorResponse}, 404: {"model": schemas.ErrorResponse}},
)
def mark_attendance(payload: schemas.AttendanceCreate, db: Session = Depends(get_db)):
    # Verify employee exists
    emp = db.query(models.Employee).filter(
        models.Employee.employee_id == payload.employee_id
    ).first()
    if not emp:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Employee '{payload.employee_id}' not found.",
        )

    # Prevent duplicate attendance for same date
    existing = db.query(models.Attendance).filter(
        models.Attendance.employee_id == payload.employee_id,
        models.Attendance.date == payload.date,
    ).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Attendance for employee '{payload.employee_id}' on {payload.date} already recorded.",
        )

    record = models.Attendance(
        id=str(uuid.uuid4()),
        employee_id=payload.employee_id,
        date=payload.date,
        status=payload.status,
    )
    db.add(record)
    db.commit()
    db.refresh(record)
    return record


@router.get(
    "/{employee_id}",
    response_model=List[schemas.AttendanceResponse],
    responses={404: {"model": schemas.ErrorResponse}},
)
def get_attendance(
    employee_id: str,
    db: Session = Depends(get_db),
    from_date: Optional[date] = Query(None, description="Filter from date (YYYY-MM-DD)"),
    to_date: Optional[date] = Query(None, description="Filter to date (YYYY-MM-DD)"),
    status_filter: Optional[schemas.AttendanceStatus] = Query(None, alias="status"),
):
    # Verify employee exists
    emp = db.query(models.Employee).filter(
        models.Employee.employee_id == employee_id
    ).first()
    if not emp:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Employee '{employee_id}' not found.",
        )

    query = db.query(models.Attendance).filter(
        models.Attendance.employee_id == employee_id
    )

    if from_date:
        query = query.filter(models.Attendance.date >= from_date)
    if to_date:
        query = query.filter(models.Attendance.date <= to_date)
    if status_filter:
        query = query.filter(models.Attendance.status == status_filter)

    records = query.order_by(models.Attendance.date.desc()).all()
    return records


@router.delete(
    "/{attendance_id}",
    response_model=schemas.MessageResponse,
    responses={404: {"model": schemas.ErrorResponse}},
)
def delete_attendance(attendance_id: str, db: Session = Depends(get_db)):
    record = db.query(models.Attendance).filter(
        models.Attendance.id == attendance_id
    ).first()
    if not record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Attendance record '{attendance_id}' not found.",
        )
    db.delete(record)
    db.commit()
    return {"message": "Attendance record deleted successfully."}
