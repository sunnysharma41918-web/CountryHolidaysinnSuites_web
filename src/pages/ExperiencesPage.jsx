import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import {
  Activity,
  ArrowUpRight,
  Bird,
  CalendarCheck,
  Compass,
  Fish,
  Flower2,
  Headset,
  Landmark,
  LifeBuoy,
  MapPin,
  Mountain,
  PawPrint,
  Route,
  ShieldCheck,
  Sun,
  Trees,
  Users,
  Utensils,
  Wind,
} from 'lucide-react'
import PageTransition from '../components/layout/PageTransition'
import ProcessWaveSection from '../components/sections/ProcessWaveSection'
import raftingImage from '../assets/images/White-Water Rafting.jpg'
import parasailingImage from '../assets/images/Parasailing.jpeg'
import scubaImage from '../assets/images/Scuba & Snorkeling.avif'
import travelDoodlesGreen from '../assets/travel-doodles-green.png'

/* -------------------------------------------------------------------------- */
/*  CHIS "Tree" palette                                                       */
/*  green #096c27 · leaf #b3d565 · white · ink #0b1f12 · mist #f3f8e6         */
/*  depth #06501b                                                             */
/* -------------------------------------------------------------------------- */

const HERO = {
  video: '/car-travel.mp4',
  poster: '',
  top: 'Ride into',
  bottom: 'your holiday',
  fallback: 'linear-gradient(160deg,#096c27 0%,#06501b 55%,#0b1f12 100%)',
}

const HERO_COPY =
  'Turn every journey into the best part of your holiday. Thoughtfully planned stays, open vistas and experiences worth stopping for.'

const HERO_FEATURES = [
  { icon: ShieldCheck, label: 'Curated stays' },
  { icon: Route, label: 'Scenic adventures' },
  { icon: CalendarCheck, label: 'Seamless booking' },
]

const WHY = [
  {
    t: 'Curated stays',
    s: 'Hand-picked retreats so every stop on the road feels like a destination.',
    icon: ShieldCheck,
    image:
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=900&q=80',
  },
  {
    t: 'Open roads',
    s: 'Routes mapped for the views, with easy detours to hidden lookouts.',
    icon: Compass,
    image:
      'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=900&q=80',
  },
  {
    t: 'Local flavors',
    s: 'Roadside cafes, vineyard tastings and heritage dining along the way.',
    icon: Utensils,
    image:
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=900&q=80',
  },
  {
    t: 'Guided pauses',
    s: 'Nature walks, wildlife drives and sunrise viewpoints led by locals.',
    icon: Mountain,
    image:
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=900&q=80',
  },
]

const FILTERS = [
  'Water & Ocean Sports',
  'Mountain & Aerial',
  'Culture & Heritage',
  'Wellness & Spa',
  'Wildlife & Nature',
]

const CAT_GRADIENT = {
  'Water & Ocean Sports': 'linear-gradient(145deg, #063d27 0%, #096c27 60%, #174e20 100%)',
  'Mountain & Aerial': 'linear-gradient(145deg, #094723 0%, #0d5f30 60%, #1e5f26 100%)',
  'Culture & Heritage': 'linear-gradient(145deg, #1b3d17 0%, #265c20 60%, #357a2e 100%)',
  'Wellness & Spa': 'linear-gradient(145deg, #063a23 0%, #096c27 55%, #1d7237 100%)',
  'Wildlife & Nature': 'linear-gradient(145deg, #0c3d1a 0%, #165b26 60%, #297f33 100%)',
}

