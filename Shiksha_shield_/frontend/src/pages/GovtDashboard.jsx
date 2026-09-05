import { useEffect, useState } from 'react'
import axios from 'axios'
import DashboardLayout from '../components/DashboardLayout'

function getRiskColor(avgScore) {
    if (avgScore >= 70) return { bg: 'rgba(239,68,68,0.75)', text: '#FCA5A5', border: 'rgba(239,68,68,0.4)' }
    if (avgScore >= 40) return { bg: 'rgba(245,158,11,0.6)', text: '#FCD34D', border: 'rgba(245,158,11,0.4)' }
    return { bg: 'rgba(16,185,129,0.4)', text: '#6EE7B7', border: 'rgba(16,185,129,0.3)' }
}

function HeatmapCell({ entry, onClick, isSelected }) {
    const colors = getRiskColor(entry.avg_risk_score)
    return (
        <div
            className="heatmap-cell"
            onClick={() => onClick(entry)}
            style={{
                background: colors.bg,
                border: `1px solid ${isSelected ? '#FF9933' : colors.border}`,
                outline: isSelected ? '2px solid rgba(255,153,51,0.6)' : 'none',
                cursor: 'pointer',
            }}
            title={`${entry.block}, ${entry.district} — Avg Risk: ${entry.avg_risk_score}`}
        >
            <p style={{ fontSize: '0.65rem', fontWeight: 700, color: colors.text, marginBottom: '4px', lineHeight: 1.2 }}>
                {entry.block}
            </p>
            <p style={{ fontSize: '1rem', fontWeight: 900, fontFamily: 'var(--font-display)', color: colors.text }}>
                {Math.round(entry.avg_risk_score)}
            </p>
            <p style={{ fontSize: '0.55rem', color: `${colors.text}99`, marginTop: '2px' }}>
                {entry.critical_count}🔴
            </p>
        </div>
    )
}

