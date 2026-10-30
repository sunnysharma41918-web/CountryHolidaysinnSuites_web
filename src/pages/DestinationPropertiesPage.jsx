import { useEffect, useMemo, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowLeft, ArrowUpRight, MapPin, Search, X, BedDouble } from 'lucide-react'
import PageTransition from '../components/layout/PageTransition'
import ResortCard from '../components/ui/ResortCard'
import { getDestinationBySlug } from '../data/destinations'
import { resorts } from '../data/resorts'
import { api } from '../services/api'

const EASE = [0.16, 1, 0.3, 1]

const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-0'

export default function DestinationPropertiesPage() {
  const { slug } = useParams()
  const reduce = useReducedMotion()
  const [query, setQuery] = useState('')

  const destination = getDestinationBySlug(slug)

  const [destinationResorts, setDestinationResorts] = useState([])
  const [loadingStays, setLoadingStays] = useState(true)

  useEffect(() => {
    let mounted = true
    setQuery('')
    setDestinationResorts([])

    if (!destination?.resortDestination) {
      setLoadingStays(false)
      return
    }

    const loadDestinationStays = async () => {
      try {
        setLoadingStays(true)
        const res = await api.getProperties({ destination: destination.resortDestination })
        if (mounted && res && Array.isArray(res.properties)) {
          setDestinationResorts(res.properties)
        }
      } catch (err) {
        console.warn('Error loading destination stays:', err)
        if (mounted) {
          setDestinationResorts([])
        }
      } finally {
        if (mounted) {
          setLoadingStays(false)
        }
      }
    }

    loadDestinationStays()
    return () => {
      mounted = false
    }
  }, [destination?.resortDestination, slug])

  const q = query.trim().toLowerCase()
  const visibleResorts = useMemo(
    () =>
      q
        ? destinationResorts.filter((r) =>
          `${r.name ?? ''} ${r.location ?? ''}`.toLowerCase().includes(q),
        )
        : destinationResorts,
    [destinationResorts, q],
  )

  const navigate = useNavigate()
  const openBooking = () => {
    navigate(`/contact?subject=${encodeURIComponent(destination?.name || 'Holiday Enquiry')}`)
  }


  /* ---------------- not found ---------------- */
  if (!destination) {
    return (
      <PageTransition>
        <section className="grid min-h-[100svh] place-items-center bg-[#f9f4ee] px-5">
          <div className="max-w-sm text-center">
            <p className="font-display text-7xl leading-none text-midnight/20">404</p>
            <h1 className="mt-2 font-display text-2xl text-midnight">Destination not found</h1>
            <p className="mt-2 text-xs text-midnight/65">
              It may have been renamed or moved. Browse every destination instead.
            </p>
            <Link
              to="/destinations"
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-midnight px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-midnight/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
            >
              <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
              Browse destinations
            </Link>
          </div>
        </section>
      </PageTransition>
    )
  }

  const count = destinationResorts.length
  const about = destination.knowYourDestination || destination.description

  return (
    <PageTransition>
      {/* Sufficient top padding to clear the fixed navbar with generous space */}
      <div className="page-destinations flex min-h-[100svh] flex-col bg-[#f9f4ee] px-3 pb-3 pt-[104px] sm:px-5 sm:pb-4 sm:pt-[116px] lg:h-[100svh] lg:overflow-hidden lg:px-8 lg:pt-[124px]">
        <div className="mx-auto grid min-h-0 w-full max-w-[1500px] flex-1 gap-3 pt-3 lg:grid-cols-[minmax(320px,400px)_minmax(0,1fr)]">
          {/* ============ LEFT: destination summary ============ */}
          <aside className="flex min-h-0 flex-col gap-3">
            {/* Image card */}
            <div className="relative isolate h-56 shrink-0 overflow-hidden rounded-2xl bg-midnight sm:h-64 lg:h-auto lg:min-h-0 lg:flex-1">
              {destination.image && (
                <motion.img
                  src={destination.image}
                  alt={destination.name}
                  initial={reduce ? false : { opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1, ease: EASE }}
                  className="absolute inset-0 -z-20 h-full w-full object-cover"
                />
              )}
              <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/80 via-black/15 to-black/30" />

              <div className="flex h-full flex-col justify-between p-4">
                <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-[11px] text-white/75">
                  <Link
                    to="/destinations"
                    className={`inline-flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-1 backdrop-blur-md transition hover:bg-white hover:text-midnight ${focusRing}`}
                  >
                    <ArrowLeft className="h-3 w-3" aria-hidden="true" />
                    All destinations
                  </Link>
                </nav>

                <div>
                  <p className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-1 text-[11px] text-white backdrop-blur-md">
                    <MapPin className="h-3 w-3 text-gold" aria-hidden="true" />
                    {destination.region || destination.name}
                  </p>
                  <h1 className="mt-2 font-display text-3xl leading-[1.05] text-white sm:text-4xl">
                    {destination.name}
                  </h1>
                  {destination.description && (
                    <p className="mt-1.5 line-clamp-2 max-w-sm text-xs leading-relaxed text-white/80">
                      {destination.description}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* About + actions card */}
            <div className="flex shrink-0 flex-col rounded-2xl bg-midnight p-4 text-white lg:max-h-[42%]">
              <h2 className="text-xs font-semibold text-gold">About {destination.name}</h2>
              <p className="mt-1.5 min-h-0 overflow-y-auto pr-1 text-xs leading-relaxed text-white/75 lg:max-h-28">
                {about}
              </p>

              <div className="mt-3 flex items-center gap-2">
                <button
                  type="button"
                  onClick={openBooking}
                  className={`group inline-flex flex-1 items-center justify-between gap-2 rounded-full bg-gold py-1 pl-4 pr-1 text-xs font-semibold text-midnight transition-transform hover:scale-[1.02] ${focusRing}`}
                >
                  Plan my stay
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-midnight text-gold transition-transform duration-300 group-hover:rotate-45">
                    <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </span>
                </button>
                <Link
                  to="/destinations"
                  className={`inline-flex h-10 items-center rounded-full border border-white/30 px-4 text-xs font-semibold text-white transition hover:bg-white hover:text-midnight ${focusRing}`}
                >
                  Other destinations
                </Link>
              </div>
            </div>
          </aside>

          {/* ============ RIGHT: places to stay ============ */}
          <section
            id="destination-stays"
            aria-labelledby="stays-heading"
            className="flex min-h-[60svh] min-w-0 flex-col overflow-hidden rounded-2xl border border-[#e3dccd] bg-white/90 lg:min-h-0"
          >
            <header className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-b border-[#eee7d9] px-4 py-3">
              <div className="flex items-center gap-2.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-midnight text-gold">
                  <BedDouble className="h-4 w-4" aria-hidden="true" />
                </span>
                <div>
                  <h2 id="stays-heading" className="text-sm font-semibold text-midnight">
                    Places to stay
                  </h2>
                  <p className="text-[11px] text-midnight/55" aria-live="polite">
                    {loadingStays
                      ? 'Checking available stays...'
                      : count === 0
                        ? 'Listings coming soon'
                        : q
                          ? `${visibleResorts.length} of ${count} ${count === 1 ? 'stay' : 'stays'}`
                          : `${count} ${count === 1 ? 'stay' : 'stays'} in ${destination.name}`}
                  </p>
                </div>
              </div>

              {count > 4 && (
                <div className="relative w-full sm:w-56">
                  <label htmlFor="stay-search" className="sr-only">
                    Search stays in {destination.name}
                  </label>
                  <Search
                    aria-hidden="true"
                    className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-midnight/40"
                  />
                  <input
                    id="stay-search"
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Escape' && setQuery('')}
                    placeholder="Search stays"
                    className="h-8 w-full rounded-full border border-[#e3dccd] bg-[#faf8f3] pl-9 pr-8 text-xs text-midnight placeholder:text-midnight/45 focus:border-midnight focus:bg-white focus:outline-none"
                  />
                  {query && (
                    <button
                      type="button"
                      onClick={() => setQuery('')}
                      aria-label="Clear search"
                      className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1 text-midnight/50 hover:bg-black/5 hover:text-midnight"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </div>
              )}
            </header>

            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-3">
              {loadingStays ? (
                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3 animate-pulse">
                  {[1, 2, 3].map((n) => (
                    <div key={n} className="h-56 rounded-2xl bg-[#eee7d9]" />
                  ))}
                </div>
              ) : visibleResorts.length > 0 ? (
                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  {visibleResorts.map((resort, i) => (
                    <motion.div
                      key={resort.slug || resort._id || resort.id}
                      initial={reduce ? false : { opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: Math.min(i, 5) * 0.04, ease: EASE }}
                    >
                      <ResortCard resort={resort} compact />
                    </motion.div>
                  ))}
                </div>
              ) : count > 0 ? (
                <div className="grid h-full place-items-center px-4 py-10 text-center">
                  <div>
                    <p className="text-sm font-semibold text-midnight">No stays match “{query}”</p>
                    <button
                      type="button"
                      onClick={() => setQuery('')}
                      className="mt-2 text-xs font-semibold text-midnight underline hover:no-underline"
                    >
                      Clear search
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid h-full place-items-center px-4 py-10 text-center">
                  <div className="max-w-xs">
                    <p className="font-display text-xl text-midnight">Listings are coming soon</p>
                    <p className="mt-1.5 text-xs leading-relaxed text-midnight/65">
                      We’re preparing stays for {destination.name}. Tell us your dates and we’ll suggest
                      the right base for your trip.
                    </p>
                    <button
                      type="button"
                      onClick={openBooking}
                      className="mt-4 rounded-full bg-midnight px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-midnight/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                    >
                      Ask us about {destination.name}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </PageTransition>
  )
}
