import { useState } from 'react'
import {
  AnimatePresence,
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
} from 'framer-motion'
import { ArrowUpRight, Star } from 'lucide-react'
import { testimonials } from '../../data/testimonials'

const EASE = [0.16, 1, 0.3, 1]

const getInitials = (name = '') =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()

/* Featured quote: words fade in one after another each time it changes */
function Quote({ text, reduce }) {
  const words = text.split(' ')
  return (
    <motion.blockquote
      initial="hidden"
      animate="show"
      transition={{ staggerChildren: reduce ? 0 : 0.03, delayChildren: 0.15 }}
      className="text-[clamp(1.25rem,min(2.5vw,4vh),2.6rem)] font-medium leading-[1.25] tracking-[-0.02em] text-white"
      style={{ fontFamily: "'Outfit', sans-serif" }}
    >
      {words.map((w, i) => (
        <motion.span
          key={i}
          variants={{
            hidden: { opacity: 0, y: 14 },
            show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
          }}
          className="mr-[0.22em] inline-block"
        >
          {w}
        </motion.span>
      ))}
    </motion.blockquote>
  )
}

export default function TripTestimonialsSection() {
  const [active, setActive] = useState(0)
  const reduce = useReducedMotion()
  const featured = testimonials[active] || testimonials[0]
  const others = testimonials.map((t, i) => ({ ...t, index: i })).filter((t) => t.index !== active)

  /* cursor spotlight on the featured card */
  const mx = useMotionValue(-600)
  const my = useMotionValue(-600)
  const spotlight = useMotionTemplate`radial-gradient(420px circle at ${mx}px ${my}px, rgba(255,89,56,0.16), transparent 65%)`
  
  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect()
    mx.set(e.clientX - r.left)
    my.set(e.clientY - r.top)
  }

  if (!featured) return null

  const featuredName = featured.author || featured.name || 'Verified Traveler'
  const featuredTrip = featured.trip || featured.role || 'Alpine Expedition'

  return (
    <section
      id="testimonials"
      className="relative min-h-[100svh] w-full overflow-hidden bg-[#f7f7f5] text-slate-950 lg:h-[100svh]"
    >
      <div className="mx-auto flex h-full max-w-[1440px] flex-col gap-6 px-4 py-10 sm:px-8 lg:gap-5 lg:px-12 lg:py-8">
        {/* Header */}
        <div className="flex shrink-0 flex-col gap-4 border-t border-slate-950 pt-3 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="flex items-center gap-2 text-sm font-medium">
              <span className="h-2 w-2 animate-pulse rounded-full bg-[#ff5938] ring-1 ring-slate-950" />
              Guest reflections
            </span>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.9, ease: EASE }}
              className="mt-2 max-w-3xl text-[clamp(1.9rem,min(5vw,7.5vh),4.5rem)] font-semibold leading-[1] tracking-[-0.04em]"
              style={{ fontFamily: "'Outfit', sans-serif" }}
            >
              Hospitality that feels personal.
            </motion.h2>
          </div>
          <p className="max-w-xs text-sm leading-relaxed text-slate-600">
            Words from travelers who valued the warmth, design and ease of each experience.
          </p>
        </div>

        <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 lg:grid-cols-12 lg:gap-5">
          {/* Featured quote card */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.9, ease: EASE }}
            onMouseMove={onMove}
            onMouseLeave={() => {
              mx.set(-600)
              my.set(-600)
            }}
            className="relative flex min-h-[22rem] flex-col justify-between overflow-hidden rounded-[28px] bg-slate-950 p-6 sm:p-8 lg:col-span-7 lg:min-h-0 lg:p-10 shadow-xl"
          >
            <motion.div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{ background: spotlight }}
            />

            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={featured.id || featuredName}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.3 }}
                className="relative flex h-full flex-col justify-between gap-6"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <motion.span
                      aria-hidden
                      initial={{ scale: 0, rotate: -30, opacity: 0 }}
                      animate={{ scale: 1, rotate: 0, opacity: 1 }}
                      transition={{ duration: 0.8, ease: EASE }}
                      className="block h-14 origin-bottom-left text-[6rem] font-semibold leading-[0.8] text-[#ff5938]"
                      style={{ fontFamily: "'Outfit', sans-serif" }}
                    >
                      “
                    </motion.span>

                    {/* Star Rating */}
                    <div className="flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 backdrop-blur-md">
                      {[...Array(featured.rating || 5)].map((_, idx) => (
                        <Star key={idx} className="h-3.5 w-3.5 fill-[#ff5938] text-[#ff5938]" />
                      ))}
                    </div>
                  </div>

                  <div className="mt-2">
                    <Quote text={featured.quote} reduce={reduce} />
                  </div>
                </div>

                <div className="flex items-center gap-4 border-t border-white/15 pt-5">
                  {featured.avatar ? (
                    <img
                      src={featured.avatar}
                      alt={featuredName}
                      className="h-12 w-12 shrink-0 rounded-full object-cover border-2 border-[#ff5938] shadow-md"
                    />
                  ) : (
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#ff5938] text-sm font-bold text-slate-950">
                      {getInitials(featuredName)}
                    </span>
                  )}
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-white">{featuredName}</p>
                    <p className="truncate text-sm text-white/60">{featuredTrip}</p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* Other reflections: tap one to bring it forward */}
          <div className="flex min-h-0 flex-col gap-4 lg:col-span-5 lg:gap-4">
            {others.map((t, i) => {
              const otherName = t.author || t.name || 'Verified Traveler'
              const otherTrip = t.trip || t.role || 'Alpine Trip'

              return (
                <motion.button
                  layout
                  key={t.id || otherName}
                  type="button"
                  onClick={() => setActive(t.index)}
                  initial={{ opacity: 0, x: 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{
                    duration: 0.8,
                    delay: 0.15 + i * 0.1,
                    ease: EASE,
                    layout: { duration: 0.5, ease: EASE },
                  }}
                  className="group relative flex min-h-0 flex-1 flex-col justify-between overflow-hidden rounded-[24px] sm:rounded-[28px] border border-slate-950/10 bg-white p-5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 sm:p-5 shadow-sm hover:shadow-md transition-shadow"
                >
                  <span
                    aria-hidden
                    className="absolute inset-0 translate-y-full bg-[#ff5938] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0 group-focus-visible:translate-y-0"
                  />
                  <div className="relative flex items-start justify-between gap-4">
                    <p className="line-clamp-3 text-sm leading-relaxed text-slate-700 transition-colors duration-300 group-hover:text-slate-950 sm:text-base">
                      “{t.quote}”
                    </p>
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-950/20 text-slate-950 transition-all duration-500 group-hover:rotate-45 group-hover:border-slate-950 group-hover:bg-slate-950 group-hover:text-[#ff5938]">
                      <ArrowUpRight className="h-4 w-4" />
                    </span>
                  </div>

                  <div className="relative mt-3 flex items-center gap-3">
                    {t.avatar ? (
                      <img
                        src={t.avatar}
                        alt={otherName}
                        className="h-9 w-9 shrink-0 rounded-full object-cover border border-slate-950/20 shadow-sm"
                      />
                    ) : (
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-950 text-xs font-bold text-[#ff5938]">
                        {getInitials(otherName)}
                      </span>
                    )}
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-900 group-hover:text-black">
                        {otherName}
                      </p>
                      <p className="truncate text-xs text-slate-500 transition-colors duration-300 group-hover:text-slate-800">
                        {otherTrip}
                      </p>
                    </div>
                  </div>
                </motion.button>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}