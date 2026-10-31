import { useEffect, useRef, useState } from 'react'
import { animate, motion, useReducedMotion } from 'framer-motion'
import {
  ArrowUpRight,
  CalendarCheck,
  Check,
  Globe,
  RotateCw,
  ShieldCheck,
} from 'lucide-react'
import PageTransition from '../components/layout/PageTransition'
import EscapeMondayGame from '../components/sections/EscapeMondayGame'
import silverCardImg from '../assets/chis-silver-card.png'
import goldCardImg from '../assets/chis-gold-card.png'
import vacationTravelerImg from '../assets/vacation-hero-traveler.png'
import travelDoodlesGreen from '../assets/travel-doodles-green.png'
import travelMapDoodlesGreen from '../assets/travel-map-doodles-green.png'
import img3dCalendar from '../assets/3d/calendar.jpg'
import img3dSplit from '../assets/3d/emi.jpg'
import img3dGlobe from '../assets/3d/globe.jpg'
import img3dConcierge from '../assets/3d/concierge.jpg'

/* CHIS palette: green #297f33 · deep #1e5f26 · leaf #b3d565 · ink #0b1f12 · mist #f3f8e6 · gold-card night #0b2a1a */

const EASE = [0.22, 1, 0.36, 1]
const inr = (n) => Math.round(n).toLocaleString('en-IN')
const pad = (n) => String(n).padStart(2, '0')

const scrollToId = (id, reduced) =>
  document.getElementById(id)?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' })

const openEnquiry = (plan) => {
  const subject = plan
    ? `CHIS Membership: ${plan.title || `${plan.category} ${plan.years} Years`}`
    : 'CHIS Membership Enquiry'
  window.location.href = `/contact?subject=${encodeURIComponent(subject)}`
}

/* ------------------------------ Data ------------------------------ */

const membershipPlans = [
  { id: 't1-10', category: 'T1', years: 10, priceStr: '₹4,60,000', priceNum: 460000, emiNum: 19166, asf: '₹12,000 / yr', occupancy: '2 Adults + 2 Kids (<6 yrs)', title: 'T1 Standard Room (10 Years)', description: 'Perfect for couples and young families seeking 10 consecutive years of memorable annual holidays.', perks: ['6N / 7D annual stay', 'Silver Tier lounge access', 'Zero peak-season surcharge'], tag: 'Popular for couples' },
  { id: 't1-30', category: 'T1', years: 30, priceStr: '₹7,60,000', priceNum: 760000, emiNum: 31666, asf: '₹12,000 / yr', occupancy: '2 Adults + 2 Kids (<6 yrs)', title: 'T1 Standard Room (30 Years)', description: 'Three decades of inflation-proof holiday ownership. The smart, long-term savings investment.', perks: ['30-year guaranteed vacations', 'Carry forward unused nights', 'Exchange across 3,500+ resorts'], tag: 'Best long-term value' },
  { id: 't2-10', category: 'T2', years: 10, priceStr: '₹6,60,000', priceNum: 660000, emiNum: 27500, asf: '₹15,000 / yr', occupancy: '4 Adults + 2 Kids (<6 yrs)', title: 'T2 Suite / 2-Bedroom (10 Years)', description: 'Spacious dual-bedroom suite accommodation for multi-generational families and group adventures.', perks: ['Dual private bedrooms', 'Priority high-season booking', 'Dedicated holiday manager'], tag: 'Ideal for families' },
  { id: 't2-30', category: 'T2', years: 30, priceStr: '₹9,60,000', priceNum: 960000, emiNum: 40000, asf: '₹15,000 / yr', occupancy: '4 Adults + 2 Kids (<6 yrs)', title: 'T2 Suite / 2-Bedroom (30 Years)', description: 'The definitive prestige membership. 30 years of grand suites and VIP global concierge hospitality.', perks: ['30-year suite entitlement', 'Global RCI & luxury affiliations', 'Complimentary voucher credits'], tag: 'Prestige heritage' },
]
const getPlan = (cat, years) => membershipPlans.find((p) => p.category === cat && p.years === years)

const PLAN_META = {
  T1: { name: 'Silver', label: 'T1 · Standard Room', cta: 'Choose Silver' },
  T2: { name: 'Gold', label: 'T2 · 2-Bedroom Suite', cta: 'Choose Gold' },
}

