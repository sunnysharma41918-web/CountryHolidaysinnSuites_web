import { useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Star } from 'lucide-react'
import { testimonials } from '../../data/testimonials'

const EASE = [0.16, 1, 0.3, 1]

const clampIndex = (value, max) => Math.min(Math.max(value, 0), max)

export default function TripTestimonialsSection() {
  const [active, setActive] = useState(0)
  const reduce = useReducedMotion()

  if (!testimonials.length) return null

  const current = testimonials[active] || testimonials[0]
  const next = () => setActive((prev) => clampIndex(prev + 1, testimonials.length - 1))
  const prev = () => setActive((prev) => clampIndex(prev - 1, testimonials.length - 1))

  const name = current.author || current.name || 'Verified Traveler'
  const trip = current.trip || current.role || 'Travel guest'

  return (
    <section
      id="testimonials"
      className="relative overflow-hidden bg-[#f3f8e6] py-16 text-[#0b1f12] sm:py-20"
    >
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.18),transparent_36%)]" />

      <div className="relative mx-auto max-w-[1400px] px-4 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-5xl text-center">
          <h2
            className="text-[clamp(2.1rem,4vw,4rem)] font-semibold leading-[1.05] tracking-[-0.04em] text-[#0b1f12]"
            style={{ fontFamily: "'Outfit', sans-serif" }}
          >
            What our customer said
          </h2>


          <div className="relative mt-8 sm:mt-10 flex flex-col items-center sm:flex-row sm:justify-center sm:gap-6 lg:gap-8">
            {/* Desktop / tablet left button */}
            <button
              type="button"
              aria-label="Previous testimonial"
              onClick={prev}
              className="hidden sm:inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[#0b1f12]/20 bg-white/60 text-[#0b1f12] transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0b1f12]/40"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>

            <div className="w-full max-w-4xl min-w-0">
              <AnimatePresence mode="wait">
                <motion.div
                  key={current.id || name}
                  initial={reduce ? false : { opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduce ? {} : { opacity: 0, y: -18 }}
                  transition={{ duration: 0.45, ease: EASE }}
                  className="rounded-[28px] px-2 py-3 sm:px-8 sm:py-4"
                >
                  <div className="flex items-center justify-center gap-1 text-[#d4a22c]">
                    {[...Array(current.rating || 5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 sm:h-5 sm:w-5 fill-[#d4a22c] text-[#d4a22c]" />
                    ))}
                    <span className="ml-2.5 text-xs sm:text-sm font-medium uppercase tracking-[0.16em] text-[#0b1f12]">
                      {name.toUpperCase()}
                    </span>
                  </div>

                  <p className="mt-4 sm:mt-5 text-sm sm:text-base md:text-lg leading-relaxed text-[#0b1f12]/85">
                    “{current.quote}”
                  </p>

                  <div className="mt-4 sm:mt-5 text-center">
                    <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#0b1f12]">
                      {name}
                    </p>
                    <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-[#0b1f12]/65">
                      {trip}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Desktop / tablet right button */}
            <button
              type="button"
              aria-label="Next testimonial"
              onClick={next}
              className="hidden sm:inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[#0b1f12]/20 bg-white/60 text-[#0b1f12] transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0b1f12]/40"
            >
              <ArrowRight className="h-5 w-5" />
            </button>

            {/* Mobile-only navigation buttons below quote */}
            <div className="flex sm:hidden items-center justify-center gap-4 mt-2">
              <button
                type="button"
                aria-label="Previous testimonial"
                onClick={prev}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#0b1f12]/20 bg-white/80 text-[#0b1f12] active:scale-95"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
              <span className="text-xs font-semibold text-[#0b1f12]/60">
                {active + 1} / {testimonials.length}
              </span>
              <button
                type="button"
                aria-label="Next testimonial"
                onClick={next}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#0b1f12]/20 bg-white/80 text-[#0b1f12] active:scale-95"
              >
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}