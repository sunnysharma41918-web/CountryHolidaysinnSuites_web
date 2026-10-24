import { useEffect, useRef, useState } from 'react'
import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from 'framer-motion'

/* ------------------------------------------------------------------ */
/*  Tokens (from the Country Holidays InnSuites design system)         */
/* ------------------------------------------------------------------ */
const EASE = [0.16, 1, 0.3, 1]
const K = 1.45 // global time stretch for the intro (~6.8s total)
const LIME = '#c5f82a'
const OBSIDIAN = '#020617'
const LEAF_DARK = '#0e6f2a' // logo dark green
const LEAF_LIGHT = '#b3d966' // logo light green
const FLOWER_COLORS = [LIME, '#ffffff', '#ffd3df', LIME, '#fde047', '#ffffff']

const display = { fontFamily: "'Bebas Neue', Impact, sans-serif" }
const heading = { fontFamily: "'Outfit', system-ui, sans-serif" }
const script = { fontFamily: "'Caveat', cursive" }

const rand = (i, salt = 1) => {
  const x = Math.sin(i * 12.9898 + salt * 78.233) * 43758.5453
  return x - Math.floor(x)
}

/* ------------------------------------------------------------------ */
/*  Tree geometry (viewBox 0 0 400 440) – redrawn from the brand logo  */
/* ------------------------------------------------------------------ */
const TRUNK =
  'M148 414 C176 380 186 340 187 300 L188 262 L212 262 L213 300 C214 340 226 382 256 414 C236 410 218 402 206 392 C204 402 202 410 198 416 C194 408 192 400 190 392 C178 402 162 410 148 414 Z'

const BRANCHES = [
  { d: 'M192 284 C180 244 150 212 100 190', w: 5 },
  { d: 'M194 304 C170 272 130 264 78 262', w: 4.5 },
  { d: 'M191 334 C160 322 120 330 90 340', w: 4 },
  { d: 'M200 272 C198 222 196 170 200 110', w: 5 },
  { d: 'M208 284 C222 244 252 212 300 190', w: 5 },
  { d: 'M209 304 C235 276 275 266 322 265', w: 4.5 },
  { d: 'M211 336 C240 322 280 330 312 342', w: 4 },
  { d: 'M196 232 C180 192 160 152 140 120', w: 4 },
  { d: 'M204 232 C222 192 245 152 262 118', w: 4 },
]

// x, y, rotation (0 = up), scale
const LEAVES = [
  [100, 190, -70, 1.0], [78, 262, -85, 0.95], [90, 340, -100, 0.85],
  [140, 120, -30, 1.0], [120, 160, -55, 0.8], [110, 225, -75, 0.75],
  [95, 300, -90, 0.7], [200, 110, 0, 1.15], [190, 75, -12, 0.8],
  [214, 60, 10, 0.7], [262, 118, 30, 1.0], [300, 190, 70, 1.0],
  [322, 265, 85, 0.95], [312, 342, 100, 0.85], [282, 160, 55, 0.8],
  [290, 225, 75, 0.75], [305, 300, 90, 0.7], [165, 95, -20, 0.7],
  [240, 92, 20, 0.7], [175, 150, -38, 0.7], [228, 150, 38, 0.7],
  [150, 60, -25, 0.6], [252, 58, 25, 0.6], [130, 95, -45, 0.6],
  [272, 92, 45, 0.6],
]

// x, y, size
const FLOWERS = [
  [86, 215, 1.0], [118, 140, 1.1], [168, 98, 1.2], [205, 50, 1.3],
  [244, 100, 1.15], [288, 140, 1.1], [318, 215, 1.0], [98, 300, 1.0],
  [305, 305, 1.0], [200, 160, 1.1], [150, 215, 0.95], [255, 215, 0.95],
  [60, 270, 0.8], [345, 270, 0.8],
]

const LEAF = 'M0 0 C-20 -12 -22 -38 0 -58 C22 -38 20 -12 0 0 Z'
const CURL = 'M0 -4 C-9 -16 -7 -34 3 -44'

