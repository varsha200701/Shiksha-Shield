import { createContext, useContext, useState, useCallback } from 'react'

const AuthContext = createContext(null)

const MOCK_CREDENTIALS = {
    staff: { username: 'teacher', password: 'staff123' },
    institution: { username: 'principal', password: 'school456' },
    panchayat: { username: 'panchayat', password: 'panchayat123' },
    govt: { username: 'officer', password: 'govt789' },
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)

    const login = useCallback((role, username, password) => {
        const creds = MOCK_CREDENTIALS[role]
        if (creds && creds.username === username && creds.password === password) {
            setUser({ role, username, name: getRoleName(role) })
            return { success: true }
        }
        return { success: false, error: 'Invalid credentials. Check the hint below.' }
    }, [])

    const logout = useCallback(() => {
        setUser(null)
    }, [])

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const ctx = useContext(AuthContext)
    if (!ctx) throw new Error('useAuth must be used within AuthProvider')
    return ctx
}

function getRoleName(role) {
    const names = { staff: 'Staff Member', institution: 'Institution Admin', panchayat: 'Panchayat Official', govt: 'Govt Official' }
    return names[role] || role
} 
 