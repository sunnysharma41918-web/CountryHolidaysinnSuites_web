import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight, Check, Bell, Percent, MessageCircle } from 'lucide-react'

const EASE = [0.16, 1, 0.3, 1]

const INTERESTS = [
  'Honeymoon',
  'Hotel stays',
  'Expeditions',
  'Spa retreats',
  'Events',
  'Custom trips',
]

const PERKS = [
  { icon: Bell, text: 'New destinations and stays, before anyone else' },
  { icon: Percent, text: 'Offers on packages and resort bookings' },
  { icon: MessageCircle, text: 'A real person to help plan your trip' },
]

const AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=160&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=160&q=80',
]

/* Letters rise out of a mask one after another */
function MaskedWord({ text, delay = 0 }) {
  return (
    <span className="inline-flex overflow-hidden pb-[0.08em] pr-[0.04em]" aria-hidden="true">
      {text.split('').map((ch, i) => (
        <motion.span
          key={i}
          className="inline-block"
          initial={{ y: '115%', rotate: 8 }}
          whileInView={{ y: 0, rotate: 0 }}
          viewport={{ once: true, margin: '-10%' }}
          transition={{ duration: 1, delay: delay + i * 0.06, ease: EASE }}
        >
          {ch}
        </motion.span>
      ))}
    </span>
  )
}

/* Circular text badge that keeps turning */
function SpinningBadge() {
  return (
    <div className="relative h-28 w-28 lg:h-32 lg:w-32">
      <svg
        viewBox="0 0 120 120"
        className="tm-spin h-full w-full"
        style={{ animation: 'tm-spin 14s linear infinite' }}
        aria-hidden="true"
      >
        <defs>
          <path id="tm-circle" d="M60,60 m-44,0 a44,44 0 1,1 88,0 a44,44 0 1,1 -88,0" />
        </defs>
        <text className="fill-slate-950 text-[11.5px] font-semibold tracking-[0.12em]">
          <textPath href="#tm-circle">Join the trip · Join the trip · Join the trip ·</textPath>
        </text>
      </svg>
      <span className="absolute inset-0 m-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-950 text-[#ff5938]">
        <ArrowUpRight className="h-5 w-5 stroke-[2.5]" />
      </span>
    </div>
  )
}

