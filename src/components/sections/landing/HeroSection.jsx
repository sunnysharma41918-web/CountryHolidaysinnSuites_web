import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react'
import { unsplash, Img } from './landingShared'
import travelDoodlesGreen from '../../../assets/travel-doodles-green.png'

gsap.registerPlugin(ScrollTrigger)

const EASE = [0.22, 1, 0.36, 1]

// Each slide: full-bleed background + the thumbnail shown in the "Most Visited" card
const DESTINATIONS = [
  { name: 'Ha Long Bay, Vietnam', img: '1528127269322-539801943592' },
  { name: 'Nusa Lembongan, Bali', img: '1537996194471-e657df975ab4' },
  { name: 'Oia, Santorini', img: '1533105079780-92b9be482077' },
  { name: 'Engadin, Swiss Alps', img: '1506905925346-21bda4d32df4' },
  { name: 'Gion, Kyoto', img: '1493976040374-85c8e12f0c0e' },
]

const STATS = [
  { to: 1.2, dec: 1, suffix: 'M+', label: 'Trips planned seamlessly' },
  { to: 150, dec: 0, suffix: '+', label: 'Curated destinations' },
  { to: 4.5, dec: 1, suffix: '', label: 'Traveller satisfaction' },
]

const Facebook = (p) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
    <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
  </svg>
)

const Instagram = (p) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
  </svg>
)

const XTwitter = (p) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
)

const TikTok = (p) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
    <path d="M16.6 3a5.4 5.4 0 0 0 4.2 4.7v3.3a8.6 8.6 0 0 1-4.2-1.2v6.2a6.2 6.2 0 1 1-6.2-6.2c.3 0 .6 0 .9.1v3.4a2.9 2.9 0 1 0 2 2.7V3h3.3Z" />
  </svg>
)

const SOCIALS = [
  { label: 'Facebook', icon: Facebook },
  { label: 'Instagram', icon: Instagram },
  { label: 'TikTok', icon: TikTok },
  { label: 'X', icon: XTwitter },
]

const glass = 'border border-white/20 hover:border-[#297f33] bg-white/10 backdrop-blur-md transition-all duration-300'

