import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { api } from '../../services/api'
import { Eye, EyeOff, CheckCircle2, AlertCircle, ShieldCheck, ArrowLeft } from 'lucide-react'

const GREEN = '#22d37a'

export default function AdminResetPasswordPage() {
  const { token } = useParams()
  const navigate = useNavigate()

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (password.length < 8) {
      setError('Password must be at least 8 characters long')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)

    try {
      await api.resetPassword(token, password, confirmPassword)
      setSuccess(true)
      setTimeout(() => {
        navigate('/admin/login')
      }, 2500)
    } catch (err) {
      setError(err.message || 'Password reset link is invalid or expired. Please request a new one.')
    } finally {
      setLoading(false)
    }
  }

  const fieldInput =
    'w-full border-b border-white/35 bg-transparent pb-2 pt-1 text-sm text-white placeholder:text-white/25 outline-none transition focus:border-[#22d37a]'

  return (
    <div className="flex h-[100dvh] items-center justify-center overflow-hidden bg-gradient-to-b from-[#1f9d66] via-[#0e4a35] to-[#050d09] p-3 font-['Poppins',system-ui,sans-serif] antialiased sm:p-6">
      <div className="flex h-[min(40rem,100%)] w-full max-w-md flex-col justify-between overflow-y-auto rounded-3xl bg-[#0c241b] p-8 sm:p-10 text-white shadow-[0_40px_90px_-30px_rgba(0,0,0,0.65)] ring-1 ring-white/10">
        <div>
          <Link to="/" className="mx-auto block text-center transition hover:opacity-90" aria-label="Country Holidays Inn & Suites home">
            <img
              src="/logo-white.png"
              alt="Country Holidays"
              onError={(e) => {
                if (!e.currentTarget.dataset.fallback) {
                  e.currentTarget.dataset.fallback = '1'
                  e.currentTarget.src = '/tree-logo.png'
                }
              }}
              className="mx-auto h-10 w-auto max-w-[11rem] object-contain"
            />
          </Link>

          <div className="mt-8 text-center">
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-[0.14em]">Set New Password</h1>
            <p className="mt-2 text-xs font-light text-white/55">Create a new secure password for your account</p>
          </div>

          {!token ? (
            <div className="mt-8 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-amber-500/15 text-amber-400 ring-2 ring-amber-500/30">
                <AlertCircle className="h-7 w-7" />
              </div>
              <h2 className="text-sm font-semibold text-white">Missing Authorization Token</h2>
              <p className="mt-2 text-xs text-white/70 leading-relaxed">
                To set a new password, you need a valid reset link with an authorization token. Please submit your email on the recovery page to generate one.
              </p>
              <div className="mt-8">
                <Link
                  to="/admin/forgot-password"
                  className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-sm px-6 text-xs font-bold tracking-[0.16em] text-[#06140e] transition hover:brightness-110 shadow-lg"
                  style={{ backgroundColor: GREEN }}
                >
                  REQUEST PASSWORD RESET LINK
                </Link>
              </div>
            </div>
          ) : success ? (
            <div className="mt-8 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#22d37a]/15 text-[#22d37a] ring-2 ring-[#22d37a]/30">
                <CheckCircle2 className="h-7 w-7" />
              </div>
              <h2 className="text-sm font-semibold text-white">Password Updated!</h2>
              <p className="mt-2 text-xs text-white/70 leading-relaxed">
                Your password has been securely reset. Redirecting you to sign in…
              </p>
              <div className="mt-8">
                <Link
                  to="/admin/login"
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-sm px-6 text-xs font-bold tracking-[0.16em] text-[#06140e] transition hover:brightness-110"
                  style={{ backgroundColor: GREEN }}
                >
                  GO TO SIGN IN NOW
                </Link>
              </div>
            </div>
          ) : (
            <>
              {error && (
                <div role="alert" className="mt-5 flex items-start gap-3 rounded-lg bg-red-500/10 p-3 text-xs text-red-200 ring-1 ring-red-400/30">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-300" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                <div>
                  <label htmlFor="new-password" className="block text-[11px] font-medium text-white/80">
                    New Password <span aria-hidden>*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="new-password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Min 8 characters"
                      className={`${fieldInput} pr-9`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-0 top-1/2 -translate-y-1/2 rounded-full p-1 text-white/50 transition hover:text-white"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label htmlFor="confirm-new-password" className="block text-[11px] font-medium text-white/80">
                    Confirm Password <span aria-hidden>*</span>
                  </label>
                  <input
                    id="confirm-new-password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat new password"
                    className={fieldInput}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex h-10 w-full items-center justify-center gap-2 rounded-sm text-xs font-bold tracking-[0.2em] text-[#06140e] shadow-lg shadow-[#22d37a]/20 transition hover:brightness-110 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
                  style={{ backgroundColor: GREEN }}
                >
                  {loading ? (
                    <>
                      <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-[#06140e] border-t-transparent" />
                      UPDATING…
                    </>
                  ) : (
                    'UPDATE PASSWORD'
                  )}
                </button>
              </form>
            </>
          )}
        </div>

        <div className="mt-8 space-y-2 text-center border-t border-white/10 pt-4">
          <p className="flex items-center justify-center gap-1.5 text-[11px] font-light text-white/45">
            <ShieldCheck className="h-3.5 w-3.5 shrink-0" style={{ color: GREEN }} />
            Bcrypt salted hash with active session invalidation
          </p>
          <Link to="/admin/login" className="inline-flex items-center gap-1.5 text-[11px] font-medium text-white/80 transition hover:text-white">
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Sign in
          </Link>
        </div>
      </div>
    </div>
  )
}
