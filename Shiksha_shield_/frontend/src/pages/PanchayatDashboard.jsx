import DashboardLayout from '../components/DashboardLayout'

export default function PanchayatDashboard() {
    return (
        <DashboardLayout
            title="🏘️ Panchayat Student Support Dashboard"
            subtitle="Monitor and support students who need local-level intervention."
        >
            <div className="card" style={{ padding: '24px', marginBottom: '20px' }}>
                <h2 style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.1rem',
                    marginBottom: '10px'
                }}>
                    Welcome, Panchayat Official
                </h2>

                <p style={{
                    color: 'var(--color-slate-light)',
                    fontSize: '0.85rem',
                    lineHeight: 1.6
                }}>
                    This dashboard helps Panchayat officials identify students
                    who may need local support when school-level intervention
                    is not enough.
                </p>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '16px'
            }}>
                <div className="card" style={{ padding: '22px' }}>
                    <div style={{ fontSize: '1.8rem', marginBottom: '8px' }}>👩‍🎓</div>
                    <p style={{ color: 'var(--color-slate-light)', fontSize: '0.75rem' }}>
                        Students Referred
                    </p>
                    <h3 style={{ fontSize: '1.8rem', marginTop: '5px' }}>
                        0
                    </h3>
                </div>

                <div className="card" style={{ padding: '22px' }}>
                    <div style={{ fontSize: '1.8rem', marginBottom: '8px' }}>⚠️</div>
                    <p style={{ color: 'var(--color-slate-light)', fontSize: '0.75rem' }}>
                        High Risk Cases
                    </p>
                    <h3 style={{ fontSize: '1.8rem', marginTop: '5px' }}>
                        0
                    </h3>
                </div>

                <div className="card" style={{ padding: '22px' }}>
                    <div style={{ fontSize: '1.8rem', marginBottom: '8px' }}>🤝</div>
                    <p style={{ color: 'var(--color-slate-light)', fontSize: '0.75rem' }}>
                        Interventions
                    </p>
                    <h3 style={{ fontSize: '1.8rem', marginTop: '5px' }}>
                        0
                    </h3>
                </div>
            </div>
        </DashboardLayout>
    )
}