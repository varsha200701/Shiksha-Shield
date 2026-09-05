# 🛡️ Shiksha Shield v2.0

> _A "Physician's Third Hand" for preventing girl-child school dropouts through longitudinal Academic Pulse tracking._

---

## 🚀 Quick Start

> You need **Python 3.10+** and **Node.js 18+** installed.

### Step 1 — Start the Backend (Terminal 1)
```powershell
.\start-backend.ps1
```
FastAPI runs at **http://localhost:8000** · API docs at **http://localhost:8000/docs**

### Step 2 — Start the Frontend (Terminal 2)
```powershell
.\start-frontend.ps1
```
React app opens at **http://localhost:5173**

---

## 🔐 Demo Login Credentials

| Role | Username | Password |
|---|---|---|
| 👩‍🏫 Staff | `teacher` | `staff123` |
| 🏫 Institution | `principal` | `school456` |
| 🏛️ Govt Official | `officer` | `govt789` |

---

## 🗂️ Project Structure

```
Shiksha_shield_/
├── backend/
│   ├── main.py           # FastAPI app — all routes
│   ├── models.py         # Pydantic data models
│   ├── scoring.py        # Heuristic AI engine (weighted scoring)
│   ├── roadmap.py        # 6-Month recovery roadmap generator
│   ├── mock_data.py      # 1,000 anonymized student records
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx                          # Router + RBAC routes
│   │   ├── index.css                        # Tailwind v4 @theme + components
│   │   ├── context/AuthContext.jsx          # Role auth state
│   │   ├── components/
│   │   │   ├── DashboardLayout.jsx          # Shared nav + layout
│   │   │   ├── ProtectedRoute.jsx           # RBAC guard
│   │   │   ├── RiskScoreCard.jsx            # SVG gauge + factor list
│   │   │   └── RecoveryRoadmap.jsx          # 6-month timeline
│   │   └── pages/
│   │       ├── Login.jsx                    # Pill Switcher login
│   │       ├── StaffDashboard.jsx           # Form → API → results
│   │       ├── InstitutionDashboard.jsx     # Chart.js analytics
│   │       └── GovtDashboard.jsx            # Heatmap + anonymization
│   ├── package.json
│   └── vite.config.js
│
├── start-backend.ps1
└── start-frontend.ps1
```

---

## 🧠 Heuristic Scoring Engine

| Factor | Weight | Type |
|---|---|---|
| Attendance | **40%** | Score 1–5 (inverted) |
| Academic Performance | **20%** | Score 1–5 (inverted) |
| Menstrual Absence | **15%** | Boolean |
| Migration Risk | **15%** | Boolean |
| Marriage Risk | **10%** | Boolean |

**Thresholds:** `< 40` = Low · `40–70` = Medium · `> 70` = Critical

**Recovery Roadmap** auto-generates if `risk_score > 60`.

---

## 🔒 Security & Privacy

- **Govt view** — all student names anonymized to `Student #XXXXX`
- **Mock data fallback** — 1,000 records loaded if DB unavailable
- **RBAC** — each role can only access its own dashboard
