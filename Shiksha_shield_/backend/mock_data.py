"""
Mock Data Generator for Shiksha Shield
1,000 anonymized student records for demo/fallback purposes.
"""
import random
from typing import List
from models import StudentRecord
from scoring import calculate_risk

random.seed(42)

DISTRICTS = [
    "Lucknow", "Varanasi", "Agra", "Kanpur", "Gorakhpur",
    "Allahabad", "Meerut", "Bareilly", "Aligarh", "Moradabad"
]

BLOCKS = {
    "Lucknow": ["Malihabad", "Mohanlalganj", "Kakori", "Gosainganj", "Bakshi Ka Talab"],
    "Varanasi": ["Araziline", "Baragaon", "Chiraigaon", "Harhua", "Kashi Vidyapeeth"],
    "Agra": ["Achhnera", "Bah", "Etmadpur", "Fatehabad", "Jagner"],
    "Kanpur": ["Bilhaur", "Chaubepur", "Ghatampur", "Nawabganj", "Sarbananda"],
    "Gorakhpur": ["Bansgaon", "Bhathat", "Campierganj", "Chauri Chaura", "Gola"],
    "Allahabad": ["Bahria", "Chaka", "Handia", "Karchhana", "Manda"],
    "Meerut": ["Daurala", "Hapur", "Kithore", "Mawana", "Sardhna"],
    "Bareilly": ["Aonla", "Bithri Chainpur", "Faridpur", "Mirganj", "Nawabganj"],
    "Aligarh": ["Atrauli", "Bijauli", "Iglas", "Jawan", "Khair"],
    "Moradabad": ["Amroha", "Bilari", "Chandausi", "Hasanpur", "Thakurdwara"],
}


def _generate_student(index: int) -> StudentRecord:
    district = random.choice(DISTRICTS)
    block = random.choice(BLOCKS[district])

    attendance = round(random.uniform(1.0, 5.0), 1)
    academic = round(random.uniform(1.0, 5.0), 1)
    menstrual = random.random() < 0.25
    migration = random.random() < 0.20
    marriage = random.random() < 0.15

    risk_score, status, _ = calculate_risk(attendance, academic, menstrual, migration, marriage)

    return StudentRecord(
        student_id=f"SS{index:05d}",
        name=f"Student #{index:05d}",  # Anonymized by default
        block=block,
        district=district,
        attendance_score=attendance,
        academic_score=academic,
        menstrual_absence=menstrual,
        migration_risk=migration,
        marriage_risk=marriage,
        risk_score=risk_score,
        status=status,
    )


def generate_mock_students(count: int = 1000) -> List[StudentRecord]:
    return [_generate_student(i + 1) for i in range(count)]


# Pre-generate at import time so it's fast on first request
MOCK_STUDENTS: List[StudentRecord] = generate_mock_students(1000)
