import { useLayoutEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowUpRight, ChevronsRight, Hotel, MapPin, Sparkles } from 'lucide-react'
import { WRAP, unsplash, Tag } from './landingShared'

gsap.registerPlugin(ScrollTrigger)

// Curated live featured VIA OTA properties with real verified images
const PROPERTIES = [
  {
    name: 'The Grand Imperial, Agra',
    type: 'Heritage Palace',
    place: 'Agra, Uttar Pradesh',
    slug: 'the-grand-imperial-agra',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRRcwcllaYdHLfGPOUYCX48ogj9m97VJ7ZezS2VDaCu1082w4mi6vvjTVhT&s=10',
    unsplashId: '1566073771259-6a8506099945',
    note: 'Historic Grade-II colonial Mughal luxury near Taj Mahal.',
    gridPos: 'lg:col-start-1 lg:row-start-1',
    isTall: false,
  },
  {
    name: 'Mayfair Hideaway Spa Resort',
    type: 'Spa Sanctuary',
    place: 'Betul, Goa',
    slug: 'mayfair-hideaway-spa-resort',
    image: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/29807934.jpg?k=d6bbfbef9e209c493021242242ced823e7e5b71d874c5048e65515cb449bafcd&o=',
    unsplashId: '1540541338287-41700207dee6',
    note: 'Tranquil riverfront sanctuary with holistic Ayurvedic wellness.',
    gridPos: 'lg:col-start-1 lg:row-start-2',
    isTall: false,
  },
  {
    name: 'The Desert Palace',
    type: 'Royal Palace Resort',
    place: 'Jaisalmer, Rajasthan',
    slug: 'the-desert-palace',
    image: 'https://images.trvl-media.com/lodging/21000000/20200000/20192500/20192442/a2131a3d.jpg?impolicy=resizecrop&rw=575&rh=575&ra=fill',
    unsplashId: '1512917774080-9991f1c4c750',
    note: 'Authentic royal Rajasthani architecture and golden desert dunes.',
    gridPos: 'lg:col-start-2 lg:row-start-1 lg:row-span-2',
    isTall: true,
  },
  {
    name: 'White Woods Resort & Spa',
    type: 'Tropical Retreat',
    place: 'Morjim, Goa',
    slug: 'white-woods-resort-spa',
    image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2e/c1/24/fa/caption.jpg?w=900&h=500&s=1',
    unsplashId: '1571896349842-33c89424de2d',
    note: 'Lush tropical hideaway near serene North Goa beaches.',
    gridPos: 'lg:col-start-3 lg:row-start-1',
    isTall: false,
  },
  {
    name: 'Country Holidays Resorts Hassan Valley',
    type: 'Himalayan Hill Retreat',
    place: 'Shimla, Himachal Pradesh',
    slug: 'country-holidays-resorts-hassan-valley-shimla',
    image: 'https://pix10.agoda.net/hotelImages/32661782/-1/b5bc3f189592bc9eabaca33484be72d6.png?ce=0&s=800x600',
    unsplashId: '1506744038136-46273834b3fb',
    note: 'Panoramic Himalayan cedar valley views and crisp mountain air.',
    gridPos: 'lg:col-start-3 lg:row-start-2',
    isTall: false,
  },
  {
    name: 'Winsome Resort & Spa',
    type: 'Jungle Spa Resort',
    place: 'Jim Corbett, Uttarakhand',
    slug: 'winsome-resort-spa',
    image: 'https://www.winsomeresorts.com/images/photos/3.jpg',
    unsplashId: '1507525428034-b723cf961d3e',
    note: 'Wilderness luxury and safaris adjacent to Corbett National Park.',
    gridPos: 'lg:col-start-4 lg:row-start-1 lg:row-span-2',
    isTall: true,
  },
]