const ACTIVITIES = [
  {
    id: 'scuba',
    title: 'Scuba Diving & Snorkeling',
    category: 'Water & Ocean Sports',
    tag: 'Ocean Sports',
    locations: ['Goa', 'Andaman', 'Pattaya', 'Bali', 'Phuket'],
    icon: Fish,
    image: scubaImage,
  },
  {
    id: 'rafting',
    title: 'White-Water Rafting',
    category: 'Water & Ocean Sports',
    tag: 'Adventure',
    locations: ['Rishikesh', 'Manali', 'Bali'],
    icon: LifeBuoy,
    image: raftingImage,
  },
  {
    id: 'parasailing',
    title: 'Parasailing & Jet Ski',
    category: 'Water & Ocean Sports',
    tag: 'Coastal Thrills',
    locations: ['Goa', 'Pattaya', 'Dubai', 'Phuket'],
    icon: Wind,
    image: parasailingImage,
  },
  {
    id: 'kayaking',
    title: 'Backwater Kayaking',
    category: 'Water & Ocean Sports',
    tag: 'Eco-Tour',
    locations: ['Alleppey', 'Kochi', 'Krabi'],
    icon: Fish,
  },
  {
    id: 'hotair',
    title: 'Hot Air Ballooning',
    category: 'Mountain & Aerial',
    tag: 'Sky High',
    locations: ['Jaipur', 'Pushkar', 'Cappadocia', 'Dubai'],
    icon: Wind,
    image: 'https://images.unsplash.com/photo-1507608869274-d3177c8bb4c7?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'paragliding',
    title: 'Tandem Paragliding',
    category: 'Mountain & Aerial',
    tag: 'Mountain Sports',
    locations: ['Manali', 'Bir Billing', 'Pokhara'],
    icon: Wind,
  },
  {
    id: 'zipline',
    title: 'Canopy Ziplining',
    category: 'Mountain & Aerial',
    tag: 'Adrenaline',
    locations: ['Rishikesh', 'Munnar', 'Chiang Mai'],
    icon: Activity,
  },
  {
    id: 'trekking',
    title: 'Alpine Day Treks',
    category: 'Mountain & Aerial',
    tag: 'Highlands',
    locations: ['Shimla', 'McLeod Ganj', 'Tatra Mountains'],
    icon: Mountain,
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'heritage',
    title: 'Heritage Walks',
    category: 'Culture & Heritage',
    tag: 'Culture & Heritage',
    locations: ['Jaipur', 'Varanasi', 'Old Delhi'],
    icon: Landmark,
    image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'food',
    title: 'Culinary Food Tours',
    category: 'Culture & Heritage',
    tag: 'Culture',
    locations: ['Mumbai', 'Paris', 'Bangkok'],
    icon: Utensils,
  },
  {
    id: 'ayurveda',
    title: 'Ayurveda & Spa',
    category: 'Wellness & Spa',
    tag: 'Wellness',
    locations: ['Kerala', 'Bali', 'Chiang Mai'],
    icon: Flower2,
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'yoga',
    title: 'Yoga Retreats',
    category: 'Wellness & Spa',
    tag: 'Wellness',
    locations: ['Rishikesh', 'Mysore', 'Ubud, Bali'],
    icon: Flower2,
  },
  {
    id: 'tiger',
    title: 'Tiger Safari',
    category: 'Wildlife & Nature',
    tag: 'Wildlife',
    locations: ['Ranthambore', 'Jim Corbett', 'Bandhavgarh'],
    icon: PawPrint,
    image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'birds',
    title: 'Bird Watching',
    category: 'Wildlife & Nature',
    tag: 'Wildlife & Nature',
    locations: ['Bharatpur', 'Kaziranga', 'Sundarbans'],
    icon: Bird,
  },
]

