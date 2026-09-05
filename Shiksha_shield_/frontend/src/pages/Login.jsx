import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const ROLES = [
    { id: 'staff', label: 'Staff', icon: '👩‍🏫', hint: 'teacher / staff123' },
    { id: 'institution', label: 'Institution', icon: '🏫', hint: 'principal / school456' },
     { id: 'panchayat', label: 'Panchayat Official', icon: '🏘️', hint: 'panchayat / panchayat123' },
    { id: 'govt', label: 'Govt Official', icon: '🏛️', hint: 'officer / govt789' },
]

const ROLE_CONTEXT = {
    staff: {
        title: 'Teacher & Support Staff',
        subtitle: 'Access the Academic Pulse tracker and student risk analysis tools.',
        fields: [{ label: 'Username', placeholder: 'e.g. teacher', type: 'text' }],
    },
    institution: {
        title: 'Institution Administrator',
        subtitle: 'View school-wide risk distribution and performance analytics.',
        fields: [{ label: 'Principal ID', placeholder: 'e.g. principal', type: 'text' }],
    },
    panchayat: {
    title: 'Panchayat Official',
    subtitle: 'Monitor students in your Panchayat and support timely intervention.',
    fields: [{ label: 'Panchayat ID', placeholder: 'e.g. panchayat', type: 'text' }],
},
    govt: {
        title: 'Government Official',
        subtitle: 'Access the district-level risk density heatmap and regional data.',
        fields: [{ label: 'Officer ID', placeholder: 'e.g. officer', type: 'text' }],
    },
}

export default function Login() {
    const [activeRole, setActiveRole] = useState('staff')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const { login } = useAuth()
    const navigate = useNavigate()

    const ctx = ROLE_CONTEXT[activeRole]

    const handleRoleChange = (role) => {
        setActiveRole(role)
        setError('')
        setUsername('')
        setPassword('')
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        await new Promise(r => setTimeout(r, 600))
        const result = login(activeRole, username, password)
        if (result.success) {
            navigate(`/${activeRole}`)
        } else {
            setError(result.error)
            setLoading(false)
        }
    }

    return (
        <div
            style={{
                minHeight: '100vh',
                background: 'var(--color-navy)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '24px',
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            {/* Background decoration */}
            <div style={{
                position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none',
            }}>
                <div style={{
                    position: 'absolute', top: '-20%', left: '-10%',
                    width: '600px', height: '600px', borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(255,153,51,0.06) 0%, transparent 70%)',
                }} />
                <div style={{
                    position: 'absolute', bottom: '-20%', right: '-10%',
                    width: '500px', height: '500px', borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(16,185,129,0.05) 0%, transparent 70%)',
                }} />
                {/* Subtle grid */}
                <div style={{
                    position: 'absolute', inset: 0,
                    backgroundImage: 'linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)',
                    backgroundSize: '60px 60px',
                }} />
            </div>

            <div style={{ width: '100%', maxWidth: '420px', position: 'relative', zIndex: 1 }}>
                {/* Logo & Brand */}
                <div style={{ textAlign: 'center', marginBottom: '32px' }} className="animate-fade-in-up">
                    <div style={{
                        width: '64px', height: '64px', borderRadius: '16px',
                        background: 'linear-gradient(135deg, var(--color-saffron), var(--color-saffron-dark))',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '2rem', margin: '0 auto 16px',
                        boxShadow: '0 8px 32px rgba(255,153,51,0.3)',
                    }}>
                        🛡️
                    </div>
                    <h1 style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: '2rem', fontWeight: 800,
                        letterSpacing: '-0.03em',
                    }}>
                        <span className="gradient-text">Shiksha</span>{' '}
                        <span style={{ color: 'var(--color-white)' }}>Shield</span>
                    </h1>
                    <p style={{ color: 'var(--color-slate-light)', fontSize: '0.85rem', marginTop: '6px' }}>
                        Academic Pulse — Dropout Prevention System
                    </p>
                </div>

                {/* Login Card */}
                <div
                    className="card card-glow animate-fade-in-up"
                    style={{ padding: '32px', animationDelay: '0.1s' }}
                >
                    {/* Pill Switcher */}
                    <div className="pill-switcher" style={{ marginBottom: '28px' }} role="tablist">
                        {ROLES.map((role) => (
                            <button
                                key={role.id}
                                role="tab"
                                aria-selected={activeRole === role.id}
                                className={`pill-option ${activeRole === role.id ? 'active' : ''}`}
                                onClick={() => handleRoleChange(role.id)}
                                title={role.label}
                            >
                                {role.icon} {role.label}
                            </button>
                        ))}
                    </div>

                    {/* Context Header */}
                    <div style={{ marginBottom: '24px' }}>
                        <h2 style={{
                            fontFamily: 'var(--font-display)',
                            fontSize: '1.1rem', fontWeight: 700,
                            color: 'var(--color-white)', marginBottom: '4px',
                        }}>
                            {ctx.title}
                        </h2>
                        <p style={{ fontSize: '0.8rem', color: 'var(--color-slate-light)', lineHeight: 1.5 }}>
                            {ctx.subtitle}
                        </p>
                    </div>

                    {/* Login Form */}
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div className="form-group">
                            <label className="form-label">{ctx.fields[0].label}</label>
                            <input
                                className="form-input"
                                type={ctx.fields[0].type}
                                placeholder={ctx.fields[0].placeholder}
                                value={username}
                                onChange={e => setUsername(e.target.value)}
                                required
                                autoComplete="username"
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Password</label>
                            <input
                                className="form-input"
                                type="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                required
                                autoComplete="current-password"
                            />
                        </div>

                        {/* Error */}
                        {error && (
                            <div style={{
                                background: 'rgba(239,68,68,0.1)',
                                border: '1px solid rgba(239,68,68,0.3)',
                                borderRadius: '8px',
                                padding: '10px 14px',
                                fontSize: '0.8rem',
                                color: 'var(--color-crimson-light)',
                            }}>
                                ⚠️ {error}
                            </div>
                        )}

                        {/* Demo hint */}
                        <div style={{
                            background: 'rgba(255,153,51,0.06)',
                            border: '1px solid rgba(255,153,51,0.15)',
                            borderRadius: '8px',
                            padding: '10px 14px',
                            fontSize: '0.75rem',
                            color: 'var(--color-slate-light)',
                        }}>
                            <span style={{ color: 'var(--color-saffron)', fontWeight: 600 }}>Demo:</span>{' '}
                            {ROLES.find(r => r.id === activeRole)?.hint}
                        </div>

                        <button
                            className="btn-primary"
                            type="submit"
                            disabled={loading}
                            style={{ width: '100%', justifyContent: 'center', marginTop: '4px' }}
                        >
                            {loading ? (
                                <>
                                    <div style={{
                                        width: '16px', height: '16px', border: '2px solid rgba(10,25,47,0.4)',
                                        borderTopColor: 'var(--color-navy)', borderRadius: '50%',
                                    }} className="animate-spin-slow" />
                                    Authenticating…
                                </>
                            ) : (
                                <>🔐 Access Dashboard</>
                            )}
                        </button>
                    </form>
                </div>

                {/* Footer */}
                <p style={{
                    textAlign: 'center', marginTop: '20px',
                    fontSize: '0.72rem', color: 'rgba(100,116,139,0.6)',
                }}>
                    Shiksha Shield v2.0 · Powered by Academic Pulse Engine
                </p>
            </div>
        </div>
    )
}