const HERO_CHIPS = ['6N / 7D every year', '3,500+ resorts', 'Zero peak surcharge', 'Fixed tariffs']

const INCLUDED = [
  { img3d: img3dCalendar, title: 'Carry nights forward', desc: 'Roll unused nights into later holiday years.' },
  { img3d: img3dSplit, title: 'Split into short breaks', desc: 'Turn 6N/7D into several quick getaways.' },
  { img3d: img3dGlobe, title: 'Exchange at 3,500+ resorts', desc: 'Stay across a global network of destinations.' },
  { img3d: img3dConcierge, title: '24/7 concierge', desc: 'Itineraries, transfers and check-ins handled.' },
]

const CARD_FACTS = {
  T1: {
    face: 'bg-gradient-to-br from-[#fffdf6] via-[#e6eed3] to-[#b9c9a0] text-[#10201a]',
    tagline: 'Standard room for couples and young families.',
    back: ['6N / 7D every year', 'Carry forward & split nights', 'Exchange across 3,500+ resorts', 'Zero peak-season surcharge'],
  },
  T2: {
    face: 'bg-gradient-to-br from-[#0b2a1a] via-[#0f3d22] to-[#1f6b3a] text-[#faf6ea]',
    tagline: 'Two-bedroom suite for the whole family.',
    back: ['6N / 7D in a 2-bedroom suite', 'Priority high-season booking', 'Dedicated holiday manager', 'Exchange across 3,500+ resorts'],
  },
}

/* ---------------------------- Small pieces ---------------------------- */

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
      className={`font-varela inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] ${dark ? 'border-white/20 bg-white/10 text-white/90 backdrop-blur-md' : 'border-[#297f33]/20 bg-white text-[#297f33]'
        }`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-[#b3d565] shadow-[0_0_8px_#b3d565]" />
      {children}
    </span>
  )
}

function SectionHead({ eyebrow, title, accent, copy, dark = false, center = false }) {
  return (
    <div className={`max-w-2xl ${center ? 'mx-auto text-center' : ''}`}>
      <Eyebrow dark={dark}>{eyebrow}</Eyebrow>
      <h2
        className={`m-0 mt-4 font-rader text-[clamp(26px,3.6vw,44px)] font-bold leading-[1.08] tracking-tight ${dark ? 'text-white' : 'text-[#0b1f12]'
          }`}
      >
        {title} <span className={`font-bold ${dark ? 'text-[#b3d565]' : 'text-[#297f33]'}`}>{accent}</span>
      </h2>
      {copy && (
        <p className={`mb-0 mt-3 font-varela text-[15px] leading-relaxed ${center ? 'mx-auto max-w-lg' : 'max-w-xl'} ${dark ? 'text-white/75' : 'text-[#0b1f12]/75'}`}>
          {copy}
        </p>
      )}
    </div>
  )
}

