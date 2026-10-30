import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { ArrowRight } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

export const EASE = [0.22, 1, 0.36, 1]
export const GREEN = '#297f33'
export const DEEP = '#1e5f26'
export const YELLOW = '#fbd75b'
export const WRAP = 'mx-auto w-full max-w-[1320px] px-6 md:px-16'
export const SCREEN = 'relative flex items-center py-8 md:py-12'

export const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Varela&family=Varela+Round&family=Syne:wght@700;800&family=Righteous&family=Josefin+Sans:ital,wght@0,100..700;1,100..700&family=Nova+Flat&family=Teachers:wght@400..800&family=Outfit:wght@300;400;500;600;700&display=swap');

@font-face {
  font-family: 'Rader';
  src: local('PP Rader'),
       local('PPRader-Bold'),
       local('Rader-Bold'),
       local('Rader'),
       url('/fonts/Rader-Bold.woff2') format('woff2'),
       url('/fonts/Rader.woff2') format('woff2'),
       url('/fonts/Rader.otf') format('opentype'),
       url('/fonts/Rader.ttf') format('truetype');
  font-weight: 400 900;
  font-style: normal;
  font-display: swap;
}

.lp { font-family: 'Varela', 'Varela Round', system-ui, sans-serif; }
.font-nova { font-family: 'Nova Flat', system-ui, sans-serif !important; }
.font-teachers { font-family: 'Teachers', system-ui, sans-serif !important; }
.font-josefin { font-family: 'Josefin Sans', system-ui, sans-serif !important; }
.font-righteous { font-family: 'Righteous', cursive, sans-serif !important; }
.font-rader { font-family: 'Rader', 'PP Rader', 'Syne', 'Righteous', sans-serif !important; }
.font-varela { font-family: 'Varela', 'Varela Round', sans-serif !important; }
.lp-marquee { display: flex; width: max-content; animation: lp-marquee var(--dur, 40s) linear infinite; }
.lp-marquee[data-dir='right'] { animation-direction: reverse; }
@keyframes lp-marquee { to { transform: translateX(-50%); } }
.lp-arch { border-radius: 999px 999px 0 0; }
.lp :focus-visible { outline: 2px solid ${YELLOW}; outline-offset: 3px; }
.lp-no-scrollbar::-webkit-scrollbar { display: none; }
.lp-no-scrollbar { scrollbar-width: none; }
@media (prefers-reduced-motion: reduce) { .lp-marquee { animation: none; } }

/* Signature multi-colored dark shadow combining charcoal, emerald green, and gold */
.lp-shadow-combo {
  box-shadow: 0 14px 35px -10px rgba(11, 31, 18, 0.14), 0 0 25px -4px rgba(41, 127, 51, 0.11), 0 4px 15px -2px rgba(251, 215, 91, 0.08);
}
.lp-shadow-combo:hover {
  box-shadow: 0 22px 48px -10px rgba(11, 31, 18, 0.22), 0 0 35px -2px rgba(41, 127, 51, 0.18), 0 6px 20px -2px rgba(251, 215, 91, 0.14);
}
.lp-shadow-combo-dark {
  box-shadow: 0 18px 45px -10px rgba(0, 0, 0, 0.5), 0 0 30px rgba(41, 127, 51, 0.25), 0 4px 18px rgba(251, 215, 91, 0.12);
}
.lp-shadow-combo-dark:hover {
  box-shadow: 0 26px 55px -8px rgba(0, 0, 0, 0.65), 0 0 42px rgba(41, 127, 51, 0.4), 0 6px 22px rgba(251, 215, 91, 0.2);
}
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
    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
    })
    lenis.on('scroll', ScrollTrigger.update)
    const tick = (t) => lenis.raf(t * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(500, 33)
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

/* Premium typography eyebrow badge (Nova Flat, Teachers, Josefin Sans, Righteous, Rader, Varela) */
export const Tag = ({ children, light, font = 'nova' }) => {
  const fontClass =
    font === 'teachers'
      ? 'font-teachers font-extrabold'
      : font === 'josefin'
      ? 'font-josefin font-bold'
      : font === 'righteous'
      ? 'font-righteous font-bold'
      : font === 'rader'
      ? 'font-rader font-bold'
      : font === 'varela'
      ? 'font-varela'
      : 'font-nova'

  return (
    <span className={`mb-2.5 inline-flex items-center gap-2.5 ${fontClass} text-xs sm:text-[13px] uppercase tracking-[0.24em] ${
      light ? 'text-[#fbd75b]' : 'text-[#297f33]'
    }`}>
      <span className="h-2 w-2 rounded-full shadow-xs" style={{ background: light ? YELLOW : GREEN }} />
      <span>{children}</span>
    </span>
  )
}

export const Pill = ({ children, dark, className = '', ...p }) => (
  <motion.a
    whileHover={{ scale: 1.04 }}
    whileTap={{ scale: 0.97 }}
    {...p}
    className={`inline-flex items-center gap-3 rounded-full py-2 pl-6 pr-2 text-sm font-semibold shadow-sm transition-all duration-300 ${
      dark
        ? 'border border-[#297f33]/40 bg-[#297f33] text-white hover:bg-[#206629]'
        : 'border border-[#297f33]/20 bg-white/90 text-[#297f33] backdrop-blur-md hover:bg-white hover:shadow-md'
    } ${className}`}
    style={dark ? undefined : { background: YELLOW }}
  >
    {children}
    <span className="grid h-9 w-9 place-items-center rounded-full shadow-sm" style={{ background: dark ? YELLOW : GREEN, color: dark ? GREEN : '#fff' }}>
      <ArrowRight className="h-4 w-4" />
    </span>
  </motion.a>
)
