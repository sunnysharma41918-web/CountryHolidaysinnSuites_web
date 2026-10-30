import { useLayoutEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Compass, Globe2, Headset, Smile } from 'lucide-react'
import { GREEN, WRAP, YELLOW, Pill, Tag } from './landingShared'

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
  'Our history': 'For 12 years we have planned trips for families, friends and teams, with the same promise on every one: no surprises. What began as a two-person desk helping friends find a good stay has grown into a team of local planners across more than 60 countries.',
  'Our mission': 'Make travel simple. You tell us who is coming and what you love, and we handle the rest, from the first idea to the ride home. Every plan is built around your pace, your budget and the people travelling with you.',
  'Our vision': 'A world where planning a trip takes minutes, and a local guide is always one message away. We want every traveller to arrive relaxed, spend time on the things they came for, and head home with stories rather than stress.',
}

// Shared supporting copy (replaces the old "Why travellers pick us" card)
const SUPPORT = 'Every plan brings stays, transport and guides together in one place, with a fixed price shown before you pay and a planner you can message at any hour. No hidden fees, no last-minute changes, just a trip that runs the way we said it would.'

export default function AboutSection() {
  const root = useRef(null)
  const [tab, setTab] = useState('Our history')

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap
          .timeline({ defaults: { ease: 'power3.out' }, scrollTrigger: { trigger: root.current, start: 'top 60%', once: true } })
          .from('.ab-word', { yPercent: 115, duration: 1, stagger: 0.06 }, 0.1)
          .from('.ab-fade', { opacity: 0, y: 22, duration: 0.8, stagger: 0.1 }, 0.35)
          .from('.ab-stat', { opacity: 0, y: 24, duration: 0.8, stagger: 0.1 }, 0.9)

        gsap.utils.toArray('.ab-count').forEach((el) => {
          const s = { v: 0 }
          gsap.to(s, {
            v: Number(el.dataset.to), duration: 1.8, ease: 'power2.out',
            scrollTrigger: { trigger: el, start: 'top 95%', once: true },
            onUpdate: () => { el.textContent = Math.round(s.v) },
          })
        })

      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={root} id="about" className="relative overflow-hidden bg-transparent pb-8 pt-4 text-[#0d4a3a] md:pb-10 md:pt-6">
      <div className={`${WRAP} flex flex-col gap-6 md:gap-8`}>
        {/* Intro: one centred column — tag, heading, tabs, copy, button */}
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <div className="flex justify-center"><Tag>WHO WE ARE</Tag></div>
          <h2 className="font-rader font-bold tracking-tight mt-2 text-[clamp(2.15rem,3.6vw,3.15rem)] leading-[1.18] text-[#063a2f]" aria-label={TITLE}>
            {TITLE.split(' ').map((w, i) => (
              <span key={i} aria-hidden="true" className="mr-[0.25em] inline-block overflow-hidden align-bottom">
                <span className="ab-word inline-block">{w}</span>
              </span>
            ))}
          </h2>

          <div className="ab-fade mt-5 inline-flex max-w-full overflow-x-auto gap-1 rounded-full border border-white/90 bg-white/70 p-1 shadow-sm backdrop-blur-xl" role="tablist">
            {Object.keys(TABS).map((t) => (
              <button key={t} role="tab" aria-selected={tab === t} onClick={() => setTab(t)} className="relative shrink-0 rounded-full px-3.5 sm:px-5 py-1.5 sm:py-2 text-xs sm:text-sm font-medium">
                {tab === t && (
                  <motion.span layoutId="ab-tab" className="absolute inset-0 rounded-full shadow-sm" style={{ background: YELLOW }} transition={{ duration: 0.45, ease: EASE }} />
                )}
                <span className="relative z-10 font-varela font-bold">{t}</span>
              </button>
            ))}
          </div>

          <div className="ab-fade mt-4 w-full">
            <div className="min-h-[7.5rem] md:min-h-[5.5rem]">
              <AnimatePresence mode="wait" initial={false}>
                <motion.p key={tab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.35 }} className="font-varela text-base md:text-lg font-normal text-[#0d4a3a]/80 leading-relaxed">
                  {TABS[tab]}
                </motion.p>
              </AnimatePresence>
            </div>
            <p className="font-varela mt-3 text-sm md:text-base font-normal leading-relaxed text-[#0d4a3a]/70">{SUPPORT}</p>
            <div className="mt-4 flex justify-center"><Pill href="#services" dark className="font-varela">More about us</Pill></div>
          </div>
        </div>

        {/* Stats strip, four equal columns */}
        <div className="grid grid-cols-2 rounded-2xl sm:rounded-3xl border border-[#297f33] bg-[#297f33] shadow-[0_16px_40px_-12px_rgba(41,127,51,0.35)] backdrop-blur-xl lg:grid-cols-4 transition-all">
          {STATS.map((s, i) => (
            <div key={s.label} className={`ab-stat flex items-center gap-2.5 sm:gap-4 p-3.5 sm:p-5 lg:px-8 ${i % 2 ? 'border-l border-white/15' : ''} ${i ? 'lg:border-l lg:border-white/15' : ''} ${i > 1 ? 'border-t border-white/15 lg:border-t-0' : ''}`}>
              <span className="grid h-10 w-10 sm:h-12 sm:w-12 shrink-0 place-items-center rounded-full shadow-xs" style={{ background: YELLOW }}>
                <s.icon className="h-4 w-4 sm:h-5 sm:w-5" style={{ color: GREEN }} />
              </span>
              <div>
                <p className="font-varela text-2xl sm:text-3xl font-bold leading-none md:text-4xl text-white">
                  <span className="ab-count" data-to={s.to}>{s.to}</span>{s.suffix}
                </p>
                <p className="font-varela mt-1 text-xs sm:text-sm text-white/90">{s.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
