import { useLayoutEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowUpRight, ChevronsRight, Hotel, MapPin, Plane } from 'lucide-react'
import { EASE, GREEN, WRAP, YELLOW, unsplash, Img, Tag } from './landingShared'

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
    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/10" />
  </div>
)

const Badge = ({ children, dark }) => (
  <span className={`inline-flex items-center gap-2 font-varela text-xs font-semibold ${dark ? 'rounded-full bg-white/15 px-3 py-1.5 text-white backdrop-blur' : 'text-[#0d4a3a]/70'}`}>
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
      <motion.a href={href} whileHover={{ y: -4 }} transition={{ duration: 0.35 }} className={`${base} aspect-[4/3] bg-[#0b3f32] border border-[#297f33]/25 hover:border-[#297f33] lp-shadow-combo-dark`}>
        <Media p={p} />
        <div className="relative z-10 flex h-full flex-col justify-end p-5 text-white">
          <Badge dark>{p.type}</Badge>
          <h3 className="mt-1 font-varela text-lg font-bold leading-tight">{p.name}</h3>
          {p.place && (
            <p className="font-varela mt-1 flex items-center gap-1.5 text-xs text-white/80">
              <MapPin className="h-3.5 w-3.5 text-[#ffd84d]" /> {p.place}
            </p>
          )}
        </div>
      </motion.a>
    )
  }

  if (p.kind === 'tall') {
    return (
      <motion.a href={href} whileHover={{ y: -4 }} transition={{ duration: 0.35 }} className={`${base} aspect-[3/4] bg-[#0b3f32] border border-[#297f33]/25 hover:border-[#297f33] lp-shadow-combo-dark`}>
        <Media p={p} w={1200} />
        <div className="relative z-10 flex h-full flex-col justify-between p-6 text-white">
          <div className="flex items-center justify-between">
            <Badge dark>{p.type}</Badge>
            <span className="grid h-8 w-8 place-items-center rounded-full bg-white/20 text-white backdrop-blur transition-transform duration-300 group-hover:rotate-45">
              <ArrowUpRight className="h-4 w-4" />
            </span>
          </div>
          <div>
            <h3 className="font-varela text-2xl font-bold leading-tight">{p.name}</h3>
            {p.place && (
              <p className="font-varela mt-1 flex items-center gap-1.5 text-xs text-white/80">
                <MapPin className="h-3.5 w-3.5 text-[#ffd84d]" /> {p.place}
              </p>
            )}
            <p className="font-varela mt-3 text-xs text-white/80 border-t border-white/20 pt-3">{p.note}</p>
          </div>
        </div>
      </motion.a>
    )
  }

  return (
    <motion.a href={href} whileHover={{ y: -4 }} transition={{ duration: 0.35 }} className={`${base} flex aspect-[4/3] flex-col justify-between border border-white/90 bg-white/75 p-5 text-[#0d4a3a] lp-shadow-combo backdrop-blur-xl hover:border-[#297f33]/30`}>
      <div>
        <Badge>{p.type}</Badge>
        <h3 className="mt-2 font-varela text-lg font-bold leading-tight text-[#063a2f]">{p.name}</h3>
        <p className="font-varela mt-2 text-xs text-[#0d4a3a]/75">{p.note}</p>
      </div>
      <span className="mb-1 inline-flex items-center gap-1.5 font-varela text-sm font-bold text-[#297f33]">
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
          .from('.pr-card', { opacity: 0, y: 30, duration: 0.8, stagger: 0.08 }, 0.15)
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={root} id="properties" className="relative flex flex-col bg-transparent py-8 md:py-12 text-[#0d4a3a]">
      <div className={`${WRAP} flex min-h-0 flex-1 flex-col gap-6`}>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <Tag>EXCLUSIVE STAYS</Tag>
            <h2 className="pr-head font-rader mt-2 text-[clamp(2.25rem,3.6vw,3.15rem)] font-bold leading-[1.12] text-[#063a2f]">
              Our Recent <span className="text-[#297f33]">Properties</span>
            </h2>
          </div>
          <motion.a
            href="#faq"
            className="pr-head inline-flex items-center gap-3 rounded-full border border-white/90 bg-white/80 backdrop-blur-xl py-1.5 pl-5 pr-1.5 text-xs font-semibold text-[#063a2f] shadow-sm hover:bg-white hover:shadow-md transition-all self-start sm:self-auto"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
          >
            <span className="font-varela font-bold">View all stays</span>
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
