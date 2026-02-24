from pydantic import BaseModel, EmailStr, field_validator
from typing import Optional, List
from datetime import date, datetime
from enum import Enum


class AttendanceStatus(str, Enum):
    present = "Present"
    absent = "Absent"


# ─── Employee Schemas ────────────────────────────────────────────────────────

class EmployeeCreate(BaseModel):
    employee_id: str
    full_name: str
    email: EmailStr
    department: str

    @field_validator("employee_id", "full_name", "department")
    @classmethod
    def must_not_be_empty(cls, v: str) -> str:
        if not v or not v.strip():
            raise ValueError("Field cannot be empty or whitespace")
        return v.strip()


class EmployeeResponse(BaseModel):
    employee_id: str
    full_name: str
    email: str
    department: str
    created_at: Optional[datetime] = None

    model_config = {"from_attributes": True}


class EmployeeWithStats(EmployeeResponse):
    total_present: int = 0
    total_absent: int = 0
    total_records: int = 0


# ─── Attendance Schemas ───────────────────────────────────────────────────────

class AttendanceCreate(BaseModel):
    employee_id: str
    date: date
    status: AttendanceStatus

    @field_validator("employee_id")
    @classmethod
    def must_not_be_empty(cls, v: str) -> str:
        if not v or not v.strip():
            raise ValueError("Employee ID cannot be empty")
        return v.strip()


class AttendanceResponse(BaseModel):
    id: str
    employee_id: str
    date: date
    status: AttendanceStatus
    created_at: Optional[datetime] = None

    model_config = {"from_attributes": True}


# ─── Utility Schemas ─────────────────────────────────────────────────────────

class ErrorResponse(BaseModel):
    detail: str


class MessageResponse(BaseModel):
    message: str


class DashboardStats(BaseModel):
    total_employees: int
    total_attendance_records: int
    present_today: int
    absent_today: int
    departments: List[str]
