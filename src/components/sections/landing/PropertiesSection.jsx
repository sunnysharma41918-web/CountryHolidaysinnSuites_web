import { useLayoutEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowUpRight, ChevronsRight, Hotel, MapPin, Plane } from 'lucide-react'
import { EASE, GREEN, WRAP, YELLOW, unsplash, Img } from './landingShared'

gsap.registerPlugin(ScrollTrigger)

// kind: 'photo' (image + name label) | 'text' (pale card with dotted flight path) | 'tall' (full-height image with text)
// pos places each card on the 4-column x 2-row desktop grid, like the journal layout
// place is only filled where the name itself gives a location; add the others yourself
const PROPERTIES = [
  { name: 'Honeymoon Inn Manali', type: 'Inn', place: 'Manali', img: '1512917774080-9991f1c4c750', kind: 'photo', pos: 'lg:col-start-1 lg:row-start-1', note: 'Ask your planner for room options, rates and dates.' },
  { name: 'DoubleTree By Hilton', type: 'Hotel', place: '', img: '1566073771259-6a8506099945', kind: 'text', pos: 'lg:col-start-1 lg:row-start-2', note: 'Book through us with a fixed price before you pay.' },
  { name: 'Four Points By Sheraton New Delhi', type: 'Hotel', place: 'New Delhi', img: '1499793983690-e29da59ef1c2', kind: 'tall', pos: 'lg:col-start-2 lg:row-span-2 lg:row-start-1', note: 'We confirm rooms and rates before you pay.' },
  { name: 'White Woods Resorts & SPA', type: 'Resort & Spa', place: '', img: '1571896349842-33c89424de2d', kind: 'text', pos: 'lg:col-start-3 lg:row-start-1', note: 'Add transfers and a local guide to your stay.' },
  { name: 'KK Royal Hotel & Convention Centre', type: 'Hotel & Convention Centre', place: '', img: '1520250497591-112f2f40a3f4', kind: 'photo', pos: 'lg:col-start-3 lg:row-start-2', note: 'Ask us about dates, rooms and group rates.' },
  { name: 'Winsome Resort & Spa', type: 'Resort & Spa', place: '', img: '1507525428034-b723cf961d3e', kind: 'tall', pos: 'lg:col-start-4 lg:row-span-2 lg:row-start-1', note: 'One planner for your stay, transfers and guide.' },
]

const Media = ({ p, w = 1000 }) => (
  <div className="pr-img absolute inset-0">
    <Img src={unsplash(p.img, w)} alt={p.name} className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105" />
  </div>
)

const Chip = ({ children, dark }) => (
  <span className={`inline-flex items-center gap-2 text-xs font-medium ${dark ? 'rounded-full bg-white/15 px-3 py-1.5 text-white backdrop-blur' : 'text-[#0d4a3a]/70'}`}>
    <Hotel className="h-3.5 w-3.5" /> {children}
  </span>
)

