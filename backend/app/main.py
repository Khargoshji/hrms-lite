# =============================================================================
# HRMS Lite — Human Resource Management System
# Copyright (c) 2025 Kiran Yadav. All rights reserved.
# Licensed under the MIT License — see LICENSE for details.
# =============================================================================

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.routes import employees, attendance, dashboard

# Create all tables on startup
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="HRMS Lite API",
    description="A lightweight Human Resource Management System REST API",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# ─── CORS ────────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],          # restrict to your frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Routers ─────────────────────────────────────────────────────────────────
app.include_router(employees.router)
app.include_router(attendance.router)
app.include_router(dashboard.router)


@app.get("/", tags=["Health"])
def root():
    return {"status": "ok", "message": "HRMS Lite API is running 🚀"}


@app.get("/health", tags=["Health"])
def health():
    return {"status": "healthy"}
