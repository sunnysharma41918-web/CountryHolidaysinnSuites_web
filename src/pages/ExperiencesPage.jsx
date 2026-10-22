import { useMemo, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowUpRight, MapPin } from 'lucide-react'
import PageTransition from '../components/layout/PageTransition'
import raftingImage from '../assets/images/White-Water Rafting.jpg'
import parasailingImage from '../assets/images/Parasailing.jpeg'
import scubaImage from '../assets/images/Scuba & Snorkeling.avif'

/* -------------------------------------------------------------------------- */
/*  EDIT HERE                                                                 */
/*  1. Put your car video in /public and set `video` to its root URL.         */
/*  2. Optional `poster` image shows while the video loads.                   */
/*  Add or remove slides freely. The arrows cycle through them.               */
/* -------------------------------------------------------------------------- */

const HERO = {
  video: '/car-travel.mp4',
  poster: '',
  top: 'Ride into',
  bottom: 'your holiday',
  fallback: 'linear-gradient(160deg,#ffd9a8 0%,#ff9a5c 55%,#ff5938 100%)',
}

const HERO_COPY =
  'We believe in turning a drive into the best part of your holiday. Thoughtfully planned stays, open roads and experiences worth stopping for.'

const HERO_FEATURES = ['Curated stays', 'Scenic routes', 'Easy booking']

const WHY = [
  { t: 'Curated stays', s: 'Hand-picked places to rest, so every stop on the road feels like part of the trip.', bg: '#0d0d0c', fg: '#efeae0' },
  { t: 'Scenic routes', s: 'Drives planned around the views, not just the fastest way there.', bg: '#ff5938', fg: '#0d0d0c' },
  { t: 'Easy booking', s: 'Tell us what you want. We take care of the details and stay in touch.', bg: '#f6c98f', fg: '#0d0d0c' },
  { t: 'Made for everyone', s: 'Couples, families and friends. Pick the pace that suits your group.', bg: '#fffaf0', fg: '#0d0d0c' },
]

const CATEGORIES = [
  { name: 'Adventure', span: 'lg:col-span-5', bg: '#ff5938', fg: '#0d0d0c' },
  { name: 'Water Sports', span: 'lg:col-span-7', bg: '#0d0d0c', fg: '#efeae0' },
  { name: 'Culture & Heritage', span: 'lg:col-span-4', bg: '#f6c98f', fg: '#0d0d0c' },
  { name: 'Wellness & Spa', span: 'lg:col-span-4', bg: '#fffaf0', fg: '#0d0d0c' },
  { name: 'Wildlife & Nature', span: 'lg:col-span-4', bg: '#2f6f57', fg: '#efeae0' },
]

