import { useRef, useState } from 'react'
import {
  AnimatePresence,
  motion,
  useInView,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { testimonials } from '../../data/testimonials'

const EASE = [0.22, 1, 0.36, 1]
const SCROLL_PER_SLIDE = 75 // svh of scrolling each testimonial gets

const pad = (n) => String(n).padStart(2, '0')
const clamp = (v, a, b) => Math.min(b, Math.max(a, v))

const getInitials = (name) =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('')

/* long quotes get a slightly smaller size so they always fit the screen */
const sizeFactor = (n) => (n > 70 ? 0.62 : n > 50 ? 0.78 : 1)

/* ------------------------------------------------------------------
   One word of the quote: lights up as the page scrolls
------------------------------------------------------------------- */
function Word({ word, i, n, index, total, progress }) {
  const opacity = useTransform(progress, (v) => {
    const local = v * total - index // 0..1 inside this slide
    const t = (local - 0.1) / 0.62 // words light up between 10% and 72%
    return clamp(0.16 + (t * n - i) * 0.84, 0.16, 1)
  })
  const y = useTransform(opacity, [0.16, 1], [10, 0])
  return (
    <span className="mr-[0.24em] inline-block">
      <motion.span style={{ opacity, y }} className="inline-block">
        {word}
      </motion.span>
    </span>
  )
}

/* One segment of the progress bar */
function Segment({ i, total, progress }) {
  const scaleX = useTransform(progress, (v) => clamp(v * total - i, 0, 1))
  return (
    <span className="block h-[2px] w-full overflow-hidden bg-[#efeae0]/20" aria-hidden="true">
      <motion.span style={{ scaleX }} className="block h-full origin-left bg-[#ff5938]" />
    </span>
  )
}

/* ------------------------------------------------------------------
   Pinned, scroll-driven version
------------------------------------------------------------------- */
function PinnedTestimonials() {
  const total = Math.max(testimonials.length, 1)
  const sectionRef = useRef(null)
  const stageRef = useRef(null)
  const [active, setActive] = useState(0)
  const entered = useInView(stageRef, { once: true, amount: 0.4 })

  const { scrollYProgress: p } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })

  useMotionValueEvent(p, 'change', (v) => {
    const nextActive = clamp(Math.round(v * total), 0, total - 1)
    setActive((prev) => (prev === nextActive ? prev : nextActive))
  })

  const ghostX = useTransform(p, [0, 1], ['6%', '-34%'])
  const glowX = useTransform(p, [0, 1], ['-25vw', '25vw'])
  const cueOpacity = useTransform(p, [0, 0.05], [1, 0])

  const goTo = (i) => {
    const el = sectionRef.current
    if (!el) return

    const target = clamp(i, 0, total - 1)
    const top = el.getBoundingClientRect().top + window.scrollY
    const range = Math.max(el.offsetHeight - window.innerHeight, 0)
    const offset = range === 0 ? 0 : ((target + 0.35) / total) * range

    window.scrollTo({ top: top + offset, behavior: 'smooth' })
  }

  const current = testimonials[active] || testimonials[0]
  const words = String(current.quote).split(' ')
  const factor = sizeFactor(words.length)

  return (
    <section
      ref={sectionRef}
      aria-label="Guest testimonials"
      style={{
        background: '#0d0d0c',
        color: '#efeae0',
        height: `calc(100svh + ${(total - 1) * SCROLL_PER_SLIDE}svh)`,
      }}
      className="relative"
    >
      <div
        ref={stageRef}
        className="sticky top-0 flex h-[100svh] flex-col overflow-hidden px-5 pb-5 pt-5 sm:px-8 sm:pb-7 sm:pt-7"
      >
        {/* moving glow + ghost word */}
        <motion.div
          aria-hidden
          style={{ x: glowX }}
          className="pointer-events-none absolute -bottom-[25%] left-1/2 h-[60vh] w-[70vw] -translate-x-1/2 rounded-full bg-[#ff5938]/25 blur-[140px]"
        />
        <motion.div
          aria-hidden
          style={{ x: ghostX }}
          className="pointer-events-none absolute left-0 top-[10%] select-none whitespace-nowrap font-sans text-[clamp(160px,30vw,520px)] font-semibold uppercase leading-none tracking-[-0.07em] text-transparent opacity-[0.12] [-webkit-text-stroke:1.5px_#efeae0]"
        >
          Stories&nbsp;Stories
        </motion.div>

        <div className="relative mx-auto flex h-full w-full max-w-[1600px] flex-col">
          {/* top bar */}
          <header className="flex items-center justify-between text-[11px] font-medium uppercase tracking-[0.14em] sm:text-xs">
            <motion.span
              initial={{ opacity: 0, y: -12 }}
              animate={entered ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, ease: EASE }}
              className="flex items-center gap-2"
            >
              <span className="h-2 w-2 animate-pulse rounded-full bg-[#ff5938]" />
              Guest stories
            </motion.span>

            <motion.span
              initial={{ opacity: 0, y: -12 }}
              animate={entered ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, ease: EASE, delay: 0.1 }}
              className="flex items-center gap-4"
            >
              {/* rolling counter */}
              <span className="flex items-baseline gap-1 tabular-nums" aria-live="polite">
                <span className="relative inline-flex h-[1.2em] overflow-hidden">
                  <AnimatePresence mode="popLayout" initial={false}>
                    <motion.span
                      key={active}
                      initial={{ y: '100%' }}
                      animate={{ y: 0 }}
                      exit={{ y: '-100%' }}
                      transition={{ duration: 0.5, ease: EASE }}
                      className="inline-block text-[#ff5938]"
                    >
                      {pad(active + 1)}
                    </motion.span>
                  </AnimatePresence>
                </span>
                <span className="text-[#efeae0]/50">/ {pad(total)}</span>
              </span>
              <span className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => goTo(active - 1)}
                  aria-label="Previous testimonial"
                  className="grid h-10 w-10 place-items-center rounded-full border border-[#efeae0]/50 transition-colors duration-300 hover:bg-[#efeae0] hover:text-[#0d0d0c] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ff5938]"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => goTo(active + 1)}
                  aria-label="Next testimonial"
                  className="grid h-10 w-10 place-items-center rounded-full bg-[#ff5938] text-[#0d0d0c] transition-colors duration-300 hover:bg-[#ff6e51] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ff5938] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0d0d0c]"
                >
                  <ArrowRight className="h-4 w-4" />
                </button>
              </span>
            </motion.span>
          </header>

          {/* quote */}
          <div className="relative flex min-h-0 flex-1 items-center py-6">
            <div className="w-full max-w-[1250px]">
              <motion.span
                aria-hidden
                initial={{ opacity: 0, scale: 0.6 }}
                animate={entered ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.8, ease: EASE }}
                className="block font-serif text-[clamp(70px,13svh,170px)] italic leading-[0.6] text-[#ff5938]"
              >
                &ldquo;
              </motion.span>

              <AnimatePresence mode="wait" initial={false}>
                <motion.blockquote
                  key={active}
                  initial={{ opacity: 0, y: 28, filter: 'blur(10px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: -28, filter: 'blur(10px)' }}
                  transition={{ duration: 0.55, ease: EASE }}
                  className="m-0 mt-4"
                >
                  <p
                    className="m-0 font-sans font-semibold leading-[1.06] tracking-[-0.04em]"
                    style={{ fontSize: `calc(clamp(22px, min(5vw, 6.6svh), 80px) * ${factor})` }}
                  >
                    {words.map((w, i) => (
                      <Word
                        key={i}
                        word={w}
                        i={i}
                        n={words.length}
                        index={active}
                        total={total}
                        progress={p}
                      />
                    ))}
                  </p>

                  <footer className="mt-7 flex items-center gap-4">
                    <span className="grid h-14 w-14 flex-none place-items-center rounded-full bg-[#efeae0] font-sans text-lg font-semibold tracking-[-0.03em] text-[#0d0d0c]">
                      {getInitials(current.author)}
                    </span>
                    <div>
                      <p className="m-0 font-sans text-[clamp(16px,2.4svh,24px)] font-semibold uppercase tracking-[-0.02em]">
                        {current.author}
                      </p>
                      <p className="m-0 mt-1 font-serif text-[15px] italic text-[#ff5938]">{current.trip}</p>
                    </div>
                  </footer>
                </motion.blockquote>
              </AnimatePresence>
            </div>
          </div>

          {/* segmented progress: one bar per story, click to jump */}
          <nav aria-label="Choose a testimonial" className="relative">
            <motion.div
              style={{ opacity: cueOpacity }}
              aria-hidden
              className="pointer-events-none absolute -top-9 right-0 flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.14em] text-[#efeae0]/70"
            >
              Scroll to read
              <span className="relative block h-8 w-px overflow-hidden bg-[#efeae0]/20">
                <span className="absolute inset-x-0 top-0 h-3 animate-[tm-cue_1.6s_ease-in-out_infinite] bg-[#ff5938]" />
              </span>
            </motion.div>

            <div
              className="grid gap-2 sm:gap-4"
              style={{ gridTemplateColumns: `repeat(${total}, minmax(0, 1fr))` }}
            >
              {testimonials.map((t, i) => (
                <button
                  key={t.author}
                  type="button"
                  onClick={() => goTo(i)}
                  aria-label={`Go to testimonial ${i + 1}: ${t.author}`}
                  aria-current={i === active}
                  className="group py-3 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ff5938]"
                >
                  <Segment i={i} total={total} progress={p} />
                  <span
                    className={`mt-3 hidden truncate font-sans text-[12px] font-semibold uppercase tracking-[-0.01em] transition-opacity duration-300 sm:block ${
                      i === active ? 'opacity-100' : 'opacity-40 group-hover:opacity-80'
                    }`}
                  >
                    {t.author}
                  </span>
                </button>
              ))}
            </div>
          </nav>
        </div>
      </div>

      <style>{`
        @keyframes tm-cue {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(300%); }
        }
      `}</style>
    </section>
  )
}

