import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import AdminPropertyModal from './AdminPropertyModal'
import {
  Search,
  PlusCircle,
  Eye,
  Edit3,
  Archive,
  Trash2,
  RefreshCw,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Globe,
  Share2,
  AlertTriangle,
  Building2,
} from 'lucide-react'

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

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Primary CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm">
        <div>
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#ff5938]">
            Catalog Inventory
          </span>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
            Resorts & Properties
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Browse, filter, edit, archive, and manage OTA channel assignments.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchProperties()}
            className="p-2.5 rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50 transition"
            title="Refresh List"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin text-[#ff5938]' : ''}`} />
          </button>
          <Link
            to="/admin/properties/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#ff5938] hover:bg-[#e84a28] text-xs font-bold uppercase tracking-[0.16em] text-white transition shadow-md shadow-[#ff5938]/20"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Add Property</span>
          </Link>
        </div>
      </div>

      {/* Notifications */}
      {actionMessage && (
        <div className="rounded-2xl bg-emerald-500/10 border border-emerald-500/20 p-4 text-xs font-medium text-emerald-800 animate-fadeIn">
          ✓ {actionMessage}
        </div>
      )}

      {error && (
        <div className="rounded-2xl bg-red-500/10 border border-red-500/20 p-4 text-xs text-red-700">
          ⚠️ {error}
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
        {/* Top Search & Dropdown Filters */}
        <div className="flex flex-col lg:flex-row lg:items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setPage(1)
              }}
              placeholder="Search by name, slug, ID, destination, or location..."
              className="w-full rounded-full border border-slate-200 bg-slate-50/50 py-2.5 pl-11 pr-4 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-[#ff5938] focus:bg-white"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Source Dropdown */}
            <select
              value={sourceFilter}
              onChange={(e) => {
                setSourceFilter(e.target.value)
                setPage(1)
              }}
              className="rounded-full border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-xs text-slate-700 font-medium outline-none focus:border-[#ff5938] focus:bg-white"
            >
              <option value="All">All Sources</option>
              <option value="VIA_OTA">VIA OTA</option>
              <option value="VIA_OTA_EXCHANGE">VIA OTA EXCHANGE</option>
            </select>

            {/* Destination Dropdown */}
            <select
              value={destinationFilter}
              onChange={(e) => {
                setDestinationFilter(e.target.value)
                setPage(1)
              }}
              className="rounded-full border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-xs text-slate-700 font-medium outline-none focus:border-[#ff5938] focus:bg-white"
            >
              <option value="All">All Destinations</option>
              <option value="Agra">Agra</option>
              <option value="Hawaii">Hawaii</option>
              <option value="California Coast">California Coast</option>
              <option value="Colorado">Colorado</option>
              <option value="Mexico">Mexico</option>
            </select>
          </div>
        </div>

        {/* Status Pill Tabs */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mr-1">
            Status:
          </span>
          {['All', 'published', 'draft', 'archived'].map((st) => (
            <button
              key={st}
              onClick={() => {
                setStatusFilter(st)
                setPage(1)
              }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold capitalize transition ${
                statusFilter === st
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st === 'All' ? 'All Properties' : st}
            </button>
          ))}
        </div>
      </div>

      {/* Properties Table Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-24 text-center">
            <div className="h-9 w-9 animate-spin rounded-full border-4 border-[#ff5938] border-t-transparent mx-auto mb-3" />
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Loading catalog...</p>
          </div>
        ) : properties.length === 0 ? (
          <div className="py-24 text-center px-6">
            <Building2 className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <h3 className="font-display text-xl font-bold text-slate-800">No properties found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-6">
              No resort entries matched your current search and filter criteria.
            </p>
            <button
              onClick={() => {
                setSearch('')
                setStatusFilter('All')
                setSourceFilter('All')
                setDestinationFilter('All')
              }}
              className="rounded-full bg-slate-900 px-5 py-2 text-xs font-semibold text-white hover:bg-slate-800 transition"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3.5 px-4 font-semibold">Property</th>
                  <th className="py-3.5 px-4 font-semibold">Identifiers</th>
                  <th className="py-3.5 px-4 font-semibold">Source Channel</th>
                  <th className="py-3.5 px-4 font-semibold">Location</th>
                  <th className="py-3.5 px-4 font-semibold">Status</th>
                  <th className="py-3.5 px-4 font-semibold">Active</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {properties.map((property) => {
                  const propertyId = property._id || property.id
                  return (
                    <tr
                      key={property.slug || propertyId}
                      className="hover:bg-slate-50/75 transition-colors"
                    >
                      {/* Property Thumbnail & Name */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={property.image}
                            alt={property.name}
                            className="h-12 w-16 rounded-xl object-cover border border-slate-200 shrink-0 bg-slate-100"
                          />
                          <div className="min-w-0">
                            <span className="font-bold text-slate-900 block truncate max-w-[200px]">
                              {property.name}
                            </span>
                            <span className="text-[11px] text-slate-400 font-mono block truncate max-w-[200px]">
                              /{property.slug}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Identifiers */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-1">
                          <span className="inline-block px-2 py-0.5 rounded font-mono text-[10px] bg-slate-100 text-slate-700 font-semibold border border-slate-200">
                            {property.internalId || 'PENDING'}
                          </span>
                          {property.externalId ? (
                            <div className="text-[10px] text-slate-500 font-mono">
                              Ext: {property.externalId}
                            </div>
                          ) : (
                            <div className="text-[10px] text-slate-400 italic">No external ID</div>
                          )}
                        </div>
                      </td>

                      {/* Source Channel */}
                      <td className="py-3.5 px-4">
                        {property.source === 'VIA_OTA' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                            <Globe className="h-3 w-3" />
                            VIA OTA
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-purple-50 text-purple-700 border border-purple-200">
                            <Share2 className="h-3 w-3" />
                            VIA OTA EXCHANGE
                          </span>
                        )}
                      </td>

                      {/* Location */}
                      <td className="py-3.5 px-4">
                        <div>
                          <span className="font-semibold text-slate-800 block">
                            {property.destination}
                          </span>
                          <span className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5 truncate max-w-[170px]">
                            <MapPin className="h-3 w-3 text-[#ff5938] shrink-0" />
                            {property.location}
                          </span>
                        </div>
                      </td>

                      {/* Status Dropdown */}
                      <td className="py-3.5 px-4">
                        <select
                          value={property.status}
                          onChange={(e) => handleStatusChange(propertyId, e.target.value)}
                          className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider outline-none border cursor-pointer ${
                            property.status === 'published'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : property.status === 'draft'
                              ? 'bg-amber-50 text-amber-700 border-amber-200'
                              : 'bg-slate-100 text-slate-600 border-slate-200'
                          }`}
                        >
                          <option value="published">Published</option>
                          <option value="draft">Draft</option>
                          <option value="archived">Archived</option>
                        </select>
                      </td>

                      {/* Active Toggle Switch */}
                      <td className="py-3.5 px-4">
                        <button
                          type="button"
                          onClick={() => handleToggleActive(property)}
                          className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                            property.isActive ? 'bg-[#ff5938]' : 'bg-slate-300'
                          }`}
                          aria-label="Toggle active status"
                        >
                          <span
                            className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                              property.isActive ? 'translate-x-4' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </td>

                      {/* Action Buttons */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* View Modal */}
                          <button
                            onClick={() => handleOpenView(property)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition"
                            title="Quick View"
                          >
                            <Eye className="h-4 w-4" />
                          </button>

                          {/* Edit Page */}
                          <Link
                            to={`/admin/properties/${propertyId}/edit`}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-[#ff5938] hover:bg-slate-100 transition"
                            title="Edit Property"
                          >
                            <Edit3 className="h-4 w-4" />
                          </Link>

                          {/* Archive */}
                          <button
                            onClick={() =>
                              setConfirmDialog({
                                isOpen: true,
                                property,
                                isPermanent: false,
                                loading: false,
                              })
                            }
                            className="p-1.5 rounded-lg text-slate-500 hover:text-amber-600 hover:bg-amber-50 transition"
                            title="Archive Property"
                          >
                            <Archive className="h-4 w-4" />
                          </button>

                          {/* Delete (Super Admin only) */}
                          {isSuperAdmin && (
                            <button
                              onClick={() =>
                                setConfirmDialog({
                                  isOpen: true,
                                  property,
                                  isPermanent: true,
                                  loading: false,
                                })
                              }
                              className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition"
                              title="Delete Permanently"
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

        {/* Server-Side Pagination Bar */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
          <div>
            Showing <span className="font-semibold">{properties.length}</span> of{' '}
            <span className="font-semibold">{total}</span> total properties
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full border border-slate-200 bg-white hover:bg-slate-100 transition disabled:opacity-40"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              <span>Previous</span>
            </button>
            <span className="px-2 font-medium">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full border border-slate-200 bg-white hover:bg-slate-100 transition disabled:opacity-40"
            >
              <span>Next</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Property Details Inspection Modal */}
      <AdminPropertyModal
        property={selectedProperty}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      {/* Confirmation Modal for Safe Archive or Delete */}
      {confirmDialog.isOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-slate-200">
            <div className="flex items-center gap-3 text-amber-600 mb-4">
              <div className="h-10 w-10 rounded-2xl bg-amber-50 flex items-center justify-center shrink-0">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-display font-bold text-base text-slate-900">
                  {confirmDialog.isPermanent ? 'Confirm Permanent Deletion' : 'Confirm Property Archival'}
                </h3>
                <span className="text-[11px] text-slate-500">
                  {confirmDialog.isPermanent ? 'Irreversible Super Admin Action' : 'Safe Catalog Archive'}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed mb-6">
              {confirmDialog.isPermanent ? (
                <>
                  Are you sure you want to permanently delete{' '}
                  <strong className="text-slate-800">{confirmDialog.property?.name}</strong> from
                  the database? This will permanently remove its image mappings, highlights, and
                  records.
                </>
              ) : (
                <>
                  Are you sure you want to archive{' '}
                  <strong className="text-slate-800">{confirmDialog.property?.name}</strong>? It
                  will be removed from public website listings immediately, but can be restored by
                  admins at any time.
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
                className="px-4 py-2 rounded-full border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmAction}
                disabled={confirmDialog.loading}
                className={`px-5 py-2 rounded-full text-xs font-bold text-white transition ${
                  confirmDialog.isPermanent
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-amber-600 hover:bg-amber-700'
                }`}
              >
                {confirmDialog.loading
                  ? 'Processing...'
                  : confirmDialog.isPermanent
                  ? 'Delete Permanently'
                  : 'Safely Archive'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
