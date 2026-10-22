import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { Check, CreditCard, Info, MapPin } from 'lucide-react'
import { emiNote, membershipPlans, openEnquiry, pricingNotice, PRICING_ID } from './content'

gsap.registerPlugin(ScrollTrigger, SplitText)

/* -------------------------------------------------------------------------- */
/*  Dark Editorial Luxury tokens                                              */
/* -------------------------------------------------------------------------- */

const GRADIENT = 'linear-gradient(95deg, #f6efe9 0%, #ff5938 70%, #d9361b 100%)'

const CARD_PALETTES = [
  { bg: 'linear-gradient(150deg,#1a6cff 0%,#0d45b8 100%)', glow: '#1a6cff', accent: '#0d3d9e', light: '#5a9bff' },
  { bg: 'linear-gradient(150deg,#16b84e 0%,#0e7a35 100%)', glow: '#16b84e', accent: '#0b6030', light: '#4de080' },
  { bg: 'linear-gradient(150deg,#e91e8c 0%,#a01060 100%)', glow: '#e91e8c', accent: '#8a0d52', light: '#ff6fc0' },
  { bg: 'linear-gradient(150deg,#ff8c00 0%,#c85f00 100%)', glow: '#ff8c00', accent: '#a84d00', light: '#ffb84d' },
]

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                   */
/* -------------------------------------------------------------------------- */

const pick = (o, keys) => {
  for (const k of keys)
    if (o?.[k] !== undefined && o?.[k] !== null && o?.[k] !== '') return o[k]
  return undefined
}

function normalize(plan) {
  return {
    id: plan.id,
    category: pick(plan, ['category', 'type']),
    categoryName: plan.categoryName,
    tenure: pick(plan, ['years', 'tenure', 'duration']),
    price: pick(plan, ['price', 'amount', 'cost', 'fee']),
    asf: plan.asf,
    occupancy: plan.occupancy,
  }
}

const fmt = (n) => Math.round(n).toLocaleString('en-IN')

/* -------------------------------------------------------------------------- */
/*  Barcode SVG                                                               */
/* -------------------------------------------------------------------------- */