/* ------------------------------------------------------------------
   Calm fallback: reduced motion, or a single testimonial
------------------------------------------------------------------- */
function StaticTestimonials() {
  return (
    <section
      aria-label="Guest testimonials"
      style={{ background: '#0d0d0c', color: '#efeae0' }}
      className="relative px-5 py-20 sm:px-8 sm:py-28"
    >
      <div className="mx-auto w-full max-w-[1100px]">
        <p className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.14em] sm:text-xs">
          <span className="h-2 w-2 rounded-full bg-[#ff5938]" />
          Guest stories
        </p>
        <ul className="m-0 mt-10 list-none space-y-16 p-0">
          {testimonials.map((t) => (
            <li key={t.author} className="border-t border-[#efeae0]/20 pt-8">
              <blockquote className="m-0">
                <p className="m-0 font-sans text-[clamp(22px,3.4vw,44px)] font-semibold leading-[1.1] tracking-[-0.04em]">
                  {t.quote}
                </p>
                <footer className="mt-6 flex items-center gap-4">
                  <span className="grid h-12 w-12 flex-none place-items-center rounded-full bg-[#efeae0] font-sans text-base font-semibold text-[#0d0d0c]">
                    {getInitials(t.author)}
                  </span>
                  <div>
                    <p className="m-0 font-sans text-base font-semibold uppercase tracking-[-0.02em]">
                      {t.author}
                    </p>
                    <p className="m-0 mt-1 font-serif text-[15px] italic text-[#ff5938]">{t.trip}</p>
                  </div>
                </footer>
              </blockquote>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export default function TestimonialsSection() {
  const reduced = useReducedMotion()
  if (!testimonials.length) return null
  return reduced || testimonials.length < 2 ? <StaticTestimonials /> : <PinnedTestimonials />
}