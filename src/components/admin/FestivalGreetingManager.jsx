import { useState, useEffect } from 'react'
import { Sparkles, Save, Check, Eye, EyeOff } from 'lucide-react'
import {
  getFestivalGreeting,
  saveFestivalGreeting,
  FESTIVAL_PRESETS,
} from '../../data/offers'

export default function FestivalGreetingManager() {
  const [greeting, setGreeting] = useState(getFestivalGreeting)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const handleUpdated = (e) => {
      if (e.detail) setGreeting(e.detail)
      else setGreeting(getFestivalGreeting())
    }
    window.addEventListener('chis-festival-greeting-updated', handleUpdated)
    return () => window.removeEventListener('chis-festival-greeting-updated', handleUpdated)
  }, [])

  const applyPreset = (presetKey) => {
    const preset = FESTIVAL_PRESETS[presetKey]
    if (!preset) return
    const updated = {
      ...greeting,
      occasion: presetKey,
      title: preset.title,
      badge: preset.badge,
      message: preset.message,
      promoCode: preset.promoCode,
    }
    setGreeting(updated)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    saveFestivalGreeting(greeting)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const handleToggle = () => {
    const updated = { ...greeting, enabled: !greeting.enabled }
    setGreeting(updated)
    saveFestivalGreeting(updated)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <section className="rounded-2xl border border-amber-200/80 bg-gradient-to-br from-amber-50/50 via-white to-amber-50/30 p-6 sm:p-7 shadow-xs">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-amber-100 pb-5">
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-amber-400 via-[#fbd75b] to-amber-500 text-xl shadow-sm text-stone-950">
            {FESTIVAL_PRESETS[greeting.occasion]?.emoji || '🪔'}
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold tracking-tight text-[#0c3b27]">
                Festival Greetings & Seasonal Scroller Banner
              </h2>
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                  greeting.enabled
                    ? 'bg-amber-100 text-amber-900 border border-amber-300'
                    : 'bg-stone-100 text-stone-500'
                }`}
              >
                {greeting.enabled ? 'Live in Scroller & Ticker' : 'Disabled'}
              </span>
            </div>
            <p className="mt-0.5 text-xs text-stone-500">
              Display special holiday greetings (like Happy Diwali, Christmas, New Year) in the top announcement ticker and offers section.
            </p>
          </div>
        </div>

        {/* Quick ON / OFF toggle button */}
        <button
          type="button"
          onClick={handleToggle}
          className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition shadow-xs ${
            greeting.enabled
              ? 'bg-amber-500 text-stone-950 hover:bg-amber-400'
              : 'border border-stone-200 bg-white text-stone-600 hover:bg-stone-50'
          }`}
        >
          {greeting.enabled ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
          <span>{greeting.enabled ? 'Greeting is Active' : 'Enable Greeting'}</span>
        </button>
      </div>

      {/* Preset Occasions Bar */}
      <div className="mt-5">
        <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
          Select Occasion Preset
        </label>
        <div className="flex flex-wrap items-center gap-2">
          {Object.entries(FESTIVAL_PRESETS).map(([key, item]) => {
            const isSelected = greeting.occasion === key
            return (
              <button
                key={key}
                type="button"
                onClick={() => applyPreset(key)}
                className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition ${
                  isSelected
                    ? 'bg-[#0c3b27] text-white shadow-xs scale-102 ring-2 ring-amber-400/50'
                    : 'border border-stone-200 bg-white text-stone-700 hover:bg-amber-50/60'
                }`}
              >
                <span>{item.emoji}</span>
                <span>{item.name}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Form configuration */}
      <form onSubmit={handleSubmit} className="mt-5 space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label className="block text-xs font-semibold text-stone-700">Greeting Title</label>
            <input
              type="text"
              required
              value={greeting.title}
              onChange={(e) => setGreeting({ ...greeting, title: e.target.value })}
              placeholder="e.g. Happy Diwali"
              className="mt-1 w-full rounded-xl border border-stone-200 bg-white px-3.5 py-2 text-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-stone-700">Ticker Badge Text</label>
            <input
              type="text"
              value={greeting.badge}
              onChange={(e) => setGreeting({ ...greeting, badge: e.target.value })}
              placeholder="e.g. 🪔 HAPPY DIWALI"
              className="mt-1 w-full rounded-xl border border-stone-200 bg-white px-3.5 py-2 text-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-stone-700">Festive Promo Code</label>
            <input
              type="text"
              value={greeting.promoCode}
              onChange={(e) => setGreeting({ ...greeting, promoCode: e.target.value.toUpperCase() })}
              placeholder="e.g. DIWALI2026"
              className="mt-1 w-full rounded-xl border border-stone-200 bg-white px-3.5 py-2 text-sm uppercase font-mono font-bold focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-700">
            Greeting Message (Shown in Banner & Top Ticker)
          </label>
          <textarea
            rows={2}
            required
            value={greeting.message}
            onChange={(e) => setGreeting({ ...greeting, message: e.target.value })}
            placeholder="Wishing you & your family a joyous, illuminated Diwali from Country Holidays Inn & Suites..."
            className="mt-1 w-full rounded-xl border border-stone-200 bg-white px-3.5 py-2 text-sm leading-relaxed focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="text-xs text-stone-500">
            {saved && (
              <span className="inline-flex items-center gap-1.5 font-bold text-emerald-700 animate-fadeIn">
                <Check className="h-4 w-4" />
                Festival greeting saved and live on website!
              </span>
            )}
          </div>

          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-xl bg-[#0c3b27] px-5 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-[#155338]"
          >
            <Save className="h-4 w-4 text-[#22d37a]" />
            Save Festival Greeting
          </button>
        </div>
      </form>
    </section>
  )
}