function BarcodeLines({ fill }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="64"
      height="170"
      viewBox="0 0 64 170"
      fill={fill}
      aria-hidden="true"
      style={{ flexShrink: 0 }}
    >
      <path d="M44 158V156.967H20V158H44Z" />
      <path d="M44 13.0328V12H20V13.0328H44Z" />
      <path d="M44 14.0656V13.5492H20V14.0656H44Z" />
      <path d="M44 15.6148V15.0984H20V15.6148H44Z" />
      <path d="M44 18.1967V17.6803H20V18.1967H44Z" />
      <path d="M44 20.2623V19.2295H20V20.2623H44Z" />
      <path d="M44 22.8443V22.3279H20V22.8443H44Z" />
      <path d="M44 23.877V23.3607H20V23.877H44Z" />
      <path d="M44 26.9754V24.9098H20V26.9754H44Z" />
      <path d="M44 28.0082V27.4918H20V28.0082H44Z" />
      <path d="M44 29.5574V29.041H20V29.5574H44Z" />
      <path d="M44 32.6557V30.5902H20V32.6557H44Z" />
      <path d="M44 33.6885V33.1721H20V33.6885H44Z" />
      <path d="M44 35.2376V34.7213H20V35.2376H44Z" />
      <path d="M44 36.2705V35.7541H20V36.2705H44Z" />
      <path d="M44 39.3689V37.3033H20V39.3689H44Z" />
      <path d="M44 40.918V40.4015H20V40.918H44Z" />
      <path d="M44 43.5001V41.4345H20V43.5001H44Z" />
      <path d="M44 45.0492V44.5327H20V45.0492H44Z" />
      <path d="M44 47.631V46.0819H20V47.631H44Z" />
      <path d="M44 49.1804V48.664H20V49.1804H44Z" />
      <path d="M44 51.2458V50.2131H20V51.2458H44Z" />
      <path d="M44 52.2787V51.7622H20V52.2787H44Z" />
      <path d="M44 54.3443V52.7952H20V54.3443H44Z" />
      <path d="M44 56.4099V55.377H20V56.4099H44Z" />
      <path d="M44 57.959V57.4426H20V57.959H44Z" />
      <path d="M44 60.0247V58.4753H20V60.0247H44Z" />
      <path d="M44 62.09V61.0573H20V62.09H44Z" />
      <path d="M44 63.6394V63.123H20V63.6394H44Z" />
      <path d="M44 66.7377V64.6721H20V66.7377H44Z" />
      <path d="M44 68.2868V67.7704H20V68.2868H44Z" />
      <path d="M44 69.3198V68.8033H20V69.3198H44Z" />
      <path d="M44 72.4181V71.3851H20V72.4181H44Z" />
      <path d="M44 73.4508V72.9345H20V73.4508H44Z" />
      <path d="M44 76.5493V74.4837H20V76.5493H44Z" />
      <path d="M44 77.5819V77.0655H20V77.5819H44Z" />
      <path d="M44 79.1311V78.6146H20V79.1311H44Z" />
      <path d="M44 80.6802V80.164H20V80.6802H44Z" />
      <path d="M44 82.2294V81.1967H20V82.2294H44Z" />
      <path d="M44 83.7788V83.2623H20V83.7788H44Z" />
      <path d="M44 86.3606V85.8441H20V86.3606H44Z" />
      <path d="M44 87.9097V87.3935H20V87.9097H44Z" />
      <path d="M44 91.0083V88.9427H20V91.0083H44Z" />
      <path d="M44 92.041V91.5245H20V92.041H44Z" />
      <path d="M44 94.623V92.5574H20V94.623H44Z" />
      <path d="M44 96.1722V95.6557H20V96.1722H44Z" />
      <path d="M44 97.7213V97.2048H20V97.7213H44Z" />
      <path d="M44 99.2704V98.2378H20V99.2704H44Z" />
      <path d="M44 100.82V100.303H20V100.82H44Z" />
      <path d="M44 103.402V102.885H20V103.402H44Z" />
      <path d="M44 105.467V104.434H20V105.467H44Z" />
      <path d="M44 108.049V106.5H20V108.049H44Z" />
      <path d="M44 109.082V108.566H20V109.082H44Z" />
      <path d="M44 112.18V111.148H20V112.18H44Z" />
      <path d="M44 113.213V112.697H20V113.213H44Z" />
      <path d="M44 114.762V114.246H20V114.762H44Z" />
      <path d="M44 118.377V116.311H20V118.377H44Z" />
      <path d="M44 119.41V118.893H20V119.41H44Z" />
      <path d="M44 120.442V119.926H20V120.442H44Z" />
      <path d="M44 122.508V120.959H20V122.508H44Z" />
      <path d="M44 124.574V123.541H20V124.574H44Z" />
      <path d="M44 127.672V125.607H20V127.672H44Z" />
      <path d="M44 128.705V128.188H20V128.705H44Z" />
      <path d="M44 130.254V129.738H20V130.254H44Z" />
      <path d="M44 132.32V131.287H20V132.32H44Z" />
      <path d="M44 135.418V133.869H20V135.418H44Z" />
      <path d="M44 136.451V135.934H20V136.451H44Z" />
    </svg>
  )
}

/* -------------------------------------------------------------------------- */
/*  Ticket Card                                                               */
/* -------------------------------------------------------------------------- */