function Card({ p }) {
  const href = `/resorts/${p.slug}`

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className={`pr-card h-full min-h-[260px] sm:min-h-[280px] lg:min-h-0 ${p.gridPos}`}
    >
      <Link
        to={href}
        className="group relative flex h-full w-full flex-col justify-between overflow-hidden rounded-3xl border border-[#297f33]/25 bg-[#0b3f32] p-5 shadow-[0_4px_20px_rgba(6,58,47,0.08)] transition-all duration-500 hover:border-[#297f33] hover:shadow-[0_20px_40px_-12px_rgba(6,58,47,0.35)] lg:p-6"
      >
        {/* Background Image with Fallback */}
        <div className="absolute inset-0">
          <img
            src={p.image}
            alt={p.name}
            loading="lazy"
            onError={(e) => {
              e.currentTarget.onerror = null
              e.currentTarget.src = unsplash(p.unsplashId, 1200)
            }}
            className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
          />
          {/* Deep readable gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/20 transition-opacity duration-300 group-hover:from-black/95" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(251,215,91,0.12),transparent_70%)]" />
        </div>

        {/* Top Badges Bar */}
        <div className="relative z-10 flex items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-black/40 px-3 py-1 font-varela text-[11px] font-semibold text-white backdrop-blur-md ring-1 ring-white/20">
            <Hotel className="h-3 w-3 text-[#fbd75b]" />
            {p.type}
          </span>
          <span className="grid h-8 w-8 place-items-center rounded-full bg-white/20 text-white backdrop-blur-md transition-all duration-300 group-hover:bg-[#fbd75b] group-hover:text-[#063a2f] group-hover:rotate-45">
            <ArrowUpRight className="h-4 w-4" />
          </span>
        </div>

        {/* Bottom Content Area */}
        <div className="relative z-10 pt-4">
          {p.place && (
            <p className="font-varela flex items-center gap-1.5 text-xs font-medium text-white/90">
              <MapPin className="h-3.5 w-3.5 shrink-0 text-[#fbd75b]" />
              <span className="truncate">{p.place}</span>
            </p>
          )}

          <h3
            className={`font-varela mt-1 font-bold leading-tight text-white transition-colors group-hover:text-[#fbd75b] ${
              p.isTall ? 'text-xl sm:text-2xl' : 'text-base sm:text-lg'
            } line-clamp-2`}
          >
            {p.name}
          </h3>

          <p
            className={`font-varela text-white/80 ${
              p.isTall
                ? 'mt-3 line-clamp-2 text-xs border-t border-white/20 pt-3'
                : 'mt-1.5 line-clamp-1 text-[11px]'
            }`}
          >
            {p.note}
          </p>

          {p.isTall && (
            <div className="mt-4 flex items-center justify-between border-t border-white/15 pt-3">
              <span className="inline-flex items-center gap-1 text-xs font-bold text-[#fbd75b] transition-transform group-hover:translate-x-1">
                Explore Retreat &rarr;
              </span>
              <span className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-white/70">
                <Sparkles className="h-2.5 w-2.5 text-[#fbd75b]" /> VIA OTA
              </span>
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  )
}

export default function PropertiesSection() {
  const root = useRef(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap
          .timeline({
            defaults: { ease: 'power3.out' },
            scrollTrigger: { trigger: root.current, start: 'top 75%', once: true },
          })
          .from('.pr-head', { opacity: 0, y: 24, duration: 0.8, stagger: 0.1 })
          .from('.pr-card', { opacity: 0, y: 28, duration: 0.7, stagger: 0.08 }, 0.15)
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={root} id="properties" className="relative flex flex-col bg-transparent py-10 md:py-16 text-[#0d4a3a]">
      <div className={`${WRAP} flex min-h-0 flex-1 flex-col gap-6`}>
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <Tag>EXCLUSIVE PROPERTIES</Tag>
            <h2 className="pr-head font-rader mt-2 text-[clamp(2.25rem,3.6vw,3.15rem)] font-bold leading-[1.12] text-[#063a2f]">
              Our Recent <span className="text-[#297f33]">Properties</span>
            </h2>
          </div>
          <Link
            to="/destinations/category/via-ota"
            className="pr-head inline-flex items-center gap-3 rounded-full border border-white/90 bg-white/80 backdrop-blur-xl py-1.5 pl-5 pr-1.5 text-xs font-semibold text-[#063a2f] shadow-sm hover:bg-white hover:shadow-md transition-all self-start sm:self-auto hover:scale-105 active:scale-95"
          >
            <span className="font-varela font-bold">View all 17 properties</span>
            <span className="grid h-8 w-8 place-items-center rounded-full bg-[#063a2f] text-[#fbd75b]">
              <ChevronsRight className="h-4 w-4" />
            </span>
          </Link>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:grid-rows-2 lg:h-[620px]">
          {PROPERTIES.map((p) => (
            <Card key={p.name} p={p} />
          ))}
        </div>
      </div>
    </section>
  )
}
