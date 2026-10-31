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

/* Notch: a circle cut out of the cover's bottom-right corner, centred on the
   arrow disc. It is a real transparent mask, so it works on any background. */
const DISC = 44 // arrow disc, px
const GAP = 12 // space between disc and cover edge, px
const CUT = DISC / 2 + GAP // cut radius, px
const notchMask = `radial-gradient(circle at calc(100% - ${DISC / 2}px) calc(100% - ${DISC / 2}px), transparent ${CUT}px, #000 ${CUT + 0.5}px)`

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

        {/* Services Grid */}
        <div className="grid grid-cols-1 gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s) => (
            <motion.div
              key={s.title}
              className="sv-card h-full"
              whileHover={{ y: -4 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              <article className="group flex h-full flex-col">
                {/* Cover with notch */}
                <div className="relative">
                  <div
                    className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-[#071912]"
                    style={{ WebkitMask: notchMask, mask: notchMask }}
                  >
                    <img
                      src={unsplash(s.img, 800)}
                      alt={s.title}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-black/25" />

                    {/* Chip: icon + index + tag */}
                    <div className="absolute left-3 top-3 flex items-center gap-2 rounded-md border border-white/25 bg-black/45 py-1 pl-1.5 pr-2.5 backdrop-blur-md">
                      <s.icon className="h-3.5 w-3.5 text-[#fbd75b]" />
                      <span className="h-2.5 w-px bg-white/30" />
                      <span className="font-mono text-[10px] tracking-wider text-[#fbd75b]">{s.idx}</span>
                      <span className="font-varela text-[10px] uppercase tracking-widest text-white/90">{s.tag}</span>
                    </div>
                  </div>

                  {/* Arrow disc sitting in the notch */}
                  <span
                    aria-hidden
                    className="absolute bottom-0 right-0 grid place-items-center rounded-full bg-[#297f33] text-white shadow-[0_6px_16px_rgba(41,127,51,0.35)] transition-all duration-300 group-hover:scale-105 group-hover:bg-[#fbd75b] group-hover:text-[#063a2f]"
                    style={{ width: DISC, height: DISC }}
                  >
                    <ArrowUpRight className="h-[18px] w-[18px] transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </span>
                </div>

                {/* Text below the cover */}
                <h3 className="font-varela mt-3.5 text-lg font-bold leading-snug text-[#063a2f] transition-colors duration-300 group-hover:text-[#297f33]">
                  {s.title}
                </h3>
                <p className="font-varela mt-1.5 text-sm font-normal leading-relaxed text-slate-600 line-clamp-2">
                  {s.body}
                </p>
              </article>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}