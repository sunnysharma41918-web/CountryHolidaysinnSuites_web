import { useState, useEffect, useCallback } from 'react'
import { api } from '../../services/api'
import {
  History,
  Search,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Shield,
  Eye,
  X,
  FileCode,
} from 'lucide-react'

export default function AdminAuditLogsPage() {
  const [logs, setLogs] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Filters
  const [actionFilter, setActionFilter] = useState('All')
  const [search, setSearch] = useState('')

  // Details Modal
  const [selectedLog, setSelectedLog] = useState(null)

  const fetchLogs = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await api.getAuditLogs({
        page,
        limit: 15,
        action: actionFilter,
        search,
      })

      if (res.success) {
        setLogs(res.logs || [])
        setTotal(res.total || 0)
        setTotalPages(res.totalPages || 1)
      }
    } catch (err) {
      setError(err.message || 'Failed to load audit history')
    } finally {
      setLoading(false)
    }
  }, [page, actionFilter, search])

  useEffect(() => {
    fetchLogs()
  }, [fetchLogs])

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm">
        <div>
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#ff5938]">
            Governance & Compliance
          </span>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
            System Audit Trail
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Tamper-evident logs of administrative actions, status changes, and logins.
          </p>
        </div>

        <button
          onClick={() => fetchLogs()}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-slate-200 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 transition shadow-sm"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin text-[#ff5938]' : ''}`} />
          <span>Refresh Audit</span>
        </button>
      </div>

      {error && (
        <div className="rounded-2xl bg-red-500/10 border border-red-500/20 p-4 text-xs text-red-700">
          ⚠️ {error}
        </div>
      )}

      {/* Filter Bar */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
            placeholder="Search audit events by user, target, or action..."
            className="w-full rounded-full border border-slate-200 bg-slate-50/50 py-2.5 pl-11 pr-4 text-xs sm:text-sm text-slate-800 outline-none focus:border-[#ff5938] focus:bg-white"
          />
        </div>

        <select
          value={actionFilter}
          onChange={(e) => {
            setActionFilter(e.target.value)
            setPage(1)
          }}
          className="rounded-full border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-xs text-slate-700 font-medium outline-none focus:border-[#ff5938] focus:bg-white"
        >
          <option value="All">All Event Types</option>
          <option value="AUTH_LOGIN">AUTH_LOGIN</option>
          <option value="AUTH_LOGOUT">AUTH_LOGOUT</option>
          <option value="PROPERTY_CREATE">PROPERTY_CREATE</option>
          <option value="PROPERTY_UPDATE">PROPERTY_UPDATE</option>
          <option value="PROPERTY_STATUS_CHANGE">PROPERTY_STATUS_CHANGE</option>
          <option value="PROPERTY_ARCHIVE">PROPERTY_ARCHIVE</option>
          <option value="PROPERTY_PERMANENT_DELETE">PROPERTY_PERMANENT_DELETE</option>
        </select>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-24 text-center">
            <div className="h-9 w-9 animate-spin rounded-full border-4 border-[#ff5938] border-t-transparent mx-auto mb-3" />
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Loading audit trail...</p>
          </div>
        ) : logs.length === 0 ? (
          <div className="py-20 text-center px-6">
            <History className="h-10 w-10 text-slate-300 mx-auto mb-3" />
            <h3 className="font-display text-lg font-bold text-slate-800">No audit events found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              Events will be appended here as administrators interact with properties or sign in.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3.5 px-4 font-semibold">Timestamp</th>
                  <th className="py-3.5 px-4 font-semibold">Action</th>
                  <th className="py-3.5 px-4 font-semibold">User</th>
                  <th className="py-3.5 px-4 font-semibold">Target Entity</th>
                  <th className="py-3.5 px-4 font-semibold">IP Address</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {logs.map((log) => (
                  <tr key={log._id || log.id} className="hover:bg-slate-50/75 transition-colors">
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                      {log.createdAt ? new Date(log.createdAt).toLocaleString() : 'N/A'}
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-block px-2.5 py-0.5 rounded-full font-mono text-[10px] font-semibold bg-slate-100 text-slate-800 border border-slate-200">
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-800">{log.userName || 'System'}</div>
                      <div className="text-[10px] text-slate-400 truncate max-w-[150px]">
                        {log.userEmail || log.userRole}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-medium text-slate-800 block truncate max-w-[200px]">
                        {log.targetName || log.targetId || '-'}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {log.targetType}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-400 truncate max-w-[120px]">
                      {log.ipAddress || '127.0.0.1'}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setSelectedLog(log)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-slate-200 text-[11px] font-semibold text-slate-700 hover:bg-slate-100 transition"
                      >
                        <Eye className="h-3 w-3 text-[#ff5938]" />
                        <span>Inspect</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
          <div>
            Showing <span className="font-semibold">{logs.length}</span> of{' '}
            <span className="font-semibold">{total}</span> audit records
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

      {/* Inspect Diff Details Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-7 shadow-2xl border border-slate-200 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <FileCode className="h-5 w-5 text-[#ff5938]" />
                <div>
                  <h3 className="font-display font-bold text-base text-slate-900">
                    Audit Event Payload
                  </h3>
                  <span className="text-[11px] font-mono text-slate-400">
                    {selectedLog.action} • {new Date(selectedLog.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedLog(null)}
                className="h-8 w-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition"
              >
                <X className="h-4 w-4 text-slate-600" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 text-slate-200 font-mono text-xs overflow-y-auto my-4 max-h-[50vh]">
              <pre className="whitespace-pre-wrap break-all">
                {JSON.stringify(selectedLog.details || {}, null, 2)}
              </pre>
            </div>

            <div className="pt-2 flex items-center justify-between text-xs text-slate-500">
              <span>Initiated by: {selectedLog.userName} ({selectedLog.userRole})</span>
              <button
                onClick={() => setSelectedLog(null)}
                className="px-4 py-1.5 rounded-full bg-slate-900 text-white font-semibold hover:bg-slate-800 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
