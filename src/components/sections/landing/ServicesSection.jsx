import { useLayoutEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { BedDouble, Compass, MapPin, Plane, ShieldCheck, Users } from 'lucide-react'
import { GREEN, WRAP, YELLOW, Tag } from './landingShared'

gsap.registerPlugin(ScrollTrigger)

const SERVICES = [
  {
    title: 'Curated holidays',
    icon: Compass,
    body: 'Ready-made trips for families, couples and friends, each with a day-by-day plan you can change.'
  },
  {
    title: 'Flights and transfers',
    icon: Plane,
    body: 'We compare fares, book your seats and arrange pickups so you land and go straight to your stay.'
  },
  {
    title: 'Stays and villas',
    icon: BedDouble,
    body: 'Hotels, villas and homestays we have visited or vetted, from beach resorts to mountain cabins.'
  },
  {
    title: 'Visa and travel cover',
    icon: ShieldCheck,
    body: 'Paperwork checked for you, plus insurance for delays, medical care and cancellations.'
  },
  {
    title: 'Group and corporate trips',
    icon: Users,
    body: 'Weddings, school tours and team offsites. One planner, one invoice, one point of contact.'
  },
  {
    title: 'Custom itineraries',
    icon: MapPin,
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
    <section ref={root} id="services" className="relative flex min-h-screen items-center overflow-hidden bg-transparent py-20 text-[#0d4a3a]">
      <div className={`${WRAP} flex flex-col gap-12`}>
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center">
          <div className="sv-head flex justify-center"><Tag>What we do</Tag></div>
          <h2 className="sv-head font-montserrat mt-3 text-[clamp(2.25rem,3.2vw,2.75rem)] font-bold leading-[1.15] text-[#063a2f]">
            We offer different services to help you
          </h2>
          <p className="sv-head font-poppins mt-4 text-base md:text-lg font-normal text-slate-600">
            From the first idea to the flight home, one planner looks after every part of your trip.
          </p>
        </div>

        {/* Services Grid (Balanced 3x2 on desktop) */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s) => (
            <motion.div
              key={s.title}
              className="sv-card"
              whileHover={{ y: -6, scale: 1.01 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              <div className="flex h-full flex-col justify-between rounded-3xl border border-white/90 bg-white/75 p-6 text-[#0d4a3a] shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1.5 hover:border-[#0d4a3a]/25 hover:bg-white/95 hover:shadow-[0_20px_40px_-10px_rgba(13,74,58,0.1)]">
                <div>
                  <div className="flex items-center gap-4">
                    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl shadow-sm" style={{ background: YELLOW }}>
                      <s.icon className="h-6 w-6 text-[#0d4a3a]" />
                    </span>
                    <h3 className="font-montserrat text-[clamp(1.25rem,1.6vw,1.5rem)] font-semibold leading-tight text-[#063a2f]">{s.title}</h3>
                  </div>
                  <p className="font-poppins mt-3 text-sm md:text-base font-normal leading-relaxed text-slate-600">
                    {s.body}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}