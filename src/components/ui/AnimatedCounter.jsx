import { useEffect, useRef, useState } from 'react'

export default function AnimatedCounter({ value, suffix = '', duration = 1600, label }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)

  useEffect(() => {
    const node = ref.current
    if (!node) return undefined

    let start = 0
    const endValue = Number(value)
    const frame = () => {
      const progress = Math.min(1, (performance.now() - start) / duration)
      const eased = 1 - Math.pow(1 - progress, 3)
      const current = Math.floor(endValue * eased)
      setCount(current)

      if (progress < 1) {
        requestAnimationFrame(frame)
      }
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          start = performance.now()
          requestAnimationFrame(frame)
          observer.disconnect()
        }
      },
      { threshold: 0.3 },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [value, duration])

  return (
    <div ref={ref} className="text-center">
      <div className="font-display text-5xl text-midnight sm:text-6xl">
        {count}
        {suffix}
      </div>
      {label && <p className="mt-3 text-xs uppercase tracking-[0.22em] text-charcoal/70">{label}</p>}
    </div>
  )
}
