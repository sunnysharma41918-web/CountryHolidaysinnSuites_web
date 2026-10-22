import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowUpRight, Heart } from 'lucide-react'

const EASE = [0.16, 1, 0.3, 1]

/*
  Swap each `image` for your own photo. Add `price` and `duration` fields
  if you want them shown on the cards (they are hidden when missing).
*/
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
      className="relative h-[100svh] w-full overflow-hidden bg-slate-950 text-white"
    >
      <div className="mx-auto flex h-full max-w-[1440px] flex-col gap-5 px-4 py-6 sm:px-8 lg:gap-6 lg:px-12 lg:py-8">
        {/* Header */}
        <div className="flex shrink-0 items-end justify-between gap-6 border-t border-white/80 pt-3">
          <div className="min-w-0">
            <span className="flex items-center gap-2 text-sm font-medium">
              <span className="h-2 w-2 animate-pulse rounded-full bg-[#ff5938]" />
              Where travelers go
            </span>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.9, ease: EASE }}
              className="mt-2 max-w-3xl text-[clamp(1.75rem,min(5vw,7.5vh),4.5rem)] font-semibold leading-[1] tracking-[-0.04em]"
              style={{ fontFamily: "'Outfit', sans-serif" }}
            >
              Our most-loved destinations
            </motion.h2>
          </div>
          <p className="hidden max-w-xs text-sm leading-relaxed text-white/60 md:block">
            Four places our travelers love most, with stays and trips we plan end to end.
          </p>
        </div>

        {/* Four arch cards, always fully visible */}
        <div className="grid min-h-0 flex-1 grid-cols-2 grid-rows-2 gap-x-4 gap-y-9 pb-2 lg:grid-cols-4 lg:grid-rows-1 lg:gap-x-6 lg:gap-y-0">
          {DESTINATIONS.map((d, i) => {
            const isLiked = liked[d.id]
            return (
              <motion.article
                key={d.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-20px' }}
                transition={{ duration: 0.8, delay: i * 0.1, ease: EASE }}
                className={`group flex min-h-0 flex-col ${i % 2 === 1 ? 'lg:h-[calc(100%-2rem)] lg:self-end' : 'h-full'
                  }`}
              >
                {/* Arch photo */}
                <div className="relative min-h-0 flex-1">
                  <div className="absolute inset-0 overflow-hidden rounded-b-3xl rounded-t-[999px] bg-slate-900">
                    <img
                      src={d.image}
                      alt={`${d.name}, ${d.region}`}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110 motion-reduce:transition-none"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-slate-950/20" />
                  </div>

                  <span className="absolute bottom-3 left-3 rounded-full bg-white/15 px-3 py-1 text-[11px] font-medium backdrop-blur-md sm:bottom-4 sm:left-4 sm:px-3.5 sm:py-1.5 sm:text-xs">
                    {d.category}
                  </span>

                  <button
                    type="button"
                    onClick={() => toggleLike(d.id)}
                    aria-pressed={!!isLiked}
                    aria-label={`Save ${d.name}`}
                    className="absolute right-3 top-[22%] flex h-9 w-9 items-center justify-center rounded-full bg-white/15 backdrop-blur-md transition-all duration-300 hover:bg-white hover:text-red-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white active:scale-90 sm:right-4 sm:h-10 sm:w-10"
                  >
                    <Heart className={`h-4 w-4 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
                  </button>

                  {/* Book button overlapping the arch's bottom edge */}
                  <button
                    type="button"
                    onClick={() => onBookTrip && onBookTrip(d)}
                    aria-label={`Book trip to ${d.name}`}
                    className="absolute -bottom-6 right-3 z-10 flex h-12 w-12 items-center justify-center rounded-full border-4 border-slate-950 bg-[#ff5938] text-slate-950 transition-transform duration-500 hover:rotate-45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white active:scale-90 sm:right-5 sm:h-14 sm:w-14"
                  >
                    <ArrowUpRight className="h-5 w-5 stroke-[2.5]" />
                  </button>
                </div>

                {/* Info */}
                <div className="mt-3 shrink-0 pr-14 sm:mt-4 sm:pr-16">
                  <p className="truncate text-xs text-white/60">{d.region}</p>
                  <h3
                    className="mt-0.5 text-[clamp(1.5rem,min(2.6vw,5vh),2.75rem)] font-semibold leading-none tracking-[-0.03em] transition-colors duration-300 group-hover:text-[#ff5938]"
                    style={{ fontFamily: "'Outfit', sans-serif" }}
                  >
                    {d.name}
                  </h3>
                  <p className="mt-2 hidden line-clamp-2 text-sm leading-snug text-white/70 sm:block">
                    {d.tagline}
                  </p>
                  <p className="mt-1.5 text-xs text-white/60 sm:mt-2">
                    Best time <span className="font-semibold text-white">{d.bestTime}</span>
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