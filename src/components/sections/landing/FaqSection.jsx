import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Mail, Plus } from 'lucide-react'
import { EASE, GREEN, WRAP, YELLOW, Reveal, Tag, Pill } from './landingShared'

const FAQS = [
  {
    q: 'How do I book a trip?',
    a: 'Browse our destinations and resorts, select your preferred stay or travel package, and submit an inquiry. Our team will help you with the booking process.',
  },
  {
    q: 'Can I change or cancel after booking?',
    a: 'Yes, booking changes and cancellations are subject to the applicable booking terms and cancellation policy. Please contact our support team for assistance.',
  },
  {
    q: 'What payment options do you accept?',
    a: 'We will share the available payment methods and payment instructions during the reservation process.',
  },
  {
    q: 'Do you help with visas and insurance?',
    a: 'We can guide you regarding available visa assistance and travel insurance options, depending on your destination and service availability.',
  },
  {
    q: 'Can you plan a trip for a large group?',
    a: 'Absolutely! Share your destination, travel dates, group size, and preferences with our team for a customized travel plan.',
  },
  {
    q: 'What if something goes wrong while I am travelling?',
    a: 'Please contact our support team using the contact details provided with your booking. We will guide you toward the available assistance.',
  },
]

export default function FaqSection() {
  const [open, setOpen] = useState(0)

  return (
    <section
      id="faq"
      className="relative flex flex-col justify-center overflow-hidden bg-transparent py-8 md:py-12 text-[#0d4a3a]"
    >
      <div className={`${WRAP} flex flex-col justify-center`}>
        {/* Section Header: Centered on top */}
        <div className="mx-auto max-w-2xl text-center mb-6 md:mb-8">
          <Reveal>
            <div className="flex justify-center"><Tag>COMMON QUESTIONS</Tag></div>
            <h2 className="font-rader mt-3 text-[clamp(2.25rem,3.6vw,3.15rem)] font-bold tracking-tight text-[#063a2f] leading-[1.12]">
              Frequently Asked <span className="text-[#297f33]">Questions</span>
            </h2>
            <p className="font-varela mt-3 text-base md:text-lg font-normal text-[#0d4a3a]/80 leading-relaxed">
              Can’t find your answer? A real person will reply, usually within a few hours.
            </p>
          </Reveal>
        </div>

        {/* FAQ Questions Accordion (Directly below heading) */}
        <div className="mx-auto w-full max-w-4xl">
          <ul className="flex flex-col gap-3">
            {FAQS.map((f, i) => {
              const isOpen = open === i
              return (
                <li
                  key={f.q}
                  className="rounded-2xl border backdrop-blur-xl transition-all shadow-xs overflow-hidden"
                  style={{
                    borderColor: isOpen ? '#297f33' : 'rgba(41, 127, 51, 0.2)',
                    background: isOpen ? 'rgba(255, 255, 255, 0.94)' : 'rgba(255, 255, 255, 0.8)',
                    boxShadow: isOpen
                      ? '0 16px 38px -10px rgba(11, 31, 18, 0.18), 0 0 25px -4px rgba(41, 127, 51, 0.16), 0 4px 15px rgba(251, 215, 91, 0.1)'
                      : '0 8px 25px -8px rgba(11, 31, 18, 0.08), 0 0 16px -4px rgba(41, 127, 51, 0.06)',
                  }}
                >
                  <h3>
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={`faq-panel-${i}`}
                      id={`faq-button-${i}`}
                      onClick={() => setOpen(isOpen ? -1 : i)}
                      className="flex w-full items-center justify-between gap-3 sm:gap-4 px-4 sm:px-6 py-3.5 sm:py-4.5 text-left transition-colors"
                    >
                      <span className="font-varela text-sm sm:text-base md:text-lg font-bold text-[#063a2f]">
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
                        <p className="font-varela px-4 sm:px-6 pb-4 text-xs sm:text-sm md:text-base font-normal text-[#0d4a3a]/85 leading-relaxed max-w-2xl">
                          {f.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              )
            })}
          </ul>

          {/* Email a Planner CTA */}
          <div className="mt-8 sm:mt-10 flex justify-center">
            <Pill href="mailto:hello@example.com" className="font-varela">
              <Mail className="h-4 w-4" />
              Email a planner
            </Pill>
          </div>
        </div>
      </div>
    </section>
  )
}
