import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const ROLE_CONFIG = {
    staff: { icon: '👩‍🏫', label: 'Staff Portal', color: 'var(--color-saffron)' },
    institution: { icon: '🏫', label: 'Institution Admin', color: 'var(--color-emerald)' },
    panchayat: {icon: '🏘️', label: 'Panchayat Official', color: 'var(--color-amber)'},
    govt: { icon: '🏛️', label: 'Govt Dashboard', color: 'var(--color-amber)' },
}

export default function DashboardLayout({ children, title, subtitle }) {
    const { user, logout } = useAuth()
    const navigate = useNavigate()
    const cfg = ROLE_CONFIG[user?.role] || ROLE_CONFIG.staff

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    return (
        <div style={{ minHeight: '100vh', background: 'var(--color-navy)', display: 'flex', flexDirection: 'column' }}>
            {/* Top Nav Bar */}
            <header style={{
                background: 'rgba(17,34,64,0.9)',
                backdropFilter: 'blur(12px)',
                borderBottom: '1px solid rgba(255,255,255,0.07)',
                position: 'sticky', top: 0, zIndex: 100,
                padding: '0 24px',
            }}>
                <div style={{
                    maxWidth: '1280px', margin: '0 auto',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    height: '60px',
                }}>
                    {/* Brand */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                            width: '36px', height: '36px', borderRadius: '10px',
                            background: 'linear-gradient(135deg, var(--color-saffron), var(--color-saffron-dark))',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem',
                        }}>🛡️</div>
                        <div>
                            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1rem' }}>
                                <span className="gradient-text">Shiksha</span> Shield
                            </span>
                            <span style={{
                                marginLeft: '10px',
                                background: 'rgba(255,255,255,0.07)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '100px', padding: '2px 10px',
                                fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.06em',
                                color: cfg.color, textTransform: 'uppercase',
                            }}>
                                {cfg.icon} {user?.role}
                            </span>
                        </div>
                    </div>

                    {/* User info + logout */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{ textAlign: 'right', display: 'none' }} className="sm-show">
                            <p style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-white)' }}>
                                {user?.name}
                            </p>
                            <p style={{ fontSize: '0.7rem', color: 'var(--color-slate-light)' }}>{cfg.label}</p>
                        </div>
                        <button className="btn-ghost" onClick={handleLogout} style={{ fontSize: '0.8rem', padding: '7px 16px' }}>
                            ↩ Logout
                        </button>
                    </div>
                </div>
            </header>

            {/* Page Header */}
            {(title || subtitle) && (
                <div style={{
                    background: 'linear-gradient(135deg, rgba(17,34,64,0.8), rgba(10,25,47,0.95))',
                    borderBottom: '1px solid rgba(255,255,255,0.06)',
                    padding: '24px',
                }}>
                    <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
                        {title && (
                            <h1 style={{
                                fontFamily: 'var(--font-display)',
                                fontSize: '1.5rem', fontWeight: 800, marginBottom: '4px',
                                letterSpacing: '-0.02em',
                            }}>
                                {title}
                            </h1>
                        )}
                        {subtitle && (
                            <p style={{ fontSize: '0.85rem', color: 'var(--color-slate-light)' }}>{subtitle}</p>
                        )}
                    </div>
                </div>
            )}

            {/* Content */}
            <main style={{ flex: 1, padding: '28px 24px', maxWidth: '1280px', width: '100%', margin: '0 auto' }}>
                {children}
            </main>
        </div>
    )
}