// Dotted flight path that wipes in, with a plane that floats at its end
function Trail() {
  return (
    <>
      <motion.svg
        viewBox="0 0 160 60" fill="none" aria-hidden="true"
        className="pointer-events-none absolute bottom-3 right-4 h-14 w-36"
        initial={{ clipPath: 'inset(0 100% 0 0)' }}
        whileInView={{ clipPath: 'inset(0 0% 0 0)' }}
        viewport={{ once: true }}
        transition={{ duration: 1.6, ease: EASE, delay: 0.8 }}
      >
        <path d="M2 54 C 40 52, 60 12, 100 30 S 140 22, 148 14" stroke={GREEN} strokeOpacity="0.4" strokeWidth="1.6" strokeDasharray="3 5" strokeLinecap="round" />
      </motion.svg>
      <motion.span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-[2.6rem] right-2 text-[#0d4a3a]/70"
        initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
        transition={{ delay: 2.2 }}
      >
        <motion.span className="block" animate={{ y: [0, -4, 0], x: [0, 3, 0] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}>
          <Plane className="h-5 w-5" />
        </motion.span>
      </motion.span>
    </>
  )
}

function Card({ p }) {
  const base = `pr-card group relative block overflow-hidden rounded-3xl lg:aspect-auto ${p.pos}`
  const href = '#faq'

  if (p.kind === 'photo') {
    return (
      <motion.a href={href} whileHover={{ y: -4 }} transition={{ duration: 0.35 }} className={`${base} aspect-[4/3] bg-[#0b3f32]`}>
        <Media p={p} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
        <div className="absolute inset-x-3 bottom-3 flex items-center justify-between gap-3 rounded-2xl bg-white/90 p-3 backdrop-blur">
          <div className="min-w-0">
            <p className="font-montserrat truncate text-sm sm:text-base font-semibold text-[#0d4a3a]">{p.name}</p>
            <p className="font-poppins mt-0.5 text-xs font-normal text-[#0d4a3a]/65">{p.type}{p.place ? `, ${p.place}` : ''}</p>
          </div>
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full transition-transform duration-300 group-hover:rotate-45" style={{ background: YELLOW, color: GREEN }}>
            <ArrowUpRight className="h-4 w-4" />
          </span>
        </div>
      </motion.a>
    )
  }

  if (p.kind === 'tall') {
    return (
      <motion.a href={href} whileHover={{ y: -4 }} transition={{ duration: 0.35 }} className={`${base} aspect-[4/5] bg-[#0b3f32] text-white`}>
        <Media p={p} w={1200} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
        <span className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full transition-transform duration-300 group-hover:rotate-45" style={{ background: YELLOW, color: GREEN }}>
          <ArrowUpRight className="h-5 w-5" />
        </span>
        <div className="absolute inset-x-0 bottom-0 p-5 md:p-6">
          <Chip dark>{p.type}</Chip>
          <h3 className="font-montserrat mt-3 text-[clamp(1.25rem,1.6vw,1.5rem)] font-semibold leading-tight text-white">{p.name}</h3>
          {p.place && <p className="font-poppins mt-1 flex items-center gap-1.5 text-sm text-white/80"><MapPin className="h-4 w-4" style={{ color: YELLOW }} />{p.place}</p>}
          <p className="font-poppins mt-2 text-sm md:text-base font-normal text-white/80">{p.note}</p>
        </div>
      </motion.a>
    )
  }

  return (
    <motion.a href={href} whileHover={{ y: -4 }} transition={{ duration: 0.35 }} className={`${base} flex flex-col justify-between rounded-3xl border border-white/90 bg-white/75 backdrop-blur-xl p-5 text-[#0d4a3a] shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:bg-white/95 md:p-6 transition-all`}>
      <Chip>{p.type}</Chip>
      <div>
        <h3 className="font-montserrat text-[clamp(1.25rem,1.6vw,1.5rem)] font-semibold leading-tight text-[#063a2f]">{p.name}</h3>
        {p.place && <p className="font-poppins mt-1 flex items-center gap-1.5 text-sm text-[#0d4a3a]/70"><MapPin className="h-4 w-4" />{p.place}</p>}
        <p className="font-poppins mt-2 max-w-[16rem] text-sm md:text-base font-normal leading-relaxed text-[#0d4a3a]/75">{p.note}</p>
      </div>
      <span className="mb-1 inline-flex items-center gap-1.5 text-sm font-semibold">
        Book this stay <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
      </span>
      <Trail />
    </motion.a>
  )
}

export default function PropertiesSection() {
  const root = useRef(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap
          .timeline({ defaults: { ease: 'power3.out' }, scrollTrigger: { trigger: root.current, start: 'top 70%', once: true } })
          .from('.pr-head', { opacity: 0, y: 28, duration: 0.9, stagger: 0.12 })
          .fromTo('.pr-card', { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.1, stagger: 0.12 }, 0.2)
          .from('.pr-img', { scale: 1.3, duration: 1.5, stagger: 0.12 }, 0.2)
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={root} id="properties" className="relative flex min-h-screen flex-col bg-transparent py-12 text-[#0d4a3a] lg:h-screen lg:py-8">
      <div className={`${WRAP} flex min-h-0 flex-1 flex-col gap-6`}>
        <div className="flex items-center justify-between gap-4">
          <h2 className="pr-head font-montserrat text-[clamp(2.25rem,3.2vw,2.75rem)] font-bold leading-[1.15] text-[#063a2f]">
            Our recent <span className="font-serif italic font-normal">properties</span>
          </h2>
          <motion.a
            href="#faq"
            className="pr-head inline-flex items-center gap-3 rounded-full border border-white/90 bg-white/80 backdrop-blur-xl py-1.5 pl-5 pr-1.5 text-xs font-semibold text-[#063a2f] shadow-sm hover:bg-white hover:shadow-md transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
          >
            View all stays
            <span className="grid h-8 w-8 place-items-center rounded-full bg-[#063a2f] text-[#fbd75b]">
              <ChevronsRight className="h-4 w-4" />
            </span>
          </motion.a>
        </div>

        <div className="grid min-h-0 flex-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:grid-rows-2 lg:gap-4">
          {PROPERTIES.map((p) => <Card key={p.name} p={p} />)}
        </div>
      </div>
    </section>
  )
}