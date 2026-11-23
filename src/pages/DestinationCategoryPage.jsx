import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { ArrowDown, ArrowLeft, ArrowUpRight, Search, X, BedDouble, MapPin, Sparkles } from 'lucide-react'
import PageTransition from '../components/layout/PageTransition'
import ResortCard from '../components/ui/ResortCard'
import { destinationMenuGroups, getDestinationBySlug } from '../data/destinations'
import { api } from '../services/api'

const EASE = [0.16, 1, 0.3, 1]

/* ------------------------------------------------------------------ */
/*  Field mapping: if your destination objects use other key names,   */
/*  change them here and nothing else in the page needs to move.      */
/* ------------------------------------------------------------------ */
const asUrl = (v) => (typeof v === 'string' ? v : v?.src || v?.url || '')
const imageOf = (d) => asUrl(d.image || d.img || d.cover || d.heroImage || d.thumbnail || d.images?.[0])
const nameOf = (d) => d.name || d.title || d.label || d.slug
const blurbOf = (d) => d.tagline || d.shortDescription || d.description || d.summary || ''
const placeOf = (d) => d.location || d.region || d.state || d.country || ''
const hrefOf = (d) => d.href || d.path || d.to || `/destinations/${d.slug}`
const pad = (n) => String(n + 1).padStart(2, '0')

/* ------------------------------------------------------------------ */
/*  Small destination card                                            */
/* ------------------------------------------------------------------ */
function DestRow({ destination, index, stayCount = 0 }) {
  const reduce = useReducedMotion()
  const img = imageOf(destination)
  const place = placeOf(destination)

  return (
    <motion.li
      layout={!reduce}
      initial={reduce ? false : { opacity: 0, y: 28, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, delay: (index % 5) * 0.06, ease: EASE }}
    >
      <Link
        to={hrefOf(destination)}
        className="group relative block aspect-[4/5] overflow-hidden rounded-2xl bg-midnight ring-1 ring-midnight/10 transition-shadow duration-500 hover:shadow-[0_18px_40px_-18px_rgba(11,18,38,0.55)] focus:outline-none focus-visible:ring-4 focus-visible:ring-gold/70"
      >
        {img ? (
          <img
            src={img}
            alt=""
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110 group-focus-visible:scale-110 motion-reduce:transition-none"
          />
        ) : (
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(201,162,75,0.4),transparent_60%)]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent transition-opacity duration-500 group-hover:from-black/90" />

        <span className="absolute left-3 top-3 font-display text-[11px] tracking-[0.2em] text-white/85">{pad(index)}</span>

        <span className="absolute right-2.5 top-2.5 grid h-8 w-8 -rotate-45 place-items-center rounded-full bg-white/90 text-midnight opacity-0 transition-all duration-500 group-hover:rotate-0 group-hover:bg-gold group-hover:opacity-100 group-focus-visible:rotate-0 group-focus-visible:opacity-100 max-sm:rotate-0 max-sm:opacity-100">
          <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
        </span>

        <div className="absolute inset-x-0 bottom-0 p-3.5">
          {stayCount > 0 && (
            <span className="mb-1.5 inline-flex items-center gap-1 rounded-full bg-gold/90 px-2.5 py-0.5 text-[10px] font-bold text-midnight shadow-sm backdrop-blur-sm">
              <Sparkles className="h-3 w-3" />
              {stayCount} {stayCount === 1 ? 'Property' : 'Properties'}
            </span>
          )}
          <h3 className="font-display text-lg leading-tight text-white sm:text-xl">{nameOf(destination)}</h3>
          {place && (
            <p className="mt-1 truncate text-[10px] font-medium uppercase tracking-[0.18em] text-white/70">{place}</p>
          )}
          <span
            aria-hidden="true"
            className="mt-2.5 block h-px origin-left scale-x-0 bg-gold transition-transform duration-700 ease-out group-hover:scale-x-100 group-focus-visible:scale-x-100"
          />
        </div>
      </Link>
    </motion.li>
  )
}

