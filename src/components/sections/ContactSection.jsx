import { motion, useReducedMotion } from 'framer-motion'
import { ArrowUpRight, Mail, MapPin, Phone } from 'lucide-react'
import { brand } from '../../data/brand'
import ContactForm from '../forms/ContactForm'

const EASE = [0.22, 1, 0.36, 1]

export default function ContactSection() {
  const reduced = !!useReducedMotion()

  const rows = [
    { Icon: Phone, label: 'Call us', value: brand.phone, href: `tel:${String(brand.phone || '').replace(/[^\d+]/g, '')}` },
    { Icon: Mail, label: 'Email us', value: brand.email, href: `mailto:${brand.email}` },
    { Icon: MapPin, label: 'Visit us', value: brand.address, href: null },
  ]

  const reveal = (delay = 0) => ({
    initial: reduced ? false : { opacity: 0, y: 40 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.2 },
    transition: { duration: 0.9, ease: EASE, delay },
  })

  return (
    <section
      id="contact"
      style={{ background: '#0d0d0c', color: '#efeae0' }}
      className="relative overflow-hidden"
    >
      {/* glow */}
      <div aria-hidden className="pointer-events-none absolute -left-[10%] bottom-[-20%] h-[60vh] w-[60vh] rounded-full bg-[#ff5938]/25 blur-[130px]" />
      <div aria-hidden className="pointer-events-none absolute right-[-10%] top-[-15%] h-[45vh] w-[45vh] rounded-full bg-[#ff5938]/10 blur-[120px]" />

      <div className="relative mx-auto flex min-h-[100svh] w-full max-w-[1600px] flex-col px-5 pb-5 pt-28 sm:px-8 sm:pb-7 sm:pt-32 lg:px-12 lg:pb-7">
        <div className="grid flex-1 content-center gap-10 py-10 sm:py-12 lg:grid-cols-12 lg:gap-12 lg:py-10">
          {/* ------------------------------ Left ------------------------------ */}
          <div className="flex flex-col justify-between gap-10 lg:col-span-7">
            <motion.div {...reveal(0)}>
              <h2 className="m-0 font-sans font-semibold uppercase leading-[0.86] tracking-[-0.055em] text-[clamp(44px,min(9.6vw,16svh),190px)]">
                Speak with
                <span className="block text-[#ff5938]">our travel</span>
                experts.
              </h2>
              <p className="mb-0 mt-5 max-w-[470px] text-[14px] leading-relaxed text-[#efeae0]/70 sm:text-[15px]">
                Have questions about membership, destinations, or planning your next vacation? Send us a message and our team will help you find the right next step.
              </p>
            </motion.div>

            <motion.ul {...reveal(0.15)} className="m-0 list-none border-t border-[#efeae0]/40 p-0">
              {rows.map(({ Icon, label, value, href }) => {
                const inner = (
                  <>
                    <span className="flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.14em] text-[#efeae0]/60">
                      <Icon className="h-4 w-4 text-[#ff5938]" aria-hidden="true" />
                      {label}
                    </span>
                    <span className="break-words font-sans text-[clamp(17px,min(2vw,3.4svh),30px)] font-semibold tracking-[-0.03em] transition-transform duration-500 group-hover:translate-x-2">
                      {value}
                    </span>
                    <ArrowUpRight
                      className={`h-5 w-5 text-[#ff5938] transition-transform duration-500 ${href ? 'group-hover:rotate-45' : 'opacity-0'}`}
                      aria-hidden="true"
                    />
                  </>
                )
                const cls =
                  'group grid grid-cols-[92px_minmax(0,1fr)_auto] items-center gap-3 border-b border-[#efeae0]/20 py-4 sm:grid-cols-[150px_minmax(0,1fr)_auto] sm:gap-4 sm:py-5'
                return (
                  <li key={label}>
                    {href ? (
                      <a href={href} className={`${cls} focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ff5938]`}>
                        {inner}
                      </a>
                    ) : (
                      <div className={cls}>{inner}</div>
                    )}
                  </li>
                )
              })}
            </motion.ul>
          </div>

          {/* ------------------------------ Right: form ------------------------------ */}
          <motion.div
            {...reveal(0.1)}
            className="relative flex flex-col overflow-hidden rounded-[22px] bg-[#efeae0] text-[#0d0d0c] shadow-[0_40px_90px_-40px_rgba(0,0,0,0.8)] lg:col-span-5"
          >
            <div className="flex items-center justify-between border-b border-[#0d0d0c]/80 px-6 py-3 text-[11px] font-medium uppercase tracking-[0.14em] sm:px-8">
              <span className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#ff5938]" />
                Send an enquiry
              </span>
              <span className="text-[#0d0d0c]/60">01</span>
            </div>
            <div className="px-6 py-6 text-slate-800 sm:px-8 sm:py-8">
              <ContactForm />
            </div>
          </motion.div>
        </div>

        {/* bottom rail */}
        <footer className="hidden items-center justify-between border-t border-[#efeae0]/60 pt-3 text-[11px] font-medium uppercase tracking-[0.14em] sm:flex sm:text-xs">
          <span>We reply fast</span>
          <span className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#ff5938]" />
            Team online
          </span>
          <span>© {brand.name || 'Our team'}</span>
        </footer>
      </div>
    </section>
  )
}