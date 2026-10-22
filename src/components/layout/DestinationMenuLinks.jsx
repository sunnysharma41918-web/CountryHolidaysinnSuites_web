import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { destinationMenuGroups, getDestinationBySlug } from '../../data/destinations'

export default function DestinationMenuLinks({ mode = 'mega', onNavigate }) {
  const isMega = mode === 'mega'
  const isDark = mode === 'mobile-dark'

  return (
    <div
      className={isMega ? 'grid gap-6 md:grid-cols-2' : 'space-y-5'}
    >
      {destinationMenuGroups.map((group) => {
        const isLongList = group.destinations.length > 12

        return (
        <section key={group.label}>
          <div
            className={`mb-3 flex items-center justify-between gap-2 border-b pb-2 ${
              isMega || isDark ? 'border-white/10' : 'border-slate-200'
            }`}
          >
            <h3 className="text-xs font-bold tracking-[0.18em] text-[#ff5938]">
              {group.label}
            </h3>
            <Link
              to={`/destinations/category/${group.slug}`}
              onClick={onNavigate}
              className={`inline-flex shrink-0 items-center gap-1 text-[10px] font-semibold uppercase tracking-wider transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff5938] ${
                isMega || isDark
                  ? 'text-white/70 hover:text-white'
                  : 'text-slate-500 hover:text-[#e84a28]'
              }`}
            >
              View all
              <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
          <div
            className={
              isMega && isLongList
                ? 'grid max-h-[55vh] grid-cols-2 gap-1 overflow-y-auto pr-1 sm:grid-cols-3'
                : isMega
                  ? 'grid grid-cols-2 gap-2'
                  : 'grid grid-cols-2 gap-2'
            }
          >
            {group.destinations.map((slug) => {
              const destination = getDestinationBySlug(slug)
              if (!destination) return null

              return (
                <Link
                  key={destination.slug}
                  to={`/destinations/${destination.slug}`}
                  onClick={onNavigate}
                  className={
                    isMega
                      ? 'group flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff5938]'
                      : `rounded-xl px-3 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff5938] ${
                          isDark
                            ? 'text-white/80 hover:bg-white/10 hover:text-white'
                            : 'text-slate-700 hover:bg-[#fff3f0] hover:text-[#e84a28]'
                        }`
                  }
                >
                  {isMega && !isLongList && (
                    <img
                      src={destination.image}
                      alt=""
                      className="h-12 w-14 shrink-0 rounded-lg object-cover"
                    />
                  )}
                  <span className={isMega ? 'min-w-0' : 'min-w-0'}>
                    <span
                      className={`block truncate text-sm font-medium ${
                        isMega || isDark ? 'text-white' : 'text-slate-800'
                      }`}
                    >
                      {destination.name}
                    </span>
                    <span
                      className={`mt-0.5 block truncate text-xs ${
                        isMega || isDark ? 'text-white/55' : 'text-slate-500'
                      }`}
                    >
                      {destination.region || destination.name}
                    </span>
                  </span>
                </Link>
              )
            })}
          </div>
        </section>
        )
      })}
    </div>
  )
}
