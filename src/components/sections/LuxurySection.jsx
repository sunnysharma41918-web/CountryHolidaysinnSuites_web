import { motion } from 'framer-motion'
import { ArrowUpRight, Heart, BedDouble, Mountain, Flower2, Building2, Route } from 'lucide-react'

const EASE = [0.16, 1, 0.3, 1]

export const SERVICES = [
  {
    id: 'honeymoon',
    icon: Heart,
    wide: true,
    title: 'Honeymoon & couple stays',
    desc: 'Private rooms, candle-lit dinners and flower décor at romantic stays like Honeymoon Inn Manali.',
    image:
      'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'stays',
    icon: BedDouble,
    title: 'Hotel & resort stays',
    desc: 'Hand-picked hotels and resorts, from DoubleTree by Hilton to Four Points by Sheraton.',
    image:
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: 'expeditions',
    icon: Mountain,
    title: 'Adventure expeditions',
    desc: 'Guided mountain, lake and coastal trails led by certified guides.',
    image:
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: 'spa',
    icon: Flower2,
    title: 'Spa & wellness retreats',
    desc: 'Slow weekends at resort spas like White Woods and Winsome.',
    image:
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: 'events',
    icon: Building2,
    title: 'Events & conventions',
    desc: 'Conferences and gatherings at venues like KK Royal Hotel & Convention Centre.',
    image:
      'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: 'custom',
    icon: Route,
    wide: true,
    title: 'Custom trips & transfers',
    desc: 'Itineraries built around your pace, with private transfers and a concierge on call.',
    image:
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=80',
  },
]

export default function ServicesSection({ onSelectPackage }) {
  const select = (service) => onSelectPackage && onSelectPackage(service)

  return (
    <section
      id="services"
      className="relative w-full overflow-hidden bg-[#f3f8e6] text-[#0b1f12] py-12 sm:py-16 lg:h-[100svh] lg:py-0"
    >
      <div className="mx-auto flex h-full max-w-[1440px] flex-col gap-6 px-4 sm:px-8 lg:gap-5 lg:px-12 lg:py-8">
        {/* Header */}
        <div className="flex shrink-0 flex-col gap-5 border-t border-[#096c27]/25 pt-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="flex items-center gap-2 text-sm font-medium text-[#096c27]">
              <span className="h-2 w-2 animate-pulse rounded-full bg-[#096c27] ring-1 ring-[#096c27]/30" />
              What we do
            </span>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.9, ease: EASE }}
              className="mt-3 text-[clamp(2.25rem,min(5.4vw,8vh),5rem)] font-semibold leading-[0.98] tracking-[-0.04em] text-[#0b1f12]"
              style={{ fontFamily: "'Outfit', sans-serif" }}
            >
              Our services
            </motion.h2>
          </div>

          <div className="flex items-center gap-6 sm:max-w-xl">
            <p className="hidden text-sm leading-relaxed text-[#0b1f12]/75 md:block">
              The room you sleep in, the trail you walk and the venue you celebrate in, all
              planned by one dedicated team.
            </p>
            <button
              type="button"
              onClick={() => select(SERVICES[0])}
              className="group flex shrink-0 items-center gap-3 rounded-full bg-[#096c27] py-1.5 pl-6 pr-1.5 text-sm font-semibold text-white shadow-lg shadow-[#096c27]/15 transition-transform duration-300 hover:scale-[1.03] hover:bg-[#06501b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#096c27] focus-visible:ring-offset-2 active:scale-95"
            >
              Plan your trip
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#b3d565] text-[#096c27] transition-transform duration-300 group-hover:rotate-45">
                <ArrowUpRight className="h-4 w-4 stroke-[2.5]" />
              </span>
            </button>
          </div>
        </div>

        {/* Bento grid */}
        <div className="grid min-h-0 flex-1 auto-rows-[16rem] grid-cols-1 gap-3 sm:auto-rows-[16rem] sm:grid-cols-2 lg:auto-rows-auto lg:grid-cols-4 lg:grid-rows-2">
          {SERVICES.map((s, i) => {
            const Icon = s.icon
            return (
              <motion.button
                key={s.id}
                type="button"
                onClick={() => select(s)}
                initial={{ opacity: 0, scale: 0.94, y: 30 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.8, delay: i * 0.08, ease: EASE }}
                className={`group relative min-h-0 overflow-hidden rounded-3xl bg-[#0b1f12] text-left text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#096c27] focus-visible:ring-offset-2 ${s.wide ? 'sm:col-span-2' : ''
                  }`}
              >
                <img
                  src={s.image}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110 group-focus-visible:scale-110 motion-reduce:transition-none"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0b1f12]/95 via-[#06501b]/35 to-black/20 transition-colors duration-500 group-hover:from-[#0b1f12] group-hover:via-[#06501b]/55" />

                {/* Top: icon + arrow */}
                <div className="absolute inset-x-4 top-4 flex items-center justify-between lg:inset-x-5 lg:top-5">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-md">
                    <Icon className="h-4 w-4 text-white" />
                  </span>
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#0b1f12] transition-all duration-500 group-hover:rotate-45 group-hover:bg-[#b3d565] group-hover:text-[#096c27] group-focus-visible:rotate-45 group-focus-visible:bg-[#b3d565]">
                    <ArrowUpRight className="h-4 w-4 stroke-[2.5]" />
                  </span>
                </div>

                {/* Bottom: title + description */}
                <div className="absolute inset-x-4 bottom-4 lg:inset-x-5 lg:bottom-5">
                  <h3
                    className={`font-semibold leading-tight tracking-tight text-white ${s.wide ? 'text-xl sm:text-2xl lg:text-3xl' : 'text-lg sm:text-xl lg:text-2xl'
                      }`}
                    style={{ fontFamily: "'Outfit', sans-serif" }}
                  >
                    {s.title}
                  </h3>
                  <p className="mt-2 max-w-sm text-sm leading-relaxed text-white/85 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] lg:max-h-0 lg:translate-y-2 lg:opacity-0 lg:group-hover:max-h-24 lg:group-hover:translate-y-0 lg:group-hover:opacity-100 lg:group-focus-visible:max-h-24 lg:group-focus-visible:translate-y-0 lg:group-focus-visible:opacity-100">
                    {s.desc}
                  </p>
                </div>
              </motion.button>
            )
          })}
        </div>
      </div>
    </section>
  )
}