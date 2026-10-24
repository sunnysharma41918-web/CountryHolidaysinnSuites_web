import { useRef } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { ArrowDown, ArrowLeft, ArrowUpRight, MapPin } from 'lucide-react'
import PageTransition from '../components/layout/PageTransition'
import ResortCard from '../components/ui/ResortCard'
import { getDestinationBySlug } from '../data/destinations'
import { resorts } from '../data/resorts'

const EASE = [0.16, 1, 0.3, 1]

/* small reusable pieces ------------------------------------------------ */
function Eyebrow({ children, light }) {
  return (
    <p
      className={`flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] ${light ? 'text-gold' : 'text-gold'
        }`}
    >
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
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.9, delay, ease: EASE }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export default function DestinationPropertiesPage() {
  const { slug } = useParams()
  const reduce = useReducedMotion()
  const heroRef = useRef(null)
  const staysRef = useRef(null)

  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const imgY = useTransform(scrollYProgress, [0, 1], ['0%', '20%'])
  const imgScale = useTransform(scrollYProgress, [0, 1], [1, 1.15])
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '-18%'])
  const textOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  const destination = getDestinationBySlug(slug)
  const destinationResorts = destination
    ? resorts.filter((resort) => resort.destination === destination.resortDestination)
    : []

  const scrollToStays = () =>
    staysRef.current?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' })

  const openBooking = () =>
    window.dispatchEvent(
      new CustomEvent('open-booking-modal', {
        detail: { destination: destination?.name || 'Holiday Enquiry', persons: '2 Persons', days: 'Holiday Consultation' },
      }),
    )

  /* ---------------- not found ---------------- */
  if (!destination) {
    return (
      <PageTransition>
        <section className="grid min-h-[100svh] place-items-center bg-[#f9f4ee] px-5">
          <div className="max-w-xl text-center">
            <p className="font-display text-[9rem] leading-none text-transparent [-webkit-text-stroke:1.5px_rgba(11,18,38,0.2)]">
              404
            </p>
            <h1 className="-mt-6 font-display text-4xl text-midnight sm:text-5xl">Destination not found</h1>
            <p className="mt-4 text-midnight/65">It may have been renamed or moved. Browse every destination instead.</p>
            <Link
              to="/destinations"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-midnight px-7 py-3.5 text-sm font-medium text-white transition hover:bg-midnight/90 focus:outline-none focus-visible:ring-4 focus-visible:ring-gold/70"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Browse destinations
            </Link>
          </div>
        </section>
      </PageTransition>
    )
  }

  const words = String(destination.name).split(' ')
  const count = destinationResorts.length

  return (
    <PageTransition>
      <div className="bg-[#f9f4ee]">
        {/* ================= 1. intro (full screen) ================= */}
        <section ref={heroRef} className="box-border min-h-[100svh] px-3 pb-4 pt-[5.5rem] sm:px-5 sm:pb-5 sm:pt-[6.5rem] lg:h-[100svh]">
          <div className="relative isolate mx-auto h-full min-h-[calc(100svh-6.5rem)] max-w-[96rem] overflow-hidden rounded-[2rem] bg-midnight sm:rounded-[2.75rem]">
            {destination.image && (
              <motion.img
                src={destination.image}
                alt={destination.name}
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
                  All destinations
                </Link>
                <span aria-hidden="true">/</span>
                <span className="truncate text-white">{destination.name}</span>
              </motion.nav>

              <div className="pt-8 sm:pt-12">
                <motion.div
                  initial={reduce ? false : { opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.9, delay: 0.1, ease: EASE }}
                  className="mb-3 sm:mb-5"
                >
                  <Eyebrow>Destination guide</Eyebrow>
                </motion.div>

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
                  <motion.div
                    initial={reduce ? false : { opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.9, delay: 0.55, ease: EASE }}
                    className="max-w-md"
                  >
                    <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-xs sm:text-sm text-white ring-1 ring-white/20 backdrop-blur-md">
                      <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gold" aria-hidden="true" />
                      {destination.region || destination.name}
                    </p>
                    {destination.description && (
                      <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-white/80 sm:mt-4 sm:text-lg">
                        {destination.description}
                      </p>
                    )}
                  </motion.div>

                  <motion.div
                    initial={reduce ? false : { opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.9, delay: 0.7, ease: EASE }}
                    className="flex items-center gap-6"
                  >
                    <div className="leading-none text-white">
                      <span className="block font-display text-5xl">{String(count).padStart(2, '0')}</span>
                      <span className="mt-1 block text-[11px] uppercase tracking-[0.25em] text-white/65">
                        {count === 1 ? 'Stay' : 'Stays'}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={scrollToStays}
                      aria-label="Explore stays"
                      className="group inline-flex items-center gap-3 rounded-full bg-gold py-1.5 pl-6 pr-1.5 text-sm font-semibold text-midnight transition-transform duration-300 hover:scale-[1.03] focus:outline-none focus-visible:ring-4 focus-visible:ring-white/60"
                    >
                      Explore stays
                      <span className="grid h-11 w-11 place-items-center rounded-full bg-midnight text-gold">
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

        {/* ================= 2. get to know the destination ================= */}
        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-8 sm:py-24 lg:px-12">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-7">
              <Reveal>
                <Eyebrow>Get to know the destination</Eyebrow>
              </Reveal>
              <Reveal delay={0.08}>
                <h2 className="mt-4 font-display text-3xl leading-[1.05] text-midnight sm:mt-5 sm:text-5xl lg:text-6xl">
                  Find your own way to <em className="italic text-gold">{destination.name}.</em>
                </h2>
              </Reveal>
              <Reveal delay={0.16}>
                <p className="mt-5 text-sm leading-relaxed text-midnight/70 sm:mt-7 sm:text-base sm:leading-8 lg:text-lg">
                  {destination.knowYourDestination || destination.description}
                </p>
              </Reveal>
            </div>

            <Reveal delay={0.12} className="lg:col-span-5">
              <aside className="relative isolate flex h-full flex-col justify-between gap-6 overflow-hidden rounded-[2rem] bg-midnight p-6 text-white sm:gap-8 sm:p-9">
                <div
                  aria-hidden="true"
                  className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_90%_0%,rgba(201,162,75,0.35),transparent_55%)]"
                />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">Your stay</p>
                  <p className="mt-3 font-display text-2xl leading-tight sm:mt-4 sm:text-4xl">
                    {count
                      ? `${count} ${count === 1 ? 'stay' : 'stays'} to explore`
                      : 'A stay worth looking forward to'}
                  </p>
                  <p className="mt-2.5 text-xs sm:text-sm leading-6 sm:leading-7 text-white/70">
                    {count
                      ? `Explore places to stay in ${destination.name} and find the right base for your trip.`
                      : `We’re preparing property details for ${destination.name}. Check back soon for places to stay.`}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={openBooking}
                    className="group inline-flex items-center gap-3 rounded-full bg-gold py-1.5 pl-6 pr-1.5 text-sm font-semibold text-midnight transition-transform duration-300 hover:scale-[1.03] focus:outline-none focus-visible:ring-4 focus-visible:ring-white/60"
                  >
                    Plan my stay
                    <span className="grid h-10 w-10 place-items-center rounded-full bg-midnight text-gold transition-transform duration-500 group-hover:rotate-45">
                      <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                    </span>
                  </button>
                  <Link
                    to="/destinations"
                    className="inline-flex h-[3.1rem] items-center gap-2 rounded-full border border-white/35 px-5 sm:px-6 text-sm font-semibold text-white transition hover:bg-white hover:text-midnight focus:outline-none focus-visible:ring-4 focus-visible:ring-white/60"
                  >
                    Other destinations
                  </Link>
                </div>
              </aside>
            </Reveal>
          </div>
        </section>

        {/* ================= 3. places to stay ================= */}
        <section id="destination-stays" ref={staysRef} className="mx-auto max-w-7xl scroll-mt-20 px-4 pb-16 sm:px-8 sm:pb-24 lg:px-12">
          <div className="flex flex-col justify-between gap-4 border-t border-midnight/15 pt-8 sm:flex-row sm:items-end sm:gap-5 sm:pt-12">
            <div>
              <Reveal>
                <Eyebrow>Places to stay</Eyebrow>
              </Reveal>
              <Reveal delay={0.08}>
                <h2 className="mt-4 font-display text-3xl leading-[1.05] text-midnight sm:mt-5 sm:text-5xl lg:text-6xl">
                  Stay awhile in <em className="italic text-gold">{destination.name}.</em>
                </h2>
              </Reveal>
            </div>
            <Reveal delay={0.12}>
              <p className="max-w-sm text-xs sm:text-sm leading-6 sm:leading-7 text-midnight/65">
                Browse available properties and open a stay for its highlights, amenities, and location details.
              </p>
            </Reveal>
          </div>

          {count ? (
            <div className="mt-8 grid gap-4 sm:mt-10 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
              {destinationResorts.map((resort, i) => (
                <motion.div
                  key={resort.slug}
                  initial={reduce ? false : { opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{ duration: 0.8, delay: (i % 3) * 0.08, ease: EASE }}
                  className="transition-transform duration-500 hover:-translate-y-1"
                >
                  <ResortCard resort={resort} />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="mt-10 grid place-items-center rounded-[2rem] border border-dashed border-midnight/20 bg-white/60 px-6 py-20 text-center">
              <h3 className="font-display text-3xl text-midnight">Property listings are coming soon</h3>
              <p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-midnight/65">
                We are preparing local demo listings for {destination.name}. Check back soon to explore available stays.
              </p>
              <button
                type="button"
                onClick={openBooking}
                className="mt-6 rounded-full bg-midnight px-6 py-3 text-sm font-medium text-white transition hover:bg-midnight/90"
              >
                Ask us about {destination.name}
              </button>
            </div>
          )}
        </section>
      </div>
    </PageTransition>
  )
}