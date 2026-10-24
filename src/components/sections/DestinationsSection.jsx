import { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowUpRight, MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'
import { destinations } from '../../data/destinations'

const EASE = [0.22, 1, 0.36, 1]
const pad = (n) => String(n).padStart(2, '0')

// Colour fallbacks used when a destination has no image
const FALLBACKS = [
  'linear-gradient(160deg,#096c27 0%,#06501b 50%,#0b1f12 100%)',
  'linear-gradient(160deg,#1b7f3b 0%,#096c27 55%,#06501b 100%)',
  'linear-gradient(160deg,#06501b 0%,#096c27 55%,#0b1f12 100%)',
  'linear-gradient(160deg,#134e23 0%,#0e3c1a 55%,#0b1f12 100%)',
  'linear-gradient(160deg,#096c27 0%,#b3d565 55%,#06501b 100%)',
]

// Read whichever field name your data uses
const pick = (d, keys) => keys.map((k) => d?.[k]).find(Boolean)
const asSrc = (v) => (v && typeof v === 'object' ? v.src || v.url : v)

// Change this if your routes differ
const getHref = (d) => `/destinations/${d.slug}`

export default function DestinationsSection() {
  const reduced = !!useReducedMotion()
  const [active, setActive] = useState(0)

  const items = destinations.slice(0, 6).map((d, i) => ({
    key: d.slug || i,
    href: getHref(d),
    title: pick(d, ['title', 'name']) || 'Destination',
    place: pick(d, ['location', 'region', 'country', 'subtitle']),
    desc: pick(d, ['description', 'excerpt', 'summary', 'tagline']),
    image: asSrc(pick(d, ['image', 'img', 'cover', 'thumbnail', 'heroImage'])),
    fallback: FALLBACKS[i % FALLBACKS.length],
  }))

  return (
    <section id="destinations" className="relative overflow-hidden bg-[#f3f8e6] text-[#0b1f12]">
      <div aria-hidden className="pointer-events-none absolute -right-[8%] -top-[10%] h-[50vh] w-[50vh] rounded-full bg-[#b3d565]/20 blur-[120px]" />

      <div className="relative mx-auto flex min-h-[100svh] w-full max-w-[1600px] flex-col px-5 pb-5 pt-5 sm:px-8 sm:pb-7 sm:pt-7 lg:h-[100svh] lg:min-h-[680px]">
        {/* top rail */}
        <header className="flex items-center justify-between border-b border-[#096c27]/25 pb-3 text-[11px] font-medium uppercase tracking-[0.14em] text-[#096c27] sm:text-xs">
          <span className="flex items-center gap-2">
            <span className="h-2 w-2 animate-pulse rounded-full bg-[#096c27]" />
            Destinations
          </span>
          <span className="hidden text-[#0b1f12]/60 sm:block">Shaped by the landscape</span>
          <span className="text-[#096c27]">
            {pad(Math.min(active + 1, items.length))} / {pad(items.length)}
          </span>
        </header>

        {/* heading */}
        <div className="grid shrink-0 items-end gap-5 py-6 lg:grid-cols-12 lg:gap-8">
          <motion.h2
            initial={reduced ? false : { opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1, ease: EASE }}
            className="m-0 font-sans font-semibold uppercase leading-[0.88] tracking-[-0.055em] text-[clamp(36px,min(6.4vw,10.5svh),112px)] text-[#0b1f12] lg:col-span-8"
          >
            Moments shaped by <span className="text-[#096c27] italic">the landscape.</span>
          </motion.h2>
          <motion.p
            initial={reduced ? false : { opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1, ease: EASE, delay: 0.15 }}
            className="m-0 max-w-[380px] text-[14px] leading-relaxed text-[#0b1f12]/75 sm:text-[15px] lg:col-span-4 lg:justify-self-end"
          >
            A collection of immersive destinations chosen for their beauty, character, and opportunity to slow down.
          </motion.p>
        </div>

        {/* panels */}
        <ul className="m-0 flex min-h-0 flex-1 list-none flex-col gap-3 p-0 lg:flex-row lg:gap-3">
          {items.map((d, i) => {
            const on = i === active
            return (
              <motion.li
                key={d.key}
                initial={reduced ? false : { opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 1, ease: EASE, delay: i * 0.1 }}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                onClick={() => setActive(i)}
                style={{ flexGrow: on ? 5 : 1 }}
                className="group relative min-h-[280px] sm:min-h-[340px] flex-[1_1_0%] cursor-pointer overflow-hidden rounded-[22px] bg-[#0b1f12] text-white transition-[flex-grow] duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none lg:min-h-0 lg:min-w-[84px]"
              >
                {/* image / fallback */}
                <div className="absolute inset-0" style={{ background: d.fallback }}>
                  {d.image && (
                    <img
                      src={d.image}
                      alt={d.title}
                      loading="lazy"
                      decoding="async"
                      className={`h-full w-full object-cover transition-transform duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${on ? 'scale-100' : 'scale-110'}`}
                    />
                  )}
                </div>
                <div className={`pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0b1f12]/90 via-[#06501b]/20 to-black/35 transition-opacity duration-700 ${on ? 'opacity-100' : 'opacity-80'}`} />

                {/* top: number + place */}
                <div className="absolute inset-x-5 top-5 z-10 flex items-start justify-between text-[11px] font-medium uppercase tracking-[0.14em]">
                  <span className="font-sans text-[22px] font-semibold leading-none tracking-[-0.04em] text-[#b3d565]">{pad(i + 1)}</span>
                  {d.place && (
                    <span className={`flex items-center gap-1.5 text-white/90 transition-opacity duration-500 ${on ? 'opacity-100' : 'opacity-0 lg:opacity-0'}`}>
                      <MapPin className="h-3.5 w-3.5 text-[#b3d565]" aria-hidden="true" />
                      {d.place}
                    </span>
                  )}
                </div>

                {/* collapsed: vertical title (desktop only) */}
                <span
                  aria-hidden="true"
                  className={`pointer-events-none absolute bottom-5 left-1/2 hidden -translate-x-1/2 font-sans text-[clamp(20px,2.6vw,34px)] font-semibold uppercase tracking-[-0.03em] text-white/80 transition-opacity duration-500 [writing-mode:vertical-rl] [text-orientation:mixed] rotate-180 lg:block ${
                    on ? 'opacity-0' : 'opacity-100 delay-300'
                  }`}
                >
                  {d.title}
                </span>

                {/* expanded content */}
                <div
                  className={`absolute inset-x-0 bottom-0 z-10 flex flex-col gap-4 p-5 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] sm:p-7 lg:min-w-[440px] ${
                    on ? 'translate-y-0 opacity-100 lg:delay-300' : 'translate-y-6 opacity-100 lg:opacity-0'
                  }`}
                >
                  <h3 className="m-0 font-sans text-[clamp(28px,min(4.4vw,7svh),68px)] font-semibold uppercase leading-[0.9] tracking-[-0.05em] text-white">{d.title}</h3>
                  {d.desc && <p className="m-0 max-w-[420px] text-[14px] leading-relaxed text-white/80">{d.desc}</p>}
                  <Link
                    to={d.href}
                    tabIndex={on ? 0 : -1}
                    onClick={(e) => e.stopPropagation()}
                    className="group/cta inline-flex w-max items-center gap-3 rounded-full bg-[#b3d565] py-1.5 pl-5 pr-1.5 text-[13px] font-semibold text-[#0b1f12] transition-colors hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#b3d565] focus-visible:ring-offset-2"
                  >
                    Explore
                    <span className="grid h-9 w-9 place-items-center rounded-full bg-[#096c27] text-white transition-transform duration-500 group-hover/cta:rotate-45">
                      <ArrowUpRight className="h-4 w-4" />
                    </span>
                  </Link>
                </div>
              </motion.li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}