function TicketCard({ plan, palette }) {
  const p = normalize(plan)

  const FEATURES = [
    `${p.category} ${p.categoryName}`,
    'EMI Facility available (24 months)',
    p.asf ? `ASF Rs. ${p.asf.toLocaleString('en-IN')}/yr` : null,
  ].filter(Boolean)

  return (
    <div className="chis-ticket-perspective">
      <div 
        className="chis-card-ticket" 
        data-plan 
        onClick={() => openEnquiry(plan)}
        style={{ cursor: 'pointer' }}
      >
        {/* ── Barcode left section ── */}
        <div className="chis-barcode-section" style={{ background: palette.bg }}>
          <BarcodeLines fill="rgba(255,255,255,0.35)" />
          <div className="chis-barcode-label">
            <p className="chis-barcode-cat">{p.category}</p>
            <p className="chis-barcode-cat-sub">Category</p>
          </div>
        </div>

        {/* ── Separator ── */}
        <div className="chis-separator">
          <span className="chis-sep-line" />
        </div>

        {/* ── Content ticket ── */}
        <div className="chis-content-ticket">
          <div className="chis-content-data">
            {/* Top row */}
            <div className="chis-destination-row">
              <div className="chis-dest">
                <p className="chis-dest-country">Room</p>
                <p className="chis-dest-acronym">{p.category}</p>
                <p className="chis-dest-hour">
                  <MapPin className="inline-block" width={9} height={9} />
                  CHIS
                </p>
              </div>

              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" style={{ flexShrink: 0, opacity: 0.4 }}>
                <path fill="none" stroke="#aeaeae" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="m18 8l4 4l-4 4M2 12h20" />
              </svg>

              <div className="chis-dest" style={{ textAlign: 'right' }}>
                <p className="chis-dest-country">Duration</p>
                <p className="chis-dest-acronym">{p.tenure}Y</p>
                <p className="chis-dest-hour" style={{ justifyContent: 'flex-end' }}>Membership</p>
              </div>
            </div>

            <div style={{ borderBottom: '1px solid #eaeaea' }} />

            {/* Features + Centered Price row */}
            <div className="chis-data-flex-col">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {FEATURES.map((f) => (
                  <div key={f} className="chis-data-item">
                    <span className="chis-check-dot" style={{ background: palette.glow }}>
                      <Check width={8} height={8} color="#fff" strokeWidth={3.5} />
                    </span>
                    <span className="chis-feat-text">{f}</span>
                  </div>
                ))}
              </div>

              <div className="chis-price-center-row">
                <div
                  className="chis-price-badge"
                  data-price
                  data-num={p.price ?? ''}
                  style={{ borderColor: palette.glow + '55', background: palette.glow + '12' }}
                >
                  <span className="chis-price-label" style={{ color: palette.glow }}>INR</span>
                  <span className="chis-price-num" data-price-num>
                    {p.price ? p.price.toLocaleString('en-IN') : '—'}
                  </span>
                  <span className="chis-price-label" style={{ color: palette.glow }}>/-</span>
                </div>
              </div>
            </div>
          </div>

          {/* ── Right icon strip ── */}
          <div className="chis-icon-strip" style={{ background: palette.bg }}>
            <div className="chis-icon-years">
              <span>{p.tenure}</span>
              <span style={{ fontSize: '7px', letterSpacing: '0.08em' }}>YRS</span>
            </div>
            <div className="chis-icon-brand" style={{ color: '#fff' }}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" height="18" width="18">
                <path fill="currentColor" d="M38.0481 4.82927C38.0481 2.16214 40.018 0 42.4481 0H51.2391C53.6692 0 55.6391 2.16214 55.6391 4.82927V40.1401C55.6391 48.8912 53.2343 55.6657 48.4248 60.4636C43.6153 65.2277 36.7304 67.6098 27.7701 67.6098C18.8099 67.6098 11.925 65.2953 7.11548 60.6663C2.37183 56.0036 3.8147e-06 49.2967 3.8147e-06 40.5456V4.82927C3.8147e-06 2.16213 1.96995 0 4.4 0H13.2405C15.6705 0 17.6405 2.16214 17.6405 4.82927V39.1265C17.6405 43.7892 18.4805 47.2018 20.1605 49.3642C21.8735 51.5267 24.4759 52.6079 27.9678 52.6079C31.4596 52.6079 34.0127 51.5436 35.6268 49.4149C37.241 47.2863 38.0481 43.8399 38.0481 39.0758V4.82927Z"/>
                <path fill="currentColor" d="M86.9 61.8682C86.9 64.5353 84.9301 66.6975 82.5 66.6975H73.6595C71.2295 66.6975 69.2595 64.5353 69.2595 61.8682V4.82927C69.2595 2.16214 71.2295 0 73.6595 0H82.5C84.9301 0 86.9 2.16214 86.9 4.82927V61.8682Z"/>
                <path fill="currentColor" d="M2.86102e-06 83.2195C2.86102e-06 80.5524 1.96995 78.3902 4.4 78.3902H83.6C86.0301 78.3902 88 80.5524 88 83.2195V89.1707C88 91.8379 86.0301 94 83.6 94H4.4C1.96995 94 0 91.8379 0 89.1707L2.86102e-06 83.2195Z"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*  Section Component                                                         */
/* -------------------------------------------------------------------------- */

export default function MembershipPricingSection() {
  const ref = useRef(null)

  useLayoutEffect(() => {
    const root = ref.current
    const mm = gsap.matchMedia()

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const q = (sel) => gsap.utils.toArray(sel, root)

      SplitText.create('[data-title]', {
        type: 'lines,chars',
        mask: 'lines',
        autoSplit: true,
        onSplit: (self) => {
          const w = self.elements[0].offsetWidth
          self.chars.forEach((c) => {
            Object.assign(c.style, {
              backgroundImage: GRADIENT,
              backgroundSize: `${w}px 100%`,
              backgroundPosition: `${-c.offsetLeft}px 0`,
              backgroundRepeat: 'no-repeat',
              webkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent',
            })
          })
          return gsap.from(self.chars, {
            yPercent: 120,
            duration: 1.2,
            stagger: 0.025,
            ease: 'expo.out',
            scrollTrigger: { trigger: '[data-title]', start: 'top 85%', once: true },
          })
        },
      })

      gsap.from(q('[data-side] > *'), {
        y: 30, opacity: 0, duration: 1, stagger: 0.12, ease: 'power3.out',
        scrollTrigger: { trigger: '[data-side]', start: 'top 85%', once: true },
      })

      const cards = q('[data-plan]')
      gsap.set(cards, { opacity: 0, y: 70 })

      ScrollTrigger.batch(cards, {
        start: 'top 92%',
        once: true,
        onEnter: (batch) => {
          gsap.to(batch, { opacity: 1, y: 0, duration: 1.1, stagger: 0.12, ease: 'power4.out', overwrite: true })
          batch.forEach((card, i) => {
            const priceWrap = card.querySelector('[data-price]')
            const num = priceWrap?.dataset.num
            if (!num) return
            const numSpan = priceWrap.querySelector('[data-price-num]')
            if (!numSpan) return
            const o = { v: 0 }
            gsap.to(o, {
              v: Number(num),
              duration: 1.5,
              delay: i * 0.12 + 0.35,
              ease: 'power2.out',
              onUpdate: () => { numSpan.textContent = fmt(o.v) },
            })
          })
        },
      })
    })

    return () => mm.revert()
  }, [])

  return (
    <section
      ref={ref}
      id={PRICING_ID}
      aria-labelledby="pricing-title"
      className="relative isolate scroll-mt-28 overflow-x-clip bg-[#0b0706] py-20 text-[#f6efe9] sm:py-28"
    >
      <style>{TICKET_CSS}</style>

      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-[15%] -top-[8%]">
          <div className="mp-drift-a h-[45vw] w-[45vw] rounded-full bg-[#ff5938]/20 blur-3xl" />
        </div>
        <div className="absolute -bottom-[10%] -right-[12%]">
          <div className="mp-drift-b h-[42vw] w-[42vw] rounded-full bg-[#d9361b]/20 blur-3xl" />
        </div>
      </div>

      <div className="mx-auto max-w-[90rem] px-5 sm:px-8 lg:px-12">
        <h2
          id="pricing-title"
          data-title
          className="border-t border-[#f6efe9]/15 pt-8 font-nunito text-[clamp(3.5rem,12vw,11rem)] font-light leading-[0.9] tracking-[-0.05em] text-[#f6efe9]"
        >
          Membership pricing
        </h2>

        <div className="mt-14 grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <div data-side className="space-y-6 lg:sticky lg:top-24">
              <p className="font-sans text-2xl font-light leading-snug tracking-[-0.03em] sm:text-[1.7rem]">
                Choose your tenure and room category. Each plan is a CHIS membership ticket.
              </p>

              <div className="space-y-4 rounded-2xl border border-[#f6efe9]/10 bg-[#f6efe9]/[0.04] p-5 backdrop-blur-sm">
                <p className="flex items-start gap-3 text-sm leading-6 text-[#f6efe9]/70">
                  <CreditCard className="mt-0.5 h-5 w-5 shrink-0 text-[#ff5938]" strokeWidth={1.6} />
                  {emiNote}
                </p>
                <div className="h-px bg-[#f6efe9]/10" />
                <p className="flex items-start gap-3 text-sm leading-6 text-[#f6efe9]/55">
                  <Info className="mt-0.5 h-5 w-5 shrink-0 text-[#ff5938]" strokeWidth={1.6} />
                  {pricingNotice}
                </p>
              </div>

              {[
                { tag: 'T1', label: 'Standard Room', sub: '2 adults + 2 children (below 6 yrs)', pal: CARD_PALETTES[0] },
                { tag: 'T2', label: 'Two Rooms / Suite', sub: '4 adults + 2 children (below 6 yrs)', pal: CARD_PALETTES[2] },
              ].map((t) => (
                <div key={t.tag} className="flex items-start gap-4 rounded-xl border border-[#f6efe9]/10 p-4">
                  <span
                    className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-xs font-bold text-white"
                    style={{ background: t.pal.bg }}
                  >
                    {t.tag}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-[#f6efe9]">{t.label}</p>
                    <p className="mt-0.5 text-xs text-[#f6efe9]/55">{t.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-8">
            <div className="grid gap-6 sm:grid-cols-2">
              {membershipPlans.map((plan, i) => (
                <TicketCard
                  key={plan.id ?? i}
                  plan={plan}
                  palette={CARD_PALETTES[i % CARD_PALETTES.length]}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* -------------------------------------------------------------------------- */
/*  Optimized Ticket CSS                                                      */
/* -------------------------------------------------------------------------- */

const TICKET_CSS = `
@keyframes mp-drift-a { 0%,100%{transform:translate3d(0,0,0) scale(1)} 50%{transform:translate3d(6%,8%,0) scale(1.12)} }
@keyframes mp-drift-b { 0%,100%{transform:translate3d(0,0,0) scale(1)} 50%{transform:translate3d(-8%,-6%,0) scale(1.15)} }
.mp-drift-a{animation:mp-drift-a 18s ease-in-out infinite}
.mp-drift-b{animation:mp-drift-b 22s ease-in-out infinite}

@keyframes chis-animation-card {
  0%   { transform: translateZ(0px); }
  25%  { transform: translateX(-6px) rotateY(-8deg); }
  75%  { transform: translateX(6px)  rotateY(8deg); }
  100% { transform: translateZ(0px); }
}

.chis-ticket-perspective {
  perspective: 1000px;
  width: 100%;
}

.chis-card-ticket {
  position: relative;
  height: 205px;
  width: 100%;
  max-width: 100%;
  display: flex;
  color: #2d2d2d;
  background-color: #ffffff;
  border-radius: 1rem;
  overflow: hidden;
  z-index: 10;
  animation: chis-animation-card 10s ease-in-out infinite;
  box-shadow: 0 20px 60px -20px rgba(0,0,0,0.6);
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.chis-card-ticket:hover {
  animation-play-state: paused;
  transform: translateY(-8px) scale(1.01);
  box-shadow: 0 30px 70px -20px rgba(0,0,0,0.75);
}

.chis-barcode-section {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 60px;
  overflow: hidden;
}

.chis-barcode-label {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1px;
  padding: 0.25rem;
}

.chis-barcode-cat {
  font-size: 11px;
  font-weight: 800;
  color: #fff;
  letter-spacing: 0.1em;
  text-align: center;
  line-height: 1;
}

.chis-barcode-cat-sub {
  font-size: 7px;
  font-weight: 600;
  color: rgba(255,255,255,0.75);
  letter-spacing: 0.15em;
  text-align: center;
  text-transform: uppercase;
}

.chis-separator {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 10;
  width: 14px;
  flex-shrink: 0;
}

.chis-sep-line {
  position: relative;
  display: flex;
  height: 100%;
  border-left: 2px dashed #e0e0e0;
}

.chis-sep-line::after, .chis-sep-line::before {
  content: "";
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background-color: #0b0706;
}
.chis-sep-line::after { top: -7px; }
.chis-sep-line::before { bottom: -7px; }

.chis-content-ticket {
  position: relative;
  width: 100%;
  display: flex;
  justify-content: space-between;
  overflow: hidden;
}

.chis-content-data {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex-grow: 1;
  padding: 0.75rem 0.9rem;
  min-width: 0;
}

.chis-destination-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.chis-dest {
  display: flex;
  flex-direction: column;
}

.chis-dest-country {
  font-size: 8px;
  line-height: 1;
  color: #aeaeae;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.chis-dest-acronym {
  font-weight: 700;
  font-size: 14px;
  color: #1a1a1a;
  line-height: 1.1;
}

.chis-dest-hour {
  font-size: 8px;
  line-height: 12px;
  display: flex;
  align-items: center;
  gap: 2px;
  color: #555;
}

.chis-data-flex-col {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.chis-data-item {
  display: flex;
  align-items: center;
  gap: 6px;
}

.chis-check-dot {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  flex-shrink: 0;
}

.chis-feat-text {
  font-size: 10px;
  color: #333;
  line-height: 1.3;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.chis-price-center-row {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 4px;
}

.chis-price-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  border: 1.5px solid;
  border-radius: 10px;
  padding: 5px 14px;
  width: fit-content;
}

.chis-price-label {
  font-size: 8px;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.chis-price-num {
  font-size: 14px;
  font-weight: 700;
  color: #1a1a1a;
  line-height: 1;
}

.chis-icon-strip {
  width: 38px;
  padding: 0.75rem 0.3rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
}

.chis-icon-years {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #fff;
  font-weight: 800;
  font-size: 11px;
  line-height: 1;
  gap: 1px;
}

.chis-icon-brand {
  opacity: 0.9;
}

@media (prefers-reduced-motion: reduce) {
  .mp-drift-a, .mp-drift-b, .chis-card-ticket { animation: none !important; }
}
`