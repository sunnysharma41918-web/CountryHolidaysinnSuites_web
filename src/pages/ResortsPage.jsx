import { useState, useEffect, useMemo, useCallback } from 'react'
import { Search, X, RefreshCw } from 'lucide-react'
import { api } from '../services/api'
import ResortCard from '../components/ui/ResortCard'
import PageTransition from '../components/layout/PageTransition'

/* Faint contour lines, a nod to hill-station maps. Pure decoration. */
function Contours() {
  return (
    <svg
      viewBox="0 0 800 400"
      preserveAspectRatio="xMidYMid slice"
      className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.14]"
      aria-hidden="true"
    >
      <g fill="none" stroke="#f8f4ee" strokeWidth="1">
        <path d="M-20 330 C120 260 220 300 330 230 C440 160 540 200 660 120 C730 72 780 70 830 40" />
        <path d="M-20 360 C130 295 230 335 345 265 C455 198 555 238 675 158 C745 112 790 108 830 80" />
        <path d="M-20 390 C140 330 240 370 360 300 C470 236 570 276 690 196 C760 150 800 146 830 120" />
        <path d="M-20 300 C110 225 210 265 315 195 C425 122 525 162 645 82 C715 36 770 34 830 4" />
        <path d="M-20 270 C100 190 200 230 300 160 C410 86 510 126 630 46" />
      </g>
    </svg>
  )
}

function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-[1.8rem] border border-[#e3dccd] bg-white p-6 motion-reduce:animate-none">
      <div className="h-56 w-full rounded-2xl bg-[#ece6d9] sm:h-72" />
      <div className="mt-5 h-6 w-3/4 rounded-full bg-[#ece6d9]" />
      <div className="mt-3 h-4 w-1/2 rounded-full bg-[#f1ece1]" />
      <div className="mt-5 h-16 w-full rounded-xl bg-[#f6f2ea]" />
    </div>
  )
}

