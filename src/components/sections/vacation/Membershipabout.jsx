import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowDown, ArrowUpRight } from 'lucide-react'
import { openEnquiry, PRICING_ID, scrollToId } from './content'
import membershipCard from '../../../assets/chis-gold-card.png'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

/* -------------------------------------------------------------------------- */
/*  Palette: white · charcoal · CHIS red */
/* -------------------------------------------------------------------------- */

/* -------------------------------------------------------------------------- */
/*  Section                                                                   */
/* -------------------------------------------------------------------------- */

export default function MembershipAboutSection() {
  const ref = useRef(null)
  const blobARef = useRef(null)
  const blobBRef = useRef(null)
  const reduced = !!useReducedMotion()

  // GSAP: scroll reveals, rule draw, and blob parallax.
  // Content stays visible if JS is unavailable; reduced motion skips all of it.
  useEffect(() => {
    const root = ref.current
    if (!root) return undefined

    const mm = gsap.matchMedia()
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      root.querySelectorAll('[data-reveal]').forEach((el) => {
        const isCard = el.dataset.reveal === 'card'
        gsap.from(el, {
          opacity: 0,
          ...(isCard ? { y: 48, scale: 0.96 } : { y: 30 }),
          duration: 0.9,
          delay: (Number(el.dataset.delay) || 0) / 1000,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 90%', once: true },
        })
      })

      root.querySelectorAll('.ma-rule').forEach((el) => {
        gsap.from(el, {
          scaleX: 0,
          transformOrigin: 'left center',
          duration: 1.2,
          delay: 0.25,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 92%', once: true },
        })
      })

      const scrub = { trigger: root, start: 'top bottom', end: 'bottom top', scrub: true }
      gsap.to(blobARef.current, { yPercent: -35, ease: 'none', scrollTrigger: scrub })
      gsap.to(blobBRef.current, { yPercent: 28, ease: 'none', scrollTrigger: scrub })
    })

    return () => mm.revert()
  }, [])

  return (
    <section
      ref={ref}
      id="membership-about"
      className="relative isolate overflow-hidden bg-transparent py-20 text-slate-950 sm:py-28"
    >
      <style>{`
        @keyframes ma-glow {
          from { transform: translate(0, 0) scale(1); }
          to   { transform: translate(36px, -28px) scale(1.15); }
        }

        #membership-about .ma-glow { animation: ma-glow 16s ease-in-out infinite alternate; }

        @media (prefers-reduced-motion: reduce) {
          #membership-about .ma-glow { animation: none !important; }
        }
      `}</style>

      {/* Atmosphere: outer wrappers are parallaxed by GSAP, inner blobs drift via CSS */}
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <div ref={blobARef} className="absolute -left-40 top-24 h-[30rem] w-[30rem]">
          <div className="ma-glow h-full w-full rounded-full bg-[#ff5938]/15 blur-3xl" />
        </div>
        <div ref={blobBRef} className="absolute -right-40 bottom-20 h-[32rem] w-[32rem]">
          <div className="ma-glow h-full w-full rounded-full bg-[#ff5938]/10 blur-3xl" />
        </div>
      </div>

      <svg
        aria-hidden="true"
        viewBox="0 0 1440 1100"
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[58rem] w-full opacity-[0.16]"
      >
        <g fill="none" stroke="#0f172a" strokeDasharray="14 18" strokeLinecap="round" strokeWidth="3" opacity=".45">
          <path d="M-40 210 C 180 210, 170 300, 410 300" />
          <path d="M-50 450 C 190 450, 260 520, 520 520" />
          <path d="M-60 700 C 220 700, 300 790, 600 790" />
        </g>
        <g fill="#ff5938">
          <path d="M410 286l9 12 28 3-28 4-9 12-4-13-14-2 14-3z" />
          <path d="M520 506l9 12 28 3-28 4-9 12-4-13-14-2 14-3z" />
          <path d="M600 776l9 12 28 3-28 4-9 12-4-13-14-2 14-3z" />
        </g>
      </svg>

      {/* ===== CHIS membership introduction ===== */}
      <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <div className="relative grid min-h-[32rem] items-center gap-8 overflow-hidden border-y border-slate-950/10 py-10 sm:py-14 lg:min-h-[38rem] lg:grid-cols-[0.8fr_1.2fr] lg:gap-12 lg:py-16">
          <span aria-hidden="true" className="pointer-events-none absolute -left-3 top-1/2 hidden -translate-y-1/2 -rotate-90 font-display text-[7rem] font-bold leading-none tracking-[0.18em] text-slate-950/[0.035] sm:block lg:-left-8 lg:text-[9rem]">
            ABOUT
          </span>
          <div data-reveal className="relative z-10 max-w-xl lg:pl-10">
            <p className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#d9361b]">
              <span className="h-2 w-2 rounded-full bg-[#ff5938]" />
              About Country Holidays
            </p>
            <h2 className="font-sans text-4xl font-semibold uppercase leading-[0.9] tracking-[-0.055em] sm:text-5xl lg:text-6xl">
              A better way
              <span className="block text-[#d9361b]">to holiday.</span>
            </h2>
            <p className="mt-6 text-sm leading-7 text-slate-700 sm:text-base sm:leading-8">
              Country Holidays Inn &amp; Suites brings memorable stays and thoughtfully planned getaways together.
              Discover comfortable rooms, exceptional holiday packages, and member benefits designed to make every
              vacation feel special.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <motion.button
                type="button"
                onClick={() => scrollToId(PRICING_ID)}
                whileHover={reduced ? undefined : { scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className="group inline-flex items-center gap-2 rounded-full bg-[#ff5938] px-6 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-[#ff5938]/20 transition-colors duration-300 hover:bg-[#ff765d] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ff5938] focus-visible:ring-offset-2"
              >
                Explore membership
                <ArrowDown className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-0.5" />
              </motion.button>
              <motion.button
                type="button"
                onClick={() => openEnquiry()}
                whileHover={reduced ? undefined : { scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className="group inline-flex items-center gap-2 rounded-full border border-slate-950/25 bg-white/50 px-6 py-3 text-sm font-medium text-slate-950 transition-colors duration-300 hover:border-[#ff5938] hover:bg-[#ff5938]/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ff5938]"
              >
                Ask us a question
                <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </motion.button>
            </div>
          </div>

          <div data-reveal data-delay="120" className="relative flex min-h-[16rem] items-center justify-center sm:min-h-[22rem] lg:min-h-[28rem]">
            <div aria-hidden="true" className="absolute inset-x-0 top-1/2 h-[75%] -translate-y-1/2 rounded-full bg-[#ff5938]/[0.06] blur-3xl" />
            <p aria-hidden="true" className="relative select-none font-sans text-[clamp(10rem,30vw,26rem)] font-bold leading-[0.72] tracking-[-0.12em] text-transparent sm:text-[clamp(14rem,28vw,24rem)]" style={{ backgroundImage: `url(${membershipCard})`, backgroundPosition: 'center', backgroundSize: 'cover', backgroundClip: 'text', WebkitBackgroundClip: 'text' }}>
              CHIS
            </p>
            <div className="absolute bottom-0 right-0 rounded-2xl border border-white/75 bg-white/75 px-5 py-4 shadow-[0_18px_45px_-24px_rgba(15,23,42,0.4)] backdrop-blur-sm sm:bottom-2 sm:right-4 sm:px-6 sm:py-5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#d9361b]">Your holiday, your way</p>
              <p className="mt-1 font-display text-xl font-semibold text-slate-950 sm:text-2xl">Make every stay count.</p>
            </div>
          </div>
        </div>
      </div>

      {/* ===== Member advantage: destination feature and travel statistics ===== */}
      <div className="relative z-10 mt-16 w-full px-4 sm:mt-20 sm:px-6 lg:mt-24 lg:px-8">
        <div className="grid min-h-[100svh] w-full grid-rows-[1fr_auto] overflow-hidden rounded-[1.5rem] bg-transparent text-slate-950 sm:rounded-[2rem]">
          <div className="grid min-h-[70svh] items-center gap-8 px-6 py-12 sm:px-10 lg:min-h-[calc(100svh-7rem)] lg:grid-cols-2 lg:gap-12 lg:px-14 lg:py-14">
            <div data-reveal className="relative flex min-h-[22rem] items-center justify-center sm:min-h-[28rem]">
              <div aria-hidden="true" className="absolute h-[18rem] w-[18rem] rounded-full bg-[#fff0e9] sm:h-[24rem] sm:w-[24rem]" />
              <div aria-hidden="true" className="absolute h-[13rem] w-[13rem] rounded-full border border-[#ff5938]/20 sm:h-[18rem] sm:w-[18rem]" />
              <div className="relative grid h-[11rem] w-[11rem] place-items-center rounded-full bg-[#d9361b] text-center text-white shadow-[0_24px_70px_-24px_rgba(217,54,27,0.55)] sm:h-[15rem] sm:w-[15rem]">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/80 sm:text-xs">Discover</p>
                  <p className="mt-1 font-sans text-5xl font-semibold leading-none tracking-[-0.06em] sm:text-7xl">500<span className="text-[#ffc6b8]">+</span></p>
                  <p className="mt-2 text-xs font-medium text-white/90 sm:text-sm">destinations</p>
                </div>
              </div>
              <div className="absolute left-0 top-[18%] rounded-xl border border-slate-950/5 bg-white/85 px-4 py-3 shadow-lg backdrop-blur-sm sm:left-[3%]">
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">Member stay</p>
                <p className="mt-1 font-display text-lg font-semibold leading-none text-slate-950 sm:text-xl">6 nights</p>
              </div>
              <div className="absolute bottom-[12%] right-0 rounded-xl border border-slate-950/5 bg-white/85 px-4 py-3 shadow-lg backdrop-blur-sm sm:right-[3%]">
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">Every getaway</p>
                <p className="mt-1 font-display text-lg font-semibold leading-none text-slate-950 sm:text-xl">7 days</p>
              </div>
            </div>

            <div data-reveal data-delay="100" className="relative z-10">
              <p className="flex items-center gap-2 text-sm font-medium text-slate-600">
                <span className="h-2 w-2 animate-pulse rounded-full bg-[#ff5938]" />
                The member advantage
              </p>
              <h3 className="mt-5 max-w-xl font-sans text-3xl font-semibold uppercase leading-[0.92] tracking-[-0.055em] sm:text-4xl lg:text-[3.2rem]">
                Highlights Of CHIS
                <span className="mt-1 block">Travel Membership Plan</span>
              </h3>
              <p className="mt-6 font-sans text-[clamp(3.5rem,7vw,6rem)] font-semibold leading-none tracking-[-0.07em] text-[#176b49]">
                6N <span className="text-[#ff5938]">/</span> 7D
              </p>
              <p className="mt-2 text-lg font-medium tracking-tight text-slate-950 sm:text-xl">Holiday stays made for your next escape</p>
              <p className="mt-3 max-w-lg text-sm leading-6 text-slate-600 sm:text-base sm:leading-7">
                Enjoy six nights and seven days at destinations across India and beyond, with member benefits that make every journey more rewarding.
              </p>
              <div className="mt-6 flex flex-col items-start gap-5 sm:flex-row sm:items-center">
                <a
                  href="#member-benefits"
                  className="group inline-flex items-center gap-3 rounded-full bg-[#ff5938] py-1.5 pl-6 pr-1.5 text-sm font-semibold text-slate-950 shadow-lg shadow-[#ff5938]/20 transition-transform duration-300 hover:scale-[1.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 active:scale-95"
                >
                  Explore member benefits
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-950 text-[#ff5938] transition-transform duration-300 group-hover:rotate-45">
                    <ArrowDown aria-hidden="true" className="h-4 w-4" />
                  </span>
                </a>
                <div className="flex items-center gap-3">
                  <img
                    src={membershipCard}
                    alt="CHIS Gold membership card"
                    loading="lazy"
                    className="w-32 -rotate-3 rounded-lg shadow-[0_14px_30px_-14px_rgba(0,0,0,0.55)] sm:w-40"
                  />
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#d9361b]">Your membership</p>
                    <p className="mt-1 font-display text-lg font-semibold text-slate-950">T-2 Gold</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 border-y border-slate-950/15 sm:grid-cols-4">
            {[
              { value: '5–30', label: 'Years of membership' },
              { value: '6N / 7D', label: 'Holiday stays' },
              { value: '500+', label: 'Destinations' },
              { value: '₹10,000+', label: 'Potential flight savings' },
            ].map((stat, i) => (
              <div
                key={stat.label}
                data-reveal
                data-delay={i * 60}
                className={`border-slate-950/15 px-5 py-5 sm:px-7 sm:py-6 ${
                  i < 2 ? 'border-b' : ''
                } ${i % 2 === 0 ? 'border-r' : ''} sm:border-b-0 sm:border-r sm:last:border-r-0`}
              >
                <p className="font-sans text-3xl font-semibold leading-none tracking-[-0.04em] sm:text-4xl">{stat.value}</p>
                <p className="mt-2 text-xs leading-5 text-slate-600 sm:text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}