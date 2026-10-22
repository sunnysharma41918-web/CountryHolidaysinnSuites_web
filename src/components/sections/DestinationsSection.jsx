import { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowUpRight, MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'
import { destinations } from '../../data/destinations'

const EASE = [0.22, 1, 0.36, 1]
const pad = (n) => String(n).padStart(2, '0')

// Colour fallbacks used when a destination has no image
const FALLBACKS = [
  'linear-gradient(160deg,#ff9a5c 0%,#ff5938 50%,#7a1f0e 100%)',
  'linear-gradient(160deg,#5aa17f 0%,#1f5c46 55%,#0d2a20 100%)',
  'linear-gradient(160deg,#3fa7bd 0%,#115e75 55%,#08303d 100%)',
  'linear-gradient(160deg,#f6c98f 0%,#c9763a 55%,#4a2310 100%)',
  'linear-gradient(160deg,#8a7fd6 0%,#463d8f 55%,#1a1640 100%)',
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
    <section id="destinations" style={{ background: '#efeae0', color: '#0d0d0c' }} className="relative overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute -right-[8%] -top-[10%] h-[50vh] w-[50vh] rounded-full bg-[#ff5938]/20 blur-[120px]" />

      <div className="relative mx-auto flex min-h-[100svh] w-full max-w-[1600px] flex-col px-5 pb-5 pt-5 sm:px-8 sm:pb-7 sm:pt-7 lg:h-[100svh] lg:min-h-[680px]">
        {/* top rail */}
        <header className="flex items-center justify-between border-b border-[#0d0d0c]/80 pb-3 text-[11px] font-medium uppercase tracking-[0.14em] sm:text-xs">
          <span className="flex items-center gap-2">
            <span className="h-2 w-2 animate-pulse rounded-full bg-[#ff5938]" />
            Destinations
          </span>
          <span className="hidden sm:block">Shaped by the landscape</span>
          <span>
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
            className="m-0 font-sans font-semibold uppercase leading-[0.88] tracking-[-0.055em] text-[clamp(36px,min(6.4vw,10.5svh),112px)] lg:col-span-8"
          >
            Moments shaped by <span className="text-[#ff5938]">the landscape.</span>
          </motion.h2>
          <motion.p
            initial={reduced ? false : { opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1, ease: EASE, delay: 0.15 }}
            className="m-0 max-w-[380px] text-[14px] leading-relaxed text-[#0d0d0c]/70 sm:text-[15px] lg:col-span-4 lg:justify-self-end"
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
                className="group relative min-h-[380px] flex-[1_1_0%] cursor-pointer overflow-hidden rounded-[22px] bg-[#0d0d0c] text-[#efeae0] transition-[flex-grow] duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none lg:min-h-0 lg:min-w-[84px]"
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
                <div className={`pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0d0d0c]/85 via-[#0d0d0c]/15 to-[#0d0d0c]/45 transition-opacity duration-700 ${on ? 'opacity-100' : 'opacity-80'}`} />

                {/* top: number + place */}
                <div className="absolute inset-x-5 top-5 z-10 flex items-start justify-between text-[11px] font-medium uppercase tracking-[0.14em]">
                  <span className="font-sans text-[22px] font-semibold leading-none tracking-[-0.04em] text-[#ff5938]">{pad(i + 1)}</span>
                  {d.place && (
                    <span className={`flex items-center gap-1.5 transition-opacity duration-500 ${on ? 'opacity-100' : 'opacity-0 lg:opacity-0'}`}>
                      <MapPin className="h-3.5 w-3.5 text-[#ff5938]" aria-hidden="true" />
                      {d.place}
                    </span>
                  )}
                </div>

                {/* collapsed: vertical title (desktop only) */}
                <span
                  aria-hidden="true"
                  className={`pointer-events-none absolute bottom-5 left-1/2 hidden -translate-x-1/2 font-sans text-[clamp(20px,2.6vw,34px)] font-semibold uppercase tracking-[-0.03em] transition-opacity duration-500 [writing-mode:vertical-rl] [text-orientation:mixed] rotate-180 lg:block ${
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
                  <h3 className="m-0 font-sans text-[clamp(28px,min(4.4vw,7svh),68px)] font-semibold uppercase leading-[0.9] tracking-[-0.05em]">{d.title}</h3>
                  {d.desc && <p className="m-0 max-w-[420px] text-[14px] leading-relaxed text-[#efeae0]/80">{d.desc}</p>}
                  <Link
                    to={d.href}
                    tabIndex={on ? 0 : -1}
                    onClick={(e) => e.stopPropagation()}
                    className="group/cta inline-flex w-max items-center gap-3 rounded-full bg-[#efeae0] py-1.5 pl-5 pr-1.5 text-[13px] font-semibold text-[#0d0d0c] transition-colors hover:bg-[#ff5938] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ff5938] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0d0d0c]"
                  >
                    Explore
                    <span className="grid h-9 w-9 place-items-center rounded-full bg-[#0d0d0c] text-[#efeae0] transition-transform duration-500 group-hover/cta:rotate-45">
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