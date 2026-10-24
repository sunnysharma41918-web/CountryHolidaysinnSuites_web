import { useId, useRef, useState } from 'react'
import { AnimatePresence, motion, useInView, useReducedMotion } from 'framer-motion'
import { ArrowUpRight, MessageSquare, Plus } from 'lucide-react'
import { faqs } from '../../data/faqs'

const EASE = [0.16, 1, 0.3, 1]

const DISPLAY_FONT = { fontFamily: "'Bebas Neue', sans-serif" }
const BODY_FONT = { fontFamily: "'Outfit', sans-serif" }
const SCRIPT_FONT = { fontFamily: "'Caveat', cursive" }

/* hand-drawn spiral doodle (Archimedean) */
const SPIRAL = (() => {
  let d = ''
  for (let i = 0; i <= 70; i++) {
    const t = (i / 70) * Math.PI * 4.2
    const r = 2.6 * t
    d += `${i === 0 ? 'M' : 'L'}${(34 + r * Math.cos(t)).toFixed(1)} ${(34 + r * Math.sin(t)).toFixed(1)} `
  }
  return d
})()

const BLOB =
  'M20 8 C40 -2 70 6 78 28 C84 46 62 52 56 70 C52 84 34 92 22 80 C12 70 24 58 18 46 C10 32 2 18 20 8 Z'

/* Masked heading reveal. The in-view check sits on the clipping wrapper
   (not the moving text), so the title can never get stuck hidden. */
