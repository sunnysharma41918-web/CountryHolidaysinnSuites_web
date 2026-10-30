import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../services/api'
import {
  Building2,
  CheckCircle2,
  FileEdit,
  Archive,
  RefreshCw,
  PlusCircle,
  Globe,
  Share2,
  Clock,
  ArrowUpRight,
  ArrowRight,
  MapPin,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  Inbox,
  Pencil,
  Tag,
  Sparkles,
} from 'lucide-react'
import {
  getStoredOffers,
  updateOffer,
  addOffer,
  toggleOfferStatus,
} from '../../data/offers'
import OfferEditModal from '../../components/admin/OfferEditModal'
import FestivalGreetingManager from '../../components/admin/FestivalGreetingManager'

/* ------------------------------------------------------------------ */
/*  Fonts: Plus Jakarta Sans (text) + Sora (headings & numbers)        */
/* ------------------------------------------------------------------ */
const FONT_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Sora:wght@500;600;700&display=swap');
`
const BODY_FONT = "'Plus Jakarta Sans', system-ui, sans-serif"
const DISPLAY_FONT = "'Sora', 'Plus Jakarta Sans', system-ui, sans-serif"

export const slab = { fontFamily: DISPLAY_FONT }

const GREEN = '#22d37a'
const GREEN_DEEP = '#0c3b27'

const STATUS_STYLES = {
  published: { chip: 'bg-emerald-50 text-emerald-800', dot: 'bg-[#22d37a]' },
  draft: { chip: 'bg-amber-50 text-amber-800', dot: 'bg-amber-500' },
  default: { chip: 'bg-stone-100 text-stone-600', dot: 'bg-stone-400' },
}

const CARD = 'rounded-2xl border border-stone-200/80 bg-white shadow-[0_1px_2px_rgba(12,59,39,0.04)]'

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null)
  const [recentProperties, setRecentProperties] = useState([])
  const [offers, setOffers] = useState(getStoredOffers)
  const [editingOffer, setEditingOffer] = useState(null)
  const [offerModalOpen, setOfferModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState(null)

  const fetchDashboardData = async () => {
    try {
      setRefreshing(true)
      setError(null)
      const [statsData, propsData] = await Promise.allSettled([
        api.getDashboardStats(),
        api.getAdminProperties({ limit: 5 }),
      ])

      if (statsData.status === 'fulfilled' && statsData.value?.success) {
        setStats(statsData.value.stats)
      }

      if (propsData.status === 'fulfilled' && propsData.value?.success) {
        setRecentProperties(propsData.value.properties || [])
      }
    } catch (err) {
      setError(err.message || 'Failed to load dashboard metrics')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()

    const handleOffersUpdated = (e) => {
      if (e.detail) setOffers(e.detail)
      else setOffers(getStoredOffers())
    }
    window.addEventListener('chis-offers-updated', handleOffersUpdated)
    return () => window.removeEventListener('chis-offers-updated', handleOffersUpdated)
  }, [])

  const handleToggleOffer = (id) => {
    const updated = toggleOfferStatus(id, 'active')
    setOffers(updated)
  }

  const handleSaveOffer = (offerData) => {
    if (editingOffer) {
      const updated = updateOffer(editingOffer.id, offerData)
      setOffers(updated)
    } else {
      const updated = addOffer(offerData)
      setOffers(updated)
    }
  }

  /* ------------------------------ loading ------------------------------ */
  if (loading) {
    return (
      <div className="space-y-5 pb-12" style={{ fontFamily: BODY_FONT }}>
        <style>{FONT_CSS}</style>
        <div className="h-28 animate-pulse rounded-2xl bg-stone-100" />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[0, 1, 2, 3].map((n) => (
            <div key={n} className="h-32 animate-pulse rounded-2xl bg-stone-100" />
          ))}
        </div>
        <div className="grid gap-5 lg:grid-cols-12">
          <div className="h-64 animate-pulse rounded-2xl bg-stone-100 lg:col-span-5" />
          <div className="h-64 animate-pulse rounded-2xl bg-stone-100 lg:col-span-7" />
        </div>
        <p className="text-center text-sm font-medium text-stone-500">Loading your dashboard…</p>
      </div>
    )
  }

  const s = stats || {
    totalProperties: recentProperties.length || 7,
    publishedCount: recentProperties.filter((p) => p.status === 'published').length || 7,
    draftCount: 0,
    archivedCount: 0,
    activeCount: recentProperties.length || 7,
    sourceBreakdown: { VIA_OTA: 4, VIA_OTA_EXCHANGE: 3 },
    destinationStats: [
      { destination: 'Agra', count: 3 },
      { destination: 'Hawaii', count: 1 },
      { destination: 'California Coast', count: 1 },
      { destination: 'Colorado', count: 1 },
      { destination: 'Mexico', count: 1 },
    ],
    recentActivity: [],
  }

  const totalSources =
    (s.sourceBreakdown?.VIA_OTA || 0) + (s.sourceBreakdown?.VIA_OTA_EXCHANGE || 0) || 1
  const viaOtaPercent = Math.round(((s.sourceBreakdown?.VIA_OTA || 0) / totalSources) * 100)
  const viaOtaExchangePercent = 100 - viaOtaPercent

  const destinations = s.destinationStats || []
  const maxDestination = Math.max(1, ...destinations.map((d) => d.count || 0))
  const today = new Date().toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long' })

  const kpis = [
    {
      label: 'Total properties',
      value: s.totalProperties,
      hint: `${s.activeCount} active on the portal`,
      icon: Building2,
      tone: 'bg-emerald-50 text-emerald-700',
    },
    {
      label: 'Live on website',
      value: s.publishedCount,
      hint: 'Guests can see and book these',
      icon: CheckCircle2,
      tone: 'bg-emerald-50 text-emerald-700',
    },
    {
      label: 'Promotional Offers',
      value: offers.filter((o) => o.active).length,
      hint: `${offers.length} configured deals`,
      icon: Tag,
      tone: 'bg-emerald-50 text-emerald-700',
    },
    {
      label: 'Drafts',
      value: s.draftCount,
      hint: 'Saved privately, not published',
      icon: FileEdit,
      tone: 'bg-amber-50 text-amber-700',
    },
  ]

  return (
    <div className="space-y-5 pb-12 text-[#101814]" style={{ fontFamily: BODY_FONT }}>
      <style>{FONT_CSS}</style>

      {/* ------------------------------ header ------------------------------ */}
      <header
        className={`${CARD} flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-7`}
        style={{ backgroundImage: 'linear-gradient(120deg, rgba(34,211,122,0.10), rgba(255,255,255,0) 55%)' }}
      >
        <div>
          <p className="text-sm font-medium text-stone-500">{today}</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-[1.9rem]" style={slab}>
            Welcome back
          </h1>
          <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-stone-600">
            Manage your catalog properties, promotional holiday packages, and active website scrollers.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={fetchDashboardData}
            disabled={refreshing}
            className="inline-flex items-center gap-2 rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm font-semibold text-stone-700 transition hover:bg-stone-50 disabled:opacity-60"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin text-[#22d37a]' : ''}`} />
            {refreshing ? 'Refreshing…' : 'Refresh'}
          </button>

          {/* Update Offers Action Button */}
          <Link
            to="/admin/offers"
            className="inline-flex items-center gap-2 rounded-xl border border-emerald-300 bg-emerald-50/80 px-4 py-2.5 text-sm font-semibold text-[#0c3b27] transition hover:bg-emerald-100"
          >
            <Tag className="h-4 w-4 text-[#22d37a]" />
            Update Offers
          </Link>

          <Link
            to="/admin/properties/new"
            className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:brightness-110"
            style={{ background: GREEN_DEEP }}
          >
            <PlusCircle className="h-4 w-4" />
            Add property
          </Link>
        </div>
      </header>

      {/* ------------------------------ error ------------------------------ */}
      {error && (
        <div
          role="alert"
          className="flex flex-wrap items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900"
        >
          <AlertCircle className="h-4 w-4 shrink-0 text-amber-600" />
          <span className="flex-1">{error}</span>
          <button
            type="button"
            onClick={fetchDashboardData}
            className="rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-amber-900 ring-1 ring-amber-200 hover:bg-amber-100"
          >
            Try again
          </button>
        </div>
      )}

      {/* ------------------------------ nudge ------------------------------ */}
      {s.draftCount > 0 && (
        <div className="flex items-center gap-3 rounded-2xl border border-amber-200/70 bg-amber-50/60 px-4 py-3 text-sm text-amber-900">
          <FileEdit className="h-4 w-4 shrink-0 text-amber-600" />
          <span>
            You have <strong>{s.draftCount}</strong> draft{s.draftCount === 1 ? '' : 's'} waiting to be published.
          </span>
          <Link to="/admin/properties" className="ml-auto inline-flex items-center gap-1 font-semibold hover:underline">
            Review <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      )}

      {/* ------------------------------ KPIs ------------------------------ */}
      <section aria-label="Key numbers" className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {kpis.map((k) => (
          <div key={k.label} className={`${CARD} p-5 transition hover:border-[#22d37a]/60`}>
            <div className="flex items-center gap-3">
              <span className={`grid h-10 w-10 place-items-center rounded-xl ${k.tone}`}>
                <k.icon className="h-[18px] w-[18px]" />
              </span>
              <span className="text-sm font-medium text-stone-600">{k.label}</span>
            </div>
            <p className="mt-4 text-4xl font-semibold leading-none tracking-tight tabular-nums" style={slab}>
              {k.value}
            </p>
            <p className="mt-2 text-xs text-stone-500">{k.hint}</p>
          </div>
        ))}
      </section>

      {/* ------------------------ Festival Greetings Manager ------------------------ */}
      <FestivalGreetingManager />

      {/* ------------------------ Promotional Offers Management Widget ------------------------ */}
      <section className={`${CARD} p-6 sm:p-7`}>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-50 text-[#0c3b27]">
              <Tag className="h-5 w-5 text-[#22d37a]" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold tracking-tight text-[#0c3b27]" style={slab}>
                  Live Promotional Offers
                </h2>
                <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
                  {offers.filter((o) => o.active).length} Active in Scroller
                </span>
              </div>
              <p className="mt-0.5 text-xs text-stone-500">
                Discounts and seasonal vouchers displayed in the Home page scroller and the top marquee ticker.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setEditingOffer(null)
                setOfferModalOpen(true)
              }}
              className="inline-flex items-center gap-1.5 rounded-xl border border-stone-200 bg-white px-3.5 py-2 text-xs font-semibold text-stone-700 transition hover:bg-stone-50"
            >
              <PlusCircle className="h-3.5 w-3.5 text-[#22d37a]" />
              Add Offer
            </button>
            <Link
              to="/admin/offers"
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#0c3b27] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#155338]"
            >
              <span>Manage All Offers</span>
              <ArrowRight className="h-3.5 w-3.5 text-[#22d37a]" />
            </Link>
          </div>
        </div>

        {/* Quick List of Active Offers */}
        <div className="mt-5 grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
          {offers.slice(0, 6).map((offer) => (
            <div
              key={offer.id}
              className={`flex flex-col justify-between rounded-xl border p-4 transition-all hover:shadow-xs ${
                offer.active ? 'border-stone-200/90 bg-white' : 'border-stone-200/60 bg-stone-50/50 opacity-60'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <span className="rounded-md bg-stone-100 px-2 py-0.5 text-[10.5px] font-mono font-bold text-stone-800">
                    {offer.code}
                  </span>
                  <span className="text-[11px] font-bold text-emerald-700">
                    {offer.discount}
                  </span>
                </div>
                <h4 className="mt-2 text-sm font-bold text-[#0c3b27] line-clamp-1">
                  {offer.title}
                </h4>
                <p className="mt-0.5 text-xs text-stone-500 line-clamp-1">
                  {offer.tagline}
                </p>
              </div>

              <div className="mt-3.5 flex items-center justify-between border-t border-stone-100 pt-2.5 text-xs">
                <span className="font-bold text-[#0c3b27]">{offer.offerPrice}</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleToggleOffer(offer.id)}
                    className={`text-[11px] font-semibold transition ${
                      offer.active ? 'text-emerald-700 hover:underline' : 'text-stone-400 hover:text-stone-600'
                    }`}
                  >
                    {offer.active ? 'Live' : 'Paused'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingOffer(offer)
                      setOfferModalOpen(true)
                    }}
                    className="rounded p-1 text-stone-500 hover:bg-stone-100 hover:text-stone-900"
                    title="Edit Offer"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ------------------------ sources + destinations ------------------------ */}
      <div className="grid gap-5 lg:grid-cols-12">
        {/* sources */}
        <section className={`${CARD} flex flex-col justify-between p-6 sm:p-7 lg:col-span-5`}>
          <div>
            <h2 className="text-lg font-semibold tracking-tight" style={slab}>
              Where bookings come from
            </h2>
            <p className="mt-1 text-sm leading-relaxed text-stone-500">
              Properties on the direct VIA OTA contract compared with the Exchange partner network.
            </p>

            {/* one bar, two segments */}
            <div className="mt-6 flex h-3 overflow-hidden rounded-full bg-stone-100" role="img" aria-label={`VIA OTA ${viaOtaPercent}%, VIA OTA Exchange ${viaOtaExchangePercent}%`}>
              <div className="h-full transition-all duration-700" style={{ width: `${viaOtaPercent}%`, background: GREEN_DEEP }} />
              <div className="h-full transition-all duration-700" style={{ width: `${viaOtaExchangePercent}%`, background: GREEN }} />
            </div>

            <ul className="mt-5 space-y-3">
              <li className="flex items-center justify-between gap-3 text-sm">
                <span className="flex items-center gap-2.5 font-medium text-stone-800">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: GREEN_DEEP }} />
                  <Globe className="h-4 w-4 text-stone-400" />
                  VIA OTA
                </span>
                <span className="tabular-nums text-stone-500">
                  <strong className="text-stone-900">{s.sourceBreakdown?.VIA_OTA || 0}</strong> · {viaOtaPercent}%
                </span>
              </li>
              <li className="flex items-center justify-between gap-3 text-sm">
                <span className="flex items-center gap-2.5 font-medium text-stone-800">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: GREEN }} />
                  <Share2 className="h-4 w-4 text-stone-400" />
                  VIA OTA Exchange
                </span>
                <span className="tabular-nums text-stone-500">
                  <strong className="text-stone-900">{s.sourceBreakdown?.VIA_OTA_EXCHANGE || 0}</strong> · {viaOtaExchangePercent}%
                </span>
              </li>
            </ul>
          </div>

          <div className="mt-7 flex items-center justify-between border-t border-stone-100 pt-4 text-sm">
            <span className="flex items-center gap-1.5 text-xs text-stone-500">
              <ShieldCheck className="h-4 w-4 text-[#22d37a]" />
              External ID sync ready
            </span>
            <Link to="/admin/properties" className="inline-flex items-center gap-1 font-semibold hover:underline" style={{ color: GREEN_DEEP }}>
              Manage sources <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </section>

        {/* destinations */}
        <section className={`${CARD} flex flex-col justify-between p-6 sm:p-7 lg:col-span-7`}>
          <div>
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold tracking-tight" style={slab}>
                  Properties by destination
                </h2>
                <p className="mt-1 text-sm text-stone-500">See where your catalog is strongest.</p>
              </div>
              <Link to="/admin/properties" className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold hover:underline" style={{ color: GREEN_DEEP }}>
                View catalog <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {destinations.length === 0 ? (
              <p className="mt-6 rounded-xl bg-stone-50 p-4 text-center text-sm text-stone-500">No destinations yet.</p>
            ) : (
              <ul className="mt-5 space-y-3.5">
                {destinations.map((item) => (
                  <li key={item.destination} className="flex items-center gap-3">
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-emerald-50">
                      <MapPin className="h-4 w-4 text-emerald-700" />
                    </span>
                    <span className="w-32 shrink-0 truncate text-sm font-medium text-stone-800 sm:w-40">
                      {item.destination}
                    </span>
                    <span className="h-2 flex-1 overflow-hidden rounded-full bg-stone-100">
                      <span
                        className="block h-full rounded-full transition-all duration-700"
                        style={{ width: `${Math.max(8, (item.count / maxDestination) * 100)}%`, background: GREEN }}
                      />
                    </span>
                    <span className="w-16 shrink-0 text-right text-sm tabular-nums text-stone-500">
                      <strong className="text-stone-900">{item.count}</strong> {item.count === 1 ? 'stay' : 'stays'}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="mt-6 flex items-center justify-between border-t border-stone-100 pt-4 text-sm text-stone-500">
            <span>Launching in a new region?</span>
            <Link
              to="/admin/properties/new"
              className="inline-flex items-center gap-1 font-semibold hover:underline"
              style={{ color: GREEN_DEEP }}
            >
              Add a property <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </section>
      </div>

      {/* ------------------------ recent properties ------------------------ */}
      <section className={`${CARD} p-6 sm:p-7`}>
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold tracking-tight" style={slab}>
              Recent properties
            </h2>
            <p className="mt-1 text-sm text-stone-500">The listings you updated most recently.</p>
          </div>
          <Link to="/admin/properties" className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold hover:underline" style={{ color: GREEN_DEEP }}>
            All properties ({s.totalProperties}) <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {recentProperties.length === 0 ? (
          <div className="flex flex-col items-center rounded-2xl border border-dashed border-stone-200 bg-stone-50/60 px-6 py-10 text-center">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white shadow-sm">
              <Inbox className="h-5 w-5 text-stone-400" />
            </span>
            <p className="mt-3 text-sm font-semibold text-stone-800">No properties yet</p>
            <p className="mt-1 max-w-sm text-sm text-stone-500">
              Create your first listing and it will show up here.
            </p>
            <Link
              to="/admin/properties/new"
              className="mt-4 inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-white"
              style={{ background: GREEN_DEEP }}
            >
              <PlusCircle className="h-4 w-4" />
              Add property
            </Link>
          </div>
        ) : (
          <ul className="-mx-2 divide-y divide-stone-100">
            {recentProperties.map((prop) => {
              const st = STATUS_STYLES[prop.status] || STATUS_STYLES.default
              return (
                <li
                  key={prop._id || prop.id}
                  className="flex flex-col justify-between gap-3 rounded-xl px-2 py-3.5 transition hover:bg-stone-50 sm:flex-row sm:items-center"
                >
                  <div className="flex min-w-0 items-center gap-3.5">
                    <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-stone-200 bg-stone-100">
                      <img
                        src={prop.coverImage || prop.gallery?.[0] || '/placeholder.jpg'}
                        alt={prop.title}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = '/tree-logo.png'
                        }}
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="truncate text-sm font-semibold text-stone-900">{prop.title}</span>
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${st.chip}`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${st.dot}`} />
                          {prop.status}
                        </span>
                      </div>
                      <p className="mt-0.5 flex flex-wrap items-center gap-x-2 text-xs text-stone-500">
                        <span className="font-medium text-stone-600">{prop.internalId || 'ID'}</span>
                        <span aria-hidden="true">·</span>
                        <span>{prop.destination || prop.location}</span>
                        <span aria-hidden="true">·</span>
                        <span>{prop.source}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <Link
                      to={`/admin/properties/${prop._id || prop.id}/edit`}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-stone-200 bg-white px-3 py-1.5 text-sm font-medium text-stone-700 transition hover:bg-stone-50"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                      Edit
                    </Link>
                    {prop.slug && (
                      <a
                        href={`/resorts/${prop.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="grid h-8 w-8 place-items-center rounded-lg text-stone-400 transition hover:bg-white hover:text-stone-900"
                        title="View public stay page"
                        aria-label={`View ${prop.title} on the website`}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </section>

      {/* ------------------------ activity ------------------------ */}
      <section className={`${CARD} p-6 sm:p-7`}>
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-50">
              <Clock className="h-[18px] w-[18px] text-emerald-700" />
            </span>
            <h2 className="text-lg font-semibold tracking-tight" style={slab}>
              Recent activity
            </h2>
          </div>
          <Link to="/admin/audit-logs" className="inline-flex items-center gap-1 text-sm font-semibold hover:underline" style={{ color: GREEN_DEEP }}>
            All logs <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {!s.recentActivity || s.recentActivity.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-stone-200 bg-stone-50/60 px-6 py-8 text-center text-sm text-stone-500">
            Nothing yet. Updates and status changes will appear here automatically.
          </div>
        ) : (
          <ul className="relative space-y-0 before:absolute before:bottom-3 before:left-[5px] before:top-3 before:w-px before:bg-stone-200">
            {s.recentActivity.map((log) => (
              <li key={log._id || log.id} className="relative flex items-start justify-between gap-3 py-2.5 pl-6 text-sm">
                <span className="absolute left-0 top-[1.05rem] h-[11px] w-[11px] rounded-full border-2 border-white bg-[#22d37a] ring-1 ring-stone-200" />
                <div className="min-w-0">
                  <span className="mr-2 inline-block rounded-md bg-stone-100 px-2 py-0.5 text-xs font-semibold text-stone-700">
                    {log.action}
                  </span>
                  <span className="font-semibold text-stone-800">
                    {log.targetName || log.targetId || 'Property Resource'}
                  </span>
                  <span className="ml-2 text-stone-500">by {log.userName || 'Administrator'}</span>
                </div>
                <span className="shrink-0 text-xs text-stone-400">
                  {log.createdAt ? new Date(log.createdAt).toLocaleDateString() : 'Recent'}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Edit Offer Modal */}
      <OfferEditModal
        isOpen={offerModalOpen}
        onClose={() => setOfferModalOpen(false)}
        offer={editingOffer}
        onSave={handleSaveOffer}
      />
    </div>
  )
}
