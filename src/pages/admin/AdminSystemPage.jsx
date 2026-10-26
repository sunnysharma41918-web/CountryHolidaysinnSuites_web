import { useState, useEffect } from 'react'
import { api } from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import {
  Server,
  Database,
  ShieldCheck,
  Key,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Terminal,
} from 'lucide-react'

export default function AdminSystemPage() {
  const { user } = useAuth()
  const [health, setHealth] = useState(null)
  const [loading, setLoading] = useState(true)

  const checkHealth = async () => {
    try {
      setLoading(true)
      const data = await api.getHealth()
      setHealth(data)
    } catch {
      setHealth({ status: 'error', database: { connected: false, state: 'unreachable' } })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    checkHealth()
  }, [])

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm">
        <div>
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#ff5938]">
            System Diagnostics
          </span>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
            System & Infrastructure Health
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Cluster connection status, security policies, and environment runtime details.
          </p>
        </div>

        <button
          onClick={checkHealth}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-slate-200 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 transition shadow-sm"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin text-[#ff5938]' : ''}`} />
          <span>Ping API</span>
        </button>
      </div>

      {/* Grid: Health Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* API Backend Health */}
        <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Server className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-display font-bold text-base text-slate-900">
                  Node.js / Express API
                </h3>
                <span className="text-[11px] text-slate-500">Port 5000 • JSON REST API</span>
              </div>
            </div>

            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                health?.status === 'ok'
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}
            >
              <span
                className={`h-2 w-2 rounded-full ${
                  health?.status === 'ok' ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'
                }`}
              />
              {health?.status === 'ok' ? 'Healthy' : 'Unreachable'}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-500">API Uptime:</span>
              <span className="font-mono font-semibold text-slate-800">
                {health?.uptimeSeconds ? `${health.uptimeSeconds} seconds` : 'Just started'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Server Time:</span>
              <span className="font-mono font-semibold text-slate-800">
                {health?.timestamp ? new Date(health.timestamp).toLocaleTimeString() : 'N/A'}
              </span>
            </div>
          </div>
        </div>

        {/* MongoDB Atlas Health */}
        <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Database className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-display font-bold text-base text-slate-900">
                  MongoDB Atlas
                </h3>
                <span className="text-[11px] text-slate-500">Cloud M0 Free Tier</span>
              </div>
            </div>

            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                health?.database?.connected
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-amber-50 text-amber-700 border border-amber-200'
              }`}
            >
              <span
                className={`h-2 w-2 rounded-full ${
                  health?.database?.connected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
                }`}
              />
              {health?.database?.connected ? 'Connected' : 'Offline / Pending URI'}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-500">Database Driver:</span>
              <span className="font-mono font-semibold text-slate-800">Mongoose v8.9.5</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Pool Limit:</span>
              <span className="font-mono font-semibold text-slate-800">10 (Atlas M0 Optimized)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Database Connection Instructions */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex items-center gap-2.5">
          <Terminal className="h-5 w-5 text-[#ff5938]" />
          <h3 className="font-display font-bold text-base text-slate-900">
            Connecting Your Free Tier MongoDB Atlas Cluster
          </h3>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed">
          The backend is configured to use your free tier MongoDB Atlas cluster via environment variables. Follow these simple steps to connect:
        </p>

        <ol className="list-decimal list-inside space-y-2 text-xs text-slate-700 bg-slate-50 p-4 rounded-2xl border border-slate-100 leading-relaxed">
          <li>Log into <a href="https://cloud.mongodb.com" target="_blank" rel="noreferrer" className="text-[#ff5938] underline font-semibold">MongoDB Atlas</a> and select your Free M0 Cluster.</li>
          <li>Under <strong>Database Access</strong>, create a database user (e.g. <code className="bg-slate-200 px-1 py-0.5 rounded">chis_admin</code>).</li>
          <li>Under <strong>Network Access</strong>, add an IP Access entry (<code className="bg-slate-200 px-1 py-0.5 rounded">0.0.0.0/0</code> or your current public IP).</li>
          <li>Click <strong>Connect</strong> &gt; <strong>Drivers</strong> &gt; Copy your connection string.</li>
          <li>In <code className="bg-slate-200 px-1 py-0.5 rounded font-mono">backend/.env</code>, set:
            <div className="mt-2 p-3 rounded-xl bg-slate-900 text-slate-100 font-mono text-[11px] overflow-x-auto">
              MONGODB_URI=mongodb+srv://&lt;username&gt;:&lt;password&gt;@cluster0.xxx.mongodb.net/chis_db?retryWrites=true&amp;w=majority
            </div>
          </li>
          <li>Run <code className="bg-slate-200 px-1 py-0.5 rounded font-mono font-bold">npm run seed:admin</code> in the backend directory to provision your administrator credentials.</li>
          <li>Run <code className="bg-slate-200 px-1 py-0.5 rounded font-mono font-bold">npm run seed:properties</code> to import all Country Holidays resort listings into MongoDB.</li>
        </ol>
      </div>

      {/* Role-Based Permissions Matrix */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex items-center gap-2.5">
          <Key className="h-5 w-5 text-[#ff5938]" />
          <h3 className="font-display font-bold text-base text-slate-900">
            Role-Based Access Control (RBAC) Matrix
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border border-slate-200 rounded-2xl overflow-hidden">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="p-3">Role</th>
                <th className="p-3">View &amp; Edit Properties</th>
                <th className="p-3">Publish / Draft Changes</th>
                <th className="p-3">Safe Archival</th>
                <th className="p-3">Permanent Deletion</th>
                <th className="p-3">Audit Log Access</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="p-3 font-bold text-purple-700">super_admin</td>
                <td className="p-3 text-emerald-600 font-semibold">✓ Full</td>
                <td className="p-3 text-emerald-600 font-semibold">✓ Full</td>
                <td className="p-3 text-emerald-600 font-semibold">✓ Allowed</td>
                <td className="p-3 text-emerald-600 font-semibold">✓ Allowed</td>
                <td className="p-3 text-emerald-600 font-semibold">✓ Full Inspection</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-blue-700">admin</td>
                <td className="p-3 text-emerald-600 font-semibold">✓ Full</td>
                <td className="p-3 text-emerald-600 font-semibold">✓ Full</td>
                <td className="p-3 text-emerald-600 font-semibold">✓ Allowed</td>
                <td className="p-3 text-slate-400">✗ Restricted</td>
                <td className="p-3 text-emerald-600 font-semibold">✓ Full Inspection</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-emerald-700">editor</td>
                <td className="p-3 text-emerald-600 font-semibold">✓ Edit / Drafts</td>
                <td className="p-3 text-amber-600 font-semibold">△ Draft Only</td>
                <td className="p-3 text-slate-400">✗ Restricted</td>
                <td className="p-3 text-slate-400">✗ Restricted</td>
                <td className="p-3 text-slate-400">✗ Restricted</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
