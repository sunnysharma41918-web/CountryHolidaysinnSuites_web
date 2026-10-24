import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowRight, ArrowUpRight, Award, HeartHandshake, MapPin, PhoneCall, Plus, ShieldCheck, Users } from 'lucide-react'
import PageTransition from '../components/layout/PageTransition'
import { brand } from '../data/brand'
import heroModel from '../assets/images/chis-hero-model.png'
import employeesImg from '../assets/images/Employees.avif'
import propertiesImg from '../assets/images/Collaborative properties.jpg'
import associatesImg from '../assets/images/Travel associates.jpg'
import establishedImg from '../assets/images/Established.jpg'

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger)
const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect

/* CHIS palette: green #096c27 · leaf #b3d565 · white · ink #0b1f12 · mist #f3f8e6 (colours unchanged) */

const HERO_IMG = heroModel
const STORY_IMGS = [
  'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1400&q=85',
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1400&q=85',
  '/hero-mountain.jpg',
]

/* darker shadows */
const SH = 'shadow-[0_28px_60px_-20px_rgba(6,40,16,0.55)]'
const SH_SM = 'shadow-[0_12px_28px_-10px_rgba(6,40,16,0.45)]'

const SECTIONS = [
  { id: 'top', label: 'Start' },
  { id: 'who', label: 'Who we are' },
  { id: 'numbers', label: 'Numbers' },
  { id: 'story', label: 'Story' },
  { id: 'drives', label: 'Purpose' },
  { id: 'unique', label: 'Why CHIS' },
  { id: 'enquire', label: 'Contact' },
]

const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
const scrollToId = (id) => document.getElementById(id)?.scrollIntoView({ behavior: reduced() ? 'auto' : 'smooth', block: 'start' })
const fmt = (v, plain) => (plain ? String(Math.round(v)) : Math.round(v).toLocaleString('en-US'))

const STATEMENT =
  'Country Holidays Inn and Suites Pvt. Ltd. is a travel company, established on December 21st, 2016 with one goal: budget travel packages for customers worldwide.'
const OBJECTIVE =
  'The prime objective in starting the company was to provide mesmerizing travel options with customized economical benefits to travellers, right under one roof. In short, CHIS was established to make its mark in providing the choicest hassle-free luxury travel experiences, which everyone can afford with ease.'

const STORY = [
  { tab: '2016', kicker: 'December 21st, 2016', title: 'It began with one simple goal.', body: 'Country Holidays Inn and Suites was established to provide budget travel packages to customers worldwide. We started our journey with only 20 employees onboard.' },
  { tab: 'Our people', kicker: 'The CHIS family', title: 'People are our backbone.', body: 'We consider CHIS our own family. Our employees work here with absolute dedication, united by the same passion, the same sincerity and the same mission, and we celebrate that togetherness year after year. They are a significant reason for our continuous growth.' },
  { tab: 'Today', kicker: 'Today', title: 'A family of 500+, across the globe.', body: 'With passion and diligence we have surpassed our vision. CHIS now spans 250 travel associates and 3,500 tie-up collaborative properties, and remains a time-saving option for customers whose only passion is travel.' },
]

const STATS = [
  { to: 500, suffix: '+', label: 'Employees', sub: 'Grown from a team of 20', image: employeesImg, badge: 'Our Team' },
  { to: 3500, suffix: '+', label: 'Collaborative properties', sub: 'Tie-up stays & resorts', image: propertiesImg, badge: 'Resorts & Stays' },
  { to: 250, label: 'Travel associates', sub: 'Across the globe', image: associatesImg, badge: 'Global Network' },
  { to: 2016, plain: true, label: 'Established', sub: 'On 21st December', image: establishedImg, badge: 'Founded 2016' },
]

