import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion, useAnimationControls, useReducedMotion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

/* ------------------------------------------------------------------ */
/*  Tokens (taken from the car illustration)                           */
/* ------------------------------------------------------------------ */
const DARK = '#03352b'
const TEAL = '#16c9a5'
const TEAL_DEEP = '#00ab88'
const TEAL_SOFT = '#dff5ee'
const EASE_EXIT = [0.16, 1, 0.3, 1]
const SESSION_KEY = 'ch_web_loader_shown'

const STAGES = [
  { at: 0, text: 'Packing the bags' },
  { at: 25, text: 'Picking the best route' },
  { at: 55, text: 'Skipping the traffic' },
  { at: 85, text: 'Almost there' },
  { at: 100, text: 'Welcome!' },
]

// The car does a little hop and honks at these points
const HOPS = [
  { at: 30, text: 'Beep beep!' },
  { at: 68, text: 'Vroom!' },
]

const svgUri = (svg) => `url("data:image/svg+xml,${encodeURIComponent(svg)}")`

const HILLS = svgUri(
  `<svg xmlns='http://www.w3.org/2000/svg' width='240' height='64' viewBox='0 0 240 64'><path d='M0 64V40Q30 8 60 36T120 34T180 30T240 40V64Z' fill='${TEAL_SOFT}'/></svg>`,
)
const TREES = svgUri(
  `<svg xmlns='http://www.w3.org/2000/svg' width='160' height='56' viewBox='0 0 160 56'><g fill='#c4ece0'><rect x='30' y='34' width='4' height='22'/><circle cx='32' cy='26' r='14'/><rect x='108' y='40' width='4' height='16'/><circle cx='110' cy='34' r='10'/></g></svg>`,
)

/* ------------------------------------------------------------------ */
/*  Car                                                                */
/* ------------------------------------------------------------------ */
function Wheel({ cx, cy, spin }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r="17" fill={DARK} />
      <circle cx={cx} cy={cy} r="11.5" fill="#000" />
      <motion.g
        animate={spin ? { rotate: 360 } : undefined}
        transition={{ duration: 0.5, repeat: Infinity, ease: 'linear' }}
        style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
      >
        <circle
          cx={cx}
          cy={cy}
          r="8"
          fill="none"
          stroke="#fff"
          strokeOpacity="0.85"
          strokeWidth="2.2"
          strokeDasharray="7 43"
          strokeLinecap="round"
        />
      </motion.g>
    </g>
  )
}

function Car({ spin }) {
  return (
    <svg viewBox="0 0 200 110" className="block h-auto w-full overflow-visible" aria-hidden="true">
      <ellipse cx="100" cy="107" rx="72" ry="3" fill={DARK} opacity="0.14" />

      {/* roof + window */}
      <path d="M50 58C54 30 78 16 100 16C122 16 146 30 150 58Z" fill="#0db08e" />
      <path
        d="M48 58C52 30 78 14 100 14C122 14 148 30 152 58"
        fill="none"
        stroke={DARK}
        strokeWidth="7"
        strokeLinecap="round"
      />
      <line x1="100" y1="15" x2="100" y2="58" stroke={DARK} strokeWidth="6" />

      {/* body */}
      <path d="M14 70C14 58 24 54 44 54L152 54C174 54 188 60 190 74L190 86L14 86Z" fill={TEAL} />
      <path d="M52 86C62 70 78 66 100 66C122 66 138 70 148 86Z" fill={TEAL_DEEP} />
      <path
        d="M95 73l5 3.5-5 3.5M102 73l5 3.5-5 3.5"
        fill="none"
        stroke="#fff"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.9"
      />

      {/* lights + bumpers */}
      <rect x="13" y="66" width="4" height="5" rx="1" fill="#9b1c1c" />
      <ellipse cx="182" cy="66" rx="3.5" ry="5" fill="#fff" opacity="0.9" />
      <rect x="11" y="82" width="9" height="4" rx="2" fill={DARK} />
      <rect x="184" y="82" width="9" height="4" rx="2" fill={DARK} />

      <Wheel cx={54} cy={88} spin={spin} />
      <Wheel cx={146} cy={88} spin={spin} />
    </svg>
  )
}

