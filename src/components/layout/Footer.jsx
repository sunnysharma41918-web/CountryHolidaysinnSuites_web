import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowUp, ArrowUpRight, Mail, MapPin, Phone } from 'lucide-react'
import TripMakerLogo from '../ui/TripMakerLogo'
import { brand } from '../../data/brand'

const EASE = [0.16, 1, 0.3, 1]

/* ------------------------------------------------------------------
   DATA
------------------------------------------------------------------- */
const SOCIALS = [
  {
    key: 'instagram',
    label: 'Instagram',
    size: 'w-4 h-4',
    path: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z',
  },
  {
    key: 'facebook',
    label: 'Facebook',
    size: 'w-4 h-4',
    path: 'M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z',
  },
  {
    key: 'x',
    label: 'X (Twitter)',
    size: 'w-3.5 h-3.5',
    path: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z',
  },
  {
    key: 'youtube',
    label: 'YouTube',
    size: 'w-4 h-4',
    path: 'M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z',
  },
]

const QUICK_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'About Us', to: '/about' },
  { label: 'All Tours', to: '/destinations' },
  { label: 'Travel Blog & Guides', to: '/blog' },
  { label: 'Popular Video Clips', href: '#mountain-clips' },
  { label: 'Member Portal Login', href: 'https://member.countryholidaysinnsuites.com/', external: true },
  { label: 'Redeem Voucher', href: 'https://www.countryholidaysinnsuites.com/chis/voucher', external: true },
]

/* ------------------------------------------------------------------
   PIECES
------------------------------------------------------------------- */

/* Heading line that slides up out of a mask */
function RevealLine({ children, delay = 0 }) {
  const reduce = useReducedMotion()
  return (
    <span className="block overflow-hidden pb-[0.1em]">
      <motion.span
        className="block"
        initial={reduce ? false : { y: '110%' }}
        whileInView={{ y: 0 }}
        viewport={{ once: true, margin: '-10%' }}
        transition={{ duration: 1, delay, ease: EASE }}
      >
        {children}
      </motion.span>
    </span>
  )
}

/* Hairline that draws itself from the left */
function DrawLine({ delay = 0, className = 'bg-white/15' }) {
  const reduce = useReducedMotion()
  return (
    <motion.span
      aria-hidden
      initial={reduce ? false : { scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true, margin: '-5%' }}
      transition={{ duration: 1.1, delay, ease: EASE }}
      className={`absolute inset-x-0 top-0 h-px origin-left ${className}`}
    />
  )
}

