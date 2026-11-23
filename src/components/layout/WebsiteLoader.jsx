import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Camera, Compass, MapPin, Plane, Sun } from 'lucide-react'

const DARK = '#03352b'
const TEAL = '#16c9a5'
const TEAL_DEEP = '#00ab88'
const EASE_EXIT = [0.76, 0, 0.24, 1]
const SESSION_KEY = 'ch_web_loader_shown'

/* ------------------------------------------------------------------ */
/*  Travel background                                                  */
/* ------------------------------------------------------------------ */
const FLOATERS = [
  { Icon: Compass, left: '72%', top: '14%', size: 44, dur: 6, delay: 0 },
  { Icon: Camera, left: '88%', top: '44%', size: 36, dur: 7, delay: -2 },
  { Icon: MapPin, left: '56%', top: '52%', size: 40, dur: 5.5, delay: -1 },
  { Icon: Sun, left: '14%', top: '40%', size: 48, dur: 9, delay: -4 },
]

function TravelBackground({ progress, reduced }) {
  const t = progress / 100
  const planeTop = 30 * ((1 - t) ** 2 + t ** 2) // matches the dashed arc below
  const angle = (Math.atan((0.3 * (4 * t - 2)) * 0.6) * 180) / Math.PI

  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
      {/* flight path */}
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <path
          d="M0 30 Q50 0 100 30"
          fill="none"
          stroke={DARK}
          strokeOpacity="0.15"
          strokeWidth="1.5"
          strokeDasharray="1 3"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
        <path
          d="M0 30 Q50 0 100 30"
          pathLength="100"
          fill="none"
          stroke={TEAL}
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray={`${progress} 100`}
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      {/* plane follows the arc as the number counts */}
      <div
        className="absolute"
        style={{ left: `${progress}%`, top: `${planeTop}%`, transform: 'translate(-50%, -50%)' }}
      >
        <Plane
          className="h-9 w-9 md:h-11 md:w-11"
          style={{ color: DARK, transform: `rotate(${45 + angle}deg)` }}
          strokeWidth={1.6}
        />
      </div>

      {/* drifting clouds */}
      {!reduced &&
        [
          { top: '10%', w: 110, dur: 24, delay: 0 },
          { top: '24%', w: 70, dur: 32, delay: -14 },
          { top: '36%', w: 90, dur: 28, delay: -6 },
        ].map((c, i) => (
          <motion.span
            key={i}
            className="absolute left-0 block h-6 rounded-full"
            style={{ top: c.top, width: c.w, background: '#e6f7f2' }}
            animate={{ x: ['105vw', '-200px'] }}
            transition={{ duration: c.dur, delay: c.delay, repeat: Infinity, ease: 'linear' }}
          />
        ))}

      {/* faint floating travel icons */}
      {FLOATERS.map(({ Icon, left, top, size, dur, delay }, i) => (
        <motion.div
          key={i}
          className="absolute hidden sm:block"
          style={{ left, top, color: TEAL_DEEP, opacity: 0.2 }}
          animate={reduced ? undefined : { y: [0, -12, 0], rotate: [-4, 4, -4] }}
          transition={{ duration: dur, delay, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Icon width={size} height={size} strokeWidth={1.4} />
        </motion.div>
      ))}

      {/* mountains + palm silhouette */}
      <svg
        className="absolute inset-x-0 bottom-1.5 h-[30vh] w-full"
        viewBox="0 0 1200 300"
        preserveAspectRatio="none"
      >
        <path
          d="M0 300V190L140 90L250 170L400 40L560 180L700 110L860 200L1000 70L1200 190V300Z"
          fill="#dff5ee"
        />
        <path
          d="M0 300V235L120 175L260 235L420 150L600 240L760 185L940 245L1080 195L1200 240V300Z"
          fill="#c4ece0"
        />
        {/* palm tree */}
        <g transform="translate(1040 120)" fill="none" stroke={DARK} strokeOpacity="0.35" strokeWidth="5" strokeLinecap="round">
          <path d="M20 180C24 130 22 90 30 50" />
          <path d="M30 50C10 40 -8 46 -22 62" />
          <path d="M30 50C44 30 66 28 86 40" />
          <path d="M30 50C26 28 12 14 -6 12" />
          <path d="M30 50C40 36 52 18 72 12" />
        </g>
      </svg>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Number loader (Awwwards style)                                     */
/* ------------------------------------------------------------------ */
export default function WebsiteLoader({
  visible = true,
  duration = 2400, // ms for 0 -> 100
  onlyOncePerSession = false,
  onFinish,
  className = '',
}) {
  const reduced = useReducedMotion()
  const [progress, setProgress] = useState(0)
  const [shouldRender, setShouldRender] = useState(false)
  const [done, setDone] = useState(false)
  const onFinishRef = useRef(onFinish)

  useEffect(() => {
    onFinishRef.current = onFinish
  })

  /* decide whether to show */
  useEffect(() => {
    if (!visible) {
      setShouldRender(false)
      return
    }
    if (onlyOncePerSession) {
      try {
        if (sessionStorage.getItem(SESSION_KEY)) {
          setShouldRender(false)
          onFinishRef.current?.()
          return
        }
      } catch {
        /* storage unavailable */
      }
    }
    setProgress(0)
    setDone(false)
    setShouldRender(true)
  }, [visible, onlyOncePerSession])

  /* 0 -> 100 */
  useEffect(() => {
    if (!shouldRender || done) return undefined
    const total = reduced ? 400 : duration
    const start = performance.now()
    let raf

    const step = (now) => {
      const t = Math.min((now - start) / total, 1)
      // ease in-out cubic: slow start, quick middle, slow finish
      const eased = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
      setProgress(Math.round(eased * 100))
      if (t < 1) raf = requestAnimationFrame(step)
      else setDone(true)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [shouldRender, done, duration, reduced])

  /* hold on 100 briefly, then lift the curtain */
  useEffect(() => {
    if (!done || !shouldRender) return undefined
    setProgress(100)
    const timer = setTimeout(() => {
      if (onlyOncePerSession) {
        try {
          sessionStorage.setItem(SESSION_KEY, 'true')
        } catch {
          /* storage unavailable */
        }
      }
      setShouldRender(false)
      onFinishRef.current?.()
    }, reduced ? 100 : 350)
    return () => clearTimeout(timer)
  }, [done, shouldRender, onlyOncePerSession, reduced])

  /* ESC = skip */
  useEffect(() => {
    if (!shouldRender) return undefined
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setProgress(100)
        setDone(true)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [shouldRender])

  /* lock scroll while visible */
  useEffect(() => {
    if (!shouldRender) return undefined
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [shouldRender])

  return (
    <AnimatePresence mode="wait">
      {shouldRender && (
        <motion.div
          key="website-loader"
          role="status"
          aria-live="polite"
          aria-label="Loading Country Holidays InnSuites"
          className={`fixed inset-0 z-[9999] flex select-none flex-col justify-between overflow-hidden bg-white px-6 py-6 md:px-12 md:py-10 ${className}`}
          style={{ color: DARK }}
          initial={{ opacity: 1 }}
          exit={{ y: '-100%', transition: { duration: reduced ? 0.25 : 0.9, ease: EASE_EXIT } }}
        >
          <TravelBackground progress={progress} reduced={reduced} />

          {/* brand */}
          <div className="relative z-10 flex items-center gap-2.5 text-sm font-semibold tracking-wide">
            <span className="h-2 w-2 rounded-full" style={{ background: TEAL }} />
            Country Holidays InnSuites
          </div>

          {/* big counter */}
          <div className="relative z-10 flex items-end justify-between">
            <div className="flex items-start font-black leading-[0.8] tabular-nums">
              <span style={{ fontSize: 'clamp(7rem, 26vw, 22rem)', letterSpacing: '-0.04em' }}>
                {progress}
              </span>
              <span
                className="ml-2 mt-2 font-bold md:mt-4"
                style={{ fontSize: 'clamp(1.5rem, 4vw, 3.5rem)', color: TEAL_DEEP }}
              >
                %
              </span>
            </div>
          </div>

          {/* progress line */}
          <div
            className="absolute inset-x-0 bottom-0 h-1.5"
            style={{ background: 'rgba(3,53,43,0.08)' }}
            aria-hidden="true"
          >
            <div
              className="h-full origin-left"
              style={{ width: `${progress}%`, background: TEAL }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/* ------------------------------------------------------------------ */
/*  Inline / content loaders (same exports as before)                  */
/* ------------------------------------------------------------------ */
export function InlineSpinner({ size = 'md', className = '' }) {
  const sizeMap = {
    sm: 'h-4 w-4 border-2',
    md: 'h-6 w-6 border-2',
    lg: 'h-10 w-10 border-[3px]',
  }

  return (
    <div
      className={`inline-block animate-spin rounded-full border-current border-t-transparent text-[#16c9a5] ${sizeMap[size] || sizeMap.md} ${className}`}
      role="status"
      aria-label="loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  )
}

export function SectionLoader({ message = 'Loading details...', className = '' }) {
  return (
    <div className={`flex flex-col items-center justify-center p-12 text-center ${className}`}>
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-[#03352b]/10 bg-white shadow-sm">
        <InlineSpinner size="md" />
      </div>
      <p className="text-sm font-medium text-slate-500">{message}</p>
    </div>
  )
}