const PANELS = [
  { label: 'Our value', title: 'We simplify the travel experience.', body: "Mesmerizing travel options with customized economical benefits, right under one roof. That's the promise behind everything we build.", theme: 'bg-[#b3d565] text-[#0b1f12]' },
  { label: 'Mission', title: 'Care and Convenience.', body: "'Care and Convenience' is the true spirit behind all our endeavors and services. We at Country Holidays Inn & Suites are driven by the zest to provide unmatched quality services and unparalleled travel experiences to all our precious customers. Our sense of hospitality lies foremost in seeing our customers happy and helping them create more and more meaningful memories with us, across their lifetime. The prime mission we strive for is simply to create bonds of trust and reliability, for everyone who has a dream to travel well.", theme: 'bg-white text-[#0b1f12]' },
  { label: 'Vision', title: 'Trust and reliability, across the globe.', body: "Apart from having more than 3,500 destinations under our belt and providing quality services to our esteemed customers and members, our vision is to expand our network of trust and reliability across the globe, stand tall with more domestic and international resorts in the coming future, and create new benchmarks for leisure and pleasure holidaying. We are committed to continuously improving our operations and enhancing our customers' experience.", theme: 'border border-white/30 bg-[#06501b] text-white' },
]

const UNIQUE = [
  { icon: Award, title: 'Award-winning', subtitle: 'Excellence recognized', body: 'Consistently ranked among the best agencies in Delhi NCR with Certificates of Excellence, Incorporation and Appreciation. Named multiple years running as one of the "Best Places to Work".', badge: 'Delhi NCR Top Rated', bg: 'bg-[#f3f8e6]', iconBg: 'bg-[#096c27] text-[#b3d565]' },
  { icon: Users, title: 'Passionate workers', subtitle: '500+ global associates', body: 'Country Holidays Inn & Suites has built its reputation on dedicated service and endurance. Our employees are passionately engaged in driving every journey to its optimum.', badge: 'People-First Culture', bg: 'bg-white', iconBg: 'bg-[#b3d565] text-[#096c27]' },
  { icon: ShieldCheck, title: 'Upright stance', subtitle: 'Integrity & resilience', body: 'Strategically positioned to diversify vacations, member needs and premium experiences across 3,500+ collaborative properties with transparency and reliability.', badge: 'Verified Standards', bg: 'bg-[#f3f8e6]', iconBg: 'bg-[#096c27] text-white' },
  { icon: HeartHandshake, title: 'Acquaintance', subtitle: 'Lifelong family bonds', body: 'We treat our travelers as cherished family members, not mere customers. Our sincere affection and lifelong care reflect how deeply connected we are with every journey.', badge: 'Heartfelt Hospitality', bg: 'bg-[#096c27] text-white', iconBg: 'bg-[#b3d565] text-[#096c27]', dark: true },
]

/* ------------------------------ pieces ------------------------------ */

function Magnetic({ children, strength = 0.35 }) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el || reduced() || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return undefined
    const xTo = gsap.quickTo(el, 'x', { duration: 0.7, ease: 'elastic.out(1, 0.45)' })
    const yTo = gsap.quickTo(el, 'y', { duration: 0.7, ease: 'elastic.out(1, 0.45)' })
    const move = (e) => {
      const r = el.getBoundingClientRect()
      xTo((e.clientX - (r.left + r.width / 2)) * strength)
      yTo((e.clientY - (r.top + r.height / 2)) * strength)
    }
    const leave = () => { xTo(0); yTo(0) }
    el.addEventListener('mousemove', move)
    el.addEventListener('mouseleave', leave)
    return () => {
      el.removeEventListener('mousemove', move)
      el.removeEventListener('mouseleave', leave)
      gsap.killTweensOf(el)
      gsap.set(el, { x: 0, y: 0 })
    }
  }, [strength])
  return <div ref={ref} className="inline-block">{children}</div>
}

/** Background geometric concentric rings matching CHIS brand motif */
function BgRings({ position = 'top-right', className = '' }) {
  const configs = {
    'top-right': {
      wrap: '-right-[14%] -top-[25%] h-[56vw] w-[56vw]',
      glow: '-right-[5%] -top-[10%]',
    },
    'top-left': {
      wrap: '-left-[14%] -top-[25%] h-[56vw] w-[56vw]',
      glow: '-left-[5%] -top-[10%]',
    },
    'bottom-right': {
      wrap: '-right-[14%] -bottom-[25%] h-[56vw] w-[56vw]',
      glow: '-right-[5%] -bottom-[10%]',
    },
  }
  const c = configs[position] || configs['top-right']

  return (
    <div aria-hidden="true" className={`pointer-events-none absolute inset-0 -z-10 overflow-hidden ${className}`}>
      <div className={`absolute h-[38vw] w-[38vw] rounded-full bg-[#b3d565]/10 blur-3xl ${c.glow}`} />
      <div className={`absolute ${c.wrap}`}>
        <div className="absolute inset-0 rounded-full border border-[#096c27]/15" />
        <div className="absolute inset-[14%] rounded-full border border-[#096c27]/15" />
        <div className="absolute inset-[28%] rounded-full border border-[#096c27]/15" />
      </div>
    </div>
  )
}

