import { motion, useReducedMotion } from 'framer-motion'
import { ArrowUpRight, Mail, MapPin, Phone } from 'lucide-react'
import { brand } from '../../data/brand'
import ContactForm from '../forms/ContactForm'

/*
  Font (add to index.html if not already there):
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap" rel="stylesheet">
*/
const EASE = [0.16, 1, 0.3, 1]
const ACCENT = '#ff5938'
const PHONE = '8130701133'
const INFO_MAIL = 'info@countryholidaysinnsuites.com'
const CARE_MAIL = 'customercare@countryholidaysinnsuites.com'
const ADDRESS = '126, 1st Floor, Devika Tower 6, Nehru Place, New Delhi - 110019.'

const cards = [
  { Icon: Phone, label: 'Call us', note: 'Customer care & bookings', value: PHONE, href: `tel:${PHONE}` },
  { Icon: Mail, label: 'General info', note: 'Questions and partnerships', value: INFO_MAIL, href: `mailto:${INFO_MAIL}` },
  { Icon: Mail, label: 'Customer care', note: 'Help with an existing stay', value: CARE_MAIL, href: `mailto:${CARE_MAIL}` },
  {
    Icon: MapPin,
    label: 'Visit the office',
    note: 'Open on weekdays',
    value: ADDRESS,
    href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ADDRESS)}`,
    external: true,
  },
]

export default function ContactSection() {
  const reduced = !!useReducedMotion()

  const reveal = (delay = 0) => ({
    initial: reduced ? false : { opacity: 0, y: 36 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.2 },
    transition: { duration: 0.9, ease: EASE, delay },
  })

  return (
    <section
      id="contact"
      style={{ fontFamily: "'Poppins', system-ui, sans-serif" }}
      className="relative overflow-hidden bg-[#07131b] text-white"
    >
      {/* Background: a glowing arch and thin arcs, echoing the hero */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -bottom-[38%] left-1/2 h-[90vh] w-[95vw] max-w-[1400px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_50%_0%,rgba(52,140,190,0.5),rgba(14,48,70,0.0)_65%)] blur-2xl" />
        <svg viewBox="0 0 1000 600" preserveAspectRatio="none" className="absolute inset-0 h-full w-full opacity-60">
          <g fill="none" stroke="rgba(255,255,255,0.1)" vectorEffect="non-scaling-stroke">
            <path d="M-20 520 C 250 520 330 120 500 120 S 750 520 1020 520" vectorEffect="non-scaling-stroke" />
            <path d="M-20 580 C 280 580 360 200 500 200 S 720 580 1020 580" vectorEffect="non-scaling-stroke" />
          </g>
        </svg>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,transparent_50%,rgba(3,8,12,0.6)_100%)]" />
      </div>

      <div className="relative mx-auto flex min-h-[100svh] w-full max-w-[1400px] flex-col px-5 pb-5 pt-28 sm:px-8 sm:pt-32 lg:px-12">
        <div className="grid flex-1 content-center gap-12 py-8 lg:grid-cols-12 lg:gap-14">
          {/* ───────── Left: headline + contact cards ───────── */}
          <div className="flex flex-col gap-8 lg:col-span-7">
            <motion.div {...reveal(0)}>
              <p className="mb-5 inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-light text-white/80 backdrop-blur">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#3ddc97] opacity-70 motion-reduce:animate-none" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-[#3ddc97]" />
                </span>
                Our team is online
              </p>
              <h2 className="m-0 text-[clamp(2.4rem,min(5.6vw,10svh),5.2rem)] font-normal leading-[1.04] tracking-[-0.03em]">
                Speak with <br className="hidden sm:block" />
                our <span style={{ color: ACCENT }}>travel experts.</span>
              </h2>
              <p className="mb-0 mt-5 max-w-[520px] text-sm font-light leading-relaxed text-white/70 sm:text-[15px]">
                Questions about membership, destinations, or planning your next vacation? Reach out to our team or
                drop by the office.
              </p>
            </motion.div>

            <motion.ul {...reveal(0.12)} className="m-0 grid list-none gap-3 p-0 sm:grid-cols-2">
              {cards.map(({ Icon, label, note, value, href, external }) => (
                <li key={label}>
                  <a
                    href={href}
                    {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    className="group flex h-full flex-col rounded-2xl border border-white/10 bg-white/[0.05] p-5 backdrop-blur-md transition duration-500 hover:-translate-y-1 hover:border-white/30 hover:bg-white/[0.09] focus:outline-none focus-visible:ring-2 focus-visible:ring-white motion-reduce:transition-none motion-reduce:hover:translate-y-0"
                  >
                    <span className="flex items-center justify-between">
                      <span className="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white transition-colors duration-300 group-hover:bg-[#ff5938]">
                        <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
                      </span>
                      <ArrowUpRight
                        className="h-4 w-4 text-white/40 transition duration-300 group-hover:rotate-45 group-hover:text-white"
                        aria-hidden="true"
                      />
                    </span>
                    <span className="mt-5 text-xs font-light text-white/55">{label}</span>
                    <span className="mt-1 break-words text-[15px] font-medium leading-snug tracking-[-0.01em] sm:text-base">
                      {value}
                    </span>
                    <span className="mt-2 text-[11px] font-light text-white/45">{note}</span>
                  </a>
                </li>
              ))}
            </motion.ul>

            {/* Membership callout */}
            <motion.div
              {...reveal(0.2)}
              className="flex flex-col gap-3 rounded-2xl border border-[#ff5938]/40 bg-[#ff5938]/10 p-4 sm:flex-row sm:items-center sm:justify-between sm:px-6"
            >
              <div className="flex items-center gap-3">
                <span aria-hidden="true" className="h-2.5 w-2.5 shrink-0 rotate-45 bg-[#ff5938]" />
                <p className="m-0 text-sm font-medium">New membership enquiry?</p>
              </div>
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
                <a
                  href={`tel:${PHONE}`}
                  className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2 font-medium text-[#07131b] transition hover:bg-[#ff5938] hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  <Phone className="h-3.5 w-3.5" aria-hidden="true" />
                  {PHONE}
                </a>
                <a
                  href={`mailto:${INFO_MAIL}`}
                  className="break-all font-light text-white/80 underline underline-offset-4 transition hover:text-white"
                >
                  {INFO_MAIL}
                </a>
              </div>
            </motion.div>
          </div>

          {/* ───────── Right: form card ───────── */}
          <motion.div
            {...reveal(0.1)}
            className="relative flex flex-col self-center overflow-hidden rounded-[28px] bg-white text-[#07131b] shadow-[0_50px_100px_-40px_rgba(0,0,0,0.9)] lg:col-span-5"
          >
            <div className="px-6 pb-2 pt-7 sm:px-9 sm:pt-9">
              <h3 className="m-0 text-2xl font-medium tracking-[-0.02em] sm:text-[1.7rem]">Send an enquiry</h3>
              <p className="mb-0 mt-2 text-sm font-light text-[#07131b]/60">
                Tell us a little about your plans and we'll get back to you shortly.
              </p>
            </div>
            <div className="px-6 pb-7 pt-4 text-slate-800 sm:px-9 sm:pb-9">
              <ContactForm />
            </div>
          </motion.div>
        </div>

        {/* Bottom rail */}
        <footer className="flex flex-col items-center justify-between gap-2 border-t border-white/10 pt-4 text-xs font-light text-white/50 sm:flex-row">
          <span>We usually reply within one working day</span>
          <span>© {brand.name || 'Country Holidays Inn & Suites'}</span>
        </footer>
      </div>
    </section>
  )
}