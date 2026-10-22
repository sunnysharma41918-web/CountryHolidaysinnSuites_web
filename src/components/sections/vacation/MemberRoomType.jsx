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
import { ArrowDown, ArrowUpRight, Baby, BedDouble, Plus, Users } from 'lucide-react'
import { PRICING_ID, scrollToId } from './content'
import silverCard from '../../../assets/chis-silver-card.png'
import goldCard from '../../../assets/chis-gold-card.png'
import roomLayoutBackground from '../../../assets/room-layout-background.png'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

/* -------------------------------------------------------------------------- */
/*  Tokens (shared with MembershipAboutSection)                               */
/*  ink #0b0706 · ember #ff5938 · rust #d9361b · paper #f6efe9                */
/* -------------------------------------------------------------------------- */

const GRADIENT = 'linear-gradient(95deg,#f6efe9 0%,#ff5938 70%,#d9361b 100%)'

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
      className="relative w-28 flex-none sm:w-40 lg:w-48"
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
            <img src={src} alt={alt} className="w-full rounded-lg shadow-[0_24px_50px_-14px_rgba(0,0,0,0.8)]" />
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
/*  Component: accordion of room types                                        */
/* -------------------------------------------------------------------------- */

const MUTED_FILL = 'linear-gradient(rgba(246,239,233,0.26),rgba(246,239,233,0.26))'

