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
const LOOP_SECONDS = 24
const LIGHT_AT = [20, 40, 60, 80, 100] // progress % at which each small diya lights

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

/* fireworks: position in %, start delay, colour, spread in px */
const BURSTS = [
  { x: 18, y: 24, delay: 0.2, color: '#fbd75b', size: 80 },
  { x: 82, y: 20, delay: 1.1, color: '#ff7a18', size: 90 },
  { x: 70, y: 62, delay: 2.0, color: '#fff2a8', size: 70 },
  { x: 24, y: 66, delay: 2.8, color: '#f59e0b', size: 76 },
  { x: 50, y: 12, delay: 1.6, color: '#ff9f43', size: 84 },
]

/* sky lanterns: left in %, size in px, delay and duration in s */
const LANTERNS = [
  { x: 6, size: 26, delay: 0, dur: 11 },
  { x: 22, size: 20, delay: 3.2, dur: 13 },
  { x: 40, size: 16, delay: 1.4, dur: 14 },
  { x: 62, size: 22, delay: 4.5, dur: 12 },
  { x: 78, size: 28, delay: 0.8, dur: 10 },
  { x: 92, size: 18, delay: 5.6, dur: 13 },
]

const GREETING = 'Happy Diwali'

/* ------------------------------------------------------------------ */
/*  Main diya (oil lamp) with a flickering flame                       */
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

      {/* flame: ignites first, then flickers */}
      <motion.g
        style={{ transformBox: 'fill-box', transformOrigin: '50% 100%' }}
        initial={reduced ? false : { scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 120, damping: 9, delay: 0.3 }}
      >
        <motion.g
          style={{ transformBox: 'fill-box', transformOrigin: '50% 100%' }}
          animate={flicker}
          transition={{ duration: 1.1, repeat: Infinity, ease: 'easeInOut' }}
        >
          <path d="M60 6 C75 26 80 42 60 56 C40 42 45 26 60 6 Z" fill="url(#diya-flame)" />
          <path d="M60 28 C67 38 68 46 60 54 C52 46 53 38 60 28 Z" fill="#fffbe0" opacity="0.9" />
        </motion.g>
      </motion.g>

      <rect x="58.5" y="52" width="3" height="8" rx="1.5" fill="#3b1608" />
      <rect x="44" y="104" width="32" height="7" rx="3.5" fill="#8a3a12" />
      <rect x="52" y="98" width="16" height="8" rx="2" fill="#a24618" />
      <path d="M6 58 C12 92 38 104 60 104 C82 104 108 92 114 58 Q60 72 6 58 Z" fill="url(#diya-bowl)" />
      <ellipse cx="60" cy="58" rx="54" ry="9" fill="#ffd36a" stroke="#b9531a" strokeWidth="2" />
      <ellipse cx="60" cy="59" rx="40" ry="5.5" fill="#6b2208" />

      {[26, 40, 54, 68, 82, 96].map((cx, i) => (
        <circle key={cx} cx={cx} cy={i % 2 ? 80 : 77} r="2.4" fill="#fff2a8" opacity="0.85" />
      ))}
    </svg>
  )
}

