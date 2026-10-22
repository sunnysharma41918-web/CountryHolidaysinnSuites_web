import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { testimonials } from '../../data/testimonials'

const AUTOPLAY_MS = 7000
const EASE = [0.22, 1, 0.36, 1]

const pad = (n) => String(n).padStart(2, '0')

const getInitials = (name) =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('')

export default function TestimonialsSection() {
  const total = testimonials.length
  const reduced = !!useReducedMotion()
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const [inView, setInView] = useState(false)
  const sectionRef = useRef(null)

  const go = (i) => setActive((i + total) % total)

  // Start once the section is on screen
  useEffect(() => {
    const node = sectionRef.current
    if (!node) return undefined
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true)
          io.disconnect()
        }
      },
      { threshold: 0.25 }
    )
    io.observe(node)
    return () => io.disconnect()
  }, [])

  // Autoplay: resets whenever the active slide changes (so clicks restart the timer)
  useEffect(() => {
    if (!inView || paused || total < 2 || reduced) return undefined
    const id = setTimeout(() => setActive((p) => (p + 1) % total), AUTOPLAY_MS)
    return () => clearTimeout(id)
  }, [inView, paused, total, reduced, active])

  const onKeyDown = (e) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault()
      go(active + 1)
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault()
      go(active - 1)
    }
  }

  const current = testimonials[active]
  const words = String(current.quote).split(' ')

  return (
    <section
      ref={sectionRef}
      style={{ background: '#0d0d0c', color: '#efeae0' }}
      className="relative overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* glow + ghost word */}
      <div aria-hidden className="pointer-events-none absolute -bottom-[25%] left-1/2 h-[60vh] w-[70vw] -translate-x-1/2 rounded-full bg-[#ff5938]/25 blur-[140px]" />
      <div
        aria-hidden
        className="pointer-events-none absolute left-[-2%] top-[8%] select-none font-sans text-[clamp(160px,30vw,520px)] font-semibold uppercase leading-none tracking-[-0.07em] text-transparent opacity-[0.12] [-webkit-text-stroke:1.5px_#efeae0]"
      >
        Stories
      </div>

      <div className="relative mx-auto flex min-h-[100svh] w-full max-w-[1600px] flex-col px-5 pb-5 pt-5 sm:px-8 sm:pb-7 sm:pt-7">
        {/* top bar */}
        <header className="flex items-center justify-between text-[11px] font-medium uppercase tracking-[0.14em] sm:text-xs">
          <span className="flex items-center gap-2">
            <span className="h-2 w-2 animate-pulse rounded-full bg-[#ff5938]" />
            Guest stories
          </span>
          <span className="hidden sm:block">Hospitality that feels personal</span>
          <span className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => go(active - 1)}
              aria-label="Previous testimonial"
              className="grid h-10 w-10 place-items-center rounded-full border border-[#efeae0]/50 transition-colors duration-300 hover:bg-[#efeae0] hover:text-[#0d0d0c] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ff5938]"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => go(active + 1)}
              aria-label="Next testimonial"
              className="grid h-10 w-10 place-items-center rounded-full bg-[#ff5938] text-[#0d0d0c] transition-colors duration-300 hover:bg-[#ff6e51] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ff5938] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0d0d0c]"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </span>
        </header>

        {/* quote */}
        <div className="relative flex flex-1 items-center py-10" aria-live="polite">
          <div className="w-full max-w-[1250px]">
            <motion.span
              aria-hidden
              initial={reduced ? false : { opacity: 0, scale: 0.6 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.8, ease: EASE }}
              className="block font-serif text-[clamp(90px,16svh,200px)] italic leading-[0.6] text-[#ff5938]"
            >
              &ldquo;
            </motion.span>

            <AnimatePresence mode="wait" initial={false}>
              <motion.div key={active} exit={{ opacity: 0, y: -16, transition: { duration: 0.3 } }}>
                <p className="m-0 mt-4 font-sans text-[clamp(24px,min(4.4vw,7svh),72px)] font-semibold leading-[1.05] tracking-[-0.04em]">
                  {words.map((w, i) => (
                    <span key={i} className="mr-[0.24em] inline-block overflow-hidden pb-[0.1em] align-bottom">
                      <motion.span
                        className="inline-block"
                        initial={reduced ? false : { y: '110%', rotate: 3 }}
                        animate={inView ? { y: 0, rotate: 0 } : {}}
                        transition={{ duration: 0.8, ease: EASE, delay: Math.min(i * 0.025, 0.9) }}
                      >
                        {w}
                      </motion.span>
                    </span>
                  ))}
                </p>

                <motion.div
                  initial={reduced ? false : { opacity: 0, y: 14 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.7, ease: EASE, delay: 0.35 }}
                  className="mt-8 flex items-center gap-4"
                >
                  <span className="grid h-14 w-14 flex-none place-items-center rounded-full bg-[#efeae0] font-sans text-lg font-semibold tracking-[-0.03em] text-[#0d0d0c]">
                    {getInitials(current.author)}
                  </span>
                  <div>
                    <p className="m-0 font-sans text-[clamp(16px,2.4svh,24px)] font-semibold uppercase tracking-[-0.02em]">{current.author}</p>
                    <p className="m-0 mt-1 font-serif text-[15px] italic text-[#ff5938]">{current.trip}</p>
                  </div>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* author tabs with autoplay progress */}
        <div
          role="tablist"
          aria-label="Choose a testimonial"
          onKeyDown={onKeyDown}
          className="grid auto-cols-[minmax(210px,1fr)] grid-flow-col gap-x-6 overflow-x-auto border-t border-[#efeae0]/20 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {testimonials.map((t, i) => {
            const on = i === active
            return (
              <button
                key={t.author}
                id={`tm-tab-${i}`}
                type="button"
                role="tab"
                aria-selected={on}
                tabIndex={on ? 0 : -1}
                onClick={() => go(i)}
                className={`group relative pb-1 pt-5 text-left transition-opacity duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ff5938] ${
                  on ? 'opacity-100' : 'opacity-45 hover:opacity-90'
                }`}
              >
                {/* progress bar sits on the divider line */}
                <span className="absolute -top-px left-0 h-[2px] w-full overflow-hidden" aria-hidden="true">
                  {on && (
                    <span
                      key={`${active}-${inView}`}
                      className="block h-full w-full origin-left bg-[#ff5938]"
                      style={{
                        animation: inView && !reduced ? `tm-progress ${AUTOPLAY_MS}ms linear forwards` : 'none',
                        animationPlayState: paused ? 'paused' : 'running',
                      }}
                    />
                  )}
                </span>
                <span className="flex items-baseline gap-3">
                  <span className="font-sans text-[clamp(26px,3.6svh,40px)] font-semibold leading-none tracking-[-0.05em] text-[#ff5938]">
                    {pad(i + 1)}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate font-sans text-[14px] font-semibold uppercase tracking-[-0.01em]">{t.author}</span>
                    <span className="block truncate text-[12px] text-[#efeae0]/65">{t.trip}</span>
                  </span>
                </span>
              </button>
            )
          })}
        </div>
      </div>

      <style>{`
        @keyframes tm-progress { from { transform: scaleX(0); } to { transform: scaleX(1); } }
      `}</style>
    </section>
  )
}