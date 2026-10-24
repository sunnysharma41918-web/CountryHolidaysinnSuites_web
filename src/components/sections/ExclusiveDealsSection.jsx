import { useRef, useState } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'

const EASE = [0.16, 1, 0.3, 1]
const HEADING_FONT = { fontFamily: "'Outfit', sans-serif" }
const FADE_MASK = 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)'

/* ------------------------------------------------------------------
   LOGOS: every image in src/assets/images/partners (and the older
   src/assets/images/Hotels folder, if it still exists) is picked up
   automatically by Vite. Files are matched to a partner by file name
   (e.g. "booking.png", "Radisson-Blu.svg", "tripadvisor.webp").
   Any logo that matches nobody is added to the travel partners row.
   NOTE: the glob path is relative to THIS file. Adjust the ../../ if
   the component lives at a different depth.
------------------------------------------------------------------- */
const logoFiles = import.meta.glob(
  '../../assets/images/{partners,Hotels}/*.{png,jpg,jpeg,webp,svg,avif,PNG,JPG,JPEG,WEBP,SVG}',
  { eager: true, import: 'default' },
)

const norm = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, '')
const pretty = (s) =>
  s
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim()

const LOGOS = Object.entries(logoFiles).map(([path, url]) => {
  const file = path.split('/').pop().replace(/\.[^.]+$/, '')
  return { key: norm(file), file, url }
})

const findLogo = (keys) => {
  const exact = LOGOS.find((l) => keys.includes(l.key))
  if (exact) return exact.url
  const loose = LOGOS.find((l) => keys.some((k) => k.length >= 4 && l.key.includes(k)))
  return loose ? loose.url : ''
}

/* ------------------------------------------------------------------
   DATA
------------------------------------------------------------------- */
const PREFERRED_BASE = [
  {
    name: 'Four Points by Sheraton',
    location: '',
    keys: ['fourpoints', 'fourpointsbysheraton', 'sheraton'],
    image:
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1400&q=80',
  },
  {
    name: 'Roseate House',
    location: 'New Delhi',
    keys: ['roseate', 'roseatehouse'],
    image:
      'https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=1400&q=80',
  },
  {
    name: 'Radisson Blu',
    location: '',
    keys: ['radisson', 'radissonblu'],
    image:
      'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1400&q=80',
  },
  {
    name: 'Prime Plaza Hotel',
    location: 'Sanur, Bali',
    keys: ['primeplaza', 'primeplazahotel'],
    image:
      'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1400&q=80',
  },
  {
    name: 'White Woods Resort & Spa',
    location: '',
    keys: ['whitewoods', 'whitewoodsresort', 'whitewoodsresortspa'],
    image:
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1400&q=80',
  },
]

const TRAVEL_BASE = [
  { name: 'Booking.com', keys: ['booking', 'bookingcom'] },
  { name: 'Travel Boutique Online', keys: ['travelboutique', 'travelboutiqueonline', 'tbo'] },
  { name: 'trivago', keys: ['trivago'] },
  { name: 'VIA.com', keys: ['via', 'viacom'] },
  { name: 'goibibo', keys: ['goibibo'] },
  { name: 'Tripadvisor India', keys: ['tripadvisor', 'tripadvisorindia'] },
]

const withLogo = (p) => ({ ...p, logo: findLogo(p.keys) })

const PREFERRED = PREFERRED_BASE.map(withLogo)
const TRAVEL_MAIN = TRAVEL_BASE.map(withLogo)
const usedLogos = new Set([...PREFERRED, ...TRAVEL_MAIN].map((p) => p.logo).filter(Boolean))
const seenExtra = new Set()
const EXTRA = LOGOS.filter((l) => {
  if (usedLogos.has(l.url) || seenExtra.has(l.key)) return false
  seenExtra.add(l.key)
  return true
}).map((l) => ({ name: pretty(l.file), logo: l.url }))
const TRAVEL = [...TRAVEL_MAIN, ...EXTRA]

