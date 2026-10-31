import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'

/* ------------------------------------------------------------------ */
/*  Tokens                                                             */
/* ------------------------------------------------------------------ */
const GOLD = '#fbd75b'
const SAFFRON = '#f59e0b'
const FLAME = '#ff7a18'
const MAROON_DEEP = '#1d0610'
const MAROON = '#4a0f1d'
const LOOP_SECONDS = 24 // one slow turn of the rangoli ring

/* sparkles: fixed positions so renders stay stable */
const SPARKLES = [
  { x: 8, y: 22, s: 6, d: 0 },
  { x: 18, y: 70, s: 4, d: 0.6 },
  { x: 28, y: 12, s: 5, d: 1.2 },
  { x: 36, y: 84, s: 7, d: 0.3 },
  { x: 48, y: 6, s: 4, d: 1.8 },
  { x: 60, y: 90, s: 5, d: 0.9 },
  { x: 72, y: 14, s: 7, d: 1.5 },
  { x: 82, y: 76, s: 4, d: 0.2 },
  { x: 91, y: 30, s: 6, d: 1.1 },
  { x: 94, y: 62, s: 5, d: 2.0 },
  { x: 4, y: 50, s: 5, d: 1.4 },
  { x: 54, y: 48, s: 3, d: 0.7 },
]

/* ------------------------------------------------------------------ */
/*  Diya (oil lamp) with a flickering flame                            */
/* ------------------------------------------------------------------ */
function Diya({ reduced }) {
  const flicker = reduced
    ? undefined
    : {
      scaleY: [1, 1.12, 0.94, 1.08, 1],
      scaleX: [1, 0.92, 1.06, 0.96, 1],
      skewX: [0, -3, 2, -2, 0],
    }

  return (
    <svg viewBox="0 0 120 120" className="block h-auto w-full overflow-visible" aria-hidden="true">
      <defs>
        <linearGradient id="diya-bowl" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f6b73c" />
          <stop offset="1" stopColor="#b9531a" />
        </linearGradient>
        <linearGradient id="diya-flame" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor={FLAME} />
          <stop offset="0.6" stopColor={SAFFRON} />
          <stop offset="1" stopColor="#fff2a8" />
        </linearGradient>
      </defs>

      {/* flame */}
      <motion.g
        style={{ transformBox: 'fill-box', transformOrigin: '50% 100%' }}
        animate={flicker}
        transition={{ duration: 1.1, repeat: Infinity, ease: 'easeInOut' }}
      >
        <path d="M60 6 C75 26 80 42 60 56 C40 42 45 26 60 6 Z" fill="url(#diya-flame)" />
        <path d="M60 28 C67 38 68 46 60 54 C52 46 53 38 60 28 Z" fill="#fffbe0" opacity="0.9" />
      </motion.g>

      {/* wick */}
      <rect x="58.5" y="52" width="3" height="8" rx="1.5" fill="#3b1608" />

      {/* base */}
      <rect x="44" y="104" width="32" height="7" rx="3.5" fill="#8a3a12" />
      <rect x="52" y="98" width="16" height="8" rx="2" fill="#a24618" />

      {/* bowl */}
      <path d="M6 58 C12 92 38 104 60 104 C82 104 108 92 114 58 Q60 72 6 58 Z" fill="url(#diya-bowl)" />
      <ellipse cx="60" cy="58" rx="54" ry="9" fill="#ffd36a" stroke="#b9531a" strokeWidth="2" />
      <ellipse cx="60" cy="59" rx="40" ry="5.5" fill="#6b2208" />

      {/* bowl pattern */}
      {[26, 40, 54, 68, 82, 96].map((cx, i) => (
        <circle key={cx} cx={cx} cy={i % 2 ? 80 : 77} r="2.4" fill="#fff2a8" opacity="0.85" />
      ))}
    </svg>
  )
}

