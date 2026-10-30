import { useState, useEffect, useRef } from 'react'
import { NavLink, Link, useLocation } from 'react-router-dom'
import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion'
import { Menu, X, ArrowUpRight, ChevronDown } from 'lucide-react'
import logo from '../../assets/logo-000.png'
import { navigation } from '../../data/navigation'
import DestinationMenuLinks from './DestinationMenuLinks'
import OffersTicker from '../common/OffersTicker'

/* ------------------------------------------------------------------ */
/*  Tokens (shared with the olive hero)                                */
/* ------------------------------------------------------------------ */
const EASE = [0.16, 1, 0.3, 1]
const GREEN = '#6aa22f'

const FONT_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Anton&family=Outfit:wght@300;400;500;600&display=swap');
`
const display = { fontFamily: "'Anton', 'Impact', sans-serif" }
const body = { fontFamily: "'Outfit', sans-serif" }

const formatLabel = (label) =>
  label
    .toLowerCase()
    .split(' ')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')

export default function Navbar() {
  const { pathname } = useLocation()
  const isDestinationRoute = pathname.startsWith('/destinations')
  const isResortRoute = pathname.startsWith('/resorts')
  const isDarkSolidNavbar = isDestinationRoute || isResortRoute

  const [mobileOpen, setMobileOpen] = useState(false)
  const [mobileDestOpen, setMobileDestOpen] = useState(false)
  const [destinationsOpen, setDestinationsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [destinationsSectionVisible, setDestinationsSectionVisible] = useState(false)

  const megaRef = useRef(null)
  const lastY = useRef(0)

  /* light bar while the destinations section is on screen */
  const isLight = !isDarkSolidNavbar && destinationsSectionVisible && !mobileOpen

  /* page scroll progress line */
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 })

  /* scrolled state + hide on scroll down / show on scroll up */
  useEffect(() => {
    let ticking = false
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const y = window.scrollY
          setScrolled(y > 20)
          if (y > 240 && y > lastY.current + 8) setHidden(true)
          else if (y < lastY.current - 8 || y <= 240) setHidden(false)
          lastY.current = y
          ticking = false
        })
        ticking = true
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const section = document.getElementById('destinations')
    if (!section) return undefined
    const observer = new IntersectionObserver(
      ([entry]) => setDestinationsSectionVisible(entry.isIntersecting),
      { threshold: 0.35 },
    )
    observer.observe(section)
    return () => observer.disconnect()
  }, [pathname])

  /* close everything on route change */
  useEffect(() => {
    setMobileOpen(false)
    setMobileDestOpen(false)
    setDestinationsOpen(false)
  }, [pathname])

  /* mega menu: outside click + Escape */
  useEffect(() => {
    if (!destinationsOpen) return undefined
    const onDown = (e) => {
      if (megaRef.current && !megaRef.current.contains(e.target)) setDestinationsOpen(false)
    }
    const onKey = (e) => e.key === 'Escape' && setDestinationsOpen(false)
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [destinationsOpen])

  /* lock page scroll behind the mobile menu */
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  const links = navigation.filter((item) => item.label !== 'CONTACT')

  /* ---------- tone-dependent classes ---------- */
  const barClass = mobileOpen
    ? 'border-b border-transparent bg-transparent'
    : isDarkSolidNavbar
      ? `border-b border-white/10 bg-[#1c2110]/95 shadow-2xl backdrop-blur-xl`
      : isLight
        ? `border-b border-[#1c2110]/10 bg-[#f3f1e4]/95 shadow-sm backdrop-blur-xl`
        : scrolled
          ? `border-b border-white/10 bg-[#1c2110]/80 shadow-2xl backdrop-blur-2xl`
          : 'border-b border-transparent bg-transparent'

  const capsule = isLight
    ? `border-[#1c2110]/10 bg-[#1c2110]/5`
    : 'border-white/20 bg-[#1c2110]/35'
  const idle = isLight
    ? `text-[#1c2110]/70 hover:text-[#1c2110] hover:bg-[#1c2110]/5`
    : `text-[#f3f1e4]/75 hover:text-[#f3f1e4] hover:bg-white/10`
  const active = isLight ? `text-[#f3f1e4]` : `text-[#1c2110]`
  const pill = isLight ? `bg-[#1c2110]` : `bg-[#f3f1e4]`

  const itemBase =
    'relative flex items-center gap-1.5 rounded-full px-4 py-2 text-[13px] font-medium transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6aa22f]'

  const Pill = () => (
    <motion.span
      layoutId="nav-pill"
      className={`absolute inset-0 rounded-full ${pill}`}
      transition={{ type: 'spring', stiffness: 420, damping: 36 }}
    />
  )

  return (
    <>
      <style>{FONT_CSS}</style>

      <motion.header
        animate={{ y: hidden && !mobileOpen && !destinationsOpen ? '-100%' : '0%' }}
        transition={{ duration: 0.45, ease: EASE }}
        style={body}
        className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,box-shadow] duration-300 ${barClass}`}
      >
        <OffersTicker />
        <div className={`mx-auto grid max-w-[1500px] grid-cols-[1fr_auto] items-center gap-4 px-5 sm:px-8 lg:grid-cols-[1fr_auto_1fr] lg:px-12 transition-all duration-300 ${
          scrolled || isDarkSolidNavbar ? 'py-2.5 sm:py-3' : 'py-3.5 sm:py-4'
        }`}>
          {/* Left: logo */}
          <Link
            to="/"
            aria-label="Country Holidays Inn & Suites – home"
            className="justify-self-start rounded-md transition-transform duration-300 hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6aa22f]"
          >
            <img
              src={logo}
              alt="Country Holidays Inn & Suites"
              className={`w-auto object-contain transition-all duration-300 ${scrolled ? 'h-10 sm:h-11' : 'h-11 sm:h-12'
                }`}
            />
          </Link>

          {/* Center: capsule navigation */}
          <nav
            aria-label="Primary Navigation"
            className={`hidden items-center gap-0.5 rounded-full border px-1.5 py-1.5 shadow-[0_8px_32px_rgba(10,14,4,0.3)] backdrop-blur-xl transition-colors duration-300 lg:flex ${capsule}`}
          >
            {links.map((item) =>
              item.label === 'DESTINATIONS' ? (
                <div key={item.label} ref={megaRef} className="relative">
                  <button
                    type="button"
                    aria-expanded={destinationsOpen}
                    aria-haspopup="true"
                    onClick={() => setDestinationsOpen((o) => !o)}
                    className={`${itemBase} ${isDestinationRoute ? active : idle}`}
                  >
                    {isDestinationRoute && <Pill />}
                    <span className="relative z-10">{formatLabel(item.label)}</span>
                    <ChevronDown
                      className={`relative z-10 h-3.5 w-3.5 transition-transform duration-300 ${destinationsOpen ? 'rotate-180' : ''
                        }`}
                    />
                  </button>

                  <AnimatePresence>
                    {destinationsOpen && (
                      /*
                        Framer Motion owns `transform`, so Tailwind's -translate-x-1/2
                        would be overwritten. Center via x: '-50%' instead.
                      */
                      <motion.div
                        initial={{ opacity: 0, x: '-50%', y: -10, scale: 0.98 }}
                        animate={{ opacity: 1, x: '-50%', y: 0, scale: 1 }}
                        exit={{ opacity: 0, x: '-50%', y: -8, scale: 0.98 }}
                        transition={{ duration: 0.28, ease: EASE }}
                        className="absolute left-1/2 top-full z-50 mt-5 w-[min(760px,calc(100vw-2rem))] rounded-3xl border border-white/15 bg-[#1c2110]/95 p-5 shadow-[0_30px_80px_rgba(10,14,4,0.55)] backdrop-blur-2xl sm:p-6"
                      >
                        <DestinationMenuLinks mode="mega" onNavigate={() => setDestinationsOpen(false)} />
                        <NavLink
                          to={item.path}
                          onClick={() => setDestinationsOpen(false)}
                          className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-white/20 px-4 py-2 text-xs font-medium text-white/85 transition-colors hover:border-[#6aa22f] hover:bg-[#6aa22f] hover:text-white"
                        >
                          View all destinations
                          <ArrowUpRight className="h-3.5 w-3.5" />
                        </NavLink>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <NavLink
                  key={item.label}
                  to={item.path}
                  end={item.path === '/'}
                  className={({ isActive }) => `${itemBase} ${isActive ? active : idle}`}
                >
                  {({ isActive }) => (
                    <>
                      {isActive && <Pill />}
                      <span className="relative z-10">{formatLabel(item.label)}</span>
                    </>
                  )}
                </NavLink>
              ),
            )}
          </nav>

          {/* Right: Contact button + mobile toggle */}
          <div className="flex items-center justify-self-end gap-2.5">
            <Link
              to="/contact"
              className={`group hidden items-center gap-3 rounded-full py-1.5 pl-5 pr-1.5 text-[13px] font-semibold shadow-[0_8px_28px_rgba(10,14,4,0.3)] transition-all duration-300 hover:scale-[1.03] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6aa22f] active:scale-95 sm:inline-flex ${isLight ? `bg-[#1c2110] text-[#f3f1e4]` : `bg-[#f3f1e4] text-[#1c2110]`
                }`}
            >
              <span>Contact Us</span>
              <span
                className="grid h-8 w-8 place-items-center rounded-full text-white transition-transform duration-300 group-hover:rotate-45"
                style={{ background: GREEN }}
              >
                <ArrowUpRight className="h-4 w-4" />
              </span>
            </Link>

            <button
              type="button"
              onClick={() => setMobileOpen((o) => !o)}
              aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileOpen}
              className={`grid h-11 w-11 place-items-center rounded-full border backdrop-blur-md transition-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6aa22f] active:scale-90 lg:hidden ${isLight
                ? `border-[#1c2110]/15 bg-[#1c2110]/5 text-[#1c2110]`
                : 'border-white/25 bg-white/10 text-white'
                }`}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* scroll progress line */}
        <motion.span
          aria-hidden="true"
          style={{ scaleX: progress, background: GREEN }}
          className={`absolute inset-x-0 bottom-0 h-[2px] origin-left transition-opacity duration-300 ${scrolled && !mobileOpen ? 'opacity-100' : 'opacity-0'
            }`}
        />
      </motion.header>

      {/* ---------- full-screen mobile menu ---------- */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="mobile-menu"
            style={body}
            className="fixed inset-0 z-40 flex flex-col overflow-y-auto bg-[#1c2110] px-6 pb-8 pt-28 text-[#f3f1e4] lg:hidden"
            initial={{ clipPath: 'circle(0% at calc(100% - 2.5rem) 2.5rem)' }}
            animate={{ clipPath: 'circle(150% at calc(100% - 2.5rem) 2.5rem)' }}
            exit={{ clipPath: 'circle(0% at calc(100% - 2.5rem) 2.5rem)' }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full opacity-25 blur-3xl"
              style={{ background: GREEN }}
            />

            <nav aria-label="Mobile Navigation" className="relative flex flex-col">
              {links.map((item, i) => {
                const isDest = item.label === 'DESTINATIONS'
                return (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, y: 28 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.2 + i * 0.06, ease: EASE }}
                    className="border-b border-white/10"
                  >
                    <div className="flex items-center justify-between">
                      <NavLink
                        to={item.path}
                        end={item.path === '/'}
                        onClick={() => setMobileOpen(false)}
                        className={({ isActive }) =>
                          `block py-3 sm:py-3.5 text-[clamp(1.75rem,8vw,3.2rem)] uppercase leading-tight tracking-[-0.01em] transition-colors ${isActive ? 'text-[#b9e26a]' : 'text-[#f3f1e4] hover:text-[#b9e26a]'
                          }`
                        }
                        style={display}
                      >
                        {item.label}
                      </NavLink>
                      {isDest && (
                        <button
                          type="button"
                          aria-label="Toggle destinations list"
                          aria-expanded={mobileDestOpen}
                          onClick={() => setMobileDestOpen((o) => !o)}
                          className="grid h-10 w-10 place-items-center rounded-full border border-white/20"
                        >
                          <ChevronDown
                            className={`h-4 w-4 transition-transform duration-300 ${mobileDestOpen ? 'rotate-180' : ''
                              }`}
                          />
                        </button>
                      )}
                    </div>

                    {isDest && (
                      <AnimatePresence initial={false}>
                        {mobileDestOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.4, ease: EASE }}
                            className="overflow-hidden"
                          >
                            <div className="pb-4">
                              <DestinationMenuLinks
                                mode="mobile-dark"
                                onNavigate={() => setMobileOpen(false)}
                              />
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    )}
                  </motion.div>
                )
              })}
            </nav>

            {/* Mobile Contact Button linked to Contact Form */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 + links.length * 0.06, ease: EASE }}
              className="mt-10"
            >
              <Link
                to="/contact"
                onClick={() => setMobileOpen(false)}
                className="group relative flex w-full items-center justify-between rounded-full bg-[#f3f1e4] py-2 pl-7 pr-2 text-[15px] font-semibold text-[#1c2110] active:scale-[0.98]"
              >
                <span>Contact Us</span>
                <span
                  className="grid h-11 w-11 place-items-center rounded-full text-white transition-transform duration-300 group-hover:rotate-45"
                  style={{ background: GREEN }}
                >
                  <ArrowUpRight className="h-5 w-5" />
                </span>
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
