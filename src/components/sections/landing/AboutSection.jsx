import { useLayoutEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowUpRight, Award, ChevronRight, Compass, Globe2, Headset, Leaf, Smile, Star } from 'lucide-react'
import { GREEN, WRAP, YELLOW, unsplash, Img, Tag, Pill } from './landingShared'

gsap.registerPlugin(ScrollTrigger)

const EASE = [0.22, 1, 0.36, 1]
const TITLE = 'We make travel simple, so you can just go'

const STATS = [
  { to: 98, suffix: '%', label: 'Trip happiness', icon: Smile },
  { to: 565, suffix: '+', label: 'Curated trips', icon: Compass },
  { to: 60, suffix: '+', label: 'Countries covered', icon: Globe2 },
  { to: 100, suffix: '+', label: 'Local planners', icon: Headset },
]

const TABS = {
  'Our history': 'For 12 years we have planned trips for families, friends and teams, with the same promise on every one: no surprises.',
  'Our mission': 'Make travel simple. You tell us who is coming and what you love, and we handle the rest.',
  'Our vision': 'A world where planning a trip takes minutes, and a local guide is always one message away.',
}

const POINTS = ['Stays, transport and guides in one plan', 'A fixed price before you pay', 'A planner you can message at any hour']
const AVATARS = ['1494790108377-be9c29b29330', '1500648767791-00dcc994a43e', '1438761681033-6461ffad8d80']

// One shared look for every card so edges, radius and height line up
const CARD = 'ab-tile relative h-full overflow-hidden rounded-3xl'

