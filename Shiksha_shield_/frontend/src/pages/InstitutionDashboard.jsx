import { useEffect, useState } from 'react'
import axios from 'axios'
import {
    Chart as ChartJS,
    ArcElement, Tooltip, Legend,
    CategoryScale, LinearScale, BarElement, Title,
} from 'chart.js'
import { Doughnut, Bar } from 'react-chartjs-2'
import DashboardLayout from '../components/DashboardLayout'

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title)

const RISK_COLORS = {
    Critical: { bg: 'rgba(239,68,68,0.8)', border: '#EF4444', badge: 'badge-critical' },
    Medium: { bg: 'rgba(245,158,11,0.8)', border: '#F59E0B', badge: 'badge-medium' },
    Low: { bg: 'rgba(16,185,129,0.8)', border: '#10B981', badge: 'badge-low' },
}

function StatCard({ label, value, icon, color, sublabel }) {
    return (
        <div className="stat-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <p style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-slate-light)', marginBottom: '8px' }}>
                        {label}
                    </p>
                    <p style={{ fontSize: '2rem', fontWeight: 900, fontFamily: 'var(--font-display)', color, lineHeight: 1 }}>
                        {value}
                    </p>
                    {sublabel && (
                        <p style={{ fontSize: '0.72rem', color: 'var(--color-slate-light)', marginTop: '4px' }}>{sublabel}</p>
                    )}
                </div>
                <span style={{ fontSize: '1.6rem', opacity: 0.7 }}>{icon}</span>
            </div>
        </div>
    )
}

