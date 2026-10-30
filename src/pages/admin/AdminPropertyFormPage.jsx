import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { api } from '../../services/api'
import {
  ArrowLeft,
  Save,
  Building2,
  Image as ImageIcon,
  Plus,
  Trash2,
  Check,
  AlertCircle,
  CheckCircle2,
  Link2,
  MapPin,
  FileText,
  Settings2,
  X,
} from 'lucide-react'

/* ------------------------------------------------------------------ */
/*  Fonts: Plus Jakarta Sans (text) + Sora (headings)                  */
/* ------------------------------------------------------------------ */
const FONT_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Sora:wght@500;600;700&display=swap');
`
const BODY_FONT = "'Plus Jakarta Sans', system-ui, sans-serif"
const DISPLAY_FONT = "'Sora', 'Plus Jakarta Sans', system-ui, sans-serif"
const display = { fontFamily: DISPLAY_FONT }

const GREEN = '#22d37a'
const GREEN_DEEP = '#0c3b27'

const CARD = 'rounded-2xl border border-stone-200/80 bg-white shadow-[0_1px_2px_rgba(12,59,39,0.04)]'
const INPUT =
  'w-full rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm text-stone-800 outline-none transition placeholder:text-stone-400 focus:border-[#22d37a] focus:ring-2 focus:ring-[#22d37a]/25'
const LABEL = 'mb-1.5 block text-sm font-semibold text-stone-700'
const HINT = 'mt-1.5 block text-xs text-stone-500'

const COMMON_AMENITIES = [
  'Restaurant',
  'Outdoor Pool',
  'Free Wi-Fi',
  'Spa Access',
  'Oceanfront Suites',
  'Mountain Views',
  'Fitness Centre',
  'Rooftop Dining',
  'Private Balconies',
  'Heritage Architecture',
  'Family Friendly',
  'Room Service',
]

/* ---------------------------- small helpers ---------------------------- */

function Section({ icon: Icon, title, hint, children }) {
  return (
    <section className={`${CARD} space-y-6 p-6 sm:p-7`}>
      <div className="flex items-start gap-3 border-b border-stone-100 pb-4">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-emerald-50">
          <Icon className="h-[18px] w-[18px] text-emerald-700" />
        </span>
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-stone-900" style={display}>
            {title}
          </h2>
          {hint && <p className="mt-0.5 text-sm text-stone-500">{hint}</p>}
        </div>
      </div>
      {children}
    </section>
  )
}

function Required() {
  return (
    <span className="ml-0.5 text-red-500" aria-hidden="true">
      *
    </span>
  )
}

function Switch({ checked, onChange, label, hint }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-stone-200 bg-stone-50/60 p-4">
      <div>
        <span className="block text-sm font-semibold text-stone-800">{label}</span>
        <span className="text-xs text-stone-500">{hint}</span>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#22d37a]/50 ${checked ? 'bg-[#22d37a]' : 'bg-stone-300'
          }`}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-200 ${checked ? 'translate-x-5' : 'translate-x-0'
            }`}
        />
      </button>
    </div>
  )
}

/* ------------------------------ page ------------------------------ */

export default function AdminPropertyFormPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEditing = Boolean(id)

  const [loading, setLoading] = useState(isEditing)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    internalId: '',
    source: 'VIA_OTA',
    externalId: '',
    externalSyncStatus: 'NOT_APPLICABLE',
    externalSyncNotes: '',
    destination: 'Agra',
    location: '',
    city: '',
    state: '',
    country: 'India',
    address: '',
    mapQuery: '',
    description: '',
    destinationDescription: '',
    knowYourDestination: '',
    highlights: [],
    amenities: [],
    image: '',
    gallery: [],
    contactPhone: '',
    contactEmail: '',
    contactWebsite: '',
    status: 'draft',
    isActive: true,
    featured: false,
  })

  // Tag inputs
  const [highlightInput, setHighlightInput] = useState('')
  const [amenityInput, setAmenityInput] = useState('')
  const [galleryUrlInput, setGalleryUrlInput] = useState('')

  // Load existing property if editing
  useEffect(() => {
    if (!isEditing) return

    const loadProperty = async () => {
      try {
        setLoading(true)
        const res = await api.getAdminPropertyById(id)
        if (res.success && res.property) {
          const p = res.property
          setFormData({
            name: p.name || '',
            slug: p.slug || '',
            internalId: p.internalId || '',
            source: p.source || 'VIA_OTA',
            externalId: p.externalId || '',
            externalSyncStatus: p.externalSyncStatus || 'NOT_APPLICABLE',
            externalSyncNotes: p.externalSyncNotes || '',
            destination: p.destination || 'Agra',
            location: p.location || '',
            city: p.city || '',
            state: p.state || '',
            country: p.country || 'India',
            address: p.address || '',
            mapQuery: p.mapQuery || '',
            description: p.description || '',
            destinationDescription: p.destinationDescription || '',
            knowYourDestination: p.knowYourDestination || '',
            highlights: p.highlights || [],
            amenities: p.amenities || [],
            image: p.image || '',
            gallery: p.gallery || [],
            contactPhone: p.contactDetails?.phone || '',
            contactEmail: p.contactDetails?.email || '',
            contactWebsite: p.contactDetails?.website || '',
            status: p.status || 'draft',
            isActive: p.isActive !== undefined ? p.isActive : true,
            featured: Boolean(p.featured),
          })
        }
      } catch (err) {
        setError(err.message || 'Failed to load property details')
      } finally {
        setLoading(false)
      }
    }

    loadProperty()
  }, [id, isEditing])

  // Helper to auto-generate slug
  const handleAutoSlug = () => {
    if (!formData.name) return
    const generated = formData.name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '')
    setFormData((prev) => ({ ...prev, slug: generated }))
  }

  // Highlights handlers
  const handleAddHighlight = (e) => {
    e.preventDefault()
    if (!highlightInput.trim()) return
    setFormData((prev) => ({
      ...prev,
      highlights: [...prev.highlights, highlightInput.trim()],
    }))
    setHighlightInput('')
  }

  const handleRemoveHighlight = (index) => {
    setFormData((prev) => ({
      ...prev,
      highlights: prev.highlights.filter((_, i) => i !== index),
    }))
  }

  // Amenities handlers
  const handleAddAmenity = (amenity) => {
    const trimmed = amenity.trim()
    if (!trimmed || formData.amenities.includes(trimmed)) return
    setFormData((prev) => ({
      ...prev,
      amenities: [...prev.amenities, trimmed],
    }))
    setAmenityInput('')
  }

  const handleRemoveAmenity = (amenity) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.filter((a) => a !== amenity),
    }))
  }

  // Gallery URLs handlers
  const handleAddGalleryUrl = (e) => {
    e.preventDefault()
    if (!galleryUrlInput.trim()) return
    setFormData((prev) => ({
      ...prev,
      gallery: [...prev.gallery, galleryUrlInput.trim()],
    }))
    setGalleryUrlInput('')
  }

  const handleRemoveGalleryUrl = (index) => {
    setFormData((prev) => ({
      ...prev,
      gallery: prev.gallery.filter((_, i) => i !== index),
    }))
  }

  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setSuccessMessage(null)

    // Basic Validation
    if (!formData.name.trim()) {
      setError('Property name is required')
      return
    }
    if (!formData.location.trim()) {
      setError('Display location is required')
      return
    }
    if (!formData.description.trim()) {
      setError('Property description is required')
      return
    }
    if (!formData.image.trim()) {
      setError('Cover Image URL is required')
      return
    }

    setSubmitting(true)

    const payload = {
      ...formData,
      contactDetails: {
        phone: formData.contactPhone,
        email: formData.contactEmail,
        website: formData.contactWebsite,
      },
    }

    try {
      if (isEditing) {
        await api.updateProperty(id, payload)
        setSuccessMessage('Property updated successfully!')
      } else {
        await api.createProperty(payload)
        setSuccessMessage('Property created successfully!')
      }

      setTimeout(() => {
        navigate('/admin/properties')
      }, 1500)
    } catch (err) {
      setError(err.message || 'Failed to save property. Please check input values.')
    } finally {
      setSubmitting(false)
    }
  }

  // Enter inside a tag input adds the item instead of submitting the whole form
  const onEnter = (fn) => (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      fn(e)
    }
  }

  /* ------------------------------ loading ------------------------------ */
  if (loading) {
    return (
      <div className="mx-auto max-w-5xl space-y-5 pb-16" style={{ fontFamily: BODY_FONT }}>
        <style>{FONT_CSS}</style>
        <div className="h-24 animate-pulse rounded-2xl bg-stone-100" />
        {[0, 1, 2].map((n) => (
          <div key={n} className="h-56 animate-pulse rounded-2xl bg-stone-100" />
        ))}
        <p className="text-center text-sm font-medium text-stone-500">Loading property…</p>
      </div>
    )
  }

  const saveLabel = isEditing ? 'Save changes' : 'Create property'

  return (
    <div className="mx-auto max-w-5xl space-y-5 pb-16 text-[#101814]" style={{ fontFamily: BODY_FONT }}>
      <style>{FONT_CSS}</style>

      {/* ------------------------------ header ------------------------------ */}
      <header
        className={`${CARD} flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-7`}
        style={{ backgroundImage: 'linear-gradient(120deg, rgba(34,211,122,0.10), rgba(255,255,255,0) 55%)' }}
      >
        <div className="flex items-center gap-4">
          <Link
            to="/admin/properties"
            aria-label="Back to properties"
            className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-stone-200 bg-white text-stone-600 transition hover:bg-stone-50"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="min-w-0">
            <p className="text-sm font-medium text-stone-500">
              {isEditing ? 'Editing a listing' : 'New listing'}
            </p>
            <h1 className="mt-0.5 truncate text-2xl font-semibold tracking-tight sm:text-[1.75rem]" style={display}>
              {isEditing ? formData.name || 'Property' : 'Add a property'}
            </h1>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={submitting}
          className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:brightness-110 disabled:opacity-60"
          style={{ background: GREEN_DEEP }}
        >
          {submitting ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Saving…
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              {saveLabel}
            </>
          )}
        </button>
      </header>

      {/* ------------------------------ notices ------------------------------ */}
      {error && (
        <div role="alert" className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
          <span className="flex-1">{error}</span>
          <button
            type="button"
            onClick={() => setError(null)}
            aria-label="Dismiss"
            className="grid h-6 w-6 place-items-center rounded-lg text-red-500 hover:bg-red-100"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {successMessage && (
        <div role="status" className="flex items-center gap-2.5 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-medium text-emerald-900">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
          {successMessage} Taking you back to the list…
        </div>
      )}

      {/* ------------------------------ form ------------------------------ */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* 1. Basics */}
        <Section icon={Building2} title="Basic details" hint="The name and web address guests will see.">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div>
              <label htmlFor="f-name" className={LABEL}>
                Property name <Required />
              </label>
              <input
                id="f-name"
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Harbor Ridge Retreat"
                className={INPUT}
              />
            </div>

            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label htmlFor="f-slug" className="text-sm font-semibold text-stone-700">
                  Web address (slug) <Required />
                </label>
                <button
                  type="button"
                  onClick={handleAutoSlug}
                  className="text-xs font-semibold hover:underline"
                  style={{ color: GREEN_DEEP }}
                >
                  Create from name
                </button>
              </div>
              <input
                id="f-slug"
                type="text"
                required
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="harbor-ridge-retreat"
                className={INPUT}
              />
            </div>

            <div>
              <label htmlFor="f-internal" className={LABEL}>
                Internal property ID
              </label>
              <input
                id="f-internal"
                type="text"
                value={formData.internalId}
                onChange={(e) => setFormData({ ...formData, internalId: e.target.value.toUpperCase() })}
                placeholder="CHIS-PROP-1001"
                className={INPUT}
              />
              <span className={HINT}>Leave empty and we will create a unique ID for you.</span>
            </div>

            <div>
              <label htmlFor="f-destination" className={LABEL}>
                Destination group <Required />
              </label>
              <input
                id="f-destination"
                type="text"
                required
                value={formData.destination}
                onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                placeholder="Agra, Hawaii, California Coast, Colorado, Mexico"
                className={INPUT}
              />
              <span className={HINT}>Properties with the same group are listed together.</span>
            </div>
          </div>
        </Section>

        {/* 2. Channel */}
        <Section
          icon={Link2}
          title="Booking channel"
          hint="Which partner this property comes from, and its reference ID there."
        >
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            <div>
              <label htmlFor="f-source" className={LABEL}>
                Source channel <Required />
              </label>
              <select
                id="f-source"
                value={formData.source}
                onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                className={INPUT}
              >
                <option value="VIA_OTA">VIA OTA (direct contract)</option>
                <option value="VIA_OTA_EXCHANGE">VIA OTA Exchange (partner network)</option>
              </select>
            </div>

            <div>
              <label htmlFor="f-ext" className={LABEL}>
                External OTA property ID
              </label>
              <input
                id="f-ext"
                type="text"
                value={formData.externalId}
                onChange={(e) => setFormData({ ...formData, externalId: e.target.value })}
                placeholder="e.g. OTA-IND-AGR-001"
                className={INPUT}
              />
            </div>

            <div>
              <label htmlFor="f-sync" className={LABEL}>
                Sync status
              </label>
              <select
                id="f-sync"
                value={formData.externalSyncStatus}
                onChange={(e) => setFormData({ ...formData, externalSyncStatus: e.target.value })}
                className={INPUT}
              >
                <option value="NOT_APPLICABLE">Not applicable (standard)</option>
                <option value="PENDING">Pending</option>
                <option value="SYNCED">Synced</option>
                <option value="FAILED">Failed</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="f-notes" className={LABEL}>
              Internal notes
            </label>
            <input
              id="f-notes"
              type="text"
              value={formData.externalSyncNotes}
              onChange={(e) => setFormData({ ...formData, externalSyncNotes: e.target.value })}
              placeholder="e.g. Contract renewed for the 2026–2027 season"
              className={INPUT}
            />
            <span className={HINT}>Only admins can see this note.</span>
          </div>
        </Section>

        {/* 3. Location */}
        <Section icon={MapPin} title="Location" hint="Where guests will find the property.">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div className="md:col-span-2">
              <label htmlFor="f-location" className={LABEL}>
                Location shown to guests <Required />
              </label>
              <input
                id="f-location"
                type="text"
                required
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="54, Taj Road, Agra, Uttar Pradesh, India"
                className={INPUT}
              />
            </div>

            <div>
              <label htmlFor="f-city" className={LABEL}>
                City
              </label>
              <input
                id="f-city"
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder="Agra"
                className={INPUT}
              />
            </div>

            <div>
              <label htmlFor="f-state" className={LABEL}>
                State or province
              </label>
              <input
                id="f-state"
                type="text"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                placeholder="Uttar Pradesh"
                className={INPUT}
              />
            </div>

            <div>
              <label htmlFor="f-country" className={LABEL}>
                Country
              </label>
              <input
                id="f-country"
                type="text"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                placeholder="India"
                className={INPUT}
              />
            </div>

            <div>
              <label htmlFor="f-map" className={LABEL}>
                Map search text
              </label>
              <input
                id="f-map"
                type="text"
                value={formData.mapQuery}
                onChange={(e) => setFormData({ ...formData, mapQuery: e.target.value })}
                placeholder="Hotel Clarks Shiraz Agra India"
                className={INPUT}
              />
              <span className={HINT}>Used to place the pin on the Google map.</span>
            </div>
          </div>
        </Section>

        {/* 4. Content */}
        <Section icon={FileText} title="Description and features" hint="What makes this stay special.">
          <div>
            <label htmlFor="f-desc" className={LABEL}>
              Description <Required />
            </label>
            <textarea
              id="f-desc"
              rows={5}
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe the rooms, the setting, the views and the experience guests can expect."
              className={INPUT}
            />
          </div>

          {/* Highlights */}
          <div>
            <label htmlFor="f-highlight" className={LABEL}>
              Highlights
            </label>
            <div className="flex gap-2">
              <input
                id="f-highlight"
                type="text"
                value={highlightInput}
                onChange={(e) => setHighlightInput(e.target.value)}
                onKeyDown={onEnter(handleAddHighlight)}
                placeholder="e.g. Rooftop dining with Taj Mahal view"
                className={`${INPUT} flex-1`}
              />
              <button
                type="button"
                onClick={handleAddHighlight}
                className="inline-flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition hover:brightness-110"
                style={{ background: GREEN_DEEP }}
              >
                <Plus className="h-4 w-4" />
                Add
              </button>
            </div>
            <span className={HINT}>Shown on the resort page. Press Enter to add.</span>

            {formData.highlights.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {formData.highlights.map((h, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 py-1 pl-3 pr-1.5 text-sm font-medium text-emerald-900"
                  >
                    <Check className="h-3.5 w-3.5 text-emerald-600" />
                    {h}
                    <button
                      type="button"
                      onClick={() => handleRemoveHighlight(i)}
                      aria-label={`Remove ${h}`}
                      className="grid h-5 w-5 place-items-center rounded-full text-emerald-700 hover:bg-emerald-100"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Amenities */}
          <div>
            <span className={LABEL}>Amenities</span>
            <div className="flex flex-wrap gap-2">
              {COMMON_AMENITIES.map((amenity) => {
                const isSelected = formData.amenities.includes(amenity)
                return (
                  <button
                    type="button"
                    key={amenity}
                    aria-pressed={isSelected}
                    onClick={() => (isSelected ? handleRemoveAmenity(amenity) : handleAddAmenity(amenity))}
                    className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium transition ${isSelected
                        ? 'border-transparent text-white'
                        : 'border-stone-200 bg-white text-stone-600 hover:border-stone-300 hover:bg-stone-50'
                      }`}
                    style={isSelected ? { background: GREEN_DEEP } : undefined}
                  >
                    {isSelected ? <Check className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
                    {amenity}
                  </button>
                )
              })}
            </div>

            {/* custom amenities already added (not in the quick list) */}
            {formData.amenities.filter((a) => !COMMON_AMENITIES.includes(a)).length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {formData.amenities
                  .filter((a) => !COMMON_AMENITIES.includes(a))
                  .map((a) => (
                    <span
                      key={a}
                      className="inline-flex items-center gap-1.5 rounded-full py-1 pl-3.5 pr-1.5 text-sm font-medium text-white"
                      style={{ background: GREEN_DEEP }}
                    >
                      {a}
                      <button
                        type="button"
                        onClick={() => handleRemoveAmenity(a)}
                        aria-label={`Remove ${a}`}
                        className="grid h-5 w-5 place-items-center rounded-full hover:bg-white/20"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </span>
                  ))}
              </div>
            )}

            <div className="mt-4 flex gap-2">
              <input
                type="text"
                value={amenityInput}
                onChange={(e) => setAmenityInput(e.target.value)}
                onKeyDown={onEnter(() => handleAddAmenity(amenityInput))}
                placeholder="Not in the list? Type your own"
                aria-label="Custom amenity"
                className={`${INPUT} flex-1`}
              />
              <button
                type="button"
                onClick={() => handleAddAmenity(amenityInput)}
                className="rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm font-semibold text-stone-700 transition hover:bg-stone-50"
              >
                Add custom
              </button>
            </div>
          </div>
        </Section>

        {/* 5. Photos */}
        <Section icon={ImageIcon} title="Photos" hint="Paste image links. The cover photo is the main picture.">
          <div>
            <label htmlFor="f-cover" className={LABEL}>
              Cover image link <Required />
            </label>
            <input
              id="f-cover"
              type="url"
              required
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              placeholder="https://images.unsplash.com/photo-1564507592333-c60657eea523"
              className={INPUT}
            />
            <span className={HINT}>Use a direct link that starts with http or https.</span>

            {formData.image && (
              <div className="mt-4 h-48 max-w-lg overflow-hidden rounded-xl border border-stone-200 bg-stone-100 sm:h-64">
                <img
                  src={formData.image}
                  alt="Cover preview"
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none'
                  }}
                />
              </div>
            )}
          </div>

          <div>
            <label htmlFor="f-gallery" className={LABEL}>
              Gallery images
            </label>
            <div className="flex gap-2">
              <input
                id="f-gallery"
                type="url"
                value={galleryUrlInput}
                onChange={(e) => setGalleryUrlInput(e.target.value)}
                onKeyDown={onEnter(handleAddGalleryUrl)}
                placeholder="https://images.unsplash.com/photo-..."
                className={`${INPUT} flex-1`}
              />
              <button
                type="button"
                onClick={handleAddGalleryUrl}
                className="inline-flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition hover:brightness-110"
                style={{ background: GREEN_DEEP }}
              >
                <Plus className="h-4 w-4" />
                Add image
              </button>
            </div>

            {formData.gallery.length > 0 && (
              <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
                {formData.gallery.map((url, i) => (
                  <div
                    key={i}
                    className="group relative h-28 overflow-hidden rounded-xl border border-stone-200 bg-stone-100"
                  >
                    <img src={url} alt={`Gallery item ${i + 1}`} className="h-full w-full object-cover" />
                    <button
                      type="button"
                      onClick={() => handleRemoveGalleryUrl(i)}
                      className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-lg bg-black/60 text-white transition hover:bg-red-600"
                      title="Remove image"
                      aria-label={`Remove gallery image ${i + 1}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Section>

        {/* 6. Publishing + contact */}
        <Section icon={Settings2} title="Publishing and contact" hint="Decide who can see this property and how guests reach it.">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            <div>
              <label htmlFor="f-status" className={LABEL}>
                Status <Required />
              </label>
              <select
                id="f-status"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className={INPUT}
              >
                <option value="draft">Draft (private)</option>
                <option value="published">Published (live to guests)</option>
                <option value="archived">Archived (retired)</option>
              </select>
            </div>

            <Switch
              checked={formData.isActive}
              onChange={(v) => setFormData({ ...formData, isActive: v })}
              label="Active"
              hint="Available in API queries"
            />

            <Switch
              checked={formData.featured}
              onChange={(v) => setFormData({ ...formData, featured: v })}
              label="Featured resort"
              hint="Shown on the homepage"
            />
          </div>

          <div className="grid grid-cols-1 gap-5 border-t border-stone-100 pt-6 md:grid-cols-3">
            <div>
              <label htmlFor="f-phone" className={LABEL}>
                Phone
              </label>
              <input
                id="f-phone"
                type="text"
                value={formData.contactPhone}
                onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                placeholder="+91-562-2251456"
                className={INPUT}
              />
            </div>

            <div>
              <label htmlFor="f-email" className={LABEL}>
                Email
              </label>
              <input
                id="f-email"
                type="email"
                value={formData.contactEmail}
                onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                placeholder="reservations@grandimperial.com"
                className={INPUT}
              />
            </div>

            <div>
              <label htmlFor="f-web" className={LABEL}>
                Resort website
              </label>
              <input
                id="f-web"
                type="url"
                value={formData.contactWebsite}
                onChange={(e) => setFormData({ ...formData, contactWebsite: e.target.value })}
                placeholder="https://countryholidaysinnsuites.com"
                className={INPUT}
              />
            </div>
          </div>
        </Section>

        {/* sticky action bar */}
        <div className="sticky bottom-4 z-10 flex items-center justify-between gap-4 rounded-2xl border border-stone-200 bg-white/95 px-5 py-3.5 shadow-[0_10px_30px_rgba(12,59,39,0.12)] backdrop-blur">
          <p className="hidden text-sm text-stone-500 sm:block">
            Fields marked <span className="text-red-500">*</span> are required.
          </p>
          <div className="ml-auto flex items-center gap-3">
            <Link
              to="/admin/properties"
              className="rounded-xl border border-stone-200 px-5 py-2.5 text-sm font-semibold text-stone-600 transition hover:bg-stone-50"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:brightness-110 disabled:opacity-60"
              style={{ background: GREEN_DEEP }}
            >
              {submitting ? 'Saving…' : isEditing ? 'Update property' : 'Create property'}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}