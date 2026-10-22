import { useEffect, useRef, useState } from 'react'
import {
  animate,
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion'
import { Compass, Award, ShieldCheck, HeartHandshake, ArrowUpRight, Star } from 'lucide-react'
import { Link } from 'react-router-dom'

const EASE = [0.16, 1, 0.3, 1]
const HEADING_FONT = { fontFamily: "'Outfit', sans-serif" }

const STATEMENT =
  'We pair high-altitude expeditions with five-star stays, so the hard days always end somewhere worth arriving.'

const STATS = [
  { to: 120, suffix: '+', label: 'Mountain, lake and coastal trails' },
  { to: 4.98, decimals: 2, label: 'Average guest rating' },
  { to: 12000, suffix: '+', label: 'Guest reviews' },
  { to: 24, suffix: '/7', label: 'Emergency response' },
]

const FEATURES = [
  {
    icon: Compass,
    title: 'Curated expeditions',
    desc: '120+ mountain, lake and coastal trails.',
  },
  {
    icon: Award,
    title: 'Signature InnSuites',
    desc: 'Handpicked lodges, chalets and retreats.',
  },
  {
    icon: ShieldCheck,
    title: 'Certified guides',
    desc: 'Licensed leads and 24/7 emergency response.',
  },
  {
    icon: HeartHandshake,
    title: 'Bespoke concierge',
    desc: 'Itineraries built around your pace.',
  },
]

const IMAGES = {
  left: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=900&q=80',
  middle:
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1000&q=80',
  right:
    'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=900&q=80',
}

/* ------------------------------------------------------------------
   Statement: each word brightens as you scroll through it.
   Words are always readable (never fully hidden).
------------------------------------------------------------------- */
function Word({ children, progress, range, reduce }) {
  const opacity = useTransform(progress, range, [0.16, 1])
  return (
    <motion.span
      aria-hidden="true"
      style={{ opacity: reduce ? 1 : opacity }}
      className="mr-[0.24em] inline-block"
    >
      {children}
    </motion.span>
  )
}

function Statement({ text }) {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.45'] })
  const words = text.split(' ')

  return (
    <h2
      ref={ref}
      aria-label={text}
      className="max-w-[1100px] text-[clamp(2rem,5.2vw,4.9rem)] font-semibold leading-[1.04] tracking-[-0.035em] text-slate-950"
      style={HEADING_FONT}
    >
      {words.map((w, i) => (
        <Word
          key={i}
          progress={scrollYProgress}
          range={[i / words.length, (i + 1) / words.length]}
          reduce={reduce}
        >
          {w}
        </Word>
      ))}
    </h2>
  )
}

/* ------------------------------------------------------------------
   Count-up number
------------------------------------------------------------------- */
function CountUp({ to, decimals = 0, suffix = '' }) {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const inView = useInView(ref, { once: true, margin: '-10%' })
  const [value, setValue] = useState(reduce ? to : 0)

  useEffect(() => {
    if (!inView || reduce) return undefined
    const controls = animate(0, to, {
      duration: 1.8,
      ease: EASE,
      onUpdate: (v) => setValue(v),
    })
    return () => controls.stop()
  }, [inView, to, reduce])

  return (
    <span ref={ref}>
      {value.toLocaleString('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
      {suffix}
    </span>
  )
}

/* ------------------------------------------------------------------
   Parallax tile: tile drifts one way, photo drifts the other
------------------------------------------------------------------- */
function Tile({ src, alt = '', lift = 28, className = '', children }) {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const tileY = useTransform(scrollYProgress, [0, 1], [lift, -lift])
  const imgY = useTransform(scrollYProgress, [0, 1], ['-8%', '8%'])

  return (
    <motion.div
      ref={ref}
      style={{ y: reduce ? 0 : tileY }}
      className={`relative overflow-hidden rounded-[28px] bg-slate-200 ${className}`}
    >
      <motion.img
        src={src}
        alt={alt}
        loading="lazy"
        style={{ y: reduce ? 0 : imgY }}
        className="absolute inset-0 h-full w-full scale-[1.2] object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
      {children}
    </motion.div>
  )
}

/* Hairline that draws itself from the left */
function DrawLine({ delay = 0 }) {
  const reduce = useReducedMotion()
  return (
    <motion.span
      aria-hidden
      initial={reduce ? false : { scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true, margin: '-5%' }}
      transition={{ duration: 1.1, delay, ease: EASE }}
      className="absolute inset-x-0 top-0 h-px origin-left bg-slate-950/25"
    />
  )
}

/* ------------------------------------------------------------------
   SECTION
------------------------------------------------------------------- */
export default function AboutSection({ onOpenEstimate }) {
  const handleBookClick = () => {
    const detail = {
      destination: 'Custom Expedition Itinerary',
      days: '5 Nights 6 Days',
      persons: '2 Persons',
    }
    if (onOpenEstimate) onOpenEstimate(detail)
    else window.dispatchEvent(new CustomEvent('open-booking-modal', { detail }))
  }

  return (
    <section
      id="about"
      className="relative w-full overflow-hidden bg-[#f7f7f5] py-20 text-slate-950 sm:py-24 lg:py-28"
    >
      <div className="mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-12">
        {/* Label row */}
        <div className="flex items-center justify-between border-t border-slate-950 pt-3 text-sm">
          <span className="flex items-center gap-2 font-medium">
            <span className="h-2 w-2 animate-pulse rounded-full bg-[#ff5938] ring-1 ring-slate-950" />
            About Country Holidays InnSuites
          </span>
          <span className="hidden text-slate-500 sm:block">Expeditions &amp; stays</span>
        </div>

        {/* Statement */}
        <div className="mt-10 lg:mt-14">
          <Statement text={STATEMENT} />
        </div>

        {/* Story + stats (left) and photo trio (right) */}
        <div className="mt-16 grid grid-cols-1 gap-14 lg:mt-24 lg:grid-cols-12 lg:gap-16">
          <div className="flex flex-col gap-10 lg:col-span-5">
            <p className="max-w-md text-sm leading-relaxed text-slate-600 sm:text-base">
              Founded by hospitality people and high-altitude adventurers, we plan every journey
              around safety, privacy and the kind of memories that last, from the Tatra Mountains
              to Hallstatt and private Mediterranean villas.
            </p>

            <div className="flex flex-wrap items-center gap-6">
              <button
                type="button"
                onClick={handleBookClick}
                className="group flex items-center gap-3 rounded-full bg-slate-950 py-1.5 pl-6 pr-1.5 text-sm font-semibold text-[#ff5938] shadow-lg shadow-black/10 transition-transform duration-300 hover:scale-[1.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 focus-visible:ring-offset-[#f7f7f5] active:scale-95"
              >
                Plan your journey
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#ff5938] text-slate-950 transition-transform duration-300 group-hover:rotate-45">
                  <ArrowUpRight className="h-4 w-4 stroke-[2.5]" />
                </span>
              </button>

              <Link
                to="/destinations"
                className="group relative py-1 text-sm font-semibold text-slate-950 focus-visible:outline-none"
              >
                View destinations
                <span className="absolute inset-x-0 -bottom-0.5 h-[2px] origin-right bg-slate-950 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:origin-left group-hover:scale-x-0" />
                <span className="absolute inset-x-0 -bottom-0.5 h-[2px] origin-right scale-x-0 bg-[#ff5938] transition-transform delay-100 duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:origin-left group-hover:scale-x-100" />
              </Link>
            </div>

            {/* Stats */}
            <dl className="grid grid-cols-2 gap-x-6 gap-y-8">
              {STATS.map((s, i) => (
                <div key={s.label} className="relative pt-4">
                  <DrawLine delay={i * 0.08} />
                  <dt className="sr-only">{s.label}</dt>
                  <dd
                    className="text-[clamp(2.25rem,4vw,3.5rem)] font-semibold leading-none tracking-[-0.04em]"
                    style={HEADING_FONT}
                  >
                    <CountUp to={s.to} decimals={s.decimals} suffix={s.suffix} />
                  </dd>
                  <p className="mt-2 max-w-[11rem] text-sm leading-snug text-slate-600">
                    {s.label}
                  </p>
                </div>
              ))}
            </dl>
          </div>

          {/* Photo trio */}
          <div className="lg:col-span-7">
            <div className="grid h-[clamp(20rem,52vw,38rem)] grid-cols-[1fr_1.25fr_1fr] items-end gap-3 sm:gap-4">
              <Tile
                src={IMAGES.left}
                lift={34}
                className="h-[70%]"
              />
              <Tile
                src={IMAGES.middle}
                alt="Alpine expedition with Country Holidays InnSuites"
                lift={-26}
                className="h-full"
              >
                <div className="absolute inset-x-3 bottom-3 flex flex-col gap-3 text-white sm:inset-x-5 sm:bottom-5">
                  <p className="hidden max-w-[15rem] text-sm font-medium leading-snug sm:block">
                    Private alpine chalets and high-mountain lodges.
                  </p>
                  <span className="flex w-fit items-center gap-2 rounded-full bg-black/40 px-3 py-1.5 text-xs backdrop-blur-md">
                    <Star className="h-3.5 w-3.5 fill-[#ff5938] text-[#ff5938]" />
                    <span className="font-semibold">4.98</span>
                    <span className="hidden text-white/70 sm:inline">12,000+ reviews</span>
                  </span>
                </div>
              </Tile>
              <Tile
                src={IMAGES.right}
                lift={42}
                className="h-[52%]"
              />
            </div>
          </div>
        </div>

        {/* Feature strip */}
        <ul className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:mt-24 lg:grid-cols-4">
          {FEATURES.map((item, i) => {
            const Icon = item.icon
            return (
              <li
                key={item.title}
                className={`group relative overflow-hidden ${i > 0 ? 'lg:border-l lg:border-slate-950/15' : ''
                  } ${i % 2 === 1 ? 'sm:border-l sm:border-slate-950/15' : ''}`}
              >
                <DrawLine delay={i * 0.08} />
                {/* brand-accent sweep from the bottom */}
                <span
                  aria-hidden
                  className="absolute inset-0 translate-y-full bg-[#ff5938] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0 motion-reduce:transition-none"
                />
                <div className="relative flex items-start gap-4 px-5 py-7">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-950/20 text-slate-950 transition-all duration-300 group-hover:rotate-[-8deg] group-hover:border-slate-950 group-hover:bg-slate-950 group-hover:text-[#ff5938]">
                    <Icon className="h-4 w-4" />
                  </span>
                  <div className="min-w-0">
                    <h3
                      className="text-base font-semibold leading-tight tracking-[-0.01em] text-slate-950"
                      style={HEADING_FONT}
                    >
                      {item.title}
                    </h3>
                    <p className="mt-1 text-sm leading-snug text-slate-500 transition-colors duration-300 group-hover:text-slate-900">
                      {item.desc}
                    </p>
                  </div>
                </div>
              </li>
            )
          })}
          <li aria-hidden className="h-px bg-slate-950/25 sm:col-span-2 lg:col-span-4" />
        </ul>
      </div>
    </section>
  )
}