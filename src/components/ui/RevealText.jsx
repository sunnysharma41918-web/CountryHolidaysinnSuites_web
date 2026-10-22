import { useEffect, useRef } from 'react'
import gsap from 'gsap'

export default function RevealText({ children, className = '' }) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return undefined

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: 'power3.out' },
      )
    }, el)

    return () => ctx.revert()
  }, [])

  return <span ref={ref} className={className}>{children}</span>
}