/* repeat a short list so one slider half always spans a wide screen */
const fill = (list, min = 8) => {
  let out = list
  while (out.length < min) out = [...out, ...list]
  return out
}

/* ------------------------------------------------------------------
   SMALL PIECES
------------------------------------------------------------------- */

/* Heading line that slides up out of a mask.
   The in-view check sits on the clipping wrapper so it can't get stuck. */
function RevealLine({ children, delay = 0 }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.3 })
  const reduce = useReducedMotion()
  return (
    <span ref={ref} className="block overflow-hidden pb-[0.08em]">
      <motion.span
        className="block"
        initial={reduce ? false : { y: '110%' }}
        animate={{ y: reduce || inView ? 0 : '110%' }}
        transition={{ duration: 1, delay, ease: EASE }}
      >
        {children}
      </motion.span>
    </span>
  )
}

/* Signature pill button with rotating arrow badge */
function PillButton({ href, children }) {
  return (
    <a
      href={href}
      className="group inline-flex shrink-0 items-center gap-3 rounded-full bg-[#096c27] py-1.5 pl-6 pr-1.5 text-sm font-semibold text-white shadow-lg shadow-[#096c27]/15 transition-transform duration-300 hover:scale-[1.03] hover:bg-[#06501b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#096c27] focus-visible:ring-offset-2 active:scale-95"
      style={HEADING_FONT}
    >
      {children}
      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#b3d565] text-[#096c27] transition-transform duration-300 group-hover:rotate-45">
        <ArrowUpRight className="h-4 w-4 stroke-[2.5]" />
      </span>
    </a>
  )
}

/* Real logo image, or a wordmark if the file is missing / fails to load */
function Logo({ item, className = '' }) {
  const [failed, setFailed] = useState(false)

  if (item.logo && !failed) {
    return (
      <img
        src={item.logo}
        alt={item.name}
        loading="lazy"
        onError={() => setFailed(true)}
        className={`w-auto object-contain ${className}`}
      />
    )
  }

  return (
    <span className="flex items-center gap-2.5" style={HEADING_FONT}>
      <span
        aria-hidden
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-current text-sm font-semibold"
      >
        {item.name.charAt(0)}
      </span>
      <span className="whitespace-nowrap text-base font-semibold tracking-[-0.03em]">{item.name}</span>
    </span>
  )
}

/* Infinite logo slider (pauses on hover) */
function Marquee({ children, duration = 40, reverse = false }) {
  return (
    <div
      className="partners-marquee overflow-hidden"
      style={{ maskImage: FADE_MASK, WebkitMaskImage: FADE_MASK }}
    >
      <div
        className="partners-marquee-track flex w-max"
        style={{
          animationDuration: `${duration}s`,
          animationDirection: reverse ? 'reverse' : 'normal',
        }}
      >
        <div className="flex shrink-0 gap-3 pr-3">{children}</div>
        <div aria-hidden className="flex shrink-0 gap-3 pr-3">
          {children}
        </div>
      </div>
    </div>
  )
}

/* One labelled mini scroller */
function LogoRow({ label, items, duration, reverse }) {
  return (
    <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:gap-6">
      <span
        className="flex shrink-0 items-center gap-2 text-sm font-medium text-[#096c27] lg:w-44"
        style={HEADING_FONT}
      >
        <span className="h-2 w-2 animate-pulse rounded-full bg-[#096c27] ring-1 ring-[#096c27]/30 motion-reduce:animate-none" />
        {label}
        <span className="text-[#0b1f12]/50">{items.length}</span>
      </span>
      <div className="min-w-0 flex-1">
        <Marquee duration={duration} reverse={reverse}>
          {fill(items).map((p, i) => (
            <div
              key={`${p.name}-${i}`}
              className="group flex h-[clamp(2.75rem,6.5svh,4rem)] items-center rounded-full border border-[#096c27]/15 bg-white px-6 text-[#0b1f12] shadow-sm transition-colors duration-300 hover:border-[#096c27]"
            >
              <Logo
                item={p}
                className="h-[clamp(1.25rem,3.4svh,2rem)] max-w-[9rem] opacity-80 grayscale transition duration-500 group-hover:opacity-100 group-hover:grayscale-0"
              />
            </div>
          ))}
        </Marquee>
      </div>
    </div>
  )
}

