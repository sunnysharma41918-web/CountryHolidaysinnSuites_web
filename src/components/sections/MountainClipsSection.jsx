import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'

const EASE = [0.16, 1, 0.3, 1]

/*
  Replace each `image` with a real photo of the property, and fill in `location`
  where you want it shown (it is hidden when empty).
*/
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
      className="relative w-full overflow-hidden bg-slate-950 text-white lg:h-[100svh]"
    >
      <div className="mx-auto flex h-full max-w-[1440px] flex-col gap-6 px-4 py-10 sm:px-8 lg:gap-5 lg:px-12 lg:py-8">
        {/* Label row */}
        <div className="flex shrink-0 items-center justify-between border-t border-white/80 pt-3 text-sm">
          <span className="flex items-center gap-2 font-medium">
            <span className="h-2 w-2 animate-pulse rounded-full bg-[#ff5938]" />
            Our recent properties
          </span>
          <button
            type="button"
            onClick={() => select(PROPERTIES[0])}
            className="group flex items-center gap-2 rounded-full border border-white/25 py-1 pl-4 pr-1 text-xs font-semibold text-white transition-colors duration-300 hover:border-[#ff5938] hover:bg-[#ff5938] hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff5938]"
          >
            Explore all
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#ff5938] text-slate-950 transition-all duration-300 group-hover:rotate-45 group-hover:bg-slate-950 group-hover:text-[#ff5938]">
              <ArrowUpRight className="h-3.5 w-3.5 stroke-[2.5]" />
            </span>
          </button>
        </div>

        <div className="grid min-h-0 flex-1 grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-12">
          {/* Image preview (top on mobile, right on desktop) */}
          <div className="relative h-60 overflow-hidden rounded-[28px] bg-slate-900 sm:h-72 lg:order-2 lg:col-span-5 lg:h-full">
            {PROPERTIES.map((p, i) => (
              <img
                key={p.id}
                src={p.image}
                alt={i === active ? p.name : ''}
                className={`absolute inset-0 h-full w-full object-cover transition-all duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none ${i === active ? 'scale-100 opacity-100' : 'scale-110 opacity-0'
                  }`}
              />
            ))}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/10 to-transparent" />

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
                  className="mt-1 text-xl font-semibold leading-tight tracking-tight sm:text-2xl"
                  style={{ fontFamily: "'Outfit', sans-serif" }}
                >
                  {current.name}
                </p>
              </div>
              <button
                type="button"
                onClick={() => select(current)}
                aria-label={`View ${current.name}`}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#ff5938] text-slate-950 transition-transform duration-300 hover:rotate-45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white active:scale-90"
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
                  className="flex min-h-0 flex-1 border-t border-white/10 last:border-b"
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
                      className={`h-[3px] shrink-0 rounded-full bg-[#ff5938] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none ${isActive ? 'w-10' : 'w-0'
                        }`}
                    />
                    <span
                      className={`flex-1 text-[clamp(1.5rem,min(2.9vw,5.2vh),2.9rem)] font-semibold leading-[1.1] tracking-[-0.02em] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none ${isActive ? 'translate-x-1 text-white' : 'text-white/35 group-hover:text-white/60'
                        }`}
                      style={{ fontFamily: "'Outfit', sans-serif" }}
                    >
                      {p.name}
                    </span>
                    <span
                      className={`hidden shrink-0 text-xs transition-colors duration-300 sm:block ${isActive ? 'text-[#ff5938]' : 'text-white/35'
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