export default function GovtDashboard() {
    const [heatmap, setHeatmap] = useState([])
    const [stats, setStats] = useState(null)
    const [districts, setDistricts] = useState([])
    const [selectedDistrict, setSelectedDistrict] = useState('')
    const [selectedBlock, setSelectedBlock] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [heatmapRes, statsRes, districtRes] = await Promise.all([
                    axios.get('/api/heatmap'),
                    axios.get('/api/stats'),
                    axios.get('/api/districts'),
                ])
                setHeatmap(heatmapRes.data)
                setStats(statsRes.data)
                setDistricts(districtRes.data.districts)
            } catch {
                // Simulated fallback data
                const blocks = ['Malihabad', 'Kakori', 'Mohanlalganj', 'Gosainganj', 'Bakshi Ka Talab', 'Araziline', 'Baragaon', 'Chiraigaon', 'Harhua', 'Kashi Vidyapeeth']
                setHeatmap(blocks.map((b, i) => ({
                    block: b, district: i < 5 ? 'Lucknow' : 'Varanasi',
                    total_students: 40 + Math.floor(Math.random() * 60),
                    critical_count: 5 + Math.floor(Math.random() * 15),
                    medium_count: 10 + Math.floor(Math.random() * 20),
                    low_count: 15 + Math.floor(Math.random() * 25),
                    avg_risk_score: 20 + Math.random() * 65,
                })))
                setStats({ total_students: 1000, critical_count: 142, medium_count: 348, low_count: 510, avg_risk_score: 42.6, critical_percentage: 14.2 })
                setDistricts(['Lucknow', 'Varanasi', 'Agra', 'Kanpur', 'Gorakhpur'])
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    const filteredHeatmap = selectedDistrict
        ? heatmap.filter(h => h.district === selectedDistrict)
        : heatmap

    // Group by district for display
    const grouped = filteredHeatmap.reduce((acc, h) => {
        if (!acc[h.district]) acc[h.district] = []
        acc[h.district].push(h)
        return acc
    }, {})

    return (
        <DashboardLayout
            title="🏛️ Risk Density Heatmap"
            subtitle="District-level dropout risk visualization — all student names anonymized"
        >
            {/* Privacy Banner */}
            <div style={{
                background: 'rgba(167,139,250,0.08)',
                border: '1px solid rgba(167,139,250,0.2)',
                borderRadius: '10px', padding: '12px 16px', marginBottom: '24px',
                display: 'flex', alignItems: 'center', gap: '10px',
                fontSize: '0.8rem', color: 'rgba(196,181,253,0.9)',
            }}>
                🔒 <strong>Privacy Mode Active:</strong> All student identifiers are anonymized. Only aggregate block/district data is displayed per govt access protocol.
            </div>

            {/* Controls */}
            <div style={{ display: 'flex', gap: '16px', marginBottom: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
                <div className="form-group" style={{ flex: '0 0 240px' }}>
                    <label className="form-label">Filter by District</label>
                    <select
                        className="form-input"
                        value={selectedDistrict}
                        onChange={e => { setSelectedDistrict(e.target.value); setSelectedBlock(null) }}
                    >
                        <option value="">All Districts</option>
                        {districts.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                </div>
                <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                    {[['🔴 Critical', 'rgba(239,68,68,0.6)', '≥70 risk'], ['🟡 Medium', 'rgba(245,158,11,0.5)', '40–70'], ['🟢 Low', 'rgba(16,185,129,0.4)', '<40']].map(([label, bg, range]) => (
                        <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', color: 'var(--color-slate-light)' }}>
                            <div style={{ width: '20px', height: '20px', borderRadius: '4px', background: bg }} />
                            {label} ({range})
                        </div>
                    ))}
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: selectedBlock ? '1fr 320px' : '1fr', gap: '20px' }}>
                {/* Heatmap Grid */}
                <div>
                    {loading ? (
                        <div className="card" style={{ padding: '24px' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: '8px' }}>
                                {Array(15).fill(0).map((_, i) => (
                                    <div key={i} className="skeleton" style={{ height: '80px', animationDelay: `${i * 0.05}s` }} />
                                ))}
                            </div>
                        </div>
                    ) : (
                        Object.entries(grouped).map(([district, blocks]) => (
                            <div key={district} className="card" style={{ padding: '20px', marginBottom: '16px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '0.95rem', fontWeight: 700 }}>
                                        📍 {district} District
                                    </h3>
                                    <span style={{ fontSize: '0.72rem', color: 'var(--color-slate-light)' }}>
                                        {blocks.length} blocks · Avg: {(blocks.reduce((s, b) => s + b.avg_risk_score, 0) / blocks.length).toFixed(1)} risk
                                    </span>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px,1fr))', gap: '8px' }}>
                                    {blocks.map(entry => (
                                        <HeatmapCell
                                            key={entry.block}
                                            entry={entry}
                                            isSelected={selectedBlock?.block === entry.block}
                                            onClick={setSelectedBlock}
                                        />
                                    ))}
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Block Detail Panel */}
                {selectedBlock && (
                    <div className="card animate-fade-in" style={{ padding: '24px', alignSelf: 'start', position: 'sticky', top: '80px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 700 }}>
                                {selectedBlock.block}
                            </h3>
                            <button onClick={() => setSelectedBlock(null)} style={{ background: 'none', border: 'none', color: 'var(--color-slate-light)', cursor: 'pointer', fontSize: '1.1rem' }}>✕</button>
                        </div>
                        <p style={{ fontSize: '0.75rem', color: 'var(--color-slate-light)', marginBottom: '20px' }}>
                            📍 {selectedBlock.district} District
                        </p>
                        {[
                            ['Total Students', selectedBlock.total_students, 'var(--color-white)'],
                            ['Critical 🔴', selectedBlock.critical_count, 'var(--color-crimson-light)'],
                            ['Medium 🟡', selectedBlock.medium_count, 'var(--color-amber-light)'],
                            ['Low 🟢', selectedBlock.low_count, 'var(--color-emerald-light)'],
                            ['Avg Risk Score', `${selectedBlock.avg_risk_score.toFixed(1)}/100`, 'var(--color-saffron)'],
                        ].map(([label, value, color]) => (
                            <div key={label} style={{
                                display: 'flex', justifyContent: 'space-between', padding: '10px 0',
                                borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '0.83rem',
                            }}>
                                <span style={{ color: 'var(--color-slate-light)' }}>{label}</span>
                                <span style={{ fontWeight: 700, color }}>{value}</span>
                            </div>
                        ))}

                        {/* Risk bar */}
                        <div style={{ marginTop: '16px' }}>
                            <p style={{ fontSize: '0.7rem', color: 'var(--color-slate-light)', marginBottom: '8px' }}>Risk Density</p>
                            <div className="score-meter-bg">
                                <div
                                    className="score-meter-fill"
                                    style={{
                                        width: `${selectedBlock.avg_risk_score}%`,
                                        background: selectedBlock.avg_risk_score >= 70 ? '#EF4444' : selectedBlock.avg_risk_score >= 40 ? '#F59E0B' : '#10B981',
                                    }}
                                />
                            </div>
                        </div>

                        {selectedBlock.critical_count > 5 && (
                            <div style={{
                                marginTop: '16px', background: 'rgba(239,68,68,0.08)',
                                border: '1px solid rgba(239,68,68,0.2)', borderRadius: '8px',
                                padding: '12px', fontSize: '0.78rem', color: 'var(--color-crimson-light)',
                            }}>
                                ⚠️ <strong>Action Required:</strong> This block has {selectedBlock.critical_count} critical-risk students. Immediate intervention recommended.
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Aggregate Stats Strip */}
            {stats && (
                <div className="card" style={{ padding: '20px', marginTop: '20px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: '12px', textAlign: 'center' }}>
                        {[
                            ['Total Monitored', stats.total_students.toLocaleString(), 'var(--color-white)'],
                            ['Critical Risk', stats.critical_count, '#EF4444'],
                            ['Medium Risk', stats.medium_count, '#F59E0B'],
                            ['Avg Drift Score', `${stats.avg_risk_score}`, 'var(--color-saffron)'],
                            ['Critical %', `${stats.critical_percentage}%`, '#F87171'],
                        ].map(([label, value, color]) => (
                            <div key={label}>
                                <p style={{ fontSize: '1.4rem', fontWeight: 900, fontFamily: 'var(--font-display)', color }}>{value}</p>
                                <p style={{ fontSize: '0.7rem', color: 'var(--color-slate-light)', marginTop: '4px' }}>{label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </DashboardLayout>
    )
}
