import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { ArrowDown, ArrowLeft, ArrowUpRight, Search, X } from 'lucide-react'
import PageTransition from '../components/layout/PageTransition'
import { destinationMenuGroups, getDestinationBySlug } from '../data/destinations'

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
function DestRow({ destination, index }) {
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

  useEffect(() => setQuery(''), [category])

  const q = query.trim().toLowerCase()
  const visible = useMemo(
    () =>
      q
        ? categoryDestinations.filter((d) => `${nameOf(d)} ${placeOf(d)} ${blurbOf(d)}`.toLowerCase().includes(q))
        : categoryDestinations,
    [categoryDestinations, q],
  )

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
                    {`Every ${group.label.toLowerCase()} stay in one place. Pick a destination to see the details and start planning.`}
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
                      <span className="block font-display text-4xl sm:text-5xl">{String(categoryDestinations.length).padStart(2, '0')}</span>
                      <span className="mt-1 block text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-white/65">
                        {categoryDestinations.length === 1 ? 'Destination' : 'Destinations'}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={scrollToList}
                      aria-label="Scroll to destinations"
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

        {/* ================= 2. simple list ================= */}
        <section ref={listRef} className="mx-auto max-w-7xl scroll-mt-20 px-4 pb-20 pt-12 sm:px-8 sm:pb-24 sm:pt-20 lg:px-12">
          <div className="mb-8 flex flex-col gap-5 sm:mb-10 sm:gap-6 lg:flex-row lg:items-end lg:justify-between">
            <motion.h2
              initial={reduce ? false : { opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, ease: EASE }}
              className="font-display text-4xl leading-none text-midnight sm:text-6xl"
            >
              Choose a <em className="italic text-gold">destination</em>
            </motion.h2>

            <label className="group relative block w-full lg:w-80">
              <span className="sr-only">Search destinations</span>
              <Search
                className="pointer-events-none absolute left-0 top-1/2 h-4 w-4 -translate-y-1/2 text-midnight/50 transition group-focus-within:text-gold"
                aria-hidden="true"
              />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={`Search in ${group.label}`}
                className="h-12 w-full border-b border-midnight/25 bg-transparent pl-8 pr-9 text-sm text-midnight placeholder:text-midnight/45 focus:outline-none"
              />
              <span className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-gold transition-transform duration-500 group-focus-within:scale-x-100" />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  aria-label="Clear search"
                  className="absolute right-0 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-full text-midnight/60 transition hover:bg-midnight/10"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              )}
            </label>
          </div>

          <div
            className="-mx-5 mb-6 flex gap-1 overflow-x-auto px-5 [scrollbar-width:none] sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden"
            role="navigation"
            aria-label="Destination categories"
          >
            <Link
              to="/destinations"
              className="shrink-0 rounded-full px-5 py-2.5 text-sm font-medium text-midnight/70 transition hover:bg-midnight/5 hover:text-midnight"
            >
              All
            </Link>
            {destinationMenuGroups.map((g) => {
              const on = g.slug === category
              return (
                <Link
                  key={g.slug}
                  to={`/destinations/category/${g.slug}`}
                  aria-current={on ? 'page' : undefined}
                  className={`relative shrink-0 rounded-full px-5 py-2.5 text-sm font-medium transition-colors ${on ? 'text-white' : 'text-midnight/70 hover:bg-midnight/5 hover:text-midnight'
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

          <p className="mb-4 text-xs uppercase tracking-[0.2em] text-midnight/55" aria-live="polite">
            {q ? `${visible.length} of ${categoryDestinations.length} destinations` : `${categoryDestinations.length} destinations`}
          </p>

          {visible.length > 0 ? (
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5">
              <AnimatePresence mode="popLayout">
                {visible.map((destination, i) => (
                  <DestRow key={destination.slug} destination={destination} index={i} />
                ))}
              </AnimatePresence>
            </ul>
          ) : (
            <div className="grid place-items-center rounded-[2rem] border border-dashed border-midnight/20 bg-white/60 px-6 py-24 text-center">
              <p className="font-display text-3xl text-midnight">No match for “{query}”</p>
              <p className="mt-2 text-midnight/60">Try a different name or clear the search.</p>
              <button
                type="button"
                onClick={() => setQuery('')}
                className="mt-6 rounded-full bg-midnight px-6 py-3 text-sm font-medium text-white transition hover:bg-midnight/90"
              >
                Clear search
              </button>
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
                  Plan my stay
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