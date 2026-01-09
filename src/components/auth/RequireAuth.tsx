import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import './RequireAuth.css'

export default function RequireAuth() {
    const { user, loading } = useAuth()
    const location = useLocation()

    // Show loading state while checking auth
    if (loading) {
        return (
            <div className="auth-loading">
                <div className="auth-loading-spinner" />
                <p>Authentifizierung wird geprüft...</p>
            </div>
        )
    }

    // Redirect to login if not authenticated
    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />
    }

    return <Outlet />
}