export default function ResortsPage() {
  const [resortsList, setResortsList] = useState([])
  const [loading, setLoading] = useState(true)
  const [failed, setFailed] = useState(false)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('All')

  const load = useCallback(async (isMounted = () => true) => {
    try {
      setLoading(true)
      setFailed(false)
      const res = await api.getProperties({ limit: 50 })
      if (isMounted() && res && res.properties) {
        setResortsList(res.properties)
      }
    } catch (err) {
      console.error('Failed to load resorts from API:', err)
      if (isMounted()) setFailed(true)
    } finally {
      if (isMounted()) setLoading(false)
    }
  }, [])

  useEffect(() => {
    let mounted = true
    load(() => mounted)
    return () => {
      mounted = false
    }
  }, [load])

  /* Destination chips with how many stays each one has */
  const filters = useMemo(() => {
    const counts = new Map()
    resortsList.forEach((item) => {
      if (item.destination) counts.set(item.destination, (counts.get(item.destination) || 0) + 1)
    })
    return [
      { label: 'All', count: resortsList.length },
      ...[...counts].map(([label, count]) => ({ label, count })),
    ]
  }, [resortsList])

  const visibleResorts = useMemo(() => {
    const q = search.trim().toLowerCase()
    return resortsList.filter((resort) => {
      const matchesSearch = `${resort.name} ${resort.location}`.toLowerCase().includes(q)
      const matchesFilter = filter === 'All' || resort.destination === filter
      return matchesSearch && matchesFilter
    })
  }, [resortsList, search, filter])

  const hasActiveFilters = search.trim() !== '' || filter !== 'All'
  const destinationCount = filters.length - 1

  const clearFilters = () => {
    setSearch('')
    setFilter('All')
  }

  return (
    <PageTransition>
      <main className="bg-[#f8f4ee]">
        {/* ───── Header band ───── */}
        <header className="relative overflow-hidden bg-midnight pb-36 pt-32 text-white sm:pt-36">
          <Contours />
          <div className="relative mx-auto flex max-w-7xl flex-col gap-8 px-5 sm:px-8 md:flex-row md:items-end md:justify-between lg:px-12">
            <div className="max-w-2xl">
              <h1 className="font-display text-5xl leading-[1.05] sm:text-6xl">
                Find a stay that fits the landscape.
              </h1>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-white/70">
                Resorts chosen for their setting, their rooms, and the people who run them. Pick a destination or
                search by name.
              </p>
            </div>

            {!loading && !failed && resortsList.length > 0 && (
              <dl className="flex shrink-0 gap-8 border-t border-white/15 pt-5 md:border-l md:border-t-0 md:pl-8 md:pt-0">
                <div>
                  <dd className="font-display text-4xl">{resortsList.length}</dd>
                  <dt className="mt-1 text-sm text-white/60">{resortsList.length === 1 ? 'Resort' : 'Resorts'}</dt>
                </div>
                <div>
                  <dd className="font-display text-4xl">{destinationCount}</dd>
                  <dt className="mt-1 text-sm text-white/60">
                    {destinationCount === 1 ? 'Destination' : 'Destinations'}
                  </dt>
                </div>
              </dl>
            )}
          </div>
        </header>

        <div className="mx-auto max-w-7xl px-5 pb-24 sm:px-8 lg:px-12">
          {/* ───── Search + destination filter, overlapping the header ───── */}
          <div className="relative z-10 -mt-24 rounded-3xl border border-[#e3dccd] bg-white p-4 shadow-[0_24px_60px_-28px_rgba(10,20,40,0.35)] sm:p-5">
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-midnight/45" />
              <label htmlFor="resort-search" className="sr-only">
                Search resorts
              </label>
              <input
                id="resort-search"
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by resort name or location"
                className="w-full rounded-2xl border border-[#e3dccd] bg-[#faf8f3] py-3.5 pl-11 pr-11 text-sm text-midnight outline-none transition placeholder:text-midnight/45 focus:border-midnight focus:bg-white [&::-webkit-search-cancel-button]:hidden"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  aria-label="Clear search"
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-midnight/50 transition hover:bg-midnight/5 hover:text-midnight focus:outline-none focus-visible:ring-2 focus-visible:ring-midnight"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {filters.length > 2 && (
              <div
                role="group"
                aria-label="Filter by destination"
                className="-mx-1 mt-4 flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              >
                {filters.map(({ label, count }) => {
                  const active = filter === label
                  return (
                    <button
                      key={label}
                      type="button"
                      onClick={() => setFilter(label)}
                      aria-pressed={active}
                      className={`flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm transition focus:outline-none focus-visible:ring-2 focus-visible:ring-midnight focus-visible:ring-offset-2 ${active
                          ? 'border-midnight bg-midnight text-white'
                          : 'border-[#e3dccd] bg-white text-midnight hover:border-midnight/40'
                        }`}
                    >
                      {label}
                      <span className={`text-xs ${active ? 'text-white/60' : 'text-midnight/45'}`}>{count}</span>
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          {/* ───── Result summary ───── */}
          {!loading && !failed && resortsList.length > 0 && (
            <div className="mb-8 mt-8 flex items-center justify-between gap-4 text-sm text-midnight/70" aria-live="polite">
              <p>
                Showing {visibleResorts.length} of {resortsList.length}{' '}
                {resortsList.length === 1 ? 'resort' : 'resorts'}
                {filter !== 'All' && <> in {filter}</>}
              </p>
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="font-medium text-midnight underline underline-offset-4 transition hover:no-underline focus:outline-none focus-visible:ring-2 focus-visible:ring-midnight"
                >
                  Clear filters
                </button>
              )}
            </div>
          )}

          {/* ───── Results ───── */}
          <div className={loading || failed || resortsList.length === 0 ? 'mt-8' : ''}>
            {loading ? (
              <div className="grid gap-8 lg:grid-cols-2" aria-busy="true">
                {[1, 2, 3, 4].map((n) => (
                  <SkeletonCard key={n} />
                ))}
              </div>
            ) : failed ? (
              <div className="rounded-3xl border border-dashed border-[#d8cfbf] bg-white px-6 py-16 text-center">
                <h2 className="font-display text-3xl text-midnight sm:text-4xl">We couldn't load the resorts.</h2>
                <p className="mx-auto mt-3 max-w-md text-sm text-midnight/65">
                  Check your connection and try again. If it keeps happening, contact us and we'll help you book.
                </p>
                <button
                  type="button"
                  onClick={() => load()}
                  className="mt-7 inline-flex items-center gap-2 rounded-full bg-midnight px-6 py-3 text-sm font-medium text-white transition hover:bg-midnight/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-midnight focus-visible:ring-offset-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  Try again
                </button>
              </div>
            ) : visibleResorts.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-[#d8cfbf] bg-white px-6 py-16 text-center">
                <h2 className="font-display text-3xl text-midnight sm:text-4xl">
                  {resortsList.length === 0 ? 'No resorts are listed yet.' : 'No resorts match your search.'}
                </h2>
                <p className="mx-auto mt-3 max-w-md text-sm text-midnight/65">
                  {resortsList.length === 0
                    ? 'New properties will appear here as soon as they are published.'
                    : 'Try a different name or location, or show every destination.'}
                </p>
                {resortsList.length > 0 && (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="mt-7 rounded-full bg-midnight px-6 py-3 text-sm font-medium text-white transition hover:bg-midnight/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-midnight focus-visible:ring-offset-2"
                  >
                    Show all resorts
                  </button>
                )}
              </div>
            ) : (
              <div className="grid gap-8 lg:grid-cols-2">
                {visibleResorts.map((resort) => (
                  <ResortCard key={resort.slug || resort._id || resort.id} resort={resort} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </PageTransition>
  )
}