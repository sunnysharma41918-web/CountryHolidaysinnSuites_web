import { useState, useMemo } from 'react'
import { Search, X, Compass, Globe, Sparkles } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import PageTransition from '../components/layout/PageTransition'
import DestinationCard from '../components/ui/DestinationCard'
import { destinations, viaOtaDestinationNames, viaOtaExchangeDestinationNames } from '../data/destinations'

export default function DestinationsPage() {
  const [activeTab, setActiveTab] = useState('ALL') // 'ALL' | 'VIA_OTA' | 'VIA_OTA_EXCHANGE'
  const [searchQuery, setSearchQuery] = useState('')

  // Map destinations to their source lists
  const viaOtaDestinations = useMemo(() => {
    return destinations.filter((dest) => viaOtaDestinationNames.includes(dest.name))
  }, [])

  const viaOtaExchangeDestinations = useMemo(() => {
    return destinations.filter((dest) => viaOtaExchangeDestinationNames.includes(dest.name))
  }, [])

  // Filtered lists based on search query
  const filteredViaOta = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return viaOtaDestinations
    return viaOtaDestinations.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        (d.region && d.region.toLowerCase().includes(q)) ||
        (d.description && d.description.toLowerCase().includes(q))
    )
  }, [viaOtaDestinations, searchQuery])

  const filteredViaOtaExchange = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return viaOtaExchangeDestinations
    return viaOtaExchangeDestinations.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        (d.region && d.region.toLowerCase().includes(q)) ||
        (d.description && d.description.toLowerCase().includes(q))
    )
  }, [viaOtaExchangeDestinations, searchQuery])

  const totalFilteredCount =
    activeTab === 'VIA_OTA'
      ? filteredViaOta.length
      : activeTab === 'VIA_OTA_EXCHANGE'
      ? filteredViaOtaExchange.length
      : filteredViaOta.length + filteredViaOtaExchange.length

  return (
    <PageTransition>
      <div className="page-destinations bg-[#f9f4ee] min-h-screen">
        {/* ================= 1. LUXURY EDITORIAL HEADER ================= */}
        <section className="relative overflow-hidden bg-midnight pt-32 pb-24 sm:pt-36 sm:pb-28 text-white">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_20%,rgba(232,74,40,0.15),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_80%,rgba(20,50,40,0.6),transparent_60%)]" />

          <div className="relative mx-auto max-w-[1400px] px-4 sm:px-8 lg:px-12">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-[#f2d7a2] ring-1 ring-white/15 backdrop-blur-md">
                  <Compass className="h-3.5 w-3.5 text-gold" />
                  Our Global Collection
                </p>
                <h1 className="mt-4 font-display text-4xl leading-[1.04] sm:text-6xl lg:text-7xl">
                  A place for every <em className="italic text-gold">kind of escape.</em>
                </h1>
                <p className="mt-5 max-w-2xl text-sm leading-relaxed text-white/70 sm:text-base">
                  Explore handpicked destinations across our direct signature retreats (<strong className="text-white font-medium">VIA OTA</strong>)
                  and our international leisure exchange network (<strong className="text-white font-medium">VIA OTA EXCHANGE</strong>).
                </p>
              </div>

              {/* Stats pill counter */}
              <div className="flex shrink-0 items-center gap-6 rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-5 backdrop-blur-md">
                <div>
                  <span className="block font-display text-3xl sm:text-4xl text-white">
                    {viaOtaDestinations.length}
                  </span>
                  <span className="mt-1 block text-[11px] font-medium uppercase tracking-[0.18em] text-[#f2d7a2]">
                    VIA OTA
                  </span>
                </div>
                <div className="h-10 w-px bg-white/15" />
                <div>
                  <span className="block font-display text-3xl sm:text-4xl text-white">
                    {viaOtaExchangeDestinations.length}
                  </span>
                  <span className="mt-1 block text-[11px] font-medium uppercase tracking-[0.18em] text-[#f2d7a2]">
                    Exchange
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= 2. FILTER & SEARCH CONTROL BAR ================= */}
        <section className="relative z-20 -mt-10 mx-auto max-w-[1400px] px-4 sm:px-8 lg:px-12">
          <div className="rounded-3xl border border-[#e3dccd] bg-white p-4 shadow-[0_20px_50px_-20px_rgba(10,20,40,0.25)] sm:p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              {/* Category Selection Tabs */}
              <div className="flex flex-wrap items-center gap-2" role="tablist" aria-label="Destination Categories">
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeTab === 'ALL'}
                  onClick={() => setActiveTab('ALL')}
                  className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-xs sm:text-sm font-semibold transition-all duration-300 focus:outline-none ${
                    activeTab === 'ALL'
                      ? 'bg-midnight text-white shadow-md'
                      : 'bg-[#faf8f3] text-midnight/70 hover:bg-[#efe9de] hover:text-midnight'
                  }`}
                >
                  <span>All Destinations</span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs ${
                      activeTab === 'ALL' ? 'bg-white/20 text-white' : 'bg-black/10 text-midnight/60'
                    }`}
                  >
                    {viaOtaDestinations.length + viaOtaExchangeDestinations.length}
                  </span>
                </button>

                <button
                  type="button"
                  role="tab"
                  aria-selected={activeTab === 'VIA_OTA'}
                  onClick={() => setActiveTab('VIA_OTA')}
                  className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-xs sm:text-sm font-semibold transition-all duration-300 focus:outline-none ${
                    activeTab === 'VIA_OTA'
                      ? 'bg-midnight text-white shadow-md'
                      : 'bg-[#faf8f3] text-midnight/70 hover:bg-[#efe9de] hover:text-midnight'
                  }`}
                >
                  <Sparkles className="h-3.5 w-3.5 text-gold" />
                  <span>VIA OTA</span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs ${
                      activeTab === 'VIA_OTA' ? 'bg-gold text-midnight font-bold' : 'bg-black/10 text-midnight/60'
                    }`}
                  >
                    {viaOtaDestinations.length}
                  </span>
                </button>

                <button
                  type="button"
                  role="tab"
                  aria-selected={activeTab === 'VIA_OTA_EXCHANGE'}
                  onClick={() => setActiveTab('VIA_OTA_EXCHANGE')}
                  className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-xs sm:text-sm font-semibold transition-all duration-300 focus:outline-none ${
                    activeTab === 'VIA_OTA_EXCHANGE'
                      ? 'bg-midnight text-white shadow-md'
                      : 'bg-[#faf8f3] text-midnight/70 hover:bg-[#efe9de] hover:text-midnight'
                  }`}
                >
                  <Globe className="h-3.5 w-3.5 text-gold" />
                  <span>VIA OTA EXCHANGE</span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs ${
                      activeTab === 'VIA_OTA_EXCHANGE'
                        ? 'bg-gold text-midnight font-bold'
                        : 'bg-black/10 text-midnight/60'
                    }`}
                  >
                    {viaOtaExchangeDestinations.length}
                  </span>
                </button>
              </div>

              {/* Real-time search box */}
              <div className="relative w-full lg:w-80">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-midnight/40" />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search destinations..."
                  className="w-full rounded-full border border-[#e3dccd] bg-[#faf8f3] py-2.5 pl-10 pr-9 text-xs sm:text-sm text-midnight placeholder:text-midnight/45 outline-none transition focus:border-midnight focus:bg-white"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    aria-label="Clear search"
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-midnight/50 hover:bg-black/5 hover:text-midnight"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ================= 3. DESTINATIONS CONTENT ================= */}
        <div className="mx-auto max-w-[1400px] px-4 py-12 sm:px-8 sm:py-16 lg:px-12">
          {/* Active Filter & Count Summary */}
          {searchQuery && (
            <div className="mb-8 flex items-center justify-between text-sm text-midnight/70">
              <p>
                Showing {totalFilteredCount} matching destinations for &ldquo;{searchQuery}&rdquo;
              </p>
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="font-medium text-midnight underline hover:no-underline"
              >
                Clear search
              </button>
            </div>
          )}

          {/* ================= SECTION A: VIA OTA ================= */}
          {(activeTab === 'ALL' || activeTab === 'VIA_OTA') && (
            <section className="mb-20" aria-labelledby="via-ota-heading">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between border-b border-[#e5decb] pb-6">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full bg-midnight px-3.5 py-1 text-xs font-bold uppercase tracking-[0.2em] text-[#f2d7a2]">
                    <Sparkles className="h-3.5 w-3.5 text-gold" />
                    Direct Contract
                  </div>
                  <h2 id="via-ota-heading" className="mt-3 font-display text-3xl sm:text-4xl text-midnight">
                    VIA OTA <span className="font-sans font-light text-midnight/60">Signature Escapes</span>
                  </h2>
                  <p className="mt-1 text-xs sm:text-sm text-midnight/65 max-w-xl">
                    Directly contracted properties and signature holiday retreats across premier heritage, hill station, and coastal getaways.
                  </p>
                </div>
                <p className="text-xs uppercase tracking-[0.2em] font-semibold text-midnight/50">
                  {filteredViaOta.length} {filteredViaOta.length === 1 ? 'Destination' : 'Destinations'}
                </p>
              </div>

              {filteredViaOta.length > 0 ? (
                <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredViaOta.map((destination) => (
                    <DestinationCard
                      key={`via-ota-${destination.slug}`}
                      destination={destination}
                      badge="VIA OTA"
                    />
                  ))}
                </div>
              ) : (
                <div className="mt-8 rounded-3xl border border-dashed border-[#d8cfbf] bg-white/70 p-10 text-center">
                  <p className="font-display text-xl text-midnight">No VIA OTA destinations match your search.</p>
                  <p className="mt-1 text-xs text-midnight/60">Try searching with a different term.</p>
                </div>
              )}
            </section>
          )}

          {/* ================= SECTION B: VIA OTA EXCHANGE ================= */}
          {(activeTab === 'ALL' || activeTab === 'VIA_OTA_EXCHANGE') && (
            <section aria-labelledby="via-ota-exchange-heading">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between border-b border-[#e5decb] pb-6">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full bg-[#1b3d32] px-3.5 py-1 text-xs font-bold uppercase tracking-[0.2em] text-[#f2d7a2]">
                    <Globe className="h-3.5 w-3.5 text-gold" />
                    Partner Network
                  </div>
                  <h2 id="via-ota-exchange-heading" className="mt-3 font-display text-3xl sm:text-4xl text-midnight">
                    VIA OTA EXCHANGE <span className="font-sans font-light text-midnight/60">Global Network</span>
                  </h2>
                  <p className="mt-1 text-xs sm:text-sm text-midnight/65 max-w-xl">
                    Exclusive holiday exchange privileges unlocking premier partner properties across domestic highlights and iconic international destinations.
                  </p>
                </div>
                <p className="text-xs uppercase tracking-[0.2em] font-semibold text-midnight/50">
                  {filteredViaOtaExchange.length} {filteredViaOtaExchange.length === 1 ? 'Destination' : 'Destinations'}
                </p>
              </div>

              {filteredViaOtaExchange.length > 0 ? (
                <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredViaOtaExchange.map((destination) => (
                    <DestinationCard
                      key={`exchange-${destination.slug}`}
                      destination={destination}
                      badge="VIA OTA EXCHANGE"
                    />
                  ))}
                </div>
              ) : (
                <div className="mt-8 rounded-3xl border border-dashed border-[#d8cfbf] bg-white/70 p-10 text-center">
                  <p className="font-display text-xl text-midnight">No VIA OTA EXCHANGE destinations match your search.</p>
                  <p className="mt-1 text-xs text-midnight/60">Try searching with a different term.</p>
                </div>
              )}
            </section>
          )}
        </div>
      </div>
    </PageTransition>
  )
}