function Fade({ children, delay = 0, reduced, className = '' }) {
  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8, ease: EASE, delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

function Pill({ children, onClick, tone = 'leaf', className = '' }) {
  const tones = {
    leaf: ['bg-[#b3d565] text-[#0b1f12] hover:bg-white', 'bg-[#297f33] text-white'],
    green: ['bg-[#297f33] text-white hover:bg-[#1e5f26]', 'bg-[#b3d565] text-[#0b1f12]'],
    ink: ['bg-[#0b1f12] text-white hover:bg-[#297f33]', 'bg-[#b3d565] text-[#0b1f12]'],
  }[tone]
  return (
    <button
      type="button"
      onClick={onClick}
      className={`font-varela group inline-flex items-center gap-3 rounded-full py-1.5 pl-5 pr-1.5 text-[13px] font-bold transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#b3d565] ${tones[0]} ${className}`}
    >
      {children}
      <span className={`grid h-8 w-8 place-items-center rounded-full ${tones[1]}`}>
        <ArrowUpRight className="h-4 w-4 transition-transform duration-500 group-hover:rotate-45" aria-hidden="true" />
      </span>
    </button>
  )
}

/** Price that counts to its new value when the tenure changes */
function Price({ value, reduced }) {
  const [v, setV] = useState(value)
  const prev = useRef(value)
  useEffect(() => {
    if (reduced) {
      setV(value)
      prev.current = value
      return undefined
    }
    const c = animate(prev.current, value, { duration: 0.8, ease: EASE, onUpdate: setV })
    prev.current = value
    return () => c.stop()
  }, [value, reduced])
  return <span>₹{inr(v)}</span>
}

/* ------------------------------ Pricing card ------------------------------ */

function PlanCard({ cat, years, reduced, index }) {
  const meta = PLAN_META[cat]
  const p = getPlan(cat, years)
  if (!p) return null

  return (
    <motion.article
      initial={reduced ? false : { opacity: 0, y: 35 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8, ease: EASE, delay: index * 0.1 }}
      whileHover={reduced ? undefined : { y: -6 }}
      className="group relative flex flex-col justify-between overflow-hidden rounded-[28px] border border-[#297f33]/20 bg-white p-7 sm:p-8 shadow-[0_12px_36px_-10px_rgba(7,36,26,0.08)] transition-all duration-300 hover:border-[#297f33]/50 hover:shadow-[0_20px_48px_-12px_rgba(7,36,26,0.16)]"
    >
      <div className="relative">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="m-0 font-varela text-[11px] font-bold uppercase tracking-[0.14em] text-[#297f33]">
              {meta.label}
            </p>
            <h3 className="m-0 mt-1 font-rader text-[28px] font-bold leading-none tracking-tight text-[#0b1f12]">{meta.name}</h3>
          </div>
          <span
            className="font-varela shrink-0 rounded-full border border-[#297f33]/20 bg-[#f3f8e6] px-2.5 py-1 text-[10.5px] font-bold text-[#297f33]"
          >
            {p.tag}
          </span>
        </div>

        <div className="mt-5 flex items-baseline gap-2 border-y border-[#0b1f12]/10 py-4">
          <span className="font-rader text-[clamp(1.9rem,3.4vw,2.5rem)] font-bold leading-none tracking-tight tabular-nums text-[#0b1f12]">
            <Price value={p.priceNum} reduced={reduced} />
          </span>
          <span className="font-varela text-xs font-semibold text-[#0b1f12]/55">/ {years} years</span>
        </div>

        <p className="mb-0 mt-4 font-varela text-[13.5px] leading-relaxed text-[#0b1f12]/75">
          {p.description}
        </p>

        <ul className="m-0 mt-4 list-none space-y-2 p-0">
          {p.perks.map((perk) => (
            <li key={perk} className="font-varela flex items-center gap-2.5 text-[13px] text-[#0b1f12]">
              <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#297f33] text-white">
                <Check className="h-3 w-3" strokeWidth={3} aria-hidden="true" />
              </span>
              {perk}
            </li>
          ))}
        </ul>
      </div>

      <div className="relative mt-5">
        <dl className="m-0 grid grid-cols-2 gap-3 rounded-2xl bg-[#f3f8e6] p-3.5 font-varela text-[13px] text-[#0b1f12]">
          <div>
            <dt className="text-[10.5px] font-bold uppercase tracking-[0.12em] text-[#0b1f12]/50">Occupancy</dt>
            <dd className="m-0 mt-0.5 font-bold leading-snug">{p.occupancy}</dd>
          </div>
          <div>
            <dt className="text-[10.5px] font-bold uppercase tracking-[0.12em] text-[#0b1f12]/50">Annual fee</dt>
            <dd className="m-0 mt-0.5 font-bold leading-snug">{p.asf}</dd>
          </div>
        </dl>
        <div className="mt-4">
          <Pill tone="green" onClick={() => openEnquiry(p)} className="w-full justify-between">
            {meta.cta}
          </Pill>
        </div>
      </div>
    </motion.article>
  )
}

/* ------------------------------ Compare ------------------------------ */

function CompareTable({ reduced }) {
  const t = [getPlan('T1', 10), getPlan('T1', 30)]
  const g = [getPlan('T2', 10), getPlan('T2', 30)]
  const short = (o) => o.replace('(<6 yrs)', '(<6)')
  const rows = [
    ['Room', 'Standard · 1 bedroom', 'Suite · 2 bedrooms'],
    ['Guests', short(t[0].occupancy), short(g[0].occupancy)],
    ['10 years', t[0].priceStr, g[0].priceStr],
    ['30 years', t[1].priceStr, g[1].priceStr],
    ['Annual fee', t[0].asf, g[0].asf],
    ['Extras', 'Lounge access, transfer rights', 'Priority booking, holiday manager'],
    ['Best for', 'Couples, young kids', 'Grandparents, bigger groups'],
  ]
  return (
    <Fade reduced={reduced} className="mx-auto mt-10 max-w-4xl">
      <div className="overflow-x-auto rounded-3xl border border-[#297f33]/15 bg-white shadow-sm font-varela">
        <div className="grid min-w-[480px] sm:min-w-0 grid-cols-[0.7fr_1fr_1fr] text-[12px] sm:text-[13.5px]">
          <div className="bg-[#f3f8e6]" />
          <div className="flex items-center justify-between bg-[#f3f8e6] px-3 py-3.5 sm:px-5">
            <span className="font-rader text-lg font-bold tracking-tight text-[#297f33] sm:text-xl">Silver</span>
            <span className="hidden rounded-full bg-white px-2 py-0.5 text-[10.5px] font-bold text-[#297f33] sm:block">T1</span>
          </div>
          <div className="flex items-center justify-between border-l border-[#297f33]/10 bg-[#f3f8e6] px-3 py-3.5 sm:px-5">
            <span className="font-rader text-lg font-bold tracking-tight text-[#297f33] sm:text-xl">Gold</span>
            <span className="hidden rounded-full bg-white px-2 py-0.5 text-[10.5px] font-bold text-[#297f33] sm:block">T2</span>
          </div>

          {rows.map(([k, a, b]) => (
            <div key={k} className="contents">
              <div className="flex items-center border-t border-[#0b1f12]/8 px-3 py-3 font-semibold text-[#0b1f12]/55 sm:px-5">{k}</div>
              <div className="flex items-center border-t border-[#0b1f12]/8 px-3 py-3 font-medium text-[#0b1f12] sm:px-5">{a}</div>
              <div className="flex items-center border-t border-l border-[#0b1f12]/8 px-3 py-3 font-medium text-[#0b1f12] sm:px-5">{b}</div>
            </div>
          ))}
        </div>
      </div>
    </Fade>
  )
}

/* ------------------------------ Cards ------------------------------ */

function MembershipCard({ cat, reduced, index }) {
  const meta = PLAN_META[cat]
  const facts = CARD_FACTS[cat]
  const dark = cat === 'T2'
  const p10 = getPlan(cat, 10)
  const [flipped, setFlipped] = useState(false)
  const face = 'absolute inset-0 overflow-hidden rounded-[1.1rem] shadow-[0_18px_36px_-14px_rgba(7,36,26,0.55)]'
  const hide = { backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }

  return (
    <motion.article
      initial={reduced ? false : { opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8, ease: EASE, delay: index * 0.1 }}
      className="flex flex-col items-center rounded-3xl border border-[#297f33]/15 bg-white p-5 shadow-sm sm:p-6"
    >
      <div className="w-full max-w-[24rem]" style={{ perspective: 1100 }}>
        <motion.div
          role="button"
          tabIndex={0}
          aria-label={`Flip ${meta.name} card`}
          onClick={() => setFlipped((v) => !v)}
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), setFlipped((v) => !v))}
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: reduced ? 0 : 0.8, ease: EASE }}
          style={{ transformStyle: 'preserve-3d' }}
          className="relative aspect-[1.586/1] w-full cursor-pointer focus:outline-none focus-visible:ring-4 focus-visible:ring-[#b3d565]/70 rounded-[1.1rem]"
        >
          <div aria-hidden={flipped} className={face} style={hide}>
            <img
              src={dark ? goldCardImg : silverCardImg}
              alt={`${meta.name} Membership Card`}
              className="h-full w-full object-cover"
            />
          </div>
          <div
            aria-hidden={!flipped}
            className={`${face} ${facts.face}`}
            style={{ ...hide, transform: 'rotateY(180deg)' }}
          >
            <div className="flex h-full flex-col font-varela">
              <div aria-hidden="true" className="mt-4 h-6 w-full bg-[#07241a] sm:h-7" />
              <ul className="m-0 flex-1 list-none space-y-1.5 px-5 pt-3 text-[11.5px] font-medium leading-tight sm:space-y-2 sm:text-xs">
                {facts.back.map((b) => (
                  <li key={b} className="flex items-center gap-2">
                    <Check className={`h-3.5 w-3.5 shrink-0 ${dark ? 'text-[#b3d565]' : 'text-[#297f33]'}`} strokeWidth={3} aria-hidden="true" />
                    {b}
                  </li>
                ))}
              </ul>
              <p className={`m-0 px-5 pb-3 text-[10px] ${dark ? 'text-[#faf6ea]/65' : 'text-[#10201a]/60'}`}>
                Annual fee {p10.asf} · Sample card design
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="mt-5 text-center">
        <h3 className="m-0 font-rader text-[20px] font-bold tracking-tight text-[#0b1f12]">{meta.name} card</h3>
        <p className="mb-0 mt-1 font-varela text-[13.5px] text-[#0b1f12]/60">{facts.tagline}</p>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2.5">
          <button
            type="button"
            aria-pressed={flipped}
            onClick={() => setFlipped((v) => !v)}
            className="font-varela inline-flex items-center gap-2 rounded-full border border-[#297f33]/25 px-4 py-2 text-[13px] font-bold text-[#297f33] transition-colors duration-300 hover:bg-[#297f33] hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#297f33]"
          >
            <RotateCw className="h-3.5 w-3.5" aria-hidden="true" />
            {flipped ? 'Show front' : 'Flip card'}
          </button>
          <Pill tone="green" onClick={() => openEnquiry(p10)}>Get this card</Pill>
        </div>
      </div>
    </motion.article>
  )
}

