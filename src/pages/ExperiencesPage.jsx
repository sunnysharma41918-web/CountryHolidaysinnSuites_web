import { useMemo, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowUpRight, Compass, MapPin } from 'lucide-react'
import PageTransition from '../components/layout/PageTransition'
import raftingImage from '../assets/images/White-Water Rafting.jpg'
import parasailingImage from '../assets/images/Parasailing.jpeg'
import scubaImage from '../assets/images/Scuba & Snorkeling.avif'

/* -------------------------------------------------------------------------- */
/*  CHIS "Tree" palette tokens                                                */
/*  pure green #096c27 · leaf #b3d565 · white #ffffff                         */
/*  forest ink #0b1f12 (text) · leaf mist #f3f8e6 (soft backgrounds)          */
/*  forest depth #06501b                                                      */
/* -------------------------------------------------------------------------- */

const HERO = {
  video: '/car-travel.mp4',
  poster: '',
  top: 'Ride into',
  bottom: 'your holiday',
  fallback: 'linear-gradient(160deg,#096c27 0%,#06501b 55%,#0b1f12 100%)',
}

const HERO_COPY =
  'We believe in turning every journey into the best part of your holiday. Thoughtfully planned stays, open vistas and experiences worth stopping for.'

const HERO_FEATURES = ['Curated Stays', 'Scenic Adventures', 'Seamless Booking']

const WHY = [
  {
    t: 'Curated stays',
    s: 'Hand-picked luxury retreats so every stop on the road feels like an extraordinary destination.',
    bg: '#096c27',
    fg: '#ffffff',
    numClass: 'text-[#b3d565]',
    border: 'border-[#096c27]',
    dark: true,
  },
  {
    t: 'Scenic routes',
    s: 'Adventures planned around panoramic views and mountain passes, not just the fastest route.',
    bg: '#b3d565',
    fg: '#0b1f12',
    numClass: 'text-[#096c27]',
    border: 'border-[#b3d565]',
    dark: false,
  },
  {
    t: 'Easy booking',
    s: 'Tell us what you love. We coordinate the logistics, verified guides, and 24/7 support.',
    bg: '#f3f8e6',
    fg: '#0b1f12',
    numClass: 'text-[#096c27]',
    border: 'border-[#096c27]/20',
    dark: false,
  },
  {
    t: 'Made for everyone',
    s: 'Couples, families and group retreats. Pick the pace and thrills that match your group.',
    bg: '#ffffff',
    fg: '#0b1f12',
    numClass: 'text-[#096c27]',
    border: 'border-slate-200/80',
    dark: false,
  },
]

const CATEGORIES = [
  { name: 'Adventure', span: 'lg:col-span-5', bg: '#b3d565', fg: '#0b1f12' },
  { name: 'Water Sports', span: 'lg:col-span-7', bg: '#096c27', fg: '#ffffff' },
  { name: 'Culture & Heritage', span: 'lg:col-span-4', bg: '#f3f8e6', fg: '#0b1f12' },
  { name: 'Wellness & Spa', span: 'lg:col-span-4', bg: '#ffffff', fg: '#0b1f12' },
  { name: 'Wildlife & Nature', span: 'lg:col-span-4', bg: '#06501b', fg: '#ffffff' },
]

const ACTIVITIES = [
  {
    id: 'rafting',
    title: 'White-Water Rafting',
    category: 'Water Sports',
    locations: ['Rishikesh', 'Brahmaputra', 'Interlaken'],
    gradient: 'linear-gradient(135deg,#096c27 0%,#06501b 60%,#0b1f12 100%)',
    image: raftingImage,
  },
  {
    id: 'parasailing',
    title: 'Parasailing',
    category: 'Water Sports',
    locations: ['Goa', 'Dubai', 'Phuket'],
    gradient: 'linear-gradient(135deg,#1b7f3b 0%,#096c27 55%,#0b1f12 100%)',
    image: parasailingImage,
  },
  {
    id: 'scuba',
    title: 'Scuba & Snorkeling',
    category: 'Water Sports',
    locations: ['Andaman', 'Maldives', 'Red Sea'],
    gradient: 'linear-gradient(135deg,#0e5c26 0%,#06501b 55%,#0b1f12 100%)',
    image: scubaImage,
  },
]

const EASE = [0.22, 1, 0.36, 1]
const pad = (n) => String(n).padStart(2, '0')

/* -------------------------------------------------------------------------- */
/*  Pieces                                                                    */
/* -------------------------------------------------------------------------- */

