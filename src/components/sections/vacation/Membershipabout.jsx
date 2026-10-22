import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowDown, ArrowUpRight } from 'lucide-react'
import { openEnquiry, PRICING_ID, scrollToId } from './content'
import womanImage from '../../../assets/chis-woman.png'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

/* -------------------------------------------------------------------------- */
/*  Design tokens                                                             */
/*  ink     #0b0706  warm black base                                          */
/*  ember   #ff5938  CHIS red (glow, accents)                                 */
/*  rust    #d9361b  deep CHIS red (gradient end)                             */
/*  paper   #f6efe9  warm white for type                                      */
/*  mute    paper @ 55%  secondary copy                                       */
/* -------------------------------------------------------------------------- */

const LEAD =
  'Confused which hotel will provide you the best services? Well, you don’t have to worry anymore, because you have landed at the right place. Country Holidays Inn & Suites is everything that the customers’ desire. Exceptional holiday packages with affordable prices. A one-stop destination for all your exotic vacation needs. Country Holidays Inn & Suites assures you fully equipped rooms with all modern facilities that let you have a fabulous holiday trip. Come along with us if you need a break from your ordinary lifestyle. We are here for you.'

const STATS = [
  { value: '5–30', label: 'Years of membership' },
  { value: '6N / 7D', label: 'Holiday stays' },
  { value: '500+', label: 'Destinations' },
  { value: '₹10,000+', label: 'Potential flight savings' },
]

