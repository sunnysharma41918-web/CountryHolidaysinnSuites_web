import { useEffect, useRef } from 'react'
import {
  motion,
  animate,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from 'framer-motion'
import { ArrowDown, ArrowUpRight } from 'lucide-react'

const EASE = [0.16, 1, 0.3, 1]

const TRUST_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=160&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=160&q=80',
]

/* A headline line: every letter rises out of a mask, then gently waves */
function MaskedLine({ text, delay = 0, className = '' }) {
  return (
    <span className={`flex justify-center overflow-hidden px-[0.04em] pb-[0.1em] ${className}`} aria-hidden="true">
      {text.split('').map((ch, i) => (
        <motion.span
          key={i}
          className="inline-block whitespace-pre transition-colors duration-300 hover:text-[#efeae0]"
          initial={{ y: '118%', rotate: 7 }}
          animate={{ y: 0, rotate: 0 }}
          transition={{ duration: 1.1, delay: delay + i * 0.05, ease: EASE }}
        >
          <span
            className="inline-block animate-[hero-wave_4.2s_ease-in-out_infinite] motion-reduce:animate-none"
            style={{ animationDelay: `${2.2 + i * 0.14}s` }}
          >
            {ch}
          </span>
        </motion.span>
      ))}
    </span>
  )
}

/* Words fade in from blur, one after another */
function BlurWords({ text, delay = 0, className = '' }) {
  return (
    <p className={className} aria-label={text}>
      {text.split(' ').map((w, i) => (
        <motion.span
          key={i}
          aria-hidden="true"
          className="mr-[0.28em] inline-block"
          initial={{ opacity: 0, y: 10, filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.8, delay: delay + i * 0.045, ease: EASE }}
        >
          {w}
        </motion.span>
      ))}
    </p>
  )
}

/* Rotating circular text with a down arrow in the middle */
function ScrollBadge({ onClick }) {
  const text = 'SCROLL • DISCOVER • EXPLORE • '
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Scroll down"
      className="group relative hidden h-[104px] w-[104px] place-items-center rounded-full text-[#efeae0] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ff5938] sm:grid"
    >
      <svg
        viewBox="0 0 120 120"
        className="absolute inset-0 h-full w-full animate-[hero-spin_18s_linear_infinite] motion-reduce:animate-none"
        aria-hidden="true"
      >
        <defs>
          <path id="hero-circle" d="M60,60 m-46,0 a46,46 0 1,1 92,0 a46,46 0 1,1 -92,0" />
        </defs>
        <text fill="currentColor" fontSize="10" fontWeight="700" letterSpacing="2.3">
          <textPath href="#hero-circle">{text.repeat(2)}</textPath>
        </text>
      </svg>
      <span className="grid h-11 w-11 place-items-center rounded-full bg-[#ff5938] text-[#0d0d0c] transition-transform duration-500 group-hover:translate-y-1">
        <ArrowDown className="h-5 w-5 stroke-[2.5]" />
      </span>
    </button>
  )
}