function Rise({ text, start = 0, reduced, className = '' }) {
  return (
    <span className={className}>
      {text.split(' ').map((w, i) => (
        <span key={i} className="mr-[0.2em] inline-block overflow-hidden pb-[0.1em] align-bottom last:mr-0">
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

function SectionHead({ eyebrow, title, accent, copy }) {
  return (
    <div className="grid gap-6 pt-4 lg:grid-cols-12">
      <p className="m-0 flex items-center gap-2.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#096c27] lg:col-span-3 sm:text-xs">
        <span className="h-2 w-2 rounded-full bg-[#b3d565] shadow-[0_0_8px_#b3d565]" />
        {eyebrow}
      </p>
      <div className="lg:col-span-9">
        <h2 className="m-0 font-nunito text-[clamp(36px,6.8vw,110px)] font-light uppercase leading-[0.9] tracking-[-0.05em] text-[#0b1f12]">
          {title} <span className="font-normal italic text-[#096c27]">{accent}</span>
        </h2>
        {copy && <p className="mb-0 mt-5 max-w-[520px] font-sans text-[16px] leading-relaxed text-[#0b1f12]/75">{copy}</p>}
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*  Main Activity / Experiences Page                                          */
/* -------------------------------------------------------------------------- */

export default function RoadTripHome() {
  const reduced = !!useReducedMotion()
  const [category, setCategory] = useState(null)

  const countFor = (c) => ACTIVITIES.filter((a) => a.category === c).length
  const shown = useMemo(() => (category ? ACTIVITIES.filter((a) => a.category === category) : ACTIVITIES), [category])

  const enquire = (title) =>
    window.dispatchEvent(
      new CustomEvent('open-booking-modal', { detail: { destination: `Activity: ${title}`, persons: '2 Persons', days: 'Activity Pass' } }),
    )

  return (
    <PageTransition>
      <main className="relative overflow-hidden bg-white text-[#0b1f12] antialiased selection:bg-[#b3d565] selection:text-[#0b1f12]">
        {/* ============================ HERO ============================ */}
        <section className="relative isolate flex min-h-[100svh] w-full flex-col overflow-hidden bg-[#096c27] text-white">
          {/* Video Layer */}
          <motion.div
            initial={reduced ? false : { opacity: 0, scale: 1.06 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.4, ease: EASE }}
            className="absolute inset-0 z-0"
            style={{ background: HERO.fallback }}
          >
            <video
              className="h-full w-full object-cover opacity-60 mix-blend-luminosity"
              src={HERO.video}
              poster={HERO.poster || undefined}
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
            />
          </motion.div>

          {/* Gradients and Ambient Tree Glow */}
          <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-b from-[#096c27]/80 via-[#06501b]/65 to-[#06501b]/95" />
          <div className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(ellipse_at_80%_0%,rgba(179,213,101,0.28),transparent_55%)]" />

          {/* Drifting subtle glow rings */}
          <div aria-hidden className="pointer-events-none absolute inset-0 z-10 overflow-hidden">
            <span className="absolute left-[6%] top-[14%] h-44 w-96 rounded-full bg-[#b3d565]/20 blur-3xl animate-[rt-cloud_26s_ease-in-out_infinite] motion-reduce:animate-none" />
            <span className="absolute right-[10%] top-[22%] h-48 w-[28rem] rounded-full bg-[#06501b]/40 blur-3xl animate-[rt-cloud_32s_ease-in-out_infinite_reverse] motion-reduce:animate-none" />
          </div>

          {/* Middle Content */}
          <div className="relative z-20 mx-auto grid w-full max-w-[1600px] flex-1 grid-rows-[1fr_auto_1fr] items-center px-5 pb-10 pt-28 sm:px-8 sm:pb-12 sm:pt-32 lg:px-12 lg:pt-28">
            <p className="m-0 max-w-[340px] self-start font-sans text-[13px] font-light leading-relaxed text-white/85 sm:text-sm">
              {HERO_COPY}
            </p>

            <h1 className="m-0 text-center font-nunito text-[clamp(48px,min(13.5vw,23svh),220px)] font-light uppercase leading-[0.85] tracking-[-0.055em] text-white">
              <Rise text={HERO.top} reduced={reduced} className="block" />
              <Rise text={HERO.bottom} start={0.15} reduced={reduced} className="block italic text-[#b3d565]" />
            </h1>
          </div>

          {/* Bottom Rail */}
          <footer className="relative z-20 mx-auto hidden w-full max-w-[1600px] items-center justify-between border-t border-white/20 px-5 pb-5 pt-3 text-[10px] font-medium uppercase tracking-[0.2em] text-white/80 sm:flex sm:px-8 sm:text-xs">
            {HERO_FEATURES.map((f) => (
              <span key={f} className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#b3d565]" />
                {f}
              </span>
            ))}
          </footer>
        </section>

        {/* ============================ WHY CARDS ============================ */}
        <section id="why" className="bg-[#f3f8e6] px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
          <div className="mx-auto max-w-[1600px]">
            <SectionHead eyebrow="Why travel with us" title="The journey is" accent="the holiday." />
            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {WHY.map((w, i) => (
                <motion.article
                  key={w.t}
                  initial={reduced ? false : { opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.9, ease: EASE, delay: i * 0.08 }}
                  whileHover={reduced ? undefined : { y: -8 }}
                  style={{ background: w.bg, color: w.fg }}
                  className={`flex min-h-[320px] flex-col justify-between rounded-[2rem] border p-7 shadow-sm transition-shadow duration-300 hover:shadow-xl sm:min-h-[380px] sm:p-8 ${w.border}`}
                >
                  <span className={`font-nunito text-[64px] font-light leading-none tracking-[-0.06em] ${w.numClass}`}>
                    {pad(i + 1)}
                  </span>
                  <div>
                    <h3 className="m-0 font-nunito text-[clamp(24px,2.4vw,34px)] font-light uppercase leading-[0.98] tracking-[-0.04em]">
                      {w.t}
                    </h3>
                    <p className={`mb-0 mt-3 font-sans text-[15px] leading-relaxed ${w.dark ? 'text-white/80' : 'text-[#0b1f12]/75'}`}>
                      {w.s}
                    </p>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        {/* ============================ CATEGORY CARDS ============================ */}
        <section className="bg-white px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
          <div className="mx-auto max-w-[1600px]">
            <SectionHead
              eyebrow="Pick your kind of trip"
              title="Choose your"
              accent="adventure."
              copy="Tap a category to filter the featured experiences below."
            />
            <div className="mt-12 grid gap-5 lg:grid-cols-12">
              {CATEGORIES.map((c, i) => {
                const on = category === c.name
                const n = countFor(c.name)
                return (
                  <motion.button
                    key={c.name}
                    type="button"
                    onClick={() => setCategory(on ? null : c.name)}
                    aria-pressed={on}
                    initial={reduced ? false : { opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.8, ease: EASE, delay: i * 0.06 }}
                    whileHover={reduced ? undefined : { scale: 0.985 }}
                    style={{ background: c.bg, color: c.fg }}
                    className={`group relative flex min-h-[220px] flex-col justify-between overflow-hidden rounded-[2rem] border border-[#096c27]/15 p-7 text-left transition-all duration-300 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#b3d565]/60 sm:min-h-[260px] sm:p-8 ${c.span} ${
                      on ? 'ring-4 ring-[#096c27] shadow-xl' : 'hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <span className="text-[11px] font-semibold uppercase tracking-[0.2em] opacity-80">
                        {pad(n)} {n === 1 ? 'experience' : 'experiences'}
                      </span>
                      <span className="grid h-11 w-11 place-items-center rounded-full border border-current transition-transform duration-500 group-hover:rotate-45">
                        <ArrowUpRight className="h-4 w-4" />
                      </span>
                    </div>
                    <h3 className="m-0 font-nunito text-[clamp(28px,3.6vw,56px)] font-light uppercase leading-[0.92] tracking-[-0.045em]">
                      {c.name}
                    </h3>
                  </motion.button>
                )
              })}
            </div>
          </div>
        </section>

        {/* ============================ ACTIVITY CARDS ============================ */}
        <section className="bg-[#f3f8e6] px-5 py-24 sm:px-8 sm:py-32 lg:px-12">
          <div className="mx-auto max-w-[1600px]">
            <SectionHead eyebrow="Featured experiences" title="Stop for" accent="the moment." />
            <AnimatePresence mode="wait" initial={false}>
              {shown.length ? (
                <motion.div
                  key={category || 'all'}
                  initial={reduced ? false : { opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4, ease: EASE }}
                  className="mt-12 grid gap-6 md:grid-cols-3"
                >
                  {shown.map((a, i) => (
                    <article
                      key={a.id}
                      className="group relative flex min-h-[460px] flex-col justify-between overflow-hidden rounded-[2rem] p-7 text-white shadow-lg transition-transform duration-500 hover:-translate-y-2 hover:shadow-2xl sm:min-h-[560px] sm:p-8"
                      style={{ background: a.gradient }}
                    >
                      {a.image && (
                        <img
                          src={a.image}
                          alt=""
                          loading="lazy"
                          className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] group-hover:scale-105"
                        />
                      )}
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0b1f12]/95 via-[#06501b]/45 to-black/30" />
                      
                      <div className="relative z-10 flex items-start justify-between text-[11px] font-semibold uppercase tracking-[0.2em]">
                        <span className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1 text-[#b3d565] backdrop-blur-sm">
                          <span className="h-1.5 w-1.5 rounded-full bg-[#b3d565]" />
                          {a.category}
                        </span>
                        <span className="rounded-full border border-white/20 bg-black/20 px-3 py-1 opacity-80">{pad(i + 1)}</span>
                      </div>

                      <span
                        aria-hidden
                        className="pointer-events-none absolute right-3 top-1/3 select-none font-nunito text-[clamp(120px,14vw,220px)] font-light leading-none tracking-[-0.07em] text-transparent [-webkit-text-stroke:1.5px_rgba(179,213,101,0.35)] transition-transform duration-700 group-hover:-translate-y-3"
                      >
                        {pad(i + 1)}
                      </span>

                      <div className="relative z-10">
                        <h3 className="m-0 font-nunito text-[clamp(28px,3vw,44px)] font-light uppercase leading-[0.95] tracking-[-0.04em] text-white">
                          {a.title}
                        </h3>
                        <ul className="m-0 mt-4 flex list-none flex-wrap gap-2 p-0">
                          {a.locations.map((l) => (
                            <li
                              key={l}
                              className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-[#096c27]/40 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.08em] text-white backdrop-blur-sm"
                            >
                              <MapPin className="h-3 w-3 text-[#b3d565]" aria-hidden="true" />
                              {l}
                            </li>
                          ))}
                        </ul>
                        <button
                          type="button"
                          onClick={() => enquire(a.title)}
                          className="mt-6 inline-flex items-center gap-3 rounded-full bg-[#b3d565] py-2 pl-6 pr-2 text-xs font-semibold text-[#0b1f12] transition-all duration-300 hover:bg-white hover:shadow-[0_0_30px_-5px_#b3d565] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#b3d565]"
                        >
                          Enquire for this pass
                          <span className="grid h-9 w-9 place-items-center rounded-full bg-[#096c27] text-white transition-transform duration-500 group-hover:rotate-[360deg]">
                            <ArrowUpRight className="h-4 w-4" />
                          </span>
                        </button>
                      </div>
                    </article>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  key={`empty-${category}`}
                  initial={reduced ? false : { opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4, ease: EASE }}
                  className="mt-12 rounded-[2rem] border border-[#096c27]/25 bg-white p-10 sm:p-14"
                >
                  <p className="m-0 font-nunito text-[clamp(32px,5vw,72px)] font-light uppercase leading-[0.92] tracking-[-0.05em] text-[#0b1f12]">
                    Coming <span className="italic text-[#096c27]">soon.</span>
                  </p>
                  <p className="mb-0 mt-4 max-w-[380px] font-sans text-[15px] leading-relaxed text-[#0b1f12]/70">
                    We are currently curating verified {category?.toLowerCase()} experiences with our affiliated properties.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>

        {/* ============================ CTA ============================ */}
        <section className="relative isolate overflow-hidden bg-[#096c27] text-white px-5 py-24 sm:px-8 sm:py-32 lg:px-12">
          {/* Atmosphere and Concentric Rings */}
          <div aria-hidden className="pointer-events-none absolute -bottom-40 left-1/2 h-[420px] w-[620px] -translate-x-1/2 rounded-full bg-[#b3d565]/25 blur-[130px]" />
          <div aria-hidden className="pointer-events-none absolute -right-[10%] -top-[30%] h-[50vw] w-[50vw] rounded-full border border-white/10" />

          <div className="relative z-10 mx-auto flex max-w-[1600px] flex-col items-start gap-10">
            <h2 className="m-0 font-nunito text-[clamp(44px,9.5vw,160px)] font-light uppercase leading-[0.88] tracking-[-0.055em] text-white">
              Start the
              <br />
              <span className="italic text-[#b3d565]">adventure.</span>
            </h2>
            <div className="flex w-full flex-wrap items-center justify-between gap-6">
              <button
                type="button"
                onClick={() => enquire('Custom activity & experience package')}
                className="group inline-flex items-center gap-4 rounded-full bg-[#b3d565] py-2 pl-8 pr-2 text-[15px] font-semibold text-[#0b1f12] shadow-lg transition-all duration-300 hover:bg-[#c6e67e] hover:shadow-[0_0_40px_-6px_#b3d565] focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <span>Plan your experience</span>
                <span className="grid h-11 w-11 place-items-center rounded-full bg-[#096c27] text-white transition-transform duration-500 group-hover:rotate-[360deg]">
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </button>
              <p className="m-0 max-w-[340px] font-sans text-sm font-light leading-relaxed text-white/80">
                Tell us where you are headed and what you would love to try. Our travel desk will curate every detail.
              </p>
            </div>
          </div>
        </section>

        <style>{`
          @keyframes rt-cloud { 0%, 100% { transform: translateX(0); } 50% { transform: translateX(60px); } }
        `}</style>
      </main>
    </PageTransition>
  )
}