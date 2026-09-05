"""
Shiksha Shield — FastAPI Main Application
Backend for girl-child dropout prevention system.
"""
import asyncio
import uuid
from typing import List, Optional
from collections import Counter

from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from models import (
    StudentInput,
    RiskResponse,
    StudentRecord,
    HeatmapEntry,
    StatsResponse,
)
from scoring import calculate_risk, get_analysis_note
from roadmap import generate_roadmap
from mock_data import MOCK_STUDENTS


# -----------------------------------------------------------
# App Initialization
# -----------------------------------------------------------
app = FastAPI(
    title="Shiksha Shield API",
    description="Heuristic AI Engine for girl-child dropout prevention",
    version="2.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# -----------------------------------------------------------
# Routes
# -----------------------------------------------------------

@app.get("/")
async def root():
    return {"message": "Shiksha Shield API v2.0 — Academic Pulse Engine Active", "status": "ok"}


@app.post("/api/analyze", response_model=RiskResponse)
async def analyze_student(student: StudentInput):
    """
    Core heuristic analysis endpoint.
    Simulates a 2.5s AI processing delay for authentic feel.
    """
    # Simulated AI processing delay
    await asyncio.sleep(2.5)

    risk_score, status, top_3_factors = calculate_risk(
        attendance_score=student.attendance_score,
        academic_score=student.academic_score,
        menstrual_absence=student.menstrual_absence,
        migration_risk=student.migration_risk,
        marriage_risk=student.marriage_risk,
    )

    roadmap = generate_roadmap(
        attendance_score=student.attendance_score,
        academic_score=student.academic_score,
        menstrual_absence=student.menstrual_absence,
        migration_risk=student.migration_risk,
        marriage_risk=student.marriage_risk,
        risk_score=risk_score,
    )

    analysis_note = get_analysis_note(status, top_3_factors)

    return RiskResponse(
        student_id=student.student_id or f"SS{uuid.uuid4().hex[:6].upper()}",
        risk_score=risk_score,
        status=status,
        top_3_factors=top_3_factors,
        roadmap=roadmap if roadmap else None,
        analysis_note=analysis_note,
    )


@app.get("/api/students", response_model=List[StudentRecord])
async def get_students(
    role: Optional[str] = Query("staff", description="User role: staff, institution, govt"),
    district: Optional[str] = Query(None),
    status_filter: Optional[str] = Query(None),
    limit: int = Query(100, le=1000),
):
    """
    Returns student records. Anonymizes names for govt role.
    Supports filtering by district and status.
    """
    students = MOCK_STUDENTS.copy()

    if district:
        students = [s for s in students if s.district.lower() == district.lower()]

    if status_filter:
        students = [s for s in students if s.status.lower() == status_filter.lower()]

    students = students[:limit]

    # Privacy: anonymize for govt role (names already anonymized in mock data)
    if role == "govt":
        result = []
        for s in students:
            anonymized = s.model_copy()
            anonymized.name = f"Student #{s.student_id}"
            result.append(anonymized)
        return result

    return students


@app.get("/api/stats", response_model=StatsResponse)
async def get_stats(district: Optional[str] = Query(None)):
    """
    Returns aggregate statistics for the Institution dashboard.
    """
    students = MOCK_STUDENTS
    if district:
        students = [s for s in students if s.district.lower() == district.lower()]

    total = len(students)
    critical = sum(1 for s in students if s.status == "Critical")
    medium = sum(1 for s in students if s.status == "Medium")
    low = sum(1 for s in students if s.status == "Low")
    avg_risk = round(sum(s.risk_score for s in students) / total, 2) if total > 0 else 0

    # Find top risk factor across all students
    factor_counts = Counter()
    for s in students:
        if s.menstrual_absence:
            factor_counts["Menstrual Absence"] += 1
        if s.migration_risk:
            factor_counts["Migration Risk"] += 1
        if s.marriage_risk:
            factor_counts["Marriage Risk"] += 1
        if s.attendance_score <= 2.5:
            factor_counts["Low Attendance"] += 1
        if s.academic_score <= 2.5:
            factor_counts["Poor Academics"] += 1

    top_factor = factor_counts.most_common(1)[0][0] if factor_counts else "None"

    return StatsResponse(
        total_students=total,
        critical_count=critical,
        medium_count=medium,
        low_count=low,
        top_risk_factor=top_factor,
        avg_risk_score=avg_risk,
        critical_percentage=round((critical / total) * 100, 1) if total > 0 else 0,
    )


@app.get("/api/heatmap", response_model=List[HeatmapEntry])
async def get_heatmap(district: Optional[str] = Query(None)):
    """
    Returns risk density heatmap data grouped by Block/District.
    Used by the Govt Official dashboard.
    """
    students = MOCK_STUDENTS
    if district:
        students = [s for s in students if s.district.lower() == district.lower()]

    # Group by district + block
    groups: dict = {}
    for s in students:
        key = (s.block, s.district)
        if key not in groups:
            groups[key] = []
        groups[key].append(s)

    heatmap = []
    for (block, district_name), group in groups.items():
        total = len(group)
        critical = sum(1 for s in group if s.status == "Critical")
        medium = sum(1 for s in group if s.status == "Medium")
        low = sum(1 for s in group if s.status == "Low")
        avg = round(sum(s.risk_score for s in group) / total, 2)

        heatmap.append(HeatmapEntry(
            block=block,
            district=district_name,
            total_students=total,
            critical_count=critical,
            medium_count=medium,
            low_count=low,
            avg_risk_score=avg,
        ))

    # Sort by avg risk score descending (highest risk first)
    heatmap.sort(key=lambda x: x.avg_risk_score, reverse=True)
    return heatmap


@app.get("/api/districts")
async def get_districts():
    """Returns list of all available districts in the dataset."""
    districts = sorted(set(s.district for s in MOCK_STUDENTS))
    return {"districts": districts}


# -----------------------------------------------------------
# Run directly (development)
# -----------------------------------------------------------
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
