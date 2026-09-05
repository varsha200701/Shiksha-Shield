import { useEffect, useRef } from 'react'

const STATUS_COLORS = {
    Critical: { fill: '#EF4444', glow: 'rgba(239,68,68,0.25)', badge: 'badge-critical' },
    Medium: { fill: '#F59E0B', glow: 'rgba(245,158,11,0.25)', badge: 'badge-medium' },
    Low: { fill: '#10B981', glow: 'rgba(16,185,129,0.25)', badge: 'badge-low' },
}

function GaugeArc({ score }) {
    const radius = 58
    const circumference = 2 * Math.PI * radius
    const startOffset = circumference * 0.25
    const visibleArc = circumference * 0.75
    const progress = (score / 100) * visibleArc
    const dashoffset = circumference - startOffset - progress

    const color = score >= 70 ? '#EF4444' : score >= 40 ? '#F59E0B' : '#10B981'

    return (
        <svg width="140" height="140" viewBox="0 0 140 140">
            {/* Track */}
            <circle
                cx="70" cy="70" r={radius}
                fill="none"
                stroke="rgba(255,255,255,0.06)"
                strokeWidth="10"
                strokeDasharray={`${visibleArc} ${circumference - visibleArc}`}
                strokeDashoffset={-startOffset}
                strokeLinecap="round"
                transform="rotate(135 70 70)"
            />
            {/* Progress */}
            <circle
                cx="70" cy="70" r={radius}
                fill="none"
                stroke={color}
                strokeWidth="10"
                strokeDasharray={`${progress} ${circumference - progress}`}
                strokeDashoffset={-startOffset}
                strokeLinecap="round"
                transform="rotate(135 70 70)"
                style={{ filter: `drop-shadow(0 0 8px ${color})` }}
            />
        </svg>
    )
}

export default function RiskScoreCard({ result }) {
    const { risk_score, status, top_3_factors, analysis_note, student_id } = result
    const colors = STATUS_COLORS[status] || STATUS_COLORS.Low

    return (
        <div
            className={`card card-${status.toLowerCase()} animate-fade-in-up`}
            style={{ padding: '28px' }}
        >
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                    <p style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em', color: 'var(--color-slate-light)', textTransform: 'uppercase', marginBottom: '4px' }}>
                        Academic Drift Score
                    </p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--color-slate-light)' }}>
                        ID: <span style={{ color: 'var(--color-saffron)', fontWeight: 600 }}>{student_id}</span>
                    </p>
                </div>
                <span className={`badge ${colors.badge}`}>
                    {status === 'Critical' ? '🔴' : status === 'Medium' ? '🟡' : '🟢'} {status}
                </span>
            </div>

            {/* Score Display */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '24px' }}>
                <div style={{ position: 'relative', flexShrink: 0 }}>
                    <GaugeArc score={risk_score} />
                    <div style={{
                        position: 'absolute', inset: 0,
                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    }}>
                        <span style={{
                            fontSize: '2rem', fontWeight: 900,
                            fontFamily: 'var(--font-display)',
                            color: colors.fill,
                            lineHeight: 1,
                        }}>
                            {Math.round(risk_score)}
                        </span>
                        <span style={{ fontSize: '0.65rem', color: 'var(--color-slate-light)', fontWeight: 600 }}>/ 100</span>
                    </div>
                </div>

                {/* Score Bar */}
                <div style={{ flex: 1 }}>
                    <div style={{ marginBottom: '8px', display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--color-slate-light)' }}>Risk Level</span>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: colors.fill }}>{risk_score.toFixed(1)}%</span>
                    </div>
                    <div className="score-meter-bg">
                        <div
                            className="score-meter-fill"
                            style={{
                                width: `${risk_score}%`,
                                background: `linear-gradient(90deg, ${colors.fill}, ${colors.fill}cc)`,
                            }}
                        />
                    </div>
                    <div style={{
                        display: 'flex', justifyContent: 'space-between', marginTop: '6px',
                        fontSize: '0.65rem', color: 'rgba(100,116,139,0.6)',
                    }}>
                        <span>Low</span><span>Medium</span><span>Critical</span>
                    </div>
                </div>
            </div>

            {/* Top 3 Factors */}
            <div style={{ marginBottom: '16px' }}>
                <p style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.08em', color: 'var(--color-slate-light)', textTransform: 'uppercase', marginBottom: '10px' }}>
                    Top Risk Factors
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {top_3_factors.map((factor, i) => (
                        <div
                            key={i}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '10px',
                                background: 'rgba(255,255,255,0.03)',
                                borderRadius: '8px', padding: '8px 12px',
                                border: '1px solid rgba(255,255,255,0.06)',
                                fontSize: '0.82rem',
                            }}
                        >
                            <span style={{
                                width: '20px', height: '20px', borderRadius: '50%',
                                background: `rgba(${i === 0 ? '239,68,68' : i === 1 ? '245,158,11' : '100,116,139'},0.15)`,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '0.65rem', fontWeight: 800,
                                color: i === 0 ? 'var(--color-crimson-light)' : i === 1 ? 'var(--color-amber-light)' : 'var(--color-slate-light)',
                                flexShrink: 0,
                            }}>
                                {i + 1}
                            </span>
                            {factor}
                        </div>
                    ))}
                </div>
            </div>

            {/* Analysis Note */}
            <div style={{
                background: `linear-gradient(135deg, rgba(${status === 'Critical' ? '239,68,68' : status === 'Medium' ? '245,158,11' : '16,185,129'},0.08), rgba(30,45,64,0.5))`,
                border: `1px solid rgba(${status === 'Critical' ? '239,68,68' : status === 'Medium' ? '245,158,11' : '16,185,129'},0.2)`,
                borderRadius: '10px', padding: '14px',
                fontSize: '0.8rem', lineHeight: 1.6,
                color: 'var(--color-slate-light)',
            }}>
                <span style={{ fontWeight: 700, color: colors.fill }}>AI Analysis: </span>
                {analysis_note}
            </div>
        </div>
    )
}
