import { Fragment, useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion'
import { ArrowDown, ArrowUpRight } from 'lucide-react'
import { openEnquiry, PRICING_ID, scrollToId } from './content'
import heroPerson from '../../../assets/chis-hero-model.png'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

/* -------------------------------------------------------------------------- */
/*  Dark Editorial Luxury tokens                                              */
/*  ink #0b0706 · paper #f6efe9 · ember #ff5938 · rust #d9361b                */
/* -------------------------------------------------------------------------- */

const GRADIENT = 'linear-gradient(95deg, #f6efe9 0%, #ff5938 70%, #d9361b 100%)'
const HERO_IMAGE = '/hero-mountain.jpg'
const TITLE_LINES = ['Vacation', 'membership', 'plans.']
const LEAD =
  'Discover CHIS membership options and holiday packages designed around you, from the first weekend away to a lifetime of arrivals.'
const SCROLL_TEXT = 'SCROLL • DISCOVER • EXPLORE • '

/* ---------- gradient headline, letter by letter ---------- */
/* Each letter carries a slice of one continuous gradient so transforms never break bg-clip. */

function GradientLine({ text }) {
  const step = 0.56 // em per letter (approximate advance width)
  const total = text.length * step
  return (
    <span className="block overflow-hidden pb-[0.08em]" aria-hidden="true">
      {text.split('').map((ch, i) => (
        <span key={i} className="inline-block overflow-hidden align-bottom">
          <span
            data-letter
            className="inline-block bg-clip-text text-transparent will-change-transform"
            style={{
              backgroundImage: GRADIENT,
              backgroundSize: `${total}em 100%`,
              backgroundPosition: `${-i * step}em 0`,
              backgroundRepeat: 'no-repeat',
            }}
          >
            {ch}
          </span>
        </span>
      ))}
    </span>
  )
}

/* ---------- rotating circular scroller badge ---------- */

function ScrollerBadge({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Scroll to membership plans"
      className="group relative grid h-[clamp(5.5rem,14svh,8rem)] w-[clamp(5.5rem,14svh,8rem)] place-items-center rounded-full border border-[#f6efe9]/15 transition-colors duration-500 hover:border-[#ff5938]/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ff5938] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0706]"
    >
      <svg viewBox="0 0 120 120" className="ed-spin absolute inset-0 h-full w-full" aria-hidden="true">
        <defs>
          <path id="ed-circle" d="M60,60 m-44,0 a44,44 0 1,1 88,0 a44,44 0 1,1 -88,0" />
        </defs>
        <text fill="#f6efe9" fillOpacity="0.6" fontSize="9.5" letterSpacing="2.6" className="font-sans">
          <textPath href="#ed-circle">{SCROLL_TEXT}</textPath>
        </text>
      </svg>
      <ArrowDown className="h-5 w-5 text-[#ff5938] transition-transform duration-300 group-hover:translate-y-1" />
    </button>
  )
}

/* ---------- main component ---------- */

export default function VacationHeroSection() {
  const ref = useRef(null)
  const bgRef = useRef(null)
  const contentRef = useRef(null)
  const reduced = !!useReducedMotion()

  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const px = useSpring(mx, { stiffness: 70, damping: 18, mass: 0.6 })
  const py = useSpring(my, { stiffness: 70, damping: 18, mass: 0.6 })
  const personX = useTransform(px, [-0.5, 0.5], [-16, 16])
  const personY = useTransform(py, [-0.5, 0.5], [-8, 8])

  const onMove = (e) => {
    if (reduced) return
    const r = ref.current.getBoundingClientRect()
    mx.set((e.clientX - r.left) / r.width - 0.5)
    my.set((e.clientY - r.top) / r.height - 0.5)
  }

  useEffect(() => {
    const root = ref.current
    if (!root) return undefined

    const mm = gsap.matchMedia()
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const q = (s) => root.querySelectorAll(s)

      // Letter-by-letter masked entrance
      gsap
        .timeline({ defaults: { ease: 'expo.out' }, delay: 0.1 })
        .from(q('[data-letter]'), { yPercent: 110, duration: 1.3, stagger: 0.025 })
        .from(q('[data-hero="fade"]'), { y: 16, opacity: 0, duration: 0.9, stagger: 0.1 }, '-=0.8')
        .from(q('[data-hero="person"]'), { x: 80, opacity: 0, duration: 1.4 }, 0.3)

      // Lead paragraph brightens word by word, scrubbed
      gsap.fromTo(
        q('[data-word]'),
        { opacity: 0.14 },
        {
          opacity: 1,
          ease: 'none',
          stagger: 0.1,
          scrollTrigger: { trigger: q('[data-lead]')[0], start: 'top 85%', end: 'bottom 35%', scrub: true },
        },
      )

      // Gentle scroll parallax
      const scrub = { trigger: root, start: 'top top', end: 'bottom top', scrub: true }
      gsap.to(bgRef.current, { yPercent: 10, scale: 1.06, ease: 'none', scrollTrigger: scrub })
      gsap.to(contentRef.current, { yPercent: -6, ease: 'none', scrollTrigger: scrub })
    })

    // Reduced motion: show everything in its final state
    mm.add('(prefers-reduced-motion: reduce)', () => {
      gsap.set(root.querySelectorAll('[data-word]'), { opacity: 1 })
    })

    return () => mm.revert()
  }, [])

  return (
    <section
      ref={ref}
      onPointerMove={onMove}
      aria-labelledby="hero-title"
      className="relative isolate flex h-[100svh] min-h-[540px] w-full flex-col overflow-hidden bg-[#0b0706] text-[#f6efe9]"
    >
      <style>{`
        @keyframes ed-drift-a { 0%,100% { transform: translate3d(0,0,0) scale(1); } 50% { transform: translate3d(6%,8%,0) scale(1.12); } }
        @keyframes ed-drift-b { 0%,100% { transform: translate3d(0,0,0) scale(1); } 50% { transform: translate3d(-8%,-6%,0) scale(1.15); } }
        @keyframes ed-spin    { to { transform: rotate(360deg); } }
        .ed-drift-a { animation: ed-drift-a 18s ease-in-out infinite; }
        .ed-drift-b { animation: ed-drift-b 22s ease-in-out infinite; }
        .ed-spin    { animation: ed-spin 18s linear infinite; }
        @media (prefers-reduced-motion: reduce) { .ed-drift-a, .ed-drift-b, .ed-spin { animation: none; } }
      `}</style>

      {/* ===== Atmosphere ===== */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div ref={bgRef} className="absolute inset-0 will-change-transform">
          {HERO_IMAGE && (
            <img
              src={HERO_IMAGE}
              alt=""
              className="h-full w-full object-cover object-center opacity-30 mix-blend-luminosity"
            />
          )}
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#0b0706]/70 via-[#0b0706]/80 to-[#0b0706]" />
        <div className="ed-drift-a absolute -left-[15%] -top-[20%] h-[55vw] w-[55vw] rounded-full bg-[#ff5938]/25 blur-3xl" />
        <div className="ed-drift-b absolute -bottom-[25%] -right-[10%] h-[50vw] w-[50vw] rounded-full bg-[#d9361b]/25 blur-3xl" />
        <svg className="absolute inset-0 h-full w-full opacity-[0.07] mix-blend-overlay" xmlns="http://www.w3.org/2000/svg">
          <filter id="ed-grain">
            <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#ed-grain)" />
        </svg>
      </div>

      {/* ===== Foreground person ===== */}
      <motion.div
        aria-hidden="true"
        style={reduced ? undefined : { x: personX, y: personY }}
        className="pointer-events-none absolute bottom-0 right-[-8%] z-0 w-[80%] sm:right-0 sm:w-[60%] lg:w-[46%]"
      >
        <img
          data-hero="person"
          src={heroPerson}
          alt=""
          className="h-auto max-h-[84svh] w-full object-contain object-bottom mix-blend-screen opacity-80"
        />
      </motion.div>

      {/* ===== Content ===== */}
      <div
        ref={contentRef}
        className="relative z-10 mx-auto flex min-h-0 w-full max-w-[90rem] flex-1 flex-col justify-center px-5 pb-[6svh] pt-[10svh] sm:px-8 lg:px-12"
      >
        <h1
          id="hero-title"
          className="font-nunito font-light leading-[0.9] tracking-[-0.05em] text-[clamp(2.75rem,min(12vw,15.5svh),12rem)]"
        >
          <span className="sr-only">Vacation packages and membership plans.</span>
          {TITLE_LINES.map((line) => (
            <Fragment key={line}>
              <GradientLine text={line} />{' '}
            </Fragment>
          ))}
        </h1>

        <div className="mt-[4svh] grid items-end gap-[3svh] lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-6">
            <div data-hero="fade" className="mb-[2.5svh] h-px w-24 bg-[#f6efe9]/15" />
            <p
              data-lead
              className="max-w-xl font-sans text-[clamp(1rem,2.8svh,1.5rem)] font-light leading-snug tracking-[-0.03em] text-[#f6efe9]"
            >
              {LEAD.split(' ').map((w, i) => (
                <span key={i} data-word className="inline-block pr-[0.28em]" style={{ opacity: reduced ? 1 : undefined }}>
                  {w}
                </span>
              ))}
            </p>

            <div data-hero="fade" className="mt-[4svh] flex flex-wrap items-center gap-3">
              {/* Primary pill */}
              <motion.button
                type="button"
                onClick={() => scrollToId(PRICING_ID)}
                whileTap={{ scale: 0.97 }}
                className="group inline-flex items-center gap-3 rounded-full bg-[#ff5938] py-2 pl-7 pr-2 text-sm font-medium text-[#0b0706] transition-shadow duration-300 hover:shadow-[0_0_40px_-6px_#ff5938] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#f6efe9] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0706]"
              >
                Explore membership plans
                <span className="grid h-10 w-10 place-items-center rounded-full bg-[#0b0706] text-[#ff5938] transition-transform duration-500 group-hover:rotate-[360deg]">
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </motion.button>

              {/* Secondary pill */}
              <motion.button
                type="button"
                onClick={() => openEnquiry()}
                whileTap={{ scale: 0.97 }}
                className="rounded-full border border-[#f6efe9]/25 px-7 py-3.5 text-sm font-medium text-[#f6efe9] transition-all duration-300 hover:border-[#ff5938] hover:shadow-[0_0_28px_-6px_#ff5938] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ff5938] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0706]"
              >
                Enquire now
              </motion.button>
            </div>
          </div>

          <div data-hero="fade" className="hidden sm:flex lg:col-span-6 lg:justify-end">
            <ScrollerBadge onClick={() => scrollToId(PRICING_ID)} />
          </div>
        </div>
      </div>

      <div className="relative z-10 h-px w-full bg-[#f6efe9]/15" aria-hidden="true" />
    </section>
  )
}