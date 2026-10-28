import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { DEEP, SCREEN, WRAP, YELLOW, unsplash, Img, Tag } from './landingShared'

gsap.registerPlugin(ScrollTrigger)

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap');
.pl-font { font-family: 'Manrope', system-ui, sans-serif; }
`

const PLACES = [
  { name: 'Bali', location: 'Indonesia', from: 'from $640', img: '1537996194471-e657df975ab4' },
  { name: 'Dubai', location: 'United Arab Emirates', from: 'from $890', img: '1512453979798-5ea266f8880c' },
  { name: 'Maldives', location: 'Indian Ocean', from: 'from $1,480', img: '1514282401047-d79a71a590e8' },
  { name: 'Goa', location: 'India', from: 'from $420', img: '1507525428034-b723cf961d3e' },
]

export default function PlacesSection() {
  const root = useRef(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.from('.places-header > *', {
          y: 24,
          opacity: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power3.out',
          clearProps: 'all',
          scrollTrigger: { trigger: '.places-header', start: 'top 85%', once: true },
        })

        gsap.from('.place-card', {
          y: 40,
          opacity: 0,
          duration: 0.9,
          stagger: 0.1,
          ease: 'power3.out',
          clearProps: 'all',
          scrollTrigger: { trigger: '.place-grid', start: 'top 85%', once: true },
        })
      })
    }, root)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={root}
      id="places"
      className={`${SCREEN} pl-font relative flex flex-col justify-center overflow-hidden bg-transparent py-16 text-[#0d4a3a] md:py-20`}
    >
      <style>{CSS}</style>

      <div className={WRAP}>
        <div className="places-header mb-8 md:mb-12">
          <Tag>Curated escapes</Tag>
          <h2 className="font-montserrat mt-3 text-[clamp(2.25rem,3.2vw,2.75rem)] font-bold leading-[1.15] text-[#063a2f]">
            Places worth the journey
          </h2>
        </div>

        <div className="place-grid grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {PLACES.map((p) => (
            <a
              key={p.name}
              href="#faq"
              aria-label={`${p.name}, ${p.location}, ${p.from}`}
              className="place-card group block rounded-3xl border border-white/90 bg-white/75 p-2.5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-[#0d4a3a]/25 hover:bg-white/95 hover:shadow-[0_20px_40px_-10px_rgba(13,74,58,0.12)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffd84d]"
            >
              {/* Photo */}
              <div className="relative aspect-[4/5] overflow-hidden rounded-2xl">
                <Img
                  src={unsplash(p.img, 900)}
                  alt=""
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <span
                  className="absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-bold text-[#0d4a3a] shadow-sm"
                  style={{ background: YELLOW }}
                >
                  {p.from}
                </span>
              </div>

              {/* Text */}
              <div className="flex items-center justify-between gap-3 px-2.5 pb-2 pt-4">
                <div className="min-w-0">
                  <h3 className="font-montserrat truncate text-[clamp(1.25rem,1.6vw,1.5rem)] font-semibold text-[#063a2f]">{p.name}</h3>
                  <p className="font-poppins mt-0.5 truncate text-sm md:text-base font-normal text-slate-500">{p.location}</p>
                </div>
                <span
                  aria-hidden="true"
                  className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-slate-200/70 bg-white/80 text-[#063a2f] shadow-sm backdrop-blur transition-all duration-300 group-hover:border-transparent group-hover:bg-[#0d4a3a] group-hover:text-white"
                >
                  <svg
                    className="h-4 w-4 transition-transform duration-300 group-hover:-rotate-45"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}