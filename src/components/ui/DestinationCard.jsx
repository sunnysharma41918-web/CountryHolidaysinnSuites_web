import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function DestinationCard({ destination, badge }) {
  const displayBadge = badge || destination.region || 'Destination'

  return (
    <Link
      to={`/destinations/${destination.slug}`}
      className="group relative block overflow-hidden rounded-[1.75rem] sm:rounded-[2rem] bg-midnight shadow-md transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl focus:outline-none focus-visible:ring-4 focus-visible:ring-gold/60"
    >
      <img
        src={destination.image}
        alt={destination.name}
        loading="lazy"
        className="h-[340px] sm:h-[400px] w-full object-cover transition duration-700 ease-out group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0a1813]/95 via-[#0a1813]/40 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6 text-white">
        <div className="mb-2.5 flex items-center justify-between gap-2">
          <span className="inline-flex items-center rounded-full bg-white/15 px-3 py-1 text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.16em] text-[#f2d7a2] backdrop-blur-md ring-1 ring-white/15">
            {displayBadge}
          </span>
          <span className="grid h-8 w-8 place-items-center rounded-full bg-white/15 text-gold backdrop-blur-md transition-all duration-300 group-hover:bg-gold group-hover:text-midnight">
            <ArrowUpRight className="h-4 w-4" />
          </span>
        </div>
        <h3 className="font-display text-2xl sm:text-3xl text-white">{destination.name}</h3>
        {destination.description && (
          <p className="mt-2 line-clamp-2 max-w-sm text-xs sm:text-sm leading-relaxed text-white/80">
            {destination.description}
          </p>
        )}
      </div>
    </Link>
  )
}

