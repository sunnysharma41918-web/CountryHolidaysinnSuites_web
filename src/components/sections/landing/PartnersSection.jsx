import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Building2, Globe2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { GREEN, YELLOW, WRAP, Tag } from './landingShared'
import BotanicalBranch from '../../common/BotanicalBranch'

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
    <div className="group relative flex h-24 w-48 sm:h-28 sm:w-56 shrink-0 items-center justify-center rounded-2xl border border-white/80 bg-white/70 p-4 shadow-[0_4px_20px_-4px_rgba(13,74,58,0.08)] backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-[#297f33]/40 hover:bg-white hover:shadow-[0_12px_30px_-6px_rgba(41,127,51,0.18)]">
      {partner.customRender ? (
        partner.customRender()
      ) : (
        <img
          src={partner.logo}
          alt={partner.name}
          className="max-h-12 max-w-[130px] sm:max-h-14 sm:max-w-[150px] object-contain transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
      )}
      <span className="absolute bottom-1.5 left-1/2 -translate-x-1/2 text-[9px] font-medium tracking-wider uppercase text-[#0d4a3a]/40 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
        {partner.name}
      </span>
    </div>
  )
}

function MarqueeRow({ items, dir = 'left', dur = '35s' }) {
  // Duplicate 4x to ensure uninterrupted looping
  const duplicated = [...items, ...items, ...items, ...items]

  return (
    <div className="relative w-full overflow-hidden py-2 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
      <div
        className="lp-marquee gap-4 sm:gap-6"
        data-dir={dir}
        style={{ '--dur': dur }}
      >
        {duplicated.map((p, idx) => (
          <PartnerCard key={`${p.id}-${idx}`} partner={p} />
        ))}
      </div>
    </div>
  )
}

export default function PartnersSection() {
  const [activeTab, setActiveTab] = useState('all')

  const TABS = [
    { id: 'all', label: 'All Partners' },
    { id: 'hotels', label: 'Hotel Partners', icon: Building2 },
    { id: 'travel', label: 'Travel Partners', icon: Globe2 },
  ]

  return (
    <section id="partners" className="relative bg-transparent py-8 md:py-12 text-[#0d4a3a] overflow-hidden">
      <div className="w-full flex flex-col gap-6 md:gap-8">
        
        {/* Header with Horizontal Accent Dividers */}
        <div className="flex flex-col items-center justify-center gap-1.5 px-6">
          <Tag>COLLABORATIONS</Tag>
          <div className="flex items-center justify-center gap-2 sm:gap-4 md:gap-8">
            <BotanicalBranch className="shrink-0" />
            <h2 className="font-rader text-[clamp(2rem,3.6vw,3.15rem)] font-bold tracking-tight text-[#063a2f] text-center">
              Major <span className="text-[#297f33]">Partners</span>
            </h2>
            <BotanicalBranch mirror className="shrink-0" />
          </div>
        </div>

        {/* Tab Filter Switcher */}
        <div className="flex justify-center px-4 max-w-full overflow-x-auto">
          <div className="inline-flex items-center gap-1 sm:gap-1.5 rounded-full border border-white/90 bg-white/70 p-1 sm:p-1.5 shadow-[0_4px_20px_-4px_rgba(13,74,58,0.06)] backdrop-blur-xl">
            {TABS.map((tab) => {
              const active = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative shrink-0 flex items-center gap-1.5 sm:gap-2 rounded-full px-3 sm:px-4 py-1.5 sm:py-2 text-[11px] min-[380px]:text-xs sm:text-sm font-medium transition-colors ${
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
                  {tab.icon && <tab.icon className="relative z-10 h-3 w-3 sm:h-3.5 sm:w-3.5" />}
                  <span className="relative z-10 font-varela font-bold">{tab.label}</span>
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
                    <span className="font-varela text-[11px] font-semibold tracking-wider uppercase text-[#0d4a3a]/60">
                      Hotel Partners
                    </span>
                  </div>
                  <MarqueeRow items={HOTEL_PARTNERS} dir="left" dur="32s" />
                </div>
                <div>
                  <div className="mb-2 text-center">
                    <span className="font-varela text-[11px] font-semibold tracking-wider uppercase text-[#0d4a3a]/60">
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

        {/* Centered "Become a Partner" Button connected to Contact Section */}
        <div className="flex justify-center pt-2">
          <Link
            to="/contact"
            className="group inline-flex items-center gap-4 rounded-full py-2.5 pl-7 pr-2.5 text-sm font-semibold text-[#0d4a3a] shadow-md transition-all hover:scale-105 hover:shadow-lg active:scale-95"
            style={{ background: YELLOW }}
          >
            <span className="font-varela font-bold">Become a Partner</span>
            <span
              className="grid h-9 w-9 place-items-center rounded-full text-white shadow-sm transition-transform duration-300 group-hover:translate-x-0.5"
              style={{ background: GREEN }}
            >
              <ArrowRight className="h-4 w-4" />
            </span>
          </Link>
        </div>

      </div>
    </section>
  )
}