export default function AboutSection() {
  const root = useRef(null)
  const [tab, setTab] = useState('Our history')

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap
          .timeline({ defaults: { ease: 'power3.out' }, scrollTrigger: { trigger: root.current, start: 'top 60%', once: true } })
          .from('.ab-title', { yPercent: 115, duration: 1.1 }, 0)
          .from('.ab-line', { scaleX: 0, duration: 1 }, 0.3)
          .from('.ab-word', { yPercent: 115, duration: 1, stagger: 0.06 }, 0.2)
          .from('.ab-fade', { opacity: 0, y: 22, duration: 0.8, stagger: 0.1 }, 0.35)
          .fromTo('.ab-tile', { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.2, stagger: 0.14 }, 0.3)
          .from('.ab-img', { scale: 1.3, duration: 1.6, stagger: 0.14 }, 0.3)
          .from('.ab-stat', { opacity: 0, y: 24, duration: 0.8, stagger: 0.1 }, 0.9)

        gsap.utils.toArray('.ab-count').forEach((el) => {
          const s = { v: 0 }
          gsap.to(s, {
            v: Number(el.dataset.to), duration: 1.8, ease: 'power2.out',
            scrollTrigger: { trigger: el, start: 'top 95%', once: true },
            onUpdate: () => { el.textContent = Math.round(s.v) },
          })
        })

        gsap.to('.ab-par', {
          yPercent: -7, ease: 'none',
          scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true },
        })
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={root} id="about" className="relative overflow-hidden bg-transparent pb-20 pt-6 text-[#0d4a3a] md:pb-24 md:pt-8">
      <div className={`${WRAP} flex flex-col gap-12 md:gap-16`}>
        {/* Page title */}
        <header className="text-center">
          <nav aria-label="Breadcrumb" className="ab-fade mb-2 inline-flex items-center gap-2 text-xs font-medium">
            <a href="#home" className="text-[#0d4a3a]/60 transition-colors hover:text-[#0d4a3a]">Home</a>
            <ChevronRight className="h-3 w-3 text-[#0d4a3a]/40" />
            <span aria-current="page">About us</span>
          </nav>
          <h1 className="text-2xl font-semibold leading-tight md:text-3xl text-[#063a2f]">
            <span className="inline-block overflow-hidden align-bottom">
              <span className="ab-title inline-block">About us</span>
            </span>
          </h1>
          <span className="ab-line mx-auto mt-3 block h-[3px] w-14 rounded-full" style={{ background: YELLOW }} />
        </header>

        {/* Row 1: heading + tabs (left) / copy + button (right), bottoms aligned */}
        <div className="grid items-end gap-8 lg:grid-cols-12 lg:gap-x-6">
          <div className="lg:col-span-7">
            <div className="ab-fade"><Tag>Who we are</Tag></div>
            <h2 className="font-montserrat text-[clamp(2.25rem,3.2vw,2.75rem)] font-bold leading-[1.15] text-[#063a2f]" aria-label={TITLE}>
              {TITLE.split(' ').map((w, i) => (
                <span key={i} aria-hidden="true" className="mr-[0.25em] inline-block overflow-hidden align-bottom">
                  <span className="ab-word inline-block">{w}</span>
                </span>
              ))}
            </h2>
            <div className="ab-fade mt-6 inline-flex gap-1 rounded-full border border-white/90 bg-white/70 p-1 shadow-sm backdrop-blur-xl" role="tablist">
              {Object.keys(TABS).map((t) => (
                <button key={t} role="tab" aria-selected={tab === t} onClick={() => setTab(t)} className="relative rounded-full px-5 py-2 text-sm font-medium">
                  {tab === t && (
                    <motion.span layoutId="ab-tab" className="absolute inset-0 rounded-full shadow-sm" style={{ background: YELLOW }} transition={{ duration: 0.45, ease: EASE }} />
                  )}
                  <span className="relative z-10">{t}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="ab-fade lg:col-span-5">
            <div className="min-h-[5.25rem]">
              <AnimatePresence mode="wait" initial={false}>
                <motion.p key={tab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.35 }} className="font-poppins text-base md:text-lg font-normal text-[#0d4a3a]/80 leading-relaxed">
                  {TABS[tab]}
                </motion.p>
              </AnimatePresence>
            </div>
            <div className="mt-5"><Pill href="#services" dark>More about us</Pill></div>
          </div>
        </div>

        {/* Row 2: three equal-height cards on the same 12-column grid */}
        <div className="grid gap-4 lg:h-[420px] lg:grid-cols-12 lg:gap-6">
          <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.4 }} className="aspect-[4/3] lg:col-span-5 lg:aspect-auto">
            <div className={CARD}>
              <div className="ab-par absolute -inset-y-[8%] inset-x-0">
                <Img src={unsplash('1488646953014-85cb44e25828', 1400)} alt="Travellers on a mountain trail" className="ab-img h-full w-full object-cover" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10" />
              <div className="absolute left-5 top-5 flex items-center gap-2 rounded-full border border-white/80 bg-white/85 px-4 py-2 text-xs font-semibold backdrop-blur shadow-sm">
                <Award className="h-4 w-4" style={{ color: GREEN }} /> Best travel planner 2024
              </div>
              <div className="absolute bottom-5 left-5 text-white">
                <p className="font-montserrat text-5xl font-bold leading-none md:text-6xl">12+</p>
                <p className="font-poppins mt-1 text-sm font-normal text-white/85">Years of experience</p>
              </div>
            </div>
          </motion.div>

          <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.4 }} className="aspect-[4/3] lg:col-span-3 lg:aspect-auto">
            <div className={CARD}>
              <Img src={unsplash('1476514525535-07fb3b4ae5f1', 900)} alt="A local guide smiling in a garden" className="ab-img h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
              <div className="absolute right-4 top-4 grid h-20 w-20 place-items-center rounded-full border border-white/80 bg-white/85 shadow-lg backdrop-blur-md">
                <motion.svg viewBox="0 0 100 100" className="h-full w-full" animate={{ rotate: 360 }} transition={{ duration: 18, repeat: Infinity, ease: 'linear' }} aria-hidden="true">
                  <defs><path id="ab-circle" d="M50,50 m-36,0 a36,36 0 1,1 72,0 a36,36 0 1,1 -72,0" /></defs>
                  <text fontSize="10" fontWeight="600" letterSpacing="1.5" fill={GREEN}>
                    <textPath href="#ab-circle">TRAVEL SIMPLE • JUST GO • TRAVEL SIMPLE •</textPath>
                  </text>
                </motion.svg>
                <ArrowUpRight className="absolute h-5 w-5" style={{ color: GREEN }} />
              </div>
              <p className="font-poppins absolute inset-x-5 bottom-5 text-sm font-normal text-white">A local guide waits for you in every destination.</p>
            </div>
          </motion.div>

          <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.4 }} className="lg:col-span-4">
            <div className={`${CARD} flex flex-col justify-between rounded-3xl border border-white/90 bg-white/75 p-6 text-[#0d4a3a] shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-xl`}>
              <div>
                <p className="font-montserrat text-[clamp(1.25rem,1.6vw,1.5rem)] font-semibold text-[#063a2f]">Why travellers pick us</p>
                <ul className="font-poppins mt-4 space-y-2.5 text-sm md:text-base font-normal text-[#0d4a3a]/85">
                  {POINTS.map((b) => (
                    <li key={b} className="flex items-center gap-3">
                      <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full" style={{ background: YELLOW }}>
                        <Leaf className="h-3.5 w-3.5" style={{ color: GREEN }} />
                      </span>
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-5 flex items-center justify-between border-t border-slate-200/60 pt-4">
                <div className="flex items-center gap-3">
                  <p className="text-3xl font-semibold leading-none text-[#063a2f]">4.9</p>
                  <div>
                    <div className="flex">
                      {[0, 1, 2, 3, 4].map((n) => (
                        <motion.span key={n} initial={{ opacity: 0, scale: 0 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: 1 + n * 0.08, type: 'spring', stiffness: 400, damping: 14 }}>
                          <Star className="h-3.5 w-3.5 fill-[#fbd75b] text-[#fbd75b]" />
                        </motion.span>
                      ))}
                    </div>
                    <p className="mt-0.5 text-xs text-slate-500">12,400 reviews</p>
                  </div>
                </div>
                <div className="flex -space-x-2">
                  {AVATARS.map((id) => <Img key={id} src={unsplash(id, 100)} alt="" className="h-9 w-9 rounded-full border-2 border-white object-cover" />)}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Row 3: stats strip, four equal columns */}
        <div className="grid grid-cols-2 rounded-3xl border border-white/90 bg-white/75 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-xl lg:grid-cols-4">
          {STATS.map((s, i) => (
            <div key={s.label} className={`ab-stat flex items-center gap-4 p-5 lg:px-8 ${i % 2 ? 'border-l border-[#0d4a3a]/10' : ''} ${i ? 'lg:border-l lg:border-[#0d4a3a]/10' : ''} ${i > 1 ? 'border-t border-[#0d4a3a]/10 lg:border-t-0' : ''}`}>
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full" style={{ background: YELLOW }}>
                <s.icon className="h-5 w-5" style={{ color: GREEN }} />
              </span>
              <div>
                <p className="text-3xl font-semibold leading-none md:text-4xl text-[#063a2f]">
                  <span className="ab-count" data-to={s.to}>{s.to}</span>{s.suffix}
                </p>
                <p className="mt-1 text-sm text-[#0d4a3a]/65">{s.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}