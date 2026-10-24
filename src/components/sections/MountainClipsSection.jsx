import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'

const EASE = [0.16, 1, 0.3, 1]

export const PROPERTIES = [
  {
    id: 'honeymoon-inn-manali',
    name: 'Honeymoon Inn Manali',
    type: 'Inn',
    location: 'Manali',
    image:
      'https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=1400&q=80',
  },
  {
    id: 'doubletree-by-hilton',
    name: 'DoubleTree by Hilton',
    type: 'Hotel',
    location: '',
    image:
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1400&q=80',
  },
  {
    id: 'four-points-new-delhi',
    name: 'Four Points by Sheraton New Delhi',
    type: 'Hotel',
    location: 'New Delhi',
    image:
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1400&q=80',
  },
  {
    id: 'white-woods-resorts-spa',
    name: 'White Woods Resorts & Spa',
    type: 'Resort & spa',
    location: '',
    image:
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1400&q=80',
  },
  {
    id: 'kk-royal-convention',
    name: 'KK Royal Hotel & Convention Centre',
    type: 'Hotel & convention',
    location: '',
    image:
      'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1400&q=80',
  },
  {
    id: 'winsome-resort-spa',
    name: 'Winsome Resort & Spa',
    type: 'Resort & spa',
    location: '',
    image:
      'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&fit=crop&w=1400&q=80',
  },
]

export default function RecentPropertiesSection({ onSelectPackage }) {
  const [active, setActive] = useState(0)
  const current = PROPERTIES[active]

  const select = (property) => onSelectPackage && onSelectPackage(property)

  return (
    <section
      id="properties"
      className="relative w-full overflow-hidden bg-[#f3f8e6] text-[#0b1f12] py-12 sm:py-16 lg:h-[100svh] lg:py-0"
    >
      <div className="mx-auto flex h-full max-w-[1440px] flex-col gap-6 px-4 sm:px-8 lg:gap-5 lg:px-12 lg:py-8">
        {/* Label row */}
        <div className="flex shrink-0 items-center justify-between border-t border-[#096c27]/20 pt-3 text-sm">
          <span className="flex items-center gap-2 font-medium text-[#0b1f12]">
            <span className="h-2 w-2 animate-pulse rounded-full bg-[#096c27] ring-1 ring-[#096c27]/30" />
            Our recent properties
          </span>
          <button
            type="button"
            onClick={() => select(PROPERTIES[0])}
            className="group flex items-center gap-2 rounded-full border border-[#096c27]/20 bg-white py-1 pl-4 pr-1 text-xs font-semibold text-[#0b1f12] transition-colors duration-300 hover:border-[#096c27] hover:bg-[#096c27] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#096c27]"
          >
            Explore all
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#b3d565] text-[#0b1f12] transition-all duration-300 group-hover:rotate-45 group-hover:bg-[#096c27] group-hover:text-white">
              <ArrowUpRight className="h-3.5 w-3.5 stroke-[2.5]" />
            </span>
          </button>
        </div>

        <div className="grid min-h-0 flex-1 grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-12">
          {/* Image preview (top on mobile, right on desktop) */}
          <div className="relative h-64 overflow-hidden rounded-[24px] bg-[#eaf4d4] shadow-[0_30px_80px_-45px_rgba(11,31,18,0.45)] sm:h-80 sm:rounded-[28px] lg:order-2 lg:col-span-5 lg:h-full">
            {PROPERTIES.map((p, i) => (
              <img
                key={p.id}
                src={p.image}
                alt={i === active ? p.name : ''}
                className={`absolute inset-0 h-full w-full object-cover transition-all duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none ${i === active ? 'scale-100 opacity-100' : 'scale-110 opacity-0'
                  }`}
              />
            ))}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0b1f12]/90 via-[#0b1f12]/15 to-transparent" />

            <motion.div
              key={current.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE }}
              className="absolute inset-x-5 bottom-5 flex items-end justify-between gap-4"
            >
              <div className="min-w-0">
                <p className="text-xs text-white/70">
                  {current.type}
                  {current.location ? ` in ${current.location}` : ''}
                </p>
                <p
                  className="mt-1 text-xl font-semibold leading-tight tracking-tight sm:text-2xl text-white"
                  style={{ fontFamily: "'Outfit', sans-serif" }}
                >
                  {current.name}
                </p>
              </div>
              <button
                type="button"
                onClick={() => select(current)}
                aria-label={`View ${current.name}`}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#b3d565] text-[#096c27] transition-transform duration-300 hover:rotate-45 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white active:scale-90"
              >
                <ArrowUpRight className="h-5 w-5 stroke-[2.5]" />
              </button>
            </motion.div>
          </div>

          {/* Property list */}
          <ul className="flex min-h-0 flex-col lg:order-1 lg:col-span-7">
            {PROPERTIES.map((p, i) => {
              const isActive = i === active
              return (
                <motion.li
                  key={p.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.8, delay: i * 0.07, ease: EASE }}
                  className="flex min-h-0 flex-1 border-t border-[#096c27]/15 last:border-b"
                >
                  <button
                    type="button"
                    onMouseEnter={() => setActive(i)}
                    onFocus={() => setActive(i)}
                    onClick={() => {
                      setActive(i)
                      select(p)
                    }}
                    className="group flex w-full items-center gap-4 py-4 text-left focus-visible:outline-none lg:py-0"
                  >
                    {/* brand-accent marker grows in on the active row */}
                    <span
                      aria-hidden
                      className={`h-[3px] shrink-0 rounded-full bg-[#096c27] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none ${isActive ? 'w-10' : 'w-0'
                        }`}
                    />
                    <span
                      className={`flex-1 text-[clamp(1.15rem,min(2.8vw,4.8vh),2.75rem)] font-semibold leading-[1.15] tracking-[-0.02em] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none ${isActive ? 'translate-x-1 text-[#0b1f12]' : 'text-[#0b1f12]/50 group-hover:text-[#0b1f12]/80'
                        }`}
                      style={{ fontFamily: "'Outfit', sans-serif" }}
                    >
                      {p.name}
                    </span>
                    <span
                      className={`hidden shrink-0 text-xs transition-colors duration-300 sm:block ${isActive ? 'text-[#096c27]' : 'text-[#0b1f12]/55'
                        }`}
                    >
                      {p.type}
                    </span>
                  </button>
                </motion.li>
              )
            })}
          </ul>
        </div>
      </div>
    </section>
  )
}