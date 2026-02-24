from sqlalchemy import Column, String, Date, Enum, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base
import enum


class AttendanceStatus(str, enum.Enum):
    present = "Present"
    absent = "Absent"


class Employee(Base):
    __tablename__ = "employees"

    employee_id = Column(String(50), primary_key=True, index=True)
    full_name = Column(String(100), nullable=False)
    email = Column(String(150), unique=True, nullable=False, index=True)
    department = Column(String(100), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    attendance = relationship(
        "Attendance", back_populates="employee", cascade="all, delete-orphan"
    )


class Attendance(Base):
    __tablename__ = "attendance"

    id = Column(String(36), primary_key=True, index=True)
    employee_id = Column(
        String(50), ForeignKey("employees.employee_id", ondelete="CASCADE"), nullable=False
    )
    date = Column(Date, nullable=False)
    status = Column(Enum(AttendanceStatus), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    employee = relationship("Employee", back_populates="attendance")