/* ------------------------------------------------------------------ */
/*  Small diya that lights up when `lit` turns true                    */
/* ------------------------------------------------------------------ */
function MiniDiya({ lit, reduced }) {
  return (
    <div className="relative w-9 sm:w-11">
      {/* glow */}
      <motion.div
        className="absolute left-1/2 top-[18%] h-[90%] w-[90%] -translate-x-1/2 rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(255,160,40,0.55), transparent 70%)' }}
        animate={{ opacity: lit ? 1 : 0, scale: lit ? 1 : 0.4 }}
        transition={{ duration: 0.5 }}
      />
      <svg viewBox="0 0 60 60" className="relative block h-auto w-full overflow-visible" aria-hidden="true">
        {/* flame pops in when lit */}
        <motion.g
          style={{ transformBox: 'fill-box', transformOrigin: '50% 100%' }}
          initial={false}
          animate={{ scale: lit ? 1 : 0, opacity: lit ? 1 : 0 }}
          transition={{ type: 'spring', stiffness: 220, damping: 10 }}
        >
          <motion.g
            style={{ transformBox: 'fill-box', transformOrigin: '50% 100%' }}
            animate={lit && !reduced ? { scaleY: [1, 1.15, 0.92, 1.08, 1], skewX: [0, -4, 3, -2, 0] } : undefined}
            transition={{ duration: 0.9, repeat: Infinity, ease: 'easeInOut' }}
          >
            <path d="M30 4 C39 16 41 25 30 33 C19 25 21 16 30 4 Z" fill={SAFFRON} />
            <path d="M30 15 C34 21 35 26 30 31 C25 26 26 21 30 15 Z" fill="#fffbe0" />
          </motion.g>
        </motion.g>
        <path
          d="M4 36 C8 52 20 58 30 58 C40 58 52 52 56 36 Q30 44 4 36 Z"
          style={{ fill: lit ? '#e8962a' : '#6b3a1d', transition: 'fill 0.5s' }}
        />
        <ellipse cx="30" cy="36" rx="26" ry="4.5" style={{ fill: lit ? '#ffd36a' : '#8a5a33', transition: 'fill 0.5s' }} />
      </svg>
    </div>
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
/*  Firework burst                                                     */
/* ------------------------------------------------------------------ */
function Burst({ x, y, delay, color, size }) {
  const N = 14
  return (
    <span className="pointer-events-none absolute" style={{ left: `${x}%`, top: `${y}%` }} aria-hidden="true">
      {Array.from({ length: N }).map((_, i) => {
        const a = ((Math.PI * 2) / N) * i
        return (
          <motion.span
            key={i}
            className="absolute rounded-full"
            style={{ width: 4, height: 4, background: color, boxShadow: `0 0 8px 2px ${color}` }}
            initial={{ x: 0, y: 0, opacity: 0, scale: 1 }}
            animate={{
              x: Math.cos(a) * size,
              y: Math.sin(a) * size + 18, // slight droop, like falling embers
              opacity: [0, 1, 1, 0],
              scale: [1, 1, 0.6, 0.2],
            }}
            transition={{ duration: 1.6, delay, repeat: Infinity, repeatDelay: 2.4, ease: 'easeOut' }}
          />
        )
      })}
    </span>
  )
}

/* ------------------------------------------------------------------ */
/*  Sky lantern                                                        */
/* ------------------------------------------------------------------ */
function Lantern({ x, size, delay, dur }) {
  return (
    <motion.div
      className="pointer-events-none absolute"
      style={{ left: `${x}%`, bottom: -80 }}
      initial={{ y: 0, opacity: 0 }}
      animate={{ y: '-125vh', opacity: [0, 0.9, 0.9, 0] }}
      transition={{ duration: dur, delay, repeat: Infinity, ease: 'linear' }}
      aria-hidden="true"
    >
      <motion.div
        animate={{ x: [-8, 8, -8], rotate: [-3, 3, -3] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div
          style={{
            width: size,
            height: size * 1.3,
            borderRadius: `${size / 2}px ${size / 2}px ${size / 4}px ${size / 4}px`,
            background: `linear-gradient(to top, ${FLAME}, ${SAFFRON} 60%, #fff2a8)`,
            boxShadow: `0 0 ${size}px ${size / 3}px rgba(255,140,30,0.45)`,
          }}
        />
      </motion.div>
    </motion.div>
  )
}

/* ------------------------------------------------------------------ */
/*  Loader                                                             */
/* ------------------------------------------------------------------ */
export default function WebsiteLoader({
  visible = true,
  duration = 3200, // ms from 1 to 100
  onlyOncePerSession = true,
  onFinish,
  className = '',
}) {
  const reduced = useReducedMotion()

  const [shouldRender, setShouldRender] = useState(() => {
    if (!visible) return false

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
    }, reduced ? 120 : 1000)
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
          {/* fireworks + lanterns + sparkles (all skipped for reduced motion) */}
          {!reduced && BURSTS.map((b, i) => <Burst key={`b${i}`} {...b} />)}
          {!reduced && LANTERNS.map((l, i) => <Lantern key={`l${i}`} {...l} />)}
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
            {/* diya + rangoli, sized from --d */}
            <motion.div
              className="relative grid place-items-center"
              style={{ '--d': 'min(56vw, 300px)', width: 'var(--d)', height: 'var(--d)' }}
              initial={reduced ? false : { scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 80, damping: 14 }}
            >
              {/* warm glow */}
              <motion.div
                className="absolute inset-[8%] rounded-full"
                style={{ background: 'radial-gradient(circle, rgba(255,160,40,0.5) 0%, rgba(255,122,24,0.15) 45%, transparent 70%)' }}
                animate={reduced ? undefined : { opacity: [0.7, 1, 0.75], scale: [0.96, 1.06, 0.98] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
              />

              {/* ripples spreading out from the lamp */}
              {!reduced &&
                [0, 1].map((n) => (
                  <motion.div
                    key={n}
                    className="absolute inset-[18%] rounded-full border"
                    style={{ borderColor: 'rgba(251,215,91,0.5)' }}
                    animate={{ scale: [1, 1.9], opacity: [0.6, 0] }}
                    transition={{ duration: 2.8, delay: n * 1.4, repeat: Infinity, ease: 'easeOut' }}
                  />
                ))}

              {/* outer rangoli */}
              <motion.div
                className="absolute inset-0"
                animate={reduced ? undefined : { rotate: 360 }}
                transition={{ duration: LOOP_SECONDS, repeat: Infinity, ease: 'linear' }}
              >
                <RangoliRing />
              </motion.div>

              {/* inner rangoli, opposite direction */}
              <motion.div
                className="absolute inset-[16%]"
                animate={reduced ? undefined : { rotate: -360 }}
                transition={{ duration: LOOP_SECONDS * 0.75, repeat: Infinity, ease: 'linear' }}
              >
                <RangoliRing inner />
              </motion.div>

              {/* the diya, gently floating */}
              <motion.div
                className="relative w-[44%]"
                style={{ filter: 'drop-shadow(0 10px 18px rgba(255,122,24,0.35))' }}
                animate={reduced ? undefined : { y: [0, -5, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              >
                <Diya reduced={reduced} />
              </motion.div>

              {/* golden ring when loading hits 100 */}
              {done && !reduced && (
                <motion.div
                  className="absolute inset-0 rounded-full border-2"
                  style={{ borderColor: GOLD, boxShadow: `0 0 30px ${GOLD}` }}
                  initial={{ scale: 0.4, opacity: 0.9 }}
                  animate={{ scale: 2.4, opacity: 0 }}
                  transition={{ duration: 0.9, ease: 'easeOut' }}
                />
              )}
            </motion.div>

            {/* greeting, letter by letter */}
            <h1
              className="mt-4 flex font-black leading-none tracking-tight"
              style={{ fontSize: 'clamp(2rem, 7vw, 3.4rem)' }}
              aria-label={GREETING}
            >
              {GREETING.split('').map((ch, i) => (
                <motion.span
                  key={i}
                  aria-hidden="true"
                  className="inline-block"
                  style={{ color: i % 2 ? '#fff2a8' : GOLD, textShadow: '0 0 18px rgba(245,158,11,0.55)' }}
                  initial={reduced ? false : { opacity: 0, y: 34, rotate: -10, scale: 0.6 }}
                  animate={{ opacity: 1, y: 0, rotate: 0, scale: 1 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 14, delay: 0.5 + i * 0.06 }}
                >
                  {ch === ' ' ? '\u00A0' : ch}
                </motion.span>
              ))}
            </h1>

            <motion.p
              className="mt-2.5 max-w-[22rem] text-sm font-medium leading-relaxed text-[#ffe9b0]/85 sm:max-w-none sm:text-base"
              initial={reduced ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.4, ease: 'easeOut' }}
            >
              To all, from{' '}
              <span className="font-bold text-[#fbd75b]">Country Holidays Travel Inn &amp; Suites</span>
            </motion.p>

            {/* five small diyas, lit one by one as loading advances */}
            <div className="mt-5 flex items-end gap-3 sm:gap-4">
              {LIGHT_AT.map((t) => (
                <MiniDiya key={t} lit={progress >= t} reduced={reduced} />
              ))}
            </div>

            {/* progress */}
            <div className="mt-4 w-[min(72vw,280px)]">
              <div className="relative h-[3px] w-full overflow-hidden rounded-full bg-white/10">
                <div
                  className="relative h-full overflow-hidden rounded-full"
                  style={{
                    width: `${progress}%`,
                    background: `linear-gradient(90deg, ${FLAME}, ${SAFFRON}, ${GOLD})`,
                    boxShadow: '0 0 10px rgba(251,215,91,0.7)',
                  }}
                >
                  {/* shimmer sweeping along the bar */}
                  {!reduced && (
                    <motion.span
                      className="absolute inset-y-0 w-10 bg-gradient-to-r from-transparent via-white/80 to-transparent"
                      animate={{ x: ['-100%', '400%'] }}
                      transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
                    />
                  )}
                </div>
              </div>
              <div className="mt-2 flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.25em] text-[#ffe9b0]/60">
                <span>{progress >= 100 ? 'Shubh Deepavali' : 'Lighting up'}</span>
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