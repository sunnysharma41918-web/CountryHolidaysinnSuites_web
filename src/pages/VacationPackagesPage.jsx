import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowRight, ArrowUpRight, CalendarCheck, Check, CreditCard, Globe, Headphones, ShieldCheck, Split } from 'lucide-react'
import PageTransition from '../components/layout/PageTransition'
import silverCardImg from '../assets/chis-silver-card.png'
import goldCardImg from '../assets/chis-gold-card.png'

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger)
const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect

/* Palette: cream #faf6ea · card #fffdf6 · forest #0f3d22 · deep #07241a · green #096c27 · leaf #b3d565 · ink #10201a */

const SECTIONS = [
  { id: 'top', label: 'Start' },
  { id: 'membership-pricing', label: 'Plans' },
  { id: 'compare-plans', label: 'Compare' },
  { id: 'included', label: 'Included' },
  { id: 'resort-collection', label: 'Cards' },
  { id: 'enquire', label: 'Enquire' },
]

/* darker shadows, background colour unchanged */
const SH = 'shadow-[0_28px_60px_-20px_rgba(7,36,26,0.5)]'
const SH_SM = 'shadow-[0_12px_28px_-10px_rgba(7,36,26,0.4)]'

const inr = (n) => Math.round(n).toLocaleString('en-IN')
const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
const scrollToId = (id) => document.getElementById(id)?.scrollIntoView({ behavior: reduced() ? 'auto' : 'smooth', block: 'start' })

const openEnquiry = (plan) =>
  window.dispatchEvent(
    new CustomEvent('open-booking-modal', {
      detail: {
        destination: plan ? `CHIS Membership: ${plan.title || `${plan.category} ${plan.years} Years`}` : 'CHIS Membership Enquiry',
        persons: plan ? plan.occupancy || '2 adults + 2 children' : 'Membership enquiry',
        days: '6N/7D stays',
      },
    }),
  )

/* ------------------------------ Data ------------------------------ */

const membershipPlans = [
  { id: 't1-10', category: 'T1', years: 10, priceStr: '₹4,60,000', priceNum: 460000, emiNum: 19166, asf: '₹12,000 / yr', occupancy: '2 Adults + 2 Kids (<6 yrs)', title: 'T1 Standard Room (10 Years)', description: 'Perfect for couples and young families seeking 10 consecutive years of memorable annual holidays.', perks: ['6N / 7D annual stay', 'Silver Tier lounge access', '24-month EMI facility'], tag: 'Popular for couples' },
  { id: 't1-30', category: 'T1', years: 30, priceStr: '₹7,60,000', priceNum: 760000, emiNum: 31666, asf: '₹12,000 / yr', occupancy: '2 Adults + 2 Kids (<6 yrs)', title: 'T1 Standard Room (30 Years)', description: 'Three decades of inflation-proof holiday ownership. The smart, long-term savings investment.', perks: ['30-year guaranteed vacations', 'Carry forward unused nights', 'Exchange across 3,500+ resorts'], tag: 'Best long-term value' },
  { id: 't2-10', category: 'T2', years: 10, priceStr: '₹6,60,000', priceNum: 660000, emiNum: 27500, asf: '₹15,000 / yr', occupancy: '4 Adults + 2 Kids (<6 yrs)', title: 'T2 Suite / 2-Bedroom (10 Years)', description: 'Spacious dual-bedroom suite accommodation for multi-generational families and group adventures.', perks: ['Dual private bedrooms', 'Priority high-season booking', 'Dedicated holiday manager'], tag: 'Ideal for families' },
  { id: 't2-30', category: 'T2', years: 30, priceStr: '₹9,60,000', priceNum: 960000, emiNum: 40000, asf: '₹15,000 / yr', occupancy: '4 Adults + 2 Kids (<6 yrs)', title: 'T2 Suite / 2-Bedroom (30 Years)', description: 'The definitive prestige membership. 30 years of grand suites and VIP global concierge hospitality.', perks: ['30-year suite entitlement', 'Global RCI & luxury affiliations', 'Complimentary voucher credits'], tag: 'Prestige heritage' },
]
const getPlan = (cat, years) => membershipPlans.find((p) => p.category === cat && p.years === years)

const PLAN_META = {
  T1: { name: 'Silver', label: 'T1 · Standard Room', cta: 'Choose Silver' },
  T2: { name: 'Gold', label: 'T2 · 2-Bedroom Suite', cta: 'Choose Gold' },
}

const INCLUDED = [
  { icon: CalendarCheck, title: 'Carry nights forward', desc: 'Roll unused nights into later holiday years.' },
  { icon: Split, title: 'Split into short breaks', desc: 'Turn 6N/7D into several quick getaways.' },
  { icon: Globe, title: 'Exchange at 3,500+ resorts', desc: 'Stay across a global network of destinations.' },
  { icon: CreditCard, title: '24-month EMI', desc: 'Lock today’s price and pay in easy instalments.' },
  { icon: Headphones, title: '24/7 concierge', desc: 'Itineraries, transfers and check-ins handled.' },
]

