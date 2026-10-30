import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Sparkles, ArrowRight, X, Tag } from 'lucide-react'
import { getStoredOffers, getFestivalGreeting } from '../../data/offers'

export default function OffersTicker() {
  const navigate = useNavigate()
  const [dismissed, setDismissed] = useState(false)
  const [offers, setOffers] = useState(getStoredOffers)
  const [greeting, setGreeting] = useState(getFestivalGreeting)
  const { pathname } = useLocation()
  const isLandingPage = pathname === '/'

  useEffect(() => {
    const handleOffersUpdated = (e) => {
      if (e.detail) setOffers(e.detail)
      else setOffers(getStoredOffers())
    }
    const handleGreetingUpdated = (e) => {
      if (e.detail) setGreeting(e.detail)
      else setGreeting(getFestivalGreeting())
    }
    window.addEventListener('chis-offers-updated', handleOffersUpdated)
    window.addEventListener('chis-festival-greeting-updated', handleGreetingUpdated)
    window.addEventListener('storage', handleOffersUpdated)
    return () => {
      window.removeEventListener('chis-offers-updated', handleOffersUpdated)
      window.removeEventListener('chis-festival-greeting-updated', handleGreetingUpdated)
      window.removeEventListener('storage', handleOffersUpdated)
    }
  }, [])

  if (dismissed) return null

  const activeTickerItems = offers
    .filter((o) => o.active !== false && o.showInTicker !== false)
    .map((o) => ({
      badge: o.badge?.split('·')?.[0]?.trim() || 'OFFER',
      text: o.tickerText || `${o.title}: ${o.discount}`,
      code: o.code,
      destination: o.destinationDetail || o.title,
      isFestive: false,
    }))

  const festiveItem = greeting?.enabled
    ? {
        isFestive: true,
        badge: greeting.badge || '🪔 HAPPY DIWALI',
        text: greeting.message || 'Happy Diwali from Country Holidays Inn & Suites!',
        code: greeting.promoCode || 'DIWALI2026',
        destination: greeting.destination || 'CHIS Diwali Festive Holiday Offer',
      }
    : null

  const baseItems = festiveItem
    ? [festiveItem, ...activeTickerItems]
    : activeTickerItems

  if (baseItems.length === 0) return null

  const handleOfferClick = (item) => {
    if (isLandingPage) {
      const el = document.getElementById('offers-scroller')
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        return
      }
    }
    navigate(
      `/contact?subject=${encodeURIComponent(item.destination || item.text)}${
        item.code ? `&code=${encodeURIComponent(item.code)}` : ''
      }`
    )
  }

  // Duplicate for seamless 60fps infinite marquee
  const loopItems = [...baseItems, ...baseItems, ...baseItems]

  return (
    <aside
      aria-label="Promotional Offers Bar"
      className="relative z-50 w-full overflow-hidden border-b border-[#297f33]/30 bg-gradient-to-r from-[#07241b] via-[#0c3b27] to-[#07241b] py-2 text-white shadow-sm"
    >
      <div className="relative flex w-full items-center">
        {/* Left static label badge */}
        <div className="hidden sm:flex shrink-0 items-center gap-1.5 border-r border-white/15 bg-[#07241b]/90 px-3 sm:px-4 py-0.5 text-[11px] font-bold uppercase tracking-wider text-[#b3d565] z-10 backdrop-blur-md">
          <Sparkles className="h-3 w-3 text-[#fbd75b] animate-pulse" />
          <span>Offers</span>
        </div>

        {/* Marquee track with pause on hover */}
        <div
          className="group relative flex-1 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_4%,black_96%,transparent)]"
        >
          <div className="lp-marquee flex items-center gap-8 text-[12px] sm:text-[12.5px] font-varela hover:[animation-play-state:paused]" style={{ '--dur': '45s' }}>
            {loopItems.map((item, idx) => (
              <button
                key={`${item.code}-${idx}`}
                type="button"
                onClick={() => handleOfferClick(item)}
                className={`inline-flex shrink-0 items-center gap-2.5 text-left transition-colors duration-200 focus:outline-none focus-visible:underline ${
                  item.isFestive ? 'text-amber-100 hover:text-white' : 'text-white/90 hover:text-white'
                }`}
              >
                {item.isFestive ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-amber-400 via-[#fbd75b] to-amber-500 px-2.5 py-0.5 text-[10px] font-black tracking-wider uppercase text-stone-950 shadow-[0_0_12px_rgba(251,215,91,0.45)]">
                    <Sparkles className="h-3 w-3 text-stone-950 animate-pulse" />
                    {item.badge}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#297f33] px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase text-[#b3d565] shadow-xs">
                    <Tag className="h-2.5 w-2.5" />
                    {item.badge}
                  </span>
                )}

                <span className={item.isFestive ? 'font-semibold text-white drop-shadow-sm' : 'font-medium'}>
                  {item.text}
                </span>

                {item.code && (
                  <span
                    className={`inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10.5px] font-semibold ${
                      item.isFestive
                        ? 'bg-amber-400/25 border border-amber-300/40 text-[#fbd75b]'
                        : 'bg-white/10 text-[#fbd75b]'
                    }`}
                  >
                    {item.code}
                  </span>
                )}
                <span className="text-white/30">•</span>
              </button>
            ))}
          </div>
        </div>

        {/* Right CTA + Dismiss button */}
        <div className="flex shrink-0 items-center gap-2 pr-3 pl-2 z-10 bg-gradient-to-l from-[#07241b] via-[#07241b]/95 to-transparent">
          {isLandingPage ? (
            <a
              href="#offers-scroller"
              className="hidden md:inline-flex items-center gap-1 rounded-full border border-[#b3d565]/40 bg-[#b3d565]/15 px-2.5 py-0.5 text-[10.5px] font-bold text-[#b3d565] transition-colors hover:bg-[#b3d565] hover:text-[#0b1f12]"
            >
              View All
              <ArrowRight className="h-3 w-3" />
            </a>
          ) : (
            <Link
              to="/vacation-packages"
              className="hidden md:inline-flex items-center gap-1 rounded-full border border-[#b3d565]/40 bg-[#b3d565]/15 px-2.5 py-0.5 text-[10.5px] font-bold text-[#b3d565] transition-colors hover:bg-[#b3d565] hover:text-[#0b1f12]"
            >
              Packages
              <ArrowRight className="h-3 w-3" />
            </Link>
          )}

          <button
            type="button"
            onClick={() => setDismissed(true)}
            aria-label="Dismiss offers announcement"
            className="grid h-6 w-6 place-items-center rounded-full text-white/60 transition-colors hover:bg-white/15 hover:text-white focus:outline-none"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </aside>
  )
}