export default function HeroSection() {
  const root = useRef(null)
  const [i, setI] = useState(0)
  const [paused, setPaused] = useState(false)
  const N = DESTINATIONS.length
  const nxt = DESTINATIONS[(i + 1) % N]

  // Autoplay (skipped when the visitor prefers reduced motion or hovers the card)
  useEffect(() => {
    if (paused || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = setInterval(() => setI((v) => (v + 1) % N), 6500)
    return () => clearInterval(id)
  }, [paused, i, N])

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap
          .timeline({ defaults: { ease: 'power4.out' } })
          .from('.hero-bg', { scale: 1.2, duration: 2.2 }, 0)
          .from('.hero-line', { yPercent: 110, duration: 1.1, stagger: 0.14 }, 0.3)
          .from('.hero-fade', { opacity: 0, y: 22, duration: 0.9, stagger: 0.12 }, 0.9)
          .from('.hero-stat', { opacity: 0, x: -48, duration: 1, stagger: 0.14 }, 1.1)
          .from('.hero-social', { opacity: 0, x: 32, duration: 0.9, stagger: 0.09 }, 1.2)
          .from('.hero-card', { opacity: 0, y: 48, duration: 1.1 }, 1.4)

        gsap.utils.toArray('.hero-count').forEach((el) => {
          const s = { v: 0 }
          const dec = Number(el.dataset.dec)
          gsap.to(s, {
            v: Number(el.dataset.to), duration: 2, delay: 1.2, ease: 'power2.out',
            onUpdate: () => { el.textContent = s.v.toFixed(dec) },
          })
        })

        gsap.to('.hero-bg', {
          yPercent: 10, ease: 'none',
          scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true },
        })
        gsap.to('.hero-content', {
          yPercent: -12, opacity: 0.2, ease: 'none',
          scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom 30%', scrub: true },
        })
      })
    }, root)
    return () => ctx.revert()
  }, [])

  const go = (d) => setI((v) => (v + d + N) % N)
  const lines = ['Discover your next', 'adventure']

  return (
    <section
      ref={root}
      id="home"
      // h-screen is the fallback; the inline style uses svh so mobile browser toolbars don't cut the hero
      style={{ height: '100svh' }}
      className="relative flex h-screen flex-col overflow-hidden bg-black text-white"
    >
      {/* Background Image */}
      <div className="hero-bg absolute inset-x-0 -top-[6%] h-[112%] overflow-hidden">
        <img
          src="/hero-mountain.jpg"
          alt="Hero background"
          className="h-full w-full object-cover"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/20 to-black/75" />

      {/* Travel doodle sketch elements merged with soft light shadow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[5] bg-repeat opacity-[0.08] invert [filter:drop-shadow(0_4px_12px_rgba(255,255,255,0.32))]"
        style={{
          backgroundImage: `url(${travelDoodlesGreen})`,
          backgroundSize: '580px auto',
        }}
      />

      {/* Centered headline (sized by viewport height so it always fits) */}
      <div className="hero-content absolute inset-0 z-10 mx-auto flex w-full max-w-4xl flex-col items-center justify-center px-6 py-24 text-center md:py-28">
        <h1 className="font-dm-serif text-[clamp(3.5rem,min(6.5vw,11vh),4.5rem)] font-normal uppercase leading-[1.02] tracking-tight">
          {lines.map((l) => (
            <span key={l} className="block overflow-hidden pb-1">
              <span className="hero-line block">{l}</span>
            </span>
          ))}
        </h1>
        <p className="hero-fade font-poppins mt-4 max-w-xl text-base font-normal text-white/90 md:mt-5 md:text-lg">
          Explore breathtaking destinations, curated experiences, and travel effortlessly.
        </p>
        <motion.a
          href="/vacation-packages"
          initial="rest"
          whileHover="hover"
          whileTap={{ scale: 0.97 }}
          className="hero-fade mt-6 inline-flex items-center gap-4 rounded-full bg-white py-2 pl-7 pr-2 text-sm font-semibold text-black md:mt-[4vh]"
        >
          Start Exploring
          <motion.span
            variants={{ rest: { rotate: 0, scale: 1 }, hover: { rotate: 45, scale: 1.08 } }}
            transition={{ duration: 0.35, ease: EASE }}
            className="grid h-11 w-11 place-items-center rounded-full bg-black text-white"
          >
            <ArrowUpRight className="h-5 w-5" />
          </motion.span>
        </motion.a>
      </div>

      {/* Social rail */}
      <ul className="absolute right-5 top-1/2 z-10 hidden -translate-y-1/2 flex-col gap-3 md:flex">
        {SOCIALS.map((s) => (
          <li key={s.label} className="hero-social">
            <motion.a
              href="#"
              aria-label={s.label}
              whileHover={{ scale: 1.15, backgroundColor: 'rgba(255,255,255,0.9)', color: '#000' }}
              className={`grid h-10 w-10 place-items-center rounded-full ${glass}`}
            >
              <s.icon className="h-4 w-4" />
            </motion.a>
          </li>
        ))}
      </ul>

      {/* Bottom row: stats + most visited (never shrinks, so it always stays on screen) */}
      <div className="relative z-10 mt-auto flex shrink-0 flex-col justify-between gap-4 px-5 pb-5 md:flex-row md:items-end md:gap-6 md:px-8 md:pb-8">
        <ul className="grid grid-cols-3 gap-2 md:grid-cols-1">
          {STATS.map((s) => (
            <li
              key={s.label}
              className={`hero-stat flex flex-col gap-1 rounded-xl px-4 py-3 md:w-64 md:flex-row md:items-center md:gap-4 md:py-2 ${glass}`}
            >
              <span className="text-2xl font-bold md:text-3xl">
                <span className="hero-count" data-to={s.to} data-dec={s.dec}>{s.to}</span>{s.suffix}
              </span>
              <span className="text-[11px] leading-tight text-white/80 md:max-w-[7rem] md:text-sm">{s.label}</span>
            </li>
          ))}
        </ul>

        {/* Hidden on mobile and on very short windows; scales with screen height otherwise */}
        <div
          className="hero-card hidden w-[clamp(220px,34vh,300px)] md:[@media(min-height:620px)]:block"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <p className="mb-2 text-right text-sm font-medium text-white/90">Most Visited</p>
          <div className={`rounded-2xl p-2 ${glass}`}>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label={`Show ${nxt.name}`}
              className="group relative block aspect-[16/10] w-full overflow-hidden rounded-xl"
            >
              <AnimatePresence initial={false} mode="popLayout">
                <motion.div
                  key={nxt.name}
                  className="absolute inset-0"
                  initial={{ opacity: 0, scale: 1.15 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8, ease: EASE }}
                >
                  <Img src={unsplash(nxt.img, 700)} alt="" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                </motion.div>
              </AnimatePresence>
            </button>
            <div className="flex items-center justify-between px-1 pb-1 pt-2 text-sm font-medium" aria-live="polite">
              <button
                type="button"
                onClick={() => go(-1)}
                aria-label="Previous destination"
                className="grid h-8 w-8 place-items-center rounded-full transition-colors hover:bg-white hover:text-black"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={nxt.name}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3 }}
                >
                  {nxt.name}
                </motion.span>
              </AnimatePresence>
              <button
                type="button"
                onClick={() => go(1)}
                aria-label="Next destination"
                className="grid h-8 w-8 place-items-center rounded-full transition-colors hover:bg-white hover:text-black"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
            <div className="mx-1 mb-1 h-[2px] overflow-hidden rounded-full bg-white/25" aria-hidden="true">
              <motion.div
                key={`${i}-${paused}`}
                className="h-full bg-[#297f33]"
                initial={{ width: 0 }}
                animate={{ width: paused ? 0 : '100%' }}
                transition={{ duration: paused ? 0 : 6.5, ease: 'linear' }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}