// Falling petals (deterministic so the layout never jumps)
const PETALS = Array.from({ length: 24 }, (_, i) => ({
  left: 18 + rand(i, 1) * 64,
  top: 8 + rand(i, 2) * 42,
  dx: (rand(i, 3) - 0.5) * 180,
  dy: 220 + rand(i, 4) * 260,
  spin: (rand(i, 5) > 0.5 ? 1 : -1) * (240 + rand(i, 6) * 300),
  dur: 4.2 + rand(i, 7) * 3,
  delay: 2.8 + rand(i, 8) * 2.2,
  size: 0.7 + rand(i, 9) * 0.8,
  color: FLOWER_COLORS[i % FLOWER_COLORS.length],
}))

/* ------------------------------------------------------------------ */
/*  Pieces                                                             */
/* ------------------------------------------------------------------ */
function Leaf({ x, y, r, s, delay, rm }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${r})`}>
      <motion.g
        style={{ originX: 0.5, originY: 1 }}
        initial={{ scale: rm ? s : 0 }}
        animate={{ scale: s }}
        transition={
          rm
            ? { duration: 0 }
            : { type: 'spring', stiffness: 110, damping: 14, delay: delay * K }
        }
      >
        <path d={LEAF} transform="translate(-2.6 2.2)" fill={LEAF_DARK} />
        <path d={LEAF} fill={LEAF_LIGHT} />
        <path
          d={CURL}
          fill="none"
          stroke={LEAF_DARK}
          strokeWidth="2.4"
          strokeLinecap="round"
        />
      </motion.g>
    </g>
  )
}

function Flower({ x, y, size, color, delay, rm }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <motion.g
        style={{ originX: 0.5, originY: 0.5 }}
        initial={rm ? { scale: size, rotate: 0 } : { scale: 0, rotate: -140 }}
        animate={{ scale: size, rotate: 0 }}
        transition={rm ? { duration: 0 } : { duration: 1.5, delay: delay * K, ease: EASE }}
      >
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <ellipse
            key={i}
            cx="0"
            cy="-9.5"
            rx="5"
            ry="10"
            transform={`rotate(${i * 60})`}
            fill={color}
            stroke="rgba(2,6,23,0.3)"
            strokeWidth="0.6"
          />
        ))}
        <circle r="3.6" fill="#facc15" stroke="rgba(2,6,23,0.3)" strokeWidth="0.5" />
      </motion.g>
    </g>
  )
}

/* ------------------------------------------------------------------ */
/*  Scene – mounts fresh each time the loader opens                    */
/* ------------------------------------------------------------------ */
function Scene({ duration }) {
  const rm = useReducedMotion()
  const t = (v) => (rm ? 0 : v * K)

  const progress = useMotionValue(0)
  const counter = useTransform(progress, (v) =>
    String(Math.round(v)).padStart(3, '0'),
  )
  const barScale = useTransform(progress, (v) => v / 100)

  useEffect(() => {
    const controls = animate(progress, 100, {
      duration: rm ? 0.4 : duration,
      ease: [0.65, 0, 0.35, 1],
    })
    return () => controls.stop()
  }, [progress, duration, rm])

  const words = ['COUNTRY', 'HOLIDAYS']
  let charIndex = 0

  return (
    <>
      {/* top hairline, as on every section */}
      <div className="absolute inset-x-0 top-0 h-px bg-white/15" />

      <div className="relative flex flex-col items-center">
        {/* tree stage */}
        <div className="relative w-[min(80vw,44vh)]">
          {/* soft bloom glow */}
          <motion.div
            className="absolute left-1/2 top-[38%] aspect-square w-[130%] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
            style={{ background: `radial-gradient(circle, ${LIME}33, transparent 62%)` }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: t(1.8), delay: t(2.2), ease: EASE }}
          />

          {/* expanding rings at the moment of bloom */}
          {!rm &&
            [0, 1, 2].map((i) => (
              <div
                key={i}
                className="absolute left-1/2 top-[38%] aspect-square w-[60%] -translate-x-1/2 -translate-y-1/2"
              >
                <motion.div
                  className="h-full w-full rounded-full border"
                  style={{ borderColor: `${LIME}55` }}
                  initial={{ scale: 0.2, opacity: 0.8 }}
                  animate={{ scale: 3.4, opacity: 0 }}
                  transition={{ duration: 2.8, delay: (2.55 + i * 0.28) * K, ease: EASE }}
                />
              </div>
            ))}

          {/* the tree */}
          <motion.div
            style={{ transformOrigin: '50% 100%' }}
            animate={rm ? undefined : { rotate: [0, 1.1, -1.1, 0] }}
            transition={{ duration: 6, delay: 3.6 * K, repeat: Infinity, ease: 'easeInOut' }}
          >
            <svg viewBox="0 0 400 440" className="relative block w-full overflow-visible">
              <defs>
                <clipPath id="ch-trunk-clip">
                  <motion.rect
                    x="0"
                    width="400"
                    initial={{ y: rm ? 0 : 440, height: rm ? 440 : 0 }}
                    animate={{ y: 0, height: 440 }}
                    transition={{ duration: t(1.4), delay: t(0.35), ease: EASE }}
                  />
                </clipPath>
                <linearGradient id="ch-trunk-grad" x1="0" y1="1" x2="0" y2="0">
                  <stop offset="0" stopColor="#0b5a22" />
                  <stop offset="1" stopColor="#17913d" />
                </linearGradient>
              </defs>

              {/* ground line */}
              <motion.path
                d="M60 416 H340"
                stroke="rgba(255,255,255,0.28)"
                strokeWidth="1"
                fill="none"
                initial={{ pathLength: rm ? 1 : 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: t(1.2), ease: EASE }}
              />

              {/* seed */}
              <motion.circle
                cx="200"
                cy="414"
                r="4"
                fill={LIME}
                initial={{ scale: 0, opacity: 1 }}
                animate={{ scale: [0, 1.6, 1], opacity: [1, 1, 0] }}
                transition={{ duration: t(0.9), delay: t(0.1), times: [0, 0.4, 1] }}
                style={{ originX: 0.5, originY: 0.5 }}
              />

              {/* branches */}
              {BRANCHES.map((b, i) => (
                <motion.path
                  key={i}
                  d={b.d}
                  fill="none"
                  stroke={LEAF_DARK}
                  strokeWidth={b.w}
                  strokeLinecap="round"
                  initial={{ pathLength: rm ? 1 : 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: t(0.95), delay: t(1.05 + i * 0.1), ease: EASE }}
                />
              ))}

              {/* trunk (revealed from the roots upward) */}
              <g clipPath="url(#ch-trunk-clip)">
                <path d={TRUNK} fill="url(#ch-trunk-grad)" />
              </g>

              {/* leaves – growing bottom-up like a wave */}
              {LEAVES.map(([x, y, r, s], i) => (
                <Leaf
                  key={i}
                  x={x}
                  y={y}
                  r={r}
                  s={s}
                  rm={rm}
                  delay={1.55 + ((340 - y) / 340) * 0.9 + rand(i, 11) * 0.12}
                />
              ))}

              {/* flowers – the finish */}
              {FLOWERS.map(([x, y, size], i) => (
                <Flower
                  key={i}
                  x={x}
                  y={y}
                  size={size}
                  rm={rm}
                  color={FLOWER_COLORS[i % FLOWER_COLORS.length]}
                  delay={2.6 + rand(i, 21) * 0.9}
                />
              ))}
            </svg>
          </motion.div>

          {/* falling petals */}
          {!rm &&
            PETALS.map((p, i) => (
              <motion.span
                key={i}
                className="pointer-events-none absolute block"
                style={{
                  left: `${p.left}%`,
                  top: `${p.top}%`,
                  width: 9 * p.size,
                  height: 13 * p.size,
                  background: p.color,
                  borderRadius: '80% 0 80% 0',
                  opacity: 0,
                }}
                animate={{
                  x: [0, p.dx * 0.6, p.dx],
                  y: [0, p.dy * 0.5, p.dy],
                  rotate: [0, p.spin * 0.5, p.spin],
                  opacity: [0, 1, 1, 0],
                }}
                transition={{
                  duration: p.dur,
                  delay: p.delay * K,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  times: [0, 0.2, 0.75, 1],
                }}
              />
            ))}
        </div>

        {/* wordmark */}
        <div className="relative mt-4 flex flex-col items-center">
          <h1
            className="flex flex-wrap justify-center gap-x-[0.28em] text-[clamp(2.6rem,9vw,6rem)] leading-[0.92] tracking-[0.02em] text-white"
            style={display}
            aria-label="Country Holidays InnSuites"
          >
            {words.map((word) => (
              <span key={word} className="inline-flex" aria-hidden="true">
                {word.split('').map((ch) => {
                  const i = charIndex++
                  return (
                    <span key={i} className="inline-block overflow-hidden pb-[0.04em]">
                      <motion.span
                        className="inline-block"
                        initial={{ y: rm ? '0%' : '110%' }}
                        animate={{ y: '0%' }}
                        transition={{ duration: t(0.9), delay: t(2.35 + i * 0.04), ease: EASE }}
                      >
                        {ch}
                      </motion.span>
                    </span>
                  )
                })}
              </span>
            ))}
          </h1>

          <div className="-mt-1 -rotate-3">
            <motion.span
              className="block text-[clamp(1.7rem,4.2vw,2.6rem)] leading-none"
              style={{ ...script, color: LIME }}
              initial={{ opacity: 0, y: rm ? 0 : 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: t(0.9), delay: t(3.05), ease: EASE }}
            >
              InnSuites
            </motion.span>
          </div>
        </div>
      </div>

      {/* bottom row: status + counter */}
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between px-6 pb-7 md:px-10">
        <div className="flex items-center gap-3 text-sm text-white/60" style={heading}>
          <span className="relative flex h-2 w-2">
            <span
              className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"
              style={{ background: LIME }}
            />
            <span className="relative inline-flex h-2 w-2 rounded-full" style={{ background: LIME }} />
          </span>
          Preparing your stay
        </div>

        <motion.span
          className="text-[clamp(2.8rem,8vw,5.5rem)] leading-[0.8] text-white tabular-nums"
          style={display}
        >
          {counter}
        </motion.span>
      </div>

      {/* progress hairline */}
      <motion.div
        className="absolute inset-x-0 bottom-0 h-[2px] origin-left"
        style={{ scaleX: barScale, background: LIME }}
      />
    </>
  )
}

/* ------------------------------------------------------------------ */
/*  Preloader                                                          */
/*  <Preloader visible={loading} />                                    */
/*  minDuration (ms) keeps the full sequence on screen even if the    */
/*  page loads sooner. onExitComplete fires when the curtain is gone. */
/* ------------------------------------------------------------------ */
export default function Preloader({ visible, minDuration = 6800, onExitComplete }) {
  const [holding, setHolding] = useState(visible)
  const timer = useRef(null)

  // Start the minimum-time hold each time the loader is switched on
  useEffect(() => {
    if (!visible) return
    setHolding(true)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setHolding(false), minDuration)
  }, [visible, minDuration])

  useEffect(() => () => clearTimeout(timer.current), [])

  const open = visible || holding

  // Lock scrolling while the loader is up
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])

  return (
    <AnimatePresence onExitComplete={onExitComplete}>
      {open && (
        <>
          {/* lime trailing edge that follows the curtain up */}
          <motion.div
            key="ch-preloader-lime"
            className="pointer-events-none fixed inset-0 z-[99]"
            style={{ background: LIME }}
            initial={{ clipPath: 'inset(0% 0% 0% 0%)' }}
            exit={{
              clipPath: 'inset(0% 0% 100% 0%)',
              transition: { duration: 1.6, delay: 0.6, ease: EASE },
            }}
          />

          <motion.div
            key="ch-preloader"
            role="status"
            aria-live="polite"
            aria-label="Loading Country Holidays InnSuites"
            className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden"
            style={{ background: OBSIDIAN }}
            initial={{ clipPath: 'inset(0% 0% 0% 0%)' }}
            exit={{
              clipPath: 'inset(0% 0% 100% 0%)',
              transition: { duration: 1.5, delay: 0.45, ease: EASE },
            }}
          >
            <motion.div
              className="flex h-full w-full items-center justify-center"
              exit={{
                opacity: 0,
                scale: 1.05,
                transition: { duration: 0.8, ease: EASE },
              }}
            >
              <Scene duration={Math.max(minDuration / 1000 - 0.4, 1)} />
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}