/** Responsive section container: natural flow on mobile/tablet, single-viewport on desktop */
function Sec({ id, labelledby, className = '', children }) {
  return (
    <section id={id} data-sec aria-labelledby={labelledby} className={`relative isolate flex min-h-[100svh] w-full flex-col overflow-hidden py-14 sm:py-20 lg:h-[100svh] lg:py-0 ${className}`}>
      <div className="mx-auto flex h-full min-h-0 w-full max-w-[90rem] flex-col justify-center px-4 pb-6 pt-10 sm:px-8 sm:pt-16 lg:px-12">{children}</div>
    </section>
  )
}

const H2 = 'font-nunito font-light leading-[0.95] tracking-[-0.05em]'

/** Masked line reveal. */
function Lines({ lines, className = '', accentClass = '', as: Tag = 'h2', id }) {
  return (
    <Tag id={id} className={`${H2} ${className}`} data-lines="">
      {lines.map((line, i) => (
        <span key={line} className="-mb-[0.12em] block overflow-hidden pb-[0.12em]">
          <span data-line className={`block ${i === lines.length - 1 ? accentClass : ''}`}>{line}</span>
        </span>
      ))}
    </Tag>
  )
}

function Pill({ children, onClick, to, dark, className = '' }) {
  const cls = `group inline-flex items-center gap-3 rounded-full py-2 pl-7 pr-2 text-sm font-semibold ${SH_SM} transition-transform hover:scale-[1.02] focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 ${dark ? 'bg-[#096c27] text-white' : 'bg-[#b3d565] text-[#0b1f12]'} ${className}`
  const icon = (
    <span className={`grid h-10 w-10 place-items-center rounded-full transition-transform duration-500 group-hover:rotate-[360deg] ${dark ? 'bg-[#b3d565] text-[#096c27]' : 'bg-[#096c27] text-white'}`}>
      <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
    </span>
  )
  return to ? <Link to={to} className={cls}>{children}{icon}</Link> : <button type="button" onClick={onClick} className={cls}>{children}{icon}</button>
}

function Count({ s, className = '' }) {
  return (
    <div className={`font-nunito font-light leading-none tracking-[-0.05em] ${className}`}>
      <span data-count data-to={s.to} data-plain={s.plain ? '1' : '0'}>{fmt(s.to, s.plain)}</span>
      {s.suffix && <span className="opacity-70">{s.suffix}</span>}
    </div>
  )
}