const STEPS = [
  { t: 'Tell us what you love', s: 'Share your dates, group size and the kind of thrill or calm you want.' },
  { t: 'We curate the details', s: 'Verified guides, stays and transfers, planned and confirmed by our travel desk.' },
  { t: 'Show up and enjoy', s: 'Everything is arranged, with real people on call 24/7 while you travel.' },
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
      className={`font-varela inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] ${dark
          ? 'border-white/20 bg-white/10 text-white/90 backdrop-blur-md'
          : 'border-[#096c27]/15 bg-white text-[#096c27]'
        }`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-[#b3d565] shadow-[0_0_8px_#b3d565]" />
      {children}
    </span>
  )
}

function SectionHead({ eyebrow, title, accent, copy, right }) {
  return (
    <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h2 className="m-0 mt-4 font-rader text-[clamp(26px,3.6vw,44px)] font-bold leading-[1.08] tracking-tight text-[#0b1f12]">
          {title} <span className="font-bold text-[#096c27]">{accent}</span>
        </h2>
        {copy && <p className="mb-0 mt-3 max-w-xl font-varela text-[15px] leading-relaxed text-[#0b1f12]/75">{copy}</p>}
      </div>
      {right}
    </div>
  )
}

function ActivityCard({ a, i, onEnquire, reduced }) {
  const [imgOk, setImgOk] = useState(true)
  const Icon = a.icon
  const hasImg = a.image && imgOk

  return (
    <motion.button
      layout={!reduced}
      type="button"
      onClick={() => onEnquire(a.title)}
      initial={reduced ? false : { opacity: 0, scale: 0.94, y: 16 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={reduced ? undefined : { opacity: 0, scale: 0.94 }}
      transition={{ duration: 0.45, ease: EASE, delay: Math.min(i, 8) * 0.03 }}
      style={{ background: CAT_GRADIENT[a.category] }}
      className="group relative flex h-[300px] w-full flex-col justify-between overflow-hidden rounded-3xl p-4 text-left text-white shadow-[0_1px_2px_rgba(11,31,18,0.12)] transition-shadow duration-300 hover:shadow-[0_18px_40px_-12px_rgba(6,80,27,0.55)] focus:outline-none focus-visible:ring-4 focus-visible:ring-[#b3d565]/70 sm:h-[320px]"
      aria-label={`Enquire about ${a.title}`}
    >
      {hasImg ? (
        <img
          src={a.image}
          alt=""
          loading="lazy"
          onError={() => setImgOk(false)}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.07]"
        />
      ) : (
        <>
          <Icon
            aria-hidden
            strokeWidth={1}
            className="absolute -right-6 top-6 h-44 w-44 text-[#b3d565]/20 transition-transform duration-700 group-hover:-rotate-6 group-hover:scale-110"
          />
          <div
            aria-hidden
            className="absolute inset-0 opacity-40"
            style={{
              backgroundImage: 'radial-gradient(rgba(255,255,255,0.14) 1px, transparent 1px)',
              backgroundSize: '16px 16px',
            }}
          />
        </>
      )}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0b1f12]/90 via-[#0b1f12]/25 to-transparent" />

      {/* top row */}
      <div className="relative z-10 flex items-start justify-between font-varela">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-black/30 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-white/95 backdrop-blur-md">
          <Icon className="h-3 w-3 text-[#b3d565]" aria-hidden />
          {a.tag}
        </span>
        <span className="grid h-9 w-9 place-items-center rounded-full border border-white/25 bg-white/10 text-white backdrop-blur-md transition-all duration-300 group-hover:rotate-45 group-hover:border-[#b3d565] group-hover:bg-[#b3d565] group-hover:text-[#0b1f12]">
          <ArrowUpRight className="h-4 w-4" aria-hidden />
        </span>
      </div>

      {/* bottom */}
      <div className="relative z-10">
        <h3 className="m-0 font-rader text-[19px] font-bold leading-tight tracking-tight sm:text-[20px]">
          {a.title}
        </h3>
        <p className="m-0 mt-2 flex items-start gap-1.5 font-varela text-[12.5px] leading-snug text-white/75">
          <MapPin className="mt-[1px] h-3.5 w-3.5 shrink-0 text-[#b3d565]" aria-hidden />
          <span>{a.locations.join(' · ')}</span>
        </p>
        <span className="mt-3 font-varela inline-flex max-h-0 items-center gap-1 overflow-hidden text-[12px] font-bold text-[#b3d565] opacity-0 transition-all duration-300 group-hover:max-h-6 group-hover:opacity-100">
          Enquire now <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
        </span>
      </div>
    </motion.button>
  )
}

/* -------------------------------------------------------------------------- */
/*  Page                                                                      */
/* -------------------------------------------------------------------------- */

export default function RoadTripHome() {
  const reduced = !!useReducedMotion()
  const [category, setCategory] = useState(null)

  const countFor = (c) => ACTIVITIES.filter((a) => a.category === c).length
  const shown = useMemo(
    () => (category ? ACTIVITIES.filter((a) => a.category === category) : ACTIVITIES),
    [category],
  )

  const navigate = useNavigate()
  const enquire = (title) =>
    navigate(`/contact?subject=${encodeURIComponent(`Activity: ${title}`)}`)

  const goExperiences = () =>
    document.getElementById('experiences')?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' })

  return (
    <PageTransition>
      <main className="page-activity relative overflow-hidden bg-white text-[#0b1f12] antialiased selection:bg-[#b3d565] selection:text-[#0b1f12]">
        {/* Outer layer: travel doodle background with soft light shadow */}
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 -z-10 bg-repeat opacity-[0.10] [filter:drop-shadow(0_4px_12px_rgba(41,127,51,0.28))_drop-shadow(0_1px_4px_rgba(0,0,0,0.06))]"
          style={{
            backgroundImage: `url(${travelDoodlesGreen})`,
            backgroundSize: '580px auto',
          }}
        />

        {/* ============================ HERO ============================ */}
        <section className="relative isolate flex min-h-[100svh] w-full flex-col overflow-hidden bg-[#096c27] text-white">
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

          <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-b from-[#096c27]/70 via-[#06501b]/55 to-[#06501b]/95" />
          <div className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(ellipse_at_80%_0%,rgba(179,213,101,0.28),transparent_55%)]" />
          <div aria-hidden className="pointer-events-none absolute inset-0 z-10 overflow-hidden">
            <span className="absolute left-[6%] top-[14%] h-44 w-96 rounded-full bg-[#b3d565]/20 blur-3xl animate-[rt-cloud_26s_ease-in-out_infinite] motion-reduce:animate-none" />
            <span className="absolute right-[10%] top-[22%] h-48 w-[28rem] rounded-full bg-[#06501b]/40 blur-3xl animate-[rt-cloud_32s_ease-in-out_infinite_reverse] motion-reduce:animate-none" />
          </div>

          <div className="relative z-20 mx-auto flex w-full max-w-[1400px] flex-1 flex-col justify-end gap-8 px-5 pb-10 pt-32 sm:px-8 sm:pb-14 lg:px-12">
            <motion.div
              initial={reduced ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: EASE, delay: 0.1 }}
            >
              <span className="font-varela inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-white/90 backdrop-blur-md">
                <Compass className="h-3.5 w-3.5 text-[#b3d565]" aria-hidden />
                Experiences &amp; activities
              </span>
            </motion.div>

            <h1 className="m-0 font-rader font-bold text-[clamp(2.6rem,7.6vw,6.5rem)] leading-[0.95] tracking-tight text-white">
              <Rise text={HERO.top} reduced={reduced} className="block" />
              <Rise text={HERO.bottom} start={0.15} reduced={reduced} className="block font-bold text-[#b3d565]" />
            </h1>

            <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-md">
                <p className="m-0 font-varela text-[15px] leading-relaxed text-white/80">{HERO_COPY}</p>

                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={goExperiences}
                    className="font-varela group inline-flex items-center gap-3 rounded-full bg-[#b3d565] py-1.5 pl-5 pr-1.5 text-[13px] font-bold text-[#0b1f12] transition-all duration-300 hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                  >
                    Explore experiences
                    <span className="grid h-8 w-8 place-items-center rounded-full bg-[#096c27] text-white transition-transform duration-500 group-hover:rotate-45">
                      <ArrowUpRight className="h-4 w-4" aria-hidden />
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => enquire('Custom activity & experience package')}
                    className="font-varela font-bold rounded-full border border-white/30 px-5 py-2.5 text-[13px] text-white transition-colors duration-300 hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                  >
                    Plan my trip
                  </button>
                </div>
              </div>

              <ul className="m-0 grid list-none grid-cols-1 min-[380px]:grid-cols-3 gap-2.5 p-0 sm:max-w-xl font-varela">
                {HERO_FEATURES.map(({ icon: Icon, label }) => (
                  <li
                    key={label}
                    className="flex flex-col gap-3 rounded-2xl border border-white/15 bg-white/10 p-3.5 backdrop-blur-md sm:p-4"
                  >
                    <span className="grid h-8 w-8 place-items-center rounded-full bg-[#b3d565] text-[#0b1f12]">
                      <Icon className="h-4 w-4" aria-hidden />
                    </span>
                    <span className="text-[12px] font-bold leading-tight text-white/90 sm:text-[13px]">{label}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ============================ WHY ============================ */}
        <section id="why" className="bg-[#f3f8e6] px-5 py-16 sm:px-8 sm:py-20 lg:px-12">
          <div className="mx-auto max-w-[1400px]">
            <SectionHead eyebrow="Why travel with us" title="The journey is" accent="the holiday." />
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {WHY.map((w, i) => {
                const Icon = w.icon
                return (
                  <motion.article
                    key={w.t}
                    initial={reduced ? false : { opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.7, ease: EASE, delay: i * 0.07 }}
                    whileHover={reduced ? undefined : { y: -5 }}
                    className="group relative flex min-h-[220px] sm:min-h-[240px] flex-col justify-between overflow-hidden rounded-3xl p-5 text-white shadow-md transition-all duration-300 hover:shadow-2xl"
                  >
                    {/* Photographic background with smooth zoom on hover */}
                    <img
                      src={w.image}
                      alt=""
                      loading="lazy"
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                    />

                    {/* Dark shade gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/35 transition-opacity duration-300 group-hover:from-black/85 group-hover:via-black/55" />

                    {/* Card header */}
                    <div className="relative z-10 flex items-start justify-between font-varela">
                      <span className="grid h-10 w-10 place-items-center rounded-full bg-white/20 text-[#b3d565] backdrop-blur-md ring-1 ring-white/25">
                        <Icon className="h-[18px] w-[18px]" aria-hidden />
                      </span>
                      <span className="text-xs font-bold tracking-[0.16em] text-white/75">{pad(i + 1)}</span>
                    </div>

                    {/* Card body */}
                    <div className="relative z-10">
                      <h3 className="m-0 font-rader text-[19px] font-bold tracking-tight text-white transition-colors group-hover:text-[#b3d565]">
                        {w.t}
                      </h3>
                      <p className="mb-0 mt-2 font-varela text-[13.5px] leading-relaxed text-white/80">
                        {w.s}
                      </p>
                    </div>
                  </motion.article>
                )
              })}
            </div>
          </div>
        </section>

        {/* ============================ POPULAR ACTIVITIES ============================ */}
        <section id="experiences" className="bg-white px-5 py-16 sm:px-8 sm:py-20 lg:px-12">
          <div className="mx-auto max-w-[1400px]">
            <SectionHead
              eyebrow="Featured experiences"
              title="Popular activities"
              accent="& experiences"
              copy="Thrilling adventures, serene wellness retreats, cultural deep-dives — curated for every type of traveler."
              right={
                <p className="m-0 hidden font-varela text-sm text-[#0b1f12]/55 sm:block">
                  Showing <span className="font-bold text-[#096c27]">{pad(shown.length)}</span> of {pad(ACTIVITIES.length)}
                </p>
              }
            />

            {/* filter chips */}
            <div
              role="tablist"
              aria-label="Filter experiences"
              className="font-varela -mx-5 mt-8 flex gap-2 overflow-x-auto px-5 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 [&::-webkit-scrollbar]:hidden"
            >
              {[null, ...FILTERS].map((f) => {
                const on = category === f
                const n = f ? countFor(f) : ACTIVITIES.length
                return (
                  <button
                    key={f || 'all'}
                    type="button"
                    role="tab"
                    aria-selected={on}
                    onClick={() => setCategory(f)}
                    className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-[13px] font-bold transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#096c27] ${on
                        ? 'border-[#096c27] bg-[#096c27] text-white shadow-md shadow-[#096c27]/20'
                        : 'border-[#096c27]/15 bg-white text-[#0b1f12]/75 hover:border-[#096c27]/40 hover:text-[#096c27]'
                      }`}
                  >
                    {f || 'All Experiences'}
                    <span
                      className={`grid h-5 min-w-[20px] place-items-center rounded-full px-1.5 text-[10.5px] font-bold ${on ? 'bg-[#b3d565] text-[#0b1f12]' : 'bg-[#f3f8e6] text-[#096c27]'
                        }`}
                    >
                      {n}
                    </span>
                  </button>
                )
              })}
            </div>

            {/* cards */}
            <motion.div
              layout={!reduced}
              className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            >
              <AnimatePresence mode="popLayout" initial={false}>
                {shown.map((a, i) => (
                  <ActivityCard key={a.id} a={a} i={i} onEnquire={enquire} reduced={reduced} />
                ))}
              </AnimatePresence>
            </motion.div>
          </div>
        </section>

        {/* ============================ HOW IT WORKS (CONTINUOUS SINE WAVE PROCESS) ============================ */}
        <ProcessWaveSection />

        {/* ============================ CTA ============================ */}
        <section className="bg-white px-5 py-16 sm:px-8 sm:py-20 lg:px-12">
          <div className="relative mx-auto max-w-[1400px] overflow-hidden rounded-[2rem] bg-[#096c27] px-6 py-12 text-white sm:px-12 sm:py-16">
            <div aria-hidden className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#b3d565]/25 blur-3xl" />
            <div aria-hidden className="pointer-events-none absolute -bottom-32 left-1/4 h-72 w-72 rounded-full border border-white/10" />
            <div aria-hidden className="pointer-events-none absolute -bottom-20 left-[30%] h-52 w-52 rounded-full border border-white/10" />

            <div className="relative z-10 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
              <div className="max-w-xl">
                <Eyebrow dark>Ready when you are</Eyebrow>
                <h2 className="m-0 mt-4 font-rader text-[clamp(28px,4.2vw,52px)] font-bold leading-[1.05] tracking-tight">
                  Start the <span className="font-bold text-[#b3d565]">adventure.</span>
                </h2>
                <p className="mb-0 mt-4 max-w-md font-varela text-[15px] leading-relaxed text-white/80">
                  Tell us where you are headed and what you would love to try. Our travel desk will curate every detail.
                </p>
              </div>
              <button
                type="button"
                onClick={() => enquire('Custom activity & experience package')}
                className="font-varela group inline-flex w-fit items-center gap-3 rounded-full bg-[#b3d565] py-1.5 pl-6 pr-1.5 text-[14px] font-bold text-[#0b1f12] transition-all duration-300 hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                Plan your experience
                <span className="grid h-10 w-10 place-items-center rounded-full bg-[#096c27] text-white transition-transform duration-500 group-hover:rotate-45">
                  <ArrowUpRight className="h-4 w-4" aria-hidden />
                </span>
              </button>
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