export default function HeroSection() {
  const containerRef = useRef(null)
  const reduceMotion = useReducedMotion()

  /* ---------- mouse parallax (three depths) ---------- */
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const springX = useSpring(mouseX, { stiffness: 40, damping: 20 })
  const springY = useSpring(mouseY, { stiffness: 40, damping: 20 })

  const bgX = useTransform(springX, [-0.5, 0.5], [14, -14])
  const bgY = useTransform(springY, [-0.5, 0.5], [10, -10])
  const textX = useTransform(springX, [-0.5, 0.5], [-12, 12])
  const textY = useTransform(springY, [-0.5, 0.5], [-8, 8])
  const scriptX = useTransform(springX, [-0.5, 0.5], [22, -22])
  const scriptY = useTransform(springY, [-0.5, 0.5], [14, -14])

  const handleMouseMove = (e) => {
    if (reduceMotion || !containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5)
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5)
  }
  const handleMouseLeave = () => {
    mouseX.set(0)
    mouseY.set(0)
  }

  /* ---------- count-up for the customer stat ---------- */
  const count = useMotionValue(0)
  const rounded = useTransform(count, (v) => Math.round(v))
  useEffect(() => {
    if (reduceMotion) {
      count.set(500)
      return
    }
    const controls = animate(count, 500, { duration: 2.2, delay: 1.2, ease: EASE })
    return () => controls.stop()
  }, [count, reduceMotion])

  const handleBookNow = () => {
    window.dispatchEvent(
      new CustomEvent('open-booking-modal', {
        detail: {
          destination: 'Alpine Summit Expedition',
          persons: '2 Persons',
          days: '5 Nights 6 Days',
        },
      })
    )
  }

  const scrollDown = () => {
    const next = containerRef.current?.nextElementSibling
    if (next) next.scrollIntoView({ behavior: 'smooth', block: 'start' })
    else window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })
  }

  const fadeUp = (delay) => ({
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.9, delay, ease: EASE },
  })

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative flex h-[100svh] min-h-[600px] w-full select-none flex-col overflow-hidden bg-slate-950 text-[#efeae0]"
    >
      {/* Background: parallax + slow settle-in zoom */}
      <motion.div
        style={{ x: bgX, y: bgY }}
        className="pointer-events-none absolute inset-[-40px] z-0"
      >
        <motion.video
          src="/Hero.mp4"
          autoPlay
          loop
          muted
          playsInline
          aria-hidden="true"
          className="h-full w-full object-cover object-center"
          initial={{ scale: 1.18 }}
          animate={{ scale: 1.05 }}
          transition={{ duration: 2.4, ease: EASE }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0d0d0c]/65 via-[#0d0d0c]/20 to-[#0d0d0c]/80" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(13,13,12,0.05)_20%,rgba(13,13,12,0.6)_100%)]" />
        <div className="absolute -bottom-40 left-1/2 h-80 w-[70%] -translate-x-1/2 rounded-full bg-[#ff5938]/25 blur-3xl" />
      </motion.div>

      {/* Spacer for the fixed navbar */}
      <div className="relative z-10 h-20 w-full shrink-0 sm:h-24" />

      {/* Centered headline */}
      <motion.div
        style={{ x: textX, y: textY }}
        className="relative z-20 mx-auto flex min-h-0 w-full max-w-[1600px] flex-1 flex-col items-center justify-center px-5 text-center sm:px-8"
      >
        {/* script kicker on its own parallax layer */}
        <motion.div style={{ x: scriptX, y: scriptY }} className="relative z-30 mb-[clamp(2px,1.2svh,14px)]">
          <motion.div
            initial={{ opacity: 0, y: -20, rotate: -8 }}
            animate={{ opacity: 1, y: 0, rotate: -4 }}
            transition={{ duration: 1, delay: 0.9, ease: EASE }}
            className="relative inline-block"
          >
            <span
              className="inline-block text-[clamp(1.8rem,min(5.5vw,6svh),4rem)] font-bold italic leading-none text-[#efeae0] drop-shadow-[0_3px_14px_rgba(0,0,0,0.7)]"
              style={{ fontFamily: "'Caveat', cursive" }}
            >
              Explore the world
            </span>
            <svg
              viewBox="0 0 300 24"
              fill="none"
              aria-hidden="true"
              className="absolute -bottom-2 left-[2%] w-[96%] overflow-visible"
            >
              <motion.path
                d="M4 16 C 60 4, 120 22, 180 10 S 270 8, 296 14"
                stroke="#ff5938"
                strokeWidth="4"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1, delay: 1.5, ease: 'easeInOut' }}
              />
            </svg>
          </motion.div>
        </motion.div>

        <h1
          aria-label="Go Far. Feel More."
          className="m-0 flex flex-col items-center font-black uppercase leading-[0.84] tracking-[-0.06em] text-[clamp(3.2rem,min(15.5vw,23svh),15rem)] drop-shadow-[0_12px_40px_rgba(0,0,0,0.5)]"
          style={{ fontFamily: "'Outfit', sans-serif" }}
        >
          <MaskedLine text="GO FAR." delay={0.2} className="text-[#efeae0]" />
          <MaskedLine text="FEEL MORE." delay={0.45} className="text-[#ff5938]" />
        </h1>
      </motion.div>

      {/* Floating glass bar */}
      <motion.div
        {...fadeUp(1.4)}
        className="relative z-20 mx-auto mb-5 w-full max-w-[1600px] shrink-0 px-5 sm:mb-7 sm:px-8"
      >
        <div className="grid grid-cols-1 items-center gap-5 rounded-[28px] border border-[#efeae0]/15 bg-[#0d0d0c]/45 p-5 backdrop-blur-xl sm:grid-cols-[1.3fr_auto_1fr] sm:gap-8 sm:p-6">
          {/* copy + CTA */}
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-6">
            <button
              type="button"
              onClick={handleBookNow}
              className="group relative inline-flex flex-none items-center gap-4 overflow-hidden rounded-full bg-[#ff5938] py-1.5 pl-6 pr-1.5 text-[14px] font-semibold text-[#0d0d0c] transition-colors hover:bg-[#ff6e51] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ff5938] focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
            >
              <span className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 -skew-x-[20deg] animate-[hero-sheen_3.8s_ease-in-out_infinite] bg-white/50 blur-[6px] motion-reduce:hidden" aria-hidden="true" />
              <span className="relative py-2.5">Book now</span>
              <span className="relative grid h-11 w-11 place-items-center rounded-full bg-[#0d0d0c] text-[#efeae0] transition-transform duration-500 group-hover:rotate-45">
                <ArrowUpRight className="h-5 w-5 stroke-[2.5]" />
              </span>
            </button>
            <BlurWords
              delay={1.6}
              className="m-0 max-w-[360px] text-[12.5px] leading-relaxed text-[#efeae0]/80 sm:text-[13px]"
              text="Hand-planned journeys to the world's most breathtaking places, with experts beside you every step."
            />
          </div>

          {/* badge */}
          <div className="justify-self-center">
            <ScrollBadge onClick={scrollDown} />
          </div>

          {/* trust + stat */}
          <div className="flex items-center gap-4 sm:justify-self-end">
            <div className="flex -space-x-3">
              {TRUST_AVATARS.map((src, idx) => (
                <img
                  key={idx}
                  src={src}
                  alt=""
                  className="h-9 w-9 rounded-full border-2 border-[#efeae0] object-cover shadow-lg transition-transform duration-300 hover:z-10 hover:-translate-y-1 sm:h-10 sm:w-10"
                />
              ))}
            </div>
            <div className="leading-none">
              <div
                className="flex items-baseline text-[clamp(30px,4.4svh,52px)] font-extrabold tracking-[-0.05em]"
                style={{ fontFamily: "'Outfit', sans-serif" }}
              >
                <motion.span>{rounded}</motion.span>
                <span className="text-[#ff5938]">K+</span>
              </div>
              <p className="m-0 mt-1 text-[11px] uppercase tracking-[0.12em] text-[#efeae0]/70">happy customers</p>
            </div>
          </div>
        </div>
      </motion.div>

      <style>{`
        @keyframes hero-spin { to { transform: rotate(360deg); } }
        @keyframes hero-wave { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-0.04em); } }
        @keyframes hero-sheen { 0% { transform: translateX(0) skewX(-20deg); } 60%, 100% { transform: translateX(520%) skewX(-20deg); } }
      `}</style>
    </section>
  )
}