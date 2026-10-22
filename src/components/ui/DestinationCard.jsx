import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function DestinationCard({ destination }) {
  return (
    <Link to={`/destinations/${destination.slug}`} className="group relative block overflow-hidden rounded-[1.9rem]">
      <img src={destination.image} alt={destination.name} className="h-[420px] w-full object-cover transition duration-700 group-hover:scale-105" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0d201b]/80 via-transparent to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-6 text-white">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-xs uppercase tracking-[0.18em] text-[#f2d7a2]">Destination</p>
          <ArrowUpRight className="h-5 w-5 text-gold" />
        </div>
        <h3 className="font-display text-4xl text-white">{destination.name}</h3>
        <p className="mt-3 max-w-xs text-sm leading-6 text-white/80">{destination.description}</p>
      </div>
    </Link>
  )
}
