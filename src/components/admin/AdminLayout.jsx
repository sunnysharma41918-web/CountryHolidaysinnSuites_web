import { useState, useEffect } from 'react'
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { api } from '../../services/api'
import { LogOut, Menu, X, ArrowUpRight } from 'lucide-react'

export const slab = { fontFamily: "'Zilla Slab', Rockwell, 'Roboto Slab', serif" }

/* Palette: black #0a0f0c, deep green #0c3b27, green #22d37a, lime #b6f24a, mint #e8f6ee */
const navItems = [
  { label: 'Dashboard', path: '/admin/dashboard' },
  { label: 'All Properties', path: '/admin/properties' },
  { label: 'Add Property', path: '/admin/properties/new' },
  { label: 'Audit Logs', path: '/admin/audit-logs' },
  { label: 'System Health', path: '/admin/system' },
]

export default function AdminLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [dbStatus, setDbStatus] = useState({ connected: false, checking: true })

  useEffect(() => {
    let mounted = true
    const checkDb = async () => {
      try {
        const res = await api.getHealth()
        if (mounted && res && res.database) {
          setDbStatus({ connected: res.database.connected, checking: false })
        }
      } catch {
        if (mounted) setDbStatus({ connected: false, checking: false })
      }
    }
    checkDb()
    const interval = setInterval(checkDb, 30000)
    return () => {
      mounted = false
      clearInterval(interval)
    }
  }, [])

  // Close mobile sidebar on route change
  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  const handleLogout = async () => {
    await logout()
    navigate('/admin/login')
  }

  // Accurate matching for current page title
  const current =
    location.pathname.includes('/edit')
      ? { label: 'Edit Property', path: location.pathname }
      : location.pathname === '/admin/properties/new'
        ? { label: 'Add Property', path: '/admin/properties/new' }
        : [...navItems]
          .sort((a, b) => b.path.length - a.path.length)
          .find((n) => location.pathname === n.path || location.pathname.startsWith(n.path + '/')) || navItems[0]

  const dbLabel = dbStatus.checking
    ? 'Checking DB'
    : dbStatus.connected
      ? 'Database online'
      : 'Database offline'
  const dbDot = dbStatus.checking ? 'bg-stone-300' : dbStatus.connected ? 'bg-[#22d37a]' : 'bg-amber-500'

  return (
    /* Fills the entire viewport: no outer padding, max-width, or rounded card */
    <div className="fixed inset-0 flex h-[100dvh] w-screen overflow-hidden bg-white font-['Poppins',system-ui,sans-serif] text-[#0a0f0c] antialiased">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex h-full w-64 flex-col items-center overflow-y-auto bg-[#0a0f0c] px-6 py-7 text-white transition-transform duration-300 motion-reduce:transition-none lg:static lg:w-60 lg:shrink-0 lg:translate-x-0 xl:w-64 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        <button
          onClick={() => setMobileOpen(false)}
          className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full text-white/60 hover:bg-white/10 lg:hidden"
          aria-label="Close navigation"
        >
          <X className="h-4 w-4" />
        </button>

        <img
          src="/logo-white.png"
          alt="Country Holidays"
          onError={(e) => {
            if (!e.currentTarget.dataset.fallback) {
              e.currentTarget.dataset.fallback = '1'
              e.currentTarget.src = '/tree-logo.png'
            }
          }}
          className="h-9 w-auto max-w-[10rem] object-contain"
        />

        {/* Profile */}
        <div className="mt-7 text-center">
          <div
            className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#22d37a] text-2xl font-bold text-[#0a0f0c] ring-4 ring-white/10"
            style={slab}
          >
            {user?.name?.charAt(0)?.toUpperCase() || 'A'}
          </div>
          <p className="mt-3 text-base font-bold text-white" style={slab}>
            {user?.name || 'Administrator'}
          </p>
          <p className="text-xs font-light capitalize text-white/50">
            {(user?.role || 'admin').replace('_', ' ')}
          </p>
        </div>

        {/* Nav: centred text links */}
        <nav className="my-8 flex flex-col items-center gap-4" aria-label="Admin">
          {navItems.map(({ label, path }) => (
            <NavLink
              key={path}
              to={path}
              end={path === '/admin/dashboard'}
              className={({ isActive }) =>
                `relative text-[15px] transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#22d37a] focus-visible:ring-offset-4 focus-visible:ring-offset-[#0a0f0c] ${isActive
                  ? 'font-semibold text-white'
                  : 'font-light text-white/55 hover:translate-x-0.5 hover:text-white'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {label}
                  {isActive && (
                    <span className="absolute -right-4 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-[#22d37a]" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <button
          onClick={handleLogout}
          className="group mt-auto flex items-center gap-3 text-sm font-light text-white/55 transition hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#22d37a]"
        >
          <span className="grid h-7 w-7 place-items-center rounded-full bg-[#22d37a] text-[#0a0f0c] transition group-hover:bg-[#b6f24a]">
            <LogOut className="h-3.5 w-3.5" />
          </span>
          Log out
        </button>
      </aside>

      {/* Main: header fixed, content scrolls inside */}
      <div className="flex h-full min-h-0 min-w-0 flex-1 flex-col">
        <header className="flex shrink-0 items-center justify-between gap-4 border-b border-stone-100 bg-white px-5 py-4 sm:px-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="grid h-10 w-10 place-items-center rounded-full bg-[#0a0f0c] text-white lg:hidden"
              aria-label="Open navigation"
            >
              <Menu className="h-4 w-4" />
            </button>
            <h1 className="text-3xl font-bold tracking-tight text-[#0a0f0c] sm:text-4xl" style={slab}>
              {current.label}
            </h1>
          </div>

          <div className="flex items-center gap-2.5">
            <span className="hidden items-center gap-2 rounded-full border border-stone-200 bg-white px-4 py-2 text-xs font-light text-stone-600 sm:inline-flex">
              <span className={`h-2 w-2 rounded-full ${dbDot}`} />
              {dbLabel}
            </span>
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex h-10 items-center gap-2 rounded-full bg-[#0a0f0c] pl-4 pr-1.5 text-xs font-medium text-white transition hover:bg-[#22d37a] hover:text-[#0a0f0c] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#22d37a] focus-visible:ring-offset-2"
            >
              <span className="hidden sm:inline">View website</span>
              <span className="grid h-7 w-7 place-items-center rounded-full bg-[#22d37a] text-[#0a0f0c] transition group-hover:rotate-45 group-hover:bg-[#0a0f0c] group-hover:text-white motion-reduce:transition-none">
                <ArrowUpRight className="h-3.5 w-3.5" />
              </span>
            </a>
          </div>
        </header>

        <main className="min-h-0 flex-1 overflow-y-auto px-5 py-6 sm:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}