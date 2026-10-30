import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, MessageSquare, Star } from 'lucide-react'
import { Tag } from './landingShared'

const REVIEWS = [
  {
    id: 1,
    name: 'Penelope Miller',
    alias: '(Arjun)',
    role: 'Sr. Volunteer & Traveler',
    rating: '5.0',
    quote: 'They delivered exceptional service and deep environmental expertise. Highly recommended!',
  },
  {
    id: 2,
    name: 'Michael Hughes',
    alias: '(Meera)',
    role: 'Adventure Explorer',
    rating: '5.0',
    quote: 'What a fantastic experience! This tour was the perfect mix of luxury, adventure, and local culture. Every stop was unforgettable.',
  },
  {
    id: 3,
    name: 'Elena Rostova',
    alias: '(Kabir)',
    role: 'Travel Photographer',
    rating: '5.0',
    quote: 'From mountain passes to private coastal villas, Country Holidays InnSuites created a journey of pure magic for our family.',
  },
  {
    id: 4,
    name: 'David Chen',
    alias: '(Ananya)',
    role: 'Executive Member',
    rating: '5.0',
    quote: 'Flawless arrangements from flights to personal concierge guides. The best holiday experience we have ever had!',
  },
]

export default function TestimonialsSection() {
  const [activeIdx, setActiveIdx] = useState(0)
  const N = REVIEWS.length
  const current = REVIEWS[activeIdx]

  const prev = () => setActiveIdx((idx) => (idx - 1 + N) % N)
  const next = () => setActiveIdx((idx) => (idx + 1) % N)

  return (
    <section id="testimonials" className="relative bg-transparent py-8 md:py-12 text-[#0d4a3a] overflow-hidden">
      <div className="mx-auto w-full max-w-[1340px] px-6 lg:px-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          
          {/* Left Column: Heading & Review Stats */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            {/* Tag Eyebrow */}
            <div>
              <Tag>GUEST STORIES</Tag>
            </div>

            {/* Main Title with Quotes Badge */}
            <h2 className="font-rader text-[clamp(2.25rem,3.6vw,3.15rem)] font-bold tracking-tight text-[#063a2f] leading-[1.12]">
              Why They Believe <br />
              <span className="mt-2 inline-flex items-center gap-3">
                <span className="inline-flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-[#063a2f] text-[#fbd75b] shadow-md">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6 text-[#fbd75b]">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                </span>
                <span className="text-[#297f33]">In Us</span>
              </span>
            </h2>

            {/* Description */}
            <p className="font-varela text-base md:text-lg font-normal text-[#0d4a3a]/80 max-w-md">
              Our clients are highly satisfied and recommend our services across every journey.
            </p>

            {/* Write Review Button */}
            <div className="pt-2">
              <motion.a
                href="#contact"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-3 rounded-2xl border border-[#297f33]/20 bg-white/80 backdrop-blur-xl px-5 py-3.5 text-xs sm:text-sm font-semibold text-[#063a2f] shadow-[0_4px_20px_rgba(0,0,0,0.03)] transition-all hover:bg-white hover:border-[#297f33] hover:shadow-md"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#fbd75b] shadow-sm">
                  <MessageSquare className="h-3.5 w-3.5 text-[#063a2f]" />
                </span>
                <span className="font-varela">Write your honest review &rarr;</span>
              </motion.a>
            </div>
          </div>

          {/* Right Column: Pure Text Layered Stack Card Deck */}
          <div className="lg:col-span-7 relative flex flex-col items-center">
            
            {/* The Stack Wrapper */}
            <div className="relative w-full max-w-[620px] select-none">
              
              {/* Back Card 1 (deepest left) */}
              <div
                className="absolute inset-y-4 -left-7 w-full rounded-[2.2rem] bg-gradient-to-br from-emerald-100/40 via-[#eef7f0]/35 to-teal-50/25 border border-[#297f33]/20 backdrop-blur-md shadow-sm -rotate-3 pointer-events-none hidden sm:block"
                aria-hidden="true"
              />

              {/* Back Card 2 (middle left) */}
              <div
                className="absolute inset-y-2 -left-3.5 w-full rounded-[2.2rem] bg-gradient-to-br from-emerald-100/60 via-[#e8f5eb]/55 to-emerald-50/45 border border-[#297f33]/25 backdrop-blur-lg shadow-sm -rotate-1 pointer-events-none hidden sm:block"
                aria-hidden="true"
              />

              {/* Back Card 3 (peeking right) */}
              <div
                className="absolute inset-y-2 -right-3.5 w-full rounded-[2.2rem] bg-gradient-to-br from-emerald-100/50 via-[#ecf6ee]/45 to-teal-50/35 border border-[#297f33]/20 backdrop-blur-md shadow-sm rotate-1 pointer-events-none hidden sm:block"
                aria-hidden="true"
              />

              {/* Front Active Card: Frosted Glassmorphic Light Green Card with #297f33 Accent */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={current.id}
                  initial={{ opacity: 0, scale: 0.96, x: 20 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.96, x: -20 }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  className="relative z-10 w-full min-h-[280px] sm:min-h-[320px] flex flex-col justify-between rounded-2xl sm:rounded-[2.2rem] border-2 border-[#297f33]/30 bg-gradient-to-br from-emerald-50/95 via-[#edf6ef]/90 to-emerald-100/80 backdrop-blur-2xl p-5 sm:p-8 sm:p-10 text-[#0b1f12] lp-shadow-combo hover:border-[#297f33] transition-all duration-300"
                >
                  {/* Top Bar: Rating Badge + Decorative Quote Mark */}
                  <div className="flex items-center justify-between">
                    <div className="inline-flex items-center gap-1.5 rounded-full border border-[#297f33]/25 bg-white/90 backdrop-blur-md px-3 py-1 sm:px-4 sm:py-1.5 text-xs font-medium text-[#297f33] shadow-xs">
                      <span className="font-varela">Rating</span>
                      <Star className="h-3.5 w-3.5 fill-[#fbd75b] text-[#fbd75b]" />
                      <span className="font-varela font-bold text-sm">{current.rating}</span>
                    </div>

                    <span className="text-3xl sm:text-4xl font-serif font-black text-[#fbd75b] leading-none select-none">
                      “
                    </span>
                  </div>

                  {/* Review Quote Text */}
                  <div className="my-4 sm:my-6">
                    <blockquote className="font-varela text-sm sm:text-base md:text-lg font-normal leading-relaxed text-[#063a2f]">
                      "{current.quote}"
                    </blockquote>
                  </div>

                  {/* Author Info */}
                  <div className="pt-4 sm:pt-5 border-t border-[#297f33]/15 flex items-center justify-between flex-wrap gap-2">
                    <div>
                      <h3 className="font-varela text-base sm:text-[clamp(1.25rem,1.6vw,1.5rem)] font-bold text-[#063a2f] flex items-center gap-2 flex-wrap">
                        <span>{current.name}</span>
                        <span className="font-varela text-xs sm:text-sm font-normal text-slate-500">{current.alias}</span>
                      </h3>
                      <p className="font-varela text-xs sm:text-sm font-normal text-slate-500 mt-0.5">
                        {current.role}
                      </p>
                    </div>

                    <span className="font-varela text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-[#297f33] border border-[#297f33]/35 bg-emerald-100/60 backdrop-blur-md rounded-full px-2.5 sm:px-3.5 py-0.5 sm:py-1 shadow-xs">
                      Verified Traveler
                    </span>
                  </div>
                </motion.div>
              </AnimatePresence>

            </div>

            {/* Deck Navigation Controls */}
            <div className="mt-8 flex items-center justify-center gap-4 z-20">
              <button
                type="button"
                onClick={prev}
                aria-label="Previous testimonial"
                className="grid h-10 w-10 place-items-center rounded-full border border-white/90 bg-white/80 backdrop-blur-md text-[#063a2f] shadow-sm transition-all hover:bg-[#063a2f] hover:text-white hover:scale-105 active:scale-95"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              {/* Dots */}
              <div className="flex items-center gap-2 px-2">
                {REVIEWS.map((_, dotIdx) => (
                  <button
                    key={dotIdx}
                    type="button"
                    onClick={() => setActiveIdx(dotIdx)}
                    aria-label={`Go to slide ${dotIdx + 1}`}
                    className={`h-2.5 rounded-full transition-all duration-300 ${
                      dotIdx === activeIdx
                        ? 'w-8 bg-[#063a2f]'
                        : 'w-2.5 bg-[#063a2f]/25 hover:bg-[#063a2f]/50'
                    }`}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={next}
                aria-label="Next testimonial"
                className="grid h-10 w-10 place-items-center rounded-full border border-white/90 bg-white/80 backdrop-blur-md text-[#063a2f] shadow-sm transition-all hover:bg-[#063a2f] hover:text-white hover:scale-105 active:scale-95"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>

          </div>

        </div>
      </div>
    </section>
  )
}
