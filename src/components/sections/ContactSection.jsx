import { motion, useReducedMotion } from 'framer-motion'
import { ArrowUpRight, Mail, MapPin, Phone } from 'lucide-react'
import { brand } from '../../data/brand'
import ContactForm from '../forms/ContactForm'

/*
  Typography:
  - Headings: font-rader font-bold
  - Copy / badges / cards: font-varela

  CHIS palette: green #096c27 · deep #06501b · leaf #b3d565 · ink #0b1f12 · mist #f3f8e6
*/
const EASE = [0.22, 1, 0.36, 1]
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
    initial: reduced ? false : { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.2 },
    transition: { duration: 0.8, ease: EASE, delay },
  })

  return (
    <section
      id="contact"
      className="relative isolate overflow-hidden bg-[#096c27] text-white selection:bg-[#b3d565] selection:text-[#0b1f12]"
    >
      {/* Background: soft leaf glow + thin rings, echoing the page heroes */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -right-[15%] -top-[25%] h-[60vw] w-[60vw] rounded-full bg-[#b3d565]/20 blur-3xl" />
        <div className="absolute -left-[10%] top-[8%] h-[46vw] w-[46vw]">
          <div className="absolute inset-0 rounded-full border border-white/15" />
          <div className="absolute inset-[12%] rounded-full border border-white/15" />
          <div className="absolute inset-[24%] rounded-full border border-white/15" />
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,#06501b_0%,transparent_55%)]" />
      </div>

      <div className="relative mx-auto flex min-h-[100svh] w-full max-w-[1400px] flex-col px-5 pb-5 pt-28 sm:px-8 sm:pt-32 lg:px-12">
        <div className="grid flex-1 content-center gap-10 py-8 lg:grid-cols-12 lg:gap-12">
          {/* ───────── Left: headline + contact cards ───────── */}
          <div className="flex flex-col gap-7 lg:col-span-7">
            <motion.div {...reveal(0)}>
              <span className="font-varela inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-white/90 backdrop-blur-md">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#b3d565] opacity-70 motion-reduce:animate-none" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-[#b3d565]" />
                </span>
                Our team is online
              </span>
              <h2 className="m-0 mt-5 font-rader text-[clamp(2.2rem,5.2vw,4.25rem)] font-bold leading-[1] tracking-tight">
                Speak with <br className="hidden sm:block" />
                our <span className="font-bold text-[#b3d565]">travel experts.</span>
              </h2>
              <p className="mb-0 mt-4 max-w-[480px] font-varela text-[15px] leading-relaxed text-white/80">
                Questions about membership, destinations, or planning your next vacation? Reach out to our team or drop by the office.
              </p>
            </motion.div>

            <motion.ul {...reveal(0.1)} className="m-0 grid list-none gap-3 p-0 sm:grid-cols-2">
              {cards.map(({ Icon, label, note, value, href, external }) => (
                <li key={label}>
                  <a
                    href={href}
                    {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    className="group flex h-full flex-col rounded-3xl border border-white/15 bg-white/10 p-4 backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:border-[#b3d565]/60 hover:bg-white/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#b3d565] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
                  >
                    <span className="flex items-center justify-between">
                      <span className="grid h-10 w-10 place-items-center rounded-full bg-white/15 text-white transition-colors duration-300 group-hover:bg-[#b3d565] group-hover:text-[#0b1f12]">
                        <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
                      </span>
                      <ArrowUpRight
                        className="h-4 w-4 text-white/50 transition duration-300 group-hover:rotate-45 group-hover:text-[#b3d565]"
                        aria-hidden="true"
                      />
                    </span>
                    <span className="mt-4 font-varela text-[10.5px] font-bold uppercase tracking-[0.14em] text-[#b3d565]">{label}</span>
                    <span className="mt-1 break-all sm:break-words font-varela text-[13px] sm:text-[14px] font-bold leading-snug tracking-tight">{value}</span>
                    <span className="mt-1.5 font-varela text-[12px] text-white/60">{note}</span>
                  </a>
                </li>
              ))}
            </motion.ul>

            {/* Membership callout */}
            <motion.div
              {...reveal(0.18)}
              className="flex flex-col gap-3 rounded-3xl border border-[#b3d565]/40 bg-[#b3d565]/10 p-4 sm:flex-row sm:items-center sm:justify-between sm:px-5"
            >
              <div className="flex items-center gap-3">
                <span aria-hidden="true" className="h-2.5 w-2.5 shrink-0 rotate-45 bg-[#b3d565]" />
                <p className="m-0 font-varela text-sm font-semibold">New membership enquiry?</p>
              </div>
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px]">
                <a
                  href={`tel:${PHONE}`}
                  className="font-varela inline-flex items-center gap-2 rounded-full bg-[#b3d565] px-4 py-2 font-bold text-[#0b1f12] transition hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  <Phone className="h-3.5 w-3.5" aria-hidden="true" />
                  {PHONE}
                </a>
                <a
                  href={`mailto:${INFO_MAIL}`}
                  className="font-varela break-all text-white/80 underline underline-offset-4 transition hover:text-[#b3d565]"
                >
                  {INFO_MAIL}
                </a>
              </div>
            </motion.div>
          </div>

          {/* ───────── Right: form card ───────── */}
          <motion.div
            {...reveal(0.1)}
            className="relative flex flex-col self-center overflow-hidden rounded-[2rem] bg-white text-[#0b1f12] shadow-[0_40px_80px_-30px_rgba(4,38,13,0.8)] lg:col-span-5"
          >
            <div className="px-6 pb-2 pt-7 sm:px-8 sm:pt-8">
              <span className="font-varela inline-flex items-center gap-2 rounded-full border border-[#096c27]/15 bg-[#f3f8e6] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-[#096c27]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#096c27]" />
                Enquiry form
              </span>
              <h3 className="m-0 mt-4 font-rader text-[1.75rem] font-bold leading-tight tracking-tight">
                Send an <span className="font-bold text-[#096c27]">enquiry</span>
              </h3>
              <p className="mb-0 mt-2 font-varela text-sm leading-relaxed text-[#0b1f12]/60">
                Tell us a little about your plans and we&rsquo;ll get back to you shortly.
              </p>
            </div>
            <div className="px-6 pb-7 pt-4 text-slate-800 sm:px-8 sm:pb-8">
              <ContactForm />
            </div>
          </motion.div>
        </div>

        {/* Bottom rail */}
        <footer className="font-varela flex flex-col items-center justify-between gap-2 border-t border-white/15 pt-4 text-xs font-normal text-white/60 sm:flex-row">
          <span>We usually reply within one working day</span>
          <span>© {brand.name || 'Country Holidays Inn & Suites'}</span>
        </footer>
      </div>
    </section>
  )
}