/* Link with a drawing underline and a small slide on hover */
function FooterLink({ to, href, external, children }) {
  const className =
    'group relative inline-flex w-fit items-center text-lg font-medium text-white/80 transition-colors duration-300 hover:text-[#ff5938] focus-visible:text-[#ff5938] focus-visible:outline-none'
  const inner = (
    <>
      <span className="transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1.5 group-focus-visible:translate-x-1.5 motion-reduce:transition-none">
        {children}
      </span>
      <span
        aria-hidden
        className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-[#ff5938] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100 group-focus-visible:scale-x-100 motion-reduce:transition-none"
      />
    </>
  )
  return to ? (
    <Link to={to} className={className}>
      {inner}
    </Link>
  ) : (
    <a href={href} target={external ? '_blank' : undefined} rel={external ? 'noreferrer' : undefined} className={className}>
      {inner}
    </a>
  )
}

/* Compact contact line with a brand-accent icon */
function ContactItem({ icon: Icon, href, children }) {
  const text = href ? (
    <a
      href={href}
      className="transition-colors duration-300 hover:text-[#ff5938] focus-visible:text-[#ff5938] focus-visible:outline-none"
    >
      {children}
    </a>
  ) : (
    <span>{children}</span>
  )
  return (
    <li className="flex items-start gap-3 text-sm text-white/70">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-[#ff5938]" />
      {text}
    </li>
  )
}

/* ------------------------------------------------------------------
   FOOTER
------------------------------------------------------------------- */
export default function Footer() {
  const reduce = useReducedMotion()
  const phoneHref = brand.phone ? `tel:${String(brand.phone).replace(/[^\d+]/g, '')}` : undefined

  return (
    <footer className="relative mt-16 overflow-hidden bg-slate-950 text-white">
      {/* drifting brand-accent glow */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -top-32 right-0 h-[30rem] w-[30rem] rounded-full bg-[#ff5938]/10 blur-3xl"
        animate={reduce ? undefined : { x: [0, -120, 0], y: [0, 60, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="relative mx-auto max-w-7xl px-4 pb-8 pt-16 sm:px-6 lg:px-8 lg:pt-24">
        {/* ---------------- 1. Headline + CTA ---------------- */}
        <div className="relative border-t border-white/80 pt-3">
          <div className="flex items-center gap-2 text-sm font-medium">
            <span className="h-2 w-2 animate-pulse rounded-full bg-[#ff5938]" />
            Plan with us
          </div>

          <div className="flex flex-col justify-between gap-8 pt-8 md:flex-row md:items-end lg:pt-10">
            <h2 className="text-[clamp(2.5rem,6.2vw,5.5rem)] font-semibold leading-[0.95] tracking-[-0.04em]">
              <RevealLine>Your next trip</RevealLine>
              <RevealLine delay={0.1}>starts here.</RevealLine>
            </h2>
            <Link
              to="/destinations"
              className="group flex shrink-0 items-center gap-3 self-start rounded-full bg-[#ff5938] py-1.5 pl-6 pr-1.5 text-sm font-semibold text-slate-950 shadow-lg shadow-black/10 transition-transform duration-300 hover:scale-[1.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff5938] focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 active:scale-95 md:self-auto"
            >
              Plan your trip
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-950 text-[#ff5938] transition-transform duration-300 group-hover:rotate-45">
                <ArrowUpRight className="h-4 w-4 stroke-[2.5]" />
              </span>
            </Link>
          </div>
        </div>

        {/* ---------------- 2. Brand, quick links, contact ---------------- */}
        <div className="grid grid-cols-1 gap-12 pt-14 sm:grid-cols-2 lg:grid-cols-12 lg:gap-16 lg:pt-16">
          <div className="sm:col-span-2 lg:col-span-5">
            <TripMakerLogo inverted={true} />
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/60">
              {brand.description}
            </p>
            <div className="mt-6 flex items-center gap-3">
              {SOCIALS.map((s) => (
                <a
                  key={s.key}
                  href={brand.socials[s.key]}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={s.label}
                  className="group relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-white/10 text-white/80 transition-colors duration-300 hover:text-slate-950 focus-visible:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff5938]"
                >
                  <span
                    aria-hidden
                    className="absolute inset-0 translate-y-full bg-[#ff5938] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0 group-focus-visible:translate-y-0 motion-reduce:transition-none"
                  />
                  <svg className={`relative fill-current ${s.size}`} viewBox="0 0 24 24">
                    <path d={s.path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          <div className="relative lg:col-span-3 lg:col-start-7">
            <DrawLine />
            <p className="pb-4 pt-4 text-sm text-white/55">Quick links</p>
            <ul className="space-y-3">
              {QUICK_LINKS.map((l, i) => (
                <motion.li
                  key={l.label}
                  initial={reduce ? false : { opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-5%' }}
                  transition={{ duration: 0.7, delay: i * 0.07, ease: EASE }}
                >
                  <FooterLink to={l.to} href={l.href} external={l.external}>
                    {l.label}
                  </FooterLink>
                </motion.li>
              ))}
            </ul>
          </div>

          <div className="relative lg:col-span-3">
            <DrawLine delay={0.1} />
            <p className="pb-4 pt-4 text-sm text-white/55">Contact</p>
            <ul className="space-y-3">
              <ContactItem icon={Mail} href={brand.email ? `mailto:${brand.email}` : undefined}>
                {brand.email}
              </ContactItem>
              <ContactItem icon={Phone} href={phoneHref}>
                {brand.phone}
              </ContactItem>
              <ContactItem icon={MapPin}>{brand.address}</ContactItem>
            </ul>
          </div>
        </div>

        {/* ---------------- 4. Bottom bar ---------------- */}
        <div className="mt-16 flex flex-col items-start justify-between gap-6 border-t border-white/15 pt-6 text-xs text-white/50 sm:flex-row sm:items-center">
          <p>{brand.copyright}</p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <span className="cursor-pointer transition-colors hover:text-white">Privacy Policy</span>
            <span className="cursor-pointer transition-colors hover:text-white">
              Terms of Service
            </span>
            <span className="cursor-pointer transition-colors hover:text-white">
              Cookie Settings
            </span>
            <button
              type="button"
              onClick={() =>
                window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' })
              }
              aria-label="Back to top"
              className="group relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border border-white/15 text-white transition-colors duration-300 hover:border-[#ff5938] hover:text-slate-950 focus-visible:border-[#ff5938] focus-visible:text-slate-950 focus-visible:outline-none"
            >
              <span
                aria-hidden
                className="absolute inset-0 translate-y-full bg-[#ff5938] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0 group-focus-visible:translate-y-0 motion-reduce:transition-none"
              />
              <ArrowUp className="relative h-4 w-4 stroke-[2.5] transition-transform duration-300 group-hover:-translate-y-0.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}