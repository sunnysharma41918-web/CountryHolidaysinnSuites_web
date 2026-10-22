import { useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'

const EASE = [0.16, 1, 0.3, 1]
const HEADING_FONT = { fontFamily: "'Outfit', sans-serif" }
const FADE_MASK =
  'linear-gradient(to right, transparent, black 8%, black 92%, transparent)'

/* ------------------------------------------------------------------
   DATA
   `logo` → path to an SVG/PNG in /public/logos (e.g. '/logos/radisson.svg').
   Any logo you add is auto-tinted (white on dark, black on light), so
   use a single-colour or transparent-background file. While `logo` is
   empty, a clean wordmark is shown instead.
------------------------------------------------------------------- */
const PREFERRED_PARTNERS = [
  {
    name: 'Four Points by Sheraton',
    location: '',
    logo: '',
    image:
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Roseate House',
    location: 'New Delhi',
    logo: '',
    image:
      'https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Radisson Blu',
    location: '',
    logo: '',
    image:
      'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Prime Plaza Hotel',
    location: 'Sanur, Bali',
    logo: '',
    image:
      'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'White Woods Resort & Spa',
    location: '',
    logo: '',
    image:
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80',
  },
]

const TRAVEL_PARTNERS = [
  { name: 'Booking.com', kind: 'Booking platform', logo: '' },
  { name: 'Travel Boutique Online', kind: 'Booking platform', logo: '' },
  { name: 'trivago', kind: 'Rate comparison', logo: '' },
  { name: 'VIA.com', kind: 'Booking platform', logo: '' },
  { name: 'goibibo', kind: 'Booking platform', logo: '' },
  { name: 'Tripadvisor India', kind: 'Reviews and rates', logo: '' },
]

/* ------------------------------------------------------------------
   SHARED PIECES
------------------------------------------------------------------- */

/* Heading line that slides up out of a mask */
function RevealLine({ children, delay = 0 }) {
  return (
    <span className="block overflow-hidden pb-[0.08em]">
      <motion.span
        className="block"
        initial={{ y: '110%' }}
        whileInView={{ y: 0 }}
        viewport={{ once: true, margin: '-10%' }}
        transition={{ duration: 1, delay, ease: EASE }}
      >
        {children}
      </motion.span>
    </span>
  )
}

/* Signature pill button with rotating arrow badge */
function PillButton({ href, children, tone = 'dark' }) {
  const isDarkSection = tone === 'dark'
  return (
    <a
      href={href}
      className={`group flex shrink-0 items-center gap-3 rounded-full py-1.5 pl-6 pr-1.5 text-sm font-semibold shadow-lg shadow-black/10 transition-transform duration-300 hover:scale-[1.03] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${isDarkSection
        ? 'bg-[#ff5938] text-slate-950 focus-visible:ring-[#ff5938] focus-visible:ring-offset-slate-950'
        : 'bg-slate-950 text-[#ff5938] focus-visible:ring-slate-950 focus-visible:ring-offset-[#f7f7f5]'
        }`}
    >
      {children}
      <span
        className={`flex h-10 w-10 items-center justify-center rounded-full transition-transform duration-300 group-hover:rotate-45 ${isDarkSection ? 'bg-slate-950 text-[#ff5938]' : 'bg-[#ff5938] text-slate-950'
          }`}
      >
        <ArrowUpRight className="h-4 w-4 stroke-[2.5]" />
      </span>
    </a>
  )
}

/* Logo image (auto-tinted) or wordmark fallback. Colour comes from the parent. */
function Logo({ item, tone, size = 'md' }) {
  const [failed, setFailed] = useState(false)
  const imgHeight = size === 'lg' ? 'h-12' : 'h-7'

  if (item.logo && !failed) {
    const tint =
      tone === 'dark'
        ? 'brightness-0 invert opacity-70 group-hover:invert-0 group-hover:opacity-100'
        : 'brightness-0 opacity-60 group-hover:opacity-100'
    return (
      <img
        src={item.logo}
        alt={item.name}
        loading="lazy"
        onError={() => setFailed(true)}
        className={`${imgHeight} w-auto max-w-[11rem] object-contain transition duration-500 ${tint}`}
      />
    )
  }

  return (
    <span className="flex items-center gap-3">
      <span
        aria-hidden
        className={`flex shrink-0 items-center justify-center rounded-full border border-current font-semibold ${size === 'lg' ? 'h-12 w-12 text-lg' : 'h-8 w-8 text-sm'
          }`}
        style={HEADING_FONT}
      >
        {item.name.charAt(0)}
      </span>
      <span
        className={`whitespace-nowrap font-semibold tracking-[-0.03em] ${size === 'lg' ? 'text-[clamp(1.5rem,2.4vw,2.2rem)]' : 'text-lg'
          }`}
        style={HEADING_FONT}
      >
        {item.name}
      </span>
    </span>
  )
}

/* Infinite slider. Pauses on hover, stops for reduced motion. */
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
        <div className="flex shrink-0 gap-3 pr-3 sm:gap-4 sm:pr-4">{children}</div>
        <div aria-hidden className="flex shrink-0 gap-3 pr-3 sm:gap-4 sm:pr-4">
          {children}
        </div>
      </div>
    </div>
  )
}

