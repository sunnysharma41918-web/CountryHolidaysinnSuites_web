import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { ArrowUpRight, Check, CreditCard, Info } from 'lucide-react'
import { emiNote, membershipPlans, openEnquiry, pricingNotice, PRICING_ID } from './content'

gsap.registerPlugin(ScrollTrigger, SplitText)

/* ------------------------------------------------------------------
   Field adapter: the card reads your plan objects through this one
   function. If your fields have other names, add them to the lists.
------------------------------------------------------------------- */
const pick = (o, keys) => {
  for (const k of keys) if (o?.[k] !== undefined && o?.[k] !== null && o?.[k] !== '') return o[k]
  return undefined
}

const asText = (v) => (typeof v === 'object' && v ? pick(v, ['text', 'label', 'title', 'name']) : v)

function normalize(plan) {
  const features = pick(plan, ['features', 'benefits', 'highlights', 'includes', 'inclusions', 'points'])
  const badge = pick(plan, ['badge', 'tag', 'ribbon']) ?? (plan.popular || plan.featured || plan.recommended ? 'Most popular' : undefined)
  return {
    id: plan.id,
    name: pick(plan, ['name', 'title', 'plan', 'tier', 'label']),
    tenure: pick(plan, ['years', 'tenure', 'duration', 'term', 'period']),
    category: pick(plan, ['category', 'roomType', 'apartment', 'unit', 'type']),
    price: pick(plan, ['price', 'amount', 'cost', 'total', 'fee']),
    emi: pick(plan, ['emi', 'emiAmount', 'monthly', 'perMonth', 'emiPrice']),
    note: pick(plan, ['note', 'description', 'subtitle', 'summary']),
    features: Array.isArray(features) ? features.map(asText).filter(Boolean) : [],
    badge: typeof badge === 'string' ? badge : badge ? 'Most popular' : undefined,
    featured: Boolean(badge),
  }
}

// "Rs 1,25,000" or 125000 -> { prefix:'Rs ', num:125000, suffix:'' }
function parsePrice(v) {
  if (typeof v === 'number') return { prefix: 'Rs ', num: v, suffix: '', text: `Rs ${v.toLocaleString('en-IN')}` }
  if (typeof v !== 'string') return null
  const m = v.match(/^([^\d]*)([\d,]+(?:\.\d+)?)(.*)$/)
  if (!m) return { text: v }
  return { prefix: m[1], num: Number(m[2].replace(/,/g, '')), suffix: m[3], text: v }
}

const fmt = (n) => Math.round(n).toLocaleString('en-IN')

// Cursor-following light on a card
const spot = (e) => {
  const r = e.currentTarget.getBoundingClientRect()
  e.currentTarget.style.setProperty('--sx', `${e.clientX - r.left}px`)
  e.currentTarget.style.setProperty('--sy', `${e.clientY - r.top}px`)
}

