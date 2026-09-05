from pydantic import BaseModel, Field
from typing import List, Optional


class StudentInput(BaseModel):
    student_id: Optional[str] = None
    attendance_score: float = Field(..., ge=1, le=5, description="1=Rarely Attends, 5=Always Present")
    academic_score: float = Field(..., ge=1, le=5, description="1=Very Poor, 5=Excellent")
    menstrual_absence: bool = Field(False, description="True if menstrual-related absences observed")
    migration_risk: bool = Field(False, description="True if family has migrant worker background")
    marriage_risk: bool = Field(False, description="True if early marriage risk identified")


class RoadmapItem(BaseModel):
    month_range: str
    action: str
    responsible: str
    icon: str


class RiskResponse(BaseModel):
    student_id: Optional[str]
    risk_score: float
    status: str  # "Low", "Medium", "Critical"
    top_3_factors: List[str]
    roadmap: Optional[List[RoadmapItem]] = None
    analysis_note: str


class StudentRecord(BaseModel):
    student_id: str
    name: str  # anonymized for govt view
    block: str
    district: str
    attendance_score: float
    academic_score: float
    menstrual_absence: bool
    migration_risk: bool
    marriage_risk: bool
    risk_score: float
    status: str


class HeatmapEntry(BaseModel):
    block: str
    district: str
    total_students: int
    critical_count: int
    medium_count: int
    low_count: int
    avg_risk_score: float


class StatsResponse(BaseModel):
    total_students: int
    critical_count: int
    medium_count: int
    low_count: int
    top_risk_factor: str
    avg_risk_score: float
    critical_percentage: float