/* Blueprint header: label row + title row */
function SectionHeader({ label, meta, title, text, cta }) {
  return (
    <>
      <div className="flex shrink-0 items-center justify-between border-t border-[#096c27]/25 pt-3 text-sm">
        <span className="flex items-center gap-2 font-medium text-[#096c27]">
          <span className="h-2 w-2 animate-pulse rounded-full bg-[#096c27] ring-1 ring-[#096c27]/30 motion-reduce:animate-none" />
          {label}
        </span>
        <span className="hidden text-[#0b1f12]/60 sm:block">{meta}</span>
      </div>

      <div className="flex shrink-0 flex-col justify-between gap-5 md:flex-row md:items-end">
        <h2
          className="text-[clamp(2.25rem,min(5.4vw,8svh),5rem)] font-semibold leading-[0.98] tracking-[-0.04em] text-[#0b1f12]"
          style={HEADING_FONT}
        >
          {title.map((line, i) => (
            <RevealLine key={line} delay={i * 0.1}>
              {line}
            </RevealLine>
          ))}
        </h2>
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-6">
          <p className="max-w-md text-sm leading-relaxed text-[#0b1f12]/75 sm:text-base" style={HEADING_FONT}>
            {text}
          </p>
          {cta}
        </div>
      </div>
    </>
  )
}

