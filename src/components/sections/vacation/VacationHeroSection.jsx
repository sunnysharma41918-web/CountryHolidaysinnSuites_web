import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion'
import { ArrowDown } from 'lucide-react'
import { openEnquiry, PRICING_ID, scrollToId } from './content'
import heroPerson from '../../../assets/chis-hero-model.png'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

/* -------------------------------------------------------------------------- */
/*  Palette (from the reference banner)                                       */
/*  #0f2a1d forest   #123524 forest-2   #fbf4e6 cream   #eadbbd tan           */
/*  #7a4a1d → #e3a64a  gold-brown gradient                                    */
/* -------------------------------------------------------------------------- */

const HERO_IMAGE = '/hero-mountain.jpg'

const PINES = [
  ...[30, 105, 185, 265, 350, 440, 520].map((x, i) => ({ x, y: 905 + (i % 3) * 8, s: 1.5 + ((i * 3) % 5) / 6 })),
  ...[1150, 1235, 1320, 1405, 1490, 1575].map((x, i) => ({ x, y: 910 + (i % 2) * 10, s: 1.3 + ((i * 2) % 5) / 6 })),
]

/* ---------- illustrated alpine scene (4 parallax layers) ---------- */

function Pine({ x, y, s }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M0 -150 L38 -92 L20 -92 L52 -40 L28 -40 L62 10 H-62 L-28 -40 H-52 L-20 -92 H-38Z" fill="#1d4632" />
      <rect x="-6" y="10" width="12" height="22" fill="#3b2a1c" />
    </g>
  )
}

function SceneSky() {
  return (
    <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" className="h-full w-full" aria-hidden="true">
      <defs>
        <linearGradient id="vh-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#b7d9f0" />
          <stop offset="0.55" stopColor="#f1e8d2" />
          <stop offset="1" stopColor="#fbf4e6" />
        </linearGradient>
        <radialGradient id="vh-sunglow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#fff3cf" stopOpacity="0.95" />
          <stop offset="0.4" stopColor="#ffd98f" stopOpacity="0.45" />
          <stop offset="1" stopColor="#ffd98f" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="1600" height="900" fill="url(#vh-sky)" />
      <circle className="vh-sun" cx="1180" cy="230" r="300" fill="url(#vh-sunglow)" />
      <g className="vh-cloud" fill="#fff">
        <ellipse cx="960" cy="330" rx="190" ry="32" opacity="0.7" />
        <ellipse cx="1070" cy="310" rx="120" ry="30" opacity="0.8" />
        <ellipse cx="1380" cy="200" rx="160" ry="26" opacity="0.6" />
        <ellipse cx="1470" cy="185" rx="90" ry="24" opacity="0.7" />
      </g>
    </svg>
  )
}

function SceneFar() {
  return (
    <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" className="h-full w-full" aria-hidden="true">
      <path d="M440 700 L650 470 L760 540 L930 330 L1090 500 L1190 410 L1340 530 L1470 430 L1600 540 V700Z" fill="#9db3c8" />
      <path d="M930 330 L875 420 L912 404 L934 446 L962 408 L1004 426Z" fill="#f6f9fc" />
      <path d="M650 470 L610 530 L640 520 L662 552 L690 520 L714 534Z" fill="#f6f9fc" />
      <path d="M1190 410 L1150 470 L1178 462 L1196 490 L1220 462 L1244 472Z" fill="#f6f9fc" />
      <path d="M1470 430 L1430 490 L1458 482 L1476 510 L1500 482 L1524 492Z" fill="#f6f9fc" />
      <path d="M0 690 L170 570 L290 630 L420 540 L560 660 L640 700Z" fill="#b3c6d6" opacity="0.85" />
    </svg>
  )
}

function SceneMid() {
  return (
    <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" className="h-full w-full" aria-hidden="true">
      <defs>
        <linearGradient id="vh-lake" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#a7cad8" />
          <stop offset="1" stopColor="#dcebe8" />
        </linearGradient>
      </defs>
      <rect y="690" width="1600" height="210" fill="url(#vh-lake)" />
      {Array.from({ length: 7 }).map((_, i) => (
        <rect
          key={i}
          className="vh-shimmer"
          x={700 + i * 50}
          y={720 + i * 18}
          width={150 - i * 8}
          height="3"
          rx="1.5"
          fill="#fff"
          opacity="0.6"
          style={{ animationDelay: `${i * 300}ms` }}
        />
      ))}
      <path d="M0 700 Q200 640 420 690 T820 700 T1200 680 T1600 700 V720 H0Z" fill="#6f9a7c" />
      <path d="M640 715 Q760 680 880 712 Q770 730 640 715Z" fill="#4f7d62" />
    </svg>
  )
}