/* Value / Mission / Vision: one panel open at a time, in any screen size. */
function ValuePanels() {
  const [active, setActive] = useState(1)
  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3 lg:flex-row lg:gap-4">
      {PANELS.map((p, i) => {
        const on = active === i
        return (
          <article
            key={p.label}
            data-rise
            tabIndex={0}
            onMouseEnter={() => setActive(i)}
            onFocus={() => setActive(i)}
            onClick={() => setActive(i)}
            aria-expanded={on}
            className={`relative flex min-h-0 basis-0 cursor-pointer flex-col justify-between overflow-hidden rounded-[1.75rem] p-5 transition-[flex-grow] duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#096c27] sm:p-7 ${SH} ${on ? 'grow-[5] lg:grow-[2.6]' : 'grow-[1]'} ${p.theme}`}
          >
            <div className="flex items-start justify-between gap-3">
              <span className="text-xs font-semibold opacity-70">{p.label}</span>
              <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-full border border-current transition-transform duration-700 ${on ? 'rotate-45' : ''}`}>
                <Plus className="h-4 w-4" aria-hidden="true" />
              </span>
            </div>
            <div className="min-h-0">
              <h3 className="font-nunito text-[clamp(1.3rem,2.4vw,2.5rem)] font-light leading-[1.05] tracking-[-0.04em]">{p.title}</h3>
              {on && <p className="mt-3 text-[12.5px] leading-relaxed opacity-85 sm:text-sm lg:min-w-[22rem]">{p.body}</p>}
            </div>
          </article>
        )
      })}
    </div>
  )
}

/* ------------------------------ page ------------------------------ */

export default function AboutPage() {
  const rootRef = useRef(null)
  const [active, setActive] = useState(0)
  const [ch, setCh] = useState(0)
  const [paused, setPaused] = useState(false)
  const firstCh = useRef(true)

  const handleOpenBooking = (destination = 'General Inquiry') =>
    window.dispatchEvent(new CustomEvent('open-booking-modal', { detail: { destination, persons: '2 Persons', days: 'Membership & Holiday Consultation' } }))

  useIsoLayoutEffect(() => {
    const root = rootRef.current
    if (!root) return undefined
    const $ = (s) => gsap.utils.toArray(s, root)
    const mm = gsap.matchMedia(root)

    const spy = $('[data-sec]').map((el, i) =>
      ScrollTrigger.create({ trigger: el, start: 'top 55%', end: 'bottom 55%', onToggle: (s) => s.isActive && setActive(i) }),
    )

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.set('[data-progress]', { scaleX: 0, transformOrigin: '0% 50%' })
      gsap.to('[data-progress]', { scaleX: 1, ease: 'none', scrollTrigger: { trigger: root, start: 'top top', end: 'bottom bottom', scrub: 0.3 } })

      /* masked headline lines */
      $('[data-lines]').forEach((el) =>
        gsap.from(el.querySelectorAll('[data-line]'), { yPercent: 115, duration: 1.3, ease: 'expo.out', stagger: 0.12, delay: el.id === 'about-title' ? 0.15 : 0, scrollTrigger: { trigger: el, start: 'top 88%', once: true } }),
      )

      const fades = $('[data-fade]')
      gsap.set(fades, { opacity: 0, y: 28 })
      ScrollTrigger.batch(fades, { start: 'top 92%', once: true, onEnter: (b) => gsap.to(b, { opacity: 1, y: 0, duration: 1, ease: 'expo.out', stagger: 0.1 }) })

      const rise = $('[data-rise]')
      gsap.set(rise, { opacity: 0, y: 60 })
      ScrollTrigger.batch(rise, { start: 'top 92%', once: true, onEnter: (b) => gsap.to(b, { opacity: 1, y: 0, duration: 1.2, ease: 'expo.out', stagger: 0.14 }) })

      /* hero: image reveal */
      gsap.from('[data-hero-img]', { y: 50, opacity: 0, duration: 1.4, ease: 'expo.out', delay: 0.2 })
      gsap.to('[data-hero-rings]', { scale: 1.2, rotation: 18, ease: 'none', scrollTrigger: { trigger: '[data-hero]', start: 'top top', end: 'bottom top', scrub: true } })

      /* statement: words light up once */
      gsap.fromTo($('[data-sw]'), { opacity: 0.14 }, { opacity: 1, ease: 'none', stagger: 0.05, duration: 0.6, scrollTrigger: { trigger: '[data-statement]', start: 'top 80%', once: true } })

      /* count-up */
      $('[data-count]').forEach((el) => {
        const to = Number(el.dataset.to)
        const plain = el.dataset.plain === '1'
        const o = { v: plain ? 1990 : 0 }
        el.textContent = fmt(o.v, plain)
        ScrollTrigger.create({
          trigger: el, start: 'top 92%', once: true,
          onEnter: () => gsap.to(o, { v: to, duration: 2.2, ease: 'power3.out', onUpdate: () => { el.textContent = fmt(o.v, plain) } }),
        })
      })

      return () => $('[data-count]').forEach((el) => { el.textContent = fmt(Number(el.dataset.to), el.dataset.plain === '1') })
    })

    const refresh = () => ScrollTrigger.refresh()
    window.addEventListener('load', refresh)
    const t = setTimeout(refresh, 700)
    return () => {
      clearTimeout(t)
      window.removeEventListener('load', refresh)
      spy.forEach((s) => s.kill())
      mm.revert()
    }
  }, [])

  /* story: auto-advances, pauses on hover/focus */
  useEffect(() => {
    if (paused || reduced()) return undefined
    const id = setInterval(() => setCh((c) => (c + 1) % STORY.length), 7000)
    return () => clearInterval(id)
  }, [paused, ch])
  useEffect(() => {
    if (firstCh.current) { firstCh.current = false; return }
    if (reduced()) return
    gsap.fromTo('[data-ch-text]', { y: 22, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease: 'expo.out', stagger: 0.08, overwrite: 'auto' })
  }, [ch])

  const s = STORY[ch]

  return (
    <PageTransition>
      <div ref={rootRef} className="relative w-full overflow-x-clip bg-white text-[#0b1f12] antialiased selection:bg-[#b3d565] selection:text-[#0b1f12]">
        <div data-progress aria-hidden="true" className="fixed inset-x-0 top-0 z-[70] h-[3px] bg-[#b3d565]" />

        {/* side navigation */}
        <nav aria-label="Page sections" className="fixed right-4 top-1/2 z-[60] hidden -translate-y-1/2 flex-col items-end gap-3 lg:flex">
          {SECTIONS.map((x, i) => (
            <button key={x.id} type="button" onClick={() => scrollToId(x.id)} aria-label={`Go to ${x.label}`} aria-current={active === i} className="group flex items-center gap-3 focus:outline-none">
              <span className={`rounded-full bg-[#0b1f12] px-2.5 py-1 text-xs font-semibold text-white transition-all duration-300 ${active === i ? 'translate-x-0 opacity-100' : 'translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:opacity-100'}`}>{x.label}</span>
              <span className={`block rounded-full bg-[#0b1f12] shadow-[0_2px_6px_rgba(6,40,16,0.5)] transition-all duration-300 group-focus-visible:ring-2 group-focus-visible:ring-[#096c27] ${active === i ? 'h-7 w-2' : 'h-2 w-2 opacity-40 group-hover:opacity-100'}`} />
            </button>
          ))}
        </nav>

        {/* ============ 1. HERO ============ */}
        <section id="top" data-sec data-hero aria-labelledby="about-title" className="relative isolate flex min-h-[100svh] w-full flex-col overflow-hidden bg-[#096c27] text-white pt-16 sm:pt-20 lg:h-[100svh] lg:pt-0">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute -right-[15%] -top-[25%] h-[60vw] w-[60vw] rounded-full bg-[#b3d565]/20 blur-3xl" />
            <div data-hero-rings className="absolute right-[-12%] top-[8%] h-[52vw] w-[52vw]">
              <div className="absolute inset-0 rounded-full border border-white/15" />
              <div className="absolute inset-[12%] rounded-full border border-white/15" />
              <div className="absolute inset-[24%] rounded-full border border-white/15" />
            </div>
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,#06501b_0%,transparent_55%)]" />
          </div>

          <div className="mx-auto grid min-h-0 w-full max-w-[90rem] flex-1 items-end gap-6 px-4 pt-10 sm:px-8 sm:pt-16 lg:grid-cols-12 lg:gap-8 lg:px-12 lg:pt-20">
            <div className="pb-8 pt-4 sm:pb-14 lg:col-span-7 lg:pb-16">
              <Lines as="h1" id="about-title" lines={['Travel,', 'simplified.']} accentClass="italic text-[#b3d565]" className="text-[clamp(2.5rem,min(8.5vw,13svh),9rem)] leading-[0.9] tracking-[-0.055em]" />
              <p data-fade className="mt-4 max-w-xl text-sm font-light leading-relaxed text-white/85 sm:mt-5 sm:text-base lg:mt-8 lg:text-lg">
                Country Holidays Inn &amp; Suites is a time-saving option for people whose only passion is travel: mesmerizing options and customized economical benefits, all under one roof.
              </p>
              <div data-fade className="mt-6 flex flex-wrap items-center gap-3 lg:mt-9">
                <Magnetic><Pill to="/vacation-packages">View vacation packages</Pill></Magnetic>
                <Magnetic strength={0.25}>
                  <button type="button" onClick={() => handleOpenBooking('Membership Consultation')} className="inline-flex items-center gap-2.5 rounded-full border border-white/40 px-6 py-3 text-sm font-medium transition-colors hover:border-[#b3d565] hover:text-[#b3d565] focus:outline-none focus-visible:ring-2 focus-visible:ring-white">
                    <PhoneCall className="h-4 w-4" aria-hidden="true" /> Talk to us
                  </button>
                </Magnetic>
              </div>
            </div>

            <div className="relative mx-auto flex h-full min-h-0 w-full items-end justify-center lg:col-span-5 lg:justify-end">
              <div className="relative flex items-end justify-center lg:justify-end">
                <img
                  data-hero-img
                  src={HERO_IMG}
                  alt="CHIS holiday model"
                  className="pointer-events-none select-none block h-auto max-h-[46svh] sm:max-h-[62svh] lg:max-h-[74svh] w-auto max-w-full object-contain object-bottom"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ============ 2. WHO WE ARE ============ */}
        <Sec id="who" labelledby="who-title" className="bg-white">
          <BgRings position="top-right" />
          <h2 id="who-title" className="sr-only">Who we are</h2>
          <div className="grid min-h-0 items-center gap-6 lg:grid-cols-12 lg:gap-12">
            <p data-statement className="font-nunito text-[clamp(1.4rem,min(3.4vw,5.5svh),3.75rem)] font-light leading-[1.12] tracking-[-0.035em] lg:col-span-7">
              {STATEMENT.split(' ').map((w, i) => (
                <span key={i} data-sw className="inline-block pr-[0.25em]">{w}</span>
              ))}
            </p>
            <div data-rise className={`rounded-[2rem] bg-[#f3f8e6] p-6 sm:p-9 lg:col-span-5 ${SH}`}>
              <p className="font-nunito text-xl font-light tracking-[-0.03em] text-[#096c27] sm:text-2xl">Why we started</p>
              <p className="mt-3 text-[13px] leading-relaxed text-[#0b1f12]/75 sm:mt-4 sm:text-base">{OBJECTIVE}</p>
            </div>
          </div>
        </Sec>

        {/* ============ 3. NUMBERS ============ */}
        <Sec id="numbers" labelledby="numbers-title" className="bg-white">
          <BgRings position="top-left" />
          <div className="flex shrink-0 flex-wrap items-end justify-between gap-3 pb-5 sm:pb-8">
            <Lines id="numbers-title" lines={['Numbers that', 'tell our story.']} accentClass="italic text-[#096c27]" className="text-[clamp(1.85rem,min(5.4vw,8.5svh),5.5rem)]" />
            <p data-fade className="max-w-xs text-sm text-[#0b1f12]/65">Since 21st December 2016, one goal: budget travel packages for customers worldwide.</p>
          </div>
          <div className="grid min-h-0 flex-1 grid-cols-1 gap-3.5 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4 lg:gap-5">
            {STATS.map((x) => (
              <div
                key={x.label}
                data-rise
                className={`group relative isolate flex min-h-[170px] sm:min-h-0 flex-col justify-between overflow-hidden rounded-[1.75rem] p-5 sm:p-7 text-white ${SH}`}
              >
                {/* Full-bleed background photo */}
                <img
                  src={x.image}
                  alt={x.label}
                  className="pointer-events-none absolute inset-0 -z-20 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />

                {/* Dark emerald-to-black gradient overlay for readability & luxury depth */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-t from-[#04190b]/95 via-[#062410]/60 to-[#021007]/35 transition-opacity duration-300 group-hover:via-[#062410]/50"
                />

                {/* Glass badge chip */}
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 rounded-full border border-white/20 bg-black/40 px-3 py-1 text-[11px] font-medium tracking-wide text-white/95 backdrop-blur-md">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#b3d565]" aria-hidden="true" />
                    {x.badge}
                  </span>
                </div>

                {/* Counter & descriptive titles */}
                <div className="relative pt-6">
                  <Count s={x} className="text-[clamp(2.25rem,min(6vw,10svh),6.5rem)] font-light text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.6)]" />
                  <p className="mt-2 text-sm font-semibold tracking-wide text-[#b3d565] sm:text-base">{x.label}</p>
                  <p className="mt-0.5 text-xs leading-snug text-white/80 sm:text-sm">{x.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </Sec>

        {/* ============ 4. STORY ============ */}
        <Sec id="story" labelledby="story-title" className="bg-[#f3f8e6]">
          <BgRings position="bottom-right" />
          <div onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocus={() => setPaused(true)} onBlur={() => setPaused(false)} className="flex min-h-0 flex-1 flex-col gap-4 lg:gap-6">
            <Lines id="story-title" lines={['From a team of 20 to a global family.']} accentClass="italic text-[#096c27]" className="shrink-0 text-[clamp(1.6rem,min(4.2vw,7.5svh),4.5rem)]" />

            <div className="flex min-h-0 flex-1 flex-col gap-6 lg:grid lg:grid-cols-12 lg:grid-rows-1 lg:gap-10">
              <div data-rise className={`relative min-h-0 h-64 sm:h-80 lg:h-full overflow-hidden rounded-[1.75rem] bg-[#dfe9cf] lg:col-span-6 ${SH}`}>
                {STORY_IMGS.map((src, i) => (
                  <img key={src} src={src} alt="" loading="lazy" className={`absolute inset-0 h-full w-full object-cover transition-all duration-[1200ms] ease-out ${ch === i ? 'scale-100 opacity-100' : 'scale-110 opacity-0'}`} />
                ))}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#06501b]/90 to-transparent p-5 pt-16 text-xs font-semibold text-white sm:p-7">
                  {String(ch + 1).padStart(2, '0')} / {String(STORY.length).padStart(2, '0')} · CHIS since 2016
                </div>
              </div>

              <div className="flex min-h-0 flex-col justify-between gap-4 lg:col-span-6">
                <div role="tablist" aria-label="Our story chapters" className="flex shrink-0 gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
                  {STORY.map((c, i) => (
                    <button
                      key={c.tab}
                      type="button"
                      role="tab"
                      aria-selected={ch === i}
                      onClick={() => setCh(i)}
                      className={`shrink-0 rounded-full px-4 py-2 text-xs font-semibold transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#096c27] sm:text-sm ${ch === i ? `bg-[#096c27] text-white ${SH_SM}` : 'bg-white text-[#096c27] hover:bg-[#dfe9cf]'}`}
                    >
                      {c.tab}
                    </button>
                  ))}
                </div>
                <div className="min-h-0 py-2 sm:py-3" aria-live="polite">
                  <p data-ch-text className="text-xs font-semibold text-[#096c27]">{s.kicker}</p>
                  <h3 data-ch-text className="mt-2 font-nunito text-[clamp(1.4rem,min(3.2vw,5.5svh),3.5rem)] font-light leading-[1.05] tracking-[-0.04em]">{s.title}</h3>
                  <p data-ch-text className="mt-3 max-w-lg text-[13px] leading-relaxed text-[#0b1f12]/75 sm:text-base">{s.body}</p>
                </div>
                <div className="h-[3px] w-full shrink-0 bg-[#096c27]/15" aria-hidden="true">
                  <div className="h-full bg-[#096c27] transition-[width] duration-700 ease-out" style={{ width: `${((ch + 1) / STORY.length) * 100}%` }} />
                </div>
              </div>
            </div>
          </div>
        </Sec>

        {/* ============ 5. VALUE / MISSION / VISION ============ */}
        <Sec id="drives" labelledby="drives-title" className="bg-[#f3f8e6] text-[#0b1f12]">
          <BgRings position="top-left" />
          <div className="flex min-h-0 flex-1 flex-col gap-4 sm:gap-6">
            <div className="flex shrink-0 flex-wrap items-end justify-between gap-3">
              <Lines id="drives-title" lines={['Value, mission and vision.']} accentClass="italic text-[#096c27]" className="text-[clamp(1.8rem,min(5.4vw,8.5svh),5.5rem)] text-[#0b1f12]" />
              <p data-fade className="text-sm text-[#0b1f12]/70">Tap or hover a panel to open it.</p>
            </div>
            <ValuePanels />
          </div>
        </Sec>

        {/* ============ 6. WHY WE ARE UNIQUE ============ */}
        <Sec id="unique" labelledby="unique-title" className="bg-white">
          <BgRings position="top-right" />
          <div className="flex shrink-0 flex-wrap items-end justify-between gap-4 pb-4 sm:pb-6">
            <Lines id="unique-title" lines={['Four reasons people choose CHIS.']} accentClass="italic text-[#096c27]" className="max-w-3xl text-[clamp(1.8rem,min(4.8vw,8svh),5rem)]" />
            <p data-fade className="hidden max-w-xs text-sm leading-relaxed text-[#0b1f12]/70 md:block">Transparent hospitality, an award-winning workforce, and heartfelt care.</p>
          </div>
          <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
            {UNIQUE.map((u) => {
              const Icon = u.icon
              return (
                <article key={u.title} data-rise className={`group flex min-h-0 flex-col justify-between overflow-hidden rounded-[1.75rem] border p-5 transition-transform duration-500 hover:-translate-y-2 sm:p-6 ${SH} ${u.bg} ${u.dark ? 'border-[#096c27]' : 'border-[#0b1f12]/10'}`}>
                  <div className="min-h-0">
                    <span className={`grid h-10 w-10 place-items-center rounded-2xl transition-transform duration-700 group-hover:rotate-[360deg] sm:h-12 sm:w-12 ${u.iconBg}`}>
                      <Icon className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden="true" />
                    </span>
                    <p className={`mt-3 text-[11px] font-semibold sm:mt-5 sm:text-xs ${u.dark ? 'text-[#b3d565]' : 'text-[#096c27]'}`}>{u.subtitle}</p>
                    <h3 className="mt-0.5 font-nunito text-lg font-medium leading-snug tracking-[-0.03em] sm:text-2xl">{u.title}</h3>
                    <p className={`mt-2 text-[12px] leading-relaxed sm:text-sm ${u.dark ? 'text-white/80' : 'text-[#0b1f12]/75'}`}>{u.body}</p>
                  </div>
                  <div className={`mt-4 flex items-center justify-between border-t pt-3 text-[11px] font-semibold sm:text-xs ${u.dark ? 'border-white/15 text-[#b3d565]' : 'border-[#096c27]/15 text-[#096c27]'}`}>
                    {u.badge}
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
                  </div>
                </article>
              )
            })}
          </div>
        </Sec>

        {/* ============ 7. CTA ============ */}
        <Sec id="enquire" labelledby="cta-title" className="isolate bg-[#f3f8e6] text-[#0b1f12]">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute -right-[10%] -top-[30%] h-[55vw] w-[55vw] rounded-full border border-[#096c27]/15" />
            <div className="absolute -right-[2%] -top-[18%] h-[38vw] w-[38vw] rounded-full border border-[#096c27]/15" />
            <div className="absolute -bottom-[40%] -left-[10%] h-[50vw] w-[50vw] rounded-full bg-[#096c27]/5 blur-3xl" />
          </div>
          <Lines id="cta-title" lines={["Let's simplify", 'your next trip.']} accentClass="italic text-[#096c27]" className="text-[clamp(2.35rem,min(9.5vw,18svh),10.5rem)] leading-[0.9] tracking-[-0.055em] text-[#0b1f12]" />
          <div data-fade className="mt-8 flex flex-wrap items-center gap-4 lg:mt-12">
            <Magnetic><Pill dark onClick={() => handleOpenBooking('Custom Holiday Consultation')}>Plan your vacation</Pill></Magnetic>
            <Magnetic strength={0.25}>
              <Link to="/contact" className="inline-flex items-center gap-2.5 rounded-full border border-[#096c27]/50 px-7 py-3.5 text-sm font-semibold text-[#096c27] transition-colors hover:border-[#096c27] hover:bg-[#096c27] hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#096c27]">
                Contact our office <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Magnetic>
          </div>
          {(brand?.address || brand?.phone) && (
            <div data-fade className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-[#096c27]/25 pt-6 text-xs sm:text-sm text-[#0b1f12]/80 lg:mt-14">
              {brand?.address && <span className="flex items-center gap-2.5"><MapPin className="h-4 w-4 shrink-0 text-[#096c27]" aria-hidden="true" />{brand.address}</span>}
              {brand?.phone && <span className="flex items-center gap-2.5"><PhoneCall className="h-4 w-4 shrink-0 text-[#096c27]" aria-hidden="true" />{brand.phone}</span>}
            </div>
          )}
        </Sec>
      </div>
    </PageTransition>
  )
}