const CARD_FACTS = {
  T1: {
    face: 'bg-gradient-to-br from-[#fffdf6] via-[#e6eed3] to-[#b9c9a0] text-[#10201a]',
    chip: 'from-[#d7dfc7] to-[#8fa07a]',
    tagline: 'Standard room for couples and young families.',
    back: ['6N / 7D every year', 'Carry forward & split nights', 'Exchange across 3,500+ resorts', '24-month EMI facility'],
  },
  T2: {
    face: 'bg-gradient-to-br from-[#0b2a1a] via-[#0f3d22] to-[#1f6b3a] text-[#faf6ea]',
    chip: 'from-[#f0e3b0] to-[#b89a4a]',
    tagline: 'Two-bedroom suite for the whole family.',
    back: ['6N / 7D in a 2-bedroom suite', 'Priority high-season booking', 'Dedicated holiday manager', 'Exchange across 3,500+ resorts'],
  },
}

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,500;1,600&display=swap');
.cv-display { font-family: 'Cormorant Garamond', Georgia, 'Times New Roman', serif; }
@keyframes cv-shine { to { background-position: -200% 0; } }
.cv-shimmer { background: linear-gradient(90deg,#096c27 0%,#7fb83a 50%,#096c27 100%); background-size: 200% 100%;
  -webkit-background-clip: text; background-clip: text; color: transparent; animation: cv-shine 4.5s linear infinite; }
.cv-shimmer-hero { background: linear-gradient(90deg,#b3d565 0%,#ffffff 50%,#b3d565 100%); background-size: 200% 100%;
  -webkit-background-clip: text; background-clip: text; color: transparent; animation: cv-shine 4.5s linear infinite; }
@keyframes cv-drift-a { 0%,100% { transform: translate3d(0,0,0) scale(1); } 50% { transform: translate3d(5%,7%,0) scale(1.12); } }
@keyframes cv-drift-b { 0%,100% { transform: translate3d(0,0,0) scale(1); } 50% { transform: translate3d(-7%,-5%,0) scale(1.15); } }
.cv-drift-a { animation: cv-drift-a 18s ease-in-out infinite; }
.cv-drift-b { animation: cv-drift-b 23s ease-in-out infinite; }
.cv-grain::after { content:''; position:absolute; inset:0; pointer-events:none; opacity:.06; mix-blend-mode:multiply;
  background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>"); }
@media (prefers-reduced-motion: reduce) {
  .cv-shimmer { animation: none; background: none; color: #096c27; -webkit-text-fill-color: #096c27; }
  .cv-shimmer-hero { animation: none; background: none; color: #b3d565; -webkit-text-fill-color: #b3d565; }
  .cv-drift-a, .cv-drift-b { animation: none !important; }
}
`

/* ---------------------------- Small pieces ---------------------------- */

function Magnetic({ children, strength = 0.3 }) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el || reduced() || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return undefined
    const xTo = gsap.quickTo(el, 'x', { duration: 0.7, ease: 'elastic.out(1, 0.45)' })
    const yTo = gsap.quickTo(el, 'y', { duration: 0.7, ease: 'elastic.out(1, 0.45)' })
    const move = (e) => {
      const r = el.getBoundingClientRect()
      xTo((e.clientX - (r.left + r.width / 2)) * strength)
      yTo((e.clientY - (r.top + r.height / 2)) * strength)
    }
    const leave = () => { xTo(0); yTo(0) }
    el.addEventListener('mousemove', move)
    el.addEventListener('mouseleave', leave)
    return () => {
      el.removeEventListener('mousemove', move)
      el.removeEventListener('mouseleave', leave)
      gsap.killTweensOf(el)
      gsap.set(el, { x: 0, y: 0 })
    }
  }, [strength])
  return <div ref={ref} className="inline-block">{children}</div>
}

function Price({ value }) {
  const ref = useRef(null)
  const prev = useRef(value)
  const [initial] = useState(value)
  useEffect(() => {
    const el = ref.current
    if (!el) return undefined
    if (reduced()) { el.textContent = `₹${inr(value)}`; prev.current = value; return undefined }
    const o = { v: prev.current }
    const tween = gsap.to(o, { v: value, duration: 0.9, ease: 'power3.out', onUpdate: () => { el.textContent = `₹${inr(o.v)}` } })
    prev.current = value
    return () => tween.kill()
  }, [value])
  return <span ref={ref}>₹{inr(initial)}</span>
}

/** Pill button with a circular arrow. */
function Pill({ children, onClick, dark, large, className = '' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group/btn inline-flex items-center gap-3 rounded-full ${large ? 'py-2 pl-8 pr-2 text-base' : 'py-1.5 pl-6 pr-1.5 text-sm'} font-semibold ${SH_SM} transition-transform hover:scale-[1.02] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#096c27] focus-visible:ring-offset-2 ${dark ? 'bg-[#b3d565] text-[#0b2a1a]' : 'bg-[#0f3d22] text-[#faf6ea]'} ${className}`}
    >
      {children}
      <span className={`grid ${large ? 'h-11 w-11' : 'h-9 w-9'} place-items-center rounded-full transition-transform duration-500 group-hover/btn:rotate-45 ${dark ? 'bg-[#0b2a1a] text-[#b3d565]' : 'bg-[#b3d565] text-[#0f3d22]'}`}>
        <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
      </span>
    </button>
  )
}

/** Every section is responsive and never clips card content. */
function Sec({ id, labelledby, className = '', children }) {
  return (
    <section id={id} data-sec aria-labelledby={labelledby} className={`relative flex min-h-[100svh] w-full flex-col justify-center py-16 sm:py-20 lg:py-24 ${className}`}>
      <div className="mx-auto flex h-full w-full max-w-[76rem] flex-col justify-center px-5 sm:px-8">{children}</div>
    </section>
  )
}

function Head({ id, title, sub }) {
  return (
    <div className="shrink-0 text-center">
      <h2 id={id} data-fade className="cv-display text-[clamp(2rem,5.2vw,4rem)] font-semibold leading-none tracking-[-0.02em] text-[#0f3d22]">{title}</h2>
      {sub && <p data-fade className="mx-auto mt-2 max-w-md text-[13px] text-[#10201a]/65 sm:mt-3 sm:text-sm">{sub}</p>}
    </div>
  )
}

/* ------------------------------ Plans ------------------------------ */

function PlanCard({ cat, years }) {
  const p = getPlan(cat, years)
  const meta = PLAN_META[cat]
  const dark = true
  const ref = useRef(null)
  const muted = 'text-[#faf6ea]/65'

  const onMove = (e) => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    el.style.setProperty('--mx', `${e.clientX - r.left}px`)
    el.style.setProperty('--my', `${e.clientY - r.top}px`)
  }

  return (
    <article
      ref={ref}
      data-rise
      data-plan
      onMouseMove={onMove}
      className={`group relative isolate flex flex-col justify-between rounded-[2rem] p-6 sm:p-7 lg:p-8 ${SH} bg-[#0b2a1a] text-[#faf6ea] ring-1 ring-[#b3d565]/20 transition-all duration-300 hover:ring-[#b3d565]/40`}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            'radial-gradient(420px circle at var(--mx,50%) var(--my,0%), rgba(179,213,101,0.16), transparent 60%)',
        }}
      />

      {/* Top Content */}
      <div>
        {/* Tier Header with Room Label & Tag */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <span
              className={`inline-block text-[11px] sm:text-xs font-bold uppercase tracking-wider ${
                dark ? 'text-[#b3d565]' : 'text-[#096c27]'
              }`}
            >
              {meta.label}
            </span>
            <h3 className="cv-display mt-0.5 text-3xl font-semibold leading-none sm:text-4xl lg:text-5xl">
              {meta.name}
            </h3>
          </div>
          <span
            className={`shrink-0 rounded-full border px-3 py-1 text-[11px] font-semibold tracking-wide ${
              dark
                ? 'border-[#b3d565]/40 bg-[#b3d565]/10 text-[#b3d565]'
                : 'border-[#096c27]/30 bg-[#096c27]/5 text-[#096c27]'
            }`}
          >
            {p.tag}
          </span>
        </div>

        {/* Pricing Block */}
        <div
          className={`mt-4 border-y py-3.5 ${
            dark ? 'border-white/10' : 'border-[#10201a]/10'
          }`}
        >
          <div className="flex items-baseline gap-2">
            <span
              className="font-sans text-[clamp(2.1rem,4.5vw,3.25rem)] font-bold leading-none tracking-tight"
              style={{ fontFeatureSettings: '"tnum"' }}
            >
              <Price value={p.priceNum} />
            </span>
            <span className={`text-xs sm:text-sm font-medium ${muted}`}>
              / {years} years
            </span>
          </div>
          <p className={`mt-1.5 text-xs sm:text-sm ${muted}`}>
            EMI available from{' '}
            <strong className={`font-semibold ${dark ? 'text-white' : 'text-slate-900'}`}>
              ₹{inr(p.emiNum)}/month
            </strong>
          </p>
        </div>

        {/* Description */}
        <p
          className={`mt-3 text-xs sm:text-sm leading-relaxed ${
            dark ? 'text-[#faf6ea]/80' : 'text-[#10201a]/75'
          }`}
        >
          {p.description}
        </p>

        {/* Perks List */}
        <ul className="mt-3.5 space-y-2">
          {p.perks.map((perk) => (
            <li key={perk} className="flex items-center gap-2.5 text-xs sm:text-sm">
              <span
                className={`grid h-5 w-5 shrink-0 place-items-center rounded-full ${
                  dark ? 'bg-[#b3d565] text-[#0b2a1a]' : 'bg-[#096c27] text-[#faf6ea]'
                }`}
              >
                <Check className="h-3 w-3 stroke-[2.5]" aria-hidden="true" />
              </span>
              <span className="leading-snug">{perk}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Bottom Specs & Action */}
      <div className={`mt-4 border-t pt-3.5 ${dark ? 'border-white/10' : 'border-[#10201a]/10'}`}>
        <dl className="grid grid-cols-2 gap-3 text-xs sm:text-sm">
          <div>
            <dt className={`text-[11px] font-medium uppercase tracking-wider ${muted}`}>
              Occupancy
            </dt>
            <dd className="mt-0.5 font-semibold">{p.occupancy}</dd>
          </div>
          <div>
            <dt className={`text-[11px] font-medium uppercase tracking-wider ${muted}`}>
              Annual fee
            </dt>
            <dd className="mt-0.5 font-semibold">{p.asf}</dd>
          </div>
        </dl>
        <div className="mt-5">
          <Pill dark={dark} onClick={() => openEnquiry(p)} className="w-full justify-between">
            {meta.cta}
          </Pill>
        </div>
      </div>
    </article>
  )
}

/* ------------------------------ Compare ------------------------------ */

function CompareTable() {
  const t = [getPlan('T1', 10), getPlan('T1', 30)]
  const g = [getPlan('T2', 10), getPlan('T2', 30)]
  const short = (o) => o.replace('(<6 yrs)', '(<6)')
  const rows = [
    ['Room', 'Standard · 1 bedroom', 'Suite · 2 bedrooms'],
    ['Guests', short(t[0].occupancy), short(g[0].occupancy)],
    ['10 years', `${t[0].priceStr} · EMI ₹${inr(t[0].emiNum)}`, `${g[0].priceStr} · EMI ₹${inr(g[0].emiNum)}`],
    ['30 years', `${t[1].priceStr} · EMI ₹${inr(t[1].emiNum)}`, `${g[1].priceStr} · EMI ₹${inr(g[1].emiNum)}`],
    ['Annual fee', t[0].asf, g[0].asf],
    ['Extras', 'Lounge access, transfer rights', 'Priority booking, holiday manager'],
    ['Best for', 'Couples, young kids', 'Grandparents, bigger groups'],
  ]
  const last = rows.length - 1
  return (
    <div data-rise className="mt-5 grid min-h-0 flex-1 grid-cols-[0.55fr_1fr_1fr] gap-x-2 text-[12px] sm:mt-7 sm:grid-cols-[0.6fr_1fr_1fr] sm:gap-x-3 sm:text-sm">
      <div />
      <div className={`flex items-center justify-between rounded-t-[1.25rem] border border-b-0 border-[#10201a]/10 bg-[#fffdf6] px-3 py-3 sm:px-5 ${SH_SM}`}>
        <span className="cv-display text-2xl font-semibold text-[#0f3d22] sm:text-4xl">Silver</span>
        <span className="hidden text-xs text-[#10201a]/55 sm:block">T1</span>
      </div>
      <div className={`flex items-center justify-between rounded-t-[1.25rem] bg-[#0b2a1a] px-3 py-3 text-[#faf6ea] sm:px-5 ${SH_SM}`}>
        <span className="cv-display text-2xl font-semibold sm:text-4xl">Gold</span>
        <span className="hidden text-xs text-[#b3d565] sm:block">T2</span>
      </div>
      {rows.map(([k, a, b], i) => (
        <div key={k} className="contents">
          <div className="flex items-center border-t border-[#10201a]/10 py-2 pr-2 font-medium text-[#10201a]/60">{k}</div>
          <div className={`flex items-center border-x border-t border-[#10201a]/10 bg-[#fffdf6] px-3 py-2 font-medium text-[#10201a] sm:px-5 ${i === last ? `rounded-b-[1.25rem] border-b ${SH}` : ''}`}>{a}</div>
          <div className={`flex items-center border-t border-white/10 bg-[#0b2a1a] px-3 py-2 font-medium text-[#faf6ea] sm:px-5 ${i === last ? `rounded-b-[1.25rem] ${SH}` : ''}`}>{b}</div>
        </div>
      ))}
    </div>
  )
}

/* ------------------------------ Cards ------------------------------ */

function MembershipCard({ cat }) {
  const meta = PLAN_META[cat]
  const facts = CARD_FACTS[cat]
  const dark = cat === 'T2'
  const p10 = getPlan(cat, 10)
  const [flipped, setFlipped] = useState(false)
  const tiltRef = useRef(null)

  useEffect(() => {
    const el = tiltRef.current
    if (!el || reduced() || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return undefined
    gsap.set(el, { transformPerspective: 1100 })
    const rx = gsap.quickTo(el, 'rotationX', { duration: 0.6, ease: 'power3.out' })
    const ry = gsap.quickTo(el, 'rotationY', { duration: 0.6, ease: 'power3.out' })
    const move = (e) => {
      const r = el.getBoundingClientRect()
      const nx = (e.clientX - r.left) / r.width
      const ny = (e.clientY - r.top) / r.height
      ry((nx - 0.5) * 14)
      rx(-(ny - 0.5) * 14)
      el.style.setProperty('--sx', `${nx * 100}%`)
      el.style.setProperty('--sy', `${ny * 100}%`)
    }
    const leave = () => { rx(0); ry(0) }
    el.addEventListener('pointermove', move)
    el.addEventListener('pointerleave', leave)
    return () => {
      el.removeEventListener('pointermove', move)
      el.removeEventListener('pointerleave', leave)
      gsap.killTweensOf(el)
    }
  }, [])

  const faceBase = `absolute inset-0 overflow-hidden rounded-[1.4rem] border border-black/10 ${SH} [backface-visibility:hidden]`
  const hide = { WebkitBackfaceVisibility: 'hidden' }
  const sheen = { background: 'radial-gradient(380px circle at var(--sx,30%) var(--sy,0%), rgba(255,255,255,0.28), transparent 55%)' }
  const muted = dark ? 'text-[#faf6ea]/65' : 'text-[#10201a]/60'

  return (
    <div data-rise className="flex min-h-0 flex-col items-center">
      <div ref={tiltRef} className="group [transform-style:preserve-3d]" style={{ width: 'min(100%, 27rem, 48svh)' }}>
        <div
          onClick={() => setFlipped((v) => !v)}
          className="relative aspect-[1.586/1] w-full cursor-pointer transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] [transform-style:preserve-3d]"
          style={{ transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
        >
          <div aria-hidden={flipped} className={`${faceBase} bg-black/5`} style={hide}>
            <img
              src={cat === 'T1' ? silverCardImg : goldCardImg}
              alt={`${meta.name} Membership Card`}
              className="h-full w-full rounded-[1.4rem] object-cover"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 rounded-[1.4rem] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              style={sheen}
            />
          </div>

          <div aria-hidden={!flipped} className={`${faceBase} ${facts.face} [transform:rotateY(180deg)]`} style={hide}>
            <div className="relative flex h-full flex-col">
              <div aria-hidden="true" className="mt-4 h-6 w-full bg-[#07241a] sm:mt-5 sm:h-8" />
              <ul className="flex-1 space-y-1 px-4 pt-2 text-[11px] font-medium leading-tight sm:space-y-2 sm:px-6 sm:pt-4 sm:text-xs">
                {facts.back.map((b) => (
                  <li key={b} className="flex items-center gap-2">
                    <Check className={`h-3.5 w-3.5 shrink-0 ${dark ? 'text-[#b3d565]' : 'text-[#096c27]'}`} strokeWidth={3} aria-hidden="true" />
                    {b}
                  </li>
                ))}
              </ul>
              <p className={`px-4 pb-3 text-[10px] sm:px-6 ${muted}`}>Annual fee {p10.asf} · Sample card design</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 text-center sm:mt-6">
        <h3 className="cv-display text-2xl font-semibold text-[#0f3d22] sm:text-3xl">{meta.name} card</h3>
        <p className="mt-0.5 hidden text-sm text-[#10201a]/65 sm:block">{facts.tagline}</p>
        <div className="mt-3 flex flex-wrap items-center justify-center gap-2 sm:mt-4 sm:gap-3">
          <button
            type="button"
            aria-pressed={flipped}
            onClick={() => setFlipped((v) => !v)}
            className="rounded-full border border-[#0f3d22]/30 px-5 py-2 text-sm font-semibold text-[#0f3d22] transition-colors hover:bg-[#0f3d22] hover:text-[#faf6ea] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#096c27]"
          >
            {flipped ? 'Show front' : 'Flip card'}
          </button>
          <Pill onClick={() => openEnquiry(p10)}>Get this card</Pill>
        </div>
      </div>
    </div>
  )
}

/* ------------------------------ Page ------------------------------ */

export default function VacationPackagesPage() {
  const rootRef = useRef(null)
  const [years, setYears] = useState(10)
  const [active, setActive] = useState(0)

  useIsoLayoutEffect(() => {
    const root = rootRef.current
    if (!root) return undefined
    const $ = (s) => gsap.utils.toArray(s, root)
    const mm = gsap.matchMedia(root)

    /* active section tracking works with or without motion */
    const spy = $('[data-sec]').map((el, i) =>
      ScrollTrigger.create({ trigger: el, start: 'top 55%', end: 'bottom 55%', onToggle: (s) => s.isActive && setActive(i) }),
    )

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.set('[data-progress]', { scaleX: 0, transformOrigin: '0% 50%' })
      gsap.to('[data-progress]', { scaleX: 1, ease: 'none', scrollTrigger: { trigger: root, start: 'top top', end: 'bottom bottom', scrub: 0.3 } })

      /* hero intro: the one orchestrated moment */
      gsap
        .timeline({ defaults: { ease: 'expo.out' }, delay: 0.1 })
        .from('[data-hw]', { yPercent: 115, rotate: 3, duration: 1.3, stagger: 0.08 })
        .from('[data-hero-fade]', { y: 20, opacity: 0, duration: 1, stagger: 0.1 }, '-=0.8')
        .from('[data-chip]', { scale: 0.4, opacity: 0, duration: 1.1, ease: 'back.out(1.6)', stagger: 0.12 }, '-=0.9')

      $('[data-float]').forEach((el, i) => gsap.to(el, { y: i % 2 ? -14 : 14, duration: 2.6 + i * 0.4, repeat: -1, yoyo: true, ease: 'sine.inOut' }))

      const heroEl = root.querySelector('[data-hero]')
      let cleanupPointer = () => { }
      if (heroEl && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
        const setters = $('[data-depth]').map((el) => ({
          x: gsap.quickTo(el, 'x', { duration: 1, ease: 'power3.out' }),
          y: gsap.quickTo(el, 'y', { duration: 1, ease: 'power3.out' }),
          d: Number(el.dataset.depth),
        }))
        const onMove = (e) => {
          const r = heroEl.getBoundingClientRect()
          const nx = (e.clientX - r.left) / r.width - 0.5
          const ny = (e.clientY - r.top) / r.height - 0.5
          setters.forEach((s) => { s.x(nx * s.d); s.y(ny * s.d) })
        }
        heroEl.addEventListener('pointermove', onMove)
        cleanupPointer = () => heroEl.removeEventListener('pointermove', onMove)
      }

      gsap.to('[data-blob]', { yPercent: 25, ease: 'none', scrollTrigger: { trigger: heroEl, start: 'top top', end: 'bottom top', scrub: true } })

      /* section content reveals once as each viewport arrives */
      const fades = $('[data-fade]')
      gsap.set(fades, { opacity: 0, y: 24 })
      ScrollTrigger.batch(fades, { start: 'top 92%', once: true, onEnter: (b) => gsap.to(b, { opacity: 1, y: 0, duration: 1, ease: 'expo.out', stagger: 0.1 }) })

      const rise = $('[data-rise]')
      gsap.set(rise, { opacity: 0, y: 50 })
      ScrollTrigger.batch(rise, { start: 'top 92%', once: true, onEnter: (b) => gsap.to(b, { opacity: 1, y: 0, duration: 1.2, ease: 'expo.out', stagger: 0.14 }) })

      return () => cleanupPointer()
    })

    const refresh = () => ScrollTrigger.refresh()
    window.addEventListener('load', refresh)
    const t = setTimeout(refresh, 700)
    return () => {
      clearTimeout(t)
      window.removeEventListener('load', refresh)
      spy.forEach((s) => s.kill())
      mm.revert()
    }
  }, [])

  const first = useRef(true)
  useEffect(() => {
    if (first.current) { first.current = false; return }
    if (reduced()) return
    gsap.fromTo('[data-plan]', { y: 14, scale: 0.985 }, { y: 0, scale: 1, duration: 0.7, ease: 'expo.out', stagger: 0.08, overwrite: 'auto' })
  }, [years])

  const chip = (depth, pos, text) => (
    <div data-depth={depth} className={`pointer-events-none absolute hidden md:block ${pos}`} aria-hidden="true">
      <div data-chip>
        <div data-float className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/95 px-5 py-2.5 text-xs font-semibold text-[#096c27] shadow-[0_12px_28px_-8px_rgba(4,30,12,0.45)] backdrop-blur sm:text-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-[#096c27]" />
          {text}
        </div>
      </div>
    </div>
  )

  return (
    <PageTransition>
      <div ref={rootRef} className="relative w-full overflow-x-clip bg-[#faf6ea] font-sans text-[#10201a] antialiased selection:bg-[#b3d565] selection:text-[#10201a]">
        <style>{CSS}</style>
        <div data-progress aria-hidden="true" className="fixed inset-x-0 top-0 z-[70] h-[3px] bg-[#096c27]" />

        {/* side navigation */}
        <nav aria-label="Page sections" className="fixed right-4 top-1/2 z-[60] hidden -translate-y-1/2 flex-col items-end gap-3 lg:flex">
          {SECTIONS.map((s, i) => (
            <button
              key={s.id}
              type="button"
              onClick={() => scrollToId(s.id)}
              aria-label={`Go to ${s.label}`}
              aria-current={active === i}
              className="group flex items-center gap-3 focus:outline-none"
            >
              <span className={`text-xs font-semibold ${active === 0 ? 'text-white' : 'text-[#0f3d22]'} transition-all duration-300 ${active === i ? 'translate-x-0 opacity-100' : 'translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:opacity-100'}`}>{s.label}</span>
              <span className={`block rounded-full ${active === 0 ? 'bg-white' : 'bg-[#0f3d22]'} shadow-[0_2px_6px_rgba(7,36,26,0.4)] transition-all duration-300 group-focus-visible:ring-2 group-focus-visible:ring-[#096c27] ${active === i ? 'h-7 w-2' : 'h-2 w-2 opacity-40 group-hover:opacity-100'}`} />
            </button>
          ))}
        </nav>

        {/* ============ HERO ============ */}
        <section id="top" data-sec data-hero aria-labelledby="hero-title" className="cv-grain relative isolate flex h-[100svh] flex-col overflow-hidden bg-[#096c27] text-center text-white">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
            <div data-blob className="absolute inset-0">
              <div className="cv-drift-a absolute -left-[15%] -top-[20%] h-[55vw] w-[55vw] rounded-full bg-[#b3d565]/20 blur-3xl" />
              <div className="cv-drift-b absolute -right-[10%] top-[10%] h-[45vw] w-[45vw] rounded-full bg-[#054016]/75 blur-3xl" />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,#054016_0%,transparent_60%)]" />
            </div>
          </div>
          {chip(40, 'left-[6%] top-[34%] lg:left-[10%]', '6N / 7D every year')}
          {chip(-30, 'right-[6%] top-[26%] lg:right-[10%]', '3,500+ resorts')}
          {chip(25, 'right-[12%] top-[62%] lg:right-[16%]', '24-month EMI')}
          {chip(-45, 'left-[10%] top-[66%] lg:left-[15%]', 'Fixed tariffs')}

          <div className="relative mx-auto flex min-h-0 w-full max-w-4xl flex-1 flex-col justify-center px-5 pt-16 sm:px-8">
            <h1 id="hero-title" className="cv-display text-[clamp(3rem,10.5vw,8.5rem)] font-semibold leading-[0.95] tracking-[-0.02em] text-white">
              {['Vacation', 'Packages'].map((w, i) => (
                <span key={w} className="block overflow-hidden pb-[0.12em]">
                  <span data-hw className={`inline-block ${i ? 'cv-shimmer-hero italic' : ''}`}>{w}</span>
                </span>
              ))}
            </h1>
            <p data-hero-fade className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-white/85 sm:text-lg">
              Guaranteed 6N/7D stays every year across 3,500+ resorts. Pick a tier, choose 10 or 30 years, and pay in 24-month EMIs.
            </p>
            <div data-hero-fade className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Magnetic>
                <Pill large dark onClick={() => scrollToId('membership-pricing')}>
                  <span>Get started</span>
                </Pill>
              </Magnetic>
              <Magnetic strength={0.2}>
                <button
                  type="button"
                  onClick={() => openEnquiry()}
                  className="rounded-full border border-white/40 px-8 py-3.5 text-base font-semibold text-white transition-colors hover:border-[#b3d565] hover:bg-white/10 hover:text-[#b3d565] focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  Talk to our desk
                </button>
              </Magnetic>
            </div>
          </div>
        </section>

        {/* ============ PLANS ============ */}
        <Sec id="membership-pricing" labelledby="pricing-title">
          <Head id="pricing-title" title="Choose your tier" sub="Guaranteed nights, zero seasonal surge, and a price that stays put." />
          <div data-fade role="radiogroup" aria-label="Membership tenure" className={`relative mx-auto mt-4 grid w-full max-w-sm shrink-0 grid-cols-2 rounded-full bg-[#ebe5d0] p-1 shadow-[inset_0_2px_6px_rgba(7,36,26,0.18)]`}>
            <span
              aria-hidden="true"
              className={`absolute inset-y-1 left-1 w-[calc(50%-0.25rem)] rounded-full bg-[#0f3d22] ${SH_SM} transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]`}
              style={{ transform: years === 30 ? 'translateX(100%)' : 'translateX(0)' }}
            />
            {[{ y: 10, label: '10 years' }, { y: 30, label: '30 years · best value' }].map(({ y, label }) => (
              <button
                key={y}
                type="button"
                role="radio"
                aria-checked={years === y}
                onClick={() => setYears(y)}
                className={`relative z-10 rounded-full px-3 py-2.5 text-xs font-semibold transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#096c27] sm:text-sm ${years === y ? 'text-[#faf6ea]' : 'text-[#10201a]/70'}`}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="mt-8 grid w-full grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8" aria-live="polite">
            <PlanCard cat="T1" years={years} />
            <PlanCard cat="T2" years={years} />
          </div>
        </Sec>

        {/* ============ COMPARE ============ */}
        <Sec id="compare-plans" labelledby="compare-title">
          <Head id="compare-title" title="Compare plans" sub="Same promise, two sizes. Here is what changes between Silver and Gold." />
          <CompareTable />
        </Sec>

        {/* ============ INCLUDED ============ */}
        <Sec id="included" labelledby="included-title">
          <div className="flex min-h-0 flex-1 flex-col justify-center">
            <div className="shrink-0 text-center">
              <h2 id="included-title" data-fade className="cv-display text-[clamp(2rem,5.2vw,4rem)] font-semibold leading-none tracking-[-0.02em] text-[#0f3d22]">
                Included with <span className="cv-shimmer italic">every plan</span>
              </h2>
              <p data-fade className="mx-auto mt-2 max-w-lg text-[13px] text-[#10201a]/65 sm:mt-3 sm:text-sm">Silver or Gold, 10 or 30 years: these come standard.</p>
            </div>
            <div data-rise className={`mx-auto mt-5 flex w-fit max-w-full shrink-0 items-center gap-3 rounded-2xl border border-[#096c27]/20 bg-white/90 p-3 sm:mt-6 ${SH_SM}`}>
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#096c27] text-[#b3d565]"><ShieldCheck className="h-5 w-5" aria-hidden="true" /></span>
              <div className="text-left">
                <p className="text-sm font-semibold text-[#0f3d22]">Tariff locked</p>
                <p className="text-xs text-[#10201a]/65">No inflation, no surge pricing.</p>
              </div>
            </div>
            <div className="mt-5 grid min-h-0 grid-cols-1 gap-3 sm:mt-7 sm:grid-cols-2 lg:grid-cols-5 lg:gap-4">
              {INCLUDED.map(({ icon: Icon, title, desc }) => (
                <div key={title} data-rise className={`group flex items-center gap-4 rounded-2xl border border-[#096c27]/15 bg-white p-3 transition-transform duration-300 hover:-translate-y-1.5 sm:p-4 lg:flex-col lg:items-start lg:gap-5 lg:p-5 ${SH_SM}`}>
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[#f3f8e6] text-[#096c27] transition-colors duration-300 group-hover:bg-[#096c27] group-hover:text-[#b3d565] lg:h-12 lg:w-12">
                    <Icon className="h-5 w-5 lg:h-6 lg:w-6" aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className="text-sm font-semibold leading-snug text-[#0f3d22] sm:text-base">{title}</h3>
                    <p className="mt-1 hidden text-sm leading-relaxed text-[#10201a]/70 sm:block">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <p data-fade className="mt-5 shrink-0 text-center text-xs text-[#10201a]/55">
              Entitlements are summarised here. Your membership agreement is the final reference.
            </p>
          </div>
        </Sec>

        {/* ============ CARDS ============ */}
        <Sec id="resort-collection" labelledby="cards-title">
          <Head id="cards-title" title={<>One card, every <span className="italic">arrival</span></>} sub="Tap a card to flip it and see what it carries." />
          <div className="mt-5 grid min-h-0 flex-1 grid-rows-2 place-items-center gap-3 lg:grid-cols-2 lg:grid-rows-1 lg:gap-8">
            <MembershipCard cat="T1" />
            <MembershipCard cat="T2" />
          </div>
          <p className="mt-2 shrink-0 text-center text-xs text-[#10201a]/55">Card designs shown are illustrative.</p>
        </Sec>

        {/* ============ CTA ============ */}
        <Sec id="enquire" labelledby="cta-title">
          <div className="mx-auto w-full max-w-[56rem]">
            <h2 id="cta-title" data-fade className="cv-display text-center text-[clamp(2.5rem,8vw,6.5rem)] font-semibold leading-[0.95] tracking-[-0.02em] text-[#0f3d22]">
              Let’s plan your next <span className="cv-shimmer italic">30 years</span> of travel.
            </h2>
            <div data-rise className={`mt-10 flex flex-wrap items-center gap-5 rounded-[2rem] bg-[#0f3d22] p-6 text-[#faf6ea] sm:p-10 ${SH}`}>
              <div className="flex-1">
                <p className="cv-display text-3xl font-semibold sm:text-4xl">Still deciding?</p>
                <p className="mt-2 text-sm text-[#faf6ea]/75">Our holiday desk will walk you through the numbers, no pressure.</p>
              </div>
              <Magnetic strength={0.25}>
                <Pill dark onClick={() => openEnquiry({ title: 'Custom Vacation Consultation' })}>Request a quote</Pill>
              </Magnetic>
            </div>
          </div>
        </Sec>
      </div>
    </PageTransition>
  )
}