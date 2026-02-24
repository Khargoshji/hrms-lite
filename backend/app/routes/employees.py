from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List
from app.database import get_db
from app import models, schemas

router = APIRouter(prefix="/employees", tags=["Employees"])


@router.post(
    "/",
    response_model=schemas.EmployeeResponse,
    status_code=status.HTTP_201_CREATED,
    responses={400: {"model": schemas.ErrorResponse}},
)
def create_employee(payload: schemas.EmployeeCreate, db: Session = Depends(get_db)):
    # Duplicate employee_id check
    if db.query(models.Employee).filter(models.Employee.employee_id == payload.employee_id).first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Employee with ID '{payload.employee_id}' already exists.",
        )

    # Duplicate email check
    if db.query(models.Employee).filter(models.Employee.email == payload.email).first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Employee with email '{payload.email}' already exists.",
        )

    employee = models.Employee(
        employee_id=payload.employee_id,
        full_name=payload.full_name,
        email=payload.email,
        department=payload.department,
    )
    db.add(employee)
    db.commit()
    db.refresh(employee)
    return employee


@router.get(
    "/",
    response_model=List[schemas.EmployeeWithStats],
    status_code=status.HTTP_200_OK,
)
def get_all_employees(db: Session = Depends(get_db)):
    employees = db.query(models.Employee).order_by(models.Employee.created_at.desc()).all()

    result = []
    for emp in employees:
        records = emp.attendance
        total_present = sum(1 for r in records if r.status == models.AttendanceStatus.present)
        total_absent = sum(1 for r in records if r.status == models.AttendanceStatus.absent)
        result.append(
            schemas.EmployeeWithStats(
                **schemas.EmployeeResponse.model_validate(emp).model_dump(),
                total_present=total_present,
                total_absent=total_absent,
                total_records=len(records),
            )
        )
    return result


@router.get(
    "/{employee_id}",
    response_model=schemas.EmployeeWithStats,
    responses={404: {"model": schemas.ErrorResponse}},
)
def get_employee(employee_id: str, db: Session = Depends(get_db)):
    emp = db.query(models.Employee).filter(models.Employee.employee_id == employee_id).first()
    if not emp:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Employee '{employee_id}' not found.",
        )
    records = emp.attendance
    total_present = sum(1 for r in records if r.status == models.AttendanceStatus.present)
    total_absent = sum(1 for r in records if r.status == models.AttendanceStatus.absent)
    return schemas.EmployeeWithStats(
        **schemas.EmployeeResponse.model_validate(emp).model_dump(),
        total_present=total_present,
        total_absent=total_absent,
        total_records=len(records),
    )


@router.delete(
    "/{employee_id}",
    response_model=schemas.MessageResponse,
    responses={404: {"model": schemas.ErrorResponse}},
)
def delete_employee(employee_id: str, db: Session = Depends(get_db)):
    emp = db.query(models.Employee).filter(models.Employee.employee_id == employee_id).first()
    if not emp:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Employee '{employee_id}' not found.",
        )
    db.delete(emp)
    db.commit()
    return {"message": f"Employee '{employee_id}' and all associated records deleted successfully."}
