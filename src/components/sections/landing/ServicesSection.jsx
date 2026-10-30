import { useLayoutEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowUpRight, BedDouble, Compass, MapPin, Plane, ShieldCheck, Users } from 'lucide-react'
import { GREEN, WRAP, YELLOW, Tag, unsplash } from './landingShared'

gsap.registerPlugin(ScrollTrigger)

const SERVICES = [
  {
    idx: '01',
    tag: 'EXPLORE',
    title: 'Curated holidays',
    icon: Compass,
    img: '1507525428034-b723cf961d3e',
    body: 'Ready-made trips for families, couples and friends, each with a day-by-day plan you can change.'
  },
  {
    idx: '02',
    tag: 'TRANSFERS',
    title: 'Flights and transfers',
    icon: Plane,
    img: '1436491865332-7a61a109cc05',
    body: 'We compare fares, book your seats and arrange pickups so you land and go straight to your stay.'
  },
  {
    idx: '03',
    tag: 'RESORTS',
    title: 'Stays and villas',
    icon: BedDouble,
    img: '1582719478250-c89cae4dc85b',
    body: 'Hotels, villas and homestays we have visited or vetted, from beach resorts to mountain cabins.'
  },
  {
    idx: '04',
    tag: 'PROTECTION',
    title: 'Visa and travel cover',
    icon: ShieldCheck,
    img: '1488646953014-85cb44e25828',
    body: 'Paperwork checked for you, plus insurance for delays, medical care and cancellations.'
  },
  {
    idx: '05',
    tag: 'RETREATS',
    title: 'Group and corporate trips',
    icon: Users,
    img: '1529156069898-49953e39b3ac',
    body: 'Weddings, school tours and team offsites. One planner, one invoice, one point of contact.'
  },
  {
    idx: '06',
    tag: 'BESPOKE',
    title: 'Custom itineraries',
    icon: MapPin,
    img: '1469854523086-cc02fe5d8800',
    body: 'Bespoke routes tailored to your budget, style, and secret bucket list locations around the world.'
  },
]

export default function ServicesSection() {
  const root = useRef(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.timeline({
          defaults: { ease: 'power3.out' },
          scrollTrigger: { trigger: root.current, start: 'top 65%', once: true }
        })
          .from('.sv-head', { opacity: 0, y: 26, duration: 0.9, stagger: 0.12 })
          .from('.sv-card', { opacity: 0, y: 40, duration: 0.8, stagger: 0.08 }, '-=0.4')
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={root} id="services" className="relative overflow-hidden bg-transparent py-8 md:py-12 text-[#0d4a3a]">
      <div className={`${WRAP} flex flex-col gap-8 md:gap-10`}>
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center">
          <div className="sv-head flex justify-center"><Tag>OUR SERVICES</Tag></div>
          <h2 className="sv-head font-rader mt-3 text-[clamp(2.25rem,3.6vw,3.15rem)] font-bold tracking-tight leading-[1.12] text-[#063a2f]">
            We Offer Different <span className="text-[#297f33]">Services</span> To Help You
          </h2>
          <p className="sv-head font-varela mt-3.5 text-base md:text-lg font-normal text-slate-600">
            From the first idea to the flight home, one planner looks after every part of your trip.
          </p>
        </div>

        {/* Services Grid (Balanced 3x2 on desktop) */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s) => (
            <motion.div
              key={s.title}
              className="sv-card h-full"
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              <div className="group relative flex h-full min-h-[210px] sm:min-h-[220px] flex-col justify-between overflow-hidden rounded-lg border border-white/20 bg-[#071912] p-5 text-white lp-shadow-combo-dark transition-all duration-500 hover:border-[#297f33]">
                {/* Cinematic Photo Background */}
                <img
                  src={unsplash(s.img, 800)}
                  alt={s.title}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                  loading="lazy"
                />

                {/* Dark Shadow Gradient Vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-black/30 transition-opacity duration-300 group-hover:from-black/95 group-hover:via-black/65" />
                <div className="pointer-events-none absolute inset-0 bg-black/10" />

                {/* Top Row: Icon + Chip on left, Arrow on right */}
                <div className="relative z-10 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="grid h-10 w-10 place-items-center rounded-md border border-white/25 bg-white/15 text-white backdrop-blur-md shadow-sm transition-all duration-300 group-hover:border-[#297f33] group-hover:bg-[#297f33] group-hover:shadow-[0_0_16px_rgba(41,127,51,0.5)]">
                      <s.icon className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
                    </span>
                    <div className="flex items-center gap-2 rounded-md border border-white/20 bg-black/50 px-2.5 py-1 text-xs font-semibold backdrop-blur-md shadow-xs">
                      <span className="font-mono text-xs text-[#fbd75b] tracking-wider">{s.idx}</span>
                      <span className="h-2 w-px bg-white/30" />
                      <span className="font-varela text-[10px] tracking-widest uppercase text-white/85">{s.tag}</span>
                    </div>
                  </div>

                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-md border border-white/20 bg-white/10 text-white backdrop-blur-md transition-all duration-300 group-hover:border-[#fbd75b] group-hover:bg-[#fbd75b] group-hover:text-[#063a2f] group-hover:rotate-45">
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </div>

                {/* Bottom Content: Title + Concise Body */}
                <div className="relative z-10 mt-4 rounded-md border border-white/15 bg-black/50 p-3.5 backdrop-blur-xl shadow-md transition-all duration-300 group-hover:border-[#297f33]/60 group-hover:bg-black/65">
                  <h3 className="font-varela text-lg font-bold leading-snug text-white transition-colors duration-300 group-hover:text-[#fbd75b]">
                    {s.title}
                  </h3>
                  <p className="font-varela mt-1 text-xs sm:text-sm font-normal leading-relaxed text-white/80 transition-colors group-hover:text-white/95 line-clamp-2">
                    {s.body}
                  </p>

                  {/* Animated Brand Gradient Underline */}
                  <div className="mt-2.5 h-[2px] w-full overflow-hidden rounded-sm bg-white/10">
                    <div className="h-full w-0 bg-gradient-to-r from-[#297f33] via-[#3ebd4c] to-[#fbd75b] transition-all duration-500 ease-out group-hover:w-full" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
