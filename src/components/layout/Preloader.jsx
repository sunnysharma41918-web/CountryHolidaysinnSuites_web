import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'

/* ------------------------------------------------------------------ */
/*  Tokens                                                             */
/* ------------------------------------------------------------------ */
const INK = '#096c27' // brand green
const BG = '#f3f8ee' // soft green-tinted white
const SESSION_KEY = 'ch_web_loader_shown'
const LOOP_SECONDS = 3 // one lap of the plane around the number

/* ------------------------------------------------------------------ */
/*  Plane (line art, faces right = direction of travel)                */
/* ------------------------------------------------------------------ */
function Plane() {
  const line = {
    fill: BG,
    stroke: INK,
    strokeWidth: 3.2,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  }

  return (
    <svg viewBox="0 0 200 100" className="block h-auto w-full overflow-visible" aria-hidden="true">
      <path {...line} d="M92 38 L100 27 Q102 25 106 25 L116 25 Q120 26 124 32 L134 38 Z" />
      <path {...line} d="M20 14 Q20 9 26 9 L35 9 Q40 9 43 13 L60 40 L34 40 Z" />
      <path {...line} d="M26 46 Q17 47 16 54 Q16 61 24 62 L44 59 L56 50 Z" />
      <path
        {...line}
        d="M46 38 H138 C160 38 178 44 186 52 C188 56 182 60 174 62 C160 66 140 68 120 68 H54 C46 68 41 64 41 58 V48 C41 42 42 38 46 38 Z"
      />
      <path {...line} d="M142 66 L108 94 Q104 97 98 97 L92 97 Q88 95 92 91 L112 66 Z" />
      <path {...line} fill="none" d="M166 47 Q176 45 183 49" />
      {Array.from({ length: 10 }).map((_, i) => (
        <rect key={i} x={70 + i * 7} y={49} width={4.6} height={6.5} rx={2} {...line} fill="none" strokeWidth={2.6} />
      ))}
    </svg>
  )
}

/* ------------------------------------------------------------------ */
/*  Loader                                                             */
/* ------------------------------------------------------------------ */
export default function WebsiteLoader({
  visible = true,
  duration = 2200, // ms from 1 to 100
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

    // Check if this is a browser page refresh / reload
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
      const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2 // easeInOutQuad
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
    }, reduced ? 120 : 600)
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
          className={`fixed inset-0 z-[9999] flex select-none items-center justify-center overflow-hidden ${className}`}
          style={{ background: BG, color: INK }}
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: reduced ? 1 : 1.04,
            transition: { duration: reduced ? 0.15 : 0.5, ease: 'easeOut' },
          }}
        >
          {/* orbit: everything is sized from --d so it scales together */}
          <div
            className="relative grid place-items-center"
            style={{ '--d': 'min(78vw, 520px)', width: 'var(--d)', height: 'var(--d)' }}
          >
            {/* rotating layer: dashed trail + plane. The plane sits at 12 o'clock
                facing right, so as the layer turns it always points along its path */}
            <motion.div
              className="absolute inset-0"
              animate={reduced ? undefined : { rotate: 360 }}
              transition={{ duration: LOOP_SECONDS, repeat: Infinity, ease: 'linear' }}
            >
              {/* trail: only the stretch behind the plane is visible */}
              <svg
                viewBox="0 0 100 100"
                className="absolute inset-0 h-full w-full"
                style={{
                  WebkitMaskImage: 'conic-gradient(from 0deg, transparent 0deg 190deg, #000 360deg)',
                  maskImage: 'conic-gradient(from 0deg, transparent 0deg 190deg, #000 360deg)',
                }}
                aria-hidden="true"
              >
                <circle
                  cx="50"
                  cy="50"
                  r="49"
                  fill="none"
                  stroke={INK}
                  strokeWidth="0.5"
                  strokeLinecap="round"
                  strokeDasharray="4 3 1 3 8 3"
                />
              </svg>

              <div
                className="absolute left-1/2 top-0 w-[clamp(64px,11vw,96px)] -translate-x-1/2 -translate-y-1/2"
                style={{ filter: 'drop-shadow(0 6px 8px rgba(9,108,39,0.22))' }}
              >
                <Plane />
              </div>
            </motion.div>

            {/* the big number */}
            <div
              className="relative flex items-start font-black leading-none tabular-nums"
              style={{ fontSize: 'calc(var(--d) * 0.34)', letterSpacing: '-0.04em' }}
            >
              <span>{progress}</span>
              <span
                className="font-bold"
                style={{ fontSize: '0.22em', marginLeft: '0.18em', marginTop: '0.2em', opacity: 0.55, letterSpacing: 0 }}
              >
                %
              </span>
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