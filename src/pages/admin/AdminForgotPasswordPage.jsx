import { useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../services/api'
import { ArrowLeft, CheckCircle2, AlertCircle, ShieldCheck } from 'lucide-react'

const GREEN = '#22d37a'
const LIME = '#b6f24a'

export default function AdminForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [message, setMessage] = useState('')
  const [resetToken, setResetToken] = useState('')
  const [resetUrl, setResetUrl] = useState('')
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const data = await api.forgotPassword(email)
      setMessage(
        data.message ||
          'If a matching administrator account exists, a secure password recovery link has been dispatched.'
      )
      if (data.resetToken) setResetToken(data.resetToken)
      if (data.resetUrl) setResetUrl(data.resetUrl)
      setSubmitted(true)
    } catch (err) {
      setError(err.message || 'Unable to process reset request. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const fieldInput =
    'w-full border-b border-white/35 bg-transparent pb-2 pt-1 text-sm text-white placeholder:text-white/25 outline-none transition focus:border-[#22d37a]'

  const fullResetLink = resetUrl || (resetToken ? `${window.location.origin}/admin/reset-password/${resetToken}` : '')

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
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-[0.14em]">Reset Password</h1>
            <p className="mt-2 text-xs font-light text-white/55">
              Enter your admin email to receive a recovery link
            </p>
          </div>

          {submitted ? (
            <div className="mt-8 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#22d37a]/15 text-[#22d37a] ring-2 ring-[#22d37a]/30">
                <CheckCircle2 className="h-7 w-7" />
              </div>
              <h2 className="text-sm font-semibold text-white">Reset Link Generated</h2>
              <p className="mt-2 text-xs text-white/70 leading-relaxed">{message}</p>

              {resetToken && (
                <div className="mt-6 space-y-4">
                  <Link
                    to={`/admin/reset-password/${resetToken}`}
                    className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-sm px-6 text-xs font-bold tracking-[0.16em] text-[#06140e] transition hover:brightness-110 shadow-lg"
                    style={{ backgroundColor: GREEN }}
                  >
                    PROCEED TO SET NEW PASSWORD →
                  </Link>

                  <div className="rounded-xl bg-black/40 p-3 text-left border border-white/10">
                    <div className="flex items-center justify-between text-[11px] text-white/60 mb-1.5">
                      <span>Direct Recovery Link:</span>
                      <button
                        type="button"
                        onClick={() => {
                          if (fullResetLink) {
                            navigator.clipboard.writeText(fullResetLink)
                            setCopied(true)
                            setTimeout(() => setCopied(false), 2000)
                          }
                        }}
                        className="text-[#22d37a] font-medium hover:underline focus:outline-none"
                      >
                        {copied ? 'Copied to clipboard!' : 'Copy Link'}
                      </button>
                    </div>
                    <p className="break-all font-mono text-[10px] text-white/80 bg-black/30 p-2 rounded">
                      {fullResetLink}
                    </p>
                  </div>
                </div>
              )}

              <div className="mt-6">
                <Link
                  to="/admin/login"
                  className="inline-flex items-center gap-1.5 text-xs text-white/70 hover:text-white transition"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  Return to sign in
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

              <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                <div>
                  <label htmlFor="recovery-email" className="block text-[11px] font-medium text-white/80">
                    Administrator Email <span aria-hidden>*</span>
                  </label>
                  <input
                    id="recovery-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@countryholidaysinnsuites.com"
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
                      SENDING LINK…
                    </>
                  ) : (
                    'SEND RECOVERY LINK'
                  )}
                </button>
              </form>

              <div className="mt-6 text-center">
                <Link to="/admin/login" className="inline-flex items-center gap-1.5 text-[11px] font-medium transition hover:underline" style={{ color: LIME }}>
                  <ArrowLeft className="h-3.5 w-3.5" />
                  Return to sign in
                </Link>
              </div>
            </>
          )}
        </div>

        <div className="mt-8 space-y-2 text-center border-t border-white/10 pt-4">
          <p className="flex items-center justify-center gap-1.5 text-[11px] font-light text-white/45">
            <ShieldCheck className="h-3.5 w-3.5 shrink-0" style={{ color: GREEN }} />
            Single-use cryptographic HMAC token
          </p>
          <Link to="/" className="inline-flex items-center gap-1.5 text-[11px] font-medium text-white/80 transition hover:text-white">
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to the website
          </Link>
        </div>
      </div>
    </div>
  )
}
