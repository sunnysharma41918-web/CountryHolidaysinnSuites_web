import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowDown, ArrowUpRight } from 'lucide-react'
import silverCard from '../../../assets/chis-silver-card.png'
import goldCard from '../../../assets/chis-gold-card.png'
import { openEnquiry, scrollToId } from './content'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

/* -------------------------------------------------------------------------- */
/*  Design tokens (same system as About / RoomType / Pricing)                  */
/*  ink #0b0706 · paper #f6efe9 · ember #ff5938 · rust #d9361b                */
/* -------------------------------------------------------------------------- */

const GRADIENT = 'linear-gradient(95deg, #f6efe9 0%, #ff5938 70%, #d9361b 100%)'

const TIERS = [
  {
    id: 'silver',
    tag: 'T-1',
    label: 'Silver',
    img: silverCard,
    line: 'Start your holiday journey with CHIS.',
    pos: 'left-0 top-0',
    rot: '-rotate-[5deg]',
    from: '-translate-x-16',
  },
  {
    id: 'gold',
    tag: 'T-2',
    label: 'Gold',
    img: goldCard,
    line: 'The fuller way to holiday with CHIS.',
    pos: 'right-0 bottom-0',
    rot: 'rotate-[4deg]',
    from: 'translate-x-16',
  },
]

const WORDS = ['slow weekends', 'family trips', 'couple getaways', 'long breaks']

const STEPS = [
  { t: 'Choose your card', s: 'Pick T-1 Silver or T-2 Gold. Both come with your CHIS membership.', thumbs: true },
  { t: 'Take membership', s: 'Tap the button and tell us you are in. It takes a moment.' },
  { t: 'Get onboarded', s: 'We welcome you and share your member benefits with you.' },
  { t: 'Start your vacations', s: 'Your card is yours. Start planning where to wake up next.' },
]

/* -------------------------------------------------------------------------- */
/*  3-D tilt card (pointer-driven)                                            */
/* -------------------------------------------------------------------------- */

function TiltCard({ src, alt }) {
  const wrap = useRef(null)
  const glare = useRef(null)

  const move = (e) => {
    const r = wrap.current.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width
    const py = (e.clientY - r.top) / r.height
    wrap.current.style.transition = 'transform 80ms linear'
    wrap.current.style.transform = `perspective(900px) rotateX(${(0.5 - py) * 16}deg) rotateY(${(px - 0.5) * 20}deg) scale(1.04)`
    glare.current.style.opacity = '1'
    glare.current.style.background = `radial-gradient(circle at ${px * 100}% ${py * 100}%, rgba(255,255,255,0.28), transparent 60%)`
  }
  const leave = () => {
    wrap.current.style.transition = 'transform 700ms cubic-bezier(0.2,0.8,0.2,1)'
    wrap.current.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) scale(1)'
    glare.current.style.opacity = '0'
  }

  return (
    <div
      ref={wrap}
      onPointerMove={move}
      onPointerLeave={leave}
      className="relative w-full rounded-[2.6%/4.4%] shadow-[0_30px_60px_-16px_rgba(255,89,56,0.35)]"
    >
      <img src={src} alt={alt} draggable={false} className="block w-full select-none rounded-[2.6%/4.4%]" />
      <div ref={glare} aria-hidden className="pointer-events-none absolute inset-0 rounded-[2.6%/4.4%] opacity-0 transition-opacity duration-300" />
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*  Rotating circular scroller badge                                          */
/* -------------------------------------------------------------------------- */

function ScrollBadge({ onClick }) {
  const SCROLL_TEXT = 'SCROLL • DISCOVER • EXPLORE • '
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Scroll to how to get your card"
      className="group relative grid h-[clamp(5.5rem,14svh,7.5rem)] w-[clamp(5.5rem,14svh,7.5rem)] cursor-pointer place-items-center rounded-full border border-[#f6efe9]/15 transition-all duration-500 hover:border-[#ff5938]/70 hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ff5938] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0706]"
    >
      <svg viewBox="0 0 120 120" className="mcs-spin absolute inset-0 h-full w-full" aria-hidden="true">
        <defs>
          <path id="mcs-circle" d="M60,60 m-44,0 a44,44 0 1,1 88,0 a44,44 0 1,1 -88,0" />
        </defs>
        <text fill="#f6efe9" fillOpacity="0.55" fontSize="9.5" letterSpacing="2.6" className="font-sans">
          <textPath href="#mcs-circle">{SCROLL_TEXT}</textPath>
        </text>
      </svg>
      <ArrowDown className="h-5 w-5 text-[#ff5938] transition-transform duration-300 group-hover:translate-y-1" />
    </button>
  )
}

