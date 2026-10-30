import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { animate, motion, useInView, useReducedMotion } from 'framer-motion'
import {
  ArrowRight,
  ArrowUpRight,
  Award,
  Calendar,
  CheckCircle2,
  Clock,
  Globe2,
  HeartHandshake,
  MapPin,
  PhoneCall,
  ShieldCheck,
  Users,
} from 'lucide-react'
import PageTransition from '../components/layout/PageTransition'
import { brand } from '../data/brand'
import heroModel from '../assets/images/chis-hero-model.png'
import employeesImg from '../assets/images/Employees.avif'
import propertiesImg from '../assets/images/Collaborative properties.jpg'
import associatesImg from '../assets/images/Travel associates.jpg'
import establishedImg from '../assets/images/Established.jpg'
import about01Img from '../assets/about-01.avif'
import about03Img from '../assets/about-03.avif'
import travelDoodlesGreen from '../assets/travel-doodles-green.png'
import travelMapDoodlesGreen from '../assets/travel-map-doodles-green.png'
import awards3D from '../assets/3d/awards.jpg'
import perWorkers3D from '../assets/3d/per-workers.jpg'
import upright3D from '../assets/3d/upright.jpg'
import handshake3D from '../assets/3d/handshake.avif'

/* CHIS palette: green #096c27 · deep #06501b · leaf #b3d565 · ink #0b1f12 · mist #f3f8e6 */

const STATEMENT =
  'Since December 21st, 2016, Country Holidays Inn and Suites has worked toward one goal: budget travel packages for customers worldwide, with mesmerizing options and customized economical benefits under one roof.'

const OBJECTIVE =
  'CHIS was established to provide hassle-free luxury travel experiences that everyone can afford with ease.'

const TIMELINE = [
  {
    id: '2016',
    step: '01',
    year: '2016',
    dateLabel: '21st December 2016',
    phase: 'Phase 01 • The Inception',
    tag: 'Foundation',
    title: 'It began with one simple goal',
    body: 'Country Holidays Inn and Suites was established on 21st December 2016 to provide budget travel packages to customers worldwide. We started with only 20 employees onboard.',
    image: about01Img,
    stat: '20 Founding Members',
    highlights: [
      'Established in Delhi NCR on 21st Dec 2016',
      'Started with 20 passionate team members',
      'Pioneered transparent budget luxury travel packages',
    ],
    icon: Calendar,
  },
  {
    id: 'people',
    step: '02',
    year: 'Our People',
    dateLabel: 'Culture & Backbone',
    phase: 'Phase 02 • Dedicated Family',
    tag: 'Living Culture',
    title: 'People are our backbone',
    body: 'We consider CHIS our own family. Our employees work with absolute dedication, united by the same passion, sincerity and mission, and we celebrate that togetherness year after year.',
    image: employeesImg,
    stat: 'Dedication & Unity',
    highlights: [
      'Employees treated as cherished family members',
      'United by passion, sincerity and shared mission',
      'Celebrated togetherness and mutual growth',
    ],
    icon: Users,
  },
  {
    id: 'today',
    step: '03',
    year: 'Today',
    dateLabel: 'Global Scale & Future',
    phase: 'Phase 03 • Global Network',
    tag: 'Worldwide Reach',
    title: 'A family of 500+, across the globe',
    body: 'CHIS now spans 250 travel associates and 3,500 tie-up collaborative properties, and remains a time-saving option for customers whose only passion is travel.',
    image: about03Img,
    stat: '3,500+ Properties & 250 Associates',
    highlights: [
      '3,500+ tie-up collaborative properties worldwide',
      '250 travel associates catering to member needs',
      '500+ CHIS family members delivering seamless journeys',
    ],
    icon: Globe2,
  },
]

const STATS = [
  { to: 500, suffix: '+', label: 'Employees' },
  { to: 3500, suffix: '+', label: 'Collaborative properties' },
  { to: 250, suffix: '', label: 'Travel associates' },
  { to: 2016, suffix: '', label: 'Established', plain: true },
]

