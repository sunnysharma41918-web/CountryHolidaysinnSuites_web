import { useState } from 'react'
import { X, Calendar, Users, MapPin, CheckCircle, ShieldCheck, Sparkles, CreditCard } from 'lucide-react'

export default function BookingModal({ isOpen, onClose, initialData = {} }) {
  if (!isOpen) return null

  const [destination, setDestination] = useState(initialData.destination || initialData.title || 'Poland, Tatra Mountains')
  const [persons, setPersons] = useState(initialData.persons || '2 Persons')
  const [days, setDays] = useState(initialData.days || '3 Nights 2 Days')
  const [includeGuide, setIncludeGuide] = useState(true)
  const [includeSpa, setIncludeSpa] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  // Price calculation
  const basePricePerPerson = 2500
  const numPersons = parseInt(persons) || 2
  const guideFee = includeGuide ? 350 : 0
  const spaFee = includeSpa ? 250 : 0
  const total = basePricePerPerson * numPersons + guideFee + spaFee

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      onClose()
    }, 3500)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white rounded-[28px] overflow-hidden shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 bg-slate-900 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
          <span className="text-[11px] font-bold tracking-wider text-[#ff5938] uppercase">
            COUNTRY HOLIDAYS INNSUITES Reservation & Estimate
          </span>
          <h3 className="font-display text-xl sm:text-2xl font-bold mt-1">
            {destination}
          </h3>
          <p className="text-xs text-slate-300 mt-1">
            Curated itinerary with 5-star mountain chalet accommodation.
          </p>
        </div>

        {/* Content */}
        {submitted ? (
          <div className="p-8 text-center flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h4 className="font-display text-2xl font-bold text-slate-900">
              Trip Reserved Successfully!
            </h4>
            <p className="text-sm text-slate-600 mt-2 max-w-md">
              We've dispatched your personalized expedition itinerary and booking invoice to your email address. Our travel concierge will be in touch shortly!
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Options grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Destination
                </label>
                <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm text-slate-800">
                  <MapPin className="w-4 h-4 text-[#ff5938] shrink-0" />
                  <span className="truncate font-medium">{destination}</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Group Size
                </label>
                <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm text-slate-800">
                  <Users className="w-4 h-4 text-[#ff5938] shrink-0" />
                  <span className="font-medium">{persons}</span>
                </div>
              </div>
            </div>

            {/* Dates & Duration */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Duration & Dates
              </label>
              <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm text-slate-800">
                <Calendar className="w-4 h-4 text-[#ff5938] shrink-0" />
                <span className="font-medium">{days} • Spring / Summer 2025</span>
              </div>
            </div>

            {/* Add-ons */}
            <div className="space-y-2.5 pt-2">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Recommended Expedition Add-ons
              </span>

              <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={includeGuide}
                    onChange={(e) => setIncludeGuide(e.target.checked)}
                    className="w-4 h-4 text-[#ff5938] rounded focus:ring-[#ff5938]"
                  />
                  <div>
                    <div className="text-xs font-bold text-slate-900">
                      Private Mountain Alpine Guide
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Certified local guide for safety & hidden photo spots
                    </div>
                  </div>
                </div>
                <span className="text-xs font-bold text-slate-800">+$350</span>
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={includeSpa}
                    onChange={(e) => setIncludeSpa(e.target.checked)}
                    className="w-4 h-4 text-[#ff5938] rounded focus:ring-[#ff5938]"
                  />
                  <div>
                    <div className="text-xs font-bold text-slate-900">
                      Thermal Spa & Hot Spring Pass
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Unlimited wellness access after your daily trail
                    </div>
                  </div>
                </div>
                <span className="text-xs font-bold text-slate-800">+$250</span>
              </label>
            </div>

            {/* Price breakdown */}
            <div className="p-4 rounded-2xl bg-orange-50/60 border border-orange-100 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-600 block">
                  Estimated Total ({numPersons} Travelers)
                </span>
                <span className="text-2xl font-black text-slate-900 font-display">
                  ${total.toLocaleString()}
                </span>
              </div>
              <div className="text-right text-[11px] text-slate-500">
                <span className="text-emerald-700 font-semibold flex items-center gap-1 justify-end">
                  <ShieldCheck className="w-3.5 h-3.5" /> Best Price Guaranteed
                </span>
                <span>Free cancellation up to 14 days</span>
              </div>
            </div>

            {/* Contact input */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Your Contact Email
              </label>
              <input
                type="email"
                required
                placeholder="name@example.com"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff5938]"
              />
            </div>

            {/* Submit button */}
            <button
              type="submit"
              className="w-full py-3.5 rounded-full bg-[#ff5938] hover:bg-[#e84a28] text-white font-bold text-sm shadow-lg shadow-[#ff5938]/30 transition transform hover:-translate-y-0.5 active:translate-y-0"
            >
              Confirm Reservation & Receive Itinerary
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
