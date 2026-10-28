import { useState } from 'react'
import { ArrowRight, Building2, Globe2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { GREEN, YELLOW, WRAP } from './landingShared'

// User's Hotel Partners
import fourPoints from '../../../assets/images/Hotels/Four Points by Sheraton.png'
import primePlaza from '../../../assets/images/Hotels/Prime Plaza Hotel.png'
import radissonBlu from '../../../assets/images/Hotels/Radisson Blu.png'
import roseateHouse from '../../../assets/images/Hotels/Roseate House.png'

// User's Travel Partners
import goibibo from '../../../assets/images/partners/Goibibo.webp'
import tbo from '../../../assets/images/partners/Travel Boutique Online.webp'
import tripadvisor from '../../../assets/images/partners/Tripadvisor India.png'
import makeMyTrip from '../../../assets/images/partners/makemytrip.png'
import trivago from '../../../assets/images/partners/trivago.jpg'

const booking = '/Booking.png'

const HOTEL_PARTNERS = [
  { id: 'radisson', name: 'Radisson Blu', logo: radissonBlu, type: 'Hotel Partner' },
  { id: 'four-points', name: 'Four Points by Sheraton', logo: fourPoints, type: 'Hotel Partner' },
  { id: 'roseate', name: 'Roseate Hotels & Resorts', logo: roseateHouse, type: 'Hotel Partner' },
  { id: 'prime-plaza', name: 'Prime Plaza Hotels', logo: primePlaza, type: 'Hotel Partner' },
  {
    id: 'white-woods',
    name: 'White Woods Resort & Spa',
    type: 'Hotel Partner',
    customRender: () => (
      <div className="flex flex-col items-center text-center">
        <span className="text-sm font-serif font-black tracking-wider text-[#063a2f]">WHITE WOODS</span>
        <span className="text-[8px] font-bold tracking-[0.25em] text-[#c99a2c]">RESORT & SPA</span>
      </div>
    ),
  },
  {
    id: 'taj',
    name: 'Taj Hotels & Palaces',
    type: 'Hotel Partner',
    customRender: () => (
      <div className="flex flex-col items-center text-center">
        <span className="text-base font-serif font-black tracking-widest text-[#063a2f]">TAJ</span>
        <span className="text-[7.5px] font-bold tracking-[0.2em] text-[#063a2f]/70">HOTELS • PALACES • RESORTS</span>
      </div>
    ),
  },
]

const TRAVEL_PARTNERS = [
  { id: 'makemytrip', name: 'MakeMyTrip', logo: makeMyTrip, type: 'Travel Partner' },
  { id: 'booking', name: 'Booking.com', logo: booking, type: 'Travel Partner' },
  { id: 'tripadvisor', name: 'Tripadvisor', logo: tripadvisor, type: 'Travel Partner' },
  { id: 'goibibo', name: 'Goibibo', logo: goibibo, type: 'Travel Partner' },
  { id: 'trivago', name: 'Trivago', logo: trivago, type: 'Travel Partner' },
  { id: 'tbo', name: 'TBO.com', logo: tbo, type: 'Travel Partner' },
]

function PartnerCard({ partner }) {
  return (
    <div
      className="group/card flex h-24 w-48 sm:h-28 sm:w-60 items-center justify-center rounded-2xl border border-white/90 bg-white/75 p-2.5 shadow-[0_8px_25px_-6px_rgba(13,74,58,0.06)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-[#0d4a3a]/25 hover:bg-white/95 hover:shadow-[0_16px_35px_-8px_rgba(13,74,58,0.12)]"
    >
      <div className="flex h-full w-full items-center justify-center rounded-xl bg-white/75 px-4 py-2 shadow-sm backdrop-blur-sm transition-all duration-300 group-hover/card:bg-white">
        {partner.logo ? (
          <img
            src={partner.logo}
            alt={partner.name}
            loading="lazy"
            className="max-h-12 w-auto max-w-[85%] object-contain"
          />
        ) : (
          partner.customRender && partner.customRender()
        )}
      </div>
    </div>
  )
}

function MarqueeRow({ items, dir = 'left', dur = '32s' }) {
  const looped = [...items, ...items, ...items, ...items]
  const mask = 'linear-gradient(90deg,transparent,#000 8%,#000 92%,transparent)'

  return (
    <div
      className="group overflow-hidden py-1.5"
      style={{ maskImage: mask, WebkitMaskImage: mask }}
    >
      <ul
        className="lp-marquee flex items-center gap-4 sm:gap-6 group-hover:[animation-play-state:paused]"
        data-dir={dir}
        style={{ '--dur': dur }}
      >
        {looped.map((p, i) => (
          <li
            key={`${p.id}-${dir}-${i}`}
            aria-hidden={i >= items.length}
            className="shrink-0"
          >
            <PartnerCard partner={p} />
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function PartnersSection() {
  const [activeTab, setActiveTab] = useState('all')

  const TABS = [
    { id: 'all', label: 'All Partners' },
    { id: 'hotels', label: 'Hotels Partners', icon: Building2 },
    { id: 'travel', label: 'Travel Partners', icon: Globe2 },
  ]

  return (
    <section id="partners" className="relative bg-transparent py-16 md:py-24 text-[#0d4a3a] overflow-hidden">
      <div className="w-full flex flex-col gap-8 md:gap-10">
        
        {/* Header with Horizontal Accent Dividers matching Reference Image */}
        <div className="flex items-center justify-center gap-4 px-6 md:gap-8">
          <div className="h-[1px] w-14 sm:w-28 md:w-44 bg-[#0d4a3a]/30" />
          <h2 className="font-montserrat text-[clamp(2.25rem,3.2vw,2.75rem)] font-bold tracking-tight text-[#063a2f] text-center">
            Major Partners
          </h2>
          <div className="h-[1px] w-14 sm:w-28 md:w-44 bg-[#0d4a3a]/30" />
        </div>

        {/* Tab Filter Switcher */}
        <div className="flex justify-center px-4">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-white/90 bg-white/70 p-1.5 shadow-[0_4px_20px_-4px_rgba(13,74,58,0.06)] backdrop-blur-xl">
            {TABS.map((tab) => {
              const active = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex items-center gap-2 rounded-full px-4 py-2 text-xs sm:text-sm font-medium transition-colors ${
                    active ? 'text-[#0d4a3a]' : 'text-[#0d4a3a]/70 hover:text-[#0d4a3a]'
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="partner-tab"
                      className="absolute inset-0 rounded-full shadow-sm"
                      style={{ background: YELLOW }}
                      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    />
                  )}
                  {tab.icon && <tab.icon className="relative z-10 h-3.5 w-3.5" />}
                  <span className="relative z-10 font-semibold">{tab.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Dynamic Partner Marquees */}
        <div className="flex flex-col gap-4">
          <AnimatePresence mode="wait">
            {activeTab === 'all' && (
              <motion.div
                key="all-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col gap-4 sm:gap-6"
              >
                <div>
                  <div className="mb-2 text-center">
                    <span className="text-[11px] font-semibold tracking-wider uppercase text-[#0d4a3a]/60">
                      Hotel Partners
                    </span>
                  </div>
                  <MarqueeRow items={HOTEL_PARTNERS} dir="left" dur="32s" />
                </div>
                <div>
                  <div className="mb-2 text-center">
                    <span className="text-[11px] font-semibold tracking-wider uppercase text-[#0d4a3a]/60">
                      Travel & Booking Partners
                    </span>
                  </div>
                  <MarqueeRow items={TRAVEL_PARTNERS} dir="right" dur="36s" />
                </div>
              </motion.div>
            )}

            {activeTab === 'hotels' && (
              <motion.div
                key="hotels-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="py-4"
              >
                <MarqueeRow items={HOTEL_PARTNERS} dir="left" dur="28s" />
              </motion.div>
            )}

            {activeTab === 'travel' && (
              <motion.div
                key="travel-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="py-4"
              >
                <MarqueeRow items={TRAVEL_PARTNERS} dir="left" dur="28s" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Centered "Become a Partner" Button matching Reference Image */}
        <div className="flex justify-center pt-2">
          <motion.a
            href="#contact"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-4 rounded-full py-2.5 pl-7 pr-2.5 text-sm font-semibold text-[#0d4a3a] shadow-md transition-all hover:shadow-lg"
            style={{ background: YELLOW }}
          >
            Become a Partner
            <span
              className="grid h-9 w-9 place-items-center rounded-full text-white shadow-sm"
              style={{ background: GREEN }}
            >
              <ArrowRight className="h-4 w-4" />
            </span>
          </motion.a>
        </div>

      </div>
    </section>
  )
}
