"""
Recovery Roadmap Generator for Shiksha Shield
Maps risk factors to a 6-month intervention plan.
"""
from typing import List
from models import RoadmapItem


ROADMAP_TEMPLATES = {
    "menstrual_absence": [
        RoadmapItem(
            month_range="Month 1–2",
            action="Distribute MHM (Menstrual Hygiene Management) kits. Schedule private counseling sessions with female counselor.",
            responsible="School Health Nurse + Female Teacher",
            icon="🩺",
        ),
        RoadmapItem(
            month_range="Month 2–3",
            action="Conduct MHM awareness workshop. Install sanitary pad vending machine in girls' washroom.",
            responsible="ASHA Worker + School Principal",
            icon="🏫",
        ),
    ],
    "migration_risk": [
        RoadmapItem(
            month_range="Month 2–4",
            action="Enroll student in Bridge Course to compensate for migration-related gaps. Coordinate with Block Education Officer.",
            responsible="Block Resource Coordinator (BRC)",
            icon="🌉",
        ),
        RoadmapItem(
            month_range="Month 4–6",
            action="Set up distance learning materials (textbooks, worksheets). Maintain contact with family during seasonal migration.",
            responsible="Teacher + Block Education Officer",
            icon="📚",
        ),
    ],
    "marriage_risk": [
        RoadmapItem(
            month_range="Month 1–3",
            action="Initiate contact with district NGO partners. File preventive case with DCPO (District Child Protection Officer) if risk is confirmed.",
            responsible="School Principal + DCPO",
            icon="⚖️",
        ),
        RoadmapItem(
            month_range="Month 2–4",
            action="Engage family through Mahila Samakhya / SHG (Self Help Group) counseling. Provide financial aid awareness (Kanya Sumangala Yojana).",
            responsible="NGO Representative + Social Worker",
            icon="🤝",
        ),
        RoadmapItem(
            month_range="Month 3–6",
            action="Conduct follow-up home visits. Monitor school attendance closely and document all interactions.",
            responsible="Teacher + Block Social Worker",
            icon="🏠",
        ),
    ],
    "low_attendance": [
        RoadmapItem(
            month_range="Month 1–6",
            action="Implement daily SMS attendance alerts to parent/guardian. Schedule bi-weekly home visits by class teacher.",
            responsible="Class Teacher + School Admin",
            icon="📲",
        ),
        RoadmapItem(
            month_range="Month 1–3",
            action="Enroll in incentive scheme — provide mid-day meal bonus and stationary kits for 90%+ attendance streaks.",
            responsible="School Principal",
            icon="🎁",
        ),
    ],
    "low_academics": [
        RoadmapItem(
            month_range="Month 2–5",
            action="Assign a peer tutor. Schedule 3x/week remedial classes after school hours focusing on core subjects.",
            responsible="Subject Teacher + Senior Student Mentor",
            icon="📝",
        ),
        RoadmapItem(
            month_range="Month 3–6",
            action="Conduct monthly academic assessment and adjust study plan. Share progress report with parents every 6 weeks.",
            responsible="Class Teacher + Parents",
            icon="📊",
        ),
    ],
}

GENERAL_ROADMAP = [
    RoadmapItem(
        month_range="Month 1–6",
        action="Register student in the 'Academic Pulse' longitudinal monitoring tracker. Review risk score monthly.",
        responsible="Digital Dashboard — School Admin",
        icon="🛡️",
    ),
]


def generate_roadmap(
    attendance_score: float,
    academic_score: float,
    menstrual_absence: bool,
    migration_risk: bool,
    marriage_risk: bool,
    risk_score: float,
) -> List[RoadmapItem]:
    """
    Generates a 6-month Recovery Roadmap only if risk_score > 60.
    Returns an empty list otherwise.
    """
    if risk_score <= 60:
        return []

    roadmap: List[RoadmapItem] = []

    if menstrual_absence:
        roadmap.extend(ROADMAP_TEMPLATES["menstrual_absence"])

    if migration_risk:
        roadmap.extend(ROADMAP_TEMPLATES["migration_risk"])

    if marriage_risk:
        roadmap.extend(ROADMAP_TEMPLATES["marriage_risk"])

    if attendance_score <= 2.5:
        roadmap.extend(ROADMAP_TEMPLATES["low_attendance"])

    if academic_score <= 2.5:
        roadmap.extend(ROADMAP_TEMPLATES["low_academics"])

    # Always add the general monitoring item
    roadmap.extend(GENERAL_ROADMAP)

    return roadmap