const PANELS = [
  { label: 'Our value', title: 'We simplify the travel experience.', body: "Mesmerizing travel options with customized economical benefits, right under one roof. That's the promise behind everything we build.", image: associatesImg, theme: 'bg-[#b3d565] text-[#0b1f12] border border-[#a4c754]' },
  { label: 'Mission', title: 'Care and Convenience.', body: 'The true spirit behind all our services. We are driven by the zest to provide unmatched quality and unparalleled travel experiences, and to help customers create meaningful memories with us across their lifetime. Our mission is to build bonds of trust and reliability for everyone who dreams of travelling well.', image: employeesImg, theme: 'bg-[#fbfdfa] text-[#0b1f12] border border-[#096c27]/20 shadow-sm' },
  { label: 'Vision', title: 'Trust and reliability, across the globe.', body: 'With more than 3,500 destinations under our belt, we aim to expand our network of trust across the globe, stand tall with more domestic and international resorts, and set new benchmarks for leisure holidaying.', image: propertiesImg, theme: 'bg-[#096c27] text-white border border-[#06501b]' },
]

const UNIQUE = [
  {
    icon: Award,
    title: 'Award-winning',
    sub: 'Excellence recognized',
    body: 'Ranked among the best agencies in Delhi NCR, with Certificates of Excellence, Incorporation and Appreciation, and named a "Best Place to Work" multiple years running.',
    image: awards3D,
    meta: 'By CHIS Team • Since 2016',
  },
  {
    icon: Users,
    title: 'Passionate workers',
    sub: '500+ global associates',
    body: 'Our reputation rests on dedicated service and endurance. Our people are passionately engaged in driving every journey to its optimum.',
    image: perWorkers3D,
    meta: 'By CHIS Team • Dedicated Care',
  },
  {
    icon: ShieldCheck,
    title: 'Upright stance',
    sub: 'Integrity & resilience',
    body: 'Diverse vacations, member needs and premium experiences across 3,500+ collaborative properties, delivered with transparency and reliability.',
    image: upright3D,
    meta: 'By CHIS Team • Verified Stays',
  },
  {
    icon: HeartHandshake,
    title: 'Acquaintance',
    sub: 'Lifelong family bonds',
    body: 'We treat travellers as cherished family, not mere customers. Our sincere affection and lifelong care shape every journey.',
    image: handshake3D,
    meta: 'By CHIS Team • Family First',
  },
]

const MARQUEE = ['Budget travel packages', 'Care and convenience', '3,500+ collaborative properties', '250 travel associates', 'Since 2016']

const EASE = [0.22, 1, 0.36, 1]
const pad = (n) => String(n).padStart(2, '0')
const fmt = (v, plain) => (plain ? String(Math.round(v)) : Math.round(v).toLocaleString('en-US'))

/* ------------------------------ pieces ------------------------------ */

function Rise({ text, start = 0, reduced, className = '' }) {
  return (
    <span className={className}>
      {text.split(' ').map((w, i) => (
        <span key={i} className="mr-[0.22em] inline-block overflow-hidden pb-[0.12em] align-bottom last:mr-0">
          <motion.span
            initial={reduced ? false : { y: '112%' }}
            animate={{ y: 0 }}
            transition={{ duration: 0.9, ease: EASE, delay: start + i * 0.08 }}
            className="inline-block"
          >
            {w}
          </motion.span>
        </span>
      ))}
    </span>
  )
}

