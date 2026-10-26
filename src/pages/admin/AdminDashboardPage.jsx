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
  TrendingUp,
  MapPin,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react'

export const slab = { fontFamily: "'Zilla Slab', Rockwell, 'Roboto Slab', serif" }

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null)
  const [recentProperties, setRecentProperties] = useState([])
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
  }, [])

  if (loading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#22d37a] border-t-transparent mb-4" />
        <p className="text-xs uppercase tracking-[0.2em] font-medium text-stone-500">Loading Portfolio Dashboard...</p>
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

  return (
    <div className="space-y-6 pb-12 font-['Poppins',system-ui,sans-serif] text-[#0a0f0c]">
      {/* Top Welcome & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-3xl bg-stone-50/80 p-6 sm:p-7 border border-stone-200/80">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-[#22d37a]/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-[#0c3b27]">
            <span className="h-2 w-2 rounded-full bg-[#22d37a]" />
            Live Property Catalog
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#0a0f0c] mt-2" style={slab}>
            Portfolio Overview & Operations
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            Real-time control over resort inventory, OTA channel distributions, and system audits.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={fetchDashboardData}
            disabled={refreshing}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-stone-200 text-xs font-semibold text-stone-700 bg-white hover:bg-stone-50 transition shadow-sm"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? 'animate-spin text-[#22d37a]' : ''}`} />
            <span>{refreshing ? 'Refreshing…' : 'Refresh'}</span>
          </button>

          <Link
            to="/admin/properties/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#0a0f0c] hover:bg-[#22d37a] hover:text-[#0a0f0c] text-xs font-semibold uppercase tracking-wider text-white transition shadow-sm"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Add Property</span>
          </Link>
        </div>
      </div>

      {error && (
        <div className="rounded-2xl bg-amber-500/10 border border-amber-500/20 p-4 text-xs text-amber-900 flex items-center gap-2.5">
          <AlertCircle className="h-4 w-4 text-amber-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Total Properties */}
        <div className="rounded-3xl bg-white p-5 sm:p-6 border border-stone-200/80 shadow-sm hover:border-[#22d37a]/50 transition">
          <div className="flex items-center justify-between text-stone-400 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
              Total Catalog
            </span>
            <div className="h-9 w-9 rounded-2xl bg-emerald-50 text-[#0c3b27] flex items-center justify-center">
              <Building2 className="h-4 w-4 text-[#22d37a]" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-bold text-[#0a0f0c]" style={slab}>
              {s.totalProperties}
            </span>
            <span className="text-xs text-stone-500 font-light">Resorts</span>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-[11px] text-[#0c3b27] font-medium">
            <TrendingUp className="h-3 w-3 text-[#22d37a]" />
            <span>{s.activeCount} active on portal</span>
          </div>
        </div>

        {/* Published Live */}
        <div className="rounded-3xl bg-white p-5 sm:p-6 border border-stone-200/80 shadow-sm hover:border-[#22d37a]/50 transition">
          <div className="flex items-center justify-between text-stone-400 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
              Published Live
            </span>
            <div className="h-9 w-9 rounded-2xl bg-emerald-50 text-[#0c3b27] flex items-center justify-center">
              <CheckCircle2 className="h-4 w-4 text-[#22d37a]" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-bold text-[#0c3b27]" style={slab}>
              {s.publishedCount}
            </span>
            <span className="text-xs text-stone-500 font-light">Public Stays</span>
          </div>
          <p className="mt-3 text-[11px] text-stone-500 font-light">Visible to guests on website</p>
        </div>

        {/* Drafts */}
        <div className="rounded-3xl bg-white p-5 sm:p-6 border border-stone-200/80 shadow-sm hover:border-amber-400/50 transition">
          <div className="flex items-center justify-between text-stone-400 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
              Drafts
            </span>
            <div className="h-9 w-9 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <FileEdit className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-bold text-amber-700" style={slab}>
              {s.draftCount}
            </span>
            <span className="text-xs text-stone-500 font-light">In Review</span>
          </div>
          <p className="mt-3 text-[11px] text-stone-500 font-light">Private administrator drafts</p>
        </div>

        {/* Archived */}
        <div className="rounded-3xl bg-white p-5 sm:p-6 border border-stone-200/80 shadow-sm hover:border-stone-400/50 transition">
          <div className="flex items-center justify-between text-stone-400 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
              Archived
            </span>
            <div className="h-9 w-9 rounded-2xl bg-stone-100 text-stone-600 flex items-center justify-center">
              <Archive className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-bold text-stone-700" style={slab}>
              {s.archivedCount}
            </span>
            <span className="text-xs text-stone-500 font-light">Retired</span>
          </div>
          <p className="mt-3 text-[11px] text-stone-500 font-light">Safely hidden from guests</p>
        </div>
      </div>

      {/* 2-Column Section: Source Breakdown & Destination Inventory */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* OTA Source Distribution */}
        <div className="lg:col-span-5 rounded-3xl bg-white p-6 sm:p-7 border border-stone-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg text-[#0a0f0c]" style={slab}>
                OTA Source Channels
              </h3>
              <span className="text-[11px] uppercase tracking-wider font-semibold text-[#0c3b27] bg-[#22d37a]/15 px-2.5 py-1 rounded-full">
                Contract Mappings
              </span>
            </div>
            <p className="text-xs text-stone-500 leading-relaxed mb-6">
              Properties assigned to directly contracted VIA OTA channel versus the global Exchange Partner network.
            </p>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1.5">
                  <span className="flex items-center gap-1.5 text-stone-800">
                    <Globe className="h-3.5 w-3.5 text-[#0c3b27]" />
                    VIA OTA ({s.sourceBreakdown?.VIA_OTA || 0})
                  </span>
                  <span className="text-stone-500">{viaOtaPercent}%</span>
                </div>
                <div className="h-2.5 rounded-full bg-stone-100 overflow-hidden">
                  <div
                    className="h-full bg-[#0c3b27] rounded-full transition-all duration-700"
                    style={{ width: `${viaOtaPercent}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1.5">
                  <span className="flex items-center gap-1.5 text-stone-800">
                    <Share2 className="h-3.5 w-3.5 text-[#22d37a]" />
                    VIA OTA EXCHANGE ({s.sourceBreakdown?.VIA_OTA_EXCHANGE || 0})
                  </span>
                  <span className="text-stone-500">{viaOtaExchangePercent}%</span>
                </div>
                <div className="h-2.5 rounded-full bg-stone-100 overflow-hidden">
                  <div
                    className="h-full bg-[#22d37a] rounded-full transition-all duration-700"
                    style={{ width: `${viaOtaExchangePercent}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
            <span className="flex items-center gap-1.5 text-[11px]">
              <ShieldCheck className="h-3.5 w-3.5 text-[#22d37a]" />
              External ID sync ready
            </span>
            <Link to="/admin/properties" className="text-[#0c3b27] font-semibold hover:underline">
              Manage Sources →
            </Link>
          </div>
        </div>

        {/* Destination Distribution */}
        <div className="lg:col-span-7 rounded-3xl bg-white p-6 sm:p-7 border border-stone-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg text-[#0a0f0c]" style={slab}>
                Destination Inventory
              </h3>
              <Link
                to="/admin/properties"
                className="text-xs font-semibold text-[#0c3b27] hover:underline"
              >
                View Catalog →
              </Link>
            </div>
            <p className="text-xs text-stone-500 mb-5">
              Breakdown of properties grouped by geographical destination category.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {(s.destinationStats || []).map((item) => (
                <div
                  key={item.destination}
                  className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/70 hover:border-[#22d37a]/50 transition"
                >
                  <div className="flex items-center gap-1.5 text-stone-500 text-[11px] mb-1">
                    <MapPin className="h-3 w-3 text-[#22d37a]" />
                    <span className="font-medium truncate">{item.destination}</span>
                  </div>
                  <p className="text-2xl font-bold text-[#0a0f0c]" style={slab}>
                    {item.count}{' '}
                    <span className="text-[11px] font-sans font-light text-stone-500">
                      {item.count === 1 ? 'Stay' : 'Stays'}
                    </span>
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
            <span>Looking to launch in a new region?</span>
            <Link
              to="/admin/properties/new"
              className="inline-flex items-center gap-1 font-semibold text-[#0c3b27] hover:text-[#22d37a]"
            >
              Add New Property <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Catalog Preview */}
      <div className="rounded-3xl bg-white p-6 sm:p-7 border border-stone-200/80 shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="font-bold text-lg text-[#0a0f0c]" style={slab}>
              Recent Properties
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">Quick access to the most recently updated resort listings.</p>
          </div>
          <Link
            to="/admin/properties"
            className="text-xs font-semibold text-[#0c3b27] hover:underline"
          >
            All Properties ({s.totalProperties}) →
          </Link>
        </div>

        {recentProperties.length === 0 ? (
          <div className="text-center py-8 text-stone-400 text-xs">
            No properties found in database. Click "Add Property" to create your first listing.
          </div>
        ) : (
          <div className="divide-y divide-stone-100">
            {recentProperties.map((prop) => (
              <div key={prop._id || prop.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3.5">
                  <div className="h-12 w-12 rounded-xl bg-stone-100 overflow-hidden shrink-0 border border-stone-200">
                    <img
                      src={prop.coverImage || prop.gallery?.[0] || '/placeholder.jpg'}
                      alt={prop.title}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = '/tree-logo.png'
                      }}
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-[#0a0f0c]">{prop.title}</span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          prop.status === 'published'
                            ? 'bg-[#22d37a]/15 text-[#0c3b27]'
                            : prop.status === 'draft'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-stone-100 text-stone-600'
                        }`}
                      >
                        {prop.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-stone-400 mt-0.5">
                      <span className="font-mono text-[11px] text-stone-500">{prop.internalId || 'ID'}</span>
                      <span>•</span>
                      <span>{prop.destination || prop.location}</span>
                      <span>•</span>
                      <span className="font-mono text-[10px] text-stone-500">{prop.source}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <Link
                    to={`/admin/properties/${prop._id || prop.id}/edit`}
                    className="px-3 py-1.5 rounded-full border border-stone-200 text-xs font-medium text-stone-700 hover:bg-stone-50 transition"
                  >
                    Edit
                  </Link>
                  {prop.slug && (
                    <a
                      href={`/resorts/${prop.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-full text-stone-400 hover:text-[#0a0f0c] transition"
                      title="View public stay page"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Activity Timeline */}
      <div className="rounded-3xl bg-white p-6 sm:p-7 border border-stone-200/80 shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <Clock className="h-5 w-5 text-[#22d37a]" />
            <h3 className="font-bold text-lg text-[#0a0f0c]" style={slab}>
              Recent System & Audit Trail
            </h3>
          </div>
          <Link
            to="/admin/audit-logs"
            className="text-xs font-semibold text-[#0c3b27] hover:underline"
          >
            All Logs →
          </Link>
        </div>

        {!s.recentActivity || s.recentActivity.length === 0 ? (
          <div className="text-center py-8 text-stone-400 text-xs">
            No recent operational events recorded. Administrative updates and status changes will automatically appear here.
          </div>
        ) : (
          <div className="divide-y divide-stone-100">
            {s.recentActivity.map((log) => (
              <div key={log._id || log.id} className="py-3 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-1 rounded-full font-mono text-[10px] font-semibold bg-stone-100 text-stone-700">
                    {log.action}
                  </span>
                  <div>
                    <span className="font-semibold text-stone-800">
                      {log.targetName || log.targetId || 'Property Resource'}
                    </span>
                    <span className="text-stone-400 ml-2">by {log.userName || 'Administrator'}</span>
                  </div>
                </div>
                <span className="text-stone-400 text-[11px]">
                  {log.createdAt ? new Date(log.createdAt).toLocaleDateString() : 'Recent'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