/* ------------------------------------------------------------------ */
/*  Page                                                              */
/* ------------------------------------------------------------------ */
export default function DestinationCategoryPage() {
  const { category } = useParams()
  const reduce = useReducedMotion()
  const [query, setQuery] = useState('')
  const [properties, setProperties] = useState([])
  const [loadingProperties, setLoadingProperties] = useState(true)
  const [selectedLocation, setSelectedLocation] = useState('All')

  const heroRef = useRef(null)
  const listRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const imgY = useTransform(scrollYProgress, [0, 1], ['0%', '20%'])
  const imgScale = useTransform(scrollYProgress, [0, 1], [1, 1.15])
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '-18%'])
  const textOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  const group = destinationMenuGroups.find((item) => item.slug === category)
  const categoryDestinations = useMemo(
    () => (group ? group.destinations.map(getDestinationBySlug).filter(Boolean) : []),
    [group],
  )

  useEffect(() => {
    setQuery('')
    setSelectedLocation('All')
  }, [category])

  useEffect(() => {
    let mounted = true
    const loadProperties = async () => {
      try {
        setLoadingProperties(true)
        const res = await api.getProperties({ limit: 100 })
        if (mounted && res && Array.isArray(res.properties)) {
          const isViaOta = category === 'via-ota'
          const filtered = res.properties.filter((p) => {
            const matchesDest = categoryDestinations.some(
              (d) => d.name?.toLowerCase() === p.destination?.toLowerCase()
            )
            if (isViaOta) {
              return matchesDest && (p.source === 'VIA_OTA' || p.source !== 'VIA_OTA_EXCHANGE')
            }
            if (category === 'via-ota-exchange') {
              return matchesDest || p.source === 'VIA_OTA_EXCHANGE'
            }
            return matchesDest
          })
          setProperties(filtered)
        }
      } catch (err) {
        console.warn('Error loading category properties:', err)
      } finally {
        if (mounted) setLoadingProperties(false)
      }
    }
    loadProperties()
    return () => {
      mounted = false
    }
  }, [category, categoryDestinations])

  // Group properties location-wise (by destination)
  const locationGroups = useMemo(() => {
    const map = new Map()
    properties.forEach((p) => {
      const destName = p.destination || 'Other'
      if (!map.has(destName)) {
        const destObj = categoryDestinations.find(
          (d) => d.name?.toLowerCase() === destName.toLowerCase()
        )
        map.set(destName, {
          name: destName,
          destinationObj: destObj,
          properties: [],
        })
      }
      map.get(destName).properties.push(p)
    })

    // Sort locations by property count descending
    return Array.from(map.values()).sort((a, b) => b.properties.length - a.properties.length)
  }, [properties, categoryDestinations])

  const locationFilters = useMemo(() => {
    return [
      { label: 'All Locations', value: 'All', count: properties.length },
      ...locationGroups.map((g) => ({
        label: g.name,
        value: g.name,
        count: g.properties.length,
      })),
    ]
  }, [properties.length, locationGroups])

  const q = query.trim().toLowerCase()

  const filteredLocationGroups = useMemo(() => {
    let groups = locationGroups
    if (selectedLocation !== 'All') {
      groups = groups.filter((g) => g.name.toLowerCase() === selectedLocation.toLowerCase())
    }
    if (q) {
      groups = groups
        .map((g) => ({
          ...g,
          properties: g.properties.filter((p) =>
            `${p.name} ${p.location} ${p.destination}`.toLowerCase().includes(q)
          ),
        }))
        .filter((g) => g.properties.length > 0 || g.name.toLowerCase().includes(q))
    }
    return groups
  }, [locationGroups, selectedLocation, q])

  const otherDestinations = useMemo(() => {
    const activeNames = new Set(locationGroups.map((g) => g.name.toLowerCase()))
    let others = categoryDestinations.filter((d) => !activeNames.has(d.name?.toLowerCase()))
    if (q) {
      others = others.filter((d) =>
        `${nameOf(d)} ${placeOf(d)}`.toLowerCase().includes(q)
      )
    }
    return others
  }, [categoryDestinations, locationGroups, q])

  const navigate = useNavigate()
  const openBooking = () => navigate(`/contact?subject=${encodeURIComponent(group?.label || 'Holiday Enquiry')}`)

  const scrollToList = () => listRef.current?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' })

  /* ---------------- not found ---------------- */
  if (!group) {
    return (
      <PageTransition>
        <section className="grid min-h-[100svh] place-items-center bg-[#f9f4ee] px-5">
          <div className="max-w-xl text-center">
            <p className="font-display text-[9rem] leading-none text-transparent [-webkit-text-stroke:1.5px_rgba(11,18,38,0.2)]">
              404
            </p>
            <h1 className="-mt-6 font-display text-4xl text-midnight sm:text-5xl">We couldn’t find that category</h1>
            <p className="mt-4 text-midnight/65">It may have been renamed or moved. Browse every destination instead.</p>
            <Link
              to="/destinations"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-midnight px-7 py-3.5 text-sm font-medium text-white transition hover:bg-midnight/90 focus:outline-none focus-visible:ring-4 focus-visible:ring-gold/70"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              All destinations
            </Link>
          </div>
        </section>
      </PageTransition>
    )
  }

  const cover = categoryDestinations.map(imageOf).find(Boolean)
  const thumbs = categoryDestinations.map(imageOf).filter(Boolean).slice(0, 4)
  const words = group.label.split(' ')

  return (
    <PageTransition>
      <div className="page-destinations bg-[#f9f4ee]">
        {/* ================= 1. intro (full screen) ================= */}
        <section ref={heroRef} className="box-border min-h-[100svh] px-3 pb-4 pt-[5.5rem] sm:px-5 sm:pb-5 sm:pt-[6.5rem] lg:h-[100svh]">
          <div className="relative isolate mx-auto h-full min-h-[calc(100svh-6.5rem)] max-w-[96rem] overflow-hidden rounded-[2rem] bg-midnight sm:rounded-[2.75rem]">
            {cover && (
              <motion.img
                src={cover}
                alt=""
                style={reduce ? undefined : { y: imgY, scale: imgScale }}
                className="absolute inset-0 -z-20 h-full w-full object-cover"
                initial={reduce ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.6, ease: EASE }}
              />
            )}
            <div className="absolute inset-0 -z-10 bg-[linear-gradient(100deg,rgba(0,0,0,0.8)_0%,rgba(0,0,0,0.35)_60%,rgba(0,0,0,0.2)_100%)]" />
            <div className="absolute inset-x-0 bottom-0 -z-10 h-2/3 bg-gradient-to-t from-black/80 to-transparent" />

            <motion.div
              style={reduce ? undefined : { y: textY, opacity: textOpacity }}
              className="flex h-full min-h-[calc(100svh-6.5rem)] flex-col justify-between px-5 pb-7 pt-6 sm:px-10 sm:pb-10 sm:pt-10 lg:px-16 lg:py-12"
            >
              <motion.nav
                aria-label="Breadcrumb"
                initial={reduce ? false : { opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: EASE }}
                className="flex items-center gap-2 text-xs sm:text-sm text-white/70"
              >
                <Link
                  to="/destinations"
                  className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3.5 py-1.5 ring-1 ring-white/20 backdrop-blur-md transition hover:bg-white hover:text-midnight"
                >
                  <ArrowLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4" aria-hidden="true" />
                  Destinations
                </Link>
                <span aria-hidden="true">/</span>
                <span className="truncate text-white">{group.label}</span>
              </motion.nav>

              <div className="pt-8 sm:pt-12">
                <motion.p
                  initial={reduce ? false : { opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.9, delay: 0.1, ease: EASE }}
                  className="mb-3 sm:mb-5 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.35em] text-gold"
                >
                  <span className="h-px w-8 sm:w-10 bg-gold" />
                  Collection
                </motion.p>

                <h1 className="max-w-6xl font-display text-[clamp(2.35rem,8.5vw,9rem)] leading-[0.95] tracking-[-0.03em] text-white">
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

                <div className="mt-6 flex flex-col gap-6 sm:mt-8 sm:gap-8 lg:flex-row lg:items-end lg:justify-between">
                  <motion.p
                    initial={reduce ? false : { opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.9, delay: 0.55, ease: EASE }}
                    className="max-w-md text-sm leading-relaxed text-white/80 sm:text-lg"
                  >
                    {`Every ${group.label} property and destination in one place. Pick a location to see the details and start planning.`}
                  </motion.p>

                  <motion.div
                    initial={reduce ? false : { opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.9, delay: 0.7, ease: EASE }}
                    className="flex items-center gap-4 sm:gap-6"
                  >
                    {thumbs.length > 0 && (
                      <div className="hidden -space-x-3 sm:flex" aria-hidden="true">
                        {thumbs.map((src, i) => (
                          <img key={i} src={src} alt="" className="h-12 w-12 rounded-full border-2 border-white object-cover" />
                        ))}
                      </div>
                    )}
                    <div className="leading-none text-white">
                      <span className="block font-display text-4xl sm:text-5xl">
                        {properties.length > 0 ? properties.length : categoryDestinations.length}
                      </span>
                      <span className="mt-1 block text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-white/65">
                        {properties.length > 0 ? 'Listed Properties' : 'Destinations'}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={scrollToList}
                      aria-label="Scroll to properties"
                      className="grid h-12 w-12 sm:h-14 sm:w-14 place-items-center rounded-full bg-gold text-midnight transition hover:scale-105 focus:outline-none focus-visible:ring-4 focus-visible:ring-white/60"
                    >
                      <motion.span
                        animate={reduce ? undefined : { y: [0, 5, 0] }}
                        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                      >
                        <ArrowDown className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
                      </motion.span>
                    </button>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ================= 2. location-wise property list ================= */}
        <section ref={listRef} className="mx-auto max-w-7xl scroll-mt-20 px-4 pb-20 pt-12 sm:px-8 sm:pb-24 sm:pt-20 lg:px-12">
          <div className="mb-8 flex flex-col gap-5 sm:mb-10 sm:gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <motion.div
                initial={reduce ? false : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, ease: EASE }}
                className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-gold"
              >
                <MapPin className="h-3.5 w-3.5" />
                <span>Location-Wise Property Directory</span>
              </motion.div>
              <motion.h2
                initial={reduce ? false : { opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, ease: EASE }}
                className="font-display text-4xl leading-none text-midnight sm:text-6xl"
              >
                Explore Properties by <em className="italic text-gold">Location</em>
              </motion.h2>
              <p className="mt-2 text-xs sm:text-sm text-midnight/70">
                {`Explore verified ${group.label} properties across ${locationGroups.length} destinations, organized location-by-location.`}
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Search Bar */}
              <label className="group relative block w-full sm:w-72">
                <span className="sr-only">Search properties or location</span>
                <Search
                  className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-midnight/40 transition group-focus-within:text-gold"
                  aria-hidden="true"
                />
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search property or location..."
                  className="h-11 w-full rounded-full border border-midnight/20 bg-white/90 pl-10 pr-9 text-xs sm:text-sm text-midnight placeholder:text-midnight/45 shadow-sm focus:border-midnight focus:bg-white focus:outline-none"
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery('')}
                    aria-label="Clear search"
                    className="absolute right-2 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-full text-midnight/60 transition hover:bg-midnight/10"
                  >
                    <X className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                )}
              </label>
            </div>
          </div>

          {/* Category Group Links */}
          <div
            className="-mx-5 mb-5 flex gap-1 overflow-x-auto px-5 [scrollbar-width:none] sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden"
            role="navigation"
            aria-label="Destination categories"
          >
            <Link
              to="/destinations"
              className="shrink-0 rounded-full px-4 py-2 text-xs font-medium text-midnight/70 transition hover:bg-midnight/5 hover:text-midnight"
            >
              All Destinations
            </Link>
            {destinationMenuGroups.map((g) => {
              const on = g.slug === category
              return (
                <Link
                  key={g.slug}
                  to={`/destinations/category/${g.slug}`}
                  aria-current={on ? 'page' : undefined}
                  className={`relative shrink-0 rounded-full px-4 py-2 text-xs font-medium transition-colors ${
                    on ? 'text-white' : 'text-midnight/70 hover:bg-midnight/5 hover:text-midnight'
                  }`}
                >
                  {on && (
                    <motion.span
                      layoutId="category-pill"
                      className="absolute inset-0 rounded-full bg-midnight"
                      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                    />
                  )}
                  <span className="relative z-10">{g.label}</span>
                </Link>
              )
            })}
          </div>

          {/* Location Filters Chips */}
          {locationFilters.length > 1 && (
            <div className="-mx-5 mb-8 flex gap-2 overflow-x-auto px-5 pb-1 [scrollbar-width:none] sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden">
              {locationFilters.map(({ label, value, count }) => {
                const isSelected = selectedLocation.toLowerCase() === value.toLowerCase()
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setSelectedLocation(value)}
                    className={`inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition-all shadow-sm ${
                      isSelected
                        ? 'bg-midnight text-white ring-2 ring-gold/40'
                        : 'bg-white text-midnight/75 border border-midnight/10 hover:border-midnight/30 hover:text-midnight'
                    }`}
                  >
                    <span>{label}</span>
                    <span
                      className={`text-[10px] font-bold rounded-full px-2 py-0.5 ${
                        isSelected ? 'bg-gold text-midnight' : 'bg-midnight/10 text-midnight/70'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                )
              })}
            </div>
          )}

          {/* Location-wise Property Groups */}
          {loadingProperties ? (
            <div className="space-y-12 animate-pulse">
              {[1, 2, 3].map((n) => (
                <div key={n} className="rounded-3xl border border-midnight/10 bg-white/40 p-6 sm:p-8">
                  <div className="h-8 w-48 rounded-lg bg-[#eee7d9] mb-6" />
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {[1, 2, 3, 4].map((k) => (
                      <div key={k} className="h-72 rounded-2xl bg-[#eee7d9]" />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : filteredLocationGroups.length > 0 ? (
            <div className="space-y-12 sm:space-y-16">
              {filteredLocationGroups.map((locGroup, groupIdx) => {
                const destSlug = locGroup.destinationObj?.slug || locGroup.name.toLowerCase().replace(/\s+/g, '-')
                return (
                  <motion.section
                    key={locGroup.name}
                    initial={reduce ? false : { opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.1 }}
                    transition={{ duration: 0.6, delay: groupIdx * 0.05, ease: EASE }}
                    className="rounded-3xl border border-midnight/10 bg-white/60 p-5 sm:p-8 shadow-sm backdrop-blur-sm"
                  >
                    {/* Location Header */}
                    <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-midnight/10 pb-4">
                      <div className="flex items-center gap-3">
                        <span className="grid h-10 w-10 place-items-center rounded-2xl bg-midnight text-gold shadow-sm">
                          <MapPin className="h-5 w-5" />
                        </span>
                        <div>
                          <div className="flex items-center gap-2.5">
                            <h3 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-midnight">
                              {locGroup.name}
                            </h3>
                            <span className="rounded-full bg-gold/20 border border-gold/40 px-2.5 py-0.5 text-[11px] font-bold text-midnight">
                              {locGroup.properties.length} {locGroup.properties.length === 1 ? 'Property' : 'Properties'}
                            </span>
                          </div>
                          {locGroup.destinationObj?.region && (
                            <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-midnight/55">
                              {locGroup.destinationObj.region}
                            </p>
                          )}
                        </div>
                      </div>

                      <Link
                        to={`/destinations/${destSlug}`}
                        className="inline-flex items-center gap-1.5 rounded-full border border-midnight/15 bg-white px-4 py-2 text-xs font-semibold text-midnight transition-colors hover:border-midnight hover:bg-midnight hover:text-white"
                      >
                        Explore {locGroup.name} Destination
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>

                    {/* Properties Grid */}
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                      {locGroup.properties.map((resort, i) => (
                        <motion.div
                          key={resort.slug || resort._id || resort.id}
                          initial={reduce ? false : { opacity: 0, y: 16 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.45, delay: Math.min(i, 8) * 0.04, ease: EASE }}
                        >
                          <ResortCard resort={resort} />
                        </motion.div>
                      ))}
                    </div>
                  </motion.section>
                )
              })}
            </div>
          ) : (
            <div className="grid place-items-center rounded-[2rem] border border-dashed border-midnight/20 bg-white/60 px-6 py-20 text-center">
              <p className="font-display text-2xl text-midnight">No properties match your filter</p>
              <p className="mt-1.5 text-xs text-midnight/60">Try choosing a different location or clearing your search.</p>
              <button
                type="button"
                onClick={() => {
                  setQuery('')
                  setSelectedLocation('All')
                }}
                className="mt-4 rounded-full bg-midnight px-5 py-2.5 text-xs font-medium text-white transition hover:bg-midnight/90"
              >
                Reset filters
              </button>
            </div>
          )}

          {/* ================= Other Network Destinations ================= */}
          {otherDestinations.length > 0 && selectedLocation === 'All' && !query && (
            <div className="mt-20 border-t border-midnight/10 pt-16">
              <div className="mb-8 flex flex-col gap-2">
                <span className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">
                  Explore The Network
                </span>
                <h3 className="font-display text-3xl text-midnight sm:text-4xl">
                  Other Destinations in <em className="italic text-gold">{group.label}</em>
                </h3>
                <p className="text-xs sm:text-sm text-midnight/65 max-w-2xl">
                  {`Explore ${otherDestinations.length} additional curated destination locations across India.`}
                </p>
              </div>

              <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5">
                <AnimatePresence mode="popLayout">
                  {otherDestinations.map((destination, i) => (
                    <DestRow
                      key={destination.slug}
                      destination={destination}
                      index={i}
                      stayCount={0}
                    />
                  ))}
                </AnimatePresence>
              </ul>
            </div>
          )}
        </section>

        {/* ================= 3. closing call to action ================= */}
        <section className="px-3 pb-12 sm:px-5 sm:pb-24">
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 1, ease: EASE }}
            className="relative isolate mx-auto max-w-[96rem] overflow-hidden rounded-[2rem] bg-midnight px-6 py-10 text-white sm:rounded-[2.75rem] sm:px-14 sm:py-20"
          >
            <div
              aria-hidden="true"
              className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_90%_0%,rgba(201,162,75,0.35),transparent_55%)]"
            />
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-10 -right-4 -z-10 select-none font-display text-[clamp(8rem,24vw,22rem)] leading-none text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.1)]"
            >
              Plan
            </span>

            <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl">
                <p className="mb-4 sm:mb-5 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.35em] text-gold">
                  <span className="h-px w-8 sm:w-10 bg-gold" />
                  Need a hand?
                </p>
                <h2 className="font-display text-3xl leading-[1.05] sm:text-5xl lg:text-6xl">
                  Not sure which one is <em className="italic text-gold">right</em> for you?
                </h2>
                <p className="mt-4 max-w-lg text-sm sm:text-base leading-relaxed text-white/75">
                  Tell us who is travelling and when. We will suggest the best fit in {group.label.toLowerCase()}.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={openBooking}
                  className="group inline-flex items-center gap-3 rounded-full bg-gold py-2 pl-7 pr-2 text-sm font-semibold text-midnight transition-transform duration-300 hover:scale-[1.03] focus:outline-none focus-visible:ring-4 focus-visible:ring-white/60"
                >
                  Plan my journey
                  <span className="grid h-11 w-11 place-items-center rounded-full bg-midnight text-gold transition-transform duration-500 group-hover:rotate-45">
                    <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                  </span>
                </button>
                <Link
                  to="/contact"
                  className="inline-flex h-[3.25rem] items-center rounded-full border border-white/35 px-7 text-sm font-semibold text-white transition hover:bg-white hover:text-midnight focus:outline-none focus-visible:ring-4 focus-visible:ring-white/60"
                >
                  Talk to us
                </Link>
              </div>
            </div>
          </motion.div>
        </section>
      </div>
    </PageTransition>
  )
}