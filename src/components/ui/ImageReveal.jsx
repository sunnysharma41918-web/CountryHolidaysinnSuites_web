import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function ImageReveal({ src, alt, className = '' }) {
  const wrapper = useRef(null)

  useEffect(() => {
    const element = wrapper.current
    if (!element) return undefined

    const ctx = gsap.context(() => {
      gsap.fromTo(
        element,
        { autoAlpha: 0, y: 40, scale: 1.04 },
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: element,
            start: 'top 80%',
          },
        },
      )
    }, element)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={wrapper} className={`overflow-hidden rounded-[2rem] ${className}`}>
      <img src={src} alt={alt} className="h-full w-full object-cover transition duration-700 hover:scale-105" />
    </div>
  )
}
