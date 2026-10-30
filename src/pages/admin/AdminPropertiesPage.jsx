import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import AdminPropertyModal from './AdminPropertyModal'
import {
  Search,
  PlusCircle,
  Eye,
  Pencil,
  Archive,
  Trash2,
  RefreshCw,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Globe,
  Share2,
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  Building2,
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
const CONTROL =
  'rounded-xl border border-stone-200 bg-white text-sm text-stone-800 outline-none transition focus:border-[#22d37a] focus:ring-2 focus:ring-[#22d37a]/25'

const STATUS_STYLES = {
  published: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  draft: 'bg-amber-50 text-amber-800 border-amber-200',
  archived: 'bg-stone-100 text-stone-600 border-stone-200',
}

export default function AdminPropertiesPage() {
  const { isSuperAdmin } = useAuth()

  const [properties, setProperties] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [actionMessage, setActionMessage] = useState(null)

  // Filters
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [sourceFilter, setSourceFilter] = useState('All')
  const [destinationFilter, setDestinationFilter] = useState('All')

  // Selected property for view modal
  const [selectedProperty, setSelectedProperty] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Confirmation modal state for archive / delete
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    property: null,
    isPermanent: false,
    loading: false,
  })

  const fetchProperties = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await api.getAdminProperties({
        page,
        limit: 10,
        search,
        status: statusFilter,
        source: sourceFilter,
        destination: destinationFilter,
      })

      if (res.success) {
        setProperties(res.properties || [])
        setTotal(res.total || 0)
        setTotalPages(res.totalPages || 1)
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch properties')
    } finally {
      setLoading(false)
    }
  }, [page, search, statusFilter, sourceFilter, destinationFilter])

  useEffect(() => {
    fetchProperties()
  }, [fetchProperties])

  // Handle status quick change
  const handleStatusChange = async (propertyId, newStatus) => {
    try {
      const res = await api.updatePropertyStatus(propertyId, { status: newStatus })
      if (res.success) {
        setActionMessage(`Property status changed to ${newStatus}`)
        setTimeout(() => setActionMessage(null), 3500)
        fetchProperties()
      }
    } catch (err) {
      setError(err.message || 'Failed to update property status')
    }
  }

  // Handle active/inactive toggle
  const handleToggleActive = async (property) => {
    try {
      const res = await api.updatePropertyStatus(property._id || property.id, {
        isActive: !property.isActive,
      })
      if (res.success) {
        setActionMessage(
          `Property ${!property.isActive ? 'activated' : 'deactivated'} successfully`
        )
        setTimeout(() => setActionMessage(null), 3500)
        fetchProperties()
      }
    } catch (err) {
      setError(err.message || 'Failed to toggle active status')
    }
  }

  // Handle safe archive or permanent delete
  const handleConfirmAction = async () => {
    const { property, isPermanent } = confirmDialog
    if (!property) return

    setConfirmDialog((prev) => ({ ...prev, loading: true }))
    try {
      const propertyId = property._id || property.id
      const res = await api.archiveOrDeleteProperty(propertyId, isPermanent)
      if (res.success) {
        setActionMessage(res.message)
        setTimeout(() => setActionMessage(null), 4000)
        setConfirmDialog({ isOpen: false, property: null, isPermanent: false, loading: false })
        fetchProperties()
      }
    } catch (err) {
      setError(err.message || 'Action failed')
      setConfirmDialog((prev) => ({ ...prev, loading: false }))
    }
  }

  // Open view modal
  const handleOpenView = (property) => {
    setSelectedProperty(property)
    setIsModalOpen(true)
  }

  const hasFilters =
    search !== '' || statusFilter !== 'All' || sourceFilter !== 'All' || destinationFilter !== 'All'

  const resetFilters = () => {
    setSearch('')
    setStatusFilter('All')
    setSourceFilter('All')
    setDestinationFilter('All')
    setPage(1)
  }

  return (
    <div className="space-y-5 pb-12 text-[#101814]" style={{ fontFamily: BODY_FONT }}>
      <style>{FONT_CSS}</style>

      {/* ------------------------------ header ------------------------------ */}
      <header
        className={`${CARD} flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-7`}
        style={{ backgroundImage: 'linear-gradient(120deg, rgba(34,211,122,0.10), rgba(255,255,255,0) 55%)' }}
      >
        <div>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-[1.9rem]" style={display}>
            Resorts & properties
          </h1>
          <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-stone-600">
            Search, filter and edit your listings. Change a status, switch a property on or off, or archive it.
          </p>
          <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-stone-700 ring-1 ring-stone-200">
            <Building2 className="h-3.5 w-3.5 text-emerald-700" />
            {total} {total === 1 ? 'property' : 'properties'}
            {hasFilters ? ' match your filters' : ' in total'}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => fetchProperties()}
            className="grid h-10 w-10 place-items-center rounded-xl border border-stone-200 bg-white text-stone-600 transition hover:bg-stone-50"
            title="Refresh list"
            aria-label="Refresh list"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin text-[#22d37a]' : ''}`} />
          </button>
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

      {/* ------------------------------ notices ------------------------------ */}
      {actionMessage && (
        <div
          role="status"
          className="flex items-center gap-2.5 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-medium text-emerald-900 animate-fadeIn"
        >
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
          {actionMessage}
        </div>
      )}

      {error && (
        <div
          role="alert"
          className="flex items-center gap-2.5 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800"
        >
          <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
          <span className="flex-1">{error}</span>
          <button
            type="button"
            onClick={() => setError(null)}
            aria-label="Dismiss"
            className="grid h-7 w-7 place-items-center rounded-lg text-red-500 hover:bg-red-100"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* ------------------------------ filters ------------------------------ */}
      <section className={`${CARD} space-y-4 p-5`}>
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <label htmlFor="prop-search" className="sr-only">
              Search properties
            </label>
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
            <input
              id="prop-search"
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setPage(1)
              }}
              placeholder="Search by name, slug, ID, destination or location"
              className={`${CONTROL} h-11 w-full pl-10 pr-10 placeholder:text-stone-400`}
            />
            {search && (
              <button
                type="button"
                onClick={() => {
                  setSearch('')
                  setPage(1)
                }}
                aria-label="Clear search"
                className="absolute right-2 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-lg text-stone-400 hover:bg-stone-100 hover:text-stone-700"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              aria-label="Filter by source"
              value={sourceFilter}
              onChange={(e) => {
                setSourceFilter(e.target.value)
                setPage(1)
              }}
              className={`${CONTROL} h-11 px-3.5 font-medium`}
            >
              <option value="All">All sources</option>
              <option value="VIA_OTA">VIA OTA</option>
              <option value="VIA_OTA_EXCHANGE">VIA OTA Exchange</option>
            </select>

            <select
              aria-label="Filter by destination"
              value={destinationFilter}
              onChange={(e) => {
                setDestinationFilter(e.target.value)
                setPage(1)
              }}
              className={`${CONTROL} h-11 px-3.5 font-medium`}
            >
              <option value="All">All destinations</option>
              <option value="Agra">Agra</option>
              <option value="Hawaii">Hawaii</option>
              <option value="California Coast">California Coast</option>
              <option value="Colorado">Colorado</option>
              <option value="Mexico">Mexico</option>
            </select>

            {hasFilters && (
              <button
                type="button"
                onClick={resetFilters}
                className="inline-flex h-11 items-center gap-1.5 rounded-xl px-3 text-sm font-semibold hover:bg-stone-100"
                style={{ color: GREEN_DEEP }}
              >
                <X className="h-4 w-4" />
                Clear filters
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 border-t border-stone-100 pt-4">
          <span className="mr-1 text-sm font-medium text-stone-500">Status</span>
          {['All', 'published', 'draft', 'archived'].map((st) => {
            const on = statusFilter === st
            return (
              <button
                key={st}
                type="button"
                aria-pressed={on}
                onClick={() => {
                  setStatusFilter(st)
                  setPage(1)
                }}
                className={`rounded-full px-4 py-1.5 text-sm font-semibold capitalize transition ${on ? 'text-white shadow-sm' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                style={on ? { background: GREEN_DEEP } : undefined}
              >
                {st === 'All' ? 'All properties' : st}
              </button>
            )
          })}
        </div>
      </section>

      {/* ------------------------------ table ------------------------------ */}
      <section className={`${CARD} overflow-hidden`}>
        {loading ? (
          <div className="divide-y divide-stone-100" aria-busy="true">
            {[0, 1, 2, 3, 4].map((n) => (
              <div key={n} className="flex items-center gap-4 px-5 py-4">
                <div className="h-12 w-16 animate-pulse rounded-xl bg-stone-100" />
                <div className="flex-1 space-y-2">
                  <div className="h-3.5 w-1/3 animate-pulse rounded bg-stone-100" />
                  <div className="h-3 w-1/5 animate-pulse rounded bg-stone-100" />
                </div>
                <div className="hidden h-6 w-24 animate-pulse rounded-full bg-stone-100 sm:block" />
                <div className="h-6 w-20 animate-pulse rounded-full bg-stone-100" />
              </div>
            ))}
            <p className="py-4 text-center text-sm font-medium text-stone-500">Loading properties…</p>
          </div>
        ) : properties.length === 0 ? (
          <div className="flex flex-col items-center px-6 py-16 text-center">
            <span className="grid h-14 w-14 place-items-center rounded-2xl bg-stone-100">
              <Building2 className="h-6 w-6 text-stone-400" />
            </span>
            <h3 className="mt-4 text-lg font-semibold text-stone-900" style={display}>
              No properties found
            </h3>
            <p className="mt-1 max-w-sm text-sm text-stone-500">
              Nothing matches your current search and filters. Try different words or clear the filters.
            </p>
            <button
              type="button"
              onClick={resetFilters}
              className="mt-5 rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition hover:brightness-110"
              style={{ background: GREEN_DEEP }}
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[920px] text-left text-sm">
              <thead className="border-b border-stone-200 bg-stone-50 text-xs text-stone-500">
                <tr>
                  <th className="px-5 py-3 font-semibold">Property</th>
                  <th className="px-4 py-3 font-semibold">IDs</th>
                  <th className="px-4 py-3 font-semibold">Source</th>
                  <th className="px-4 py-3 font-semibold">Location</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">Visible</th>
                  <th className="px-5 py-3 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {properties.map((property) => {
                  const propertyId = property._id || property.id
                  return (
                    <tr key={property.slug || propertyId} className="transition-colors hover:bg-stone-50/80">
                      {/* Property */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3.5">
                          <img
                            src={property.image}
                            alt={property.name}
                            className="h-12 w-16 shrink-0 rounded-xl border border-stone-200 bg-stone-100 object-cover"
                          />
                          <div className="min-w-0">
                            <span className="block max-w-[220px] truncate font-semibold text-stone-900">
                              {property.name}
                            </span>
                            <span className="block max-w-[220px] truncate text-xs text-stone-400">
                              /{property.slug}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* IDs */}
                      <td className="px-4 py-3.5">
                        <span className="inline-block rounded-md border border-stone-200 bg-stone-100 px-2 py-0.5 text-xs font-semibold text-stone-700">
                          {property.internalId || 'PENDING'}
                        </span>
                        <p className="mt-1 text-xs text-stone-500">
                          {property.externalId ? `Ext: ${property.externalId}` : <span className="italic text-stone-400">No external ID</span>}
                        </p>
                      </td>

                      {/* Source */}
                      <td className="px-4 py-3.5">
                        {property.source === 'VIA_OTA' ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-800">
                            <Globe className="h-3.5 w-3.5" />
                            VIA OTA
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-200 bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-800">
                            <Share2 className="h-3.5 w-3.5" />
                            VIA OTA Exchange
                          </span>
                        )}
                      </td>

                      {/* Location */}
                      <td className="px-4 py-3.5">
                        <span className="block font-semibold text-stone-800">{property.destination}</span>
                        <span className="mt-0.5 flex max-w-[180px] items-center gap-1 truncate text-xs text-stone-500">
                          <MapPin className="h-3.5 w-3.5 shrink-0 text-emerald-600" />
                          {property.location}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3.5">
                        <select
                          aria-label={`Status for ${property.name}`}
                          value={property.status}
                          onChange={(e) => handleStatusChange(propertyId, e.target.value)}
                          className={`cursor-pointer rounded-full border px-3 py-1 text-xs font-semibold outline-none focus:ring-2 focus:ring-[#22d37a]/30 ${STATUS_STYLES[property.status] || STATUS_STYLES.archived
                            }`}
                        >
                          <option value="published">Published</option>
                          <option value="draft">Draft</option>
                          <option value="archived">Archived</option>
                        </select>
                      </td>

                      {/* Active toggle */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <button
                            type="button"
                            role="switch"
                            aria-checked={!!property.isActive}
                            onClick={() => handleToggleActive(property)}
                            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#22d37a]/50 ${property.isActive ? 'bg-[#22d37a]' : 'bg-stone-300'
                              }`}
                            aria-label={`Toggle active status for ${property.name}`}
                          >
                            <span
                              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ${property.isActive ? 'translate-x-5' : 'translate-x-0'
                                }`}
                            />
                          </button>
                          <span className="text-xs font-medium text-stone-500">
                            {property.isActive ? 'On' : 'Off'}
                          </span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => handleOpenView(property)}
                            className="grid h-9 w-9 place-items-center rounded-lg text-stone-500 transition hover:bg-stone-100 hover:text-stone-900"
                            title="Quick view"
                            aria-label={`Quick view ${property.name}`}
                          >
                            <Eye className="h-4 w-4" />
                          </button>

                          <Link
                            to={`/admin/properties/${propertyId}/edit`}
                            className="grid h-9 w-9 place-items-center rounded-lg text-stone-500 transition hover:bg-emerald-50 hover:text-emerald-800"
                            title="Edit property"
                            aria-label={`Edit ${property.name}`}
                          >
                            <Pencil className="h-4 w-4" />
                          </Link>

                          <button
                            type="button"
                            onClick={() =>
                              setConfirmDialog({
                                isOpen: true,
                                property,
                                isPermanent: false,
                                loading: false,
                              })
                            }
                            className="grid h-9 w-9 place-items-center rounded-lg text-stone-500 transition hover:bg-amber-50 hover:text-amber-700"
                            title="Archive property"
                            aria-label={`Archive ${property.name}`}
                          >
                            <Archive className="h-4 w-4" />
                          </button>

                          {isSuperAdmin && (
                            <button
                              type="button"
                              onClick={() =>
                                setConfirmDialog({
                                  isOpen: true,
                                  property,
                                  isPermanent: true,
                                  loading: false,
                                })
                              }
                              className="grid h-9 w-9 place-items-center rounded-lg text-stone-400 transition hover:bg-red-50 hover:text-red-600"
                              title="Delete permanently"
                              aria-label={`Delete ${property.name} permanently`}
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        <div className="flex flex-col items-center justify-between gap-3 border-t border-stone-200 bg-stone-50 px-5 py-4 text-sm text-stone-600 sm:flex-row">
          <p>
            Showing <span className="font-semibold text-stone-900">{properties.length}</span> of{' '}
            <span className="font-semibold text-stone-900">{total}</span> properties
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="inline-flex items-center gap-1 rounded-xl border border-stone-200 bg-white px-3.5 py-2 font-medium transition hover:bg-stone-100 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </button>
            <span className="px-2 font-medium tabular-nums">
              Page {page} of {totalPages}
            </span>
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="inline-flex items-center gap-1 rounded-xl border border-stone-200 bg-white px-3.5 py-2 font-medium transition hover:bg-stone-100 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Property details modal */}
      <AdminPropertyModal
        property={selectedProperty}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      {/* ------------------------ confirm archive / delete ------------------------ */}
      {confirmDialog.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4 backdrop-blur-sm animate-fadeIn">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirm-title"
            className="w-full max-w-md rounded-2xl border border-stone-200 bg-white p-6 shadow-2xl sm:p-7"
            style={{ fontFamily: BODY_FONT }}
          >
            <div className="mb-4 flex items-start gap-3.5">
              <span
                className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${confirmDialog.isPermanent ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'
                  }`}
              >
                <AlertTriangle className="h-5 w-5" />
              </span>
              <div>
                <h3 id="confirm-title" className="text-base font-semibold text-stone-900" style={display}>
                  {confirmDialog.isPermanent ? 'Delete this property?' : 'Archive this property?'}
                </h3>
                <p className="mt-0.5 text-xs text-stone-500">
                  {confirmDialog.isPermanent ? 'This cannot be undone' : 'You can restore it later'}
                </p>
              </div>
            </div>

            <p className="mb-6 text-sm leading-relaxed text-stone-600">
              {confirmDialog.isPermanent ? (
                <>
                  You are about to permanently delete{' '}
                  <strong className="text-stone-900">{confirmDialog.property?.name}</strong>. Its images,
                  highlights and records will be removed for good.
                </>
              ) : (
                <>
                  <strong className="text-stone-900">{confirmDialog.property?.name}</strong> will be removed
                  from the public website right away. An admin can restore it at any time.
                </>
              )}
            </p>

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() =>
                  setConfirmDialog({
                    isOpen: false,
                    property: null,
                    isPermanent: false,
                    loading: false,
                  })
                }
                disabled={confirmDialog.loading}
                className="rounded-xl border border-stone-200 px-4 py-2.5 text-sm font-semibold text-stone-600 transition hover:bg-stone-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmAction}
                disabled={confirmDialog.loading}
                className={`rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition disabled:opacity-60 ${confirmDialog.isPermanent ? 'bg-red-600 hover:bg-red-700' : 'bg-amber-600 hover:bg-amber-700'
                  }`}
              >
                {confirmDialog.loading
                  ? 'Processing…'
                  : confirmDialog.isPermanent
                    ? 'Delete permanently'
                    : 'Archive property'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}