/* Blueprint header: label row + title row */
function SectionHeader({ tone, label, meta, title, text, cta }) {
  const dark = tone === 'dark'
  return (
    <>
      <div
        className={`flex shrink-0 items-center justify-between border-t pt-3 text-sm ${dark ? 'border-white/80' : 'border-slate-950'
          }`}
      >
        <span className="flex items-center gap-2 font-medium">
          <span
            className={`h-2 w-2 animate-pulse rounded-full bg-[#ff5938] ${dark ? '' : 'ring-1 ring-slate-950'
              }`}
          />
          {label}
        </span>
        <span className={`hidden sm:block ${dark ? 'text-white/55' : 'text-slate-500'}`}>
          {meta}
        </span>
      </div>

      <div className="flex shrink-0 flex-col justify-between gap-5 md:flex-row md:items-end">
        <h2
          className="text-[clamp(2.25rem,min(5.4vw,8vh),5rem)] font-semibold leading-[0.98] tracking-[-0.04em]"
          style={HEADING_FONT}
        >
          {title.map((line, i) => (
            <RevealLine key={line} delay={i * 0.1}>
              {line}
            </RevealLine>
          ))}
        </h2>
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-6">
          <p
            className={`max-w-md text-sm leading-relaxed sm:text-base ${dark ? 'text-white/60' : 'text-slate-600'
              }`}
          >
            {text}
          </p>
          {cta}
        </div>
      </div>
    </>
  )
}

