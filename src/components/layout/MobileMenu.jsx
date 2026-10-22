import { X, ArrowRight } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { navigation } from '../../data/navigation'
import TripMakerLogo from '../ui/TripMakerLogo'
import DestinationMenuLinks from './DestinationMenuLinks'

export default function MobileMenu({ isOpen, onClose }) {
  if (!isOpen) return null

  const handleBookNow = () => {
    onClose()
    window.dispatchEvent(new CustomEvent('open-booking-modal'))
  }

  return (
    <div className="absolute inset-x-4 top-full mt-2 rounded-2xl border border-slate-100 bg-white/98 backdrop-blur-md p-5 text-slate-800 shadow-xl z-50 animate-in fade-in zoom-in-95 duration-150">
      <div className="mb-4 flex items-center justify-between pb-3 border-b border-slate-100">
        <TripMakerLogo />
        <button
          type="button"
          onClick={onClose}
          className="rounded-full bg-slate-100 p-2 text-slate-600 hover:text-slate-900"
          aria-label="Close menu"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <nav className="flex flex-col gap-1.5">
        {navigation.map((link) => (
          link.label === 'DESTINATIONS' ? (
            <div key={link.path} className="rounded-xl border border-slate-100 p-3">
              <NavLink
                to={link.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `block px-1 py-2 text-xs font-bold uppercase tracking-wider transition ${
                    isActive ? 'text-[#e84a28]' : 'text-slate-700 hover:text-slate-950'
                  }`
                }
              >
                {link.label}
              </NavLink>
              <DestinationMenuLinks mode="mobile" onNavigate={onClose} />
            </div>
          ) : (
            <NavLink
              key={link.path}
              to={link.path}
              onClick={onClose}
              className={({ isActive }) =>
                `px-3 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition ${
                  isActive
                    ? 'bg-[#ff5938] text-white'
                    : 'text-slate-700 hover:bg-slate-50'
                }`
              }
            >
              {link.label}
            </NavLink>
          )
        ))}
      </nav>

      <div className="mt-4 pt-3 border-t border-slate-100">
        <button
          type="button"
          onClick={handleBookNow}
          className="w-full py-3 rounded-full bg-[#ff5938] hover:bg-[#e84a28] text-white font-extrabold text-xs uppercase tracking-wider shadow-md shadow-[#ff5938]/30 flex items-center justify-center gap-2 transition"
        >
          <span>BOOK NOW</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