export default function MembershipAboutSection() {
  const root = useRef(null)
  const glowRef = useRef(null)
  const glow2Ref = useRef(null)
  const womanRef = useRef(null)

  useEffect(() => {
    const el = root.current
    if (!el) return undefined

    const mm = gsap.matchMedia()

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      // 1. The one orchestrated moment: "About" rises letter by letter from a mask.
      gsap.from(el.querySelectorAll('[data-letter]'), {
        yPercent: 115,
        rotate: 4,
        duration: 1.3,
        stagger: 0.07,
        ease: 'expo.out',
        scrollTrigger: { trigger: el, start: 'top 75%', once: true },
      })

      // 2. Lead paragraph brightens word by word as you scroll.
      gsap.from(el.querySelectorAll('[data-word]'), {
        opacity: 0.14,
        stagger: 0.12,
        ease: 'none',
        scrollTrigger: {
          trigger: el.querySelector('[data-lead]'),
          start: 'top 82%',
          end: 'bottom 50%',
          scrub: true,
        },
      })

      // 3. Glow parallax.
      const scrub = { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true }
      gsap.to(glowRef.current, { yPercent: 40, ease: 'none', scrollTrigger: scrub })
      gsap.to(glow2Ref.current, { yPercent: -30, ease: 'none', scrollTrigger: scrub })

      // 4. Hairlines draw in.
      el.querySelectorAll('[data-line]').forEach((line) => {
        gsap.from(line, {
          scaleX: 0,
          transformOrigin: 'left center',
          duration: 1.4,
          ease: 'expo.out',
          scrollTrigger: { trigger: line, start: 'top 92%', once: true },
        })
      })

      // 5. Stats slide up once, as a group.
      gsap.from(el.querySelectorAll('[data-stat]'), {
        y: 40,
        opacity: 0,
        duration: 1,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: { trigger: el.querySelector('[data-stats]'), start: 'top 88%', once: true },
      })

      // 6. The portrait drifts slightly slower than the page.
      gsap.fromTo(
        womanRef.current,
        { yPercent: 6 },
        {
          yPercent: -6,
          ease: 'none',
          scrollTrigger: { trigger: womanRef.current, start: 'top bottom', end: 'bottom top', scrub: true },
        },
      )
    })

    return () => mm.revert()
  }, [])

  const words = LEAD.split(' ')

  return (
    <section
      ref={root}
      id="membership-about"
      className="relative isolate overflow-hidden bg-[#0b0706] text-[#f6efe9]"
    >
      <style>{`
        @keyframes ma-drift {
          from { transform: translate(0,0) scale(1); }
          to   { transform: translate(60px,40px) scale(1.18); }
        }
        #membership-about .ma-drift { animation: ma-drift 18s ease-in-out infinite alternate; }
        #membership-about .ma-grain {
          background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='.5'/></svg>");
        }
        @media (prefers-reduced-motion: reduce) {
          #membership-about .ma-drift { animation: none !important; }
        }
      `}</style>

      {/* Atmosphere: ember glow top-left, faint counter-glow bottom-right, film grain */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div ref={glowRef} className="absolute -left-48 -top-48 h-[44rem] w-[44rem]">
          <div className="ma-drift h-full w-full rounded-full bg-[radial-gradient(closest-side,#ff5938_0%,rgba(217,54,27,0.55)_40%,transparent_72%)] opacity-70 blur-3xl" />
        </div>
        <div ref={glow2Ref} className="absolute -right-56 bottom-0 h-[36rem] w-[36rem]">
          <div className="ma-drift h-full w-full rounded-full bg-[radial-gradient(closest-side,#d9361b_0%,transparent_70%)] opacity-25 blur-3xl" />
        </div>
        <div className="ma-grain absolute inset-0 opacity-[0.07] mix-blend-overlay" />
      </div>

      {/* ============================ ABOUT ============================ */}
      <div className="mx-auto max-w-[96rem] px-5 pb-24 pt-10 sm:px-10 sm:pb-36 lg:px-16">
        {/* Top bar */}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => openEnquiry()}
            className="group text-right text-[11px] leading-4 tracking-wide focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ff5938]"
          >
            <span className="block text-[#f6efe9]/75">Questions about membership?</span>
            <span className="inline-flex items-center gap-1 text-[#ff5938] transition-colors group-hover:text-[#ff8a70]">
              Drop us a line
              <ArrowUpRight className="h-3 w-3 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </span>
          </button>
        </div>

        {/* Headline */}
        <h2
          aria-label="About"
          className="mt-6 flex select-none justify-center font-nunito font-normal leading-[0.9] tracking-[-0.06em] sm:mt-2"
          style={{ fontSize: 'clamp(6rem, 21vw, 20rem)' }}
        >
          {'About'.split('').map((ch, i) => (
            <span key={i} className="overflow-hidden pb-[0.08em] pr-[0.01em]" aria-hidden="true">
              <span
                data-letter
                className="inline-block bg-clip-text text-transparent"
                style={{
                  // each letter samples a slice of one shared white → CHIS red gradient
                  backgroundImage: 'linear-gradient(90deg,#f6efe9 0%,#f6efe9 18%,#ff5938 78%,#d9361b 100%)',
                  backgroundSize: '500% 100%',
                  backgroundPosition: `${i * 25}% 0`,
                  WebkitBackgroundClip: 'text',
                }}
              >
                {ch}
              </span>
            </span>
          ))}
        </h2>
        <p className="mt-6 text-center font-sans text-xl font-light tracking-[-0.02em] text-[#ff5938] sm:mt-8 sm:text-3xl">
          CHIS Membership Plans
        </p>

        {/* Lead paragraph: centred */}
        <p
          data-lead
          className="mx-auto mt-10 max-w-[64rem] text-center font-sans font-light tracking-[-0.03em] text-[#f6efe9] sm:mt-12"
          style={{
            fontSize: 'clamp(1.35rem, 2.6vw, 2.35rem)',
            lineHeight: 1.08,
          }}
        >
          {words.map((w, i) => (
            <span key={i} data-word>
              {w}{' '}
            </span>
          ))}
        </p>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-4 sm:mt-16">
          <button
            type="button"
            onClick={() => scrollToId(PRICING_ID)}
            className="group inline-flex items-center gap-3 rounded-full bg-[#ff5938] py-1.5 pl-6 pr-1.5 text-sm font-medium text-[#0b0706] transition-colors duration-300 hover:bg-[#ff765d] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#f6efe9] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0706]"
          >
            Explore membership
            <span className="grid h-10 w-10 place-items-center rounded-full bg-[#0b0706] text-[#ff5938] transition-transform duration-500 group-hover:rotate-[135deg]">
              <ArrowDown className="h-4 w-4" aria-hidden="true" />
            </span>
          </button>
          <button
            type="button"
            onClick={() => openEnquiry()}
            className="rounded-full border border-[#f6efe9]/25 px-6 py-3 text-sm text-[#f6efe9] transition-colors duration-300 hover:border-[#ff5938] hover:text-[#ff5938] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ff5938]"
          >
            Ask us a question
          </button>
        </div>
      </div>

      {/* ======================= MEMBER ADVANTAGE ======================= */}
      <div className="mx-auto max-w-[96rem] px-5 sm:px-10 lg:px-16">
        <div data-line className="h-px w-full bg-[#f6efe9]/15" />

        <div className="grid items-center gap-14 py-20 sm:py-28 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
          {/* Oversized figure */}
          <div>
            <p className="text-sm text-[#f6efe9]/55">The member advantage</p>
            <p
              className="mt-4 select-none font-sans font-normal pb-[0.12em] leading-[0.95] tracking-[-0.06em] text-transparent"
              style={{
                fontSize: 'clamp(4.5rem, 13vw, 12rem)',
                backgroundImage: 'linear-gradient(95deg,#f6efe9 0%,#ff5938 70%,#d9361b 100%)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
              }}
            >
              Escape
            </p>
            <h3 className="mt-8 max-w-xl font-sans text-2xl font-light leading-tight tracking-[-0.03em] sm:text-4xl">
              Highlights of the CHIS Travel Membership Plan
            </h3>
            <p className="mt-5 max-w-md text-sm leading-7 text-[#f6efe9]/60 sm:text-base">
              Six nights and seven days at destinations across India and beyond, with member benefits that make every journey more rewarding.
            </p>
            <a
              href="#member-benefits"
              className="group mt-8 inline-flex items-center gap-2 border-b border-[#ff5938] pb-1 text-sm font-medium text-[#f6efe9] transition-colors hover:text-[#ff5938] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ff5938]"
            >
              Explore member benefits
              <ArrowDown className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-0.5" aria-hidden="true" />
            </a>
          </div>

          {/* Portrait: she points back toward the copy */}
          <div className="relative grid min-h-[22rem] place-items-end justify-items-center sm:min-h-[30rem]">
            <div aria-hidden="true" className="absolute bottom-[8%] h-[80%] w-[80%] rounded-full bg-[#ff5938]/25 blur-[100px]" />
            <img
              ref={womanRef}
              src={womanImage}
              alt="Smiling woman pointing toward the CHIS membership benefits"
              loading="lazy"
              className="relative w-full max-w-[36rem] select-none"
              style={{
                WebkitMaskImage: 'linear-gradient(to bottom, #000 78%, transparent 100%)',
                maskImage: 'linear-gradient(to bottom, #000 78%, transparent 100%)',
              }}
            />
          </div>
        </div>

        {/* Stats */}
        <div data-line className="h-px w-full bg-[#f6efe9]/15" />
        <dl data-stats className="grid grid-cols-2 sm:grid-cols-4">
          {STATS.map((s, i) => (
            <div
              key={s.label}
              data-stat
              className={`py-8 pr-4 sm:py-12 ${i > 0 ? 'sm:border-l sm:border-[#f6efe9]/15 sm:pl-8' : ''}`}
            >
              <dd className="font-sans text-3xl font-light leading-none tracking-[-0.05em] sm:text-5xl">{s.value}</dd>
              <dt className="mt-3 text-xs text-[#f6efe9]/55 sm:text-sm">{s.label}</dt>
            </div>
          ))}
        </dl>
        <div className="h-16 sm:h-24" />
      </div>
    </section>
  )
}