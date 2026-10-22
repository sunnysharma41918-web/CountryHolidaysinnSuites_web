import { ArrowRight, MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function ResortCard({ resort }) {
  return (
    <article className="group overflow-hidden rounded-[1.8rem] border border-[#e3dccd] bg-[#fffdf8] shadow-soft">
      <div className="overflow-hidden">
        <img
          src={resort.image}
          alt={resort.name}
          className="h-80 w-full object-cover transition duration-700 group-hover:scale-105"
        />
      </div>
      <div className="space-y-5 p-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[#8a7f68]">Featured stay</p>
            <h3 className="mt-2 font-display text-3xl text-midnight">{resort.name}</h3>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-charcoal/80">
          <MapPin className="h-4 w-4 text-gold" />
          {resort.location}
        </div>
        <p className="text-sm leading-7 text-charcoal/80">{resort.description}</p>
        <div className="flex flex-wrap gap-2">
          {resort.amenities.slice(0, 2).map((amenity) => (
            <span key={amenity} className="rounded-full border border-[#d8cbaf] bg-[#f5efe7] px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-midnight">
              {amenity}
            </span>
          ))}
        </div>
        <Link
          to={`/resorts/${resort.slug}`}
          className="inline-flex items-center gap-2 text-sm font-medium uppercase tracking-[0.2em] text-midnight transition hover:text-gold"
        >
          View retreat <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </article>
  )
}