const ACTIVITIES = [
  {
    id: 'rafting',
    title: 'White-Water Rafting',
    category: 'Water Sports',
    locations: ['Rishikesh', 'Brahmaputra', 'Interlaken'],
    gradient: 'linear-gradient(135deg,#1d7a8c 0%,#0f3d4a 60%,#0d0d0c 100%)',
    image: raftingImage,
  },
  {
    id: 'parasailing',
    title: 'Parasailing',
    category: 'Water Sports',
    locations: ['Goa', 'Dubai', 'Phuket'],
    gradient: 'linear-gradient(135deg,#ff5938 0%,#a8321c 55%,#0d0d0c 100%)',
    image: parasailingImage,
  },
  {
    id: 'scuba',
    title: 'Scuba & Snorkeling',
    category: 'Water Sports',
    locations: ['Andaman', 'Maldives', 'Red Sea'],
    gradient: 'linear-gradient(135deg,#2aa7b8 0%,#115e75 55%,#0d0d0c 100%)',
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
      <p className="m-0 flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.14em] lg:col-span-3 sm:text-xs">
        <span className="h-2 w-2 animate-pulse rounded-full bg-[#ff5938]" />
        {eyebrow}
      </p>
      <div className="lg:col-span-9">
        <h2 className="m-0 font-sans text-[clamp(38px,7vw,120px)] font-semibold uppercase leading-[0.88] tracking-[-0.055em]">
          {title} <span className="text-[#ff5938]">{accent}</span>
        </h2>
        {copy && <p className="mb-0 mt-5 max-w-[480px] text-[16px] leading-relaxed text-[#0d0d0c]/70">{copy}</p>}
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*  Page                                                                      */
/* -------------------------------------------------------------------------- */

export default function RoadTripHome() {
  const reduced = !!useReducedMotion()
  const [category, setCategory] = useState(null)

  const countFor = (c) => ACTIVITIES.filter((a) => a.category === c).length
  const shown = useMemo(() => (category ? ACTIVITIES.filter((a) => a.category === category) : ACTIVITIES), [category])

  const enquire = (title) =>
    window.dispatchEvent(
      new CustomEvent('open-booking-modal', { detail: { destination: `Activity: ${title}`, persons: '', days: '' } }),
    )

  return (
    <PageTransition>
      <main style={{ background: '#efeae0', color: '#0d0d0c' }} className="relative overflow-hidden">
        {/* ============================ HERO ============================ */}
        <section className="relative isolate flex min-h-[100svh] w-full flex-col overflow-hidden bg-[#0d0d0c] text-[#efeae0]">
          {/* video layer */}
          <motion.div
            initial={reduced ? false : { opacity: 0, scale: 1.06 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.4, ease: EASE }}
            className="absolute inset-0 z-0"
            style={{ background: HERO.fallback }}
          >
            <video
              className="h-full w-full object-cover"
              src={HERO.video}
              poster={HERO.poster || undefined}
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
            />
          </motion.div>

          {/* readability + warmth */}
          <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-b from-[#0d0d0c]/45 via-[#0d0d0c]/10 to-[#0d0d0c]/70" />
          <div className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(ellipse_at_80%_0%,rgba(255,89,56,0.18),transparent_55%)]" />

          {/* drifting clouds */}
          <div aria-hidden className="pointer-events-none absolute inset-0 z-10 overflow-hidden">
            <span className="absolute left-[6%] top-[14%] h-24 w-56 rounded-full bg-white/20 blur-2xl animate-[rt-cloud_26s_ease-in-out_infinite] motion-reduce:animate-none" />
            <span className="absolute right-[10%] top-[22%] h-28 w-72 rounded-full bg-white/15 blur-2xl animate-[rt-cloud_32s_ease-in-out_infinite_reverse] motion-reduce:animate-none" />
          </div>

          {/* middle */}
          <div className="relative z-20 mx-auto grid w-full max-w-[1600px] flex-1 grid-rows-[1fr_auto_1fr] items-center px-5 pb-10 pt-28 sm:px-8 sm:pb-12 sm:pt-32 lg:px-12 lg:pt-28">
            <p className="m-0 max-w-[320px] self-start text-[13px] leading-relaxed text-[#efeae0]/90 sm:text-sm">{HERO_COPY}</p>

            <h1 className="m-0 text-center font-sans text-[clamp(48px,min(13.5vw,23svh),220px)] font-semibold uppercase leading-[0.84] tracking-[-0.06em]">
              <Rise text={HERO.top} reduced={reduced} className="block" />
              <Rise text={HERO.bottom} start={0.15} reduced={reduced} className="block text-[#ff5938]" />
            </h1>

          </div>

          {/* bottom rail */}
          <footer className="relative z-20 mx-auto hidden w-full max-w-[1600px] items-center justify-between border-t border-[#efeae0]/40 px-5 pb-5 pt-3 text-[10px] font-medium uppercase tracking-[0.14em] sm:flex sm:px-8 sm:text-xs">
            {HERO_FEATURES.map((f) => (
              <span key={f}>{f}</span>
            ))}
          </footer>
        </section>

        {/* ============================ WHY CARDS ============================ */}
        <section id="why" className="mx-auto max-w-[1600px] scroll-mt-0 px-5 py-20 sm:px-8 sm:py-28">
          <SectionHead eyebrow="Why travel with us" title="The journey is" accent="the holiday." />
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {WHY.map((w, i) => (
              <motion.article
                key={w.t}
                initial={reduced ? false : { opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.9, ease: EASE, delay: i * 0.08 }}
                whileHover={reduced ? undefined : { y: -8, rotate: i % 2 ? 1 : -1 }}
                style={{ background: w.bg, color: w.fg }}
                className="flex min-h-[320px] flex-col justify-between rounded-[22px] border border-[#0d0d0c]/10 p-6 shadow-[0_30px_60px_-40px_rgba(0,0,0,0.5)] sm:min-h-[380px] sm:p-7"
              >
                <span className="font-sans text-[64px] font-semibold leading-none tracking-[-0.06em] opacity-90">{pad(i + 1)}</span>
                <div>
                  <h3 className="m-0 font-sans text-[clamp(26px,2.6vw,38px)] font-semibold uppercase leading-[0.95] tracking-[-0.04em]">{w.t}</h3>
                  <p className="mb-0 mt-3 text-[15px] leading-relaxed opacity-80">{w.s}</p>
                </div>
              </motion.article>
            ))}
          </div>
        </section>

        {/* ============================ CATEGORY CARDS ============================ */}
        <section className="mx-auto max-w-[1600px] px-5 pb-20 sm:px-8 sm:pb-28">
          <SectionHead eyebrow="Pick your kind of trip" title="Choose your" accent="adventure." copy="Tap a category to filter the featured experiences below." />
          <div className="mt-12 grid gap-4 lg:grid-cols-12">
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
                  className={`group relative flex min-h-[220px] flex-col justify-between overflow-hidden rounded-[22px] p-6 text-left focus:outline-none focus-visible:ring-4 focus-visible:ring-[#ff5938]/60 sm:min-h-[260px] sm:p-7 ${c.span} ${
                    on ? 'ring-4 ring-[#0d0d0c]' : ''
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <span className="text-[11px] font-medium uppercase tracking-[0.14em] opacity-80">
                      {pad(n)} {n === 1 ? 'experience' : 'experiences'}
                    </span>
                    <span className="grid h-11 w-11 place-items-center rounded-full border border-current transition-transform duration-500 group-hover:rotate-45">
                      <ArrowUpRight className="h-4 w-4" />
                    </span>
                  </div>
                  <h3 className="m-0 font-sans text-[clamp(30px,4vw,64px)] font-semibold uppercase leading-[0.9] tracking-[-0.05em]">{c.name}</h3>
                </motion.button>
              )
            })}
          </div>
        </section>

        {/* ============================ ACTIVITY CARDS ============================ */}
        <section className="mx-auto max-w-[1600px] px-5 pb-24 sm:px-8 sm:pb-32">
          <SectionHead eyebrow="Featured experiences" title="Stop for" accent="the moment." />
          <AnimatePresence mode="wait" initial={false}>
            {shown.length ? (
              <motion.div
                key={category || 'all'}
                initial={reduced ? false : { opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, ease: EASE }}
                className="mt-12 grid gap-4 md:grid-cols-3"
              >
                {shown.map((a, i) => (
                  <article
                    key={a.id}
                    className="group relative flex min-h-[460px] flex-col justify-between overflow-hidden rounded-[22px] p-6 text-[#efeae0] sm:min-h-[560px] sm:p-7"
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
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0d0d0c]/90 via-[#0d0d0c]/35 to-[#0d0d0c]/25" />
                    <div className="relative z-10 flex items-start justify-between text-[11px] font-medium uppercase tracking-[0.14em]">
                      <span className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#ff5938]" />
                        {a.category}
                      </span>
                      <span className="opacity-70">{pad(i + 1)}</span>
                    </div>
                    <span aria-hidden className="pointer-events-none absolute right-3 top-1/3 select-none font-sans text-[clamp(120px,14vw,220px)] font-semibold leading-none tracking-[-0.07em] text-transparent [-webkit-text-stroke:1.5px_rgba(239,234,224,0.45)] transition-transform duration-700 group-hover:-translate-y-3">
                      {pad(i + 1)}
                    </span>
                    <div className="relative z-10">
                      <h3 className="m-0 font-sans text-[clamp(28px,3vw,44px)] font-semibold uppercase leading-[0.92] tracking-[-0.045em]">{a.title}</h3>
                      <ul className="m-0 mt-4 flex list-none flex-wrap gap-2 p-0">
                        {a.locations.map((l) => (
                          <li key={l} className="inline-flex items-center gap-1.5 rounded-full border border-[#efeae0]/50 bg-[#0d0d0c]/25 px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.08em] backdrop-blur-sm">
                            <MapPin className="h-3 w-3 text-[#ff5938]" aria-hidden="true" />
                            {l}
                          </li>
                        ))}
                      </ul>
                      <button
                        type="button"
                        onClick={() => enquire(a.title)}
                        className="mt-6 inline-flex items-center gap-3 rounded-full bg-[#efeae0] py-1.5 pl-5 pr-1.5 text-[13px] font-semibold text-[#0d0d0c] transition-colors hover:bg-[#ff5938] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ff5938] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0d0d0c]"
                      >
                        Enquire
                        <span className="grid h-9 w-9 place-items-center rounded-full bg-[#0d0d0c] text-[#efeae0] transition-transform duration-500 group-hover:rotate-45">
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
                className="mt-12 rounded-[22px] border border-[#0d0d0c] p-10 sm:p-14"
              >
                <p className="m-0 font-sans text-[clamp(32px,5vw,72px)] font-semibold uppercase leading-[0.92] tracking-[-0.05em]">
                  Coming <span className="font-serif font-normal normal-case italic text-[#ff5938]">soon.</span>
                </p>
                <p className="mb-0 mt-4 max-w-[380px] text-[15px] leading-relaxed text-[#0d0d0c]/70">
                  We are curating {category?.toLowerCase()} experiences. Pick another category or check back shortly.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* ============================ CTA ============================ */}
        <section style={{ background: '#0d0d0c', color: '#efeae0' }} className="relative overflow-hidden">
          <div aria-hidden className="pointer-events-none absolute -bottom-40 left-1/2 h-[420px] w-[620px] -translate-x-1/2 rounded-full bg-[#ff5938]/30 blur-[130px]" />
          <div className="relative mx-auto flex max-w-[1600px] flex-col items-start gap-10 px-5 py-24 sm:px-8 sm:py-32">
            <h2 className="m-0 font-sans text-[clamp(44px,9.5vw,170px)] font-semibold uppercase leading-[0.86] tracking-[-0.055em]">
              Start the
              <br />
              <span className="font-serif font-normal normal-case italic text-[#ff5938]">engine.</span>
            </h2>
            <div className="flex w-full flex-wrap items-center justify-between gap-6">
              <button
                type="button"
                onClick={() => enquire('Road trip enquiry')}
                className="group inline-flex items-center gap-4 rounded-full bg-[#ff5938] py-1.5 pl-7 pr-1.5 text-[15px] font-semibold text-[#0d0d0c] transition-colors hover:bg-[#ff6e51] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ff5938] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0d0d0c]"
              >
                <span className="py-2.5">Plan your trip</span>
                <span className="grid h-11 w-11 place-items-center rounded-full bg-[#0d0d0c] text-[#efeae0] transition-transform duration-500 group-hover:rotate-45">
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </button>
              <p className="m-0 max-w-[320px] text-sm leading-relaxed text-[#efeae0]/60">
                Tell us where you are headed and what you would love to try. We will take it from there.
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