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
  HelpCircle,
} from 'lucide-react'

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

  if (loading) {
    return (
      <div className="py-24 text-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#ff5938] border-t-transparent mx-auto mb-4" />
        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Loading Property Record...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm">
        <div className="flex items-center gap-4">
          <Link
            to="/admin/properties"
            className="h-10 w-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition shrink-0"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#ff5938]">
              {isEditing ? 'Modify Listing' : 'New Resort Registration'}
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
              {isEditing ? `Edit: ${formData.name || 'Property'}` : 'Add New Property'}
            </h2>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#ff5938] hover:bg-[#e84a28] text-xs font-bold uppercase tracking-[0.16em] text-white transition shadow-md shadow-[#ff5938]/20 disabled:opacity-50"
        >
          {submitting ? (
            <>
              <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              <span>{isEditing ? 'Save Changes' : 'Create Property'}</span>
            </>
          )}
        </button>
      </div>

      {/* Notifications */}
      {error && (
        <div className="rounded-2xl bg-red-500/10 border border-red-500/20 p-4 text-xs text-red-700 flex items-start gap-3">
          <AlertCircle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {successMessage && (
        <div className="rounded-2xl bg-emerald-500/10 border border-emerald-500/20 p-4 text-xs font-medium text-emerald-800">
          ✓ {successMessage}
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* SECTION 1: Core Details */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <Building2 className="h-5 w-5 text-[#ff5938]" />
            <h3 className="font-display font-bold text-base text-slate-900">
              1. Primary Identification
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Property Name */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-[0.16em] text-slate-600 mb-2">
                Property Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Harbor Ridge Retreat"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 py-3 px-4 text-sm text-slate-800 outline-none transition focus:border-[#ff5938] focus:bg-white"
              />
            </div>

            {/* Slug with Auto-generate */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-semibold uppercase tracking-[0.16em] text-slate-600">
                  Unique URL Slug *
                </label>
                <button
                  type="button"
                  onClick={handleAutoSlug}
                  className="text-xs text-[#ff5938] hover:underline font-medium"
                >
                  Generate from Name
                </button>
              </div>
              <input
                type="text"
                required
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="harbor-ridge-retreat"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 py-3 px-4 text-sm font-mono text-slate-800 outline-none transition focus:border-[#ff5938] focus:bg-white"
              />
            </div>

            {/* Internal Property ID */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-[0.16em] text-slate-600 mb-2">
                Internal Property ID (Auto or Custom)
              </label>
              <input
                type="text"
                value={formData.internalId}
                onChange={(e) => setFormData({ ...formData, internalId: e.target.value.toUpperCase() })}
                placeholder="CHIS-PROP-1001"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 py-3 px-4 text-sm font-mono text-slate-800 outline-none transition focus:border-[#ff5938] focus:bg-white"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                Leave blank to auto-generate a unique system ID.
              </span>
            </div>

            {/* Destination Region */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-[0.16em] text-slate-600 mb-2">
                Destination Group *
              </label>
              <input
                type="text"
                required
                value={formData.destination}
                onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                placeholder="Agra, Hawaii, California Coast, Colorado, Mexico"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 py-3 px-4 text-sm text-slate-800 outline-none transition focus:border-[#ff5938] focus:bg-white"
              />
            </div>
          </div>
        </div>

        {/* SECTION 2: OTA Source Channel & External Mapping */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <HelpCircle className="h-5 w-5 text-[#ff5938]" />
            <div>
              <h3 className="font-display font-bold text-base text-slate-900">
                2. OTA Channel & External Mapping
              </h3>
              <p className="text-[11px] text-slate-400">
                Configure carrier label source and external OTA reference IDs.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Source Selection */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-[0.16em] text-slate-600 mb-2">
                Property Source Channel *
              </label>
              <select
                value={formData.source}
                onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 py-3 px-4 text-sm font-semibold text-slate-800 outline-none focus:border-[#ff5938] focus:bg-white"
              >
                <option value="VIA_OTA">VIA OTA (Direct Contract)</option>
                <option value="VIA_OTA_EXCHANGE">VIA OTA EXCHANGE (Partner Network)</option>
              </select>
            </div>

            {/* External Property ID */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-[0.16em] text-slate-600 mb-2">
                External OTA Property ID
              </label>
              <input
                type="text"
                value={formData.externalId}
                onChange={(e) => setFormData({ ...formData, externalId: e.target.value })}
                placeholder="e.g. OTA-IND-AGR-001"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 py-3 px-4 text-sm font-mono text-slate-800 outline-none transition focus:border-[#ff5938] focus:bg-white"
              />
            </div>

            {/* External Sync Status */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-[0.16em] text-slate-600 mb-2">
                External Sync Status
              </label>
              <select
                value={formData.externalSyncStatus}
                onChange={(e) => setFormData({ ...formData, externalSyncStatus: e.target.value })}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 py-3 px-4 text-sm text-slate-800 outline-none focus:border-[#ff5938] focus:bg-white"
              >
                <option value="NOT_APPLICABLE">NOT_APPLICABLE (Standard)</option>
                <option value="PENDING">PENDING</option>
                <option value="SYNCED">SYNCED</option>
                <option value="FAILED">FAILED</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-[0.16em] text-slate-600 mb-2">
              Carrier Sync Notes (Internal Admin Record)
            </label>
            <input
              type="text"
              value={formData.externalSyncNotes}
              onChange={(e) => setFormData({ ...formData, externalSyncNotes: e.target.value })}
              placeholder="e.g. Contract renewed for 2026-2027 season; mapped to central inventory."
              className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 py-3 px-4 text-sm text-slate-800 outline-none transition focus:border-[#ff5938] focus:bg-white"
            />
          </div>
        </div>

        {/* SECTION 3: Location Details */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <Building2 className="h-5 w-5 text-[#ff5938]" />
            <h3 className="font-display font-bold text-base text-slate-900">
              3. Location & Address
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold uppercase tracking-[0.16em] text-slate-600 mb-2">
                Display Location Header *
              </label>
              <input
                type="text"
                required
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="54, Taj Road, Agra, Uttar Pradesh, India"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 py-3 px-4 text-sm text-slate-800 outline-none transition focus:border-[#ff5938] focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-[0.16em] text-slate-600 mb-2">
                City
              </label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder="Agra"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 py-3 px-4 text-sm text-slate-800 outline-none transition focus:border-[#ff5938] focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-[0.16em] text-slate-600 mb-2">
                State / Province
              </label>
              <input
                type="text"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                placeholder="Uttar Pradesh"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 py-3 px-4 text-sm text-slate-800 outline-none transition focus:border-[#ff5938] focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-[0.16em] text-slate-600 mb-2">
                Country
              </label>
              <input
                type="text"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                placeholder="India"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 py-3 px-4 text-sm text-slate-800 outline-none transition focus:border-[#ff5938] focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-[0.16em] text-slate-600 mb-2">
                Google Maps Embed Query
              </label>
              <input
                type="text"
                value={formData.mapQuery}
                onChange={(e) => setFormData({ ...formData, mapQuery: e.target.value })}
                placeholder="Hotel Clarks Shiraz Agra India"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 py-3 px-4 text-sm text-slate-800 outline-none transition focus:border-[#ff5938] focus:bg-white"
              />
            </div>
          </div>
        </div>

        {/* SECTION 4: Descriptions & Highlights */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <Building2 className="h-5 w-5 text-[#ff5938]" />
            <h3 className="font-display font-bold text-base text-slate-900">
              4. Descriptions & Highlights
            </h3>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-[0.16em] text-slate-600 mb-2">
              Property Description *
            </label>
            <textarea
              rows={4}
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Detailed description of rooms, architectural highlights, scenery and hospitality experience..."
              className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 py-3 px-4 text-sm text-slate-800 outline-none transition focus:border-[#ff5938] focus:bg-white"
            />
          </div>

          {/* Highlights Tag Manager */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-[0.16em] text-slate-600 mb-2">
              Highlights (Displayed on Resort Detail Page)
            </label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={highlightInput}
                onChange={(e) => setHighlightInput(e.target.value)}
                placeholder="e.g. Rooftop Taj Mahal view dining"
                className="flex-1 rounded-2xl border border-slate-200 bg-slate-50/50 py-2.5 px-4 text-sm text-slate-800 outline-none focus:border-[#ff5938] focus:bg-white"
              />
              <button
                type="button"
                onClick={handleAddHighlight}
                className="px-5 py-2.5 rounded-full bg-slate-900 text-white text-xs font-bold uppercase tracking-wider hover:bg-slate-800 transition"
              >
                Add Highlight
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {formData.highlights.map((h, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 text-slate-800 text-xs font-medium border border-slate-200"
                >
                  <Check className="h-3 w-3 text-[#ff5938]" />
                  <span>{h}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveHighlight(i)}
                    className="ml-1 text-slate-400 hover:text-red-500"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Amenities Selector */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-[0.16em] text-slate-600 mb-2">
              Select Amenities
            </label>
            <div className="flex flex-wrap gap-2 mb-3">
              {COMMON_AMENITIES.map((amenity) => {
                const isSelected = formData.amenities.includes(amenity)
                return (
                  <button
                    type="button"
                    key={amenity}
                    onClick={() =>
                      isSelected ? handleRemoveAmenity(amenity) : handleAddAmenity(amenity)
                    }
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition border ${
                      isSelected
                        ? 'bg-[#ff5938] text-white border-[#ff5938]'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {isSelected ? `✓ ${amenity}` : `+ ${amenity}`}
                  </button>
                )
              })}
            </div>

            {/* Custom Amenity Adder */}
            <div className="flex gap-2">
              <input
                type="text"
                value={amenityInput}
                onChange={(e) => setAmenityInput(e.target.value)}
                placeholder="Or type a custom amenity..."
                className="flex-1 rounded-2xl border border-slate-200 bg-slate-50/50 py-2.5 px-4 text-xs text-slate-800 outline-none focus:border-[#ff5938] focus:bg-white"
              />
              <button
                type="button"
                onClick={() => handleAddAmenity(amenityInput)}
                className="px-4 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition"
              >
                Add Custom
              </button>
            </div>
          </div>
        </div>

        {/* SECTION 5: Media & Gallery */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <ImageIcon className="h-5 w-5 text-[#ff5938]" />
            <h3 className="font-display font-bold text-base text-slate-900">
              5. Image Gallery & Cover Photo
            </h3>
          </div>

          {/* Cover Image URL */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-[0.16em] text-slate-600 mb-2">
              Cover Image URL (Direct HTTP/HTTPS Link) *
            </label>
            <input
              type="url"
              required
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              placeholder="https://images.unsplash.com/photo-1564507592333-c60657eea523"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 py-3 px-4 text-sm text-slate-800 outline-none transition focus:border-[#ff5938] focus:bg-white"
            />

            {/* Live Cover Preview */}
            {formData.image && (
              <div className="mt-4">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                  Cover Photo Preview:
                </span>
                <div className="h-48 sm:h-64 rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 max-w-lg">
                  <img
                    src={formData.image}
                    alt="Cover preview"
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none'
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Gallery URLs */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-[0.16em] text-slate-600 mb-2">
              Add Gallery Image URLs
            </label>
            <div className="flex gap-2 mb-4">
              <input
                type="url"
                value={galleryUrlInput}
                onChange={(e) => setGalleryUrlInput(e.target.value)}
                placeholder="https://images.unsplash.com/photo-..."
                className="flex-1 rounded-2xl border border-slate-200 bg-slate-50/50 py-2.5 px-4 text-xs text-slate-800 outline-none focus:border-[#ff5938] focus:bg-white"
              />
              <button
                type="button"
                onClick={handleAddGalleryUrl}
                className="px-5 py-2.5 rounded-full bg-slate-900 text-white text-xs font-bold uppercase tracking-wider hover:bg-slate-800 transition flex items-center gap-1.5"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add Image</span>
              </button>
            </div>

            {/* Gallery Grid Preview */}
            {formData.gallery.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {formData.gallery.map((url, i) => (
                  <div
                    key={i}
                    className="relative group h-28 rounded-2xl overflow-hidden border border-slate-200 bg-slate-100"
                  >
                    <img src={url} alt={`Gallery item ${i}`} className="h-full w-full object-cover" />
                    <button
                      type="button"
                      onClick={() => handleRemoveGalleryUrl(i)}
                      className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 text-white hover:bg-red-600 transition"
                      title="Remove image"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* SECTION 6: Status & Controls */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <Building2 className="h-5 w-5 text-[#ff5938]" />
            <h3 className="font-display font-bold text-base text-slate-900">
              6. Publication Controls & Contact
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Status */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-[0.16em] text-slate-600 mb-2">
                Publication Status *
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 py-3 px-4 text-sm font-bold uppercase tracking-wider text-slate-800 outline-none focus:border-[#ff5938] focus:bg-white"
              >
                <option value="draft">Draft (Private)</option>
                <option value="published">Published (Live to Guests)</option>
                <option value="archived">Archived (Retired)</option>
              </select>
            </div>

            {/* Active Toggle */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
              <div>
                <span className="text-xs font-bold text-slate-800 block">Active Status</span>
                <span className="text-[11px] text-slate-400">Available on API queries</span>
              </div>
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="h-5 w-5 rounded text-[#ff5938] focus:ring-[#ff5938]"
              />
            </div>

            {/* Featured Toggle */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
              <div>
                <span className="text-xs font-bold text-slate-800 block">Featured Resort</span>
                <span className="text-[11px] text-slate-400">Showcases on homepage</span>
              </div>
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="h-5 w-5 rounded text-[#ff5938] focus:ring-[#ff5938]"
              />
            </div>
          </div>

          {/* Contact Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-4 border-t border-slate-100">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-[0.16em] text-slate-600 mb-2">
                Contact Phone
              </label>
              <input
                type="text"
                value={formData.contactPhone}
                onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                placeholder="+91-562-2251456"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 py-2.5 px-4 text-xs text-slate-800 outline-none focus:border-[#ff5938] focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-[0.16em] text-slate-600 mb-2">
                Contact Email
              </label>
              <input
                type="email"
                value={formData.contactEmail}
                onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                placeholder="reservations@grandimperial.com"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 py-2.5 px-4 text-xs text-slate-800 outline-none focus:border-[#ff5938] focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-[0.16em] text-slate-600 mb-2">
                Resort Website
              </label>
              <input
                type="url"
                value={formData.contactWebsite}
                onChange={(e) => setFormData({ ...formData, contactWebsite: e.target.value })}
                placeholder="https://countryholidaysinnsuites.com"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 py-2.5 px-4 text-xs text-slate-800 outline-none focus:border-[#ff5938] focus:bg-white"
              />
            </div>
          </div>
        </div>

        {/* Action Button Bar */}
        <div className="flex items-center justify-end gap-4 pt-4">
          <Link
            to="/admin/properties"
            className="px-6 py-3 rounded-full border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-[#ff5938] hover:bg-[#e84a28] text-xs font-bold uppercase tracking-[0.16em] text-white transition shadow-lg shadow-[#ff5938]/20 disabled:opacity-50"
          >
            {submitting ? 'Saving Property...' : isEditing ? 'Update Property Record' : 'Publish Property'}
          </button>
        </div>
      </form>
    </div>
  )
}
