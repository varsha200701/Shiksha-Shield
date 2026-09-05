import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/Login'
import StaffDashboard from './pages/StaffDashboard'
import InstitutionDashboard from './pages/InstitutionDashboard'
import PanchayatDashboard from './pages/PanchayatDashboard'
import GovtDashboard from './pages/GovtDashboard'

export default function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/" element={<Navigate to="/login" replace />} />
                    <Route
                        path="/staff"
                        element={
                            <ProtectedRoute allowedRole="staff">
                                <StaffDashboard />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/institution"
                        element={
                            <ProtectedRoute allowedRole="institution">
                                <InstitutionDashboard />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/panchayat"
                        element={
                            <ProtectedRoute allowedRole="panchayat">
                                 <PanchayatDashboard />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/govt"
                        element={
                            <ProtectedRoute allowedRole="govt">
                                <GovtDashboard />
                            </ProtectedRoute>
                        }
                    />
                    <Route path="*" element={<Navigate to="/login" replace />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    )
}
