import { useEffect, useMemo, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowLeft, ArrowUpRight, Check, ExternalLink, MapPin, Star } from 'lucide-react'
import PageTransition from '../components/layout/PageTransition'
import ResortCard from '../components/ui/ResortCard'
import { api } from '../services/api'
import { destinations } from '../data/destinations'

const EASE = [0.16, 1, 0.3, 1]

const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-0'

// Matches the fixed navbar clearance used on the other destination pages
const PAGE_PADDING =
  'px-3 pb-3 pt-[104px] sm:px-5 sm:pb-4 sm:pt-[116px] lg:px-8 lg:pt-[124px]'

function DetailsSkeleton() {
  return (
    <div className={`flex h-[100svh] flex-col ${PAGE_PADDING}`}>
      <div className="mx-auto grid min-h-0 w-full max-w-[1500px] flex-1 animate-pulse gap-3 pt-3 lg:grid-cols-[minmax(320px,400px)_minmax(0,1fr)]">
        <div className="rounded-2xl bg-[#e4ddcf]" />
        <div className="rounded-2xl bg-[#ece6da]" />
      </div>
    </div>
  )
}

export default function ResortDetailsPage() {
  const { slug } = useParams()
  const reduce = useReducedMotion()

  const [resort, setResort] = useState(null)
  const [relatedStays, setRelatedStays] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    let mounted = true
    const fetchDetails = async () => {
      try {
        setLoading(true)
        const res = await api.getPropertyBySlug(slug)
        if (mounted && res && res.property) {
          setResort(res.property)
          setRelatedStays(res.relatedProperties || [])
        }
      } catch (err) {
        console.error('Error fetching property details:', err)
        if (mounted) setResort(null)
      } finally {
        if (mounted) setLoading(false)
      }
    }

    fetchDetails()
    return () => {
      mounted = false
    }
  }, [slug])

  // Start on the overview tab for every resort
  useEffect(() => setActiveTab('overview'), [slug])

  const navigate = useNavigate()
  const openBooking = () => {
    navigate(`/contact?subject=${encodeURIComponent(`Resort Stay: ${resort?.name || 'Resort Enquiry'}`)}`)
  }

  const amenities = resort?.amenities || []
  const highlights = useMemo(() => {
    if (!resort) return []
    return resort.highlights && resort.highlights.length > 0
      ? resort.highlights
      : amenities.slice(0, 4)
  }, [resort, amenities])

  const tabs = useMemo(
    () => [
      { id: 'overview', label: 'Overview' },
      ...(amenities.length ? [{ id: 'amenities', label: 'Amenities', count: amenities.length }] : []),
      { id: 'location', label: 'Location' },
      ...(relatedStays.length
        ? [{ id: 'stays', label: 'More stays', count: relatedStays.length }]
        : []),
    ],
    [amenities.length, relatedStays.length],
  )

  if (loading) {
    return (
      <PageTransition>
        <div className="bg-[#f9f4ee]">
          <DetailsSkeleton />
        </div>
      </PageTransition>
    )
  }

  if (!resort) {
    return (
      <PageTransition>
        <section className="grid min-h-[100svh] place-items-center bg-[#f9f4ee] px-5">
          <div className="max-w-sm text-center">
            <p className="font-display text-7xl leading-none text-midnight/20">404</p>
            <h1 className="mt-2 font-display text-2xl text-midnight">Resort not found</h1>
            <p className="mt-2 text-xs text-midnight/65">
              The property you’re looking for isn’t available right now.
            </p>
            <Link
              to="/resorts"
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-midnight px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-midnight/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
            >
              <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
              Browse all resorts
            </Link>
          </div>
        </section>
      </PageTransition>
    )
  }

  const destination = destinations?.find(
    (item) => item.resortDestination === resort.destination || item.name === resort.destination,
  )
  const destinationPath = destination ? `/destinations/${destination.slug}` : '/destinations'
  const mapQuery = resort.mapQuery || resort.location
  const mapLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`
  const destinationDescription =
    resort.destinationDescription ||
    `Discover the history, culture and scenery that make ${resort.destination} a memorable place to stay.`
  const rating = resort.rating ?? '4.9'

  return (
    <PageTransition>
      <div
        className={`page-destinations flex min-h-[100svh] flex-col bg-[#f9f4ee] pb-20 lg:h-[100svh] lg:overflow-hidden lg:pb-4 ${PAGE_PADDING}`}
      >
        <div className="mx-auto grid min-h-0 w-full max-w-[1500px] flex-1 gap-3 pt-3 lg:grid-cols-[minmax(320px,400px)_minmax(0,1fr)]">
          {/* ============ LEFT: resort summary ============ */}
          <aside className="flex min-h-0 flex-col gap-3">
            <div className="relative isolate h-60 shrink-0 overflow-hidden rounded-2xl bg-midnight sm:h-72 lg:h-auto lg:min-h-0 lg:flex-1">
              {resort.image && (
                <motion.img
                  src={resort.image}
                  alt={resort.name}
                  initial={reduce ? false : { opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1, ease: EASE }}
                  className="absolute inset-0 -z-20 h-full w-full object-cover"
                />
              )}
              <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/85 via-black/15 to-black/30" />

              <div className="flex h-full flex-col justify-between p-4">
                <div className="flex items-start justify-between gap-2">
                  <Link
                    to={destinationPath}
                    className={`inline-flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-1 text-[11px] text-white backdrop-blur-md transition hover:bg-white hover:text-midnight ${focusRing}`}
                  >
                    <ArrowLeft className="h-3 w-3" aria-hidden="true" />
                    {resort.destination}
                  </Link>
                  <span className="inline-flex items-center gap-1 rounded-full bg-midnight/80 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-md">
                    <Star className="h-3 w-3 fill-gold text-gold" aria-hidden="true" />
                    {rating}
                  </span>
                </div>

                <div>
                  <p className="inline-flex max-w-full items-center gap-1 rounded-full bg-white/15 px-2.5 py-1 text-[11px] text-white backdrop-blur-md">
                    <MapPin className="h-3 w-3 shrink-0 text-gold" aria-hidden="true" />
                    <span className="truncate">{resort.location}</span>
                  </p>
                  <h1 className="mt-2 font-display text-3xl leading-[1.05] text-white sm:text-4xl">
                    {resort.name}
                  </h1>
                </div>
              </div>
            </div>

            {/* Stay summary + actions */}
            <div className="shrink-0 rounded-2xl bg-midnight p-4 text-white">
              <dl className="space-y-2 text-xs">
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-white/60">Destination</dt>
                  <dd className="font-semibold">{resort.destination}</dd>
                </div>
                {resort.source && (
                  <div className="flex items-center justify-between gap-3">
                    <dt className="text-white/60">Booking channel</dt>
                    <dd className="font-semibold capitalize text-gold">
                      {resort.source.replace(/_/g, ' ').toLowerCase()}
                    </dd>
                  </div>
                )}
              </dl>

              <div className="mt-3 flex items-center gap-2 border-t border-white/15 pt-3">
                <button
                  type="button"
                  onClick={openBooking}
                  className={`group hidden flex-1 items-center justify-between gap-2 rounded-full bg-gold py-1 pl-4 pr-1 text-xs font-semibold text-midnight transition-transform hover:scale-[1.02] lg:inline-flex ${focusRing}`}
                >
                  Plan my stay
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-midnight text-gold transition-transform duration-300 group-hover:rotate-45">
                    <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </span>
                </button>
                <a
                  href={mapLink}
                  target="_blank"
                  rel="noreferrer"
                  className={`inline-flex h-10 flex-1 items-center justify-center gap-1.5 rounded-full border border-white/30 px-4 text-xs font-semibold text-white transition hover:bg-white hover:text-midnight lg:flex-none ${focusRing}`}
                >
                  Get directions
                  <ExternalLink className="h-3 w-3" aria-hidden="true" />
                </a>
              </div>
            </div>
          </aside>

          {/* ============ RIGHT: tabbed details ============ */}
          <section
            aria-label={`${resort.name} details`}
            className="flex min-h-[70svh] min-w-0 flex-col overflow-hidden rounded-2xl border border-[#e3dccd] bg-white/90 lg:min-h-0"
          >
            <div
              role="tablist"
              aria-label="Resort information"
              className="flex shrink-0 gap-1 overflow-x-auto border-b border-[#eee7d9] p-2"
            >
              {tabs.map((tab) => {
                const selected = activeTab === tab.id
                return (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    id={`tab-${tab.id}`}
                    aria-selected={selected}
                    aria-controls={`panel-${tab.id}`}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${focusRing} ${selected
                        ? 'bg-midnight text-white'
                        : 'text-midnight/65 hover:bg-[#f3ece0] hover:text-midnight'
                      }`}
                  >
                    {tab.label}
                    {tab.count !== undefined && (
                      <span
                        className={`tabular-nums ${selected ? 'text-white/55' : 'text-midnight/40'}`}
                      >
                        {tab.count}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>

            <div
              role="tabpanel"
              id={`panel-${activeTab}`}
              aria-labelledby={`tab-${activeTab}`}
              className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-4 sm:p-5"
            >
              {/* ---- Overview ---- */}
              {activeTab === 'overview' && (
                <div className="space-y-5">
                  <div>
                    <h2 className="text-sm font-semibold text-midnight">About this stay</h2>
                    <p className="mt-1.5 max-w-prose text-xs leading-relaxed text-midnight/75">
                      {resort.description}
                    </p>
                  </div>

                  {highlights.length > 0 && (
                    <div>
                      <h3 className="text-xs font-semibold text-midnight">Highlights</h3>
                      <ul className="mt-2 grid gap-2 sm:grid-cols-2">
                        {highlights.map((item) => (
                          <li
                            key={item}
                            className="flex items-start gap-2 rounded-xl border border-[#eee7d9] bg-[#faf8f3] p-2.5 text-xs leading-relaxed text-midnight/80"
                          >
                            <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-gold/20 text-[#a07d2c]">
                              <Check className="h-2.5 w-2.5" strokeWidth={3} aria-hidden="true" />
                            </span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="rounded-xl bg-[#f6f0e4] p-3.5">
                    <h3 className="text-xs font-semibold text-midnight">
                      About {resort.destination}
                    </h3>
                    <p className="mt-1.5 max-w-prose text-xs leading-relaxed text-midnight/70">
                      {destinationDescription}
                    </p>
                    {resort.knowYourDestination && (
                      <p className="mt-1.5 max-w-prose text-xs leading-relaxed text-midnight/70">
                        {resort.knowYourDestination}
                      </p>
                    )}
                    <Link
                      to={destinationPath}
                      className={`mt-2.5 inline-flex items-center gap-1 text-xs font-semibold text-midnight underline underline-offset-4 hover:no-underline ${focusRing}`}
                    >
                      See all {resort.destination} stays
                      <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
                    </Link>
                  </div>
                </div>
              )}

              {/* ---- Amenities ---- */}
              {activeTab === 'amenities' && (
                <div>
                  <h2 className="text-sm font-semibold text-midnight">Amenities and privileges</h2>
                  <ul className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-3">
                    {amenities.map((amenity) => (
                      <li
                        key={amenity}
                        className="flex items-center gap-2 rounded-xl border border-[#eee7d9] bg-[#faf8f3] px-3 py-2 text-xs text-midnight"
                      >
                        <Check
                          className="h-3 w-3 shrink-0 text-[#a07d2c]"
                          strokeWidth={3}
                          aria-hidden="true"
                        />
                        {amenity}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* ---- Location ---- */}
              {activeTab === 'location' && (
                <div className="flex h-full min-h-[320px] flex-col gap-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="flex items-center gap-1.5 text-xs text-midnight/75">
                      <MapPin className="h-3.5 w-3.5 shrink-0 text-[#e84a28]" aria-hidden="true" />
                      {resort.location}
                    </p>
                    <a
                      href={mapLink}
                      target="_blank"
                      rel="noreferrer"
                      className={`inline-flex items-center gap-1 text-xs font-semibold text-midnight underline underline-offset-4 hover:no-underline ${focusRing}`}
                    >
                      Open in Google Maps
                      <ExternalLink className="h-3 w-3" aria-hidden="true" />
                    </a>
                  </div>
                  <div className="min-h-[280px] flex-1 overflow-hidden rounded-xl border border-[#e8dfcf]">
                    <iframe
                      title={`Map showing ${resort.name}`}
                      src={`https://www.google.com/maps?q=${encodeURIComponent(mapQuery)}&output=embed`}
                      className="h-full min-h-[280px] w-full"
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  </div>
                </div>
              )}

              {/* ---- More stays ---- */}
              {activeTab === 'stays' && (
                <div>
                  <div className="mb-3 flex items-center justify-between gap-2">
                    <h2 className="text-sm font-semibold text-midnight">
                      More stays in {resort.destination}
                    </h2>
                    <Link
                      to={destinationPath}
                      className={`inline-flex items-center gap-1 text-xs font-semibold text-midnight underline underline-offset-4 hover:no-underline ${focusRing}`}
                    >
                      View all
                      <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
                    </Link>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                    {relatedStays.map((related) => (
                      <ResortCard
                        key={related.slug || related._id || related.id}
                        resort={related}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* ============ Sticky mobile enquiry bar ============ */}
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-[#e6ddce] bg-white/95 px-4 py-2.5 shadow-2xl backdrop-blur-lg lg:hidden">
          <div className="mx-auto flex max-w-xl items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-midnight">{resort.name}</p>
              <p className="truncate text-[11px] text-midnight/60">{resort.destination}</p>
            </div>
            <button
              type="button"
              onClick={openBooking}
              className={`shrink-0 rounded-full bg-gold px-5 py-2.5 text-xs font-semibold text-midnight transition hover:bg-[#e84a28] hover:text-white ${focusRing}`}
            >
              Plan my stay
            </button>
          </div>
        </div>
      </div>
    </PageTransition>
  )
}