/* ------------------------------------------------------------------
   1. PREFERRED HOTELS (dark)
------------------------------------------------------------------- */
function PreferredHotels() {
  const [active, setActive] = useState(0)
  const reduce = useReducedMotion()
  const current = PREFERRED_PARTNERS[active]
  const duration = reduce ? 0 : 1

  return (
    <section
      id="partners"
      className="relative w-full overflow-hidden bg-slate-950 text-white lg:h-[100svh]"
    >
      <div className="pointer-events-none absolute -right-40 top-10 h-[28rem] w-[28rem] rounded-full bg-[#ff5938]/10 blur-3xl" />

      <div className="relative mx-auto flex h-full max-w-[1440px] flex-col gap-6 px-4 py-10 sm:px-8 lg:gap-5 lg:px-12 lg:py-8">
        <SectionHeader
          tone="dark"
          label="Hotels we work with"
          meta={`${PREFERRED_PARTNERS.length} preferred stays`}
          title={['Our preferred', 'partners']}
          text="Hotels and resorts where we book your stays, chosen for comfort, service and location."
          cta={<PillButton href="#contact">Plan your stay</PillButton>}
        />

        {/* Body: preview image + hotel list */}
        <div className="grid min-h-0 flex-1 grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-10">
          {/* Preview */}
          <div className="relative aspect-[4/3] overflow-hidden rounded-[28px] bg-slate-900 lg:col-span-5 lg:aspect-auto lg:min-h-0">
            <AnimatePresence initial={false}>
              <motion.img
                key={current.name}
                src={current.image}
                alt={current.name}
                initial={{ opacity: 0, scale: reduce ? 1 : 1.12 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration, ease: EASE }}
                className="absolute inset-0 h-full w-full object-cover"
              />
            </AnimatePresence>
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/10 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 sm:p-6">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={current.name}
                  initial={{ opacity: 0, y: reduce ? 0 : 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: reduce ? 0 : 0.5, ease: EASE }}
                >
                  <p
                    className="text-[clamp(1.4rem,2.2vw,2rem)] font-semibold leading-tight tracking-[-0.03em]"
                    style={HEADING_FONT}
                  >
                    {current.name}
                  </p>
                  {current.location && (
                    <p className="mt-1 text-sm text-white/70">{current.location}</p>
                  )}
                </motion.div>
              </AnimatePresence>
              <span className="flex shrink-0 items-center gap-2 rounded-full bg-[#ff5938] px-3 py-1.5 text-xs font-semibold text-slate-950">
                <span className="h-1.5 w-1.5 rounded-full bg-slate-950" />
                Preferred partner
              </span>
            </div>
          </div>

          {/* List */}
          <ul className="flex min-h-0 flex-col lg:col-span-7">
            {PREFERRED_PARTNERS.map((p, i) => {
              const isActive = i === active
              return (
                <li key={p.name} className="flex min-h-0 flex-1">
                  <button
                    type="button"
                    onMouseEnter={() => setActive(i)}
                    onFocus={() => setActive(i)}
                    onClick={() => setActive(i)}
                    aria-current={isActive}
                    className="group relative flex min-h-[4.5rem] w-full items-center justify-between gap-4 overflow-hidden border-t border-white/15 px-1 text-left transition-colors duration-300 last:border-b hover:text-slate-950 focus-visible:text-slate-950 focus-visible:outline-none lg:px-4"
                  >
                    {/* brand-accent sweep from the bottom */}
                    <span
                      aria-hidden
                      className="absolute inset-0 translate-y-full bg-[#ff5938] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0 group-focus-visible:translate-y-0 motion-reduce:transition-none"
                    />
                    <span className="relative flex min-w-0 items-center gap-4">
                      <span
                        className={`h-2 w-2 shrink-0 rounded-full transition-all duration-500 group-hover:scale-[2] group-hover:bg-slate-950 group-focus-visible:bg-slate-950 ${isActive ? 'bg-[#ff5938]' : 'bg-white/25'
                          }`}
                      />
                      <span
                        className={`truncate text-[clamp(1.25rem,min(2.8vw,4.4vh),2.5rem)] font-semibold leading-tight tracking-[-0.02em] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-2 ${isActive ? 'text-white' : 'text-white/55'
                          } group-hover:text-slate-950 group-focus-visible:text-slate-950`}
                        style={HEADING_FONT}
                      >
                        {p.name}
                      </span>
                    </span>
                    <span className="relative flex shrink-0 items-center gap-4">
                      {p.location && (
                        <span className="hidden text-sm text-white/55 transition-colors duration-300 group-hover:text-slate-950/70 sm:block">
                          {p.location}
                        </span>
                      )}
                      <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 transition-all duration-300 group-hover:rotate-45 group-hover:border-slate-950 group-hover:bg-slate-950 group-hover:text-[#ff5938]">
                        <ArrowUpRight className="h-4 w-4 stroke-[2.5]" />
                      </span>
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
        </div>

        {/* Hotel brand slider */}
        <div className="shrink-0">
          <Marquee duration={32}>
            {[...PREFERRED_PARTNERS, ...PREFERRED_PARTNERS].map((p, i) => (
              <div
                key={`${p.name}-${i}`}
                className="group flex h-14 items-center rounded-full border border-white/15 px-6 text-white/70 transition-colors duration-300 hover:border-[#ff5938] hover:text-[#ff5938]"
              >
                <Logo item={p} tone="dark" />
              </div>
            ))}
          </Marquee>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------
   2. TRAVEL PLATFORMS (light)
------------------------------------------------------------------- */
function TravelPlatforms() {
  const rowOne = [...TRAVEL_PARTNERS, ...TRAVEL_PARTNERS]
  const rowTwo = [...TRAVEL_PARTNERS].reverse().concat([...TRAVEL_PARTNERS].reverse())

  const card = (p, i) => (
    <article
      key={`${p.name}-${i}`}
      className="group relative flex h-[clamp(9rem,24vh,15rem)] w-[17rem] shrink-0 flex-col justify-between overflow-hidden rounded-[28px] border border-slate-950/15 bg-white/60 p-5 text-slate-950 sm:w-[22rem] sm:p-6"
    >
      {/* brand-accent sweep from the bottom */}
      <span
        aria-hidden
        className="absolute inset-0 translate-y-full bg-[#ff5938] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0 motion-reduce:transition-none"
      />
      <div className="relative flex items-start justify-between">
        <span className="flex items-center gap-2 text-sm font-medium text-slate-600 transition-colors duration-300 group-hover:text-slate-950">
          <span className="h-2 w-2 rounded-full bg-[#ff5938] ring-1 ring-slate-950 transition-colors duration-300 group-hover:bg-slate-950" />
          {p.kind}
        </span>
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-950 text-[#ff5938] transition-transform duration-300 group-hover:rotate-45">
          <ArrowUpRight className="h-4 w-4 stroke-[2.5]" />
        </span>
      </div>
      <div className="relative">
        <Logo item={p} tone="light" size="lg" />
      </div>
    </article>
  )

  return (
    <section
      id="travel-partners"
      className="relative w-full overflow-hidden bg-[#f7f7f5] text-slate-950 lg:h-[100svh]"
    >
      <div className="mx-auto flex h-full max-w-[1440px] flex-col gap-6 px-4 py-10 sm:px-8 lg:gap-5 lg:px-12 lg:py-8">
        <SectionHeader
          tone="light"
          label="Platforms we book through"
          meta={`${TRAVEL_PARTNERS.length} travel platforms`}
          title={['Our travel', 'partners']}
          text="Six well-known travel platforms that help us find rooms and rates for your trip."
          cta={<PillButton href="#contact" tone="light">Get a quote</PillButton>}
        />

        <div className="flex min-h-0 flex-1 flex-col justify-center gap-3 sm:gap-4">
          <Marquee duration={48}>{rowOne.map(card)}</Marquee>
          <Marquee duration={56} reverse>
            {rowTwo.map(card)}
          </Marquee>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------
   EXPORT
------------------------------------------------------------------- */
export default function PartnersSection() {
  return (
    <>
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
      <PreferredHotels />
      <TravelPlatforms />
    </>
  )
}