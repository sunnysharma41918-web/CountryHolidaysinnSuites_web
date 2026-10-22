import { useRef } from 'react'

export default function MagneticButton({ children, className = '' }) {
  const ref = useRef(null)

  const handleMouseMove = (event) => {
    const element = ref.current
    if (!element) return

    const rect = element.getBoundingClientRect()
    const offsetX = (event.clientX - rect.left - rect.width / 2) / 12
    const offsetY = (event.clientY - rect.top - rect.height / 2) / 12
    element.style.transform = `translate(${offsetX}px, ${offsetY}px)`
  }

  const handleMouseLeave = () => {
    const element = ref.current
    if (!element) return
    element.style.transform = 'translate(0, 0)'
  }

  return (
    <span
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`inline-block transition-transform duration-200 ${className}`}
    >
      {children}
    </span>
  )
}