function RevealLine({ children, delay = 0, reduce, className = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.3 })
  return (
    <span ref={ref} className="block overflow-hidden pb-[0.06em]">
      <motion.span
        className={`block ${className}`}
        initial={reduce ? false : { y: '110%' }}
        animate={{ y: reduce || inView ? 0 : '110%' }}
        transition={{ duration: 1, delay, ease: EASE }}
      >
        {children}
      </motion.span>
    </span>
  )
}

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
      className="relative flex min-h-[100svh] w-full flex-col overflow-hidden bg-[#f3f8e6] py-16 text-[#0b1f12] sm:py-20 lg:h-[100svh] lg:py-[clamp(1.5rem,5svh,4rem)]"
    >
      {/* doodles */}
      <svg
        aria-hidden
        viewBox="0 0 68 68"
        fill="none"
        className="pointer-events-none absolute left-0 top-[18%] w-14 -translate-x-1/2 sm:w-20 lg:top-[22%] lg:w-24"
      >
        <path d={SPIRAL} stroke="#096c27" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <svg
        aria-hidden
        viewBox="0 0 100 100"
        className="pointer-events-none absolute right-0 top-10 w-24 translate-x-1/3 rotate-[18deg] sm:w-32 lg:top-16 lg:w-44"
      >
        <path d={BLOB} fill="#b3d565" />
      </svg>

      <div className="relative mx-auto flex min-h-0 w-full max-w-[1440px] flex-1 flex-col px-4 sm:px-8 lg:px-12">
        {/* Heading */}
        <div className="flex shrink-0 flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span
              className="mb-1 inline-block -rotate-3 text-[clamp(1.6rem,4svh,2.5rem)] leading-none text-[#096c27]"
              style={SCRIPT_FONT}
            >
              Got questions?
            </span>
            <h2
            aria-label="CHIS FAQ"
            className="text-[clamp(3.25rem,min(14vw,16svh),9rem)] font-normal uppercase leading-[0.9] tracking-[0.01em] text-[#0b1f12]"
            style={DISPLAY_FONT}
          >
            <RevealLine reduce={reduce}>
              CHIS <span className="text-[#096c27]">FAQ</span>
            </RevealLine>
            </h2>
          </div>
          <p
            className="max-w-xs text-sm leading-relaxed text-[#0b1f12]/70 sm:pb-2 [@media(max-height:620px)]:hidden"
            style={BODY_FONT}
          >
            Frequently asked questions: short answers to what travellers ask us most.
          </p>
        </div>

        {/* Questions + contact card */}
        <div className="mt-8 grid min-h-0 flex-1 grid-cols-1 gap-4 lg:mt-[clamp(1rem,3.5svh,2.5rem)] lg:grid-cols-[minmax(0,1fr)_360px] lg:grid-rows-[minmax(0,1fr)] lg:gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
          <ul className="space-y-3 lg:min-h-0 lg:overflow-y-auto lg:overscroll-contain lg:pr-1 lg:[scrollbar-color:#096c27_transparent] lg:[scrollbar-width:thin]">
            {faqs.map((faq) => {
              const isOpen = openId === faq.id
              const panelId = `${baseId}-panel-${faq.id}`
              const buttonId = `${baseId}-button-${faq.id}`

              return (
                <li
                  key={faq.id}
                  className={`overflow-hidden rounded-2xl border bg-white transition-colors duration-300 ${
                    isOpen ? 'border-[#096c27]' : 'border-[#096c27]/20 hover:border-[#096c27]/60'
                  }`}
                >
                  <button
                    type="button"
                    id={buttonId}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => toggleFaq(faq.id)}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left lg:py-[clamp(0.75rem,2.2svh,1.25rem)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#096c27] sm:px-6"
                  >
                    <span
                      className="text-base font-semibold leading-snug tracking-[-0.01em] sm:text-lg"
                      style={BODY_FONT}
                    >
                      {faq.question}
                    </span>
                    <Plus
                      aria-hidden
                      className={`h-5 w-5 shrink-0 stroke-[2] text-[#096c27] transition-transform duration-300 ${
                        isOpen ? 'rotate-45' : ''
                      }`}
                    />
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
                        transition={{ duration: reduce ? 0 : 0.4, ease: EASE }}
                        className="overflow-hidden"
                      >
                        <p
                          className="max-w-prose px-5 pb-6 text-sm leading-relaxed text-[#0b1f12]/75 sm:px-6 sm:text-[0.95rem]"
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

          {/* Contact card */}
          <aside className="flex flex-col items-center rounded-2xl border border-[#096c27]/20 bg-white p-6 text-center sm:p-8 lg:min-h-0 lg:overflow-hidden lg:p-[clamp(1rem,3svh,2rem)]">
            <div className="flex flex-1 flex-col items-center justify-center py-6 lg:py-[clamp(0.5rem,3svh,2.5rem)]">
              <MessageSquare
                aria-hidden
                className="h-14 w-14 fill-[#096c27] stroke-[#096c27] lg:h-[clamp(2.5rem,7svh,4rem)] lg:w-[clamp(2.5rem,7svh,4rem)]"
                strokeWidth={1.5}
              />
              <span className="mt-6 inline-block -rotate-3 text-3xl text-[#096c27]" style={SCRIPT_FONT}>
                Talk to a real person
              </span>
              <h3
                className="mt-1 text-xl font-semibold tracking-[-0.02em] sm:text-2xl"
                style={BODY_FONT}
              >
                Still have questions?
              </h3>
              <p className="mt-3 max-w-[18rem] text-sm leading-relaxed text-[#0b1f12]/70" style={BODY_FONT}>
                Average response time under 15 minutes. Call or WhatsApp{' '}
                <a
                  href="tel:8130701133"
                  className="whitespace-nowrap font-semibold text-[#096c27] underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#096c27]"
                >
                  8130701133
                </a>
                .
              </p>
            </div>

            <button
              type="button"
              onClick={handleConciergeClick}
              className="group flex w-full items-center justify-between gap-3 rounded-full bg-[#b3d565] py-1.5 pl-6 pr-1.5 text-sm font-semibold text-[#0b1f12] transition-colors duration-300 hover:bg-[#c5e07a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#096c27] focus-visible:ring-offset-2 active:scale-[0.98]"
              style={BODY_FONT}
            >
              Ask concierge
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#096c27] text-white transition-transform duration-300 group-hover:rotate-45">
                <ArrowUpRight className="h-4 w-4 stroke-[2.5]" />
              </span>
            </button>
          </aside>
        </div>
      </div>
    </section>
  )
}