function SceneFront() {
  return (
    <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" className="h-full w-full" aria-hidden="true">
      {PINES.map((p, i) => (
        <Pine key={i} {...p} />
      ))}
    </svg>
  )
}

/* ---------- parallax layer driven by pointer springs ---------- */

function Layer({ px, py, depth, children }) {
  const x = useTransform(px, [-0.5, 0.5], [depth, -depth])
  const y = useTransform(py, [-0.5, 0.5], [depth * 0.55, -depth * 0.55])
  return (
    <motion.div style={{ x, y }} className="absolute -inset-10 will-change-transform">
      {children}
    </motion.div>
  )
}

/* ---------- main component ---------- */

export default function VacationHeroSection() {
  const ref = useRef(null)
  const sceneRef = useRef(null)
  const contentRef = useRef(null)
  const reduced = !!useReducedMotion()

  // Pointer parallax with springs (no per-frame React renders)
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const px = useSpring(mx, { stiffness: 70, damping: 18, mass: 0.6 })
  const py = useSpring(my, { stiffness: 70, damping: 18, mass: 0.6 })
  const personX = useTransform(px, [-0.5, 0.5], [-14, 14])
  const personY = useTransform(py, [-0.5, 0.5], [-6, 6])

  const onMove = (e) => {
    if (reduced) return
    const r = ref.current.getBoundingClientRect()
    mx.set((e.clientX - r.left) / r.width - 0.5)
    my.set((e.clientY - r.top) / r.height - 0.5)
  }

  // Intro timeline + scroll parallax (skipped for reduced motion)
  useEffect(() => {
    const root = ref.current
    if (!root) return undefined

    const mm = gsap.matchMedia()
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const q = (sel) => root.querySelectorAll(sel)

      const tl = gsap.timeline({ defaults: { ease: 'power3.out' }, delay: 0.1 })
      tl.from(q('[data-hero="eyebrow"]'), { y: 16, opacity: 0, duration: 0.7 })
        .from(q('[data-hero="line"]'), { yPercent: 115, opacity: 0, duration: 1, stagger: 0.14 }, '-=0.35')
        .from(q('[data-hero="sub"]'), { y: 18, opacity: 0, duration: 0.8 }, '-=0.6')
        .from(q('[data-hero="cta"] > *'), { y: 18, opacity: 0, duration: 0.7, stagger: 0.1 }, '-=0.5')
        .from(q('[data-hero="person"]'), { x: 80, opacity: 0, duration: 1.2 }, 0.35)

      const scrub = { trigger: root, start: 'top top', end: 'bottom top', scrub: true }
      gsap.to(sceneRef.current, { yPercent: 12, scale: 1.06, ease: 'none', scrollTrigger: scrub })
      gsap.to(contentRef.current, { yPercent: -8, ease: 'none', scrollTrigger: scrub })
    })

    return () => mm.revert()
  }, [])

  return (
    <section
      ref={ref}
      onPointerMove={onMove}
      className="relative isolate flex min-h-[100svh] w-full flex-col overflow-hidden bg-[#07100d] text-[#fbf4e6]"
    >
      <style>{`
        @keyframes vh-ken     { from { transform: scale(1.02); } to { transform: scale(1.1); } }
        @keyframes vh-sun     { 0%,100% { opacity: 0.85; } 50% { opacity: 1; } }
        @keyframes vh-cloud   { from { transform: translateX(-2%); } to { transform: translateX(3%); } }
        @keyframes vh-shimmer { 0%,100% { opacity: 0.25; transform: scaleX(0.85); } 50% { opacity: 0.8; transform: scaleX(1.05); } }
        @keyframes vh-wheel   { 0% { transform: translateY(0); opacity: 1; } 100% { transform: translateY(10px); opacity: 0; } }

        .vh-ken     { animation: vh-ken 30s ease-in-out infinite alternate; }
        .vh-sun     { animation: vh-sun 7s ease-in-out infinite; }
        .vh-cloud   { animation: vh-cloud 24s ease-in-out infinite alternate; }
        .vh-shimmer { transform-box: fill-box; transform-origin: center; animation: vh-shimmer 3.4s ease-in-out infinite; }
        .vh-wheel   { animation: vh-wheel 1.8s ease-in-out infinite; }

        @media (prefers-reduced-motion: reduce) {
          .vh-ken, .vh-sun, .vh-cloud, .vh-shimmer, .vh-wheel { animation: none; }
        }
      `}</style>

      {/* ===== Scene ===== */}
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <div ref={sceneRef} className="absolute inset-0 will-change-transform">
          <div className="vh-ken absolute inset-0">
            {HERO_IMAGE ? (
              <Layer px={px} py={py} depth={14}>
                <img src={HERO_IMAGE} alt="" className="h-full w-full object-cover object-center" />
              </Layer>
            ) : (
              <>
                <Layer px={px} py={py} depth={8}>
                  <SceneSky />
                </Layer>
                <Layer px={px} py={py} depth={18}>
                  <SceneFar />
                </Layer>
                <Layer px={px} py={py} depth={32}>
                  <SceneMid />
                </Layer>
                <Layer px={px} py={py} depth={52}>
                  <SceneFront />
                </Layer>
              </>
            )}
          </div>
        </div>

        {/* Dark overlays preserve contrast across the image on all screen sizes. */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#07100d]/65 via-[#07100d]/35 to-[#07100d]/75" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#07100d]/85 via-[#07100d]/45 to-[#07100d]/10" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_45%,transparent_15%,rgba(7,16,13,0.45)_100%)]" />
        <div className="absolute bottom-0 right-[4%] h-[70%] w-[42%] rounded-full bg-[#e3a64a]/15 blur-3xl" />
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#07100d]/70 to-transparent" />
      </div>

      {/* ===== Foreground PNG ===== */}
      <motion.div
        aria-hidden="true"
        style={reduced ? undefined : { x: personX, y: personY }}
        className="pointer-events-none absolute bottom-0 right-[-5%] z-0 w-[85%] sm:right-0 sm:w-[70%] lg:w-[58%]"
      >
        <img
          data-hero="person"
          src={heroPerson}
          alt=""
          className="h-auto max-h-[88svh] w-full object-contain object-bottom mix-blend-screen opacity-90"
        />
      </motion.div>

      {/* ===== Content ===== */}
      <div
        ref={contentRef}
        className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center px-5 py-28 sm:px-8 sm:py-32 lg:px-12 lg:py-16"
      >
        <div className="max-w-xl">
          <h1 className="mt-6 font-display text-[clamp(2.25rem,min(8.5vh,6vw),5rem)] font-extrabold leading-[0.98] tracking-tight">
            <span className="block overflow-hidden pb-2">
              <span data-hero="line" className="inline-block">Vacation packages</span>
            </span>
            <span className="block overflow-hidden pb-2">
              <span
                data-hero="line"
                className="inline-block bg-gradient-to-r from-[#f1c27d] via-[#e3a64a] to-[#ffe7b0] bg-clip-text text-transparent"
              >
                and membership
              </span>
            </span>
            <span className="block overflow-hidden pb-2">
              <span
                data-hero="line"
                className="inline-block bg-gradient-to-r from-[#e3a64a] to-[#ffe7b0] bg-clip-text text-transparent"
              >
                plans.
              </span>
            </span>
          </h1>

          <p data-hero="sub" className="mt-6 max-w-lg text-base leading-7 text-[#fbf4e6]/85 sm:text-lg">
            Discover CHIS membership options and holiday experiences designed around you.
          </p>

          <div data-hero="cta" className="mt-9 flex flex-wrap gap-3">
            <motion.button
              type="button"
              onClick={() => scrollToId(PRICING_ID)}
              whileHover={reduced ? undefined : { scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-[#fbf4e6] px-7 py-3.5 text-sm font-semibold text-[#0f2a1d] shadow-lg shadow-black/30 transition-colors duration-300 hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#e3a64a] focus-visible:ring-offset-2 focus-visible:ring-offset-[#07100d]"
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full"
              />
              <span className="relative">Explore Membership Plans</span>
              <ArrowDown className="relative h-4 w-4 transition-transform duration-300 group-hover:translate-y-0.5" />
            </motion.button>
            <motion.button
              type="button"
              onClick={() => openEnquiry()}
              whileHover={reduced ? undefined : { scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="rounded-full border border-white/50 bg-black/20 px-7 py-3.5 text-sm font-medium text-white backdrop-blur-md transition-colors duration-300 hover:border-[#e3a64a] hover:bg-black/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#e3a64a] focus-visible:ring-offset-2 focus-visible:ring-offset-[#07100d]"
            >
              Enquire Now
            </motion.button>
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <div
        aria-hidden="true"
        className="absolute bottom-6 left-1/2 z-20 hidden -translate-x-1/2 sm:block"
      >
        <span className="flex h-9 w-6 justify-center rounded-full border border-white/60 pt-1.5">
          <span className="vh-wheel h-1.5 w-1 rounded-full bg-white" />
        </span>
      </div>
    </section>
  )
}