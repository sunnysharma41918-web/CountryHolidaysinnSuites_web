import { Link } from 'react-router-dom'

export default function TripMakerLogo({ className = '', inverted = false }) {
  return (
    <Link to="/" className={`inline-flex items-center gap-2.5 sm:gap-3 group ${className}`}>
      {/* Green tree logo mark uploaded by user */}
      <img
        src={inverted ? '/logo-white.png' : '/logo.png'}
        alt="Country Holidays InnSuites"
        className="h-9 sm:h-11 w-auto object-contain transition-transform duration-300 group-hover:scale-105 drop-shadow-sm"
      />

      <div className="flex flex-col leading-none text-left">
        <span
          className={`text-xs sm:text-sm font-black tracking-wider uppercase font-display transition-colors ${
            inverted ? 'text-white' : 'text-slate-900'
          }`}
        >
          COUNTRY HOLIDAYS
        </span>
        <span
          className={`text-[10px] sm:text-[11px] font-bold tracking-[0.22em] uppercase mt-0.5 ${
            inverted ? 'text-[#ff5938]' : 'text-[#65a30d]'
          }`}
        >
          INNSUITES
        </span>
      </div>
    </Link>
  )
}