export default function JoinUsSection({ onJoin }) {
  const [form, setForm] = useState({ name: '', contact: '' })
  const [interests, setInterests] = useState([])
  const [done, setDone] = useState(false)

  const toggleInterest = (item) =>
    setInterests((prev) => (prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]))

  const handleSubmit = (e) => {
    e.preventDefault()
    onJoin && onJoin({ ...form, interests })
    setDone(true)
  }

  const reset = () => {
    setForm({ name: '', contact: '' })
    setInterests([])
    setDone(false)
  }

  const field =
    'w-full rounded-2xl border border-white/15 bg-white/[0.07] px-4 py-3 text-sm text-white placeholder:text-white/35 transition-colors duration-300 focus:border-[#ff5938] focus:outline-none focus:ring-2 focus:ring-[#ff5938]/30'

  return (
    <section
      id="join"
      className="relative min-h-[100svh] w-full overflow-hidden bg-[#ff5938] text-slate-950 lg:h-[100svh]"
    >
      <style>{`
        @keyframes tm-spin { to { transform: rotate(360deg); } }
        @keyframes tm-float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        @media (prefers-reduced-motion: reduce) { .tm-spin, .tm-float { animation: none !important; } }
      `}</style>

      {/* soft moving blobs */}
      <div
        className="tm-float pointer-events-none absolute -bottom-32 -left-20 h-96 w-96 rounded-full bg-white/30 blur-3xl"
        style={{ animation: 'tm-float 9s ease-in-out infinite' }}
      />
      <div
        className="tm-float pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-emerald-300/40 blur-3xl"
        style={{ animation: 'tm-float 11s ease-in-out infinite reverse' }}
      />

      <div className="relative mx-auto flex h-full max-w-[1440px] flex-col gap-6 px-4 py-8 sm:px-8 lg:gap-5 lg:px-12 lg:py-8">
        {/* Label row */}
        <div className="flex shrink-0 items-center justify-between border-t border-slate-950 pt-3 text-sm">
          <span className="flex items-center gap-2 font-medium">
            <span className="h-2 w-2 animate-pulse rounded-full bg-slate-950" />
            Join our community
          </span>
          <span className="hidden text-slate-950/60 sm:block">Free to join</span>
        </div>

        <div className="grid min-h-0 flex-1 grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-12">
          {/* Left: headline, perks, social proof */}
          <div className="relative flex h-full flex-col justify-between gap-8 lg:col-span-7">
            <div className="absolute right-0 top-0 hidden md:block">
              <SpinningBadge />
            </div>

            <div className="pt-2 lg:pt-6">
              <h2
                aria-label="Join us"
                className="flex flex-wrap items-baseline gap-x-[0.2em] text-[clamp(4.5rem,min(19vw,30vh),16rem)] font-semibold leading-[0.88] tracking-[-0.05em]"
                style={{ fontFamily: "'Outfit', sans-serif" }}
              >
                <MaskedWord text="Join" delay={0.1} />
                <MaskedWord text="us" delay={0.4} />
              </h2>

              <motion.p
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.7, ease: EASE }}
                className="mt-4 max-w-md text-base leading-relaxed text-slate-950/80 sm:text-lg"
              >
                Hear about new destinations, stays and trip offers first, and get help planning
                your next getaway.
              </motion.p>
            </div>

            <div className="flex flex-col gap-6">
              <ul className="grid gap-3 sm:grid-cols-3 sm:gap-5">
                {PERKS.map((perk, i) => {
                  const Icon = perk.icon
                  return (
                    <motion.li
                      key={perk.text}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.7, delay: 0.8 + i * 0.1, ease: EASE }}
                      className="flex items-start gap-3 border-t border-slate-950/25 pt-3 text-sm leading-snug"
                    >
                      <Icon className="mt-0.5 h-4 w-4 shrink-0" />
                      {perk.text}
                    </motion.li>
                  )
                })}
              </ul>

              <motion.div
                initial={{ opacity: 0, x: -24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 1.1, ease: EASE }}
                className="flex items-center gap-3"
              >
                <div className="flex -space-x-3">
                  {AVATARS.map((src, i) => (
                    <img
                      key={i}
                      src={src}
                      alt=""
                      className="h-10 w-10 rounded-full border-2 border-[#ff5938] object-cover transition-transform duration-300 hover:z-10 hover:-translate-y-1"
                    />
                  ))}
                </div>
                <p className="text-sm leading-tight">
                  <span className="font-semibold">12k+ travelers</span> already on board
                </p>
              </motion.div>
            </div>
          </div>

          {/* Right: sign-up card */}
          <motion.div
            initial={{ opacity: 0, y: 50, rotate: 2 }}
            whileInView={{ opacity: 1, y: 0, rotate: 0 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 1, delay: 0.3, ease: EASE }}
            className="lg:col-span-5"
          >
            <div className="rounded-[28px] bg-slate-950 p-6 text-white shadow-2xl shadow-black/25 sm:p-8">
              <AnimatePresence mode="wait" initial={false}>
                {!done ? (
                  <motion.form
                    key="form"
                    onSubmit={handleSubmit}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.4, ease: EASE }}
                    className="flex flex-col gap-4"
                  >
                    <div>
                      <h3
                        className="text-2xl font-semibold tracking-tight"
                        style={{ fontFamily: "'Outfit', sans-serif" }}
                      >
                        Get on the list
                      </h3>
                      <p className="mt-1 text-sm text-white/60">Takes less than a minute.</p>
                    </div>

                    <label className="block">
                      <span className="mb-1.5 block text-xs text-white/60">Your name</span>
                      <input
                        required
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="Aarav Sharma"
                        autoComplete="name"
                        className={field}
                      />
                    </label>

                    <label className="block">
                      <span className="mb-1.5 block text-xs text-white/60">Email or phone</span>
                      <input
                        required
                        value={form.contact}
                        onChange={(e) => setForm({ ...form, contact: e.target.value })}
                        placeholder="you@example.com"
                        autoComplete="email"
                        className={field}
                      />
                    </label>

                    <fieldset>
                      <legend className="mb-2 text-xs text-white/60">I’m interested in</legend>
                      <div className="flex flex-wrap gap-2">
                        {INTERESTS.map((item) => {
                          const on = interests.includes(item)
                          return (
                            <motion.button
                              key={item}
                              type="button"
                              whileTap={{ scale: 0.92 }}
                              onClick={() => toggleInterest(item)}
                              aria-pressed={on}
                              className={`flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff5938] ${on
                                  ? 'border-[#ff5938] bg-[#ff5938] text-slate-950'
                                  : 'border-white/20 text-white/80 hover:border-white/50'
                                }`}
                            >
                              <AnimatePresence initial={false}>
                                {on && (
                                  <motion.span
                                    initial={{ width: 0, opacity: 0 }}
                                    animate={{ width: 12, opacity: 1 }}
                                    exit={{ width: 0, opacity: 0 }}
                                    className="overflow-hidden"
                                  >
                                    <Check className="h-3 w-3 stroke-[3]" />
                                  </motion.span>
                                )}
                              </AnimatePresence>
                              {item}
                            </motion.button>
                          )
                        })}
                      </div>
                    </fieldset>

                    <button
                      type="submit"
                      className="group mt-2 flex items-center justify-between rounded-full bg-[#ff5938] py-1.5 pl-6 pr-1.5 text-sm font-bold text-slate-950 transition-transform duration-300 hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white active:scale-95"
                    >
                      Join us
                      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-950 text-[#ff5938] transition-transform duration-300 group-hover:rotate-45">
                        <ArrowUpRight className="h-5 w-5 stroke-[2.5]" />
                      </span>
                    </button>
                  </motion.form>
                ) : (
                  <motion.div
                    key="done"
                    initial={{ opacity: 0, scale: 0.94 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5, ease: EASE }}
                    className="flex flex-col items-start gap-4 py-6"
                    role="status"
                  >
                    <svg viewBox="0 0 64 64" className="h-16 w-16" fill="none" aria-hidden="true">
                      <motion.circle
                        cx="32"
                        cy="32"
                        r="29"
                        stroke="#ff5938"
                        strokeWidth="3"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.8, ease: 'easeInOut' }}
                      />
                      <motion.path
                        d="M19 33 l9 9 l17 -19"
                        stroke="#ff5938"
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.5, delay: 0.7, ease: 'easeOut' }}
                      />
                    </svg>
                    <h3
                      className="text-3xl font-semibold tracking-tight"
                      style={{ fontFamily: "'Outfit', sans-serif" }}
                    >
                      Welcome aboard{form.name ? `, ${form.name.split(' ')[0]}` : ''}.
                    </h3>
                    <p className="text-sm leading-relaxed text-white/70">
                      We’ll reach out at <span className="text-white">{form.contact}</span> with
                      new trips and offers.
                    </p>
                    <button
                      type="button"
                      onClick={reset}
                      className="text-sm font-semibold text-[#ff5938] underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff5938]"
                    >
                      Add someone else
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