export default function MemberRoomType() {
  const [active, setActive] = useState('T1')
  const reduced = !!useReducedMotion()

  const sectionRef = useRef(null)
  const glowARef = useRef(null)
  const glowBRef = useRef(null)

  const handleEnquiry = (room) => {
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

  const handleKeyDown = (event, id) => {
    const index = ROOM_IDS.indexOf(id)
    let next = index
    if (event.key === 'ArrowDown') next = (index + 1) % ROOM_IDS.length
    else if (event.key === 'ArrowUp') next = (index - 1 + ROOM_IDS.length) % ROOM_IDS.length
    else return
    event.preventDefault()
    document.getElementById(`room-tab-${ROOM_IDS[next]}`)?.focus()
  }

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return undefined
    const mm = gsap.matchMedia()
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.from(el.querySelectorAll('[data-rise]'), {
        yPercent: 115,
        rotate: 3,
        duration: 1.3,
        ease: 'expo.out',
        scrollTrigger: { trigger: el, start: 'top 70%', once: true },
      })
      gsap.from(el.querySelectorAll('[data-fade]'), {
        y: 24,
        opacity: 0,
        duration: 1,
        stagger: 0.12,
        delay: 0.3,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 70%', once: true },
      })
      gsap.from(el.querySelectorAll('[data-row]'), {
        y: 50,
        opacity: 0,
        duration: 1.1,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: { trigger: el.querySelector('[data-rows]'), start: 'top 85%', once: true },
      })
      const scrub = { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true }
      gsap.to(glowARef.current, { yPercent: 40, ease: 'none', scrollTrigger: scrub })
      gsap.to(glowBRef.current, { yPercent: -30, ease: 'none', scrollTrigger: scrub })
    })
    return () => mm.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="member-room-type"
      className="relative isolate overflow-hidden bg-[#0b0706] py-20 text-[#f6efe9] sm:py-28"
    >
      <style>{`
        @keyframes mr-card-float {
          0%, 100% { transform: translateY(0) rotate(2deg); }
          50% { transform: translateY(-7px) rotate(0deg); }
        }
        @keyframes mr-drift {
          from { transform: translate(0,0) scale(1); }
          to   { transform: translate(-50px,40px) scale(1.15); }
        }
        #member-room-type .mr-card { animation: mr-card-float 5s ease-in-out infinite; }
        #member-room-type .mr-drift { animation: mr-drift 18s ease-in-out infinite alternate; }
        #member-room-type .mr-grain {
          background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='.5'/></svg>");
        }
        @media (prefers-reduced-motion: reduce) {
          #member-room-type .mr-card, #member-room-type .mr-drift { animation: none !important; }
        }
      `}</style>

      {/* Atmosphere (same as About) */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div ref={glowARef} className="absolute -right-48 -top-40 h-[40rem] w-[40rem]">
          <div className="mr-drift h-full w-full rounded-full bg-[radial-gradient(closest-side,#ff5938_0%,rgba(217,54,27,0.5)_40%,transparent_72%)] opacity-55 blur-3xl" />
        </div>
        <div ref={glowBRef} className="absolute -left-52 bottom-0 h-[34rem] w-[34rem]">
          <div className="mr-drift h-full w-full rounded-full bg-[radial-gradient(closest-side,#d9361b_0%,transparent_70%)] opacity-25 blur-3xl" />
        </div>
        <div className="mr-grain absolute inset-0 opacity-[0.07] mix-blend-overlay" />
      </div>

      <div className="mx-auto max-w-[96rem] px-5 sm:px-10 lg:px-16">
        {/* ----------------------------- Header: left-aligned ----------------------------- */}
        <header className="grid items-end gap-6 lg:grid-cols-[1.4fr_0.6fr] lg:gap-16">
          <div>
            <h2
              aria-label="Find your fit"
              className="select-none overflow-hidden pb-[0.1em] font-nunito font-normal leading-[0.92] tracking-[-0.06em]"
              style={{ fontSize: 'clamp(3.5rem, 11vw, 10rem)' }}
            >
              <span
                data-rise
                aria-hidden="true"
                className="inline-block text-transparent"
                style={{ backgroundImage: GRADIENT, WebkitBackgroundClip: 'text', backgroundClip: 'text' }}
              >
                Find your fit
              </span>
            </h2>
            <p data-fade className="mt-4 font-sans text-xl font-light tracking-[-0.02em] text-[#ff5938] sm:text-3xl">
              Room for the way you like to travel.
            </p>
          </div>
          <p data-fade className="max-w-sm pb-2 text-sm leading-7 text-[#f6efe9]/60 sm:text-base">
            Choose a room type to explore the stay, guest capacity, and membership card that suits your next holiday.
          </p>
        </header>

        {/* ----------------------------- Accordion rows ----------------------------- */}
        <div data-rows className="mt-14 border-b border-[#f6efe9]/15 sm:mt-20">
          {ROOM_IDS.map((id) => {
            const room = ROOM_TYPES[id]
            const open = id === active
            const stats = [
              { label: room.rooms === 1 ? 'Room' : 'Rooms', Icon: BedDouble, value: room.rooms },
              { label: 'Adults', Icon: Users, value: room.adults },
              { label: 'Kids under 6', Icon: Baby, value: room.kids },
            ]
            return (
              <div key={id} data-row className="border-t border-[#f6efe9]/15">
                <h3>
                  <button
                    id={`room-tab-${id}`}
                    type="button"
                    aria-expanded={open}
                    aria-controls={`room-panel-${id}`}
                    onClick={() => setActive(id)}
                    onKeyDown={(e) => handleKeyDown(e, id)}
                    className="group flex w-full items-center gap-5 py-6 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ff5938] sm:gap-10 sm:py-9"
                  >
                    <span
                      aria-hidden="true"
                      className="select-none pb-[0.08em] font-sans font-normal leading-[0.9] tracking-[-0.07em] text-transparent transition-all duration-500"
                      style={{
                        fontSize: 'clamp(4rem, 11vw, 10rem)',
                        backgroundImage: open ? GRADIENT : MUTED_FILL,
                        WebkitBackgroundClip: 'text',
                        backgroundClip: 'text',
                      }}
                    >
                      {room.id}
                    </span>
                    <span className="flex-1">
                      <span
                        className={`block font-sans text-xl font-light tracking-[-0.03em] transition-colors duration-300 sm:text-4xl ${
                          open ? 'text-[#f6efe9]' : 'text-[#f6efe9]/55 group-hover:text-[#f6efe9]'
                        }`}
                      >
                        {room.name}
                      </span>
                      <span className="mt-1 block text-xs text-[#f6efe9]/50 sm:text-sm">{room.occupancy}</span>
                    </span>
                    <span
                      aria-hidden="true"
                      className={`grid h-11 w-11 flex-none place-items-center rounded-full border transition-all duration-500 sm:h-14 sm:w-14 ${
                        open
                          ? 'rotate-45 border-[#ff5938] bg-[#ff5938] text-[#0b0706]'
                          : 'border-[#f6efe9]/25 text-[#f6efe9] group-hover:border-[#ff5938] group-hover:text-[#ff5938]'
                      }`}
                    >
                      <Plus className="h-5 w-5" />
                    </span>
                  </button>
                </h3>

                <AnimatePresence initial={false}>
                  {open && (
                    <motion.div
                      id={`room-panel-${id}`}
                      role="region"
                      aria-labelledby={`room-tab-${id}`}
                      initial={reduced ? false : { height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={reduced ? { opacity: 0 } : { height: 0, opacity: 0 }}
                      transition={{ duration: reduced ? 0 : 0.6, ease: EASE_OUT }}
                      className="overflow-hidden"
                    >
                      <div className="grid gap-10 pb-12 pt-2 sm:pb-16 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
                        {/* Image with card overlapping its corner */}
                        <div className="relative">
                          <div className="relative aspect-[16/10] overflow-hidden rounded-[1.75rem] border border-[#f6efe9]/10 bg-[#140c0a]">
                            <img
                              src={roomLayoutBackground}
                              alt=""
                              aria-hidden="true"
                              className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-20"
                            />
                            <img
                              src={room.layoutImage}
                              alt={`${room.name} room`}
                              loading="lazy"
                              decoding="async"
                              className="absolute inset-0 h-full w-full object-cover"
                            />
                            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_100%,rgba(255,89,56,0.35),transparent_60%)]" />
                          </div>
                          <div className="absolute -bottom-6 right-4 sm:-bottom-8 sm:right-8">
                            <MembershipCard
                              id={active}
                              src={room.cardImage}
                              alt={`CHIS ${room.cardName} membership card`}
                              reduced={reduced}
                            />
                          </div>
                        </div>

                        {/* Details */}
                        <div className="flex flex-col">
                          <p className="max-w-md text-sm leading-7 text-[#f6efe9]/65 sm:text-base">{room.description}</p>

                          <dl className="mt-8 border-t border-[#f6efe9]/15">
                            {stats.map(({ label, Icon, value }) => (
                              <div
                                key={label}
                                className="flex items-center justify-between border-b border-[#f6efe9]/15 py-4 sm:py-5"
                              >
                                <dt className="flex items-center gap-3 text-sm text-[#f6efe9]/65 sm:text-base">
                                  <Icon className="h-4 w-4 text-[#ff5938]" aria-hidden="true" />
                                  {label}
                                </dt>
                                <dd className="font-sans text-4xl font-light leading-none tracking-[-0.05em] sm:text-5xl">
                                  <Counter value={value} reduced={reduced} />
                                </dd>
                              </div>
                            ))}
                          </dl>

                          <p className="mt-5 text-xs text-[#f6efe9]/55 sm:text-sm">
                            {room.id} · {room.cardName} membership card
                          </p>

                          <div className="mt-8 flex flex-wrap items-center gap-4">
                            <button
                              type="button"
                              onClick={() => handleEnquiry(room)}
                              className="group inline-flex items-center gap-3 rounded-full bg-[#ff5938] py-1.5 pl-6 pr-1.5 text-sm font-medium text-[#0b0706] transition-colors duration-300 hover:bg-[#ff765d] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#f6efe9] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0706]"
                            >
                              Enquire about {room.id}
                              <span className="grid h-10 w-10 place-items-center rounded-full bg-[#0b0706] text-[#ff5938] transition-transform duration-500 group-hover:rotate-45">
                                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                              </span>
                            </button>
                            <button
                              type="button"
                              onClick={() => scrollToId(PRICING_ID)}
                              className="group inline-flex items-center gap-2 rounded-full border border-[#f6efe9]/25 px-6 py-3 text-sm text-[#f6efe9] transition-colors duration-300 hover:border-[#ff5938] hover:text-[#ff5938] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ff5938]"
                            >
                              View pricing
                              <ArrowDown className="h-4 w-4 transition-transform group-hover:translate-y-0.5" aria-hidden="true" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}