export default function PageTransition({ children }) {
  return (
    <div className="w-full animate-in fade-in duration-300">
      {children}
    </div>
  )
}
