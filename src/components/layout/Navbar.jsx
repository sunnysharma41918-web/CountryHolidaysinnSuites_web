import { useState, useEffect } from 'react'
import { NavLink, Link, useLocation } from 'react-router-dom'
import { Menu, X, ArrowUpRight, ChevronDown } from 'lucide-react'
import TripMakerLogo from '../ui/TripMakerLogo'
import { navigation } from '../../data/navigation'
import DestinationMenuLinks from './DestinationMenuLinks'

export default function Navbar({ onBookNow }) {
  const { pathname } = useLocation()
  const isDestinationRoute = pathname.startsWith('/destinations')
  const isResortRoute = pathname.startsWith('/resorts')
  const isDarkSolidNavbar = isDestinationRoute || isResortRoute

  const [mobileOpen, setMobileOpen] = useState(false)
  const [destinationsOpen, setDestinationsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [destinationsSectionVisible, setDestinationsSectionVisible] = useState(false)
  const isLightNavbar = !isDarkSolidNavbar && destinationsSectionVisible

  // Scroll detection to adapt background on scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
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

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileOpen(false)
    setDestinationsOpen(false)
  }, [pathname])

  const handleBookNowClick = () => {
    setMobileOpen(false)
    if (onBookNow) {
      onBookNow()
    } else {
      window.dispatchEvent(
        new CustomEvent('open-booking-modal', {
          detail: {
            destination: 'Alpine Summit Expedition',
            persons: '2 Persons',
            days: '5 Nights 6 Days',
          },
        })
      )
    }
  }


  // Convert ALL CAPS labels into clean Title Case like the reference design
  const formatLabel = (label) => {
    return label
      .toLowerCase()
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 font-sans transition-all duration-300 ${
        isDarkSolidNavbar
          ? `border-b border-white/10 bg-black/95 shadow-2xl backdrop-blur-xl ${scrolled ? 'py-3.5' : 'py-5 sm:py-6'}`
          : isLightNavbar
            ? `border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur-xl ${scrolled ? 'py-3.5' : 'py-5 sm:py-6'}`
            : scrolled
              ? 'border-b border-white/10 bg-slate-950/85 py-3.5 shadow-2xl backdrop-blur-xl'
              : 'bg-transparent py-5 sm:py-6'
      }`}
    >
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 flex items-center justify-between gap-4">

        {/* Left: Brand Logo */}
        <div className="flex-shrink-0 transition-transform duration-300 hover:scale-105">
          <TripMakerLogo inverted={!isLightNavbar} />
        </div>

        {/* Center: Clean Horizontal Text Links (No capsules or boxes) */}
        <nav
          aria-label="Primary Navigation"
          className="hidden lg:flex items-center gap-7 xl:gap-9"
        >
          {navigation
            .filter((item) => item.label !== 'CONTACT')
            .map((item) => (
            item.label === 'DESTINATIONS' ? (
              <div key={item.label} className="relative">
                <button
                  type="button"
                  aria-expanded={destinationsOpen}
                  aria-haspopup="true"
                  onClick={() => setDestinationsOpen((open) => !open)}
                  className={`flex items-center gap-1.5 text-sm transition-colors duration-200 ${isLightNavbar
                      ? 'font-semibold text-[#e84a28]'
                      : 'font-normal text-white/75 hover:text-white'
                    }`}
                >
                  {formatLabel(item.label)}
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${destinationsOpen ? 'rotate-180' : ''}`}
                  />
                </button>
                {destinationsOpen && (
                  <div className="absolute left-1/2 top-full z-50 mt-5 w-[min(760px,calc(100vw-2rem))] -translate-x-1/2 rounded-2xl border border-white/10 bg-slate-950/95 p-5 shadow-2xl backdrop-blur-2xl sm:p-6">
                    <DestinationMenuLinks mode="mega" onNavigate={() => setDestinationsOpen(false)} />
                    <NavLink
                      to={item.path}
                      onClick={() => setDestinationsOpen(false)}
                      className="mt-5 inline-flex rounded-full border border-white/20 px-4 py-2 text-xs font-semibold text-white/80 transition-colors hover:border-[#ff5938] hover:text-white"
                    >
                      View all destinations
                    </NavLink>
                  </div>
                )}
              </div>
            ) : (
              <NavLink
                key={item.label}
                to={item.path}
                end={item.path === '/'}
                className={({ isActive }) =>
                  `text-sm transition-colors duration-200 tracking-normal ${isActive
                    ? isLightNavbar
                      ? 'font-semibold text-slate-950'
                      : 'text-white font-semibold'
                    : isLightNavbar
                      ? 'font-normal text-slate-700 hover:text-slate-950'
                      : 'text-white/75 hover:text-white font-normal'
                  }`
                }
              >
                {formatLabel(item.label)}
              </NavLink>
            )
          ))}
        </nav>

        {/* Right: Single 'Contact Us' Pill Button */}
        <div className="hidden sm:flex items-center">
          <Link
            to="/contact"
            className={`rounded-full px-6 py-2.5 text-sm font-semibold tracking-wide transition-all duration-200 active:scale-95 flex items-center gap-1.5 shadow-md ${
              isLightNavbar
                ? 'bg-[#ff5938] text-white hover:bg-[#e84a28] shadow-[#ff5938]/25'
                : 'bg-white text-slate-900 hover:bg-white/90 shadow-black/10'
            }`}
          >
            <span>Contact Us</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Mobile Controls (< lg) */}
        <div className="flex items-center gap-2.5 lg:hidden">
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className={`flex h-10 w-10 items-center justify-center rounded-full border backdrop-blur-md transition-transform focus:outline-none active:scale-90 ${isLightNavbar
                ? 'border-slate-300 bg-white text-slate-800'
                : 'border-white/20 bg-white/10 text-white'
              }`}
            aria-label="Toggle navigation menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer Menu */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-500 ease-in-out ${mobileOpen ? 'max-h-[85vh] opacity-100 mt-3' : 'max-h-0 opacity-0 mt-0 pointer-events-none'
          }`}
      >
        <div className="mx-3 flex max-h-[85vh] flex-col gap-2 overflow-y-auto rounded-3xl border border-white/15 bg-slate-950/95 p-4 shadow-2xl backdrop-blur-2xl sm:mx-6 sm:p-5">
          {navigation
            .filter((item) => item.label !== 'CONTACT')
            .map((item) => (
            item.label === 'DESTINATIONS' ? (
              <div key={item.label} className="rounded-2xl border border-white/10 p-3">
                <NavLink
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `block rounded-xl px-2 py-2 text-sm font-bold transition ${isActive ? 'text-[#ff5938]' : 'text-white/80 hover:text-white'
                    }`
                  }
                >
                  {formatLabel(item.label)}
                </NavLink>
                <div className="mt-2 max-h-56 overflow-y-auto">
                  <DestinationMenuLinks mode="mobile-dark" onNavigate={() => setMobileOpen(false)} />
                </div>
              </div>
            ) : (
              <NavLink
                key={item.label}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `block px-4 py-2.5 rounded-2xl text-sm transition-all duration-200 ${isActive
                    ? 'bg-white text-slate-900 font-bold shadow-sm'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`
                }
              >
                {formatLabel(item.label)}
              </NavLink>
            )
          ))}

          {/* Mobile Action Button */}
          <div className="mt-3 pt-3 border-t border-white/10 flex">
            <Link
              to="/contact"
              onClick={() => setMobileOpen(false)}
              className="w-full py-3 rounded-full bg-white text-slate-900 font-bold text-xs text-center shadow-lg transition active:scale-95 flex items-center justify-center gap-1.5"
            >
              <span>Contact Us</span>
              <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}