export default function Preloader({ visible }) {
  if (!visible) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white pointer-events-none transition-opacity duration-300">
      <div className="text-center flex flex-col items-center">
        <div className="w-10 h-10 border-4 border-[#ff5938] border-t-transparent rounded-full animate-spin mb-3" />
        <span className="text-xs font-bold uppercase tracking-widest text-slate-500">
          Loading COUNTRY HOLIDAYS INNSUITES...
        </span>
      </div>
    </div>
  )
}