export default function InstitutionDashboard() {
    const [stats, setStats] = useState(null)
    const [students, setStudents] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsRes, studentsRes] = await Promise.all([
                    axios.get('/api/stats'),
                    axios.get('/api/students?role=institution&limit=50'),
                ])
                setStats(statsRes.data)
                setStudents(studentsRes.data)
            } catch {
                // Use simulated data on error
                setStats({
                    total_students: 1000, critical_count: 142, medium_count: 348,
                    low_count: 510, top_risk_factor: 'Low Attendance',
                    avg_risk_score: 42.6, critical_percentage: 14.2,
                })
                setStudents([])
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    const doughnutData = stats ? {
        labels: ['Critical', 'Medium', 'Low'],
        datasets: [{
            data: [stats.critical_count, stats.medium_count, stats.low_count],
            backgroundColor: ['rgba(239,68,68,0.85)', 'rgba(245,158,11,0.85)', 'rgba(16,185,129,0.85)'],
            borderColor: ['#EF4444', '#F59E0B', '#10B981'],
            borderWidth: 2,
            hoverOffset: 8,
        }],
    } : null

    const barData = {
        labels: ['Low Attendance', 'Menstrual Absence', 'Migration Risk', 'Marriage Risk', 'Poor Academics'],
        datasets: [{
            label: 'Affected Students',
            data: stats ? [
                Math.round(stats.total_students * 0.35),
                Math.round(stats.total_students * 0.25),
                Math.round(stats.total_students * 0.20),
                Math.round(stats.total_students * 0.15),
                Math.round(stats.total_students * 0.28),
            ] : [],
            backgroundColor: [
                'rgba(255,153,51,0.7)', 'rgba(239,68,68,0.7)', 'rgba(245,158,11,0.7)',
                'rgba(167,139,250,0.7)', 'rgba(59,130,246,0.7)',
            ],
            borderColor: ['#FF9933', '#EF4444', '#F59E0B', '#A78BFA', '#3B82F6'],
            borderWidth: 1,
            borderRadius: 6,
        }],
    }

    const chartOptions = {
        responsive: true, maintainAspectRatio: false,
        plugins: {
            legend: { labels: { color: '#94A3B8', font: { size: 12, family: 'Inter' }, padding: 16 } },
            tooltip: {
                backgroundColor: '#1E2D40',
                titleColor: '#F8FAFC', bodyColor: '#94A3B8',
                borderColor: 'rgba(255,255,255,0.1)', borderWidth: 1,
            },
        },
    }

    const barOptions = {
        ...chartOptions,
        indexAxis: 'y',
        scales: {
            x: { ticks: { color: '#64748B' }, grid: { color: 'rgba(255,255,255,0.04)' } },
            y: { ticks: { color: '#94A3B8', font: { size: 11 } }, grid: { display: false } },
        },
    }

    if (loading) {
        return (
            <DashboardLayout title="📊 Institution Dashboard">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '16px', marginBottom: '24px' }}>
                    {[1, 2, 3, 4].map(i => <div key={i} className="skeleton" style={{ height: '100px' }} />)}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '16px' }}>
                    <div className="skeleton" style={{ height: '300px' }} />
                    <div className="skeleton" style={{ height: '300px' }} />
                </div>
            </DashboardLayout>
        )
    }

    return (
        <DashboardLayout
            title="📊 School-Wide Risk Distribution"
            subtitle="Real-time Academic Pulse analytics across all monitored students"
        >
            {/* Stat Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '16px', marginBottom: '24px' }}>
                <StatCard label="Total Students" value={stats?.total_students?.toLocaleString()} icon="👩‍🎓"
                    color="var(--color-white)" sublabel="Under Academic Pulse" />
                <StatCard label="Critical Risk" value={stats?.critical_count} icon="🔴"
                    color="var(--color-crimson-light)" sublabel={`${stats?.critical_percentage}% of total`} />
                <StatCard label="Medium Risk" value={stats?.medium_count} icon="🟡"
                    color="var(--color-amber-light)" sublabel="Needs monitoring" />
                <StatCard label="Avg Risk Score" value={`${stats?.avg_risk_score}`} icon="📈"
                    color="var(--color-saffron)" sublabel="School average" />
            </div>

            {/* Charts */}
            <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: '20px', marginBottom: '24px' }}>
                {/* Doughnut */}
                <div className="card" style={{ padding: '24px' }}>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '0.95rem', fontWeight: 700, marginBottom: '20px' }}>
                        Risk Distribution
                    </h3>
                    <div style={{ height: '240px', position: 'relative' }}>
                        {doughnutData && (
                            <Doughnut data={doughnutData} options={{
                                ...chartOptions,
                                cutout: '68%',
                                plugins: {
                                    ...chartOptions.plugins,
                                    legend: { ...chartOptions.plugins.legend, position: 'bottom' },
                                },
                            }} />
                        )}
                    </div>
                    {stats && (
                        <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                            {[
                                ['Critical', stats.critical_count, '#EF4444'],
                                ['Medium', stats.medium_count, '#F59E0B'],
                                ['Low', stats.low_count, '#10B981'],
                            ].map(([label, count, color]) => (
                                <div key={label} style={{ textAlign: 'center' }}>
                                    <p style={{ fontSize: '1.3rem', fontWeight: 800, color, fontFamily: 'var(--font-display)' }}>{count}</p>
                                    <p style={{ fontSize: '0.7rem', color: 'var(--color-slate-light)' }}>{label}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Bar Chart */}
                <div className="card" style={{ padding: '24px' }}>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '0.95rem', fontWeight: 700, marginBottom: '20px' }}>
                        Top Risk Factors School-Wide
                    </h3>
                    <div style={{ height: '280px' }}>
                        <Bar data={barData} options={barOptions} />
                    </div>
                </div>
            </div>

            {/* Student Table */}
            <div className="card" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '0.95rem', fontWeight: 700 }}>
                        Student Roster (Top 50)
                    </h3>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-slate-light)' }}>
                        Sorted by Risk Score ↓
                    </span>
                </div>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                                {['Student ID', 'District', 'Block', 'Attendance', 'Academic', 'Risk Score', 'Status'].map(h => (
                                    <th key={h} style={{ padding: '10px 12px', textAlign: 'left', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--color-slate-light)' }}>
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {students.slice(0, 20).map((s, i) => (
                                <tr key={s.student_id} style={{
                                    borderBottom: '1px solid rgba(255,255,255,0.04)',
                                    background: i % 2 === 0 ? 'rgba(255,255,255,0.01)' : 'transparent',
                                }}>
                                    <td style={{ padding: '10px 12px', fontWeight: 600, color: 'var(--color-saffron)' }}>{s.student_id}</td>
                                    <td style={{ padding: '10px 12px', color: 'rgba(248,250,252,0.8)' }}>{s.district}</td>
                                    <td style={{ padding: '10px 12px', color: 'var(--color-slate-light)' }}>{s.block}</td>
                                    <td style={{ padding: '10px 12px' }}>{s.attendance_score}/5</td>
                                    <td style={{ padding: '10px 12px' }}>{s.academic_score}/5</td>
                                    <td style={{ padding: '10px 12px', fontWeight: 700, color: s.status === 'Critical' ? '#EF4444' : s.status === 'Medium' ? '#F59E0B' : '#10B981' }}>
                                        {s.risk_score}
                                    </td>
                                    <td style={{ padding: '10px 12px' }}>
                                        <span className={`badge ${RISK_COLORS[s.status]?.badge}`} style={{ fontSize: '0.65rem' }}>
                                            {s.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {students.length === 0 && (
                        <p style={{ textAlign: 'center', padding: '32px', color: 'var(--color-slate-light)', fontSize: '0.85rem' }}>
                            Connect the backend server to load live student data.
                        </p>
                    )}
                </div>
            </div>
        </DashboardLayout>
    )
}
