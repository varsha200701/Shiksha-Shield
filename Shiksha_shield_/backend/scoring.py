"""
Heuristic AI Scoring Engine for Shiksha Shield
Calculates Academic Drift risk score using weighted factors.
"""
from typing import List, Tuple


# --- Weights (must sum to 1.0) ---
WEIGHTS = {
    "attendance": 0.40,
    "academic_performance": 0.20,
    "menstrual_absence": 0.15,
    "migration_risk": 0.15,
    "marriage_risk": 0.10,
}

# Thresholds for status classification
CRITICAL_THRESHOLD = 70.0
MEDIUM_THRESHOLD = 40.0


def normalize_score_to_risk(score: float) -> float:
    """
    Inverts a 1-5 score to a 0-1 risk value.
    Score 1 (worst) → risk 1.0, Score 5 (best) → risk 0.0
    """
    return (5.0 - score) / 4.0


def calculate_risk(
    attendance_score: float,
    academic_score: float,
    menstrual_absence: bool,
    migration_risk: bool,
    marriage_risk: bool,
) -> Tuple[float, str, List[str]]:
    """
    Calculates the Academic Drift risk score.
    Returns: (risk_score_0_to_100, status, top_3_factors)
    """
    # Convert each factor to a 0–1 risk contribution
    factors = {
        "Low Attendance": normalize_score_to_risk(attendance_score) * WEIGHTS["attendance"],
        "Poor Academic Performance": normalize_score_to_risk(academic_score) * WEIGHTS["academic_performance"],
        "Menstrual-Related Absences": (1.0 if menstrual_absence else 0.0) * WEIGHTS["menstrual_absence"],
        "Migration Risk": (1.0 if migration_risk else 0.0) * WEIGHTS["migration_risk"],
        "Early Marriage Risk": (1.0 if marriage_risk else 0.0) * WEIGHTS["marriage_risk"],
    }

    # Total weighted risk (0–1 scale)
    raw_score = sum(factors.values())

    # Scale to 0–100
    risk_score = round(raw_score * 100, 2)

    # Clamp to [0, 100]
    risk_score = max(0.0, min(100.0, risk_score))

    # Determine status
    if risk_score >= CRITICAL_THRESHOLD:
        status = "Critical"
    elif risk_score >= MEDIUM_THRESHOLD:
        status = "Medium"
    else:
        status = "Low"

    # Top 3 factors by contribution
    sorted_factors = sorted(factors.items(), key=lambda x: x[1], reverse=True)
    top_3_factors = [f for f, v in sorted_factors[:3] if v > 0]
    if not top_3_factors:
        top_3_factors = ["No significant risk factors identified"]

    return risk_score, status, top_3_factors


def get_analysis_note(status: str, top_factors: List[str]) -> str:
    """Generates a human-readable analysis note."""
    if status == "Critical":
        return (
            f"ALERT: This student is at critical risk of dropout. "
            f"Immediate intervention is required. Primary concerns: {', '.join(top_factors[:2])}."
        )
    elif status == "Medium":
        return (
            f"WARNING: This student shows moderate drift signals. "
            f"Proactive monitoring and support recommended. Key factor: {top_factors[0] if top_factors else 'attendance'}."
        )
    else:
        return (
            "STABLE: This student shows healthy academic engagement. "
            "Continue routine monitoring as part of the Academic Pulse protocol."
        )