/* ------------------------------ Page ------------------------------ */

export default function VacationPackagesPage() {
  const reduced = !!useReducedMotion()
  const [years, setYears] = useState(10)

  return (
    <PageTransition>
      <div className="page-packages relative w-full overflow-x-clip bg-white text-[#0b1f12] antialiased selection:bg-[#b3d565] selection:text-[#0b1f12]">
        {/* Outer layers: lateral ambient glow effects along the sides */}
        <div aria-hidden="true" className="pointer-events-none fixed inset-y-0 left-0 -z-10 w-64 sm:w-96 overflow-hidden">
          <div className="absolute top-1/4 -left-40 h-[520px] w-[520px] rounded-full bg-[#297f33]/12 blur-[140px]" />
          <div className="absolute top-2/3 -left-36 h-[460px] w-[460px] rounded-full bg-[#b3d565]/15 blur-[130px]" />
        </div>
        <div aria-hidden="true" className="pointer-events-none fixed inset-y-0 right-0 -z-10 w-64 sm:w-96 overflow-hidden">
          <div className="absolute top-1/3 -right-40 h-[540px] w-[540px] rounded-full bg-[#b3d565]/15 blur-[140px]" />
          <div className="absolute top-3/4 -right-36 h-[480px] w-[480px] rounded-full bg-[#297f33]/12 blur-[130px]" />
        </div>

        {/* ============ HERO ============ */}
        <section
          id="top"
          aria-labelledby="hero-title"
          className="relative isolate flex min-h-[100svh] w-full flex-col justify-center overflow-hidden bg-gradient-to-br from-[#174e20] via-[#297f33] to-[#1e5f26] pt-24 pb-14 text-white"
        >
          {/* Hero background side effects & decorative elements */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
            {/* Soft ambient gradient orbs */}
            <div className="absolute -right-[15%] -top-[25%] h-[60vw] w-[60vw] rounded-full bg-[#b3d565]/25 blur-3xl" />
            <div className="absolute -left-[10%] -bottom-[10%] h-[45vw] w-[45vw] rounded-full bg-[#b3d565]/15 blur-3xl" />

            {/* Travel doodle sketch overlay on Hero matching uploaded element */}
            <div
              className="absolute inset-0 bg-repeat opacity-[0.18] invert [filter:brightness(1.1)]"
              style={{
                backgroundImage: `url(${travelDoodlesGreen})`,
                backgroundSize: '560px auto',
              }}
            />
          </div>

          <div className="mx-auto grid w-full max-w-[1340px] flex-1 items-center gap-10 px-5 sm:px-8 lg:grid-cols-12 lg:gap-12 lg:px-12">
            <div className="flex flex-col justify-center lg:col-span-6">
              <h1 id="hero-title" className="m-0 font-rader font-bold text-[clamp(2.6rem,6vw,5.2rem)] leading-[0.98] tracking-tight">
                <Rise text="Vacation" reduced={reduced} className="block" />
                <Rise text="Packages" start={0.15} reduced={reduced} className="block font-bold text-[#b3d565]" />
              </h1>

              <p className="mb-0 mt-5 max-w-lg font-varela text-[15px] sm:text-base leading-relaxed text-white/85">
                Guaranteed 6N/7D stays every year across 3,500+ resorts worldwide. Pick a tier, choose 10 or 30 years, and lock in inflation-proof luxury stays.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3.5">
                <Pill onClick={() => scrollToId('membership-pricing', reduced)}>Get started</Pill>
                <button
                  type="button"
                  onClick={() => openEnquiry()}
                  className="font-varela font-bold rounded-full border border-white/35 px-6 py-2.5 text-[13px] transition-colors duration-300 hover:bg-white/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  Talk to our desk
                </button>
              </div>

              <ul className="m-0 mt-8 flex list-none flex-nowrap items-center gap-2 overflow-x-auto sm:overflow-visible [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden p-0 font-varela">
                {HERO_CHIPS.map((c, i) => (
                  <motion.li
                    key={c}
                    initial={reduced ? false : { opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: EASE, delay: 0.7 + i * 0.08 }}
                    className="inline-flex shrink-0 whitespace-nowrap items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[11.5px] sm:text-[12px] font-bold text-white/90 backdrop-blur-md"
                  >
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#b3d565]" />
                    {c}
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* Traveler image showcase */}
            <div className="relative flex w-full items-center justify-center lg:col-span-6">
              {/* Soft ambient backlights */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-6 h-[380px] w-[380px] sm:h-[460px] sm:w-[460px] rounded-full bg-[#b3d565]/20 blur-3xl"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute bottom-4 h-[280px] w-[280px] rounded-full bg-white/15 blur-2xl"
              />

              {/* Floating Traveler with gentle breathing animation & bottom fade */}
              <motion.div
                initial={reduced ? false : { opacity: 0, scale: 0.94, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 1.1, ease: EASE, delay: 0.25 }}
                className="relative z-10 flex w-full max-w-[480px] flex-col items-center justify-center"
              >
                {/* Soft gradient mask on bottom to dissolve straight cutoff edge */}
                <div className="relative w-full [mask-image:linear-gradient(to_bottom,black_75%,transparent_98%)] [-webkit-mask-image:linear-gradient(to_bottom,black_75%,transparent_98%)]">
                  <motion.img
                    src={vacationTravelerImg}
                    alt="Happy traveler with vacation packages"
                    animate={reduced ? undefined : { y: [0, -7, 0] }}
                    transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
                    className="mx-auto block max-h-[390px] sm:max-h-[460px] lg:max-h-[510px] w-auto object-contain"
                  />
                </div>

                {/* Left Floating Badge */}
                <motion.div
                  initial={reduced ? false : { opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, ease: EASE, delay: 0.6 }}
                  className="font-varela absolute -left-2 sm:-left-6 top-12 sm:top-16 hidden xs:flex sm:flex items-center gap-2.5 rounded-2xl border border-white/25 bg-white/20 px-3.5 py-2 shadow-md backdrop-blur-xl"
                >
                  <span className="grid h-8 w-8 place-items-center rounded-xl bg-[#b3d565] text-[#0b1f12]">
                    <Globe className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="m-0 text-[10.5px] font-bold uppercase tracking-wider text-[#b3d565]">Global Access</p>
                    <p className="m-0 text-xs font-bold text-white">3,500+ Resorts</p>
                  </div>
                </motion.div>

                {/* Right Floating Badge */}
                <motion.div
                  initial={reduced ? false : { opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, ease: EASE, delay: 0.8 }}
                  className="font-varela absolute -right-2 sm:-right-4 bottom-8 sm:bottom-12 hidden xs:flex sm:flex items-center gap-2.5 rounded-2xl border border-white/25 bg-white/20 px-3.5 py-2 shadow-md backdrop-blur-xl"
                >
                  <span className="grid h-8 w-8 place-items-center rounded-xl bg-[#297f33] text-white">
                    <CalendarCheck className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="m-0 text-[10.5px] font-bold uppercase tracking-wider text-[#b3d565]">Guaranteed Stays</p>
                    <p className="m-0 text-xs font-bold text-white">6N / 7D Every Year</p>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ============ WHITE PAGE SECTIONS (WITH BLURRED TRAVEL MAP BACKGROUND) ============ */}
        <div className="relative isolate overflow-hidden bg-[#fbfdfa]">
          {/* Blurred travel map doodle background element */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10 bg-repeat opacity-[0.13] [filter:blur(0.85px)_drop-shadow(0_4px_14px_rgba(41,127,51,0.22))] mix-blend-multiply"
            style={{
              backgroundImage: `url(${travelMapDoodlesGreen})`,
              backgroundSize: '400px auto',
            }}
          />

          {/* ============ PLANS ============ */}
          <section id="membership-pricing" aria-labelledby="pricing-title" className="relative px-5 py-16 sm:px-8 sm:py-20 lg:px-12">
            <div className="mx-auto max-w-[1240px]">
              <SectionHead
                center
                eyebrow="Membership plans"
                title="Choose your"
                accent="tier."
                copy="Guaranteed nights, zero seasonal surge, and a price that stays put."
              />
              <h2 id="pricing-title" className="sr-only">Choose your tier</h2>

              {/* tenure toggle */}
              <div
                role="radiogroup"
                aria-label="Membership tenure"
                className="font-varela relative mx-auto mt-8 grid max-w-sm grid-cols-2 rounded-full bg-white p-1 shadow-sm ring-1 ring-[#297f33]/15"
              >
                {[{ y: 10, label: '10 years' }, { y: 30, label: '30 years · best value' }].map(({ y, label }) => (
                  <button
                    key={y}
                    type="button"
                    role="radio"
                    aria-checked={years === y}
                    onClick={() => setYears(y)}
                    className={`relative z-10 rounded-full px-3 py-2.5 text-[12.5px] font-bold transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#297f33] ${years === y ? 'text-white' : 'text-[#0b1f12]/65'
                      }`}
                  >
                    {years === y && (
                      <motion.span
                        layoutId="ch-tenure"
                        transition={{ type: 'spring', stiffness: 400, damping: 34 }}
                        className="absolute inset-0 -z-10 rounded-full bg-[#297f33]"
                      />
                    )}
                    {label}
                  </button>
                ))}
              </div>

              <div className="mt-8 grid gap-6 md:grid-cols-2" aria-live="polite">
                <PlanCard cat="T1" years={years} reduced={reduced} index={0} />
                <PlanCard cat="T2" years={years} reduced={reduced} index={1} />
              </div>
            </div>
          </section>

          {/* ============ COMPARE ============ */}
          <section id="compare-plans" aria-labelledby="compare-title" className="relative px-5 py-16 sm:px-8 sm:py-20 lg:px-12">
            <div className="mx-auto max-w-[1240px]">
              <SectionHead
                center
                eyebrow="Side by side"
                title="Compare"
                accent="plans."
                copy="Same promise, two sizes. Here is what changes between Silver and Gold."
              />
              <h2 id="compare-title" className="sr-only">Compare plans</h2>
              <CompareTable reduced={reduced} />
            </div>
          </section>

          {/* ============ INCLUDED ============ */}
          <section id="included" aria-labelledby="included-title" className="relative px-5 py-16 sm:px-8 sm:py-20 lg:px-12">
            <div className="mx-auto max-w-[1240px]">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                <SectionHead
                  eyebrow="Included"
                  title="With every"
                  accent="plan."
                  copy="Silver or Gold, 10 or 30 years: these come standard."
                />
                <h2 id="included-title" className="sr-only">Included with every plan</h2>
                <Fade reduced={reduced}>
                  <div className="flex w-fit items-center gap-3 rounded-2xl border border-[#297f33]/20 bg-white/95 p-3.5 shadow-sm backdrop-blur-md">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#297f33] text-[#b3d565]">
                      <ShieldCheck className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <div className="font-varela">
                      <p className="m-0 text-[13.5px] font-bold text-[#0b1f12]">Tariff locked</p>
                      <p className="m-0 text-xs text-[#0b1f12]/60">No inflation, no surge pricing.</p>
                    </div>
                  </div>
                </Fade>
              </div>

              <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {INCLUDED.map(({ img3d, title, desc }, i) => (
                  <motion.div
                    key={title}
                    initial={reduced ? false : { opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.7, ease: EASE, delay: i * 0.07 }}
                    whileHover={reduced ? undefined : { y: -6 }}
                    className="group relative flex min-h-[250px] flex-col justify-between overflow-hidden rounded-[26px] border border-[#297f33]/20 bg-gradient-to-b from-[#f4f9ee] via-[#edf6e4] to-[#e6f2dc] p-5 shadow-[0_8px_24px_rgba(41,127,51,0.06)] transition-all duration-300 hover:border-[#297f33]/40 hover:from-[#ecf6e4] hover:to-[#dfeed0] hover:shadow-[0_16px_36px_rgba(41,127,51,0.12)]"
                  >
                    <div className="flex items-start justify-between">
                      <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-white/90 p-1.5 shadow-sm ring-1 ring-[#297f33]/15 backdrop-blur-sm transition-transform duration-500 group-hover:scale-110 group-hover:rotate-1">
                        <img
                          src={img3d}
                          alt={title}
                          className="h-full w-full object-contain mix-blend-multiply"
                          loading="lazy"
                        />
                      </div>
                      <span className="font-varela text-xs font-bold tracking-[0.1em] text-[#297f33]">{pad(i + 1)}</span>
                    </div>
                    <div className="mt-4">
                      <h3 className="m-0 font-rader text-[17px] font-bold leading-snug tracking-tight text-[#0b1f12] group-hover:text-[#297f33] transition-colors duration-300">
                        {title}
                      </h3>
                      <p className="mb-0 mt-2 font-varela text-[13px] leading-relaxed text-[#0b1f12]/75">{desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <p className="mb-0 mt-6 text-center font-varela text-xs text-[#0b1f12]/50">
                Entitlements are summarised here. Your membership agreement is the final reference.
              </p>
            </div>
          </section>

          {/* ============ CARDS ============ */}
          <section id="resort-collection" aria-labelledby="cards-title" className="relative px-5 py-16 sm:px-8 sm:py-20 lg:px-12">
            <div className="mx-auto max-w-[1240px]">
              <SectionHead
                center
                eyebrow="Membership cards"
                title="One card, every"
                accent="arrival."
                copy="Tap a card to flip it and see what it carries."
              />
              <h2 id="cards-title" className="sr-only">One card, every arrival</h2>
              <div className="mt-10 grid gap-6 md:grid-cols-2">
                <MembershipCard cat="T1" reduced={reduced} index={0} />
                <MembershipCard cat="T2" reduced={reduced} index={1} />
              </div>
              <p className="mb-0 mt-5 text-center font-varela text-xs text-[#0b1f12]/50">Card designs shown are illustrative.</p>
            </div>
          </section>
        </div>

        {/* ============ CTA ============ */}
        <section id="enquire" aria-labelledby="cta-title" className="relative px-5 py-16 sm:px-8 sm:py-20 lg:px-12">
          <div className="relative mx-auto max-w-[1240px] overflow-hidden rounded-[2rem] bg-gradient-to-r from-[#174e20] via-[#297f33] to-[#1e5f26] px-6 py-12 text-white sm:px-12 sm:py-16 shadow-xl">
            {/* Travel doodle sketch overlay */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-repeat opacity-[0.16] invert [filter:brightness(1.1)]"
              style={{
                backgroundImage: `url(${travelDoodlesGreen})`,
                backgroundSize: '560px auto',
              }}
            />
            <div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#b3d565]/25 blur-3xl" />
            <div aria-hidden="true" className="pointer-events-none absolute -bottom-32 left-1/4 h-72 w-72 rounded-full border border-white/10" />
            <div aria-hidden="true" className="pointer-events-none absolute -bottom-20 left-[30%] h-52 w-52 rounded-full border border-white/10" />

            <div className="relative z-10 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
              <div className="max-w-xl">
                <Eyebrow dark>Still deciding?</Eyebrow>
                <h2 id="cta-title" className="m-0 mt-4 font-rader text-[clamp(28px,4.2vw,52px)] font-bold leading-[1.05] tracking-tight">
                  Plan your next <span className="font-bold text-[#b3d565]">30 years</span> of travel.
                </h2>
                <p className="mb-0 mt-4 max-w-md font-varela text-[15px] leading-relaxed text-white/85">
                  Our holiday desk will walk you through the numbers, no pressure.
                </p>
              </div>
              <Pill onClick={() => openEnquiry({ title: 'Custom Vacation Consultation' })} className="w-fit">
                Request a quote
              </Pill>
            </div>
          </div>

          {/* ===== Escape Monday Play Now Mini-Game ===== */}
          <div className="mt-10 sm:mt-14">
            <EscapeMondayGame />
          </div>
        </section>
      </div>
    </PageTransition>
  )
}
