import { ArrowRight, MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function ResortCard({ resort }) {
  return (
    <article className="group overflow-hidden rounded-[1.75rem] sm:rounded-[1.8rem] border border-[#e3dccd] bg-[#fffdf8] shadow-soft">
      <div className="overflow-hidden">
        <img
          src={resort.image}
          alt={resort.name}
          className="h-56 sm:h-72 w-full object-cover transition duration-700 group-hover:scale-105"
        />
      </div>
      <div className="space-y-4 p-5 sm:space-y-5 sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[11px] sm:text-xs uppercase tracking-[0.2em] text-[#8a7f68]">Featured stay</p>
            <h3 className="mt-1.5 sm:mt-2 font-display text-2xl sm:text-3xl text-midnight">{resort.name}</h3>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs sm:text-sm text-charcoal/80">
          <MapPin className="h-4 w-4 text-gold shrink-0" />
          <span className="truncate">{resort.location}</span>
        </div>
        <p className="line-clamp-3 text-xs sm:text-sm leading-6 sm:leading-7 text-charcoal/80">{resort.description}</p>
        <div className="flex flex-wrap gap-2">
          {resort.amenities.slice(0, 2).map((amenity) => (
            <span key={amenity} className="rounded-full border border-[#d8cbaf] bg-[#f5efe7] px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-midnight">
              {amenity}
            </span>
          ))}
        </div>
        <Link
          to={`/resorts/${resort.slug}`}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium uppercase tracking-[0.2em] text-midnight transition hover:text-gold"
        >
          View retreat <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </article>
  )
}
