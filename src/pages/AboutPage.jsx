import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowUpRight, Award, HeartHandshake, MapPin, PhoneCall, ShieldCheck, Users } from 'lucide-react'
import PageTransition from '../components/layout/PageTransition'
import { brand } from '../data/brand'
import heroModel from '../assets/images/chis-hero-model.png'
import employeesImg from '../assets/images/Employees.avif'
import propertiesImg from '../assets/images/Collaborative properties.jpg'
import associatesImg from '../assets/images/Travel associates.jpg'
import establishedImg from '../assets/images/Established.jpg'

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger)
const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect

/* CHIS palette: green #096c27 · deep #06501b · leaf #b3d565 · ink #0b1f12 · mist #f3f8e6 */

const STATEMENT =
  'Since December 21st, 2016, Country Holidays Inn and Suites has worked toward one goal: budget travel packages for customers worldwide, with mesmerizing options and customized economical benefits under one roof.'

const OBJECTIVE =
  'CHIS was established to provide hassle-free luxury travel experiences that everyone can afford with ease.'

const TIMELINE = [
  { year: '2016', title: 'It began with one simple goal', body: 'Country Holidays Inn and Suites was established on 21st December 2016 to provide budget travel packages to customers worldwide. We started with only 20 employees onboard.', image: establishedImg },
  { year: 'Our people', title: 'People are our backbone', body: 'We consider CHIS our own family. Our employees work with absolute dedication, united by the same passion, sincerity and mission, and we celebrate that togetherness year after year.', image: employeesImg },
  { year: 'Today', title: 'A family of 500+, across the globe', body: 'CHIS now spans 250 travel associates and 3,500 tie-up collaborative properties, and remains a time-saving option for customers whose only passion is travel.', image: propertiesImg },
]

const STATS = [
  { to: 500, suffix: '+', label: 'Employees' },
  { to: 3500, suffix: '+', label: 'Collaborative properties' },
  { to: 250, suffix: '', label: 'Travel associates' },
  { to: 2016, suffix: '', label: 'Established', plain: true },
]

const PANELS = [
  { label: 'Our value', title: 'We simplify the travel experience.', body: "Mesmerizing travel options with customized economical benefits, right under one roof. That's the promise behind everything we build.", image: associatesImg },
  { label: 'Mission', title: 'Care and Convenience.', body: "The true spirit behind all our services. We are driven by the zest to provide unmatched quality and unparalleled travel experiences, and to help customers create meaningful memories with us across their lifetime. Our mission is to build bonds of trust and reliability for everyone who dreams of travelling well.", image: employeesImg },
  { label: 'Vision', title: 'Trust and reliability, across the globe.', body: 'With more than 3,500 destinations under our belt, we aim to expand our network of trust across the globe, stand tall with more domestic and international resorts, and set new benchmarks for leisure holidaying.', image: propertiesImg },
]

const UNIQUE = [
  { icon: Award, title: 'Award-winning', sub: 'Excellence recognized', body: 'Ranked among the best agencies in Delhi NCR, with Certificates of Excellence, Incorporation and Appreciation, and named a "Best Place to Work" multiple years running.' },
  { icon: Users, title: 'Passionate workers', sub: '500+ global associates', body: 'Our reputation rests on dedicated service and endurance. Our people are passionately engaged in driving every journey to its optimum.' },
  { icon: ShieldCheck, title: 'Upright stance', sub: 'Integrity & resilience', body: 'Diverse vacations, member needs and premium experiences across 3,500+ collaborative properties, delivered with transparency and reliability.' },
  { icon: HeartHandshake, title: 'Acquaintance', sub: 'Lifelong family bonds', body: 'We treat travellers as cherished family, not mere customers. Our sincere affection and lifelong care shape every journey.' },
]

const MARQUEE = ['Budget travel packages', 'Care and convenience', '3,500+ collaborative properties', '250 travel associates', 'Since 2016']

const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
const fmt = (v, plain) => (plain ? String(Math.round(v)) : Math.round(v).toLocaleString('en-US'))

