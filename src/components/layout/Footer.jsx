import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, ArrowUp, ArrowUpRight, BadgeCheck, CheckCircle2, Loader2, Mail, MailOpen, MapPin, Phone, ShieldCheck } from 'lucide-react'
import { brand } from '../../data/brand'
import logo from '../../assets/logo-000.png'
import heyImg from '../../assets/hey.png'
import { sendEmail } from '../../services/emailService'

const EASE = [0.16, 1, 0.3, 1]

/*  Palette
    dark brown #3e2a1e   brown #6b4a36   tan #b89a7c
    sand #d9c3a0   cream #f8f1e7   white #ffffff           */

const PERSON_IMG = heyImg

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@600;700&family=Nunito:wght@400;500;600;700&display=swap');
.chis-foot { font-family: 'Nunito', system-ui, sans-serif; }
.chis-head { font-family: 'Outfit', 'Nunito', system-ui, sans-serif; }
`

const SOCIALS = [
  { key: 'instagram', label: 'Instagram', color: '#0b3528', path: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z' },
  { key: 'facebook', label: 'Facebook', color: '#0b3528', path: 'M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z' },
  { key: 'x', label: 'X (Twitter)', color: '#07241b', path: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z' },
  { key: 'youtube', label: 'YouTube', color: '#0b3528', path: 'M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z' },
]

const QUICK_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'Vacation packages', to: '/vacation-packages' },
  { label: 'Destinations', to: '/destinations' },
  { label: 'About us', to: '/about' },
  { label: 'Contact', to: '/contact' },
]

const MORE_LINKS = [
  { label: 'Member portal', href: 'https://member.countryholidaysinnsuites.com/' },
  { label: 'Redeem voucher', href: 'https://www.countryholidaysinnsuites.com/chis/voucher' },
  { label: 'Terms of use', to: '/terms' },
  { label: 'Admin portal', to: '/admin/login' },
]

const PHONE = '8130701133'
const EMAIL = 'info@countryholidaysinnsuites.com'
const CARE_EMAIL = 'customercare@countryholidaysinnsuites.com'

function FootLink({ to, href, children }) {
  const cls =
    'inline-block w-fit text-[14px] text-white/85 transition-all duration-300 hover:translate-x-1 hover:text-[#f1dfc3] focus-visible:text-[#f1dfc3] focus-visible:outline-none motion-reduce:transition-none'
  return to ? (
    <Link to={to} className={cls}>{children}</Link>
  ) : (
    <a href={href} target="_blank" rel="noreferrer" className={cls}>{children}</a>
  )
}

/* ---------- treeline + tent silhouette that sits on the dark block (pure SVG) ---------- */
const FOOT = { dark: '#0b3528', darker: '#07241b', cream: '#f3f1e4' }

function makeRand(seed) {
  let v = seed
  return () => {
    v = (v * 16807) % 2147483647
    return (v - 1) / 2147483646
  }
}

const circle = (cx, cy, r) =>
  `M${(cx - r).toFixed(1)} ${cy.toFixed(1)}a${r.toFixed(1)} ${r.toFixed(1)} 0 1 0 ${(2 * r).toFixed(1)} 0a${r.toFixed(1)} ${r.toFixed(1)} 0 1 0 ${(-2 * r).toFixed(1)} 0Z`

const TREELINE_D = (() => {
  const rand = makeRand(7)
  let d = ''
  for (let x = -10; x < 1620; x += 12 + rand() * 6) {
    const edge = 24 * Math.exp(-Math.max(x, 0) / 130) + 24 * Math.exp(-Math.max(1600 - x, 0) / 130)
    let h = 22 + 11 * Math.sin(x / 110) + 8 * Math.sin(x / 41 + 1) + rand() * 6 + edge
    if (Math.abs(x - 800) < 100) h *= 0.35 // clearing around the tent
    const r = 8 + rand() * 9
    d += circle(x, 120 - h + r, r)
  }
  // two taller trees
  for (const tx of [520, 1050]) {
    d += `M${tx - 3} 120V70h6v50Z`
    d += circle(tx, 60, 17) + circle(tx - 15, 74, 12) + circle(tx + 14, 72, 13) + circle(tx, 86, 13) + circle(tx - 8, 50, 11) + circle(tx + 9, 52, 11)
  }
  return d
})()

function Treeline() {
  return (
    <div aria-hidden="true" className="pointer-events-none relative -mb-px aspect-[1600/120] min-h-[56px] w-full select-none">
      <svg
        viewBox="0 0 1600 120"
        preserveAspectRatio="xMidYMax slice"
        className="absolute inset-0 h-full w-full text-[color:var(--f-dark)]"
        role="presentation"
        focusable="false"
      >
        <g fill="currentColor">
          <rect x="-10" y="112" width="1620" height="10" />
          <path d={TREELINE_D} />
          {/* tent */}
          <path d="M736 121 C740 92 772 70 800 68 C828 70 860 92 864 121Z" />
        </g>
        <g fill="none" stroke={FOOT.cream} strokeOpacity="0.55" strokeWidth="1.2" strokeLinecap="round">
          <path d="M800 68 C790 90 786 105 784 119 M800 68 C812 90 818 105 820 119" />
          <path d="M752 102 C780 97 820 97 848 102" />
        </g>
      </svg>
    </div>
  )
}

export default function Footer() {
  const reduce = useReducedMotion()
  const [formData, setFormData] = useState({ name: '', phone: '', email: '' })
  const [loading, setLoading] = useState(false)
  const [statusMessage, setStatusMessage] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)
  const [imgOk, setImgOk] = useState(true)

  const onSubscribe = async (e) => {
    e.preventDefault()
    const trimmedName = formData.name.trim()
    const trimmedEmail = formData.email.trim()
    const trimmedPhone = formData.phone.trim()

    if (!trimmedEmail) return

    setLoading(true)
    setStatusMessage('Sending your details...')
    setIsSuccess(false)

    try {
      const res = await sendEmail({
        name: trimmedName || 'Valued Guest',
        from_name: trimmedName || 'Valued Guest',
        email: trimmedEmail,
        from_email: trimmedEmail,
        reply_to: trimmedEmail,
        phone: trimmedPhone || 'Not provided',
        subject: 'Newsletter & Inquiry Subscription',
        message: `New inquiry subscription from website footer. Name: ${trimmedName || 'N/A'}, Phone: ${trimmedPhone || 'N/A'}, Email: ${trimmedEmail}`,
      })

      if (res.success) {
        setIsSuccess(true)
        setStatusMessage('Thank you! We have received your details and will be in touch.')
        setFormData({ name: '', phone: '', email: '' })
      } else {
        setIsSuccess(false)
        setStatusMessage(res.error || 'Unable to submit right now. Please try again.')
      }
    } catch {
      setIsSuccess(false)
      setStatusMessage('Something went wrong. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  const rise = (i = 0) => ({
    initial: reduce ? false : { opacity: 0, y: 18 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.1 },
    transition: { duration: 0.8, delay: i * 0.08, ease: EASE },
  })

  return (
    <footer className="chis-foot relative overflow-hidden bg-transparent text-[#063a2f]">
      <style>{CSS}</style>

      <div className="mx-auto w-full max-w-[90rem] px-4 pt-1 sm:px-6 lg:px-10 lg:pt-2">
        {/* ---------- newsletter / enquiry card ---------- */}
        <motion.section
          {...rise(0)}
          aria-labelledby="footer-news-title"
          className="relative mt-8 sm:mt-10 lg:mt-12 rounded-[2rem] border border-white/95 bg-gradient-to-br from-white/95 via-[#f2f8f3]/90 to-emerald-50/80 backdrop-blur-xl shadow-[0_20px_50px_-15px_rgba(6,58,47,0.12)]"
        >
          {/* Person cutout anchored flush to the bottom edge of the card, head rising above */}
          <div className="pointer-events-none absolute bottom-0 left-6 z-10 hidden h-[125%] max-h-[360px] w-auto select-none lg:left-10 lg:block">
            {imgOk && (
              <img
                src={PERSON_IMG}
                alt="Customer Support"
                loading="lazy"
                onError={() => setImgOk(false)}
                className="h-full w-auto select-none object-contain object-bottom drop-shadow-[0_12px_24px_rgba(0,0,0,0.08)]"
              />
            )}
          </div>

          <div className="grid items-center gap-8 px-6 pb-10 pt-8 sm:px-10 lg:grid-cols-12 lg:gap-6 lg:py-10">
            {/* Spacer for the person cutout on large screens */}
            <div className="hidden lg:col-span-4 lg:block" aria-hidden="true" />

            <div className="lg:col-span-3">
              <h2 id="footer-news-title" className="font-montserrat text-[clamp(2.25rem,3.2vw,2.75rem)] font-bold leading-[1.15] tracking-tight text-[#063a2f]">
                Get interesting
                <span className="mt-1 flex items-center gap-3">
                  <MailOpen className="h-8 w-8 shrink-0 stroke-[1.5] text-[#297f33]" aria-hidden="true" />
                  news
                  <ArrowRight className="h-7 w-7 stroke-[1.5] text-[#297f33]" aria-hidden="true" />
                </span>
              </h2>
              <p className="font-poppins mt-3 text-base md:text-lg font-normal text-[#0d4a3a]/75 leading-relaxed">
                Sign up to get the latest holiday packages, deals &amp; exclusive member updates.
              </p>
            </div>

            <form onSubmit={onSubscribe} className="flex flex-col gap-3 w-full lg:col-span-5 lg:pl-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => {
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                    setStatusMessage('')
                  }}
                  placeholder="Your Name"
                  className="font-poppins h-11 w-full rounded-full border border-[#297f33]/40 bg-[#0c3527] px-5 text-sm md:text-base text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-[#6aa22f] transition shadow-xs"
                />
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => {
                    setFormData((prev) => ({ ...prev, phone: e.target.value }))
                    setStatusMessage('')
                  }}
                  placeholder="Phone Number"
                  className="font-poppins h-11 w-full rounded-full border border-[#297f33]/40 bg-[#0c3527] px-5 text-sm md:text-base text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-[#6aa22f] transition shadow-xs"
                />
              </div>

              <input
                id="footer-email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => {
                  setFormData((prev) => ({ ...prev, email: e.target.value }))
                  setStatusMessage('')
                }}
                placeholder="example@gmail.com"
                className="font-poppins h-11 w-full rounded-full border border-[#297f33]/40 bg-[#0c3527] px-5 text-sm md:text-base text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-[#6aa22f] transition shadow-xs"
              />

              <div className="pt-1 flex flex-wrap items-center gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="font-montserrat group inline-flex items-center gap-3 rounded-full bg-[#f3f1e4] py-1 pl-6 pr-1.5 text-sm font-bold text-[#1c2110] ring-1 ring-[#297f33]/25 shadow-sm transition-all duration-300 hover:scale-[1.02] hover:bg-white active:scale-95 disabled:opacity-60 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6aa22f]"
                >
                  <span>{loading ? 'Submitting...' : 'Contact Us'}</span>
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-[#6aa22f] text-white transition-transform duration-300 group-hover:rotate-45">
                    {loading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                    )}
                  </span>
                </button>

                {statusMessage && (
                  <p
                    role="status"
                    className={`font-poppins inline-flex items-center gap-1.5 text-xs font-semibold ${isSuccess ? 'text-[#063a2f]' : 'text-red-700'
                      }`}
                  >
                    {isSuccess && <CheckCircle2 className="h-4 w-4 text-[#297f33]" />}
                    <span>{statusMessage}</span>
                  </p>
                )}
              </div>
            </form>
          </div>
        </motion.section>

        <div className="h-6 lg:h-8" aria-hidden="true" />
      </div>

      {/* ---------- treeline edge, then dark block: links | brand | contact ---------- */}
      <div className="relative text-white" style={{ '--f-dark': FOOT.dark, '--f-darker': FOOT.darker }}>
        <Treeline />

        <div className="bg-[var(--f-dark)]">
          <div className="mx-auto w-full max-w-[90rem] px-4 pb-10 pt-6 sm:px-6 lg:px-10">
            <div className="grid gap-10 lg:grid-cols-3 lg:gap-0">
              {/* links */}
              <motion.div {...rise(0)} className="grid grid-cols-2 gap-6 lg:pr-10">
                <nav aria-label="Quick links">
                  <p className="font-montserrat text-base font-semibold text-white">Quick links</p>
                  <ul className="mt-3 space-y-2">
                    {QUICK_LINKS.map((l) => (
                      <li key={l.label}><FootLink to={l.to}>{l.label}</FootLink></li>
                    ))}
                  </ul>
                </nav>
                <nav aria-label="Member links">
                  <p className="font-montserrat text-base font-semibold text-white">Members</p>
                  <ul className="mt-3 space-y-2">
                    {MORE_LINKS.map((l) => (
                      <li key={l.label}><FootLink to={l.to} href={l.href}>{l.label}</FootLink></li>
                    ))}
                  </ul>
                </nav>
              </motion.div>

              {/* brand, centred between two vertical dividers */}
              <motion.div {...rise(1)} className="flex flex-col items-center text-center lg:border-x lg:border-white/20 lg:px-10">
                <Link
                  to="/"
                  aria-label="Country Holidays Inn & Suites – home"
                  className="mb-3 inline-block rounded-md transition-transform duration-300 hover:scale-[1.03] focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
                >
                  <img src={logo} alt="Country Holidays Inn & Suites" className="h-12 w-auto object-contain sm:h-14" />
                </Link>

                <p className="max-w-xs text-sm font-normal leading-relaxed text-white/80">
                  {brand?.tagline || 'Silver and Gold holiday ownership with easy EMI plans, built for families who love to travel together.'}
                </p>

                <div className="mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[13px] text-white/80">
                  <span className="inline-flex items-center gap-1.5">
                    <ShieldCheck className="h-4 w-4 text-[#b9e26a]" aria-hidden="true" /> Safe &amp; secure
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <BadgeCheck className="h-4 w-4 text-[#b9e26a]" aria-hidden="true" /> Trusted ownership
                  </span>
                </div>

                <div className="mt-5 flex items-center gap-2.5">
                  {SOCIALS.map((s) =>
                    brand?.socials?.[s.key] ? (
                      <a
                        key={s.key}
                        href={brand.socials[s.key]}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={s.label}
                        className="grid h-10 w-10 place-items-center rounded-full border border-white/80 text-white transition-colors duration-300 hover:bg-white hover:text-[color:var(--f-dark)] focus-visible:bg-white focus-visible:text-[color:var(--f-dark)] focus-visible:outline-none"
                      >
                        <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true"><path d={s.path} /></svg>
                      </a>
                    ) : null,
                  )}
                </div>
              </motion.div>

              {/* contact, right aligned */}
              <motion.div {...rise(2)} className="lg:pl-10 lg:text-right">
                <p className="font-montserrat text-base font-semibold text-white">Get in touch</p>
                <div className="mt-3 space-y-3 text-sm text-white/85">
                  <div className="flex items-start gap-2.5 lg:justify-end">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#b9e26a] lg:order-2" aria-hidden="true" />
                    <span className="leading-snug">126, 1st Floor, Devika Tower 6, Nehru Place, New Delhi - 110019</span>
                  </div>
                  <div className="flex items-center gap-2.5 lg:justify-end">
                    <Phone className="h-4 w-4 shrink-0 text-[#b9e26a] lg:order-2" aria-hidden="true" />
                    <a href={`tel:${PHONE}`} className="font-semibold text-white hover:underline">{PHONE}</a>
                  </div>
                  <div className="flex items-start gap-2.5 lg:justify-end">
                    <Mail className="mt-0.5 h-4 w-4 shrink-0 text-[#b9e26a] lg:order-2" aria-hidden="true" />
                    <span className="flex flex-col gap-1">
                      <a href={`mailto:${EMAIL}`} className="break-all hover:text-[#b9e26a] hover:underline">{EMAIL}</a>
                      <a href={`mailto:${CARE_EMAIL}`} className="break-all hover:text-[#b9e26a] hover:underline">{CARE_EMAIL}</a>
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* ---------- darker bottom bar ---------- */}
          <div className="bg-[var(--f-darker)]">
            <div className="mx-auto flex w-full max-w-[90rem] flex-col items-start justify-between gap-3 px-4 py-4 text-xs text-white/70 sm:flex-row sm:items-center sm:px-6 lg:px-10">
              <p>{brand?.copyright || `© ${new Date().getFullYear()} Country Holidays Inn & Suites. All rights reserved.`}</p>
              <div className="flex items-center gap-4">
                <Link to="/terms" className="transition hover:text-white hover:underline">Terms of use</Link>
                <Link to="/admin/login" className="transition hover:text-white hover:underline">Staff Portal</Link>
                <button
                  type="button"
                  onClick={() => window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' })}
                  aria-label="Back to top"
                  className="group relative grid h-9 w-9 place-items-center overflow-hidden rounded-full border border-white/40 text-white transition-colors duration-300 hover:border-white hover:text-[color:var(--f-darker)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
                >
                  <span aria-hidden="true" className="absolute inset-0 translate-y-full bg-white transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0 motion-reduce:transition-none" />
                  <ArrowUp className="relative h-4 w-4 stroke-[2.5]" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}