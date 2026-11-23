import { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import {
  ArrowUpRight,
  CalendarCheck,
  Check,
  Globe,
  RotateCw,
  ShieldCheck,
  Crown,
  Sparkles,
  Users,
  Bed,
  Star,
  BedDouble,
  Clock,
  Repeat,
  HeartHandshake,
  Layers,
} from 'lucide-react'
import PageTransition from '../components/layout/PageTransition'
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
const pad = (n) => String(n).padStart(2, '0')

const scrollToId = (id, reduced) =>
  document.getElementById(id)?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' })

const openEnquiry = (plan) => {
  const subject = plan
    ? `CHIS Vacation Package: ${plan.title || `${plan.category} ${plan.years} Years`}`
    : 'CHIS Vacation Package Enquiry'
  window.location.href = `/contact?subject=${encodeURIComponent(subject)}`
}

/* ------------------------------ Data ------------------------------ */

const membershipPlans = [
  { id: 't1-10', category: 'T1', years: 10, roomType: 'Standard · 1 Bedroom', occupancy: '2 Adults + 2 Kids (<6 yrs)', title: 'T1 Standard Room (10 Years)', description: 'Perfect for couples and young families seeking 10 consecutive years of memorable annual holidays.', perks: ['6N / 7D annual stay', 'Silver Tier lounge access', 'Zero peak-season surcharge'], tag: 'Popular for couples' },
  { id: 't1-30', category: 'T1', years: 30, roomType: 'Standard · 1 Bedroom', occupancy: '2 Adults + 2 Kids (<6 yrs)', title: 'T1 Standard Room (30 Years)', description: 'Three decades of guaranteed annual holidays for couples and growing families.', perks: ['30-year guaranteed vacations', 'Carry forward unused nights', 'Exchange across 3,500+ resorts'], tag: 'Best long-term value' },
  { id: 't2-10', category: 'T2', years: 10, roomType: 'Suite · 2 Bedrooms', occupancy: '4 Adults + 2 Kids (<6 yrs)', title: 'T2 Suite / 2-Bedroom (10 Years)', description: 'Spacious dual-bedroom suite accommodation for multi-generational families and group adventures.', perks: ['Dual private bedrooms', 'Priority high-season booking', 'Dedicated holiday manager'], tag: 'Ideal for families' },
  { id: 't2-30', category: 'T2', years: 30, roomType: 'Suite · 2 Bedrooms', occupancy: '4 Adults + 2 Kids (<6 yrs)', title: 'T2 Suite / 2-Bedroom (30 Years)', description: 'The definitive prestige vacation package. 30 years of grand suites and VIP global concierge hospitality.', perks: ['30-year suite entitlement', 'Global RCI & luxury affiliations', 'Complimentary voucher credits'], tag: 'Prestige heritage' },
]
const getPlan = (cat, years) => membershipPlans.find((p) => p.category === cat && p.years === years)

const PLAN_META = {
  T1: { name: 'Silver', label: 'T1 · Standard Room', cta: 'Choose Silver' },
  T2: { name: 'Gold', label: 'T2 · 2-Bedroom Suite', cta: 'Choose Gold' },
}

const HERO_CHIPS = ['6N / 7D every year', '3,500+ resorts', 'Zero peak surcharge', '10 & 30 year options']

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

/* ------------------------------ Tier showcase card ------------------------------ */

function PlanCard({ cat, years, reduced, index }) {
  const meta = PLAN_META[cat]
  const p = getPlan(cat, years)
  if (!p) return null

  const isGold = cat === 'T2'

  return (
    <motion.article
      initial={reduced ? false : { opacity: 0, y: 35 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8, ease: EASE, delay: index * 0.1 }}
      whileHover={reduced ? undefined : { y: -6 }}
      className={`group relative flex flex-col justify-between overflow-hidden rounded-[32px] p-7 sm:p-9 transition-all duration-500 border-2 bg-gradient-to-br from-[#062118] via-[#0b3324] to-[#071f16] text-white shadow-[0_20px_50px_-10px_rgba(7,36,26,0.38)] hover:shadow-[0_28px_60px_-10px_rgba(7,36,26,0.55)] ${
        isGold
          ? 'border-[#b3d565]/60 hover:border-[#b3d565]'
          : 'border-[#297f33]/40 hover:border-[#b3d565]/80'
      }`}
    >
      {/* Decorative ambient corner glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[#b3d565]/20 blur-3xl"
      />

      <div className="relative z-10">
        {/* Top Badges & Tag */}
        <div className="flex flex-wrap items-center justify-between gap-2.5">
          {isGold ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#ffd84d] to-[#b3d565] px-3.5 py-1 text-[11px] font-bold uppercase tracking-wider text-[#07241a] shadow-sm">
              <Crown className="h-3.5 w-3.5" />
              Prestige Flagship Tier
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3.5 py-1 text-[11px] font-bold uppercase tracking-wider text-[#b3d565] border border-white/20 shadow-sm">
              <Sparkles className="h-3.5 w-3.5 text-[#b3d565]" />
              Popular for Couples
            </span>
          )}

          <span className="font-varela text-[10px] font-bold rounded-full px-2.5 py-0.5 uppercase tracking-wider bg-white/15 text-[#b3d565] border border-white/20">
            Tier {cat}
          </span>
        </div>

        {/* Title & Category */}
        <div className="mt-5">
          <h3 className="m-0 font-rader text-[28px] sm:text-[32px] font-bold leading-none tracking-tight text-white">
            {meta.name} Package
          </h3>
          <p className="mt-1.5 font-varela text-xs font-semibold text-[#b3d565]">
            {meta.label}
          </p>
        </div>

        {/* Tenure & Annual Nights Banner */}
        <div className="mt-5 flex flex-wrap items-baseline justify-between gap-2 rounded-2xl p-3.5 sm:p-4 bg-white/10 border border-white/15 text-white">
          <div className="flex items-baseline gap-2">
            <span className="font-rader text-[clamp(1.85rem,3.2vw,2.4rem)] font-bold leading-none tracking-tight text-[#b3d565]">
              {years} Years
            </span>
            <span className="font-varela text-xs font-semibold text-white/70">
              guaranteed holidays
            </span>
          </div>
          <span className="font-varela rounded-full px-3 py-1 text-[11.5px] font-bold bg-[#b3d565] text-[#07241a]">
            6N / 7D Every Year
          </span>
        </div>

        {/* Description */}
        <p className="mb-0 mt-4 font-varela text-[13.5px] leading-relaxed text-white/80">
          {p.description}
        </p>

        {/* Key Specifications Grid */}
        <div className="mt-5 grid grid-cols-2 gap-2.5 font-varela">
          <div className="rounded-2xl p-3 text-xs bg-white/10 border border-white/10 text-white">
            <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider opacity-60">
              <Users className="h-3 w-3" /> Occupancy
            </span>
            <p className="m-0 mt-1 font-bold leading-snug">{p.occupancy}</p>
          </div>

          <div className="rounded-2xl p-3 text-xs bg-white/10 border border-white/10 text-white">
            <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider opacity-60">
              <Bed className="h-3 w-3" /> Accommodation
            </span>
            <p className="m-0 mt-1 font-bold leading-snug">{p.roomType}</p>
          </div>
        </div>

        {/* Perks Checklist */}
        <ul className="m-0 mt-5 list-none space-y-2.5 p-0 font-varela">
          {p.perks.map((perk) => (
            <li key={perk} className="flex items-center gap-3 text-[13px]">
              <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full text-xs font-bold bg-[#b3d565] text-[#07241a]">
                <Check className="h-3 w-3" strokeWidth={3} aria-hidden="true" />
              </span>
              <span className="text-white/95">{perk}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* CTA Button */}
      <div className="relative z-10 mt-7 pt-4 border-t border-white/10">
        <button
          type="button"
          onClick={() => openEnquiry(p)}
          className={`group flex w-full items-center justify-between rounded-full py-2 pl-6 pr-2 text-sm font-bold shadow-md transition-all duration-300 hover:scale-[1.02] hover:shadow-lg focus:outline-none focus-visible:ring-4 focus-visible:ring-gold/60 font-varela ${
            isGold
              ? 'bg-gradient-to-r from-[#ffd84d] to-[#b3d565] text-[#07241a]'
              : 'bg-[#b3d565] text-[#07241a] hover:bg-white'
          }`}
        >
          <span>{isGold ? 'Inquire for Gold Package' : 'Inquire for Silver Package'}</span>
          <span className="grid h-9 w-9 place-items-center rounded-full bg-[#07241a] text-[#b3d565] transition-transform duration-300 group-hover:rotate-45">
            <ArrowUpRight className="h-4 w-4" />
          </span>
        </button>
      </div>
    </motion.article>
  )
}

/* ------------------------------ Compare ------------------------------ */

function CompareTable({ reduced }) {
  const [mobileTab, setMobileTab] = useState('both')
  const t = getPlan('T1', 10)
  const g = getPlan('T2', 10)
  const short = (o) => o.replace('(<6 yrs)', '(<6)')

  const rows = [
    {
      label: 'Room Configuration',
      sub: 'Bedrooms & private space',
      icon: BedDouble,
      silver: 'Standard Room · 1 Private Bedroom',
      gold: 'Luxury Suite · 2 Grand Bedrooms',
      goldBadge: 'Double Space',
    },
    {
      label: 'Guest Occupancy',
      sub: 'Family members included per stay',
      icon: Users,
      silver: `${short(t.occupancy)} included`,
      gold: `${short(g.occupancy)} included`,
      goldBadge: 'Up to 6 Guests',
    },
    {
      label: 'Annual Holiday Duration',
      sub: 'Guaranteed each calendar year',
      icon: CalendarCheck,
      silver: '6 Nights / 7 Days every year',
      gold: '6 Nights / 7 Days every year',
      silverBadge: 'Guaranteed',
      goldBadge: 'Guaranteed',
    },
    {
      label: 'Tenure Options',
      sub: 'Long-term vacation certainty',
      icon: Clock,
      silver: '10 or 30 Years (Fixed price)',
      gold: '10 or 30 Years (Fixed price)',
      silverBadge: 'Inflation Proof',
      goldBadge: 'Inflation Proof',
    },
    {
      label: 'Stay Flexibility',
      sub: 'Carry-forward & split nights',
      icon: Repeat,
      silver: 'Carry forward unused nights · Split across seasons',
      gold: 'Carry forward unused nights · Split across seasons',
      silverBadge: '100% Flexible',
      goldBadge: '100% Flexible',
    },
    {
      label: 'Resort Network & Affiliation',
      sub: 'Global destinations accessible',
      icon: Globe,
      silver: '3,500+ CHIS & verified partner resorts',
      gold: '3,500+ RCI Gold Crown & 5-Star luxury properties',
      goldBadge: 'RCI Gold Crown',
    },
    {
      label: 'Privileges & Concierge',
      sub: 'On-ground service standard',
      icon: Sparkles,
      silver: 'Silver Lounge access & holiday transfer rights',
      gold: 'Dedicated holiday manager & priority high-season booking',
      goldBadge: 'VIP Manager',
    },
    {
      label: 'Best Suited For',
      sub: 'Recommended traveler profile',
      icon: HeartHandshake,
      silver: 'Couples, honeymooners & young families',
      gold: 'Multi-gen families, grandparents & grand groups',
      goldBadge: 'Multi-Gen',
    },
  ]

  const showSilver = mobileTab === 'both' || mobileTab === 't1'
  const showGold = mobileTab === 'both' || mobileTab === 't2'

  return (
    <Fade reduced={reduced} className="mx-auto mt-10 max-w-5xl">
      {/* Mobile view toggle tabs */}
      <div className="mb-4 flex items-center justify-center gap-1.5 sm:hidden font-varela">
        <span className="text-xs font-semibold text-[#07241a]/60 mr-2">Compare:</span>
        <div className="inline-flex rounded-full bg-white p-1 shadow-sm border border-[#096c27]/15">
          <button
            type="button"
            onClick={() => setMobileTab('both')}
            className={`rounded-full px-3 py-1 text-xs font-bold transition-colors ${
              mobileTab === 'both' ? 'bg-[#096c27] text-white' : 'text-[#07241a]/70 hover:text-[#07241a]'
            }`}
          >
            Both Tiers
          </button>
          <button
            type="button"
            onClick={() => setMobileTab('t1')}
            className={`rounded-full px-3 py-1 text-xs font-bold transition-colors ${
              mobileTab === 't1' ? 'bg-[#096c27] text-white' : 'text-[#07241a]/70 hover:text-[#07241a]'
            }`}
          >
            Silver
          </button>
          <button
            type="button"
            onClick={() => setMobileTab('t2')}
            className={`rounded-full px-3 py-1 text-xs font-bold transition-colors ${
              mobileTab === 't2' ? 'bg-[#096c27] text-white' : 'text-[#07241a]/70 hover:text-[#07241a]'
            }`}
          >
            Gold
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-3xl sm:rounded-[32px] border-2 border-[#096c27]/20 bg-white shadow-[0_20px_50px_-15px_rgba(7,36,26,0.12)] font-varela">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-[#096c27]/15">
                {/* Feature Column Header */}
                <th
                  scope="col"
                  className="w-[32%] bg-[#f3f8e6]/80 p-4 sm:p-6 align-bottom"
                >
                  <div className="flex items-center gap-2 text-[#096c27] text-xs font-bold uppercase tracking-wider">
                    <Layers className="h-4 w-4" />
                    <span>Plan Features</span>
                  </div>
                  <h4 className="mt-1 font-rader text-xl sm:text-2xl font-bold tracking-tight text-[#07241a]">
                    Tier Comparison
                  </h4>
                  <p className="mt-1 text-xs text-[#07241a]/60 hidden sm:block">
                    Compare key specifications and benefits
                  </p>
                </th>

                {/* Silver Header */}
                {showSilver && (
                  <th
                    scope="col"
                    className={`p-4 sm:p-6 align-bottom border-l border-[#096c27]/15 bg-gradient-to-b from-[#f3f8e6] to-white ${
                      mobileTab === 'both' ? 'w-[34%]' : 'w-[68%]'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-1 rounded-full bg-[#096c27]/10 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-[#096c27]">
                        <Star className="h-3 w-3" />
                        Silver Tier
                      </span>
                      <span className="rounded-full bg-white px-2 py-0.5 text-[10.5px] font-bold text-[#096c27] border border-[#096c27]/20">
                        T1
                      </span>
                    </div>

                    <h4 className="mt-2.5 font-rader text-xl sm:text-2xl font-bold text-[#07241a]">
                      Standard Room
                    </h4>
                    <p className="mt-0.5 text-xs font-semibold text-[#096c27]">
                      1 Bedroom · Couples & Kids
                    </p>
                  </th>
                )}

                {/* Gold Header */}
                {showGold && (
                  <th
                    scope="col"
                    className={`relative p-4 sm:p-6 align-bottom border-l border-[#096c27]/15 bg-gradient-to-b from-[#ffd84d]/15 via-[#b3d565]/10 to-white ${
                      mobileTab === 'both' ? 'w-[34%]' : 'w-[68%]'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-[#ffd84d] to-[#b3d565] px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-[#07241a] shadow-sm">
                        <Crown className="h-3 w-3" />
                        Gold Tier · Flagship
                      </span>
                      <span className="rounded-full bg-[#07241a] px-2 py-0.5 text-[10.5px] font-bold text-[#ffd84d]">
                        T2
                      </span>
                    </div>

                    <h4 className="mt-2.5 font-rader text-xl sm:text-2xl font-bold text-[#07241a]">
                      2-Bedroom Suite
                    </h4>
                    <p className="mt-0.5 text-xs font-semibold text-[#096c27]">
                      Spacious Suite · Families & Groups
                    </p>
                  </th>
                )}
              </tr>
            </thead>

            <tbody className="divide-y divide-[#096c27]/10 text-xs sm:text-[13.5px]">
              {rows.map((row, idx) => {
                const Icon = row.icon
                const isEven = idx % 2 === 0
                return (
                  <tr
                    key={row.label}
                    className={`transition-colors hover:bg-[#096c27]/[0.04] ${
                      isEven ? 'bg-white' : 'bg-[#fbfdfa]'
                    }`}
                  >
                    {/* Feature Label Cell */}
                    <td className="p-3.5 sm:p-4.5 pl-4 sm:pl-6 align-middle">
                      <div className="flex items-center gap-3">
                        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-[#096c27]/10 text-[#096c27]">
                          <Icon className="h-4 w-4" />
                        </span>
                        <div>
                          <p className="font-bold text-[#07241a] leading-tight">
                            {row.label}
                          </p>
                          <p className="text-[11px] text-[#07241a]/55 hidden sm:block mt-0.5">
                            {row.sub}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Silver Cell */}
                    {showSilver && (
                      <td className="p-3.5 sm:p-4.5 border-l border-[#096c27]/10 align-middle">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="font-medium text-[#07241a]">
                            {row.silver}
                          </span>
                          {row.silverBadge && (
                            <span className="rounded-full bg-[#096c27]/10 px-2 py-0.5 text-[10px] font-bold text-[#096c27]">
                              {row.silverBadge}
                            </span>
                          )}
                        </div>
                      </td>
                    )}

                    {/* Gold Cell */}
                    {showGold && (
                      <td className="p-3.5 sm:p-4.5 border-l border-[#096c27]/10 bg-[#ffd84d]/[0.03] align-middle">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="font-semibold text-[#07241a]">
                            {row.gold}
                          </span>
                          {row.goldBadge && (
                            <span className="rounded-full bg-gradient-to-r from-[#ffd84d] to-[#b3d565] px-2 py-0.5 text-[10px] font-bold text-[#07241a] shadow-sm">
                              {row.goldBadge}
                            </span>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                )
              })}
            </tbody>

            <tfoot>
              <tr className="border-t-2 border-[#096c27]/15 bg-[#fbfdfa]">
                <td className="p-4 sm:p-5 pl-4 sm:pl-6 align-middle">
                  <p className="text-xs font-bold text-[#07241a]">
                    Choose Your Experience
                  </p>
                  <p className="text-[11px] text-[#07241a]/55">
                    No-pressure consultation with our desk
                  </p>
                </td>

                {showSilver && (
                  <td className="p-4 sm:p-5 border-l border-[#096c27]/10 align-middle">
                    <button
                      type="button"
                      onClick={() => openEnquiry(t)}
                      className="group flex w-full items-center justify-between rounded-full bg-[#b3d565] py-2 pl-4 pr-1.5 text-xs font-bold text-[#07241a] transition-all hover:bg-[#07241a] hover:text-white shadow-sm"
                    >
                      <span>Inquire Silver</span>
                      <span className="grid h-7 w-7 place-items-center rounded-full bg-[#07241a] text-[#b3d565] transition-transform group-hover:rotate-45 group-hover:bg-[#b3d565] group-hover:text-[#07241a]">
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </span>
                    </button>
                  </td>
                )}

                {showGold && (
                  <td className="p-4 sm:p-5 border-l border-[#096c27]/10 bg-[#ffd84d]/[0.05] align-middle">
                    <button
                      type="button"
                      onClick={() => openEnquiry(g)}
                      className="group flex w-full items-center justify-between rounded-full bg-gradient-to-r from-[#ffd84d] to-[#b3d565] py-2 pl-4 pr-1.5 text-xs font-bold text-[#07241a] transition-all hover:scale-[1.02] shadow-md"
                    >
                      <span>Inquire Gold</span>
                      <span className="grid h-7 w-7 place-items-center rounded-full bg-[#07241a] text-[#ffd84d] transition-transform group-hover:rotate-45">
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </span>
                    </button>
                  </td>
                )}
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </Fade>
  )
}

/* ------------------------------ Cards ------------------------------ */

function MembershipCard({ cat, reduced, index }) {
  const meta = PLAN_META[cat]
  const facts = CARD_FACTS[cat]
  const isGold = cat === 'T2'
  const p10 = getPlan(cat, 10)
  const [flipped, setFlipped] = useState(false)
  const face = 'absolute inset-0 overflow-hidden rounded-[1.3rem] shadow-[0_18px_36px_-14px_rgba(7,36,26,0.55)]'
  const hide = { backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }

  return (
    <motion.article
      initial={reduced ? false : { opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8, ease: EASE, delay: index * 0.1 }}
      className="group relative flex flex-col justify-between overflow-hidden rounded-[32px] p-6 sm:p-8 transition-all duration-500 border-2 border-[#b3d565]/40 bg-gradient-to-b from-[#07241a] via-[#0c3625] to-[#061d14] text-white shadow-[0_20px_50px_-12px_rgba(7,36,26,0.35)]"
    >
      <div>
        {/* Card Header */}
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-varela text-xs font-bold bg-[#b3d565] text-[#07241a]">
              {isGold ? <Crown className="h-3.5 w-3.5" /> : <Star className="h-3.5 w-3.5" />}
              {meta.name} Privilege Pass
            </span>
          </div>
          <span className="font-varela text-xs font-semibold text-white/70">
            {meta.label}
          </span>
        </div>

        {/* 3D Flippable Card Stage */}
        <div className="mx-auto w-full max-w-[24rem] py-2" style={{ perspective: 1200 }}>
          <motion.div
            role="button"
            tabIndex={0}
            aria-label={`Flip ${meta.name} card`}
            onClick={() => setFlipped((v) => !v)}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), setFlipped((v) => !v))}
            animate={{ rotateY: flipped ? 180 : 0 }}
            transition={{ duration: reduced ? 0 : 0.8, ease: EASE }}
            style={{ transformStyle: 'preserve-3d' }}
            className="relative aspect-[1.586/1] w-full cursor-pointer focus:outline-none focus-visible:ring-4 focus-visible:ring-[#b3d565]/70 rounded-[1.3rem]"
          >
            {/* Front of Card */}
            <div aria-hidden={flipped} className={face} style={hide}>
              <img
                src={isGold ? goldCardImg : silverCardImg}
                alt={`${meta.name} Vacation Package Card`}
                className="h-full w-full object-cover"
              />
            </div>

            {/* Back of Card */}
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
                      <Check
                        className="h-3.5 w-3.5 shrink-0 text-[#b3d565]"
                        strokeWidth={3}
                        aria-hidden="true"
                      />
                      {b}
                    </li>
                  ))}
                </ul>
                <p className="m-0 px-5 pb-3 text-[10px] text-[#faf6ea]/65">
                  {meta.label} · Official CHIS Membership Card
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Interactive Flip Hint */}
        <p className="mt-3 text-center font-varela text-xs text-white/60">
          Tap card above to inspect {flipped ? 'front artwork' : 'magnetic strip & privileges'}
        </p>

        {/* Card Features & Description */}
        <div className="mt-4 text-center">
          <h3 className="m-0 font-rader text-[22px] font-bold tracking-tight text-white">
            {meta.name} Pass Benefits
          </h3>
          <p className="mb-0 mt-1.5 font-varela text-[13.5px] text-white/75">
            {facts.tagline}
          </p>

          {/* Key tags */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 font-varela text-xs">
            <span className="rounded-full px-3 py-1 font-semibold bg-white/10 text-[#b3d565]">
              6N / 7D Every Year
            </span>
            <span className="rounded-full px-3 py-1 font-semibold bg-white/10 text-white/90">
              3,500+ Resorts
            </span>
            <span className="rounded-full px-3 py-1 font-semibold bg-white/10 text-white/90">
              Zero Peak Surcharge
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3 font-varela pt-4 border-t border-white/10">
        <button
          type="button"
          aria-pressed={flipped}
          onClick={() => setFlipped((v) => !v)}
          className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-[13px] font-bold transition-all duration-300 focus:outline-none border border-white/25 text-white hover:bg-white/15"
        >
          <RotateCw className="h-3.5 w-3.5" aria-hidden="true" />
          {flipped ? 'View front design' : 'Flip to view reverse'}
        </button>

        <button
          type="button"
          onClick={() => openEnquiry(p10)}
          className={`inline-flex items-center gap-2 rounded-full px-5 py-2 text-[13px] font-bold text-[#07241a] shadow-sm transition-all hover:scale-105 ${
            isGold
              ? 'bg-gradient-to-r from-[#ffd84d] to-[#b3d565]'
              : 'bg-[#b3d565] hover:bg-white'
          }`}
        >
          {isGold ? 'Inquire for Gold Card' : 'Inquire for Silver Card'}
          <ArrowUpRight className="h-4 w-4" />
        </button>
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
                Guaranteed 6N/7D stays every year across 3,500+ resorts worldwide. Pick a tier, choose 10 or 30 years, and explore effortless luxury stays.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3.5">
                <Pill onClick={() => scrollToId('membership-tiers', reduced)}>Get started</Pill>
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
          <section id="membership-tiers" aria-labelledby="tiers-title" className="relative px-5 py-16 sm:px-8 sm:py-20 lg:px-12">
            <div className="mx-auto max-w-[1240px]">
              <SectionHead
                center
                eyebrow="Vacation packages"
                title="Choose your"
                accent="tier."
                copy="Guaranteed annual nights, zero seasonal surge, and global resort access."
              />
              <h2 id="tiers-title" className="sr-only">Choose your tier</h2>

              {/* tenure toggle */}
              <div
                role="radiogroup"
                aria-label="Vacation package tenure"
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
                eyebrow="Tier breakdown"
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
                      <p className="m-0 text-[13.5px] font-bold text-[#0b1f12]">Zero peak surcharge</p>
                      <p className="m-0 text-xs text-[#0b1f12]/60">All-season stays, no surge hikes.</p>
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
                Entitlements are summarised here. Your vacation package agreement is the final reference.
              </p>
            </div>
          </section>

          {/* ============ CARDS ============ */}
          <section id="resort-collection" aria-labelledby="cards-title" className="relative px-5 py-16 sm:px-8 sm:py-20 lg:px-12">
            <div className="mx-auto max-w-[1240px]">
              <SectionHead
                center
                eyebrow="Vacation package cards"
                title="One card, every"
                accent="arrival."
                copy="Tap a card to flip it and inspect its reverse benefits, magnetic strip, and tier privileges."
              />
              <h2 id="cards-title" className="sr-only">One card, every arrival</h2>
              <div className="mt-10 grid gap-6 md:grid-cols-2">
                <MembershipCard cat="T1" reduced={reduced} index={0} />
                <MembershipCard cat="T2" reduced={reduced} index={1} />
              </div>
              <p className="mb-0 mt-5 text-center font-varela text-xs text-[#0b1f12]/50">Physical cards issued to verified CHIS members upon plan enrollment.</p>
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
                  Our holiday desk will walk you through every tier and destination, no pressure.
                </p>
              </div>
              <Pill onClick={() => openEnquiry({ title: 'Custom Vacation Consultation' })} className="w-fit">
                Request a quote
              </Pill>
            </div>
          </div>
        </section>
      </div>
    </PageTransition>
  )
}
