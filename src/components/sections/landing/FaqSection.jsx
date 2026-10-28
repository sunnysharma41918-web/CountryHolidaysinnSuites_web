import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Mail, Plus } from 'lucide-react'
import { EASE, GREEN, WRAP, YELLOW, Reveal, Tag, Pill } from './landingShared'

const FAQS = [
  {
    q: 'How do I book a trip?',
    a: 'Pick a trip or tell us where you want to go. A planner replies with a tailored itinerary and a fixed price, and you confirm with a small deposit.',
  },
  {
    q: 'Can I change or cancel after booking?',
    a: 'Yes. Most bookings can be moved or cancelled. Terms depend on the airline, hotel and trip type, and we show them before you pay.',
  },
  {
    q: 'What payment options do you accept?',
    a: 'Cards, bank transfer and UPI. Larger trips can be paid in instalments, with the balance due before you travel.',
  },
  {
    q: 'Do you help with visas and insurance?',
    a: 'We check visa requirements for your passport, prepare your documents and book insurance that covers medical care, delays and cancellations.',
  },
  {
    q: 'Can you plan a trip for a large group?',
    a: 'Yes. We handle families, weddings, school tours and teams, with one planner, one invoice and group rates where partners offer them.',
  },
  {
    q: 'What if something goes wrong while I am travelling?',
    a: 'Message or call your planner at any hour. We rebook flights, move stays and sort out transfers so you are not left on hold.',
  },
]

export default function FaqSection() {
  const [open, setOpen] = useState(0)

  return (
    <section
      id="faq"
      className="relative flex flex-col justify-center overflow-hidden bg-transparent pt-10 pb-4 sm:pt-14 sm:pb-6 md:pt-16 md:pb-8 text-[#0d4a3a]"
    >
      <div className={`${WRAP} flex flex-col justify-center`}>
        <div className="grid min-h-0 items-center gap-8 lg:grid-cols-12 lg:gap-14">
          
          {/* Left Column: Title & CTA */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <Reveal>
              <Tag>FAQ</Tag>
              <h2 className="font-montserrat text-[clamp(2.25rem,3.2vw,2.75rem)] font-bold tracking-tight text-[#063a2f] leading-[1.15]">
                Frequently asked questions
              </h2>
              <p className="font-poppins mt-3 text-base md:text-lg font-normal text-[#0d4a3a]/80 max-w-sm leading-relaxed">
                Can’t find your answer? A real person will reply, usually within a few hours.
              </p>
              <Pill href="mailto:hello@example.com" className="mt-6">
                <Mail className="h-4 w-4" />
                Email a planner
              </Pill>
            </Reveal>
          </div>

          {/* Right Column: Compact 100% Screen Fitted Accordion */}
          <div className="lg:col-span-7 flex flex-col justify-center min-h-0">
            <ul className="flex flex-col gap-2.5 sm:gap-3 max-h-[78vh] overflow-y-auto pr-1 lp-no-scrollbar">
              {FAQS.map((f, i) => {
                const isOpen = open === i
                return (
                  <li
                    key={f.q}
                    className="rounded-2xl border backdrop-blur-xl transition-all shadow-xs overflow-hidden"
                    style={{
                      borderColor: isOpen ? 'rgba(6, 58, 47, 0.3)' : 'rgba(255, 255, 255, 0.9)',
                      background: isOpen ? 'rgba(255, 255, 255, 0.92)' : 'rgba(255, 255, 255, 0.72)',
                      boxShadow: isOpen ? '0 12px 30px -10px rgba(13, 74, 58, 0.08)' : '0 2px 10px rgba(0, 0, 0, 0.02)',
                    }}
                  >
                    <h3>
                      <button
                        type="button"
                        aria-expanded={isOpen}
                        aria-controls={`faq-panel-${i}`}
                        id={`faq-button-${i}`}
                        onClick={() => setOpen(isOpen ? -1 : i)}
                        className="flex w-full items-center justify-between gap-4 px-5 py-3 sm:py-3.5 text-left transition-colors"
                      >
                        <span className="font-montserrat text-[clamp(1.1rem,1.4vw,1.25rem)] font-semibold text-[#063a2f]">
                          {f.q}
                        </span>
                        <span
                          className="grid h-7 w-7 shrink-0 place-items-center rounded-full shadow-xs transition-transform duration-300"
                          style={{ background: YELLOW }}
                        >
                          <Plus
                            className={`h-3.5 w-3.5 text-[#0d4a3a] transition-transform duration-300 ${
                              isOpen ? 'rotate-45' : ''
                            }`}
                          />
                        </span>
                      </button>
                    </h3>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          id={`faq-panel-${i}`}
                          role="region"
                          aria-labelledby={`faq-button-${i}`}
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.35, ease: EASE }}
                          className="overflow-hidden"
                        >
                          <p className="font-poppins px-5 pb-3.5 text-sm md:text-base font-normal text-[#0d4a3a]/85 leading-relaxed max-w-xl">
                            {f.a}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </li>
                )
              })}
            </ul>
          </div>

        </div>
      </div>
    </section>
  )
}