/* ------------------------------ pieces ------------------------------ */

function Magnetic({ children, strength = 0.3 }) {
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

/** Masked line-by-line headline reveal */
function Lines({ lines, id, as: Tag = 'h2', className = '', accent = '' }) {
  return (
    <Tag id={id} data-lines="" className={`font-mulish font-light tracking-[-0.055em] ${className}`}>
      {lines.map((l, i) => (
        <span key={l} className="-mb-[0.1em] block overflow-hidden pb-[0.1em]">
          <span data-line className={`block ${i === lines.length - 1 ? accent : ''}`}>{l}</span>
        </span>
      ))}
    </Tag>
  )
}

function Pill({ children, to, onClick, tone = 'leaf' }) {
  const tones = {
    leaf: ['bg-[#b3d565] text-[#0b1f12]', 'bg-[#096c27] text-white'],
    ink: ['bg-[#0b1f12] text-white', 'bg-[#b3d565] text-[#0b1f12]'],
  }[tone]
  const cls = `group inline-flex items-center gap-4 rounded-full py-2 pl-7 pr-2 text-sm font-semibold transition-transform duration-300 hover:scale-[1.03] focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 ${tones[0]}`
  const icon = (
    <span className={`grid h-11 w-11 place-items-center overflow-hidden rounded-full ${tones[1]}`}>
      <ArrowUpRight className="h-4 w-4 transition-transform duration-500 group-hover:rotate-45" aria-hidden="true" />
    </span>
  )
  return to
    ? <Link to={to} className={cls}>{children}{icon}</Link>
    : <button type="button" onClick={onClick} className={cls}>{children}{icon}</button>
}

function Marquee({ items, className = '', dataKey = 'data-marq' }) {
  const row = [...items, ...items]
  return (
    <div className={`overflow-hidden whitespace-nowrap ${className}`} aria-hidden="true">
      <div {...{ [dataKey]: '' }} className="flex w-max will-change-transform">
        {[0, 1].map((k) => (
          <div key={k} className="flex shrink-0 items-center">
            {row.map((t, i) => (
              <span key={`${k}-${i}`} className="flex items-center">
                <span className="px-6">{t}</span>
                <span className="h-2 w-2 rounded-full bg-current opacity-60" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

/* ------------------------------ page ------------------------------ */

export default function AboutPage() {
  const rootRef = useRef(null)
  const [open, setOpen] = useState(0)

  const handleOpenBooking = (destination = 'General Inquiry') =>
    window.dispatchEvent(new CustomEvent('open-booking-modal', { detail: { destination, persons: '2 Persons', days: 'Membership & Holiday Consultation' } }))

  useIsoLayoutEffect(() => {
    const root = rootRef.current
    if (!root) return undefined
    const $ = (s) => gsap.utils.toArray(s, root)
    const mm = gsap.matchMedia(root)

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      /* page progress */
      gsap.set('[data-progress]', { scaleX: 0, transformOrigin: '0% 50%' })
      gsap.to('[data-progress]', { scaleX: 1, ease: 'none', scrollTrigger: { trigger: root, start: 'top top', end: 'bottom bottom', scrub: 0.3 } })

      /* masked headline lines */
      $('[data-lines]').forEach((el) =>
        gsap.from(el.querySelectorAll('[data-line]'), { yPercent: 120, rotate: 3, duration: 1.4, ease: 'expo.out', stagger: 0.12, delay: el.id === 'about-title' ? 0.2 : 0, scrollTrigger: { trigger: el, start: 'top 88%', once: true } }),
      )

      /* generic fades */
      const fades = $('[data-fade]')
      gsap.set(fades, { opacity: 0, y: 30 })
      ScrollTrigger.batch(fades, { start: 'top 92%', once: true, onEnter: (b) => gsap.to(b, { opacity: 1, y: 0, duration: 1.1, ease: 'expo.out', stagger: 0.1 }) })

      /* marquees */
      $('[data-marq]').forEach((el, i) => gsap.to(el, { xPercent: -50, duration: 38, ease: 'none', repeat: -1, ...(i % 2 ? { } : {}) }))
      $('[data-marq]').forEach((el) =>
        ScrollTrigger.create({ trigger: el, start: 'top bottom', end: 'bottom top', onUpdate: (s) => gsap.to(el, { timeScale: 1 + Math.abs(s.getVelocity()) / 400, overwrite: 'auto' }) }),
      )

      /* hero */
      gsap.from('[data-hero-img]', { y: 120, opacity: 0, scale: 0.94, duration: 1.8, ease: 'expo.out', delay: 0.3 })
      gsap.from('[data-hero-chip]', { y: 24, opacity: 0, duration: 1, ease: 'expo.out', stagger: 0.12, delay: 1 })
      gsap.to('[data-hero-img]', { yPercent: 10, ease: 'none', scrollTrigger: { trigger: '[data-hero]', start: 'top top', end: 'bottom top', scrub: true } })
      gsap.to('[data-hero-rings]', { scale: 1.25, rotation: 24, ease: 'none', scrollTrigger: { trigger: '[data-hero]', start: 'top top', end: 'bottom top', scrub: true } })
      gsap.to('[data-hero-title]', { yPercent: -14, opacity: 0.2, ease: 'none', scrollTrigger: { trigger: '[data-hero]', start: 'top top', end: 'bottom top', scrub: true } })

      /* statement scrubs word by word */
      gsap.fromTo($('[data-sw]'), { opacity: 0.12 }, { opacity: 1, ease: 'none', stagger: 0.06, scrollTrigger: { trigger: '[data-statement]', start: 'top 80%', end: 'bottom 45%', scrub: 0.5 } })

      /* timeline line draws with scroll; images unmask + parallax */
      gsap.fromTo('[data-tl-line]', { scaleY: 0 }, { scaleY: 1, transformOrigin: '50% 0%', ease: 'none', scrollTrigger: { trigger: '[data-tl]', start: 'top 65%', end: 'bottom 70%', scrub: true } })
      $('[data-tl-item]').forEach((item) => {
        const wrap = item.querySelector('[data-tl-img]')
        const img = wrap.querySelector('img')
        gsap.fromTo(wrap, { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: item, start: 'top 75%', once: true } })
        gsap.fromTo(img, { scale: 1.35 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: item, start: 'top bottom', end: 'bottom top', scrub: true } })
        gsap.from(item.querySelectorAll('[data-tl-text] > *'), { y: 40, opacity: 0, duration: 1.1, ease: 'expo.out', stagger: 0.1, scrollTrigger: { trigger: item, start: 'top 72%', once: true } })
      })

      /* count-up */
      $('[data-count]').forEach((el) => {
        const to = Number(el.dataset.to)
        const plain = el.dataset.plain === '1'
        const o = { v: plain ? 1990 : 0 }
        el.textContent = fmt(o.v, plain)
        ScrollTrigger.create({ trigger: el, start: 'top 92%', once: true, onEnter: () => gsap.to(o, { v: to, duration: 2.4, ease: 'power3.out', onUpdate: () => { el.textContent = fmt(o.v, plain) } }) })
      })

      /* stacking cards: each card shrinks back as the next one slides over it */
      const stack = $('[data-stack]')
      stack.forEach((card, i) => {
        if (i === stack.length - 1) return
        gsap.to(card, { scale: 0.93, opacity: 0.55, transformOrigin: '50% 0%', ease: 'none', scrollTrigger: { trigger: stack[i + 1], start: 'top 75%', end: 'top 15%', scrub: true } })
      })

      /* why rows */
      const rows = $('[data-row]')
      gsap.set(rows, { opacity: 0, y: 50 })
      ScrollTrigger.batch(rows, { start: 'top 92%', once: true, onEnter: (b) => gsap.to(b, { opacity: 1, y: 0, duration: 1.1, ease: 'expo.out', stagger: 0.12 }) })

      /* spinning badge */
      gsap.to('[data-spin]', { rotation: 360, duration: 18, ease: 'none', repeat: -1, transformOrigin: '50% 50%' })

      /* CTA */
      gsap.from('[data-cta-pill]', { scale: 0.6, opacity: 0, duration: 1.2, ease: 'elastic.out(1, 0.6)', scrollTrigger: { trigger: '[data-cta]', start: 'top 55%', once: true } })

      return () => $('[data-count]').forEach((el) => { el.textContent = fmt(Number(el.dataset.to), el.dataset.plain === '1') })
    })

    const refresh = () => ScrollTrigger.refresh()
    window.addEventListener('load', refresh)
    const t = setTimeout(refresh, 700)
    return () => {
      clearTimeout(t)
      window.removeEventListener('load', refresh)
      mm.revert()
    }
  }, [])

  return (
    <PageTransition>
      <div ref={rootRef} className="page-about relative w-full overflow-x-clip bg-white text-[#0b1f12] antialiased selection:bg-[#b3d565] selection:text-[#0b1f12]">
        <div data-progress aria-hidden="true" className="fixed inset-x-0 top-0 z-[70] h-[3px] bg-[#b3d565]" />

        {/* ============ HERO ============ */}
        <section id="top" data-hero aria-labelledby="about-title" className="relative isolate flex min-h-[100svh] w-full flex-col overflow-hidden bg-[#096c27] pt-20 text-white">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute -right-[15%] -top-[25%] h-[60vw] w-[60vw] rounded-full bg-[#b3d565]/20 blur-3xl" />
            <div data-hero-rings className="absolute right-[-12%] top-[8%] h-[52vw] w-[52vw]">
              <div className="absolute inset-0 rounded-full border border-white/15" />
              <div className="absolute inset-[12%] rounded-full border border-white/15" />
              <div className="absolute inset-[24%] rounded-full border border-white/15" />
            </div>
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,#06501b_0%,transparent_55%)]" />
          </div>

          <div className="mx-auto grid w-full max-w-[96rem] flex-1 items-end gap-6 px-5 sm:px-10 lg:grid-cols-12 lg:px-14">
            <div data-hero-title className="pb-10 pt-8 lg:col-span-7 lg:pb-20">
              <Lines as="h1" id="about-title" lines={['Travel,', 'simplified.']} accent="italic text-[#b3d565]" className="text-[clamp(3.2rem,min(12vw,20svh),12rem)] leading-[0.86]" />
              <p data-fade className="mt-6 max-w-lg text-sm font-light leading-relaxed text-white/85 sm:text-base lg:mt-9 lg:text-lg">
                A time-saving option for people whose only passion is travel: mesmerizing options and customized economical benefits, all under one roof.
              </p>
              <div data-fade className="mt-8 flex flex-wrap items-center gap-3">
                <Magnetic><Pill to="/vacation-packages">View vacation packages</Pill></Magnetic>
                <Magnetic strength={0.2}>
                  <button type="button" onClick={() => handleOpenBooking('Membership Consultation')} className="inline-flex items-center gap-2.5 rounded-full border border-white/40 px-6 py-3.5 text-sm font-medium transition-colors hover:border-[#b3d565] hover:text-[#b3d565] focus:outline-none focus-visible:ring-2 focus-visible:ring-white">
                    <PhoneCall className="h-4 w-4" aria-hidden="true" /> Talk to us
                  </button>
                </Magnetic>
              </div>
            </div>

            <div className="relative flex h-full items-end justify-center lg:col-span-5 lg:justify-end">
              <div data-hero-chip className="absolute left-0 top-[18%] z-10 rounded-2xl border border-white/20 bg-white/10 px-4 py-3 backdrop-blur-md sm:left-4">
                <p className="font-nunito text-2xl font-light tracking-tight">3,500+</p>
                <p className="text-[11px] text-white/80">collaborative properties</p>
              </div>
              <div data-hero-chip className="absolute bottom-[22%] right-0 z-10 rounded-2xl bg-[#b3d565] px-4 py-3 text-[#0b1f12] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)]">
                <p className="font-nunito text-2xl font-light tracking-tight">500+</p>
                <p className="text-[11px]">people in the CHIS family</p>
              </div>
              <img data-hero-img src={heroModel} alt="CHIS holiday model" className="pointer-events-none block h-auto max-h-[52svh] w-auto max-w-full select-none object-contain object-bottom sm:max-h-[64svh] lg:max-h-[76svh]" />
            </div>
          </div>

          <Marquee items={MARQUEE} className="border-t border-white/20 bg-[#06501b] py-4 font-nunito text-sm font-light tracking-wide text-white/85 sm:text-base" />
        </section>

        {/* ============ 1. STORY LINE ============ */}
        <section id="story" aria-labelledby="story-title" className="relative bg-white px-5 py-24 sm:px-10 sm:py-36 lg:px-14">
          <div className="mx-auto max-w-[80rem]">
            <Lines id="story-title" lines={['Our story line.']} accent="italic text-[#096c27]" className="text-[clamp(2.6rem,min(8vw,13svh),8rem)] leading-[0.9]" />
            <p data-statement className="mt-10 max-w-5xl font-nunito text-[clamp(1.4rem,3.2vw,3.1rem)] font-light leading-[1.15] tracking-[-0.035em]">
              {STATEMENT.split(' ').map((w, i) => (
                <span key={i} data-sw className="inline-block pr-[0.25em]">{w}</span>
              ))}
            </p>

            <div data-tl className="relative mt-24 sm:mt-32">
              <span aria-hidden="true" className="absolute left-3 top-0 h-full w-px bg-[#096c27]/15 md:left-1/2" />
              <span data-tl-line aria-hidden="true" className="absolute left-3 top-0 h-full w-[2px] -translate-x-[0.5px] bg-[#096c27] md:left-1/2" />
              <ol>
                {TIMELINE.map((t, i) => (
                  <li key={t.year} data-tl-item className="relative grid gap-8 py-12 pl-10 md:grid-cols-2 md:gap-24 md:py-20 md:pl-0">
                    <span aria-hidden="true" className="absolute left-3 top-14 h-3.5 w-3.5 -translate-x-1/2 rounded-full border-[3px] border-white bg-[#096c27] ring-1 ring-[#096c27] md:left-1/2 md:top-24" />
                    <div data-tl-img className={`overflow-hidden rounded-[1.5rem] shadow-[0_30px_60px_-25px_rgba(6,40,16,0.6)] ${i % 2 ? 'md:order-2' : ''}`}>
                      <img src={t.image} alt="" loading="lazy" className="aspect-[4/3] w-full object-cover" />
                    </div>
                    <div data-tl-text className={`flex flex-col justify-center ${i % 2 ? 'md:items-end md:text-right' : ''}`}>
                      <p className="font-nunito text-4xl font-light italic tracking-[-0.04em] text-[#096c27] sm:text-6xl">{t.year}</p>
                      <h3 className="mt-4 font-nunito text-xl font-semibold tracking-[-0.02em] sm:text-2xl">{t.title}</h3>
                      <p className="mt-3 max-w-md text-sm leading-relaxed text-[#0b1f12]/70 sm:text-base">{t.body}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            <dl className="mt-16 grid grid-cols-2 gap-x-6 gap-y-10 border-t border-[#096c27]/20 pt-12 lg:grid-cols-4">
              {STATS.map((s) => (
                <div key={s.label} data-fade className="flex flex-col-reverse">
                  <dt className="mt-2 text-xs font-medium text-[#0b1f12]/65 sm:text-sm">{s.label}</dt>
                  <dd className="font-nunito text-[clamp(2.6rem,6vw,5.5rem)] font-light leading-none tracking-[-0.05em] text-[#096c27]">
                    <span data-count data-to={s.to} data-plain={s.plain ? '1' : '0'}>{fmt(s.to, s.plain)}</span>{s.suffix}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* ============ 2. VALUE, MISSION & VISION (sticky stacking cards) ============ */}
        <section id="purpose" aria-labelledby="purpose-title" className="relative bg-[#0b1f12] text-white">
          <div className="mx-auto grid max-w-[90rem] gap-12 px-5 py-24 sm:px-10 lg:grid-cols-12 lg:gap-16 lg:px-14 lg:py-36">
            <div className="lg:col-span-4">
              <div className="lg:sticky lg:top-28">
                <Lines id="purpose-title" lines={['Value, mission', 'and vision.']} accent="italic text-[#b3d565]" className="text-[clamp(2.4rem,min(5.2vw,10svh),5.2rem)] leading-[0.92]" />
                <p data-fade className="mt-6 max-w-sm text-sm leading-relaxed text-white/65">{OBJECTIVE}</p>
                <div data-fade className="mt-8">
                  <Magnetic><Pill onClick={() => handleOpenBooking('Membership Consultation')}>Talk to us</Pill></Magnetic>
                </div>
              </div>
            </div>

            <div className="lg:col-span-8">
              {PANELS.map((p, i) => {
                const theme = [
                  'bg-[#b3d565] text-[#0b1f12]',
                  'bg-white text-[#0b1f12]',
                  'bg-[#096c27] text-white',
                ][i]
                return (
                  <article
                    key={p.label}
                    data-stack
                    style={{ top: `${6 + i * 1.25}rem` }}
                    className={`sticky mb-6 grid overflow-hidden rounded-[2rem] shadow-[0_30px_60px_-25px_rgba(0,0,0,0.7)] md:grid-cols-5 lg:min-h-[28rem] ${theme}`}
                  >
                    <div className="relative h-52 md:col-span-2 md:h-auto">
                      <img src={p.image} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
                    </div>
                    <div className="flex flex-col justify-between gap-10 p-7 sm:p-10 md:col-span-3">
                      <span className="w-fit rounded-full border border-current px-3.5 py-1 text-xs font-semibold opacity-80">{p.label}</span>
                      <div>
                        <h3 className="font-nunito text-[clamp(1.8rem,3vw,3.1rem)] font-light leading-[1.02] tracking-[-0.045em]">{p.title}</h3>
                        <p className="mt-4 max-w-lg text-[13px] leading-relaxed opacity-80 sm:text-sm">{p.body}</p>
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>
          </div>
        </section>

        {/* ============ 3. WHY CHIS + CTA ============ */}
        <section id="unique" aria-labelledby="unique-title" className="relative bg-[#f3f8e6]">
          <div className="mx-auto max-w-[90rem] px-5 pb-24 pt-24 sm:px-10 sm:pt-36 lg:px-14">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <Lines id="unique-title" lines={['Four reasons', 'people choose CHIS.']} accent="italic text-[#096c27]" className="text-[clamp(2.4rem,min(7vw,12svh),7rem)] leading-[0.9]" />
              <p data-fade className="max-w-xs text-sm leading-relaxed text-[#0b1f12]/70">Transparent hospitality, an award-winning workforce and heartfelt care.</p>
            </div>

            <ul className="mt-14 sm:mt-20">
              {UNIQUE.map((u, i) => {
                const Icon = u.icon
                const on = open === i
                return (
                  <li key={u.title} data-row className="border-t border-[#096c27]/25 last:border-b">
                    <button
                      type="button"
                      aria-expanded={on}
                      onMouseEnter={() => setOpen(i)}
                      onFocus={() => setOpen(i)}
                      onClick={() => setOpen(i)}
                      className="group flex w-full items-center gap-4 py-6 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#096c27] sm:gap-6 sm:py-9"
                    >
                      <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-full transition-colors duration-500 sm:h-14 sm:w-14 ${on ? 'bg-[#096c27] text-[#b3d565]' : 'bg-white text-[#096c27]'}`}>
                        <Icon className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden="true" />
                      </span>
                      <span className={`flex-1 font-nunito text-[clamp(1.8rem,5vw,4.6rem)] font-light leading-none tracking-[-0.05em] transition-all duration-500 ${on ? 'translate-x-2 text-[#096c27]' : 'text-[#0b1f12]'}`}>{u.title}</span>
                      <span className="hidden text-xs font-semibold text-[#096c27] md:block">{u.sub}</span>
                      <ArrowUpRight className={`h-6 w-6 shrink-0 text-[#096c27] transition-transform duration-500 ${on ? 'rotate-45' : ''}`} aria-hidden="true" />
                    </button>
                    <div className={`grid transition-[grid-template-rows] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${on ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                      <div className="overflow-hidden">
                        <p className="max-w-xl pb-8 text-sm leading-relaxed text-[#0b1f12]/70 sm:pl-[4.75rem] sm:text-base">{u.body}</p>
                      </div>
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>

          {/* CTA */}
          <div data-cta id="enquire" className="relative isolate overflow-hidden bg-[#096c27] px-5 py-24 text-white sm:px-10 sm:py-32 lg:px-14">
            <div aria-hidden="true" className="pointer-events-none absolute -left-[12%] -top-[45%] -z-10 h-[55vw] w-[55vw] rounded-full border border-white/15" />
            <div aria-hidden="true" className="pointer-events-none absolute -bottom-[40%] -right-[8%] -z-10 h-[45vw] w-[45vw] rounded-full bg-[#b3d565]/15 blur-3xl" />
            <div className="mx-auto grid max-w-[90rem] items-center gap-14 lg:grid-cols-12">
              <div className="lg:col-span-8">
                <Lines id="cta-title" lines={["Let's simplify", 'your next trip.']} accent="italic text-[#b3d565]" className="text-[clamp(2.8rem,min(9.5vw,17svh),9.5rem)] leading-[0.88]" />
                <p data-fade className="mt-8 max-w-md text-sm leading-relaxed text-white/80 sm:text-base">
                  Tell us where you want to go and we will match it with one of 3,500+ collaborative properties, at a price that works for you.
                </p>
                <div data-fade className="mt-8">
                  <Magnetic strength={0.2}>
                    <Link to="/contact" className="inline-flex items-center rounded-full border border-white/40 px-7 py-3.5 text-sm font-semibold transition-colors hover:border-[#b3d565] hover:text-[#b3d565] focus:outline-none focus-visible:ring-2 focus-visible:ring-white">
                      Contact our office
                    </Link>
                  </Magnetic>
                </div>
              </div>

              <div className="flex justify-center lg:col-span-4 lg:justify-end">
                <Magnetic strength={0.15}>
                  <button type="button" data-cta-pill onClick={() => handleOpenBooking('Custom Holiday Consultation')} aria-label="Plan your vacation" className="relative grid h-60 w-60 place-items-center rounded-full bg-[#b3d565] text-[#0b1f12] transition-transform duration-500 hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#096c27] sm:h-72 sm:w-72">
                    <svg data-spin viewBox="0 0 200 200" aria-hidden="true" className="absolute inset-0 h-full w-full">
                      <defs><path id="chis-circ" d="M100,100 m-80,0 a80,80 0 1,1 160,0 a80,80 0 1,1 -160,0" /></defs>
                      <text fontSize="13" fontWeight="600" fill="currentColor" textLength="496" lengthAdjust="spacing">
                        <textPath href="#chis-circ">Plan your vacation • Plan your vacation • </textPath>
                      </text>
                    </svg>
                    <ArrowUpRight className="h-14 w-14" aria-hidden="true" />
                  </button>
                </Magnetic>
              </div>
            </div>

            {(brand?.address || brand?.phone) && (
              <div className="mx-auto mt-16 flex max-w-[90rem] flex-wrap gap-x-10 gap-y-3 border-t border-white/20 pt-6 text-xs text-white/85 sm:text-sm">
                {brand?.address && <span className="flex items-center gap-2.5"><MapPin className="h-4 w-4 shrink-0 text-[#b3d565]" aria-hidden="true" />{brand.address}</span>}
                {brand?.phone && <span className="flex items-center gap-2.5"><PhoneCall className="h-4 w-4 shrink-0 text-[#b3d565]" aria-hidden="true" />{brand.phone}</span>}
              </div>
            )}
          </div>
        </section>
      </div>
    </PageTransition>
  )
}