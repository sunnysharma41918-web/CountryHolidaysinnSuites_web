import { useRef, useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { ArrowDown, ArrowLeft, ArrowUpRight, Check, ExternalLink, MapPin, Star } from 'lucide-react'
import PageTransition from '../components/layout/PageTransition'
import ResortCard from '../components/ui/ResortCard'
import { api } from '../services/api'
import { destinations } from '../data/destinations'

const EASE = [0.16, 1, 0.3, 1]

/* Editorial Eyebrow with gold horizontal rule */
function Eyebrow({ children }) {
  return (
    <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-gold">
      <span className="h-px w-10 bg-gold" />
      {children}
    </p>
  )
}

function Reveal({ children, delay = 0, className = '' }) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.9, delay, ease: EASE }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

function DetailsSkeleton() {
  return (
    <div className="box-border min-h-[100svh] px-3 pb-4 pt-[5.5rem] sm:px-5 sm:pb-5 sm:pt-[6.5rem]">
      <div className="mx-auto h-[calc(100svh-6.5rem)] max-w-[96rem] animate-pulse rounded-[2rem] bg-[#e4ddcf] sm:rounded-[2.75rem]" />
    </div>
  )
}

export default function ResortDetailsPage() {
  const { slug } = useParams()
  const reduce = useReducedMotion()
  const heroRef = useRef(null)
  const detailsRef = useRef(null)

  const [resort, setResort] = useState(null)
  const [relatedStays, setRelatedStays] = useState([])
  const [loading, setLoading] = useState(true)

  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const imgY = useTransform(scrollYProgress, [0, 1], ['0%', '20%'])
  const imgScale = useTransform(scrollYProgress, [0, 1], [1, 1.15])
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '-18%'])
  const textOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])

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

  const scrollToDetails = () =>
    detailsRef.current?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' })

  const openBooking = () =>
    window.dispatchEvent(
      new CustomEvent('open-booking-modal', {
        detail: {
          destination: resort?.name || 'Resort Enquiry',
          persons: '2 Persons',
          days: 'Stay Reservation',
        },
      })
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
          <div className="max-w-xl text-center">
            <p className="font-display text-[9rem] leading-none text-transparent [-webkit-text-stroke:1.5px_rgba(11,18,38,0.2)]">
              404
            </p>
            <h1 className="-mt-6 font-display text-4xl text-midnight sm:text-5xl">Resort not found</h1>
            <p className="mt-4 text-midnight/65">
              The property you’re looking for isn’t available in our current collection.
            </p>
            <Link
              to="/resorts"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-midnight px-7 py-3.5 text-sm font-medium text-white transition hover:bg-midnight/90 focus:outline-none focus-visible:ring-4 focus-visible:ring-gold/70"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Browse every resort
            </Link>
          </div>
        </section>
      </PageTransition>
    )
  }

  const words = String(resort.name).split(' ')
  const destination = destinations.find((item) => item.resortDestination === resort.destination)
  const destinationPath = destination ? `/destinations/${destination.slug}` : '/destinations'
  const mapQuery = resort.mapQuery || resort.location
  const mapLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`
  const amenities = resort.amenities || []
  const highlights =
    resort.highlights && resort.highlights.length > 0 ? resort.highlights : amenities.slice(0, 4)
  const destinationDescription =
    resort.destinationDescription ||
    `Discover the history, culture, and natural scenery that make ${resort.destination} one of our most distinguished destination retreats.`

  return (
    <PageTransition>
      <div className="bg-[#f9f4ee]">
        {/* ================= 1. INTRO HERO (Full Screen Floating Card) ================= */}
        <section
          ref={heroRef}
          className="box-border min-h-[100svh] px-3 pb-4 pt-[5.5rem] sm:px-5 sm:pb-6 sm:pt-[6rem] lg:min-h-[100svh] flex flex-col justify-center"
        >
          <div className="relative isolate mx-auto w-full min-h-[calc(100svh-6rem)] max-w-[96rem] overflow-hidden rounded-[2rem] bg-midnight sm:rounded-[2.75rem] flex flex-col justify-between shadow-2xl">
            {resort.image && (
              <motion.img
                src={resort.image}
                alt={resort.name}
                style={reduce ? undefined : { y: imgY, scale: imgScale }}
                className="absolute inset-0 -z-20 h-full w-full object-cover"
                initial={reduce ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.6, ease: EASE }}
              />
            )}
            <div className="absolute inset-0 -z-10 bg-[linear-gradient(100deg,rgba(0,0,0,0.85)_0%,rgba(0,0,0,0.48)_55%,rgba(0,0,0,0.3)_100%)]" />
            <div className="absolute inset-x-0 bottom-0 -z-10 h-3/4 bg-gradient-to-t from-black/95 via-black/60 to-transparent" />

            <motion.div
              style={reduce ? undefined : { y: textY, opacity: textOpacity }}
              className="flex min-h-[calc(100svh-6rem)] flex-1 flex-col justify-between px-6 pt-6 pb-8 sm:px-10 sm:pt-8 sm:pb-12 lg:px-16 lg:pt-10 lg:pb-14"
            >
              {/* Breadcrumb Pill */}
              <motion.nav
                aria-label="Breadcrumb"
                initial={reduce ? false : { opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: EASE }}
                className="flex items-center gap-2 text-xs sm:text-sm text-white/70"
              >
                <Link
                  to={destinationPath}
                  className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3.5 py-1.5 ring-1 ring-white/20 backdrop-blur-md transition hover:bg-white hover:text-midnight"
                >
                  <ArrowLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4" aria-hidden="true" />
                  {resort.destination}
                </Link>
                <span aria-hidden="true">/</span>
                <span className="truncate text-white font-medium">{resort.name}</span>
              </motion.nav>

              {/* Title & Metadata Bottom Anchor */}
              <div className="mt-auto pt-6 sm:pt-8">
                <motion.div
                  initial={reduce ? false : { opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.9, delay: 0.1, ease: EASE }}
                  className="mb-2.5 sm:mb-3.5"
                >
                  <Eyebrow>Signature Retreat</Eyebrow>
                </motion.div>

                <h1 className="max-w-5xl font-display text-[clamp(2.1rem,4.5vw,4.85rem)] leading-[1.02] tracking-[-0.03em] text-white">
                  {words.map((w, i) => (
                    <span key={i} className="mr-[0.22em] inline-block overflow-hidden pb-[0.1em] align-bottom">
                      <motion.span
                        className="inline-block"
                        initial={reduce ? false : { y: '115%', rotate: 6 }}
                        animate={{ y: 0, rotate: 0 }}
                        transition={{ duration: 1.2, delay: 0.2 + i * 0.1, ease: EASE }}
                      >
                        {i === words.length - 1 ? <em className="italic text-gold">{w}</em> : w}
                      </motion.span>
                    </span>
                  ))}
                </h1>

                <div className="mt-5 flex flex-col gap-5 sm:mt-6 sm:gap-6 lg:flex-row lg:items-end lg:justify-between">
                  <motion.div
                    initial={reduce ? false : { opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.9, delay: 0.55, ease: EASE }}
                    className="max-w-lg"
                  >
                    <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-xs sm:text-sm text-white ring-1 ring-white/20 backdrop-blur-md">
                      <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gold" aria-hidden="true" />
                      {resort.location}
                    </p>
                    {resort.description && (
                      <p className="mt-2.5 line-clamp-2 text-xs leading-relaxed text-white/80 sm:mt-3 sm:line-clamp-3 sm:text-sm lg:text-base">
                        {resort.description}
                      </p>
                    )}
                  </motion.div>

                  <motion.div
                    initial={reduce ? false : { opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.9, delay: 0.7, ease: EASE }}
                    className="flex shrink-0 items-center gap-5 sm:gap-6"
                  >
                    <div className="leading-none text-white">
                      <div className="flex items-center gap-1.5 text-gold font-display text-3xl sm:text-4xl lg:text-5xl">
                        <span>4.9</span>
                        <Star className="h-5 w-5 sm:h-6 sm:w-6 fill-gold text-gold inline" />
                      </div>
                      <span className="mt-1 block text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-white/70">
                        Guest Rating
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={scrollToDetails}
                      aria-label="Explore resort details"
                      className="group inline-flex items-center gap-3 rounded-full bg-gold py-1.5 pl-5 sm:pl-6 pr-1.5 text-xs sm:text-sm font-semibold text-midnight transition-transform duration-300 hover:scale-[1.03] focus:outline-none focus-visible:ring-4 focus-visible:ring-white/60 shadow-lg"
                    >
                      Explore retreat
                      <span className="grid h-10 w-10 sm:h-11 sm:w-11 place-items-center rounded-full bg-midnight text-gold">
                        <motion.span
                          animate={reduce ? undefined : { y: [0, 4, 0] }}
                          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                        >
                          <ArrowDown className="h-4 w-4" aria-hidden="true" />
                        </motion.span>
                      </span>
                    </button>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ================= 2. ABOUT THE RETREAT & BOOKING CARD (12-Col Grid) ================= */}
        <section ref={detailsRef} className="mx-auto max-w-7xl px-4 py-14 sm:px-8 sm:py-24 lg:px-12">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
            {/* Left 7 Columns: Story, Highlights & Amenities */}
            <div className="lg:col-span-7">
              <Reveal>
                <Eyebrow>About the retreat</Eyebrow>
              </Reveal>

              <Reveal delay={0.08}>
                <h2 className="mt-4 font-display text-3xl leading-[1.05] text-midnight sm:mt-5 sm:text-5xl lg:text-6xl">
                  Find sanctuary at <em className="italic text-gold">{resort.name}.</em>
                </h2>
              </Reveal>

              <Reveal delay={0.16}>
                <p className="mt-5 text-sm leading-relaxed text-midnight/75 sm:mt-7 sm:text-base sm:leading-8 lg:text-lg">
                  {resort.description}
                </p>
              </Reveal>

              {/* Highlights */}
              {highlights.length > 0 && (
                <div className="mt-12 sm:mt-14">
                  <Reveal delay={0.2}>
                    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#8a7f68]">
                      Distinctive Highlights
                    </p>
                    <h3 className="mt-2 font-display text-2xl text-midnight sm:text-3xl">
                      Why guests fall in love with this retreat
                    </h3>
                  </Reveal>

                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    {highlights.map((highlight, idx) => (
                      <Reveal key={highlight} delay={0.24 + idx * 0.05}>
                        <div className="flex items-start gap-3 rounded-2xl border border-[#e8dfcf] bg-white p-4 text-sm leading-6 text-midnight/80 shadow-sm">
                          <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gold/15 text-gold">
                            <Check className="h-3 w-3" strokeWidth={3} />
                          </span>
                          <span>{highlight}</span>
                        </div>
                      </Reveal>
                    ))}
                  </div>
                </div>
              )}

              {/* Amenities Pills */}
              {amenities.length > 0 && (
                <div className="mt-12 sm:mt-14">
                  <Reveal delay={0.28}>
                    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#8a7f68]">
                      Inclusive Comforts
                    </p>
                    <h3 className="mt-2 font-display text-2xl text-midnight sm:text-3xl">
                      Amenities & Privileges
                    </h3>
                  </Reveal>

                  <Reveal delay={0.32} className="mt-5">
                    <ul className="flex flex-wrap gap-2.5">
                      {amenities.map((amenity) => (
                        <li
                          key={amenity}
                          className="rounded-full border border-[#d8cfbf] bg-white px-4 py-2 text-sm text-midnight shadow-sm"
                        >
                          {amenity}
                        </li>
                      ))}
                    </ul>
                  </Reveal>
                </div>
              )}

              {/* Destination Guide Box */}
              <Reveal delay={0.36} className="mt-14">
                <div className="rounded-3xl bg-midnight p-7 text-white sm:p-10">
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">Destination Context</p>
                  <h3 className="mt-2 font-display text-3xl sm:text-4xl">
                    Know {resort.destination}
                  </h3>
                  <p className="mt-5 max-w-[65ch] text-sm leading-7 text-white/75 sm:text-base sm:leading-8">
                    {destinationDescription}
                  </p>
                  <p className="mt-3 max-w-[65ch] text-sm leading-7 text-white/75">
                    {resort.knowYourDestination ||
                      `Our concierge is always on hand to assist you in designing the most memorable season and excursion itinerary in ${resort.destination}.`}
                  </p>
                  <Link
                    to={destinationPath}
                    className="mt-7 inline-flex items-center gap-2 rounded-full border border-white/30 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-white hover:text-midnight focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                  >
                    Explore all {resort.destination} stays
                  </Link>
                </div>
              </Reveal>
            </div>

            {/* Right 5 Columns: The Floating Luxury Reservation Card */}
            <Reveal delay={0.12} className="lg:col-span-5">
              <aside className="sticky top-28 relative isolate flex flex-col justify-between gap-6 overflow-hidden rounded-[2.5rem] bg-midnight p-6 text-white sm:gap-8 sm:p-9 shadow-2xl">
                <div
                  aria-hidden="true"
                  className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_90%_0%,rgba(201,162,75,0.35),transparent_55%)]"
                />

                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">Your stay</p>
                  <p className="mt-3 font-display text-3xl leading-tight sm:mt-4 sm:text-4xl">
                    {resort.name}
                  </p>
                  <p className="mt-2.5 flex items-center gap-2 text-sm text-white/80">
                    <MapPin className="h-4 w-4 text-gold shrink-0" />
                    <span>{resort.location}</span>
                  </p>

                  <div className="mt-6 border-t border-white/15 pt-5 space-y-3 text-xs sm:text-sm text-white/70">
                    <div className="flex items-center justify-between">
                      <span>Destination</span>
                      <span className="font-semibold text-white">{resort.destination}</span>
                    </div>
                    {resort.source && (
                      <div className="flex items-center justify-between">
                        <span>Channel Booking</span>
                        <span className="font-mono text-xs text-gold uppercase">{resort.source.replace(/_/g, ' ')}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <span>Hospitality Tier</span>
                      <span className="text-white">Signature Experience</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t border-white/15">
                  <button
                    type="button"
                    onClick={openBooking}
                    className="group flex w-full items-center justify-between rounded-full bg-gold py-2 pl-6 pr-2 text-sm font-semibold text-midnight transition-transform duration-300 hover:scale-[1.02] focus:outline-none focus-visible:ring-4 focus-visible:ring-white/60 shadow-lg"
                  >
                    <span>Plan my stay</span>
                    <span className="grid h-10 w-10 place-items-center rounded-full bg-midnight text-gold transition-transform duration-500 group-hover:rotate-45">
                      <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                    </span>
                  </button>

                  <a
                    href={mapLink}
                    target="_blank"
                    rel="noreferrer"
                    className="flex w-full items-center justify-center gap-2 rounded-full border border-white/35 py-3 text-sm font-semibold text-white transition hover:bg-white hover:text-midnight focus:outline-none focus-visible:ring-4 focus-visible:ring-white/60"
                  >
                    <span>Get directions</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              </aside>
            </Reveal>
          </div>
        </section>

        {/* ================= 3. LOCATION & WHERE YOU'LL BE ================= */}
        <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-8 sm:pb-24 lg:px-12" aria-labelledby="property-location">
          <div className="border-t border-midnight/15 pt-10 sm:pt-14">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <Reveal>
                  <Eyebrow>Location</Eyebrow>
                </Reveal>
                <Reveal delay={0.08}>
                  <h2 id="property-location" className="mt-3 font-display text-3xl leading-tight text-midnight sm:text-5xl">
                    Where you'll be in <em className="italic text-gold">{resort.destination}.</em>
                  </h2>
                </Reveal>
                <p className="mt-2 flex items-center gap-2 text-sm leading-6 text-midnight/70">
                  <MapPin className="h-4 w-4 shrink-0 text-gold" />
                  {resort.location}
                </p>
              </div>

              <a
                href={mapLink}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-midnight underline underline-offset-4 hover:no-underline"
              >
                Open in Google Maps
                <ExternalLink className="h-4 w-4 text-gold" />
              </a>
            </div>

            <div className="mt-8 overflow-hidden rounded-[2.5rem] border border-[#e8dfcf] bg-white shadow-soft">
              <iframe
                title={`Map showing ${resort.name}`}
                src={`https://www.google.com/maps?q=${encodeURIComponent(mapQuery)}&output=embed`}
                className="h-[340px] w-full sm:h-[480px]"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </section>

        {/* ================= 4. MORE STAYS IN THIS DESTINATION ================= */}
        <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-8 sm:pb-28 lg:px-12" aria-labelledby="related-stays">
          <div className="flex flex-col justify-between gap-4 border-t border-midnight/15 pt-10 sm:flex-row sm:items-end sm:pt-14">
            <div>
              <Reveal>
                <Eyebrow>Explore further</Eyebrow>
              </Reveal>
              <Reveal delay={0.08}>
                <h2 id="related-stays" className="mt-3 font-display text-3xl leading-[1.05] text-midnight sm:text-5xl">
                  More stays in <em className="italic text-gold">{resort.destination}.</em>
                </h2>
              </Reveal>
            </div>
            <Reveal delay={0.12}>
              <Link
                to={destinationPath}
                className="inline-flex items-center gap-1 text-sm font-semibold text-midnight hover:text-gold transition"
              >
                <span>View all {resort.destination} stays</span>
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Reveal>
          </div>

          {relatedStays.length > 0 ? (
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedStays.map((relatedResort, i) => (
                <motion.div
                  key={relatedResort.slug || relatedResort._id || relatedResort.id}
                  initial={reduce ? false : { opacity: 0, y: 35 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{ duration: 0.8, delay: (i % 3) * 0.08, ease: EASE }}
                  className="transition-transform duration-500 hover:-translate-y-1.5"
                >
                  <ResortCard resort={relatedResort} />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="mt-8 rounded-[2rem] border border-dashed border-midnight/20 bg-white/70 p-10 text-center">
              <p className="font-display text-2xl text-midnight">Exclusive private collection</p>
              <p className="mt-2 text-sm text-midnight/65">
                More retreats across {resort.destination} will be unveiled in our next catalog release.
              </p>
              <Link
                to="/resorts"
                className="mt-6 inline-flex rounded-full bg-midnight px-6 py-3 text-xs uppercase tracking-[0.2em] text-white"
              >
                Browse all resorts
              </Link>
            </div>
          )}
        </section>

        {/* ================= 5. STICKY MOBILE ENQUIRY BAR ================= */}
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-[#e6ddce] bg-white/95 px-5 py-3 backdrop-blur-lg lg:hidden shadow-2xl">
          <div className="mx-auto flex max-w-xl items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="truncate font-display text-lg text-midnight">{resort.name}</p>
              <p className="truncate text-xs text-charcoal/65">{resort.destination}</p>
            </div>
            <button
              type="button"
              onClick={openBooking}
              className="shrink-0 rounded-full bg-gold px-6 py-2.5 text-xs font-bold uppercase tracking-[0.16em] text-midnight transition hover:bg-[#e84a28] hover:text-white"
            >
              Plan my stay
            </button>
          </div>
        </div>
      </div>
    </PageTransition>
  )
}