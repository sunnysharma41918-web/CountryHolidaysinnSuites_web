import { useId, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowUpRight, Plus, Star } from 'lucide-react'
import { faqs } from '../../data/faqs'

const EASE = [0.16, 1, 0.3, 1]

/* Fonts already in your design system:
   Bebas Neue = condensed display, Outfit = questions and body, Caveat = script note */
const DISPLAY_FONT = { fontFamily: "'Bebas Neue', sans-serif" }
const BODY_FONT = { fontFamily: "'Outfit', sans-serif" }
const SCRIPT_FONT = { fontFamily: "'Caveat', cursive" }

export default function TripFAQSection({ onContact }) {
  const reduce = useReducedMotion()
  const baseId = useId()
  const [openId, setOpenId] = useState(faqs[0]?.id ?? null)

  const toggleFaq = (id) => setOpenId((prev) => (prev === id ? null : id))

  const handleConciergeClick = () => {
    const detail = {
      destination: 'Concierge Inquiry',
      days: 'Custom Schedule',
      persons: '1 Person',
    }
    if (onContact) {
      onContact(detail)
    } else {
      window.dispatchEvent(new CustomEvent('open-booking-modal', { detail }))
    }
  }

  return (
    <section
      id="faq"
      className="relative w-full overflow-hidden bg-[#f7f7f5] py-20 text-slate-950 sm:py-24 lg:py-28"
    >
      <div className="mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-12">
        {/* Label row */}
        <div className="flex items-center justify-between border-t border-slate-950 pt-3 text-sm">
          <span className="flex items-center gap-2 font-medium">
            <span className="h-2 w-2 animate-pulse rounded-full bg-[#ff5938] ring-1 ring-slate-950" />
            Got questions?
          </span>
          <span className="hidden text-slate-500 sm:block">Everything you need to know</span>
        </div>

        {/* Title row */}
        <div className="mt-8 flex flex-col justify-between gap-6 md:flex-row md:items-end lg:mt-10">
          <h2
            className="text-[clamp(3.25rem,9.5vw,8.5rem)] font-normal uppercase leading-[0.88] tracking-[0.01em]"
            style={DISPLAY_FONT}
          >
            <span className="block">Frequently asked</span>
            <span className="block">questions</span>
          </h2>
          <p className="max-w-xs text-sm leading-relaxed text-slate-600" style={BODY_FONT}>
            Short answers to what travellers ask us most. Anything missing? Our concierge is a
            message away.
          </p>
        </div>

        {/* Questions: two columns of cards */}
        <ul className="mt-10 grid grid-cols-1 items-start gap-3 md:grid-cols-2 lg:mt-14 lg:gap-4">
          {faqs.map((faq) => {
            const isOpen = openId === faq.id
            const panelId = `${baseId}-panel-${faq.id}`
            const buttonId = `${baseId}-button-${faq.id}`

            return (
              <li
                key={faq.id}
                className={`relative overflow-hidden rounded-3xl border transition-colors duration-500 ${isOpen
                    ? 'border-slate-950 bg-slate-950 text-white'
                    : 'border-slate-950/15 bg-white/70 text-slate-950'
                  }`}
              >
                <button
                  type="button"
                  id={buttonId}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => toggleFaq(faq.id)}
                  className="group relative flex w-full items-center justify-between gap-4 p-5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#ff5938] sm:p-6"
                >
                  {/* brand-accent sweep from the bottom (closed cards only) */}
                  {!isOpen && (
                    <span
                      aria-hidden
                      className="absolute inset-0 translate-y-full bg-[#ff5938] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0 group-focus-visible:translate-y-0 motion-reduce:transition-none"
                    />
                  )}
                  <span
                    className="relative text-base font-medium leading-snug tracking-[-0.01em] sm:text-lg"
                    style={BODY_FONT}
                  >
                    {faq.question}
                  </span>
                  <span
                    className={`relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-all duration-300 ${isOpen
                        ? 'rotate-45 bg-[#ff5938] text-slate-950'
                        : 'bg-slate-950 text-[#ff5938] group-hover:rotate-90'
                      }`}
                  >
                    <Plus className="h-4 w-4 stroke-[2.5]" />
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={panelId}
                      role="region"
                      aria-labelledby={buttonId}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: reduce ? 0 : 0.45, ease: EASE }}
                      className="overflow-hidden"
                    >
                      <p
                        className="px-5 pb-6 text-sm leading-relaxed text-white/70 sm:px-6 sm:text-[0.95rem]"
                        style={BODY_FONT}
                      >
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            )
          })}
        </ul>

        {/* Support banner */}
        <div className="relative mt-12 grid overflow-hidden rounded-[28px] bg-slate-950 text-white md:grid-cols-12 lg:mt-16">
          <div className="relative z-10 flex flex-col justify-between gap-10 p-6 sm:p-10 md:col-span-7">
            <div>
              <span
                className="inline-block -rotate-3 text-3xl text-[#ff5938]"
                style={SCRIPT_FONT}
              >
                Talk to a real person
              </span>
              <h3
                className="mt-2 text-[clamp(2.75rem,6vw,5.25rem)] font-normal uppercase leading-[0.9] tracking-[0.01em]"
                style={DISPLAY_FONT}
              >
                Still have questions?
              </h3>
              <p className="mt-4 max-w-sm text-sm text-white/60" style={BODY_FONT}>
                Average response time under 15 minutes.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
              <button
                type="button"
                onClick={handleConciergeClick}
                className="group flex shrink-0 items-center gap-3 rounded-full bg-[#ff5938] py-1.5 pl-6 pr-1.5 text-sm font-semibold text-slate-950 shadow-lg shadow-black/10 transition-transform duration-300 hover:scale-[1.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff5938] focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 active:scale-95"
              >
                Ask concierge
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-950 text-[#ff5938] transition-transform duration-300 group-hover:rotate-45">
                  <ArrowUpRight className="h-4 w-4 stroke-[2.5]" />
                </span>
              </button>
              <span className="text-sm text-white/70" style={BODY_FONT}>
                <span className="font-semibold text-white">Call/WhatsApp:</span> +91 98765 43210
              </span>
            </div>
          </div>

          <div className="relative min-h-[15rem] md:col-span-5 md:min-h-0">
            <img
              src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=85"
              alt="Alpine expedition support"
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent md:bg-gradient-to-r md:from-slate-950/70 md:via-slate-950/10" />
            <div className="absolute right-4 top-4 flex items-center gap-2 rounded-full border border-white/20 bg-black/50 px-3.5 py-1.5 text-xs backdrop-blur-md">
              <Star className="h-3.5 w-3.5 fill-[#ff5938] text-[#ff5938]" />
              <span className="font-semibold">4.98 Rating</span>
              <span className="text-white/70">· 12k+ reviews</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}