function Eyebrow({ children, dark = false }) {
  return (
    <span
      className={`font-varela inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] ${dark ? 'border-white/20 bg-white/10 text-white/90 backdrop-blur-md' : 'border-[#096c27]/15 bg-white text-[#096c27]'
        }`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-[#b3d565] shadow-[0_0_8px_#b3d565]" />
      {children}
    </span>
  )
}

function SectionHead({ eyebrow, title, accent, copy, dark = false, right }) {
  return (
    <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl">
        <Eyebrow dark={dark}>{eyebrow}</Eyebrow>
        <h2
          className={`m-0 mt-4 font-rader text-[clamp(26px,3.6vw,44px)] font-bold leading-[1.08] tracking-tight ${dark ? 'text-white' : 'text-[#0b1f12]'
            }`}
        >
          {title} <span className={`font-bold ${dark ? 'text-[#b3d565]' : 'text-[#096c27]'}`}>{accent}</span>
        </h2>
        {copy && (
          <p className={`mb-0 mt-3 max-w-xl font-varela text-[15px] leading-relaxed ${dark ? 'text-white/75' : 'text-[#0b1f12]/75'}`}>{copy}</p>
        )}
      </div>
      {right}
    </div>
  )
}

function Fade({ children, delay = 0, reduced, className = '' }) {
  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.8, ease: EASE, delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

function Pill({ children, to, onClick, tone = 'leaf' }) {
  const tones = {
    leaf: ['bg-[#b3d565] text-[#0b1f12] hover:bg-white', 'bg-[#096c27] text-white'],
    ink: ['bg-[#0b1f12] text-white hover:bg-[#096c27]', 'bg-[#b3d565] text-[#0b1f12]'],
  }[tone]
  const cls = `group inline-flex items-center gap-3 rounded-full py-1.5 pl-5 pr-1.5 text-[13px] font-varela font-bold transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-white ${tones[0]}`
  const icon = (
    <span className={`grid h-8 w-8 place-items-center rounded-full ${tones[1]}`}>
      <ArrowUpRight className="h-4 w-4 transition-transform duration-500 group-hover:rotate-45" aria-hidden="true" />
    </span>
  )
  return to ? (
    <Link to={to} className={cls}>{children}{icon}</Link>
  ) : (
    <button type="button" onClick={onClick} className={cls}>{children}{icon}</button>
  )
}

function CountUp({ to, plain, reduced }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -10% 0px' })
  const [val, setVal] = useState(to)

  useEffect(() => {
    if (!inView || reduced) return undefined
    const c = animate(plain ? 1990 : 0, to, { duration: 2.2, ease: [0.16, 1, 0.3, 1], onUpdate: setVal })
    return () => c.stop()
  }, [inView, to, plain, reduced])

  return <span ref={ref}>{fmt(val, plain)}</span>
}

function Marquee({ items, className = '' }) {
  return (
    <div className={`overflow-hidden whitespace-nowrap font-varela ${className}`} aria-hidden="true">
      <div className="flex w-max animate-[ab-marq_36s_linear_infinite] motion-reduce:animate-none">
        {[0, 1].map((k) => (
          <div key={k} className="flex shrink-0 items-center">
            {items.map((t, i) => (
              <span key={`${k}-${i}`} className="flex items-center">
                <span className="px-6">{t}</span>
                <span className="h-1.5 w-1.5 rounded-full bg-[#b3d565]" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

function ModernTimeline({ reduced }) {
  return (
    <div className="relative mt-16 sm:mt-20">
      {/* Timeline Section Subheader */}
      <div className="mb-14 sm:mb-20 text-center max-w-2xl mx-auto">
        <span className="font-varela inline-flex items-center gap-2 rounded-full border border-[#096c27]/20 bg-[#f3f8e6] px-3.5 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-[#096c27]">
          <Clock className="h-3.5 w-3.5 text-[#096c27]" />
          Our Chronological Journey
        </span>
        <h3 className="m-0 mt-3 font-rader text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#0b1f12]">
          Milestones of our <span className="text-[#096c27]">growth.</span>
        </h3>
        <p className="mb-0 mt-3 font-varela text-sm sm:text-base text-[#0b1f12]/75 leading-relaxed">
          From a humble team of 20 in 2016 to an international travel family spanning over 3,500 collaborative properties.
        </p>
      </div>

      {/* Modern Alternating Central-Spine Timeline */}
      <div className="relative">
        {/* Central Spine Line (Desktop) */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-4 bottom-12 hidden w-1 -translate-x-1/2 rounded-full bg-gradient-to-b from-[#096c27] via-[#096c27] to-[#b3d565] md:block"
        />

        {/* Left Spine Line (Mobile) */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-5 sm:left-6 top-4 bottom-12 block w-1 -translate-x-1/2 rounded-full bg-gradient-to-b from-[#096c27] via-[#096c27] to-[#b3d565] md:hidden"
        />

        {/* Milestone Steps */}
        <div className="space-y-16 sm:space-y-24">
          {TIMELINE.map((t, idx) => {
            const Icon = t.icon
            const isEven = idx % 2 === 0
            return (
              <motion.div
                key={t.id}
                initial={reduced ? false : { opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.8, ease: EASE, delay: 0.05 }}
                className="relative"
              >
                {/* Central Spine Node (Desktop) */}
                <div className="absolute left-1/2 top-6 hidden -translate-x-1/2 -translate-y-1/2 z-20 md:flex flex-col items-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border-4 border-white bg-[#096c27] text-white shadow-[0_4px_18px_rgba(9,108,39,0.35)] transition-transform duration-300 hover:scale-110">
                    <Icon className="h-5 w-5 text-[#b3d565]" />
                  </div>
                  <span className="mt-1.5 rounded-full bg-white px-2.5 py-0.5 text-[10.5px] font-varela font-bold uppercase tracking-wider text-[#096c27] shadow-sm border border-[#096c27]/20 whitespace-nowrap">
                    {t.year}
                  </span>
                </div>

                {/* Left Spine Node (Mobile) */}
                <div className="absolute left-5 sm:left-6 top-6 z-20 flex md:hidden -translate-x-1/2 -translate-y-1/2 items-center justify-center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-[#096c27] text-white shadow-[0_4px_14px_rgba(9,108,39,0.35)]">
                    <Icon className="h-4 w-4 text-[#b3d565]" />
                  </div>
                </div>

                {/* Milestone Row */}
                <div className="grid gap-6 md:grid-cols-2 md:gap-16 lg:gap-24 pl-12 sm:pl-16 md:pl-0 items-center">
                  {/* Content Column */}
                  <div className={`${isEven ? 'md:text-right' : 'md:order-2 md:text-left'}`}>
                    <div className="font-varela inline-flex items-center gap-2 rounded-full border border-[#096c27]/20 bg-[#f3f8e6] px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[#096c27]">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#096c27]" />
                      {t.phase}
                    </div>

                    <h4 className="m-0 mt-3 font-rader text-xl sm:text-2xl lg:text-[26px] font-bold leading-snug text-[#0b1f12]">
                      {t.title}
                    </h4>

                    <p className="mb-0 mt-3 font-varela text-sm sm:text-[15px] leading-relaxed text-[#0b1f12]/75">
                      {t.body}
                    </p>

                    {/* Milestone Highlights */}
                    <div className={`mt-5 space-y-2 border-t border-[#096c27]/15 pt-4 ${isEven ? 'md:flex md:flex-col md:items-end' : ''}`}>
                      {t.highlights.map((h, hIdx) => (
                        <div
                          key={hIdx}
                          className={`font-varela flex items-start gap-2.5 text-xs sm:text-[13px] text-[#0b1f12]/85 ${
                            isEven ? 'md:flex-row-reverse' : ''
                          }`}
                        >
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#096c27]" />
                          <span>{h}</span>
                        </div>
                      ))}
                    </div>

                    <div className={`mt-4 ${isEven ? 'md:flex md:justify-end' : ''}`}>
                      <span className="font-varela inline-block rounded-lg bg-black/5 px-3 py-1 text-xs font-semibold text-[#096c27]">
                        {t.dateLabel} • {t.stat}
                      </span>
                    </div>
                  </div>

                  {/* Photo Showcase Column */}
                  <div className={`${isEven ? 'md:order-2' : 'md:order-1'}`}>
                    <div className="group relative overflow-hidden rounded-2xl sm:rounded-3xl border border-[#096c27]/15 bg-white p-2 sm:p-2.5 shadow-[0_12px_32px_-8px_rgba(9,108,39,0.12)] transition-all duration-500 hover:border-[#096c27]/40 hover:shadow-[0_20px_40px_-10px_rgba(9,108,39,0.2)]">
                      <div className="relative h-52 sm:h-64 lg:h-72 w-full overflow-hidden rounded-xl sm:rounded-2xl">
                        <img
                          src={t.image}
                          alt={t.title}
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        />
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />

                        {/* Era Badge on Image */}
                        <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-[#096c27]/90 px-3 py-1 font-varela text-[11px] font-bold uppercase tracking-wider text-white shadow-md backdrop-blur-md">
                          <span className="h-1.5 w-1.5 rounded-full bg-[#b3d565]" />
                          {t.year}
                        </div>

                        {/* Step Counter on Image */}
                        <div className="absolute right-3 top-3 rounded-full bg-white/95 px-2.5 py-0.5 font-varela text-xs font-black text-[#096c27] shadow-sm backdrop-blur-md">
                          {t.step}
                        </div>

                        {/* Floating Stat Chip */}
                        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between font-varela text-xs font-semibold text-white drop-shadow">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-[#b3d565]">{t.tag}</span>
                          <span className="rounded-full bg-black/40 px-3 py-1 text-[11px] font-medium text-white/95 backdrop-blur-md border border-white/20">
                            {t.stat}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Timeline Bottom Anchor */}
        <div className="mt-14 sm:mt-18 flex justify-center">
          <div className="relative z-10 inline-flex items-center gap-2.5 rounded-full border border-[#096c27]/25 bg-white px-5 py-2 font-varela text-xs font-semibold text-[#096c27] shadow-sm">
            <span className="h-2 w-2 rounded-full bg-[#096c27] animate-pulse" />
            <span>The Journey Continues • Expanding Worldwide</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </div>
        </div>
      </div>
    </div>
  )
}

/* ------------------------------ page ------------------------------ */

export default function AboutPage() {
  const reduced = !!useReducedMotion()
  const navigate = useNavigate()

  const handleOpenBooking = (destination = 'General Inquiry') =>
    navigate(`/contact?subject=${encodeURIComponent(destination)}`)

  return (
    <PageTransition>
      <div className="page-about relative w-full overflow-x-clip bg-white text-[#0b1f12] antialiased selection:bg-[#b3d565] selection:text-[#0b1f12]">
        {/* ============ HERO ============ */}
        <section id="top" aria-labelledby="about-title" className="relative isolate flex min-h-[100svh] w-full flex-col overflow-hidden bg-[#096c27] pt-20 text-white">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
            {/* Travel doodle sketch overlay matching green element */}
            <div
              className="absolute inset-0 bg-repeat opacity-[0.18] invert [filter:brightness(1.1)]"
              style={{
                backgroundImage: `url(${travelDoodlesGreen})`,
                backgroundSize: '560px auto',
              }}
            />
            <div className="absolute -right-[15%] -top-[25%] h-[60vw] w-[60vw] rounded-full bg-[#b3d565]/20 blur-3xl" />
            <div className="absolute right-[-12%] top-[8%] h-[52vw] w-[52vw]">
              <div className="absolute inset-0 rounded-full border border-white/15" />
              <div className="absolute inset-[12%] rounded-full border border-white/15" />
              <div className="absolute inset-[24%] rounded-full border border-white/15" />
            </div>
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,#06501b_0%,transparent_55%)]" />
          </div>

          <div className="mx-auto grid w-full max-w-[1400px] flex-1 items-end gap-6 px-5 sm:px-8 lg:grid-cols-12 lg:px-12">
            <div className="pb-10 pt-8 lg:col-span-7 lg:pb-16">
              <motion.span
                initial={reduced ? false : { opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: EASE, delay: 0.1 }}
                className="font-varela inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-white/90 backdrop-blur-md"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-[#b3d565] shadow-[0_0_8px_#b3d565]" />
                About CHIS
              </motion.span>

              <h1 id="about-title" className="m-0 mt-5 font-rader font-bold text-[clamp(2.6rem,7vw,5.75rem)] leading-[0.95] tracking-tight">
                <Rise text="Travel," reduced={reduced} className="block" />
                <Rise text="simplified." start={0.15} reduced={reduced} className="block font-bold text-[#b3d565]" />
              </h1>

              <p className="mb-0 mt-5 max-w-md font-varela text-[15px] leading-relaxed text-white/80">
                A time-saving option for people whose only passion is travel: mesmerizing options and customized economical benefits, all under one roof.
              </p>

              <div className="mt-7 flex flex-wrap items-center gap-3">
                <Pill to="/vacation-packages">View vacation packages</Pill>
                <button
                  type="button"
                  onClick={() => handleOpenBooking('Membership Consultation')}
                  className="font-varela font-bold inline-flex items-center gap-2 rounded-full border border-white/30 px-5 py-2.5 text-[13px] transition-colors duration-300 hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  <PhoneCall className="h-4 w-4" aria-hidden="true" /> Talk to us
                </button>
              </div>
            </div>

            <div className="relative flex h-full items-end justify-center lg:col-span-5 lg:justify-end">
              <motion.div
                initial={reduced ? false : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, ease: EASE, delay: 0.9 }}
                className="absolute left-0 top-[16%] z-10 rounded-2xl border border-white/20 bg-white/10 px-3 py-2 sm:px-4 sm:py-3 backdrop-blur-md sm:left-4 scale-90 sm:scale-100 origin-left"
              >
                <p className="m-0 font-rader text-xl font-bold tracking-tight">3,500+</p>
                <p className="m-0 font-varela text-[11px] text-white/80">collaborative properties</p>
              </motion.div>
              <motion.div
                initial={reduced ? false : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, ease: EASE, delay: 1.05 }}
                className="absolute bottom-[22%] right-0 z-10 rounded-2xl bg-[#b3d565] px-3 py-2 sm:px-4 sm:py-3 text-[#0b1f12] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] scale-90 sm:scale-100 origin-right"
              >
                <p className="m-0 font-rader text-xl font-bold tracking-tight">500+</p>
                <p className="m-0 font-varela text-[11px]">people in the CHIS family</p>
              </motion.div>
              <motion.img
                initial={reduced ? false : { opacity: 0, y: 70, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 1.4, ease: EASE, delay: 0.25 }}
                src={heroModel}
                alt="CHIS holiday model"
                className="pointer-events-none block h-auto max-h-[48svh] w-auto max-w-full select-none object-contain object-bottom sm:max-h-[60svh] lg:max-h-[70svh]"
              />
            </div>
          </div>

          <Marquee items={MARQUEE} className="border-t border-white/20 bg-[#06501b] py-3.5 font-varela text-[13px] tracking-wide text-white/85" />
        </section>

        {/* ============ 1. STORY (WHITE BG SECTION) ============ */}
        <section id="story" aria-labelledby="story-title" className="relative isolate overflow-hidden bg-[#fbfdfa] px-5 py-16 sm:px-8 sm:py-20 lg:px-12">
          {/* Blurred travel map doodle background element directly on white section */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10 bg-repeat opacity-[0.15] [filter:blur(0.85px)_drop-shadow(0_4px_14px_rgba(41,127,51,0.22))] mix-blend-multiply"
            style={{
              backgroundImage: `url(${travelMapDoodlesGreen})`,
              backgroundSize: '400px auto',
            }}
          />
          <div className="mx-auto max-w-[1400px]">
            <div className="grid gap-8 lg:grid-cols-12 lg:gap-14">
              <div className="lg:col-span-5">
                <Eyebrow>Our story</Eyebrow>
                <h2 id="story-title" className="m-0 mt-4 font-rader text-[clamp(26px,3.6vw,44px)] font-bold leading-[1.08] tracking-tight text-[#0b1f12]">
                  Our story <span className="text-[#096c27]">line.</span>
                </h2>
              </div>
              <Fade reduced={reduced} className="lg:col-span-7">
                <p className="m-0 font-varela text-[clamp(1.1rem,1.9vw,1.4rem)] font-normal leading-[1.45] text-[#0b1f12]/85">
                  {STATEMENT}
                </p>
              </Fade>
            </div>

            {/* stats */}
            <dl className="m-0 mt-10 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
              {STATS.map((s, i) => (
                <Fade key={s.label} reduced={reduced} delay={i * 0.06}>
                  <div className="flex h-full flex-col-reverse justify-between gap-6 rounded-3xl border border-[#096c27]/25 bg-[#f3f8e6] p-5 shadow-sm transition-all duration-300 hover:border-[#096c27]/50 hover:shadow-md hover:-translate-y-0.5">
                    <dt className="font-varela text-[13px] font-medium text-[#0b1f12]/65">{s.label}</dt>
                    <dd className="m-0 font-rader text-[clamp(2rem,3.6vw,3rem)] font-bold leading-none tracking-tight text-[#096c27]">
                      <CountUp to={s.to} plain={s.plain} reduced={reduced} />
                      {s.suffix}
                    </dd>
                  </div>
                </Fade>
              ))}
            </dl>

            {/* Modern Interactive Timeline Track */}
            <ModernTimeline reduced={reduced} />
          </div>
        </section>

        {/* ============ 2. VALUE, MISSION & VISION ============ */}
        <section id="purpose" aria-labelledby="purpose-title" className="bg-white px-5 py-16 text-[#0b1f12] sm:px-8 sm:py-20 lg:px-12 border-y border-[#096c27]/10">
          <div className="mx-auto max-w-[1400px]">
            <SectionHead
              eyebrow="What drives us"
              title="Value, mission"
              accent="and vision."
              copy={OBJECTIVE}
              right={
                <div className="shrink-0">
                  <Pill tone="ink" onClick={() => handleOpenBooking('Membership Consultation')}>Talk to us</Pill>
                </div>
              }
            />
            <h2 id="purpose-title" className="sr-only">Value, mission and vision</h2>

            <div className="mt-10 grid gap-5 lg:grid-cols-3">
              {PANELS.map((p, i) => (
                <motion.article
                  key={p.label}
                  initial={reduced ? false : { opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.8, ease: EASE, delay: i * 0.08 }}
                  whileHover={reduced ? undefined : { y: -5 }}
                  className={`group flex flex-col overflow-hidden rounded-3xl shadow-[0_12px_32px_-8px_rgba(11,31,18,0.12)] transition-all duration-300 hover:shadow-[0_20px_40px_-12px_rgba(11,31,18,0.18)] ${p.theme}`}
                >
                  <div className="relative h-48 overflow-hidden sm:h-52">
                    <img
                      src={p.image}
                      alt=""
                      loading="lazy"
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
                    <span className="absolute left-3.5 top-3.5 rounded-full border border-white/30 bg-black/40 px-3 py-1 font-varela text-[11px] font-bold uppercase tracking-[0.14em] text-white backdrop-blur-md">
                      {p.label}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-6 sm:p-7">
                    <h3 className="m-0 font-rader text-[clamp(20px,1.9vw,24px)] font-bold leading-tight">{p.title}</h3>
                    <p className="mb-0 mt-3 font-varela text-[13.5px] leading-relaxed opacity-85">{p.body}</p>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        {/* ============ 3. WHY CHIS ============ */}
        <section id="unique" aria-labelledby="unique-title" className="relative isolate overflow-hidden bg-[#f3f8e6] px-5 py-16 sm:px-8 sm:py-20 lg:px-12">
          {/* Blurred travel map doodle background element */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10 bg-repeat opacity-[0.13] [filter:blur(0.85px)_drop-shadow(0_4px_14px_rgba(41,127,51,0.22))] mix-blend-multiply"
            style={{
              backgroundImage: `url(${travelMapDoodlesGreen})`,
              backgroundSize: '400px auto',
            }}
          />
          <div className="mx-auto max-w-[1400px]">
            <SectionHead
              eyebrow="Why CHIS"
              title="Four reasons"
              accent="people choose us."
              copy="Transparent hospitality, an award-winning workforce and heartfelt care."
            />
            <h2 id="unique-title" className="sr-only">Four reasons people choose CHIS</h2>

            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {UNIQUE.map((u, i) => {
                const Icon = u.icon
                return (
                  <motion.article
                    key={u.title}
                    initial={reduced ? false : { opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.7, ease: EASE, delay: i * 0.07 }}
                    whileHover={reduced ? undefined : { y: -5 }}
                    className="group flex flex-col justify-between overflow-hidden rounded-2xl sm:rounded-3xl border border-[#e4ded3] bg-white p-3 sm:p-3.5 shadow-sm transition-all duration-300 hover:border-[#096c27]/40 hover:shadow-xl"
                  >
                    <div>
                      {/* Top image box matching uploaded sample */}
                      <div className="relative h-44 sm:h-48 w-full overflow-hidden rounded-2xl bg-[#edf6f0]/60">
                        <img
                          src={u.image}
                          alt={u.title}
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        />
                        <span className="absolute left-2.5 top-2.5 grid h-7 w-7 place-items-center rounded-full bg-white/90 text-[#096c27] shadow-sm backdrop-blur-md">
                          <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                        </span>
                        <span className="absolute right-2.5 top-2.5 rounded-full bg-white/90 px-2 py-0.5 font-varela text-[10.5px] font-bold text-[#096c27] shadow-sm backdrop-blur-md">
                          {pad(i + 1)}
                        </span>
                      </div>

                      {/* Content block below image matching sample */}
                      <div className="px-1 pt-3.5">
                        <p className="m-0 font-varela text-[11px] font-bold uppercase tracking-[0.14em] text-[#096c27]">
                          {u.sub}
                        </p>
                        <h3 className="m-0 mt-1 font-rader text-lg sm:text-[19px] font-bold leading-snug text-[#0b1f12] transition-colors group-hover:text-[#096c27]">
                          {u.title}
                        </h3>
                        <p className="mb-0 mt-2 font-varela text-xs sm:text-[13px] leading-relaxed text-[#0b1f12]/65 line-clamp-3">
                          {u.body}
                        </p>
                      </div>
                    </div>

                    {/* Bottom meta row matching sample footer */}
                    <div className="mt-4 flex items-center justify-between border-t border-[#f0ebe0] px-1 pt-2.5 font-varela text-[11px] font-medium text-[#0b1f12]/50">
                      <span>{u.meta}</span>
                      <span className="font-semibold text-[#096c27] transition-transform group-hover:translate-x-0.5">
                        &rarr;
                      </span>
                    </div>
                  </motion.article>
                )
              })}
            </div>
          </div>
        </section>

        <style>{`
          @keyframes ab-marq { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        `}</style>
      </div>
    </PageTransition>
  )
}
