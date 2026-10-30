import { useState, useEffect } from 'react'
import { X, Check, Save, Sparkles, Tag, AlertCircle } from 'lucide-react'

export default function OfferEditModal({ isOpen, onClose, offer, onSave }) {
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    category: 'membership',
    badge: '',
    code: '',
    discount: '',
    originalPrice: '',
    offerPrice: '',
    emi: '',
    validTill: '',
    tagline: '',
    perks: '',
    img: '',
    active: true,
    showInTicker: true,
    tickerText: '',
  })

  useEffect(() => {
    if (offer) {
      setFormData({
        title: offer.title || '',
        subtitle: offer.subtitle || '',
        category: offer.category || 'membership',
        badge: offer.badge || '',
        code: offer.code || '',
        discount: offer.discount || '',
        originalPrice: offer.originalPrice || '',
        offerPrice: offer.offerPrice || '',
        emi: offer.emi || '',
        validTill: offer.validTill || '',
        tagline: offer.tagline || '',
        perks: Array.isArray(offer.perks) ? offer.perks.join('\n') : (offer.perks || ''),
        img: offer.img || '',
        active: offer.active !== false,
        showInTicker: offer.showInTicker !== false,
        tickerText: offer.tickerText || '',
      })
    } else {
      setFormData({
        title: '',
        subtitle: '',
        category: 'membership',
        badge: 'SPECIAL OFFER',
        code: 'SAVE10',
        discount: 'Flat 20% Off',
        originalPrice: '₹50,000',
        offerPrice: '₹40,000',
        emi: 'Flexible EMI available',
        validTill: 'Limited Time Offer',
        tagline: 'Exclusive holiday savings designed for luxury stays and suites.',
        perks: '6N / 7D luxury stay\nZero peak surcharge\nComplimentary breakfast',
        img: '1571896349842-33c89424de2d',
        active: true,
        showInTicker: true,
        tickerText: '',
      })
    }
  }, [offer, isOpen])

  if (!isOpen) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    const processed = {
      ...formData,
      perks: formData.perks
        .split('\n')
        .map((p) => p.trim())
        .filter(Boolean),
    }
    onSave(processed)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white p-6 sm:p-8 shadow-2xl text-[#101814] font-['Plus_Jakarta_Sans',system-ui,sans-serif]"
        role="dialog"
        aria-modal="true"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 grid h-9 w-9 place-items-center rounded-full bg-stone-100 text-stone-500 hover:bg-stone-200 hover:text-stone-800 transition"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-50 text-[#0c3b27]">
            <Tag className="h-5 w-5" />
          </span>
          <div>
            <h2 className="text-xl font-bold text-[#0c3b27]">
              {offer ? 'Update Promotional Offer' : 'Create New Promotional Offer'}
            </h2>
            <p className="text-xs text-stone-500">
              Changes reflect immediately on the website scroller and top ticker.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-stone-700">Offer Title *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. 10-Year Silver Vacation Membership"
                className="mt-1 w-full rounded-xl border border-stone-200 px-3.5 py-2 text-sm focus:border-[#22d37a] focus:outline-none focus:ring-1 focus:ring-[#22d37a]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700">Subtitle / Category Label</label>
              <input
                type="text"
                value={formData.subtitle}
                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                placeholder="e.g. Couple & Family Vacation Club"
                className="mt-1 w-full rounded-xl border border-stone-200 px-3.5 py-2 text-sm focus:border-[#22d37a] focus:outline-none focus:ring-1 focus:ring-[#22d37a]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="mt-1 w-full rounded-xl border border-stone-200 px-3 py-2 text-sm focus:border-[#22d37a] focus:outline-none focus:ring-1 focus:ring-[#22d37a]"
              >
                <option value="membership">Memberships</option>
                <option value="stay">Resorts & Stays</option>
                <option value="seasonal">Seasonal & Family</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700">Promo Code *</label>
              <input
                type="text"
                required
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                placeholder="e.g. CHIS35"
                className="mt-1 w-full rounded-xl border border-stone-200 px-3.5 py-2 text-sm uppercase font-mono font-bold focus:border-[#22d37a] focus:outline-none focus:ring-1 focus:ring-[#22d37a]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700">Discount Pill Text</label>
              <input
                type="text"
                value={formData.discount}
                onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                placeholder="e.g. Save ₹1,61,000"
                className="mt-1 w-full rounded-xl border border-stone-200 px-3.5 py-2 text-sm focus:border-[#22d37a] focus:outline-none focus:ring-1 focus:ring-[#22d37a]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-stone-700">Badge Banner</label>
              <input
                type="text"
                value={formData.badge}
                onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                placeholder="e.g. 35% OFF · FESTIVE SPECIAL"
                className="mt-1 w-full rounded-xl border border-stone-200 px-3.5 py-2 text-sm focus:border-[#22d37a] focus:outline-none focus:ring-1 focus:ring-[#22d37a]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700">Validity Note</label>
              <input
                type="text"
                value={formData.validTill}
                onChange={(e) => setFormData({ ...formData, validTill: e.target.value })}
                placeholder="e.g. Valid till 30 Nov 2026"
                className="mt-1 w-full rounded-xl border border-stone-200 px-3.5 py-2 text-sm focus:border-[#22d37a] focus:outline-none focus:ring-1 focus:ring-[#22d37a]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700">Offer Price</label>
              <input
                type="text"
                value={formData.offerPrice}
                onChange={(e) => setFormData({ ...formData, offerPrice: e.target.value })}
                placeholder="e.g. ₹2,99,000"
                className="mt-1 w-full rounded-xl border border-stone-200 px-3.5 py-2 text-sm font-semibold text-[#0c3b27] focus:border-[#22d37a] focus:outline-none focus:ring-1 focus:ring-[#22d37a]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700">Original Price</label>
              <input
                type="text"
                value={formData.originalPrice}
                onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                placeholder="e.g. ₹4,60,000"
                className="mt-1 w-full rounded-xl border border-stone-200 px-3.5 py-2 text-sm line-through text-stone-500 focus:border-[#22d37a] focus:outline-none focus:ring-1 focus:ring-[#22d37a]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700">EMI / Pricing Note</label>
              <input
                type="text"
                value={formData.emi}
                onChange={(e) => setFormData({ ...formData, emi: e.target.value })}
                placeholder="e.g. ₹12,450 / month"
                className="mt-1 w-full rounded-xl border border-stone-200 px-3.5 py-2 text-sm focus:border-[#22d37a] focus:outline-none focus:ring-1 focus:ring-[#22d37a]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700">Tagline Description</label>
            <textarea
              rows={2}
              value={formData.tagline}
              onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
              placeholder="Short description highlighting the deal benefits..."
              className="mt-1 w-full rounded-xl border border-stone-200 px-3.5 py-2 text-sm focus:border-[#22d37a] focus:outline-none focus:ring-1 focus:ring-[#22d37a]"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-stone-700">
                Key Perks (one per line)
              </label>
              <textarea
                rows={3}
                value={formData.perks}
                onChange={(e) => setFormData({ ...formData, perks: e.target.value })}
                placeholder="6N / 7D every year&#10;Zero peak surcharge&#10;Carry forward unused nights"
                className="mt-1 w-full rounded-xl border border-stone-200 px-3.5 py-2 text-xs font-mono focus:border-[#22d37a] focus:outline-none focus:ring-1 focus:ring-[#22d37a]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700">Cover Image (Unsplash ID or URL)</label>
              <input
                type="text"
                value={formData.img}
                onChange={(e) => setFormData({ ...formData, img: e.target.value })}
                placeholder="e.g. 1571896349842-33c89424de2d"
                className="mt-1 w-full rounded-xl border border-stone-200 px-3.5 py-2 text-xs focus:border-[#22d37a] focus:outline-none focus:ring-1 focus:ring-[#22d37a]"
              />
              <label className="block text-xs font-semibold text-stone-700 mt-2">
                Custom Ticker Text (Optional)
              </label>
              <input
                type="text"
                value={formData.tickerText}
                onChange={(e) => setFormData({ ...formData, tickerText: e.target.value })}
                placeholder="Brief line for the top marquee bar..."
                className="mt-1 w-full rounded-xl border border-stone-200 px-3.5 py-2 text-xs focus:border-[#22d37a] focus:outline-none focus:ring-1 focus:ring-[#22d37a]"
              />
            </div>
          </div>

          {/* Visibility toggles */}
          <div className="flex flex-wrap items-center gap-6 rounded-2xl bg-stone-50 p-4 border border-stone-200/80">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.active}
                onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                className="h-4 w-4 rounded text-[#0c3b27] focus:ring-[#22d37a]"
              />
              <span className="text-sm font-semibold text-stone-800">
                Live in Offers Scroller
              </span>
            </label>
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.showInTicker}
                onChange={(e) => setFormData({ ...formData, showInTicker: e.target.checked })}
                className="h-4 w-4 rounded text-[#0c3b27] focus:ring-[#22d37a]"
              />
              <span className="text-sm font-semibold text-stone-800">
                Show in Top Announcement Ticker
              </span>
            </label>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-100">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-stone-200 px-4 py-2 text-sm font-medium text-stone-600 hover:bg-stone-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-xl bg-[#0c3b27] px-6 py-2 text-sm font-semibold text-white shadow hover:bg-[#155338]"
            >
              <Save className="h-4 w-4 text-[#22d37a]" />
              {offer ? 'Save Changes' : 'Create Offer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

