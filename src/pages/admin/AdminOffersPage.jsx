import { useState, useEffect } from 'react'
import {
  Tag,
  Plus,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  Sparkles,
  RefreshCw,
  ArrowUpRight,
  Check,
  Search,
  Filter,
  Copy,
  Percent,
} from 'lucide-react'
import {
  getStoredOffers,
  saveStoredOffers,
  updateOffer,
  deleteOffer,
  addOffer,
  toggleOfferStatus,
  resetOffersToDefault,
} from '../../data/offers'
import OfferEditModal from '../../components/admin/OfferEditModal'
import FestivalGreetingManager from '../../components/admin/FestivalGreetingManager'

export const slab = { fontFamily: "'Sora', 'Plus Jakarta Sans', system-ui, sans-serif" }

export default function AdminOffersPage() {
  const [offers, setOffers] = useState(getStoredOffers)
  const [editingOffer, setEditingOffer] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState('all')
  const [notification, setNotification] = useState(null)

  const showNotify = (msg) => {
    setNotification(msg)
    setTimeout(() => setNotification(null), 3000)
  }

  useEffect(() => {
    const handleUpdate = (e) => {
      if (e.detail) setOffers(e.detail)
      else setOffers(getStoredOffers())
    }
    window.addEventListener('chis-offers-updated', handleUpdate)
    return () => window.removeEventListener('chis-offers-updated', handleUpdate)
  }, [])

  const handleToggle = (id, field) => {
    const updated = toggleOfferStatus(id, field)
    setOffers(updated)
    showNotify('Offer visibility updated.')
  }

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this promotional offer?')) {
      const updated = deleteOffer(id)
      setOffers(updated)
      showNotify('Offer deleted.')
    }
  }

  const handleSaveModal = (offerData) => {
    if (editingOffer) {
      const updated = updateOffer(editingOffer.id, offerData)
      setOffers(updated)
      showNotify('Offer updated successfully!')
    } else {
      const updated = addOffer(offerData)
      setOffers(updated)
      showNotify('New offer created and live on website!')
    }
  }

  const handleReset = () => {
    if (window.confirm('Reset all offers to the default campaign setup? Custom changes will be overwritten.')) {
      const updated = resetOffersToDefault()
      setOffers(updated)
      showNotify('Offers reset to campaign defaults.')
    }
  }

  const filtered = offers.filter((o) => {
    const matchCategory = activeTab === 'all' || o.category === activeTab
    const matchSearch =
      o.title.toLowerCase().includes(search.toLowerCase()) ||
      o.code.toLowerCase().includes(search.toLowerCase()) ||
      (o.badge && o.badge.toLowerCase().includes(search.toLowerCase()))
    return matchCategory && matchSearch
  })

  return (
    <div className="space-y-6 pb-12 font-['Plus_Jakarta_Sans',system-ui,sans-serif] text-[#101814]">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-stone-200/80 bg-white p-6 shadow-sm">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#0c3b27]">
            <Sparkles className="h-3 w-3 text-[#22d37a]" />
            Promotions & Campaigns
          </span>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-[#0c3b27] sm:text-3xl" style={slab}>
            Manage Promotional Offers
          </h1>
          <p className="mt-1 text-sm text-stone-500">
            Control live offers displayed in the home page scroller and the top marquee ticker.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-2 rounded-xl border border-stone-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-stone-600 transition hover:bg-stone-50"
            title="Reset to initial campaign presets"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Reset Defaults
          </button>

          <a
            href="/#offers-scroller"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50/60 px-3.5 py-2.5 text-xs font-semibold text-[#0c3b27] transition hover:bg-emerald-100"
          >
            <span>Preview Scroller</span>
            <ArrowUpRight className="h-3.5 w-3.5 text-[#22d37a]" />
          </a>

          <button
            type="button"
            onClick={() => {
              setEditingOffer(null)
              setModalOpen(true)
            }}
            className="inline-flex items-center gap-2 rounded-xl bg-[#0c3b27] px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-[#155338]"
          >
            <Plus className="h-4 w-4 text-[#22d37a]" />
            Add New Offer
          </button>
        </div>
      </div>

      {notification && (
        <div className="flex items-center gap-2.5 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-md animate-fadeIn">
          <Check className="h-4 w-4" />
          <span>{notification}</span>
        </div>
      )}

      {/* Festival Greetings & Seasonal Scroller Banner Manager */}
      <FestivalGreetingManager />

      {/* Filter and Search Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-stone-200/80 bg-white p-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-2">
          {['all', 'membership', 'stay', 'seasonal'].map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`rounded-xl px-3.5 py-2 text-xs font-bold transition capitalize ${
                activeTab === tab
                  ? 'bg-[#0c3b27] text-white shadow-xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {tab === 'all' ? 'All Offers' : tab === 'stay' ? 'Resorts & Stays' : tab} (
              {tab === 'all' ? offers.length : offers.filter((o) => o.category === tab).length})
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search code, title..."
            className="w-full rounded-xl border border-stone-200 bg-stone-50/50 pl-9 pr-3 py-2 text-xs focus:border-[#22d37a] focus:bg-white focus:outline-none"
          />
        </div>
      </div>

      {/* Offers Cards Grid */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((offer) => (
          <div
            key={offer.id}
            className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border bg-white p-5 shadow-xs transition-all duration-200 hover:shadow-md ${
              offer.active ? 'border-stone-200/90' : 'border-stone-200/60 opacity-60 bg-stone-50/50'
            }`}
          >
            <div>
              {/* Header Badges */}
              <div className="flex items-start justify-between gap-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-[#0c3b27] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#b3d565]">
                  <Tag className="h-2.5 w-2.5" />
                  {offer.badge || 'OFFER'}
                </span>
                <span className="rounded-lg bg-stone-100 px-2 py-0.5 text-[11px] font-mono font-bold text-stone-700">
                  {offer.code}
                </span>
              </div>

              <h3 className="mt-3 text-base font-bold text-[#0c3b27] group-hover:text-emerald-700 transition" style={slab}>
                {offer.title}
              </h3>
              <p className="mt-1 text-xs text-stone-500 line-clamp-2">
                {offer.tagline}
              </p>

              {/* Price row */}
              <div className="mt-4 flex items-baseline justify-between border-y border-stone-100 py-2.5">
                <div>
                  <span className="text-lg font-bold text-[#0c3b27]">{offer.offerPrice}</span>
                  {offer.originalPrice !== offer.offerPrice && (
                    <span className="ml-2 text-xs text-stone-400 line-through">{offer.originalPrice}</span>
                  )}
                </div>
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                  {offer.discount}
                </span>
              </div>

              {/* Per-card toggle states */}
              <div className="mt-3 flex flex-wrap items-center gap-4 text-xs font-medium text-stone-600">
                <button
                  type="button"
                  onClick={() => handleToggle(offer.id, 'active')}
                  className={`inline-flex items-center gap-1.5 transition ${
                    offer.active ? 'text-emerald-700 font-semibold' : 'text-stone-400'
                  }`}
                >
                  {offer.active ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                  <span>{offer.active ? 'Live in Scroller' : 'Hidden in Scroller'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleToggle(offer.id, 'showInTicker')}
                  className={`inline-flex items-center gap-1.5 transition ${
                    offer.showInTicker ? 'text-amber-700 font-semibold' : 'text-stone-400'
                  }`}
                >
                  <Sparkles className="h-3 w-3 text-amber-500" />
                  <span>{offer.showInTicker ? 'In Top Ticker' : 'Not in Ticker'}</span>
                </button>
              </div>
            </div>

            {/* Actions Footer */}
            <div className="mt-5 flex items-center justify-between border-t border-stone-100 pt-3">
              <span className="text-[11px] text-stone-400">{offer.validTill || 'Active'}</span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setEditingOffer(offer)
                    setModalOpen(true)
                  }}
                  className="grid h-8 w-8 place-items-center rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-100 hover:text-stone-900 transition"
                  title="Edit Offer"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(offer.id)}
                  className="grid h-8 w-8 place-items-center rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 transition"
                  title="Delete Offer"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="rounded-2xl border border-dashed border-stone-200 bg-white p-12 text-center text-stone-500">
          <Tag className="mx-auto h-8 w-8 text-stone-300" />
          <p className="mt-3 text-sm font-semibold text-stone-700">No offers found</p>
          <p className="mt-1 text-xs text-stone-400">Try modifying your search or filter criteria.</p>
        </div>
      )}

      {/* Modal */}
      <OfferEditModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        offer={editingOffer}
        onSave={handleSaveModal}
      />
    </div>
  )
}