function PlanCard({ plan }) {
  const p = normalize(plan)
  const price = parsePrice(p.price)

  return (
    <div className="relative h-full overflow-hidden rounded-[2rem] p-[1.5px]">
      {/* border: rotating light for the featured plan, soft line for the rest */}
      {p.featured ? (
        <span
          aria-hidden="true"
          className="mp-spin absolute -inset-[80%] bg-[conic-gradient(from_0deg,transparent_0_55%,#ff5938_80%,transparent_100%)]"
        />
      ) : (
        <span aria-hidden="true" className="absolute inset-0 bg-slate-950/[0.08]" />
      )}

      <div
        onMouseMove={spot}
        className="mp-card relative flex h-full flex-col rounded-[calc(2rem-1.5px)] bg-white p-6 text-slate-950 shadow-[0_16px_40px_-28px_rgba(0,0,0,0.3)] sm:p-7"
      >
        {p.badge && (
          <span
            data-badge
            className="absolute right-5 top-5 rounded-full bg-[#ff5938] px-3 py-1 text-xs font-semibold text-slate-950"
          >
            {p.badge}
          </span>
        )}

        {p.tenure !== undefined && (
          <span className="inline-flex w-fit items-center rounded-full border border-slate-950/20 px-3 py-1 text-sm text-slate-600">
            {typeof p.tenure === 'number' ? `${p.tenure} years` : p.tenure}
          </span>
        )}

        <h3 className="mt-5 pr-16 font-sans text-2xl font-semibold uppercase leading-[0.95] tracking-[-0.04em] sm:text-[1.7rem]">{p.name}</h3>
        {p.category && <p className="mt-1 text-sm text-slate-500">{p.category}</p>}

        {price && (
          <p className="mt-6">
            <span
              data-price
              data-prefix={price.prefix ?? ''}
              data-suffix={price.suffix ?? ''}
              data-num={price.num ?? ''}
              className="font-display text-4xl leading-none sm:text-[2.6rem]"
            >
              {price.text}
            </span>
          </p>
        )}

        {p.emi && (
          <p className="mt-3 inline-flex w-fit items-center gap-2 rounded-full bg-[#ff5938]/10 px-3 py-1.5 text-sm text-[#d9361b]">
            <CreditCard className="h-4 w-4" strokeWidth={2} />
            EMI {typeof p.emi === 'number' ? `Rs ${p.emi.toLocaleString('en-IN')}` : p.emi}
          </p>
        )}

        {p.note && <p className="mt-4 text-sm leading-6 text-slate-600">{p.note}</p>}

        {/* perforation */}
        <div className="relative my-6 border-t-2 border-dashed border-slate-950/20">
          <span aria-hidden="true" className="absolute -left-[calc(1.5rem+12px)] -top-3 h-6 w-6 rounded-full bg-transparent sm:-left-[calc(1.75rem+12px)]" />
          <span aria-hidden="true" className="absolute -right-[calc(1.5rem+12px)] -top-3 h-6 w-6 rounded-full bg-transparent sm:-right-[calc(1.75rem+12px)]" />
        </div>

        {p.features.length > 0 && (
          <ul className="space-y-3 text-sm leading-6 text-slate-700">
            {p.features.map((f) => (
              <li key={f} data-feat className="flex items-start gap-3">
                <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[#ff5938] text-slate-950">
                  <Check className="h-3 w-3" strokeWidth={3} />
                </span>
                {f}
              </li>
            ))}
          </ul>
        )}

        <button
          type="button"
          onClick={() => openEnquiry()}
          className={`group mt-auto inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ff5938] focus-visible:ring-offset-2 focus-visible:ring-offset-white active:scale-95 ${
            p.featured
              ? 'bg-[#ff5938] text-slate-950 hover:bg-[#ff765d]'
              : 'border border-slate-950/25 text-slate-950 hover:border-[#ff5938] hover:bg-[#ff5938]/10'
          } ${p.features.length > 0 ? 'mt-8' : ''}`}
        >
          Enquire about this plan
          <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </button>
      </div>
    </div>
  )
}

export default function MembershipPricingSection() {
  const ref = useRef(null)

  useLayoutEffect(() => {
    const root = ref.current
    const mm = gsap.matchMedia()

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const q = (sel, scope = root) => gsap.utils.toArray(sel, scope)

      SplitText.create('[data-title]', {
        type: 'lines,chars',
        mask: 'lines',
        autoSplit: true,
        onSplit: (self) =>
          gsap.from(self.chars, {
            yPercent: 120,
            rotate: 6,
            duration: 1,
            stagger: 0.02,
            ease: 'expo.out',
            scrollTrigger: { trigger: '[data-title]', start: 'top 85%', once: true },
          }),
      })

      gsap.from('[data-emi]', {
        x: 50,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: { trigger: '[data-emi]', start: 'top 92%', once: true },
      })
      gsap.from('[data-notice]', {
        y: 30,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: { trigger: '[data-notice]', start: 'top 92%', once: true },
      })
      gsap.from('[data-draw-x]', {
        scaleX: 0,
        transformOrigin: 'left center',
        duration: 1.3,
        ease: 'expo.out',
        scrollTrigger: { trigger: '[data-draw-x]', start: 'top 92%', once: true },
      })

      // Cards: staggered rise, then price count-up and feature ticks
      const cards = q('[data-plan]')
      gsap.set(cards, { opacity: 0, y: 80, scale: 0.95 })
      q('[data-price]').forEach((el) => {
        if (el.dataset.num === '') return
        el.textContent = `${el.dataset.prefix}0${el.dataset.suffix}`
      })
      ScrollTrigger.batch(cards, {
        start: 'top 90%',
        once: true,
        onEnter: (batch) => {
          gsap.to(batch, { opacity: 1, y: 0, scale: 1, duration: 1.1, stagger: 0.14, ease: 'power4.out', overwrite: true })

          batch.forEach((card, i) => {
            const at = i * 0.14 + 0.3
            const price = card.querySelector('[data-price]')
            if (price && price.dataset.num !== '') {
              const o = { v: 0 }
              gsap.to(o, {
                v: Number(price.dataset.num),
                duration: 1.4,
                delay: at,
                ease: 'power2.out',
                onUpdate: () => (price.textContent = `${price.dataset.prefix}${fmt(o.v)}${price.dataset.suffix}`),
              })
            }
            gsap.from(card.querySelectorAll('[data-feat]'), { x: -20, opacity: 0, duration: 0.6, stagger: 0.07, ease: 'power3.out', delay: at + 0.3 })
            gsap.from(card.querySelectorAll('[data-badge]'), { scale: 0, rotate: -20, duration: 0.7, ease: 'back.out(2.4)', delay: at + 0.2 })
          })
        },
      })

      q('[data-speed]').forEach((el) =>
        gsap.to(el, {
          y: () => -Number(el.dataset.speed) * 140,
          ease: 'none',
          scrollTrigger: { trigger: root, start: 'top bottom', end: 'bottom top', scrub: true },
        }),
      )
    })

    return () => mm.revert()
  }, [])

  return (
    <section
      ref={ref}
      id={PRICING_ID}
      className="relative isolate scroll-mt-28 overflow-hidden bg-transparent py-20 text-slate-950 sm:py-28"
    >
      <style>{`
        @keyframes mp-spin { to { transform: rotate(360deg); } }
        @keyframes mp-glow {
          from { transform: translate(0, 0) scale(1); }
          to   { transform: translate(36px, -28px) scale(1.15); }
        }
        .mp-spin { animation: mp-spin 6s linear infinite; }
        .mp-glow { animation: mp-glow 16s ease-in-out infinite alternate; }
        .mp-card {
          --sx: 50%; --sy: 50%;
          background-image: radial-gradient(280px circle at var(--sx) var(--sy), rgba(255, 89, 56, 0.10), transparent 70%);
        }
        @media (prefers-reduced-motion: reduce) {
          .mp-spin, .mp-glow { animation: none; }
        }
      `}</style>

      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <div data-speed="1" className="absolute -left-40 top-16">
          <div className="mp-glow h-[28rem] w-[28rem] rounded-full bg-[#ff5938]/10 blur-3xl" />
        </div>
        <div data-speed="2" className="absolute -right-40 bottom-10">
          <div className="mp-glow h-[32rem] w-[32rem] rounded-full bg-slate-950/[0.04] blur-3xl" />
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <div className="flex flex-col gap-6 border-t border-slate-950/30 pt-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-3 flex items-center gap-2 text-sm font-medium">
              <span className="h-2 w-2 animate-pulse rounded-full bg-[#ff5938]" />
              Choose your membership
            </p>
            <h2 data-title className="font-sans text-4xl font-semibold uppercase leading-[0.9] tracking-[-0.055em] sm:text-5xl lg:text-6xl">
              Membership pricing
            </h2>
            <div data-draw-x className="mt-6 h-[3px] w-24 rounded-full bg-[#ff5938]" />
          </div>

          <p
            data-emi
            className="flex max-w-md items-start gap-3 rounded-2xl border border-slate-950/10 bg-white/80 px-5 py-4 text-sm leading-6 text-slate-700 shadow-sm backdrop-blur-xl"
          >
            <CreditCard className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#e3361b]" strokeWidth={1.8} />
            {emiNote}
          </p>
        </div>

        <p
          data-notice
          className="mt-8 flex items-start gap-3 rounded-2xl border border-dashed border-[#ff5938]/40 bg-[#ff5938]/[0.06] px-5 py-4 text-sm leading-6 text-slate-700"
        >
          <Info className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#e3361b]" strokeWidth={1.8} />
          {pricingNotice}
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {membershipPlans.map((plan, i) => (
            <div key={plan.id ?? i} data-plan className="h-full">
              <PlanCard plan={plan} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}