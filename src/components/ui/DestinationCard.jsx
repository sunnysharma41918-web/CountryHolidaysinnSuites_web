import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function DestinationCard({ destination }) {
  return (
    <Link to={`/destinations/${destination.slug}`} className="group relative block overflow-hidden rounded-[1.75rem] sm:rounded-[1.9rem]">
      <img src={destination.image} alt={destination.name} className="h-[340px] sm:h-[420px] w-full object-cover transition duration-700 group-hover:scale-105" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0d201b]/85 via-black/20 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6 text-white">
        <div className="mb-2 sm:mb-3 flex items-center justify-between">
          <p className="text-[11px] sm:text-xs uppercase tracking-[0.18em] text-[#f2d7a2]">Destination</p>
          <ArrowUpRight className="h-4 w-4 sm:h-5 sm:w-5 text-gold" />
        </div>
        <h3 className="font-display text-2xl sm:text-3xl md:text-4xl text-white">{destination.name}</h3>
        {destination.description && (
          <p className="mt-2 line-clamp-2 max-w-xs text-xs sm:text-sm leading-relaxed text-white/80">{destination.description}</p>
        )}
      </div>
    </Link>
  )
}
