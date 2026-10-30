import { useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, X, Sparkles, Globe, MapPin } from 'lucide-react'
import PageTransition from '../components/layout/PageTransition'
import travelDoodlesGreen from '../assets/travel-doodles-green.png'
import {
  destinations,
  viaOtaDestinationNames,
  viaOtaExchangeDestinationNames,
} from '../data/destinations'

const TABS = [
  { id: 'ALL', label: 'All', icon: null },
  { id: 'VIA_OTA', label: 'VIA OTA', icon: Sparkles },
  { id: 'VIA_OTA_EXCHANGE', label: 'VIA OTA Exchange', icon: Globe },
]

const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-midnight/60'

function matches(dest, q) {
  if (!q) return true
  return (
    dest.name.toLowerCase().includes(q) ||
    (dest.region && dest.region.toLowerCase().includes(q)) ||
    (dest.description && dest.description.toLowerCase().includes(q))
  )
}

/* One compact destination row: thumbnail + name + region */
function DestinationTile({ destination }) {
  return (
    <Link
      to={`/destinations/${destination.slug}`}
      className={`group flex items-center gap-2.5 rounded-xl p-1.5 pr-2.5 transition-colors hover:bg-[#f3ece0] ${focusRing}`}
    >
      <img
        src={destination.image}
        alt=""
        loading="lazy"
        className="h-10 w-10 shrink-0 rounded-lg object-cover"
      />
      <span className="min-w-0">
        <span className="block truncate text-xs font-semibold text-midnight">
          {destination.name}
        </span>
        <span className="mt-px flex items-center gap-1 truncate text-[11px] text-midnight/55">
          <MapPin className="h-2.5 w-2.5 shrink-0" aria-hidden="true" />
          <span className="truncate">{destination.region || destination.name}</span>
        </span>
      </span>
    </Link>
  )
}