/* ------------------------------------------------------------------ */
/*  Rangoli ring: petals + dots                                        */
/* ------------------------------------------------------------------ */
function RangoliRing({ inner = false }) {
  const count = inner ? 8 : 16
  const r = inner ? 30 : 44
  return (
    <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" aria-hidden="true">
      <circle cx="50" cy="50" r={inner ? 38 : 48.5} fill="none" stroke={GOLD} strokeWidth="0.35" strokeDasharray="1 2.2" opacity="0.8" />
      {Array.from({ length: count }).map((_, i) => {
        const a = (360 / count) * i
        return (
          <g key={i} transform={`rotate(${a} 50 50)`}>
            <ellipse
              cx="50"
              cy={50 - r}
              rx={inner ? 3 : 2.4}
              ry={inner ? 7 : 5.4}
              fill={i % 2 ? SAFFRON : FLAME}
              opacity={inner ? 0.55 : 0.8}
            />
            {!inner && <circle cx="50" cy="3.2" r="1" fill={GOLD} />}
          </g>
        )
      })}
    </svg>
  )
}

/* ------------------------------------------------------------------ */
/*  Loader                                                             */
/* ------------------------------------------------------------------ */
export default function WebsiteLoader({
  visible = true,
  duration = 2600, // ms from 1 to 100
  onlyOncePerSession = true,
  onFinish,
  className = '',
}) {
  const reduced = useReducedMotion()

  const [shouldRender, setShouldRender] = useState(() => {
    if (!visible) return false

    // Check if this is a browser refresh / reload
    try {
      const nav = performance.getEntriesByType?.('navigation')?.[0]
      if (nav && nav.type === 'reload') return false
      if (performance.navigation && performance.navigation.type === 1) return false
    } catch {
      /* ignore */
    }

    if (onlyOncePerSession) {
      try {
        if (sessionStorage.getItem('chis_preloader_seen')) return false
      } catch {
        /* storage unavailable */
      }
    }

    return true
  })

  const [progress, setProgress] = useState(1)
  const [done, setDone] = useState(false)
  const onFinishRef = useRef(onFinish)

  useEffect(() => {
    onFinishRef.current = onFinish
  })

  /* synchronize if visible changes */
  useEffect(() => {
    if (!visible) {
      setShouldRender(false)
      return
    }

    try {
      const nav = performance.getEntriesByType?.('navigation')?.[0]
      if (nav && nav.type === 'reload') {
        setShouldRender(false)
        onFinishRef.current?.()
        return
      }
      if (performance.navigation && performance.navigation.type === 1) {
        setShouldRender(false)
        onFinishRef.current?.()
        return
      }
    } catch {
      /* ignore */
    }

    if (onlyOncePerSession) {
      try {
        if (sessionStorage.getItem('chis_preloader_seen')) {
          setShouldRender(false)
          onFinishRef.current?.()
          return
        }
      } catch {
        /* storage unavailable */
      }
    }

    setProgress(1)
    setDone(false)
    setShouldRender(true)
  }, [visible, onlyOncePerSession])

  /* 1 -> 100, eased */
  useEffect(() => {
    if (!shouldRender || done) return undefined
    const total = reduced ? 400 : duration
    const start = performance.now()
    let raf

    const step = (now) => {
      const t = Math.min((now - start) / total, 1)
      const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2
      setProgress(Math.max(1, Math.round(eased * 100)))
      if (t < 1) raf = requestAnimationFrame(step)
      else setDone(true)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [shouldRender, done, duration, reduced])

  /* hold on 100 for a beat, then fade out */
  useEffect(() => {
    if (!done || !shouldRender) return undefined
    setProgress(100)
    const timer = setTimeout(() => {
      if (onlyOncePerSession) {
        try {
          sessionStorage.setItem('chis_preloader_seen', 'true')
        } catch {
          /* storage unavailable */
        }
      }
      setShouldRender(false)
      onFinishRef.current?.()
    }, reduced ? 120 : 800)
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
          aria-label="Happy Diwali from Country Holidays Travel Inn and Suites. Loading."
          className={`fixed inset-0 z-[9999] flex select-none items-center justify-center overflow-hidden px-4 ${className}`}
          style={{ background: `radial-gradient(ellipse at 50% 40%, ${MAROON} 0%, ${MAROON_DEEP} 75%)`, color: GOLD }}
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: reduced ? 1 : 1.04,
            transition: { duration: reduced ? 0.15 : 0.5, ease: 'easeOut' },
          }}
        >
          {/* drifting sparkles */}
          {!reduced &&
            SPARKLES.map((p, i) => (
              <motion.span
                key={i}
                className="pointer-events-none absolute rounded-full"
                style={{
                  left: `${p.x}%`,
                  top: `${p.y}%`,
                  width: p.s,
                  height: p.s,
                  background: i % 3 === 0 ? '#fff2a8' : i % 3 === 1 ? GOLD : SAFFRON,
                  boxShadow: `0 0 ${p.s * 2.5}px ${p.s / 2}px rgba(251,215,91,0.55)`,
                }}
                animate={{ opacity: [0, 1, 0], scale: [0.4, 1.2, 0.4], y: [0, -14, 0] }}
                transition={{ duration: 3.2, delay: p.d, repeat: Infinity, ease: 'easeInOut' }}
              />
            ))}

          <div className="relative flex flex-col items-center text-center">
            {/* diya + rangoli. Everything is sized from --d so it scales together */}
            <div
              className="relative grid place-items-center"
              style={{ '--d': 'min(64vw, 340px)', width: 'var(--d)', height: 'var(--d)' }}
            >
              {/* warm glow */}
              <motion.div
                className="absolute inset-[8%] rounded-full"
                style={{ background: 'radial-gradient(circle, rgba(255,160,40,0.5) 0%, rgba(255,122,24,0.15) 45%, transparent 70%)' }}
                animate={reduced ? undefined : { opacity: [0.7, 1, 0.75], scale: [0.96, 1.06, 0.98] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
              />

              {/* outer rangoli, turning slowly */}
              <motion.div
                className="absolute inset-0"
                animate={reduced ? undefined : { rotate: 360 }}
                transition={{ duration: LOOP_SECONDS, repeat: Infinity, ease: 'linear' }}
              >
                <RangoliRing />
              </motion.div>

              {/* inner rangoli, turning the other way */}
              <motion.div
                className="absolute inset-[16%]"
                animate={reduced ? undefined : { rotate: -360 }}
                transition={{ duration: LOOP_SECONDS * 0.75, repeat: Infinity, ease: 'linear' }}
              >
                <RangoliRing inner />
              </motion.div>

              {/* the diya */}
              <div className="relative w-[44%]" style={{ filter: 'drop-shadow(0 10px 18px rgba(255,122,24,0.35))' }}>
                <Diya reduced={reduced} />
              </div>
            </div>

            {/* greeting */}
            <motion.h1
              className="mt-5 font-black leading-none tracking-tight"
              style={{
                fontSize: 'clamp(2rem, 7vw, 3.4rem)',
                backgroundImage: `linear-gradient(90deg, ${SAFFRON}, #fff2a8 50%, ${SAFFRON})`,
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
              }}
              initial={reduced ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
            >
              Happy Diwali
            </motion.h1>

            <motion.p
              className="mt-2.5 max-w-[22rem] text-sm font-medium leading-relaxed text-[#ffe9b0]/85 sm:max-w-none sm:text-base"
              initial={reduced ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5, ease: 'easeOut' }}
            >
              To all, from{' '}
              <span className="font-bold text-[#fbd75b]">Country Holidays Travel Inn &amp; Suites</span>
            </motion.p>

            {/* progress */}
            <div className="mt-6 w-[min(72vw,280px)]">
              <div className="h-[3px] w-full overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${progress}%`,
                    background: `linear-gradient(90deg, ${FLAME}, ${SAFFRON}, ${GOLD})`,
                    boxShadow: '0 0 10px rgba(251,215,91,0.7)',
                  }}
                />
              </div>
              <div className="mt-2 flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.25em] text-[#ffe9b0]/60">
                <span>Lighting up</span>
                <span className="tabular-nums text-[#fbd75b]">{progress}%</span>
              </div>
            </div>
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
      className={`inline-block animate-spin rounded-full border-current border-t-transparent text-[#096c27] ${sizeMap[size] || sizeMap.md} ${className}`}
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
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-[#096c27]/15 bg-white shadow-sm">
        <InlineSpinner size="md" />
      </div>
      <p className="text-sm font-medium text-slate-500">{message}</p>
    </div>
  )
}