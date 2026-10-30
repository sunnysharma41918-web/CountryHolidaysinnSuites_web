import { ArrowUpRight, MapPin, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function ResortCard({ resort, compact = false }) {
  if (!resort) return null

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-[#e5decb] bg-white shadow-[0_2px_8px_rgba(10,25,20,0.04)] transition-all duration-300 hover:-translate-y-1 hover:border-[#c9a24b]/70 hover:shadow-[0_12px_28px_-6px_rgba(10,25,20,0.12)]">
      {/* Clickable Card Link covering entire card */}
      <Link
        to={`/resorts/${resort.slug}`}
        aria-label={`View retreat ${resort.name}`}
        className="absolute inset-0 z-10 rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
      />

      {/* Image Container with Badges */}
      <div className={`relative overflow-hidden bg-midnight ${compact ? 'h-36 sm:h-40' : 'h-44 sm:h-48'}`}>
        <img
          src={resort.image}
          alt={resort.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent" />

        {/* Top Badges */}
        <div className="absolute inset-x-2.5 top-2.5 flex items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-midnight/80 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#f2d7a2] backdrop-blur-md ring-1 ring-white/15">
            <Sparkles className="h-2.5 w-2.5 text-gold" aria-hidden="true" />
            Featured stay
          </span>

          <span
            aria-hidden="true"
            className="grid h-6 w-6 place-items-center rounded-full bg-white/90 text-midnight shadow-sm backdrop-blur-md transition-all duration-300 group-hover:bg-gold group-hover:rotate-45"
          >
            <ArrowUpRight className="h-3.5 w-3.5" />
          </span>
        </div>

        {/* Bottom image overlay with location pin */}
        {resort.location && (
          <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center gap-1 text-[11px] font-medium text-white/95">
            <MapPin className="h-3 w-3 shrink-0 text-gold" aria-hidden="true" />
            <span className="truncate drop-shadow-sm">{resort.location}</span>
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className="flex flex-1 flex-col justify-between p-3.5 sm:p-4">
        <div>
          {/* Title */}
          <h3 className="font-display text-sm sm:text-base font-semibold leading-snug text-midnight transition-colors group-hover:text-[#096c27] line-clamp-1">
            {resort.name}
          </h3>

          {/* Description */}
          {resort.description && (
            <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-midnight/65">
              {resort.description}
            </p>
          )}

          {/* Amenities Pills */}
          {resort.amenities && resort.amenities.length > 0 && (
            <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
              {resort.amenities.slice(0, 2).map((amenity) => (
                <span
                  key={amenity}
                  className="rounded-md border border-[#e8dfcf] bg-[#fbf8f2] px-2 py-0.5 text-[10px] font-medium text-midnight/70"
                >
                  {amenity}
                </span>
              ))}
              {resort.amenities.length > 2 && (
                <span className="text-[10px] font-medium text-midnight/45">
                  +{resort.amenities.length - 2}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Card Footer / Action */}
        <div className="mt-3 flex items-center justify-between border-t border-[#f0e9dc] pt-2.5 text-[11px] font-semibold text-midnight">
          <span className="text-midnight/60 transition-colors group-hover:text-midnight">
            Explore retreat
          </span>
          <span className="flex items-center gap-1 text-gold transition-transform group-hover:translate-x-0.5">
            Details &rarr;
          </span>
        </div>
      </div>
    </article>
  )
}