/* A titled, independently scrolling panel */
function Panel({ id, icon: Icon, title, subtitle, items, wide, emptyLabel }) {
  return (
    <section
      aria-labelledby={id}
      className="flex min-h-0 flex-col overflow-hidden rounded-2xl border border-[#e3dccd] bg-white/90 backdrop-blur-sm"
    >
      <header className="flex shrink-0 items-center justify-between gap-3 border-b border-[#eee7d9] px-4 py-2.5">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-midnight text-gold">
            <Icon className="h-3.5 w-3.5" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <h2 id={id} className="truncate text-sm font-semibold text-midnight">
              {title}
            </h2>
            <p className="hidden truncate text-[11px] text-midnight/55 sm:block">
              {subtitle}
            </p>
          </div>
        </div>
        <span className="shrink-0 rounded-full bg-[#f3ece0] px-2.5 py-1 text-[11px] font-semibold tabular-nums text-midnight/70">
          {items.length}
        </span>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-2">
        {items.length > 0 ? (
          <ul
            className={`grid gap-x-1 gap-y-0.5 ${wide
                ? 'grid-cols-1 min-[380px]:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5'
                : 'grid-cols-1 min-[380px]:grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3'
              }`}
          >
            {items.map((d) => (
              <li key={`${id}-${d.slug}`}>
                <DestinationTile destination={d} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="px-3 py-10 text-center text-xs text-midnight/55">
            {emptyLabel}
          </p>
        )}
      </div>
    </section>
  )
}

export default function DestinationsPage() {
  const [activeTab, setActiveTab] = useState('ALL')
  const [searchQuery, setSearchQuery] = useState('')
  const searchRef = useRef(null)

  const viaOta = useMemo(
    () => destinations.filter((d) => viaOtaDestinationNames.includes(d.name)),
    [],
  )
  const viaOtaExchange = useMemo(
    () => destinations.filter((d) => viaOtaExchangeDestinationNames.includes(d.name)),
    [],
  )

  const q = searchQuery.trim().toLowerCase()
  const filteredViaOta = useMemo(() => viaOta.filter((d) => matches(d, q)), [viaOta, q])
  const filteredExchange = useMemo(
    () => viaOtaExchange.filter((d) => matches(d, q)),
    [viaOtaExchange, q],
  )

  const showOta = activeTab === 'ALL' || activeTab === 'VIA_OTA'
  const showExchange = activeTab === 'ALL' || activeTab === 'VIA_OTA_EXCHANGE'
  const bothVisible = showOta && showExchange

  const counts = {
    ALL: viaOta.length + viaOtaExchange.length,
    VIA_OTA: viaOta.length,
    VIA_OTA_EXCHANGE: viaOtaExchange.length,
  }

  const matchCount =
    (showOta ? filteredViaOta.length : 0) + (showExchange ? filteredExchange.length : 0)

  return (
    <PageTransition>
      {/* Sufficient top padding to clear the fixed navbar with generous breathing space */}
      <div className="page-destinations relative isolate flex h-[100svh] flex-col overflow-hidden bg-[#f9f4ee] pt-[104px] sm:pt-[116px] lg:pt-[124px]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 bg-repeat opacity-[0.07]"
          style={{
            backgroundImage: `url(${travelDoodlesGreen})`,
            backgroundSize: '520px auto',
          }}
        />

        {/* ============ Compact toolbar: title, tabs, search ============ */}
        <div className="mx-auto w-full max-w-[1400px] shrink-0 px-3 pt-3 sm:px-6 lg:px-10">
          <div className="flex flex-col gap-3 rounded-2xl bg-midnight px-4 py-3 text-white lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-baseline gap-3">
              <h1 className="font-display text-xl leading-none sm:text-2xl">
                Destinations
              </h1>
              <p className="hidden text-[11px] text-white/60 md:block">
                Handpicked escapes, direct and through our exchange network
              </p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              {/* Tabs */}
              <div
                role="tablist"
                aria-label="Destination categories"
                className="flex w-full overflow-x-auto gap-1 rounded-full bg-white/10 p-1 sm:w-auto"
              >
                {TABS.map(({ id, label, icon: Icon }) => {
                  const selected = activeTab === id
                  return (
                    <button
                      key={id}
                      type="button"
                      role="tab"
                      aria-selected={selected}
                      onClick={() => setActiveTab(id)}
                      className={`flex flex-1 items-center justify-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1.5 text-[11px] font-semibold transition-colors sm:flex-none ${selected
                          ? 'bg-white text-midnight'
                          : 'text-white/70 hover:text-white'
                        } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold`}
                    >
                      {Icon && <Icon className="h-3 w-3" aria-hidden="true" />}
                      {label}
                      <span
                        className={`tabular-nums ${selected ? 'text-midnight/50' : 'text-white/40'
                          }`}
                      >
                        {counts[id]}
                      </span>
                    </button>
                  )
                })}
              </div>

              {/* Search */}
              <div className="relative w-full sm:w-64">
                <label htmlFor="destination-search" className="sr-only">
                  Search destinations
                </label>
                <Search
                  aria-hidden="true"
                  className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-white/50"
                />
                <input
                  id="destination-search"
                  ref={searchRef}
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Escape') setSearchQuery('')
                  }}
                  placeholder="Search by name or region"
                  className="h-8 w-full rounded-full border border-white/10 bg-white/10 pl-9 pr-8 text-xs text-white placeholder:text-white/45 focus:border-gold focus:outline-none"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('')
                      searchRef.current?.focus()
                    }}
                    aria-label="Clear search"
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1 text-white/60 hover:bg-white/10 hover:text-white"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Result summary only when searching */}
          {searchQuery && (
            <p className="mt-2 px-1 text-[11px] text-midnight/65" aria-live="polite">
              {matchCount} {matchCount === 1 ? 'destination matches' : 'destinations match'}{' '}
              &ldquo;{searchQuery}&rdquo;
            </p>
          )}
        </div>

        {/* ============ Panels fill the rest of the screen ============ */}
        <main
          className={`mx-auto min-h-0 w-full max-w-[1400px] flex-1 px-3 pb-3 pt-3 sm:px-6 sm:pb-4 lg:px-10 ${bothVisible
              ? 'grid gap-3 overflow-y-auto lg:grid-cols-2 lg:overflow-hidden'
              : 'flex flex-col'
            }`}
        >
          {showOta && (
            <div className={bothVisible ? 'flex h-[70svh] min-h-0 flex-col lg:h-auto' : 'flex min-h-0 flex-1 flex-col'}>
              <Panel
                id="via-ota"
                icon={Sparkles}
                title="VIA OTA"
                subtitle="Direct signature retreats: heritage, hills and coast"
                items={filteredViaOta}
                wide={!bothVisible}
                emptyLabel="No VIA OTA destinations match your search. Try a different name or region."
              />
            </div>
          )}

          {showExchange && (
            <div className={bothVisible ? 'flex h-[70svh] min-h-0 flex-col lg:h-auto' : 'flex min-h-0 flex-1 flex-col'}>
              <Panel
                id="via-ota-exchange"
                icon={Globe}
                title="VIA OTA Exchange"
                subtitle="Partner properties across India and abroad"
                items={filteredExchange}
                wide={!bothVisible}
                emptyLabel="No Exchange destinations match your search. Try a different name or region."
              />
            </div>
          )}
        </main>
      </div>
    </PageTransition>
  )
}