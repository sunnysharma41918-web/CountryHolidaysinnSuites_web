import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowRight,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Clock,
  Copy,
  Check,
  Gift,
  Percent,
  Sparkles,
  Tag,
  ShieldCheck,
  Calendar,
} from 'lucide-react'
import { unsplash, Img, GREEN, DEEP, YELLOW } from './landingShared'
import { getStoredOffers, getFestivalGreeting } from '../../../data/offers'

const CATEGORIES = [
  { id: 'all', label: 'All Offers' },
  { id: 'membership', label: 'Memberships' },
  { id: 'stay', label: 'Resorts & Stays' },
  { id: 'seasonal', label: 'Seasonal & Family' },
]

export default function OffersSection() {
  const navigate = useNavigate()
  const [offers, setOffers] = useState(getStoredOffers)
  const [greeting, setGreeting] = useState(getFestivalGreeting)
  const [activeTab, setActiveTab] = useState('all')
  const [copiedCode, setCopiedCode] = useState(null)
  const scrollerRef = useRef(null)
  const trackRef = useRef(null)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

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

  const activeOffers = offers.filter((o) => o.active !== false)
  const filteredOffers = activeTab === 'all'
    ? activeOffers
    : activeOffers.filter((o) => o.category === activeTab)

  // Track scroll position to update the custom scroller progress thumb
  const handleScroll = () => {
    const el = scrollerRef.current
    if (!el) return
    const { scrollLeft, scrollWidth, clientWidth } = el
    const maxScroll = scrollWidth - clientWidth
    if (maxScroll <= 0) {
      setScrollProgress(0)
      setCanScrollLeft(false)
      setCanScrollRight(false)
      return
    }
    const ratio = Math.min(1, Math.max(0, scrollLeft / maxScroll))
    setScrollProgress(ratio)
    setCanScrollLeft(scrollLeft > 10)
    setCanScrollRight(scrollLeft < maxScroll - 10)
  }

  useEffect(() => {
    const el = scrollerRef.current
    if (!el) return
    handleScroll()
    el.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleScroll)
    return () => {
      el.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
    }
  }, [filteredOffers])

  const scrollBy = (offset) => {
    if (!scrollerRef.current) return
    scrollerRef.current.scrollBy({ left: offset, behavior: 'smooth' })
  }

  // Handle clicking on the custom scroller track
  const handleTrackClick = (e) => {
    if (!trackRef.current || !scrollerRef.current) return
    const rect = trackRef.current.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const ratio = Math.min(1, Math.max(0, clickX / rect.width))
    const { scrollWidth, clientWidth } = scrollerRef.current
    const targetScroll = ratio * (scrollWidth - clientWidth)
    scrollerRef.current.scrollTo({ left: targetScroll, behavior: 'smooth' })
  }

  const handleCopyCode = (code, e) => {
    e.stopPropagation()
    navigator.clipboard?.writeText(code)
    setCopiedCode(code)
    setTimeout(() => setCopiedCode(null), 2200)
  }

  const handleClaimOffer = (offer) => {
    navigate(
      `/contact?subject=${encodeURIComponent(offer.title)}&code=${encodeURIComponent(offer.code)}`
    )
  }

  return (
    <section
      id="offers-scroller"
      aria-labelledby="offers-title"
      className="relative w-full py-16 sm:py-20 lg:py-24 text-[#0b1f12]"
    >
      <div className="mx-auto w-full max-w-[1400px] px-5 sm:px-8 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <span className="font-varela inline-flex items-center gap-2 rounded-full border border-[#297f33]/25 bg-[#297f33]/10 px-3.5 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-[#297f33] shadow-xs">
              <span className="h-1.5 w-1.5 rounded-full bg-[#297f33] shadow-[0_0_8px_#297f33] animate-pulse" />
              Exclusive Offers & Deals
            </span>
            <h2
              id="offers-title"
              className="m-0 mt-3.5 font-rader text-[clamp(28px,4vw,46px)] font-bold leading-[1.08] tracking-tight text-[#0b1f12]"
            >
              Curated Privileges for Your{' '}
              <span className="text-[#297f33]">Next Escape.</span>
            </h2>
            <p className="mb-0 mt-3 font-varela text-[14.5px] sm:text-[15.5px] leading-relaxed text-[#0b1f12]/75">
              Limited-edition vacation club savings, complimentary 2-night stay vouchers, and zero-surge packages reserved for CHIS members and travelers.
            </p>
          </div>

          {/* Navigation arrow buttons */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => scrollBy(-380)}
              disabled={!canScrollLeft}
              aria-label="Scroll offers left"
              className={`grid h-11 w-11 place-items-center rounded-full border transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#297f33] ${
                canScrollLeft
                  ? 'border-[#297f33]/30 bg-white text-[#0b1f12] shadow-sm hover:border-[#297f33] hover:bg-[#297f33] hover:text-white hover:scale-105 active:scale-95'
                  : 'border-slate-200 bg-slate-100 text-slate-300 cursor-not-allowed opacity-50'
              }`}
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => scrollBy(380)}
              disabled={!canScrollRight}
              aria-label="Scroll offers right"
              className={`grid h-11 w-11 place-items-center rounded-full border transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#297f33] ${
                canScrollRight
                  ? 'border-[#297f33]/30 bg-white text-[#0b1f12] shadow-sm hover:border-[#297f33] hover:bg-[#297f33] hover:text-white hover:scale-105 active:scale-95'
                  : 'border-slate-200 bg-slate-100 text-slate-300 cursor-not-allowed opacity-50'
              }`}
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Festival Greetings Highlight Banner */}
        {greeting?.enabled && (
          <div className="relative mt-8 overflow-hidden rounded-3xl border border-amber-300/50 bg-gradient-to-r from-[#07241b] via-[#0d3f2b] to-[#07241b] p-6 sm:p-7 text-white shadow-xl shadow-amber-950/10">
            {/* Ambient decorative glowing backlights */}
            <div className="pointer-events-none absolute -right-16 -top-16 h-52 w-52 rounded-full bg-[#fbd75b]/20 blur-3xl" />
            <div className="pointer-events-none absolute -left-16 -bottom-16 h-52 w-52 rounded-full bg-[#297f33]/25 blur-3xl" />

            <div className="relative z-10 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between font-varela">
              <div className="flex items-start gap-4">
                <div className="grid h-12 w-12 sm:h-14 sm:w-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-amber-400 via-[#fbd75b] to-amber-500 text-2xl sm:text-3xl shadow-lg ring-2 ring-amber-300/50">
                  {greeting.badge?.slice(0, 2) || '🪔'}
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-varela inline-flex items-center gap-1 rounded-full bg-[#fbd75b]/20 px-2.5 py-0.5 text-[10.5px] font-bold text-[#fbd75b] border border-[#fbd75b]/30">
                      <Sparkles className="h-3 w-3" />
                      {greeting.badge || '🪔 FESTIVE CELEBRATION'}
                    </span>
                    <h3 className="m-0 font-rader text-xl sm:text-2xl font-bold tracking-tight text-white">
                      {greeting.title}
                    </h3>
                  </div>
                  <p className="mb-0 mt-2 max-w-2xl text-[13.5px] sm:text-[14px] leading-relaxed text-white/90">
                    {greeting.message}
                  </p>
                </div>
              </div>

              {greeting.promoCode && (
                <div className="flex shrink-0 items-center gap-3 self-start sm:self-auto border-t sm:border-t-0 sm:border-l border-white/15 pt-3 sm:pt-0 sm:pl-5">
                  <div className="text-left sm:text-right">
                    <p className="m-0 text-[10px] uppercase font-bold text-[#fbd75b] tracking-wider">Festive Code</p>
                    <span className="font-mono text-xs sm:text-sm font-bold text-white bg-white/10 px-2.5 py-1 rounded-md border border-white/20">
                      {greeting.promoCode}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      navigate(
                        `/contact?subject=${encodeURIComponent(greeting.title)}&code=${encodeURIComponent(greeting.promoCode)}`
                      )
                    }
                    className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-400 to-[#fbd75b] px-4 py-2.5 text-xs font-bold text-[#07241b] shadow-md transition hover:scale-105 active:scale-95"
                  >
                    <span>Claim Deal</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Filter Pills */}
        <div className="mt-8 flex flex-wrap items-center gap-2 font-varela">
          {CATEGORIES.map((cat) => {
            const count = cat.id === 'all'
              ? activeOffers.length
              : activeOffers.filter((o) => o.category === cat.id).length
            const active = activeTab === cat.id
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveTab(cat.id)}
                className={`rounded-full px-4 py-2 text-[12.5px] font-bold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#297f33] ${
                  active
                    ? 'bg-[#297f33] text-white shadow-sm shadow-[#297f33]/25 scale-[1.02]'
                    : 'border border-[#297f33]/15 bg-white/80 text-[#0b1f12]/70 hover:border-[#297f33]/40 hover:bg-white hover:text-[#0b1f12]'
                }`}
              >
                <span>{cat.label}</span>
                <span className={`ml-1.5 text-[11px] ${active ? 'text-[#b3d565]' : 'text-[#0b1f12]/40'}`}>
                  ({count})
                </span>
              </button>
            )
          })}
        </div>

        {/* Horizontal Cards Scroller Container */}
        <div className="relative mt-8">
          <div
            ref={scrollerRef}
            className="flex gap-6 overflow-x-auto pb-6 pt-2 scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
            tabIndex={0}
            role="region"
            aria-label="Offers carousel"
          >
            {filteredOffers.length === 0 ? (
              <div className="w-full py-12 text-center text-sm text-[#0b1f12]/50 font-varela">
                No active offers found in this category.
              </div>
            ) : (
              filteredOffers.map((offer, idx) => (
                <motion.article
                  key={offer.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                className="group relative flex w-[320px] sm:w-[380px] shrink-0 flex-col overflow-hidden rounded-[26px] border border-[#297f33]/15 bg-white shadow-[0_10px_30px_-10px_rgba(7,36,26,0.08)] transition-all duration-300 hover:-translate-y-1.5 hover:border-[#297f33]/40 hover:shadow-[0_20px_45px_-12px_rgba(7,36,26,0.18)]"
              >
                {/* Image Banner with Badge */}
                <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                  <Img
                    src={unsplash(offer.img, 800)}
                    alt={offer.title}
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/10" />

                  {/* Top Badge Pill */}
                  <div className="absolute top-3.5 left-3.5 z-10">
                    <span className="font-varela inline-flex items-center gap-1.5 rounded-full bg-[#07241b]/90 px-3 py-1 text-[10.5px] font-bold uppercase tracking-wider text-[#b3d565] shadow-md backdrop-blur-md border border-white/15">
                      <Tag className="h-3 w-3 text-[#fbd75b]" />
                      {offer.badge}
                    </span>
                  </div>

                  {/* Discount Banner at bottom of image */}
                  <div className="absolute bottom-3 left-3.5 right-3.5 z-10 flex items-center justify-between text-white">
                    <span className="font-varela text-xs font-semibold text-white/90">
                      {offer.subtitle}
                    </span>
                    <span className="font-varela rounded-md bg-[#297f33] px-2 py-0.5 text-[11px] font-bold text-[#b3d565]">
                      {offer.discount}
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="flex flex-1 flex-col justify-between p-5 sm:p-6 font-varela">
                  <div>
                    <h3 className="m-0 font-rader text-[20px] sm:text-[22px] font-bold leading-tight tracking-tight text-[#0b1f12] group-hover:text-[#297f33] transition-colors duration-200">
                      {offer.title}
                    </h3>
                    <p className="mb-0 mt-2 text-[13px] leading-relaxed text-[#0b1f12]/75">
                      {offer.tagline}
                    </p>

                    {/* Offer Perks */}
                    <ul className="m-0 mt-4 list-none space-y-1.5 p-0 text-[12.5px] text-[#0b1f12]/85">
                      {offer.perks.map((perk, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <span className="grid h-4 w-4 shrink-0 place-items-center rounded-full bg-[#297f33]/15 text-[#297f33]">
                            <Check className="h-2.5 w-2.5 stroke-[3]" />
                          </span>
                          <span>{perk}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-5 pt-4 border-t border-[#0b1f12]/8">
                    {/* Price and promo code row */}
                    <div className="flex items-baseline justify-between gap-2">
                      <div>
                        <div className="flex items-baseline gap-2">
                          <span className="font-rader text-2xl font-bold tracking-tight text-[#0b1f12]">
                            {offer.offerPrice}
                          </span>
                          {offer.originalPrice !== offer.offerPrice && (
                            <span className="text-xs text-[#0b1f12]/40 line-through">
                              {offer.originalPrice}
                            </span>
                          )}
                        </div>
                        <p className="m-0 text-[11px] text-[#0b1f12]/55">
                          {offer.emi}
                        </p>
                      </div>

                      {/* Promo Code Pill with Copy */}
                      <button
                        type="button"
                        onClick={(e) => handleCopyCode(offer.code, e)}
                        title="Click to copy coupon code"
                        className="group/btn inline-flex items-center gap-1.5 rounded-full border border-dashed border-[#297f33]/40 bg-[#f3f8e6] px-2.5 py-1 text-[11px] font-bold text-[#297f33] transition-all hover:border-[#297f33] hover:bg-[#297f33] hover:text-white"
                      >
                        {copiedCode === offer.code ? (
                          <>
                            <Check className="h-3 w-3 text-emerald-600 group-hover/btn:text-white" />
                            <span>COPIED!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-3 w-3" />
                            <span>{offer.code}</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Validity & CTA Button */}
                    <div className="mt-4 flex items-center justify-between gap-3">
                      <span className="inline-flex items-center gap-1 text-[11px] text-[#0b1f12]/50">
                        <Clock className="h-3 w-3" />
                        {offer.validTill}
                      </span>

                      <button
                        type="button"
                        onClick={() => handleClaimOffer(offer)}
                        className="inline-flex items-center gap-2 rounded-full bg-[#297f33] py-2 pl-4 pr-1.5 text-[12px] font-bold text-white shadow-xs transition-all duration-300 hover:bg-[#1e5f26] hover:scale-[1.02] active:scale-95"
                      >
                        <span>Claim Deal</span>
                        <span className="grid h-6 w-6 place-items-center rounded-full bg-[#b3d565] text-[#0b1f12]">
                          <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:rotate-45" />
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </motion.article>
            )))}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* Custom Scroller Bar (Matching user uploaded attachment: 1024x13 strip)     */}
        {/* ========================================================================= */}
        <div className="mt-6 flex flex-col items-center justify-center gap-2.5">
          <div
            ref={trackRef}
            onClick={handleTrackClick}
            role="scrollbar"
            aria-label="Offers carousel scroll progress"
            aria-valuenow={Math.round(scrollProgress * 100)}
            aria-valuemin={0}
            aria-valuemax={100}
            className="group relative h-3 w-full max-w-xl cursor-pointer rounded-full bg-[#1e2e28]/15 p-[2px] transition-all hover:h-3.5"
            title="Click or drag to scroll offers"
          >
            {/* The scroll progress thumb */}
            <div
              className="relative h-full rounded-full bg-gradient-to-r from-[#297f33] via-[#359d43] to-[#b3d565] shadow-sm transition-all duration-150"
              style={{
                width: filteredOffers.length > 0 ? `${Math.max(20, (1 / filteredOffers.length) * 100)}%` : '0%',
                transform: `translateX(${scrollProgress * ((1 - Math.max(0.2, filteredOffers.length > 0 ? 1 / filteredOffers.length : 1)) * 100)}%)`,
                left: `${scrollProgress * (100 - Math.max(20, filteredOffers.length > 0 ? (1 / filteredOffers.length) * 100 : 100))}%`,
              }}
            />
          </div>

          <div className="flex items-center justify-between w-full max-w-xl px-1 font-varela text-[11px] text-[#0b1f12]/50">
            <span>Scroll or drag to view all offers</span>
            <span className="font-semibold text-[#297f33]">
              {filteredOffers.length > 0
                ? Math.min(filteredOffers.length, Math.max(1, Math.round(scrollProgress * (filteredOffers.length - 1)) + 1))
                : 0}{' '}
              of {filteredOffers.length} Deals
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}