/* -------------------------------------------------------------------------- */
/*  Gradient headline text                                                    */
/* -------------------------------------------------------------------------- */

function GradientText({ children, className = '' }) {
  return (
    <span
      className={`bg-clip-text text-transparent ${className}`}
      style={{ backgroundImage: GRADIENT }}
    >
      {children}
    </span>
  )
}

/* -------------------------------------------------------------------------- */
/*  Main section                                                              */
/* -------------------------------------------------------------------------- */

export default function MemberCardSections({ onPurchase }) {
  const sectionRef = useRef(null)
  const glowARef = useRef(null)
  const glowBRef = useRef(null)
  const stageRef = useRef(null)

  const [tierIndex, setTierIndex] = useState(1) // Gold in front
  const [wordIndex, setWordIndex] = useState(0)
  const [stageSeen, setStageSeen] = useState(false)
  const [reached, setReached] = useState(-1)

  const tier = TIERS[tierIndex]

  /* rotating word phrase */
  useEffect(() => {
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return
    const id = setInterval(() => setWordIndex((i) => (i + 1) % WORDS.length), 2600)
    return () => clearInterval(id)
  }, [])

  /* stage IntersectionObserver */
  useEffect(() => {
    const el = stageRef.current
    if (!el || !('IntersectionObserver' in window)) return
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) setStageSeen(true) }, { threshold: 0.2 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  /* GSAP: atmosphere parallax + hero text enters */
  useEffect(() => {
    const root = sectionRef.current
    if (!root) return undefined
    const mm = gsap.matchMedia()

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const scrub = { trigger: root, start: 'top bottom', end: 'bottom top', scrub: true }
      gsap.to(glowARef.current, { yPercent: 40, ease: 'none', scrollTrigger: scrub })
      gsap.to(glowBRef.current, { yPercent: -30, ease: 'none', scrollTrigger: scrub })

      gsap.from(root.querySelectorAll('[data-rise]'), {
        yPercent: 115,
        rotate: 3,
        duration: 1.3,
        stagger: 0.04,
        ease: 'expo.out',
        scrollTrigger: { trigger: root, start: 'top 75%', once: true },
      })

      gsap.from(root.querySelectorAll('[data-fade]'), {
        y: 24,
        opacity: 0,
        duration: 1,
        stagger: 0.12,
        delay: 0.3,
        ease: 'power3.out',
        scrollTrigger: { trigger: root, start: 'top 75%', once: true },
      })

      /* word scrub on lead paragraph */
      gsap.fromTo(
        root.querySelectorAll('[data-word]'),
        { opacity: 0.14 },
        {
          opacity: 1,
          ease: 'none',
          stagger: 0.1,
          scrollTrigger: { trigger: root.querySelector('[data-lead]'), start: 'top 85%', end: 'bottom 45%', scrub: true },
        },
      )

      /* timeline step lines draw in */
      root.querySelectorAll('[data-step-line]').forEach((line) => {
        gsap.from(line, {
          scaleY: 0,
          transformOrigin: 'top center',
          duration: 1.4,
          ease: 'expo.out',
          scrollTrigger: { trigger: line, start: 'top 88%', once: true },
        })
      })
    })

    return () => mm.revert()
  }, [])

  const take = () => {
    if (onPurchase) { onPurchase({ tier: tier.id }); return }
    openEnquiry()
  }

  const toHow = () => scrollToId('chis-how')

  /* -------------------------------------------------------------------- */

  return (
    <section
      ref={sectionRef}
      className="relative isolate overflow-hidden bg-[#0b0706] text-[#f6efe9]"
    >
      <style>{KEYFRAMES}</style>

      {/* ===== Atmosphere ===== */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div ref={glowARef} className="absolute -right-[15%] -top-[10%] h-[50vw] w-[50vw]">
          <div className="mcs-drift-a h-full w-full rounded-full bg-[radial-gradient(closest-side,#ff5938_0%,rgba(217,54,27,0.5)_40%,transparent_72%)] opacity-55 blur-3xl" />
        </div>
        <div ref={glowBRef} className="absolute -bottom-[20%] -left-[12%] h-[44vw] w-[44vw]">
          <div className="mcs-drift-b h-full w-full rounded-full bg-[radial-gradient(closest-side,#d9361b_0%,transparent_70%)] opacity-25 blur-3xl" />
        </div>
        <svg className="absolute inset-0 h-full w-full opacity-[0.07] mix-blend-overlay" xmlns="http://www.w3.org/2000/svg">
          <filter id="mcs-grain">
            <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#mcs-grain)" />
        </svg>
      </div>

      {/* ===== HERO: headline + cards ===== */}
      <div className="mx-auto max-w-[90rem] px-5 pb-16 pt-20 sm:px-8 sm:pt-28 lg:px-12">
        <div className="grid items-center gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">

          {/* Left: copy */}
          <div>
            <h2
              aria-label="Member Privileges"
              className="font-nunito font-light leading-[0.9] tracking-[-0.06em]"
              style={{ fontSize: 'clamp(3rem, 10vw, 9.5rem)' }}
            >
              {['Member', 'Privileges'].map((line, li) => (
                <span key={line} className="block overflow-hidden pb-[0.06em]">
                  {line.split('').map((ch, i) => (
                    <span key={i} className="inline-block overflow-hidden align-bottom">
                      <span
                        data-rise
                        className="inline-block bg-clip-text text-transparent"
                        style={{
                          backgroundImage: li === 0
                            ? `linear-gradient(90deg,#f6efe9,#f6efe9)`
                            : GRADIENT,
                        }}
                      >
                        {ch === ' ' ? '\u00A0' : ch}
                      </span>
                    </span>
                  ))}
                </span>
              ))}
            </h2>

            <div data-fade className="mt-8 h-px w-16 bg-[#f6efe9]/15" />

            <p
              data-lead
              data-fade
              className="mt-6 font-sans text-[clamp(1.1rem,2.5vw,1.5rem)] font-light leading-snug tracking-[-0.03em] text-[#f6efe9]"
            >
              {`Made for ${WORDS[wordIndex]} and every escape in between. Country Holidays Inn & Suites — why are you still waiting to take your membership?`
                .split(' ')
                .map((w, i) => (
                  <span key={i} data-word className="inline-block pr-[0.25em]">{w}</span>
                ))}
            </p>

            {/* CTA row */}
            <div data-fade className="mt-10 flex flex-wrap items-center gap-5">
              {/* Primary */}
              <button
                type="button"
                onClick={take}
                className="group inline-flex items-center gap-3 rounded-full bg-[#ff5938] py-2 pl-7 pr-2 text-sm font-medium text-[#0b0706] transition-all duration-300 hover:shadow-[0_0_40px_-6px_#ff5938] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#f6efe9] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0706]"
              >
                Enquire about {tier.label} membership
                <span className="grid h-10 w-10 place-items-center rounded-full bg-[#0b0706] text-[#ff5938] transition-transform duration-500 group-hover:rotate-[360deg]">
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </button>

              {/* Scroll badge — scrolls to "How to get" */}
              <ScrollBadge onClick={toHow} />
            </div>
          </div>

          {/* Right: floating 3-D card stage */}
          <div ref={stageRef} className="flex flex-col items-center">
            <div className="relative mx-auto aspect-[100/78] w-full max-w-[480px]">
              {TIERS.map((t, i) => {
                const front = i === tierIndex
                return (
                  <div
                    key={t.id}
                    role="button"
                    tabIndex={0}
                    aria-label={`Show ${t.label} card`}
                    onClick={() => setTierIndex(i)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setTierIndex(i) }
                    }}
                    style={{ transitionDelay: stageSeen ? `${600 + i * 180}ms` : '0ms' }}
                    className={`absolute w-[78%] cursor-pointer rounded-[2.6%/4.4%] outline-none transition-all duration-[1000ms] ease-[cubic-bezier(0.2,0.8,0.2,1)] focus-visible:ring-4 focus-visible:ring-[#ff5938]/70 motion-reduce:!translate-x-0 motion-reduce:!opacity-100 motion-reduce:transition-none ${t.pos} ${
                      stageSeen ? 'translate-x-0 opacity-100' : `${t.from} opacity-0`
                    } ${front ? 'z-20' : 'z-10'}`}
                  >
                    <div className={`transition-all duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)] ${t.rot} ${front ? 'scale-100' : 'scale-[0.94] brightness-50'}`}>
                      <div style={{ animationDelay: `${i * 1.2}s` }} className="mcs-float">
                        <TiltCard src={t.img} alt={`CHIS ${t.label} membership card`} />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Tier switcher */}
            <div className="mt-12 flex flex-col items-center gap-4">
              <div role="radiogroup" aria-label="Choose your card" className="inline-flex rounded-full border border-[#f6efe9]/15 bg-[#f6efe9]/[0.06] p-1 backdrop-blur-sm">
                {TIERS.map((t, i) => {
                  const on = i === tierIndex
                  return (
                    <button
                      key={t.id}
                      type="button"
                      role="radio"
                      aria-checked={on}
                      onClick={() => setTierIndex(i)}
                      className={`rounded-full px-5 py-2.5 text-sm font-medium transition duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff5938] ${
                        on ? 'bg-[#ff5938] text-[#0b0706]' : 'text-[#f6efe9]/60 hover:text-[#f6efe9]'
                      }`}
                    >
                      {t.tag} · {t.label}
                    </button>
                  )
                })}
              </div>
              <p key={tier.id} className="text-center text-sm text-[#f6efe9]/55 mcs-up">
                {tier.line}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Hairline divider */}
      <div className="mx-auto max-w-[90rem] px-5 sm:px-8 lg:px-12">
        <div className="h-px bg-[#f6efe9]/15" />
      </div>

      {/* ===== HOW TO GET YOUR CARD ===== */}
      <div
        id="chis-how"
        className="mx-auto max-w-[90rem] scroll-mt-8 px-5 pb-28 pt-20 sm:px-8 sm:pb-36 sm:pt-24 lg:px-12"
      >
        <div className="grid gap-16 lg:grid-cols-[0.85fr_1.15fr] lg:gap-24">

          {/* Sticky left: title */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <p className="text-sm text-[#f6efe9]/55">Simple steps</p>
            <h3
              className="mt-5 font-nunito font-light leading-[0.9] tracking-[-0.05em]"
              style={{ fontSize: 'clamp(2.5rem, 7vw, 6rem)' }}
            >
              <span className="block overflow-hidden pb-[0.06em]">
                <span
                  className="inline-block bg-clip-text text-transparent"
                  style={{ backgroundImage: GRADIENT }}
                >
                  How to get
                </span>
              </span>
              <span className="block overflow-hidden pb-[0.06em]">
                <span className="inline-block text-[#f6efe9]">your CHIS card</span>
              </span>
            </h3>
            <p className="mt-6 max-w-sm text-sm leading-7 text-[#f6efe9]/55 sm:text-base">
              Four short steps from deciding to checking in. No long forms, no waiting around.
            </p>
          </div>

          {/* Right: steps timeline */}
          <ol className="relative m-0 list-none p-0">
            {/* track line */}
            <div aria-hidden className="absolute bottom-4 left-5 top-4 w-px bg-[#f6efe9]/10" />
            {/* progress fill driven by reached state */}
            <div
              aria-hidden
              style={{ height: `${Math.min(100, ((reached + 0.6) / STEPS.length) * 100)}%` }}
              className="absolute left-5 top-4 max-h-[calc(100%-2rem)] w-px bg-gradient-to-b from-[#ff5938] to-[#ff5938]/20 transition-[height] duration-[1200ms] ease-out motion-reduce:transition-none"
              data-step-line
            />
            {STEPS.map((s, i) => (
              <TimelineStep
                key={s.t}
                index={i}
                step={s}
                onSeen={() => setReached((r) => Math.max(r, i))}
              />
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}

/* -------------------------------------------------------------------------- */
/*  Timeline step                                                             */
/* -------------------------------------------------------------------------- */

function TimelineStep({ index, step, onSeen }) {
  const ref = useRef(null)
  const [seen, setSeen] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el || !('IntersectionObserver' in window)) return
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setSeen(true); onSeen(); io.disconnect() } },
      { threshold: 0.45 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <li
      ref={ref}
      className={`relative flex gap-8 pb-14 transition-all duration-[900ms] ease-[cubic-bezier(0.2,0.8,0.2,1)] last:pb-0 motion-reduce:!translate-x-0 motion-reduce:!opacity-100 motion-reduce:transition-none ${
        seen ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'
      }`}
    >
      {/* Step number bubble */}
      <span
        className={`relative z-10 grid h-10 w-10 flex-none place-items-center rounded-full border text-sm font-light transition-all duration-700 ${
          seen
            ? 'border-[#ff5938] bg-[#ff5938] text-[#0b0706] shadow-[0_0_0_6px_rgba(255,89,56,0.16)]'
            : 'border-[#f6efe9]/20 bg-[#0b0706] text-[#f6efe9]/50'
        }`}
      >
        {index + 1}
      </span>

      <div className="pt-1">
        <p
          className="font-sans leading-[0.95] tracking-[-0.04em] text-[#f6efe9]"
          style={{ fontSize: 'clamp(1.25rem, 2.4vw, 1.75rem)' }}
        >
          {step.t}
        </p>
        <p className="mt-3 max-w-[440px] text-sm leading-7 text-[#f6efe9]/55 sm:text-base">{step.s}</p>

        {step.thumbs && (
          <div className="mt-6 flex items-center">
            <img
              src={silverCard}
              alt="CHIS Silver card"
              className="w-[110px] -rotate-[5deg] rounded-md shadow-[0_14px_28px_-10px_rgba(255,89,56,0.5)]"
            />
            <img
              src={goldCard}
              alt="CHIS Gold card"
              className="-ml-5 w-[110px] rotate-[4deg] rounded-md shadow-[0_14px_28px_-10px_rgba(255,89,56,0.6)]"
            />
          </div>
        )}
      </div>
    </li>
  )
}

/* -------------------------------------------------------------------------- */
/*  Keyframes                                                                 */
/* -------------------------------------------------------------------------- */

const KEYFRAMES = `
@keyframes mcs-spin    { to { transform: rotate(360deg); } }
@keyframes mcs-float   { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
@keyframes mcs-up      { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
@keyframes mcs-drift-a { 0%,100% { transform: translate3d(0,0,0) scale(1); } 50% { transform: translate3d(6%,8%,0) scale(1.12); } }
@keyframes mcs-drift-b { 0%,100% { transform: translate3d(0,0,0) scale(1); } 50% { transform: translate3d(-8%,-6%,0) scale(1.15); } }

.mcs-spin    { animation: mcs-spin 18s linear infinite; }
.mcs-float   { animation: mcs-float 6s ease-in-out infinite; }
.mcs-up      { animation: mcs-up 0.5s ease-out both; }
.mcs-drift-a { animation: mcs-drift-a 18s ease-in-out infinite; }
.mcs-drift-b { animation: mcs-drift-b 22s ease-in-out infinite; }

@media (prefers-reduced-motion: reduce) {
  .mcs-spin, .mcs-float, .mcs-up, .mcs-drift-a, .mcs-drift-b { animation: none !important; }
}
`