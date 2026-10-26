import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowUpRight, Calendar, Heart, MapPin } from 'lucide-react'

const EASE = [0.16, 1, 0.3, 1]

export const DESTINATIONS = [
  {
    id: 'bali',
    name: 'Bali',
    region: 'Indonesia',
    category: 'Island',
    tagline: 'Rice terraces, sacred water temples and tropical surf.',
    bestTime: 'Apr – Oct',
    image:
      'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'kashmir',
    name: 'Kashmir',
    region: 'Jammu & Kashmir, India',
    category: 'Himalayas',
    tagline: 'Dal lake houseboats, snow peaks and pine meadows.',
    bestTime: 'Mar – Oct',
    image:
      'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'dubai',
    name: 'Dubai',
    region: 'United Arab Emirates',
    category: 'Metropolis',
    tagline: 'Futuristic skylines, desert dunes and luxury retreats.',
    bestTime: 'Nov – Mar',
    image:
      'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'maldives',
    name: 'Maldives',
    region: 'Indian Ocean',
    category: 'Atoll & Lagoon',
    tagline: 'Overwater luxury villas and turquoise coral lagoons.',
    bestTime: 'Nov – Apr',
    image:
      'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=900&q=80',
  },
]

export default function RecreationSection({ onBookTrip }) {
  const [liked, setLiked] = useState({})
  const toggleLike = (id) => setLiked((prev) => ({ ...prev, [id]: !prev[id] }))

  return (
    <section id="recreation" className="relative w-full bg-[#f3f8e6] text-[#0b1f12] py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between border-b border-[#096c27]/20 pb-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#096c27]">
              Where travelers go
            </p>
            <h2 className="mt-2 font-montserrat text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#0b1f12]">
              Our most-loved destinations
            </h2>
          </div>
          <p className="max-w-xs text-xs sm:text-sm leading-relaxed text-[#0b1f12]/75">
            Four places our travelers love most, with stays and trips we plan end to end.
          </p>
        </div>

        {/* Four Arched Destination Cards */}
        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 sm:gap-6">
          {DESTINATIONS.map((d, i) => {
            const isLiked = liked[d.id]
            return (
              <motion.article
                key={d.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.7, delay: i * 0.1, ease: EASE }}
                className="group flex flex-col"
              >
                {/* Arch Photo Container */}
                <div className="relative aspect-[3/4] w-full overflow-hidden rounded-b-3xl rounded-t-[999px] bg-[#06501b] shadow-md transition-all duration-500 hover:shadow-xl">
                  <img
                    src={d.image}
                    alt={`${d.name}, ${d.region}`}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0b1f12]/85 via-black/20 to-transparent" />

                  {/* Category Pill */}
                  <span className="absolute bottom-4 left-4 rounded-full bg-white/20 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-white backdrop-blur-md ring-1 ring-white/20">
                    {d.category}
                  </span>

                  {/* Save / Favorite Button */}
                  <button
                    type="button"
                    onClick={() => toggleLike(d.id)}
                    aria-pressed={!!isLiked}
                    aria-label={`Save ${d.name}`}
                    className="absolute right-4 top-5 flex h-9 w-9 items-center justify-center rounded-full bg-black/25 text-white backdrop-blur-md transition-all duration-300 hover:bg-white hover:text-red-500 active:scale-95"
                  >
                    <Heart className={`h-4 w-4 ${isLiked ? 'fill-red-500 text-red-500' : 'text-white'}`} />
                  </button>

                  {/* Book / Explore Trigger */}
                  <button
                    type="button"
                    onClick={() => onBookTrip && onBookTrip(d)}
                    aria-label={`Plan trip to ${d.name}`}
                    className="absolute bottom-3 right-3 flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#096c27] shadow-lg transition-transform duration-300 hover:scale-110 hover:bg-[#096c27] hover:text-white"
                  >
                    <ArrowUpRight className="h-5 w-5 stroke-[2.5]" />
                  </button>
                </div>

                {/* Card Details */}
                <div className="mt-4 flex flex-col">
                  <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#096c27]">
                    <MapPin className="h-3.5 w-3.5" />
                    <span className="truncate">{d.region}</span>
                  </div>

                  <h3 className="mt-1 font-montserrat text-2xl font-bold tracking-tight text-[#0b1f12] transition-colors group-hover:text-[#096c27]">
                    {d.name}
                  </h3>

                  <p className="mt-1.5 line-clamp-2 text-xs sm:text-sm leading-relaxed text-[#0b1f12]/75">
                    {d.tagline}
                  </p>

                  <div className="mt-3 flex items-center justify-between border-t border-[#096c27]/15 pt-2.5 text-xs text-[#0b1f12]/70">
                    <span className="inline-flex items-center gap-1 font-medium">
                      <Calendar className="h-3.5 w-3.5 text-[#096c27]" /> Best: {d.bestTime}
                    </span>
                    <button
                      type="button"
                      onClick={() => onBookTrip && onBookTrip(d)}
                      className="font-semibold text-[#096c27] hover:underline"
                    >
                      Plan Trip &rarr;
                    </button>
                  </div>
                </div>
              </motion.article>
            )
          })}
        </div>
      </div>
    </section>
  )
}