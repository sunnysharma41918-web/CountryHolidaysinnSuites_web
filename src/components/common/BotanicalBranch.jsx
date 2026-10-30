import { motion, useReducedMotion } from 'framer-motion'

/**
 * BotanicalBranch
 * Hand-drawn botanical floral illustration flanking section headers,
 * matching the user's reference mockup with curving leafy twigs, wild rosebuds,
 * delicate seed pods, and baseline divider rule.
 */
export default function BotanicalBranch({ mirror = false, className = '' }) {
  const reduced = !!useReducedMotion()

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none select-none inline-flex items-center ${className}`}
      style={{ transform: mirror ? 'scaleX(-1)' : undefined }}
    >
      <svg
        viewBox="0 0 220 70"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-12 min-[360px]:w-16 min-[420px]:w-24 sm:w-36 md:w-48 lg:w-56 h-auto overflow-visible text-[#063a2f]"
      >
        {/* Baseline rule extending towards title */}
        <line
          x1="65"
          y1="56"
          x2="220"
          y2="56"
          stroke="currentColor"
          strokeWidth="0.9"
          strokeOpacity="0.28"
        />

        {/* Primary Upper Stem */}
        <motion.path
          d="M 220,54 C 160,52 105,38 16,14"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinecap="round"
          initial={reduced ? undefined : { pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        />

        {/* Secondary Lower Stem */}
        <motion.path
          d="M 195,56 C 145,54 100,44 38,32"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
          initial={reduced ? undefined : { pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        />

        {/* Twig branching upward from upper stem */}
        <path
          d="M 38,18 C 34,12 38,6 48,3"
          stroke="currentColor"
          strokeWidth="1.1"
          strokeLinecap="round"
        />
        {/* Small leaves on upward twig */}
        <path
          d="M 48,3 C 51,1.5 54,2.5 55,5.5 C 54,7.5 50,7 48,3 Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
        />
        <path
          d="M 41,10 C 45,7.5 49,8.5 49,11.5 C 46,13 42.5,12 41,10 Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
        />

        {/* Sprig branching from upper stem with bud pods */}
        <path
          d="M 78,26 C 72,18 76,11 88,7"
          stroke="currentColor"
          strokeWidth="1.1"
          strokeLinecap="round"
        />
        <ellipse cx="82" cy="14" rx="1.6" ry="1.2" fill="currentColor" />
        <ellipse cx="85.5" cy="10.5" rx="1.6" ry="1.2" fill="currentColor" />
        <ellipse cx="89" cy="7" rx="1.5" ry="1.2" fill="currentColor" />
        <path
          d="M 74,22 C 70,19 66,20 67,23 C 70,24 73,23 74,22 Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
        />

        {/* Top-left tip rosebud / blossom on primary stem */}
        <path
          d="M 16,14 C 11,10 7,9 4,11 C 1.5,13.5 2,17 5,19 C 8.5,18 12.5,16 16,14 Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
        />
        <path
          d="M 5,11 C 3.5,8 2.5,5 4.5,4 C 6.5,4 7.5,7 7,10"
          stroke="currentColor"
          strokeWidth="1"
        />
        <path
          d="M 2,12 C 0.5,11 -0.5,9.5 0.5,8.5 C 1.8,8.5 2.5,10 2.5,12"
          stroke="currentColor"
          strokeWidth="0.9"
        />

        {/* Leaves on upper stem */}
        <path
          d="M 25,16 C 22,11 17,12 17,15 C 20,17 23,17 25,16 Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
        />
        <path
          d="M 26,16 C 24,20 20,21 19,19 C 20,17 23,16 26,16 Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
        />
        <path
          d="M 115,36 C 109,30 102,32 103,35 C 108,37 112,37 115,36 Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
        />
        <path
          d="M 155,44 C 149,39 143,41 144,43.5 C 148,45 152,45 155,44 Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
        />

        {/* Lower stem tip flower bud (around x=38, y=32) */}
        <path
          d="M 38,32 C 32,30 26,31 24,34 C 22,37.5 24,41 28,41 C 32,40 35,36 38,32 Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
        />
        <path
          d="M 24,34 C 21,33 18,34 18,36 C 19,38 22,37.5 24,36"
          stroke="currentColor"
          strokeWidth="0.9"
        />

        {/* Leaves on lower stem */}
        <path
          d="M 52,36 C 49,41 45,42 44,40 C 46,38 49,37 52,36 Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
        />
        <path
          d="M 85,43 C 81,48 76,49 76,46 C 79,44 82,43 85,43 Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
        />
        <path
          d="M 130,49 C 125,54 120,54 120,52 C 123,50 127,49 130,49 Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
        />

        {/* Cross twig between stems */}
        <path
          d="M 64,38 C 61,31 57,27 52,23"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinecap="round"
        />
        <ellipse cx="51" cy="22" rx="1.5" ry="1.2" fill="currentColor" />
      </svg>
    </div>
  )
}
