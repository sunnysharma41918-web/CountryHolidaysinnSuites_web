import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowUpRight, Heart } from 'lucide-react'

const EASE = [0.16, 1, 0.3, 1]

export const DESTINATIONS = [
  {
    id: 'bali',
    name: 'Bali',
    region: 'Indonesia',
    category: 'Island',
    tagline: 'Rice terraces, temples and surf.',
    bestTime: 'Apr – Oct',
    image:
      'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'kashmir',
    name: 'Kashmir',
    region: 'Jammu & Kashmir, India',
    category: 'Mountains',
    tagline: 'Houseboats, snow peaks and saffron fields.',
    bestTime: 'Mar – Oct',
    image:
      'https://images.unsplash.com/photo-1566837945700-30057527ade0?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'dubai',
    name: 'Dubai',
    region: 'United Arab Emirates',
    category: 'City',
    tagline: 'Skyline views, desert dunes and shopping.',
    bestTime: 'Nov – Mar',
    image:
      'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'maldives',
    name: 'Maldives',
    region: 'Indian Ocean',
    category: 'Island',
    tagline: 'Overwater villas and glassy lagoons.',
    bestTime: 'Nov – Apr',
    image:
      'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=900&q=80',
  },
]

export default function RecreationSection({ onBookTrip }) {
  const [liked, setLiked] = useState({})
  const toggleLike = (id) => setLiked((prev) => ({ ...prev, [id]: !prev[id] }))

  return (
    <section
      id="recreation"
      className="relative w-full overflow-hidden bg-[#f3f8e6] text-[#0b1f12] py-12 sm:py-16 lg:h-[100svh] lg:py-0"
    >
      <div className="mx-auto flex h-full max-w-[1440px] flex-col gap-6 px-4 sm:px-8 lg:gap-6 lg:px-12 lg:py-8">
        {/* Header */}
        <div className="flex shrink-0 items-end justify-between gap-6 border-t border-[#096c27]/25 pt-3">
          <div className="min-w-0">
            <span className="flex items-center gap-2 text-sm font-medium text-[#096c27]">
              <span className="h-2 w-2 animate-pulse rounded-full bg-[#096c27] ring-1 ring-[#096c27]/30" />
              Where travelers go
            </span>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.9, ease: EASE }}
              className="mt-2 max-w-3xl text-[clamp(1.75rem,min(5vw,7.5vh),4.5rem)] font-semibold leading-[1] tracking-[-0.04em] text-[#0b1f12]"
              style={{ fontFamily: "'Outfit', sans-serif" }}
            >
              Our most-loved destinations
            </motion.h2>
          </div>
          <p className="hidden max-w-xs text-sm leading-relaxed text-[#0b1f12]/75 md:block">
            Four places our travelers love most, with stays and trips we plan end to end.
          </p>
        </div>

        {/* Four arch cards */}
        <div className="grid min-h-0 flex-1 grid-cols-1 gap-y-12 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-12 lg:grid-cols-4 lg:grid-rows-1 lg:gap-x-6 lg:gap-y-0">
          {DESTINATIONS.map((d, i) => {
            const isLiked = liked[d.id]
            return (
              <motion.article
                key={d.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-20px' }}
                transition={{ duration: 0.8, delay: i * 0.1, ease: EASE }}
                className={`group flex min-h-0 flex-col ${
                  i % 2 === 1 ? 'lg:h-[calc(100%-2rem)] lg:self-end' : 'lg:h-full'
                }`}
              >
                {/* Arch photo */}
                <div className="relative h-[340px] sm:h-[380px] lg:h-auto lg:min-h-0 lg:flex-1">
                  <div className="absolute inset-0 overflow-hidden rounded-b-3xl rounded-t-[999px] bg-[#06501b] shadow-md">
                    <img
                      src={d.image}
                      alt={`${d.name}, ${d.region}`}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110 motion-reduce:transition-none"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0b1f12]/80 via-transparent to-[#0b1f12]/20" />
                  </div>

                  <span className="absolute bottom-3 left-3 rounded-full bg-white/20 px-3 py-1 text-[11px] font-medium backdrop-blur-md sm:bottom-4 sm:left-4 sm:px-3.5 sm:py-1.5 sm:text-xs text-white">
                    {d.category}
                  </span>

                  <button
                    type="button"
                    onClick={() => toggleLike(d.id)}
                    aria-pressed={!!isLiked}
                    aria-label={`Save ${d.name}`}
                    className="absolute right-3 top-[22%] flex h-9 w-9 items-center justify-center rounded-full bg-white/20 backdrop-blur-md transition-all duration-300 hover:bg-white hover:text-red-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white active:scale-90 sm:right-4 sm:h-10 sm:w-10"
                  >
                    <Heart className={`h-4 w-4 ${isLiked ? 'fill-red-500 text-red-500' : 'text-white'}`} />
                  </button>

                  {/* Book button overlapping the arch's bottom edge */}
                  <button
                    type="button"
                    onClick={() => onBookTrip && onBookTrip(d)}
                    aria-label={`Book trip to ${d.name}`}
                    className="absolute -bottom-6 right-3 z-10 flex h-12 w-12 items-center justify-center rounded-full border-4 border-[#f3f8e6] bg-[#096c27] text-white shadow-md transition-all duration-500 hover:rotate-45 hover:bg-[#b3d565] hover:text-[#096c27] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#096c27] active:scale-90 sm:right-5 sm:h-14 sm:w-14"
                  >
                    <ArrowUpRight className="h-5 w-5 stroke-[2.5]" />
                  </button>
                </div>

                {/* Info */}
                <div className="mt-3 shrink-0 pr-14 sm:mt-4 sm:pr-16">
                  <p className="truncate text-xs font-medium text-[#096c27]">{d.region}</p>
                  <h3
                    className="mt-0.5 text-[clamp(1.5rem,min(2.6vw,5vh),2.75rem)] font-semibold leading-none tracking-[-0.03em] text-[#0b1f12] transition-colors duration-300 group-hover:text-[#096c27]"
                    style={{ fontFamily: "'Outfit', sans-serif" }}
                  >
                    {d.name}
                  </h3>
                  <p className="mt-2 hidden line-clamp-2 text-sm leading-snug text-[#0b1f12]/75 sm:block">
                    {d.tagline}
                  </p>
                  <p className="mt-1.5 text-xs text-[#0b1f12]/70 sm:mt-2">
                    Best time <span className="font-semibold text-[#0b1f12]">{d.bestTime}</span>
                    {(d.duration || d.price) && (
                      <span>
                        {' '}
                        · {[d.duration, d.price && `from ${d.price}`].filter(Boolean).join(' · ')}
                      </span>
                    )}
                  </p>
                </div>
              </motion.article>
            )
          })}
        </div>
      </div>
    </section>
  )
}