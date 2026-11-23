import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import logo from '../../assets/logo-000.png'

const SESSION_KEY = 'ch_web_loader_shown'

export default function WebsiteLoader({
  visible = true,
  duration = 1600,
  onlyOncePerSession = false,
  onFinish,
  className = '',
}) {
  const reduced = useReducedMotion()
  const [progress, setProgress] = useState(0)
  const [exiting, setExiting] = useState(false)
  const onFinishRef = useRef(onFinish)

  useEffect(() => {
    onFinishRef.current = onFinish
  }, [onFinish])

  const [alreadySeen] = useState(() => {
    if (!onlyOncePerSession) return false
    try {
      return Boolean(sessionStorage.getItem(SESSION_KEY))
    } catch {
      return false
    }
  })

  useEffect(() => {
    if (alreadySeen) {
      onFinishRef.current?.()
    }
  }, [alreadySeen])

  const shouldRender = visible && !alreadySeen && !exiting

  /* Progress animation 0 -> 100 */
  useEffect(() => {
    if (!shouldRender) return undefined

    const total = reduced ? 300 : duration
    const start = performance.now()
    let raf

    const step = (now) => {
      const elapsed = now - start
      const t = Math.min(elapsed / total, 1)
      const eased = 1 - Math.pow(1 - t, 2.5)
      const current = Math.min(Math.round(eased * 100), 100)
      setProgress(current)

      if (t < 1) {
        raf = requestAnimationFrame(step)
      } else {
        setProgress(100)
        const exitTimer = setTimeout(() => {
          if (onlyOncePerSession) {
            try {
              sessionStorage.setItem(SESSION_KEY, 'true')
            } catch {
              /* storage unavailable */
            }
          }
          setExiting(true)
          onFinishRef.current?.()
        }, reduced ? 80 : 200)

        return () => clearTimeout(exitTimer)
      }
    }

    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [shouldRender, duration, reduced, onlyOncePerSession])

  /* ESC to skip immediately */
  useEffect(() => {
    if (!shouldRender) return undefined
    const handleKey = (e) => {
      if (e.key === 'Escape') {
        setProgress(100)
        setExiting(true)
        onFinishRef.current?.()
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [shouldRender])

  /* Prevent background scroll while loading */
  useEffect(() => {
    if (!shouldRender) return undefined
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [shouldRender])

  return (
    <AnimatePresence>
      {shouldRender && (
        <motion.div
          key="simple-website-loader"
          role="status"
          aria-live="polite"
          aria-label="Loading Country Holidays Inn & Suites"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: reduced ? 0.2 : 0.45, ease: [0.22, 1, 0.36, 1] } }}
          className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#fbfdfa] px-6 ${className}`}
        >
          {/* Subtle ambient light */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-12 -left-12 h-64 w-64 rounded-full bg-[#b3d565]/20 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-12 -right-12 h-64 w-64 rounded-full bg-[#096c27]/10 blur-3xl"
          />

          <div className="relative z-10 flex flex-col items-center text-center max-w-xs sm:max-w-sm">
            {/* Logo with gentle reveal */}
            <motion.div
              initial={reduced ? false : { opacity: 0, scale: 0.92, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="relative mb-6"
            >
              <img
                src={logo}
                alt="Country Holidays Inn & Suites"
                className="h-14 sm:h-16 w-auto object-contain select-none"
              />
            </motion.div>

            {/* Minimalist Progress Track */}
            <div className="w-48 sm:w-56 overflow-hidden rounded-full bg-slate-200/80 p-0.5 shadow-inner">
              <motion.div
                className="h-1 rounded-full bg-gradient-to-r from-[#096c27] via-[#297f33] to-[#b3d565]"
                style={{ width: `${progress}%` }}
                transition={{ ease: 'linear' }}
              />
            </div>

            {/* Percentage & Status */}
            <div className="mt-3 flex items-center justify-between w-48 sm:w-56 text-[11px] font-medium text-slate-500 font-varela">
              <span className="tracking-wide">Loading</span>
              <span className="font-semibold tabular-nums text-[#096c27]">{progress}%</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/* ------------------------------------------------------------------ */
/*  Inline / content loaders                                          */
/* ------------------------------------------------------------------ */
export function InlineSpinner({ size = 'md', className = '' }) {
  const sizeMap = {
    sm: 'h-4 w-4 border-2',
    md: 'h-6 w-6 border-2',
    lg: 'h-10 w-10 border-[3px]',
  }

  return (
    <div
      className={`inline-block animate-spin rounded-full border-current border-t-transparent text-[#297f33] ${sizeMap[size] || sizeMap.md} ${className}`}
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
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-200/80 bg-white shadow-sm">
        <InlineSpinner size="md" />
      </div>
      <p className="text-sm font-medium text-slate-500 font-varela">{message}</p>
    </div>
  )
}
