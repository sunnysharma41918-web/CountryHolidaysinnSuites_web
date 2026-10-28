import { motion, useReducedMotion } from 'framer-motion'
import { ArrowUpRight, Star } from 'lucide-react'

/* ------------------------------------------------------------------ */
/*  Tokens                                                             */
/* ------------------------------------------------------------------ */
const EASE = [0.16, 1, 0.3, 1]
const LIME = '#c5f82a'
const INK = '#0b1a06'

const display = { fontFamily: "'Montserrat', sans-serif" }
const script = { fontFamily: "'Caveat', cursive" }

const photo = (id, w) =>
    `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`

/* Shown while the video loads (and if it fails) */
const POSTER = photo('photo-1464822759023-fed622ff2c3b', 1600)

const AVATARS = [
    'photo-1534528741775-53994a69daeb',
    'photo-1507003211169-0a1dd7228f2d',
    'photo-1500648767791-00dcc994a43e',
].map((id) => photo(id, 120))

/* Reusable glass surface */
const glass =
    'border border-white/25 bg-white/10 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,0.35)]'

/* Put your video at /public/hero.mp4 (or pass `videoSrc`) */
export default function GlassHero({ ready = true, videoSrc = '/hero.mp4' }) {
    const reduce = useReducedMotion()

    const rise = (delay) => ({
        initial: { opacity: 0, y: reduce ? 0 : 24 },
        animate: ready ? { opacity: 1, y: 0 } : {},
        transition: { duration: 0.9, delay, ease: EASE },
    })

    return (
        <section id="landing-page" className="relative flex h-[100svh] w-full flex-col overflow-hidden bg-[#06101a] text-white">
            {/* ---------- single video background ---------- */}
            <div className="absolute inset-0" aria-hidden="true">
                <video
                    className="absolute inset-0 h-full w-full object-cover"
                    src={videoSrc}
                    poster={POSTER}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="auto"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-[#06101a]/55 via-transparent to-[#06101a]/85" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,transparent_40%,rgba(6,16,26,0.55)_100%)]" />
            </div>

            {/* ---------- centre headline ---------- */}
            <div className="relative z-10 flex min-h-0 flex-1 flex-col items-center justify-center px-4 pb-32 text-center lg:pb-24">
                <motion.div
                    initial={{ opacity: 0, y: -16, rotate: -10 }}
                    animate={ready ? { opacity: 1, y: 0, rotate: -6 } : {}}
                    transition={{ duration: 1, delay: 0.5, ease: EASE }}
                    className="relative z-10 -mb-[0.28em] text-[clamp(3rem,min(13vw,17svh),9rem)] leading-none"
                    style={{ ...script, color: LIME, textShadow: '0 4px 24px rgba(0,0,0,0.35)' }}
                >
                    Explore
                </motion.div>

                <h1
                    className="m-0 text-[clamp(2.75rem,min(14vw,20svh),11rem)] font-extrabold uppercase leading-[0.9] tracking-[-0.04em]"
                    style={display}
                    aria-label="The World"
                >
                    <span className="block overflow-hidden pb-[0.05em]" aria-hidden="true">
                        <motion.span
                            className="inline-block bg-gradient-to-b from-white via-white to-[#e4ffa0] bg-clip-text text-transparent"
                            initial={{ y: '110%' }}
                            animate={ready ? { y: 0 } : {}}
                            transition={{ duration: 1.1, delay: 0.3, ease: EASE }}
                        >
                            THE WORLD
                        </motion.span>
                    </span>
                </h1>

                <motion.div {...rise(1.1)} className="mt-7 flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() =>
                            window.dispatchEvent(new CustomEvent('open-booking-modal'))
                        }
                        className="rounded-full px-8 py-3.5 text-[14px] font-bold transition-transform hover:scale-[1.03] focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                        style={{ ...display, background: LIME, color: INK }}
                    >
                        Book Now
                    </button>
                    <button
                        type="button"
                        aria-label="Explore section"
                        onClick={() => {
                            const el = document.getElementById('about')
                            if (el) el.scrollIntoView({ behavior: 'smooth' })
                            else window.dispatchEvent(new CustomEvent('open-booking-modal'))
                        }}
                        className={`grid h-[50px] w-[50px] place-items-center rounded-full transition-transform hover:rotate-45 focus:outline-none focus-visible:ring-2 focus-visible:ring-white ${glass}`}
                    >
                        <ArrowUpRight className="h-5 w-5" />
                    </button>
                </motion.div>
            </div>

            {/* ---------- bottom row: spinner + stat card ---------- */}
            <div className="absolute inset-x-0 bottom-0 z-20 mx-auto flex w-full max-w-[1400px] items-end justify-between px-4 pb-5 sm:px-8 sm:pb-7 lg:px-12">
                <motion.a
                    {...rise(1.4)}
                    href="#landing-page"
                    onClick={(e) => {
                        e.preventDefault()
                        const el = document.getElementById('about')
                        if (el) el.scrollIntoView({ behavior: 'smooth' })
                        else window.dispatchEvent(new CustomEvent('open-booking-modal'))
                    }}
                    aria-label="Explore trips"
                    className={`relative grid h-[88px] w-[88px] place-items-center rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-white sm:h-24 sm:w-24 ${glass}`}
                >
                    <motion.svg
                        viewBox="0 0 100 100"
                        className="absolute inset-0 h-full w-full"
                        aria-hidden="true"
                        animate={reduce ? {} : { rotate: 360 }}
                        transition={{ duration: 14, ease: 'linear', repeat: Infinity }}
                    >
                        <defs>
                            <path id="spin-ring" d="M50,50 m-35,0 a35,35 0 1,1 70,0 a35,35 0 1,1 -70,0" />
                        </defs>
                        <text
                            fill="white"
                            fillOpacity="0.85"
                            fontSize="9.5"
                            fontWeight="600"
                            letterSpacing="1.6"
                            style={display}
                        >
                            <textPath href="#spin-ring">scroll to explore • scroll to explore •</textPath>
                        </text>
                    </motion.svg>
                    <span
                        className="grid h-9 w-9 place-items-center rounded-full"
                        style={{ background: LIME, color: INK }}
                    >
                        <ArrowUpRight className="h-4 w-4 rotate-[135deg]" />
                    </span>
                </motion.a>

                <motion.div {...rise(1.4)} className={`flex w-fit items-center gap-4 rounded-2xl p-3 pr-6 ${glass}`}>
                    <div className="flex -space-x-2.5">
                        {AVATARS.map((src, i) => (
                            <img
                                key={i}
                                src={src}
                                alt=""
                                className="h-8 w-8 rounded-full border-2 border-white/80 object-cover"
                            />
                        ))}
                    </div>
                    <div className="leading-none" style={display}>
                        <div className="text-[26px] font-extrabold tracking-[-0.03em]">
                            500K<span style={{ color: LIME }}>+</span>
                        </div>
                        <div className="mt-1 flex items-center gap-1 text-[11px] text-white/70">
                            <Star className="h-3 w-3 fill-current" style={{ color: LIME }} />
                            Customers
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}