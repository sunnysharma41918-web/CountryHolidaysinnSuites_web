import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { ArrowRight, Leaf } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

export const EASE = [0.22, 1, 0.36, 1]
export const GREEN = '#0d4a3a'
export const DEEP = '#093a2e'
export const YELLOW = '#fbd75b'
export const WRAP = 'mx-auto w-full max-w-[1320px] px-6 md:px-16'
export const SCREEN = 'relative flex min-h-screen items-center py-20 md:py-16' // every section fills the viewport

export const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap');
.lp{font-family:'Outfit',system-ui,sans-serif}
.lp-marquee{display:flex;width:max-content;animation:lp-marquee var(--dur,40s) linear infinite}
.lp-marquee[data-dir='right']{animation-direction:reverse}
@keyframes lp-marquee{to{transform:translateX(-50%)}}
.lp-arch{border-radius:999px 999px 0 0}
.lp :focus-visible{outline:2px solid ${YELLOW};outline-offset:3px}
.lp-no-scrollbar::-webkit-scrollbar{display:none}.lp-no-scrollbar{scrollbar-width:none}
@media (prefers-reduced-motion:reduce){.lp-marquee{animation:none}}
`

export const unsplash = (id, w = 1200) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`

export function Img({ src, alt = '', className = '', eager = false }) {
  const [failed, setFailed] = useState(false)
  if (failed) return <div role="img" aria-label={alt} className={className} style={{ background: `linear-gradient(135deg,${GREEN},${DEEP})` }} />
  return <img src={src} alt={alt} loading={eager ? 'eager' : 'lazy'} decoding="async" onError={() => setFailed(true)} className={className} />
}

export function useSmoothScroll() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const lenis = new Lenis({ lerp: 0.09, smoothWheel: true, anchors: true })
    lenis.on('scroll', ScrollTrigger.update)
    const tick = (t) => lenis.raf(t * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)
    const refresh = () => ScrollTrigger.refresh()
    window.addEventListener('load', refresh)
    document.fonts?.ready.then(refresh)
    return () => {
      window.removeEventListener('load', refresh)
      gsap.ticker.remove(tick)
      lenis.destroy()
    }
  }, [])
}

export const Reveal = ({ children, delay = 0, className = '' }) => (
  <motion.div
    className={className}
    initial={{ opacity: 0, y: 36 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-12%' }}
    transition={{ duration: 0.9, ease: EASE, delay }}
  >
    {children}
  </motion.div>
)

export const Tag = ({ children, light }) => (
  <span className={`mb-3 inline-flex items-center gap-2 rounded-full border px-3.5 py-1 text-xs font-semibold shadow-[0_2px_10px_rgba(13,74,58,0.05)] backdrop-blur-md ${
    light
      ? 'border-white/30 bg-white/20 text-white'
      : 'border-emerald-700/15 bg-white/80 text-[#0d4a3a]'
  }`}>
    <Leaf className="h-3.5 w-3.5" style={{ color: light ? YELLOW : GREEN }} />
    {children}
  </span>
)

export const Pill = ({ children, dark, className = '', ...p }) => (
  <motion.a
    whileHover={{ scale: 1.04 }}
    whileTap={{ scale: 0.97 }}
    {...p}
    className={`inline-flex items-center gap-3 rounded-full py-2 pl-6 pr-2 text-sm font-semibold shadow-sm transition-all duration-300 ${
      dark
        ? 'border border-[#0d4a3a]/30 bg-[#0d4a3a] text-white hover:bg-[#093a2e]'
        : 'border border-white/90 bg-white/85 text-[#0d4a3a] backdrop-blur-md hover:bg-white hover:shadow-md'
    } ${className}`}
    style={dark ? undefined : { background: YELLOW }}
  >
    {children}
    <span className="grid h-9 w-9 place-items-center rounded-full shadow-sm" style={{ background: dark ? YELLOW : GREEN, color: dark ? GREEN : '#fff' }}>
      <ArrowRight className="h-4 w-4" />
    </span>
  </motion.a>
)
