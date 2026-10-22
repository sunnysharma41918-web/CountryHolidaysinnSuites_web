import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  AnimatePresence,
  animate,
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from 'framer-motion'
import { ArrowDown, ArrowUpRight, Baby, BedDouble, Users } from 'lucide-react'
import { PRICING_ID, scrollToId } from './content'
import silverCard from '../../../assets/chis-silver-card.png'
import goldCard from '../../../assets/chis-gold-card.png'
import roomLayoutBackground from '../../../assets/room-layout-background.png'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

/* -------------------------------------------------------------------------- */
/*  Data (unchanged)                                                          */
/* -------------------------------------------------------------------------- */

// Hotel-room photo by Wes Hicks on Unsplash. Replace with your own image/URL any time.
const ROOM_PHOTO =
  'https://images.unsplash.com/photo-1702255489644-392758161f1f?fm=jpg&q=75&w=1600&auto=format&fit=crop&ixlib=rb-4.1.0'

const ROOM_TYPES = {
  T1: {
    id: 'T1',
    name: 'T1 Standard Room',
    cardName: 'Silver',
    cardImage: silverCard,
    rooms: 1,
    adults: 2,
    kids: 2,
    occupancy: '2 adults + 2 children below 6 years',
    description:
      'A comfortable standard-room stay for couples or small families, with space for up to two adults and two young children.',
    // Swap in your own room-layout image here
    layoutImage: ROOM_PHOTO,
    layout: [['adult', 'adult', 'child', 'child']],
  },
  T2: {
    id: 'T2',
    name: 'T2 Two Rooms / Suite',
    cardName: 'Gold',
    cardImage: goldCard,
    rooms: 2,
    adults: 4,
    kids: 2,
    occupancy: '4 adults + 2 children below 6 years',
    description:
      'Room to spread out and settle in. This two-room suite accommodates up to four adults and two young children.',
    // Swap in your own room-layout image here
    layoutImage: ROOM_PHOTO,
    layout: [
      ['adult', 'adult', 'child'],
      ['adult', 'adult', 'child'],
    ],
  },
}

const ROOM_IDS = Object.keys(ROOM_TYPES)
const EASE_OUT = [0.22, 1, 0.36, 1]

/* -------------------------------------------------------------------------- */
/*  Micro-interaction pieces                                                  */
/* -------------------------------------------------------------------------- */

function Counter({ value, reduced }) {
  const mv = useMotionValue(reduced ? value : 0)
  const text = useTransform(mv, (v) => Math.round(v))

  useEffect(() => {
    if (reduced) {
      mv.set(value)
      return undefined
    }
    const controls = animate(mv, value, { duration: 0.9, ease: EASE_OUT })
    return () => controls.stop()
  }, [value, reduced, mv])

  return <motion.span>{text}</motion.span>
}

