import { useState } from 'react'
import axios from 'axios'
import DashboardLayout from '../components/DashboardLayout'
import RiskScoreCard from '../components/RiskScoreCard'
import RecoveryRoadmap from '../components/RecoveryRoadmap'

const SCORE_LABELS = { 1: 'Very Poor', 2: 'Poor', 3: 'Average', 4: 'Good', 5: 'Excellent' }
const ATTEND_LABELS = { 1: 'Rarely (<40%)', 2: 'Irregular (40–60%)', 3: 'Moderate (60–75%)', 4: 'Regular (75–90%)', 5: 'Consistent (>90%)' }

function SliderField({ label, value, onChange, labelMap, note }) {
    return (
        <div className="form-group">
            <label className="form-label">{label}</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <input
                    type="range" min="1" max="5" step="0.5" value={value}
                    onChange={e => onChange(parseFloat(e.target.value))}
                    className="range-input" style={{ flex: 1 }}
                />
                <span style={{
                    minWidth: '90px', textAlign: 'right',
                    fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-saffron)',
                }}>
                    {value}/5 — {labelMap[Math.round(value)] || ''}
                </span>
            </div>
            {note && <p style={{ fontSize: '0.7rem', color: 'var(--color-slate-light)', marginTop: '4px' }}>{note}</p>}
        </div>
    )
}

function SkeletonLoader() {
    return (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{
                display: 'flex', alignItems: 'center', gap: '16px',
                background: 'rgba(255,153,51,0.05)',
                border: '1px solid rgba(255,153,51,0.15)',
                borderRadius: '12px', padding: '20px',
            }}>
                <div style={{ width: '48px', height: '48px', flexShrink: 0 }} className="animate-spin-slow">
                    <svg viewBox="0 0 48 48" width="48" height="48">
                        <circle cx="24" cy="24" r="18" fill="none" stroke="rgba(255,153,51,0.2)" strokeWidth="4" />
                        <path d="M24 6 A18 18 0 0 1 42 24" fill="none" stroke="var(--color-saffron)" strokeWidth="4" strokeLinecap="round" />
                    </svg>
                </div>
                <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-saffron)', marginBottom: '6px' }}>
                        Academic Pulse Engine Processing…
                    </p>
                    <p style={{ fontSize: '0.78rem', color: 'var(--color-slate-light)' }}>
                        Running heuristic risk analysis across 5 weighted indicators. Please wait…
                    </p>
                </div>
            </div>
            {[140, 80, 100].map((h, i) => (
                <div key={i} className="skeleton" style={{ height: `${h}px`, animationDelay: `${i * 0.15}s` }} />
            ))}
        </div>
    )
}

export default function StaffDashboard() {
    const [form, setForm] = useState({
        attendance_score: 3,
        academic_score: 3,
        menstrual_absence: false,
        migration_risk: false,
        marriage_risk: false,
    })
    const [result, setResult] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleAnalyze = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        setResult(null)
        try {
            const { data } = await axios.post('/api/analyze', form)
            setResult(data)
        } catch (err) {
            setError('Could not connect to the Analysis Engine. Please ensure the backend server is running on port 8000.')
        } finally {
            setLoading(false)
        }
    }

    const riskFlags = [
        { key: 'menstrual_absence', icon: '🩺', label: 'Menstrual-Related Absences', detail: 'Student has missed school due to menstrual health issues' },
        { key: 'migration_risk', icon: '🌉', label: 'Migration Risk', detail: 'Family has a seasonal migration background' },
        { key: 'marriage_risk', icon: '⚠️', label: 'Early Marriage Risk', detail: 'Risk of early marriage has been identified' },
    ]

    return (
        <DashboardLayout
            title="🎯 Student Risk Analysis"
            subtitle="Enter a student's Academic Pulse parameters to calculate their Dropout Drift Score"
        >
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: '24px' }}>

                {/* --- Input Form --- */}
                <form onSubmit={handleAnalyze}>
                    <div className="card" style={{ padding: '28px' }}>
                        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 700, marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            📋 Academic Pulse Parameters
                        </h2>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '24px' }}>
                            <SliderField
                                label="Attendance Score"
                                value={form.attendance_score}
                                onChange={v => setForm(f => ({ ...f, attendance_score: v }))}
                                labelMap={ATTEND_LABELS}
                                note="Weight: 40% of total risk score"
                            />
                            <SliderField
                                label="Academic Performance"
                                value={form.academic_score}
                                onChange={v => setForm(f => ({ ...f, academic_score: v }))}
                                labelMap={SCORE_LABELS}
                                note="Weight: 20% of total risk score"
                            />
                        </div>

                        <p style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-slate-light)', marginBottom: '12px' }}>
                            Risk Flags (Boolean Indicators)
                        </p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '28px' }}>
                            {riskFlags.map(({ key, icon, label, detail }) => (
                                <label key={key} className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        checked={form[key]}
                                        onChange={e => setForm(f => ({ ...f, [key]: e.target.checked }))}
                                    />
                                    <div>
                                        <p style={{ fontSize: '0.85rem', fontWeight: 600 }}>{icon} {label}</p>
                                        <p style={{ fontSize: '0.72rem', color: 'var(--color-slate-light)', marginTop: '2px' }}>{detail}</p>
                                    </div>
                                </label>
                            ))}
                        </div>

                        {/* Weight legend */}
                        <div style={{
                            background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)',
                            borderRadius: '10px', padding: '14px', marginBottom: '20px',
                        }}>
                            <p style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--color-slate-light)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                                Scoring Weights
                            </p>
                            {[['Attendance', '40%'], ['Academic Performance', '20%'], ['Menstrual Absence', '15%'], ['Migration Risk', '15%'], ['Marriage Risk', '10%']].map(([f, w]) => (
                                <div key={f} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', padding: '3px 0', color: 'rgba(248,250,252,0.7)' }}>
                                    <span>{f}</span>
                                    <span style={{ fontWeight: 700, color: 'var(--color-saffron)' }}>{w}</span>
                                </div>
                            ))}
                        </div>

                        <button className="btn-primary" type="submit" disabled={loading} style={{ width: '100%', justifyContent: 'center' }}>
                            {loading ? '⏳ Analysing…' : '🔍 Run Academic Pulse Analysis'}
                        </button>

                        {error && (
                            <div style={{
                                marginTop: '12px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)',
                                borderRadius: '8px', padding: '10px 14px', fontSize: '0.78rem', color: 'var(--color-crimson-light)',
                            }}>
                                ⚠️ {error}
                            </div>
                        )}
                    </div>
                </form>

                {/* --- Results Panel --- */}
                <div>
                    {loading && <SkeletonLoader />}
                    {!loading && !result && (
                        <div style={{
                            height: '100%', minHeight: '300px',
                            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                            background: 'rgba(255,255,255,0.02)', border: '2px dashed rgba(255,255,255,0.08)',
                            borderRadius: '16px', padding: '40px', textAlign: 'center', color: 'var(--color-slate-light)',
                        }}>
                            <div style={{ fontSize: '3rem', marginBottom: '12px', opacity: 0.5 }}>🛡️</div>
                            <p style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '6px' }}>Awaiting Analysis</p>
                            <p style={{ fontSize: '0.78rem' }}>Fill in the parameters and run the Academic Pulse engine to see the Drift Score and Recovery Roadmap.</p>
                        </div>
                    )}
                    {result && (
                        <>
                            <RiskScoreCard result={result} />
                            <RecoveryRoadmap roadmap={result.roadmap} />
                        </>
                    )}
                </div>
            </div>
        </DashboardLayout>
    )
}