/* ------------------------------------------------------------------
   PARTNERS
   Top: expanding hotel photo panels (#f3f8e6).
   Bottom: mini scrollers for hotel partners + travel partners (#f3f8e6).
   The whole block is exactly one screen tall on desktop.
------------------------------------------------------------------- */
export default function PartnersSection() {
  const [active, setActive] = useState(0)

  return (
    <section id="partners" className="relative flex w-full flex-col overflow-hidden bg-[#f3f8e6] py-12 sm:py-16 lg:h-[100svh] lg:py-0">
      <style>{`
        @keyframes partners-marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .partners-marquee-track {
          animation-name: partners-marquee;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }
        .partners-marquee:hover .partners-marquee-track {
          animation-play-state: paused;
        }
        @media (prefers-reduced-motion: reduce) {
          .partners-marquee-track { animation: none; }
        }
      `}</style>

      {/* ---------- hotels (#f3f8e6) ---------- */}
      <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden bg-[#f3f8e6] text-[#0b1f12]">
        <div className="pointer-events-none absolute -right-40 top-10 h-[28rem] w-[28rem] rounded-full bg-[#096c27]/5 blur-3xl" />

        <div className="relative mx-auto flex h-full min-h-0 w-full max-w-[1440px] flex-col gap-6 px-4 sm:px-8 lg:gap-[clamp(0.75rem,2.5svh,1.5rem)] lg:px-12 lg:py-[clamp(1rem,3.5svh,2rem)]">
          <SectionHeader
            label="Hotels we work with"
            meta={`${PREFERRED.length} preferred stays`}
            title={['Our preferred', 'partners']}
            text="Hotels and resorts where we book your stays, chosen for comfort, service and location."
            cta={<PillButton href="#contact">Plan your stay</PillButton>}
          />

          <div className="flex min-h-0 flex-1 flex-col gap-3 lg:flex-row">
            {PREFERRED.map((p, i) => {
              const on = i === active
              return (
                <button
                  key={p.name}
                  type="button"
                  aria-pressed={on}
                  aria-label={p.name}
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onClick={() => setActive(i)}
                  className={`group relative isolate overflow-hidden rounded-[24px] sm:rounded-[28px] bg-[#06501b] text-left transition-[flex-grow,height] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#096c27] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f3f8e6] motion-reduce:transition-none lg:min-w-0 lg:basis-0 ${
                    on ? 'h-72 sm:h-80 lg:h-auto lg:grow-[6]' : 'h-16 sm:h-[4.75rem] lg:h-auto lg:grow'
                  }`}
                >
                  <img
                    src={p.image}
                    alt=""
                    loading="lazy"
                    className={`absolute inset-0 -z-10 h-full w-full object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none ${
                      on ? 'scale-100' : 'scale-110'
                    }`}
                  />
                  <span
                    aria-hidden
                    className="absolute inset-0 -z-10 bg-gradient-to-t from-[#0b1f12]/90 via-[#0b1f12]/20 to-[#0b1f12]/30"
                  />
                  <span
                    aria-hidden
                    className={`absolute inset-0 -z-10 bg-[#06501b] transition-opacity duration-700 ${
                      on ? 'opacity-0' : 'opacity-60'
                    }`}
                  />

                  {/* collapsed label: row on mobile, vertical on desktop */}
                  <span
                    className={`absolute inset-0 flex items-center justify-between gap-4 px-5 transition-opacity duration-500 lg:hidden ${
                      on ? 'opacity-0' : 'opacity-100 delay-300 motion-reduce:delay-0'
                    }`}
                  >
                    <span className="truncate text-lg font-semibold tracking-[-0.02em]" style={HEADING_FONT}>
                      {p.name}
                    </span>
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/30">
                      <ArrowUpRight className="h-4 w-4 stroke-[2.5]" />
                    </span>
                  </span>
                  <span
                    className={`absolute inset-0 hidden flex-col items-center justify-between py-5 transition-opacity duration-500 lg:flex ${
                      on ? 'opacity-0' : 'opacity-100 delay-300 motion-reduce:delay-0'
                    }`}
                  >
                    <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/30">
                      <ArrowUpRight className="h-4 w-4 stroke-[2.5]" />
                    </span>
                    <span
                      className="rotate-180 whitespace-nowrap text-[clamp(1rem,1.7vw,1.5rem)] font-semibold tracking-[-0.02em] text-white/90 [writing-mode:vertical-rl]"
                      style={HEADING_FONT}
                    >
                      {p.name}
                    </span>
                  </span>

                  {/* open state */}
                  <span
                    className={`absolute inset-0 flex flex-col justify-between p-5 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] sm:p-6 lg:p-8 ${
                      on
                        ? 'translate-y-0 opacity-100 delay-300 motion-reduce:delay-0'
                        : 'pointer-events-none translate-y-4 opacity-0'
                    }`}
                  >
                    <span className="flex items-start justify-end gap-3">
                      <span className="flex shrink-0 items-center gap-2 rounded-full bg-[#b3d565] px-3.5 py-1.5 text-xs font-semibold text-[#0b1f12]">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#096c27]" />
                        Preferred partner
                      </span>
                    </span>

                    <span className="block">
                      <span
                        className="block text-[clamp(1.6rem,min(3.2vw,5svh),3rem)] font-semibold leading-[1.02] tracking-[-0.03em] text-white"
                        style={HEADING_FONT}
                      >
                        {p.name}
                      </span>
                      {p.location && (
                        <span className="mt-2 block text-sm text-white/80" style={HEADING_FONT}>
                          {p.location}
                        </span>
                      )}
                    </span>
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* ---------- mini scrollers (#f3f8e6) ---------- */}
      <div className="shrink-0 border-t border-[#096c27]/10 bg-[#f3f8e6] py-5 text-[#0b1f12] lg:py-[clamp(0.6rem,2svh,1.25rem)]">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-3 px-4 sm:px-8 lg:gap-[clamp(0.4rem,1.2svh,0.75rem)] lg:px-12">
          <LogoRow label="Hotel partners" items={PREFERRED} duration={36} />
          <LogoRow label="Travel partners" items={TRAVEL} duration={44} reverse />
        </div>
      </div>
    </section>
  )
}