/* ------------------------------------------------------------------ */
/*  Loader                                                             */
/* ------------------------------------------------------------------ */
export default function WebsiteLoader({
  visible = true,
  duration = 2800, // ms the car takes to cross the screen
  onlyOncePerSession = false,
  onFinish,
  className = '',
}) {
  const reduced = useReducedMotion()
  const carControls = useAnimationControls()

  const [progress, setProgress] = useState(0)
  const [shouldRender, setShouldRender] = useState(false)
  const [done, setDone] = useState(false)
  const [honk, setHonk] = useState('')

  const onFinishRef = useRef(onFinish)
  const hopped = useRef({})
  const honkTimer = useRef(null)

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
    hopped.current = {}
    setProgress(0)
    setDone(false)
    setShouldRender(true)
  }, [visible, onlyOncePerSession])

  /* 0 -> 100 progress */
  useEffect(() => {
    if (!shouldRender || done) return undefined
    const total = reduced ? 500 : duration
    const start = performance.now()
    let raf

    const step = (now) => {
      const t = Math.min((now - start) / total, 1)
      const eased = t * t * (3 - 2 * t) // smoothstep: gentle start, gentle stop
      setProgress(Math.floor(eased * 100))
      if (t < 1) raf = requestAnimationFrame(step)
      else setDone(true)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [shouldRender, done, duration, reduced])

  /* the car zooms off, then the curtain lifts */
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
    }, reduced ? 150 : 700)
    return () => clearTimeout(timer)
  }, [done, shouldRender, onlyOncePerSession, reduced])

  /* hop + honk at milestones */
  useEffect(() => {
    if (!shouldRender || done || reduced) return
    HOPS.forEach((h) => {
      if (progress >= h.at && !hopped.current[h.at]) {
        hopped.current[h.at] = true
        carControls.start({
          y: [0, -56, 0, -8, 0],
          rotate: [0, -16, 6, -2, 0],
          transition: { duration: 0.85, ease: 'easeOut' },
        })
        setHonk(h.text)
        clearTimeout(honkTimer.current)
        honkTimer.current = setTimeout(() => setHonk(''), 950)
      }
    })
  }, [progress, shouldRender, done, reduced, carControls])

  useEffect(() => () => clearTimeout(honkTimer.current), [])

  /* ESC = skip */
  useEffect(() => {
    if (!shouldRender) return undefined
    const onKey = (e) => e.key === 'Escape' && handleSkip()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  /* lock scroll while visible */
  useEffect(() => {
    if (!shouldRender) return undefined
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [shouldRender])

  const handleSkip = () => {
    setProgress(100)
    setDone(true)
  }

  const stage = useMemo(() => {
    let s = STAGES[0]
    for (const st of STAGES) if (progress >= st.at) s = st
    return s
  }, [progress])

  const carLeft = done ? '115%' : `${2 + progress * 0.72}%`

  return (
    <AnimatePresence mode="wait">
      {shouldRender && (
        <motion.div
          key="website-loader"
          role="status"
          aria-live="polite"
          aria-label="Loading Country Holidays InnSuites"
          className={`fixed inset-0 z-[9999] flex select-none flex-col justify-between overflow-hidden bg-white text-[#03352b] ${className}`}
          initial={{ opacity: 1 }}
          exit={{ y: '-100%', transition: { duration: reduced ? 0.25 : 0.8, ease: EASE_EXIT } }}
          style={{
            backgroundImage:
              'radial-gradient(circle at 50% 35%, rgba(22,201,165,0.10) 0%, transparent 60%)',
          }}
        >
          {/* top bar */}
          <div className="relative z-10 flex items-center justify-between px-6 pt-6 md:px-12 md:pt-8">
            <div className="flex items-center gap-2.5 text-sm font-semibold tracking-wide">
              <span className="h-2 w-2 rounded-full" style={{ background: TEAL }} />
              Country Holidays InnSuites
            </div>
            <button
              type="button"
              onClick={handleSkip}
              title="Skip (ESC)"
              className="group flex items-center gap-2 rounded-full border border-[#03352b]/15 bg-white px-4 py-1.5 text-xs font-medium text-[#03352b]/70 transition hover:border-[#16c9a5] hover:text-[#03352b] active:scale-95"
            >
              Skip
              <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" style={{ color: TEAL_DEEP }} />
            </button>
          </div>

          {/* stage */}
          <div className="relative h-[260px] w-full sm:h-[300px]">
            {/* clouds */}
            {!reduced &&
              [
                { top: 18, w: 96, dur: 16, delay: 0 },
                { top: 64, w: 64, dur: 22, delay: -8 },
              ].map((c, i) => (
                <motion.span
                  key={i}
                  className="absolute left-0 block h-6 rounded-full bg-[#e6f7f2]"
                  style={{ top: c.top, width: c.w }}
                  animate={{ x: ['100vw', '-200px'] }}
                  transition={{ duration: c.dur, delay: c.delay, repeat: Infinity, ease: 'linear' }}
                />
              ))}

            {/* hills + trees scroll past */}
            <motion.div
              className="absolute inset-x-0 h-16"
              style={{ bottom: 41, backgroundImage: HILLS, backgroundSize: '240px 64px', backgroundRepeat: 'repeat-x' }}
              animate={reduced ? undefined : { backgroundPositionX: ['0px', '-240px'] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
            />
            <motion.div
              className="absolute inset-x-0 h-14"
              style={{ bottom: 41, backgroundImage: TREES, backgroundSize: '160px 56px', backgroundRepeat: 'repeat-x' }}
              animate={reduced ? undefined : { backgroundPositionX: ['0px', '-160px'] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: 'linear' }}
            />

            {/* road */}
            <div className="absolute inset-x-0 h-[2px]" style={{ bottom: 40, background: DARK }} />
            <div
              className="absolute left-0 h-[4px] rounded-r-full"
              style={{ bottom: 39, width: `${2 + progress * 0.72 + 10}%`, maxWidth: '100%', background: TEAL }}
            />
            <motion.div
              className="absolute inset-x-0 h-[3px] opacity-25"
              style={{
                bottom: 22,
                backgroundImage: `repeating-linear-gradient(90deg, ${DARK} 0 28px, transparent 28px 56px)`,
              }}
              animate={reduced ? undefined : { backgroundPositionX: ['0px', '-56px'] }}
              transition={{ duration: 0.35, repeat: Infinity, ease: 'linear' }}
            />

            {/* car */}
            <div
              className="absolute w-[150px] sm:w-[190px]"
              style={{
                bottom: 35,
                left: carLeft,
                transition: done && !reduced ? 'left 0.65s cubic-bezier(0.5, 0, 1, 0.6)' : 'none',
              }}
            >
              <motion.div animate={carControls} style={{ transformOrigin: '50% 100%' }} className="relative">
                {/* speech bubble */}
                <AnimatePresence>
                  {honk && (
                    <motion.div
                      key={honk}
                      initial={{ opacity: 0, scale: 0.4, y: 8 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.6 }}
                      transition={{ type: 'spring', stiffness: 420, damping: 18 }}
                      className="absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-2xl border-2 bg-white px-3 py-1 text-xs font-bold shadow-sm"
                      style={{ borderColor: DARK }}
                    >
                      {honk}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* exhaust puffs + speed lines */}
                {!reduced && (
                  <>
                    {[0, 1, 2].map((i) => (
                      <motion.span
                        key={`puff-${i}`}
                        className="absolute block h-3 w-3 rounded-full"
                        style={{ left: 2, bottom: 12, background: TEAL_SOFT, border: `1px solid ${TEAL}55` }}
                        animate={{ x: [0, -34], y: [0, -8], scale: [0.4, 1.3], opacity: [0.9, 0] }}
                        transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.27, ease: 'easeOut' }}
                      />
                    ))}
                    {[0, 1, 2].map((i) => (
                      <motion.span
                        key={`line-${i}`}
                        className="absolute block h-[3px] rounded-full"
                        style={{ right: '100%', top: 40 + i * 14, width: 26 + i * 8, marginRight: 16, background: DARK }}
                        animate={{ x: [0, -22], opacity: [0, 0.35, 0] }}
                        transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.15, ease: 'easeOut' }}
                      />
                    ))}
                  </>
                )}

                {/* constant road bounce */}
                <motion.div
                  animate={reduced ? undefined : { y: [0, -2, 0, -1, 0] }}
                  transition={{ duration: 0.32, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <Car spin={!reduced} />
                </motion.div>
              </motion.div>
            </div>
          </div>

          {/* bottom: counter + status */}
          <div className="relative z-10 flex flex-col items-center px-6 pb-8 text-center md:pb-10">
            <div className="flex items-start font-black leading-none tabular-nums">
              <span className="text-6xl sm:text-7xl">{String(progress).padStart(2, '0')}</span>
              <span className="ml-1 mt-1 text-xl font-bold sm:text-2xl" style={{ color: TEAL_DEEP }}>
                %
              </span>
            </div>

            <div className="mt-3 h-6">
              <AnimatePresence mode="wait" initial={false}>
                <motion.p
                  key={stage.text}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.22 }}
                  className="text-sm font-medium text-[#03352b]/70 sm:text-base"
                >
                  {stage.text}
                </motion.p>
              </AnimatePresence>
            </div>

            <p className="mt-4 text-[11px] text-[#03352b]/40">Press ESC to skip</p>
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