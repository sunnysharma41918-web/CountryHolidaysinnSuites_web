import { motion, useReducedMotion } from 'framer-motion'

/**
 * FlightTrailConnector
 * Recreates the artistic flight line with loop-de-loop and airplane silhouette
 * from the user's reference art to visually connect sections on the page.
 */
export default function FlightTrailConnector({
  variant = 'ltr', // 'ltr' | 'rtl'
  className = '',
  lineColor = '#297f33',
  planeColor = '#063a2f',
  strokeWidth = 1.6,
  dashed = true,
}) {
  const reduced = !!useReducedMotion()

  // Path data matching the uploaded reference image:
  // Starts on one side, S-curves, performs a circular loop-de-loop, and heads up towards the plane
  const isLtr = variant === 'ltr'

  // LTR: Left to Right path with loop on the right
  const ltrPath = 'M 40,25 C 100,45 140,125 220,128 C 310,130 380,55 490,58 C 580,60 620,112 670,134 C 730,148 760,110 755,75 C 750,45 705,48 680,78 C 655,108 670,142 740,140 C 790,138 830,105 870,82'

  // RTL: Right to Left path with loop on the left
  const rtlPath = 'M 920,25 C 860,45 820,125 740,128 C 650,130 580,55 470,58 C 380,60 340,112 290,134 C 230,148 200,110 205,75 C 210,45 255,48 280,78 C 305,108 290,142 220,140 C 170,138 130,105 90,82'

  const path = isLtr ? ltrPath : rtlPath

  // Coordinates and base rotation for the plane at the end of the path
  const planePos = isLtr
    ? { x: 870, y: 82, rot: 65 }
    : { x: 90, y: 82, rot: -65 }

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none relative z-20 w-full overflow-visible py-1 sm:py-2 select-none ${className}`}
    >
      <div className="mx-auto w-full max-w-[1320px] px-4 sm:px-8">
        <svg
          viewBox="0 0 960 160"
          fill="none"
          preserveAspectRatio="xMidYMid meet"
          className="h-14 sm:h-20 md:h-24 w-full overflow-visible"
        >
          <defs>
            <linearGradient id="flight-trail-grad-ltr" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#297f33" stopOpacity="0.3" />
              <stop offset="65%" stopColor="#6aa22f" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#063a2f" stopOpacity="0.8" />
            </linearGradient>
            <linearGradient id="flight-trail-grad-rtl" x1="100%" y1="0%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#297f33" stopOpacity="0.3" />
              <stop offset="65%" stopColor="#6aa22f" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#063a2f" stopOpacity="0.8" />
            </linearGradient>
          </defs>

          {/* Connecting flight route line */}
          <motion.path
            d={path}
            stroke={lineColor || (isLtr ? 'url(#flight-trail-grad-ltr)' : 'url(#flight-trail-grad-rtl)')}
            strokeWidth={strokeWidth}
            strokeDasharray={dashed ? '5 6' : undefined}
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={reduced ? { pathLength: 1, opacity: 0.5 } : { pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 0.55 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
          />

          {/* Airplane at the tip of the flight curve */}
          <g
            transform={`translate(${planePos.x}, ${planePos.y}) rotate(${planePos.rot})`}
          >
            <motion.g
              initial={reduced ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.6 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              <motion.g
                animate={
                  reduced
                    ? undefined
                    : {
                        y: [0, -3, 0],
                        x: [0, 2, 0],
                        rotate: [0, 2, 0],
                      }
                }
                transition={{
                  duration: 3.2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                {/* Silhouette jet airliner matching the user's reference drawing */}
                <path
                  d="M 0,-14 C -0.8,-14 -1.6,-12 -1.6,-9 L -1.6,-1 L -15,4 L -15,6.5 L -1.6,2.5 L -1.6,11 L -5,14 L -5,16.5 L 0,15 L 5,16.5 L 5,14 L 1.6,11 L 1.6,2.5 L 15,6.5 L 15,4 L 1.6,-1 L 1.6,-9 C 1.6,-12 0.8,-14 0,-14 Z"
                  fill={planeColor}
                  className="drop-shadow-[0_2px_4px_rgba(6,58,47,0.18)]"
                />
              </motion.g>
            </motion.g>
          </g>
        </svg>
      </div>
    </div>
  )
}
