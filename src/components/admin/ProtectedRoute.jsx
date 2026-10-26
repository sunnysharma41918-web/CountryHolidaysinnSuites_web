import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { ShieldAlert } from 'lucide-react'

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading, isAuthenticated } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d1829] flex flex-col items-center justify-center text-white">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#ff5938] border-t-transparent mb-4" />
        <p className="text-xs uppercase tracking-[0.2em] text-white/60">Verifying session...</p>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return (
      <div className="min-h-screen bg-[#0d1829] flex flex-col items-center justify-center p-6 text-white text-center">
        <div className="h-16 w-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 mb-6">
          <ShieldAlert className="h-8 w-8" />
        </div>
        <h1 className="font-display text-3xl font-semibold">Access Restricted</h1>
        <p className="mt-3 max-w-md text-sm text-white/65">
          Your account role (<span className="text-[#ff5938] font-semibold">{user?.role}</span>) does not have sufficient permission to view this section.
        </p>
        <a
          href="/admin/dashboard"
          className="mt-8 rounded-full bg-[#ff5938] px-6 py-2.5 text-xs font-bold uppercase tracking-[0.16em] text-white transition hover:bg-[#e84a28]"
        >
          Return to Dashboard
        </a>
      </div>
    )
  }

  return children
}
