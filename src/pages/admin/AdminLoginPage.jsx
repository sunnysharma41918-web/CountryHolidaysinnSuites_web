import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Eye, EyeOff, AlertCircle, ChevronRight, Info } from 'lucide-react'
// 👇 Change this to the image you have in src/assets
import loginBg from '../../assets/login-bg1.webp'

/*
  Fonts (optional, add to index.html):
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet">
*/
const GREEN = '#22d37a'
const YELLOW = '#f5b400'
const REMEMBER_KEY = 'chis_admin_username'

export default function AdminLoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [username, setUsername] = useState(() => {
    try {
      return localStorage.getItem(REMEMBER_KEY) || localStorage.getItem('chis_admin_email') || ''
    } catch {
      return ''
    }
  })
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(() => {
    try {
      return !!localStorage.getItem(REMEMBER_KEY) || !!localStorage.getItem('chis_admin_email')
    } catch {
      return false
    }
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  const from = location.state?.from?.pathname || '/admin/dashboard'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setNotice('')
    setLoading(true)

    try {
      await login(username, password)
      try {
        if (remember) localStorage.setItem(REMEMBER_KEY, username)
        else localStorage.removeItem(REMEMBER_KEY)
      } catch {
        /* storage unavailable: ignore */
      }
      navigate(from, { replace: true })
    } catch (err) {
      setError(err.message || 'Invalid username or password. Please verify your credentials.')
    } finally {
      setLoading(false)
    }
  }

  // Boxed field with a small label inside the top-left
  const fieldWrap =
    'relative rounded-lg border border-white/15 bg-white/[0.04] px-3 pb-2 pt-5 transition focus-within:border-[#22d37a] focus-within:ring-2 focus-within:ring-[#22d37a]/25'
  const fieldLabel = 'pointer-events-none absolute left-3 top-1.5 text-[9px] font-medium text-white/50'
  const fieldInput = 'w-full bg-transparent text-[13px] text-white placeholder:text-white/25 outline-none'

  return (
    <div
      className="fixed inset-0 flex h-[100dvh] w-screen overflow-hidden font-['Poppins',system-ui,sans-serif] antialiased"
      style={{
        backgroundColor: '#030806',
        backgroundImage:
          'radial-gradient(60% 55% at 12% 8%, rgba(34,211,122,0.28), transparent 70%), radial-gradient(55% 50% at 92% 95%, rgba(20,140,80,0.30), transparent 70%), linear-gradient(135deg, #020504 0%, #06130d 55%, #0b2a1b 100%)',
      }}
    >
      {/* ───── Full-screen layout ───── */}
      <div className="relative flex h-full w-full overflow-hidden bg-[#08140f]">
        {/* ───── Form panel ───── */}
        <section className="relative z-10 flex h-full min-h-0 w-full flex-col overflow-y-auto bg-[#08140f] px-8 py-7 text-white sm:px-12 md:w-1/2 md:shrink-0">
          <Link to="/" aria-label="Country Holidays Inn & Suites home" className="inline-block shrink-0 self-start transition hover:opacity-90">
            <img
              src="/logo-white.png"
              alt="Country Holidays"
              onError={(e) => {
                if (!e.currentTarget.dataset.fallback) {
                  e.currentTarget.dataset.fallback = '1'
                  e.currentTarget.src = '/tree-logo.png'
                }
              }}
              className="h-9 w-auto max-w-[10rem] object-contain object-left"
            />
          </Link>

          <div className="mx-auto my-auto w-full max-w-sm py-5">
            <h1 className="text-[28px] font-bold leading-tight text-white sm:text-[32px]">Welcome Back!</h1>
            <p className="mt-2 text-[11px] text-white/55">Please log in to your account.</p>

            {error && (
              <div role="alert" className="mt-4 flex items-start gap-2.5 rounded-lg bg-red-500/10 p-3 text-[11px] text-red-200 ring-1 ring-red-400/30">
                <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-red-300" />
                <span>{error}</span>
              </div>
            )}
            {notice && (
              <div role="status" className="mt-4 flex items-start gap-2.5 rounded-lg bg-[#22d37a]/10 p-3 text-[11px] text-emerald-100 ring-1 ring-[#22d37a]/30">
                <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" style={{ color: GREEN }} />
                <span>{notice}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-6 space-y-3">
              <div className={fieldWrap}>
                <label htmlFor="username" className={fieldLabel}>
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  required
                  autoComplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  className={fieldInput}
                />
              </div>

              <div className={fieldWrap}>
                <label htmlFor="password" className={fieldLabel}>
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className={`${fieldInput} pr-7`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-0 top-1/2 -translate-y-1/2 rounded-full p-1 text-white/50 transition hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#22d37a]"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex cursor-pointer items-center gap-2 text-[10px] text-white/70">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    className="h-3 w-3 rounded-sm accent-[#22d37a]"
                  />
                  Remember me
                </label>
                <button
                  type="button"
                  onClick={() => setNotice('To reset your password, please contact the property administrator.')}
                  className="text-[10px] font-medium text-red-300 transition hover:text-red-200 focus:outline-none focus-visible:underline"
                >
                  Forgot password?
                </button>
              </div>

              <div className="flex items-center gap-3 pt-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex h-10 flex-1 items-center justify-center gap-2 rounded-lg text-xs font-semibold text-[#06140e] shadow-lg shadow-[#22d37a]/25 transition hover:brightness-110 active:scale-[0.99] focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#08140f] disabled:cursor-not-allowed disabled:opacity-60 motion-reduce:transition-none"
                  style={{ backgroundColor: GREEN }}
                >
                  {loading ? (
                    <>
                      <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-[#06140e] border-t-transparent motion-reduce:animate-none" />
                      Verifying
                    </>
                  ) : (
                    'Login'
                  )}
                </button>
                <Link
                  to="/"
                  className="flex h-10 flex-1 items-center justify-center rounded-lg border text-xs font-medium transition hover:bg-[#22d37a]/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#22d37a] focus-visible:ring-offset-2 focus-visible:ring-offset-[#08140f]"
                  style={{ borderColor: GREEN, color: GREEN }}
                >
                  Back to website
                </Link>
              </div>
            </form>
          </div>

          <p className="shrink-0 text-[9px] leading-relaxed text-white/40">
            This area is restricted to authorised staff. Sessions are encrypted and all activity is recorded in the audit log.
          </p>
        </section>

        {/* ───── Image panel ───── */}
        <aside className="relative hidden h-full min-h-0 flex-1 overflow-hidden md:block" aria-hidden="true">
          <img
            src={loginBg}
            alt="Country Holidays Resorts"
            onError={(e) => {
              e.currentTarget.src = '/hero-mountain.jpg'
            }}
            className="absolute inset-0 h-full w-full object-cover"
          />

          {/* Frosted glass vertical panes */}
          <div
            className="absolute bottom-[8%] left-[14%] top-[10%] w-[10%] rounded-full border border-white/40 backdrop-blur-[2px]"
            style={{ background: 'linear-gradient(to bottom, rgba(255,255,255,0.35), rgba(255,255,255,0.08))' }}
          />
          <div
            className="absolute bottom-[4%] right-[10%] top-[14%] w-[12%] rounded-full border border-white/40 backdrop-blur-[2px]"
            style={{ background: 'linear-gradient(to bottom, rgba(255,255,255,0.32), rgba(255,255,255,0.06))' }}
          />
          <div
            className="absolute bottom-[14%] right-[28%] top-[26%] w-[7%] rounded-full border border-white/30 backdrop-blur-[1px]"
            style={{ background: 'linear-gradient(to bottom, rgba(255,255,255,0.22), rgba(255,255,255,0.04))' }}
          />

        </aside>

        {/* Yellow circle straddling the seam */}
        <div
          aria-hidden="true"
          className="absolute left-1/2 top-[47%] z-20 hidden h-11 w-11 -translate-x-1/2 items-center justify-center rounded-full text-white shadow-xl md:flex"
          style={{ backgroundColor: YELLOW, boxShadow: '0 10px 24px rgba(245,180,0,0.45)' }}
        >
          <ChevronRight className="h-4 w-4" strokeWidth={3} />
        </div>
      </div>
    </div>
  )
}