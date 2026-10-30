import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import { Eye, EyeOff, AlertCircle, ShieldCheck, ArrowLeft } from 'lucide-react'
// 👇 Change this to the image you have in src/assets
import loginBg from '../../assets/login-bg1.webp'

/* Picks up src/assets/logo-000.* whatever its extension is (png / svg / webp...) — Vite */
const logoMods = import.meta.glob('../../assets/logo-000.*', { eager: true, import: 'default' })
const logo = Object.values(logoMods)[0]

const REMEMBER_KEY = 'chis_admin_username'
const EASE = [0.16, 1, 0.3, 1]

const INK = '#2a1b14' /* espresso: sign-in button */
const INK_HOVER = '#3d2a20'
const LIGHT = '#cfe5c4' /* soft light-green page background */

const FONT_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');
html, body, #root { height: 100%; margin: 0; }
`

/* the logo, used once on the page: no circle, no background, just the logo.
   Needs the dark-green-lettering version of logo-000.png so it shows on the white panel. */
function Logo() {
  return (
    <Link
      to="/"
      aria-label="Country Holidays Inn & Suites home"
      className="mx-auto block w-fit shrink-0 transition-transform duration-500 hover:scale-[1.03]"
    >
      {logo ? (
        <img
          src={logo}
          alt="Country Holidays Inn & Suites"
          className="h-auto w-[clamp(190px,32svh,320px)] max-w-full object-contain"
        />
      ) : (
        <span className="text-lg font-semibold leading-tight text-[#2f7a3a]">Country Holidays Inn &amp; Suites</span>
      )}
    </Link>
  )
}

export default function AdminLoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [username, setUsername] = useState(() => {
    try {
      return localStorage.getItem(REMEMBER_KEY) || localStorage.getItem('chis_admin_email') || 'admin'
    } catch {
      return 'admin'
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

  const from = location.state?.from?.pathname || '/admin/dashboard'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await login(username, password)
      try {
        if (remember) localStorage.setItem(REMEMBER_KEY, username)
        else localStorage.removeItem(REMEMBER_KEY)
      } catch {
        /* storage unavailable */
      }
      navigate(from, { replace: true })
    } catch (err) {
      setError(err.message || 'Invalid username or password credentials.')
    } finally {
      setLoading(false)
    }
  }

  const imgFallback = (e) => {
    e.currentTarget.onerror = null
    e.currentTarget.src = '/hero-mountain.jpg'
  }

  const input =
    'h-[clamp(40px,5.8svh,46px)] w-full rounded-xl border border-slate-200 bg-white px-3.5 text-[14px] text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-[#2a1b14] focus:ring-4 focus:ring-[#2a1b14]/10'

  return (
    <div
      className="fixed inset-0 h-[100dvh] w-screen overflow-hidden text-slate-900 antialiased"
      style={{ fontFamily: "'Inter', system-ui, sans-serif", background: LIGHT }}
    >
      <style>{FONT_CSS}</style>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, ease: EASE }}
        className="grid h-full w-full grid-cols-1 grid-rows-[minmax(0,1fr)] md:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]"
      >
        {/* ───── Left: form ───── */}
        <section className="flex h-full min-h-0 flex-col overflow-y-auto px-6 py-[clamp(1rem,4svh,2.5rem)] [scrollbar-width:none] sm:px-10 [&::-webkit-scrollbar]:hidden">
          <div className="my-auto w-full max-w-[340px] self-center py-4">
            <Logo />

            <h1 className="mt-[clamp(0.75rem,2.4svh,1.25rem)] text-center text-[clamp(1.1rem,2.6svh,1.35rem)] font-semibold tracking-[-0.01em]">
              Welcome back
            </h1>
            <p className="mt-1 text-center text-[13.5px] text-slate-500">
              Sign in to manage Country Holidays Inn &amp; Suites.
            </p>

            {error && (
              <div
                role="alert"
                className="mt-5 flex items-start gap-2.5 rounded-xl bg-red-50 p-3 text-left text-[12.5px] text-red-700 ring-1 ring-red-200"
              >
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="mt-[clamp(1.25rem,4svh,2.25rem)] space-y-[clamp(0.75rem,2.2svh,1.1rem)]"
            >
              <div>
                <label htmlFor="username" className="mb-1.5 block text-[13px] font-medium text-slate-800">
                  Username or email
                </label>
                <input
                  id="username"
                  type="text"
                  required
                  autoComplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username or email"
                  className={input}
                />
              </div>

              <div>
                <label htmlFor="password" className="mb-1.5 block text-[13px] font-medium text-slate-800">
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
                    placeholder="Enter your password"
                    className={`${input} pr-11`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-slate-500 transition hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2a1b14]"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="h-[17px] w-[17px]" /> : <Eye className="h-[17px] w-[17px]" />}
                  </button>
                </div>
              </div>

              <label className="flex w-fit cursor-pointer select-none items-center gap-2.5 text-[13px] text-slate-600">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="h-4 w-4 rounded-[5px] accent-[#2a1b14]"
                />
                Remember me
              </label>

              <button
                type="submit"
                disabled={loading}
                className="flex h-[clamp(42px,6svh,48px)] w-full items-center justify-center rounded-xl text-[14px] font-medium text-white shadow-[0_8px_18px_rgba(42,27,20,0.25)] transition active:scale-[0.99] focus:outline-none focus-visible:ring-4 focus-visible:ring-[#2a1b14]/25 disabled:cursor-not-allowed disabled:opacity-60"
                style={{ background: INK }}
                onMouseEnter={(e) => (e.currentTarget.style.background = INK_HOVER)}
                onMouseLeave={(e) => (e.currentTarget.style.background = INK)}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Verifying...
                  </span>
                ) : (
                  'Sign in'
                )}
              </button>
            </form>

            <p className="mt-[clamp(1rem,3.4svh,1.75rem)] text-center text-[13px] text-slate-500">
              Visiting as a guest?{' '}
              <Link to="/" className="font-semibold text-slate-900 underline underline-offset-4">
                Back to website
              </Link>
            </p>
          </div>

          {/* hidden on short screens so nothing gets cut off */}
          <p className="mx-auto hidden max-w-[340px] shrink-0 items-start gap-2 text-left text-[11px] leading-relaxed text-slate-400 [@media(min-height:700px)]:flex">
            <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            Restricted to authorized CHIS staff. All access sessions are encrypted and logged for security compliance.
          </p>
        </section>

        {/* ───── Right: photo card with a notched corner ───── */}
        <aside className="relative hidden h-full min-h-0 p-3 md:block">
          <div className="relative h-full w-full overflow-hidden rounded-[32px] bg-[#2a1b14]">
            <motion.img
              src={loginBg}
              alt="Country Holidays Resorts"
              onError={imgFallback}
              className="absolute inset-0 h-full w-full object-cover"
              initial={{ scale: 1.12 }}
              animate={{ scale: 1.02 }}
              transition={{ duration: 2.2, ease: EASE }}
            />
            <div className="absolute inset-0 bg-black/10" />
            <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/50 to-transparent" />

            {/* notch (top-left) holding the round back button */}
            <div className="absolute left-0 top-0 h-[76px] w-[76px] rounded-br-[28px]" style={{ background: LIGHT }} />
            <div
              className="absolute left-[76px] top-0 h-7 w-7"
              style={{ background: `radial-gradient(circle at 100% 100%, transparent 27.5px, ${LIGHT} 28px)` }}
            />
            <div
              className="absolute left-0 top-[76px] h-7 w-7"
              style={{ background: `radial-gradient(circle at 100% 100%, transparent 27.5px, ${LIGHT} 28px)` }}
            />
            <Link
              to="/"
              aria-label="Back to website"
              className="absolute left-[6px] top-[6px] grid h-[64px] w-[64px] place-items-center rounded-full bg-white/80 text-slate-700 transition hover:bg-white"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>

            {/* frosted caption card */}
            <motion.div
              className="absolute inset-x-4 bottom-4 rounded-2xl border border-white/30 bg-white/20 p-5 text-white shadow-[0_10px_30px_rgba(0,0,0,0.2)] backdrop-blur-md"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.7, ease: EASE }}
            >
              <p className="text-[15px] font-medium leading-snug">
                Every booking, room and guest stay in one place.
              </p>
              <p className="mt-2 text-[12.5px] text-white/80">Country Holidays Inn &amp; Suites · Staff portal</p>
            </motion.div>
          </div>
        </aside>
      </motion.div>
    </div>
  )
}