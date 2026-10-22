import { useEffect, useRef, useState } from 'react'

export default function Reveal({ children, delay = 0, className = '' }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.15 }
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      style={{ transitionDelay: visible ? `${delay}ms` : '0ms' }}
      className={`transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
        visible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0 motion-reduce:translate-y-0 motion-reduce:opacity-100'
      } ${className}`}
    >
      {children}
    </div>
  )
}
