import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, animate, motion, useMotionValue, useReducedMotion, useTransform } from 'framer-motion'

const SESSION_KEY = 'ch_web_loader_shown'
const GREEN_DARK = '#096c27'
const GREEN = '#297f33'

export default function WebsiteLoader({
  visible = true,
  duration = 2400, // ms for 0 -> 100 (smooth 2.4s count)
  onlyOncePerSession = false,
  onFinish,
  className = '',
}) {
  const reduced = useReducedMotion()
  const [exiting, setExiting] = useState(false)
  const onFinishRef = useRef(onFinish)
  const finished = useRef(false)

  // motion values update the DOM directly: no React re-render per frame
  const value = useMotionValue(0)
  const label = useTransform(value, (v) => Math.round(v))
  const barScale = useTransform(value, [0, 100], [0, 1])

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
    if (alreadySeen) onFinishRef.current?.()
  }, [alreadySeen])

  const shouldRender = visible && !alreadySeen && !exiting

  const finish = useCallback(() => {
    if (finished.current) return
    finished.current = true
    if (onlyOncePerSession) {
      try {
        sessionStorage.setItem(SESSION_KEY, 'true')
      } catch {
        /* storage unavailable */
      }
    }
    setExiting(true)
    onFinishRef.current?.()
  }, [onlyOncePerSession])

  /* count 0 -> 100 */
  useEffect(() => {
    if (!shouldRender) return undefined
    finished.current = false
    value.set(0)
    let timer
    const controls = animate(value, 100, {
      duration: (reduced ? 300 : duration) / 1000,
      ease: [0.45, 0, 0.55, 1],
      onComplete: () => {
        timer = setTimeout(finish, 250)
      },
    })
    return () => {
      controls.stop()
      clearTimeout(timer)
    }
  }, [shouldRender, duration, reduced, value, finish])

  /* ESC = skip */
  useEffect(() => {
    if (!shouldRender) return undefined
    const onKey = (e) => {
      if (e.key === 'Escape') {
        value.stop?.()
        value.set(100)
        finish()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [shouldRender, value, finish])

  /* lock scroll */
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
          exit={{
            opacity: 0,
            y: -24,
            transition: { duration: reduced ? 0.15 : 0.4, ease: [0.22, 1, 0.36, 1] },
          }}
          className={`fixed inset-0 z-[9999] flex select-none flex-col items-center justify-center bg-[#fbfdfa] px-6 ${className}`}
          style={{ willChange: 'transform, opacity' }}
        >
          <div className="flex items-start font-black leading-none tabular-nums" style={{ color: GREEN_DARK }}>
            <motion.span className="text-8xl sm:text-9xl">{label}</motion.span>
            <span className="ml-1 mt-2 text-2xl font-bold sm:mt-3 sm:text-3xl" style={{ color: GREEN }}>
              %
            </span>
          </div>

          {/* progress bar: scaleX is GPU-accelerated */}
          <div className="mt-8 h-1 w-48 overflow-hidden rounded-full bg-[#096c27]/10 sm:w-60">
            <motion.div
              className="h-full w-full origin-left rounded-full bg-gradient-to-r from-[#096c27] via-[#297f33] to-[#b3d565]"
              style={{ scaleX: barScale }}
            />
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
      <p className="font-varela text-sm font-medium text-slate-500">{message}</p>
    </div>
  )
}