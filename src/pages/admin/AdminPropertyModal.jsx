import { X, MapPin, Check, Phone, Mail, Globe, ExternalLink } from 'lucide-react'

export default function AdminPropertyModal({ property, isOpen, onClose }) {
  if (!isOpen || !property) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl border border-slate-200 relative my-8 max-h-[90vh] flex flex-col">
        {/* Header with image */}
        <div className="relative h-64 sm:h-72 w-full shrink-0 bg-slate-900">
          <img
            src={property.image}
            alt={property.name}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 h-9 w-9 rounded-full bg-black/50 text-white hover:bg-black/80 flex items-center justify-center transition backdrop-blur-sm"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Status & Source badges */}
          <div className="absolute top-4 left-4 flex flex-wrap gap-2">
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                property.status === 'published'
                  ? 'bg-emerald-500 text-white'
                  : property.status === 'draft'
                  ? 'bg-amber-500 text-white'
                  : 'bg-slate-600 text-white'
              }`}
            >
              {property.status}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/20 text-white backdrop-blur-md">
              {property.source}
            </span>
          </div>

          <div className="absolute bottom-4 left-6 right-6 text-white">
            <div className="text-[11px] font-mono text-[#ff5938] uppercase font-bold tracking-wider">
              {property.internalId || 'ID Pending'}
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold leading-tight mt-1">
              {property.name}
            </h2>
            <p className="flex items-center gap-1.5 text-xs text-white/80 mt-1">
              <MapPin className="h-3.5 w-3.5 text-[#ff5938]" />
              {property.location}
            </p>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-slate-700 text-sm">
          {/* Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
            <div>
              <span className="text-slate-400 block mb-0.5 font-medium">Destination</span>
              <span className="font-semibold text-slate-800">{property.destination}</span>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5 font-medium">External OTA ID</span>
              <span className="font-mono font-semibold text-slate-800">
                {property.externalId || 'None mapped'}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5 font-medium">Sync Status</span>
              <span className="font-semibold text-slate-800">
                {property.externalSyncStatus || 'NOT_APPLICABLE'}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5 font-medium">Active Status</span>
              <span className={`font-semibold ${property.isActive ? 'text-emerald-600' : 'text-slate-400'}`}>
                {property.isActive ? 'Active (Live)' : 'Inactive'}
              </span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400 mb-2">
              Property Overview
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">{property.description}</p>
          </div>

          {/* Highlights */}
          {property.highlights && property.highlights.length > 0 && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400 mb-3">
                Key Highlights
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {property.highlights.map((h, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700 font-medium"
                  >
                    <Check className="h-3.5 w-3.5 text-[#ff5938] shrink-0" />
                    <span>{h}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Amenities */}
          {property.amenities && property.amenities.length > 0 && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400 mb-3">
                Amenities & Features
              </h3>
              <div className="flex flex-wrap gap-2">
                {property.amenities.map((a, i) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 rounded-full bg-slate-100 text-slate-700 text-xs font-medium"
                  >
                    {a}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Gallery Preview */}
          {property.gallery && property.gallery.length > 0 && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400 mb-3">
                Gallery Images ({property.gallery.length})
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {property.gallery.map((img, i) => (
                  <div key={i} className="h-24 rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                    <img src={img} alt={`Gallery ${i}`} className="h-full w-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Contact Details */}
          {property.contactDetails && (
            <div className="pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-600">
              {property.contactDetails.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5 text-[#ff5938]" />
                  <span>{property.contactDetails.phone}</span>
                </div>
              )}
              {property.contactDetails.email && (
                <div className="flex items-center gap-2 truncate">
                  <Mail className="h-3.5 w-3.5 text-[#ff5938]" />
                  <span className="truncate">{property.contactDetails.email}</span>
                </div>
              )}
              {property.contactDetails.website && (
                <div className="flex items-center gap-2">
                  <Globe className="h-3.5 w-3.5 text-[#ff5938]" />
                  <a
                    href={property.contactDetails.website}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:underline text-[#ff5938] flex items-center gap-1"
                  >
                    Website <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <a
            href={`/resorts/${property.slug}`}
            target="_blank"
            rel="noreferrer"
            className="text-xs text-slate-600 hover:text-[#ff5938] flex items-center gap-1 font-semibold"
          >
            <span>Preview on Public Site</span>
            <ExternalLink className="h-3 w-3" />
          </a>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-full bg-slate-900 hover:bg-slate-800 text-xs font-semibold text-white transition"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  )
}