function MembershipCard({ id, src, alt, reduced }) {
  const mx = useMotionValue(0.5)
  const my = useMotionValue(0.5)
  const sx = useSpring(mx, { stiffness: 160, damping: 18 })
  const sy = useSpring(my, { stiffness: 160, damping: 18 })
  const rotateY = useTransform(sx, [0, 1], [-14, 14])
  const rotateX = useTransform(sy, [0, 1], [12, -12])
  const gx = useTransform(sx, (v) => v * 100)
  const gy = useTransform(sy, (v) => v * 100)
  const glare = useMotionTemplate`radial-gradient(circle at ${gx}% ${gy}%, rgba(255,255,255,0.42), transparent 55%)`

  const handleMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect()
    mx.set((e.clientX - r.left) / r.width)
    my.set((e.clientY - r.top) / r.height)
  }
  const handleLeave = () => {
    mx.set(0.5)
    my.set(0.5)
  }

  return (
    <motion.div
      onPointerMove={reduced ? undefined : handleMove}
      onPointerLeave={reduced ? undefined : handleLeave}
      style={reduced ? undefined : { rotateX, rotateY, transformPerspective: 900 }}
      className="relative w-24 flex-none sm:w-36"
    >
      <div className="mr-card">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={id}
            initial={{ opacity: 0, y: -18, rotate: -5, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, y: 14, rotate: 5, scale: 0.92 }}
            transition={{ duration: 0.4, ease: EASE_OUT }}
            className="relative"
          >
            <img src={src} alt={alt} className="w-full rounded-lg shadow-xl shadow-black/40" />
            {!reduced && (
              <motion.div
                aria-hidden="true"
                style={{ backgroundImage: glare }}
                className="pointer-events-none absolute inset-0 rounded-lg mix-blend-soft-light"
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

/* -------------------------------------------------------------------------- */
/*  Component                                                                 */
/* -------------------------------------------------------------------------- */

export default function MemberRoomType() {
  const [active, setActive] = useState('T1')
  const reduced = !!useReducedMotion()
  const room = ROOM_TYPES[active]

  const sectionRef = useRef(null)
  const headerRef = useRef(null)
  const cardRef = useRef(null)
  const stageRef = useRef(null)
  const bgRef = useRef(null)
  const blobARef = useRef(null)
  const blobBRef = useRef(null)

  const handleEnquiry = () => {
    window.dispatchEvent(
      new CustomEvent('open-booking-modal', {
        detail: {
          destination: `CHIS Membership: ${room.id} ${room.name}`,
          persons: room.occupancy,
          days: '6N/7D stays',
        },
      }),
    )
  }

  const handleTabKeyDown = (event) => {
    const index = ROOM_IDS.indexOf(active)
    let next = index
    if (event.key === 'ArrowRight') next = (index + 1) % ROOM_IDS.length
    else if (event.key === 'ArrowLeft') next = (index - 1 + ROOM_IDS.length) % ROOM_IDS.length
    else return
    event.preventDefault()
    setActive(ROOM_IDS[next])
    document.getElementById(`room-tab-${ROOM_IDS[next]}`)?.focus()
  }

  // Scroll-driven reveals and parallax (skipped entirely for reduced motion)
  useEffect(() => {
    const mm = gsap.matchMedia()
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const once = (trigger, start = 'top 82%') => ({ trigger, start, once: true })

      gsap.from(headerRef.current.children, {
        y: 40,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        stagger: 0.12,
        scrollTrigger: once(headerRef.current),
      })
      gsap.from(cardRef.current, {
        y: 70,
        opacity: 0,
        scale: 0.96,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: once(cardRef.current, 'top 88%'),
      })

      const scrub = (trigger) => ({ trigger, start: 'top bottom', end: 'bottom top', scrub: true })
      gsap.to(blobARef.current, { yPercent: -40, ease: 'none', scrollTrigger: scrub(sectionRef.current) })
      gsap.to(blobBRef.current, { yPercent: 30, ease: 'none', scrollTrigger: scrub(sectionRef.current) })
      gsap.fromTo(
        bgRef.current,
        { yPercent: -5 },
        { yPercent: 5, ease: 'none', scrollTrigger: scrub(stageRef.current) },
      )
    })
    return () => mm.revert()
  }, [])

  const stats = [
    { label: room.rooms === 1 ? 'Room' : 'Rooms', Icon: BedDouble, value: room.rooms },
    { label: 'Adults', Icon: Users, value: room.adults },
    { label: 'Kids under 6', Icon: Baby, value: room.kids },
  ]

  return (
    <section
      ref={sectionRef}
      id="member-room-type"
      className="relative overflow-hidden bg-transparent py-20 text-slate-950 sm:py-28"
    >
      <div
        ref={blobARef}
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 top-10 h-96 w-96 rounded-full bg-[#ff5938]/[0.09] blur-3xl"
      />
      <div
        ref={blobBRef}
        aria-hidden="true"
        className="pointer-events-none absolute -left-44 bottom-16 h-96 w-96 rounded-full bg-[#ff5938]/[0.05] blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <header ref={headerRef} className="mx-auto max-w-3xl border-t border-slate-950/30 pt-3 text-center">
          <p className="flex items-center justify-center gap-2 text-sm font-medium">
            <span className="h-2 w-2 animate-pulse rounded-full bg-[#ff5938]" />
            Find your fit
          </p>
          <h2 className="mt-4 font-sans text-4xl font-semibold uppercase leading-[0.9] tracking-[-0.055em] text-slate-950 sm:text-5xl lg:text-6xl">
            Room for the way
            <span className="block text-[#ff5938]">you like to travel.</span>
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
            Choose a room type to explore the stay, guest capacity, and membership card that suits your next holiday.
          </p>
        </header>

        <div
          ref={cardRef}
          className="mt-12 overflow-hidden rounded-[2rem] border border-slate-950/10 bg-white/95 shadow-[0_30px_80px_-44px_rgba(0,0,0,0.3)] backdrop-blur-sm sm:mt-16 lg:grid lg:grid-cols-[0.88fr_1.12fr]"
        >
          {/* ------------------------------ Info panel ------------------------------ */}
          <div className="relative flex flex-col p-6 sm:p-9 lg:p-11">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <span className="inline-flex items-center gap-2 rounded-full bg-slate-950/[0.05] px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-600">
                Membership room types
              </span>
              <div
                role="tablist"
                aria-label="Choose a room type"
                onKeyDown={handleTabKeyDown}
                className="inline-flex rounded-full bg-slate-100 p-1"
              >
                {ROOM_IDS.map((id) => {
                  const selected = id === active
                  return (
                    <button
                      key={id}
                      id={`room-tab-${id}`}
                      type="button"
                      role="tab"
                      aria-selected={selected}
                      aria-controls="room-type-panel"
                      tabIndex={selected ? 0 : -1}
                      onClick={() => setActive(id)}
                      className={`relative min-w-16 rounded-full px-4 py-2 text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#e84a28] focus-visible:ring-offset-2 ${
                        selected ? 'text-white' : 'text-slate-600 hover:text-slate-950'
                      }`}
                    >
                      {selected && (
                        <motion.span
                          layoutId="room-tab-pill"
                          aria-hidden="true"
                          className="absolute inset-0 rounded-full bg-[#ff5938]"
                          transition={reduced ? { duration: 0 } : { type: 'spring', stiffness: 420, damping: 34 }}
                        />
                      )}
                      <span className="relative z-10">{id}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            <div
              id="room-type-panel"
              role="tabpanel"
              aria-labelledby={`room-tab-${active}`}
              className="mt-8 flex flex-1 flex-col"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={active}
                  initial={reduced ? false : { opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduced ? { opacity: 0 } : { opacity: 0, y: -10 }}
                  transition={{ duration: 0.35, ease: EASE_OUT }}
                >
                  <div className="flex items-start gap-4">
                    <span className="grid h-12 w-12 flex-none place-items-center rounded-2xl bg-[#ff5938]/10 font-display text-lg font-semibold text-[#e3361b]">
                      {room.id}
                    </span>
                    <div>
                      <h3 className="font-sans text-2xl font-semibold uppercase leading-[0.95] tracking-[-0.04em] text-slate-950 sm:text-3xl">
                        {room.name}
                      </h3>
                      <p className="mt-2 text-sm text-slate-500">{room.occupancy}</p>
                    </div>
                  </div>

                  <p className="mt-6 max-w-xl text-base leading-7 text-slate-600">{room.description}</p>

                  <dl className="mt-7 grid grid-cols-3 gap-3 sm:gap-4">
                    {stats.map(({ label, Icon, value }) => (
                      <motion.div
                        key={label}
                        whileHover={reduced ? undefined : { y: -3 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                        className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-950/10 transition-shadow hover:shadow-[0_14px_30px_-18px_rgba(0,0,0,0.2)]"
                      >
                        <dt className="flex items-center gap-2 text-xs text-slate-500 sm:text-sm">
                          <Icon className="h-4 w-4 text-[#ff5938]" aria-hidden="true" />
                          {label}
                        </dt>
                        <dd className="mt-1 font-sans text-3xl font-semibold text-slate-950">
                          <Counter value={value} reduced={reduced} />
                        </dd>
                      </motion.div>
                    ))}
                  </dl>
                </motion.div>
              </AnimatePresence>

              <div className="mt-8 flex flex-wrap gap-3">
                <motion.button
                  type="button"
                  onClick={handleEnquiry}
                  whileHover={reduced ? undefined : { scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-[#ff5938] px-6 py-3 text-sm font-semibold text-slate-950 transition-colors hover:bg-[#ff765d] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ff5938] focus-visible:ring-offset-2"
                >
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full"
                  />
                  <span className="relative">Enquire about {room.id}</span>
                  <ArrowUpRight className="relative h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </motion.button>
                <motion.button
                  type="button"
                  onClick={() => scrollToId(PRICING_ID)}
                  whileHover={reduced ? undefined : { scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  className="group inline-flex items-center gap-2 rounded-full border border-slate-950/25 px-6 py-3 text-sm font-semibold text-slate-950 transition-colors hover:border-[#ff5938] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ff5938] focus-visible:ring-offset-2"
                >
                  View pricing
                  <ArrowDown className="h-4 w-4 transition-transform group-hover:translate-y-0.5" />
                </motion.button>
              </div>
            </div>
          </div>

          {/* ------------------------------ 3D stage ------------------------------ */}
          <div
            ref={stageRef}
            className="relative flex min-h-[26rem] flex-col justify-between overflow-hidden bg-slate-950 p-5 text-white sm:min-h-[32rem] sm:p-8 lg:p-10"
          >
            <img
              ref={bgRef}
              src={roomLayoutBackground}
              alt=""
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 -top-[8%] h-[116%] w-full object-cover opacity-25"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-slate-950/80 via-slate-950/55 to-slate-950/85" />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_64%,rgba(255,89,56,0.24),transparent_62%)]" />

            <div className="relative z-10 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#ff765d]">
                  A closer look
                </p>
                <h3 className="mt-2 font-sans text-2xl font-semibold uppercase leading-[0.95] tracking-[-0.04em] sm:text-3xl">Your room, mapped out.</h3>
              </div>
              <MembershipCard
                id={active}
                src={room.cardImage}
                alt={`CHIS ${room.cardName} membership card`}
                reduced={reduced}
              />
            </div>

            <div className="relative z-10 mt-6 flex flex-1 items-center justify-center">
              <img
                src={room.layoutImage}
                alt={`${room.name} room`}
                loading="lazy"
                decoding="async"
                className="h-auto max-h-64 w-full rounded-2xl bg-[#efeae0] object-contain shadow-xl shadow-black/30 sm:max-h-80"
              />
            </div>

            <p className="relative z-10 mt-6 text-xs leading-5 text-white/60">
              {room.id} · {room.cardName} membership card
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes mr-card-float {
          0%, 100% { transform: translateY(0) rotate(2deg); }
          50% { transform: translateY(-7px) rotate(0deg); }
        }
        .mr-card { animation: mr-card-float 5s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .mr-card { animation: none; }
        }
      `}</style>
    </section>
  )
}