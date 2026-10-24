import { useCallback, useEffect, useRef, useState } from 'react'
import {
    AnimatePresence,
    motion,
    animate,
    useMotionValue,
    useReducedMotion,
    useScroll,
    useSpring,
    useTransform,
} from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'

/* ------------------------------------------------------------------ */
/*  Tokens                                                             */
/* ------------------------------------------------------------------ */
const EASE = [0.16, 1, 0.3, 1]
const LIME = '#c5f82a'
const SLIDE_SECS = 6.5 // time each destination stays on screen

const display = { fontFamily: "'Bebas Neue', Impact, sans-serif" }
const heading = { fontFamily: "'Outfit', system-ui, sans-serif" }
const script = { fontFamily: "'Caveat', cursive" }

const photo = (id, w) =>
    `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`

/* Swap `img` for your own photos (or local files) – everything else follows */
const SLIDES = [
    {
        name: 'Manali',
        region: 'Himachal Pradesh',
        tag: 'mountains',
        days: '5 Nights 6 Days',
        img: 'photo-1464822759023-fed622ff2c3b',
    },
    {
        name: 'Rishikesh',
        region: 'Uttarakhand',
        tag: 'rivers',
        days: '4 Nights 5 Days',
        img: 'photo-1500530855697-b586d89ba3ee',
    },
    {
        name: 'Bali',
        region: 'Indonesia',
        tag: 'islands',
        days: '6 Nights 7 Days',
        img: 'photo-1507525428034-b723cf961d3e',
    },
    {
        name: 'Ladakh',
        region: 'Jammu & Kashmir',
        tag: 'highlands',
        days: '7 Nights 8 Days',
        img: 'photo-1506905925346-21bda4d32df4',
    },
]

const TRUST_AVATARS = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=160&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=160&q=80',
]

/* ------------------------------------------------------------------ */
/*  Motion text: headline + copy                                       */
/* ------------------------------------------------------------------ */
function MaskedLine({ text, delay = 0, ready, className = '' }) {
    return (
        <span className={`flex justify-start overflow-hidden pb-[0.06em] pr-[0.04em] ${className}`} aria-hidden="true">
            {text.split('').map((ch, i) => (
                <motion.span
                    key={i}
                    className="inline-block whitespace-pre transition-colors duration-300 hover:text-[#9fd4ff]"
                    initial={{ y: '118%', rotate: 7 }}
                    animate={ready ? { y: 0, rotate: 0 } : { y: '118%', rotate: 7 }}
                    transition={{ duration: 1.1, delay: delay + i * 0.05, ease: EASE }}
                >
                    <span
                        className="inline-block animate-[hero-wave_4.2s_ease-in-out_infinite] motion-reduce:animate-none"
                        style={{ animationDelay: `${2.4 + i * 0.14}s` }}
                    >
                        {ch}
                    </span>
                </motion.span>
            ))}
        </span>
    )
}

function BlurWords({ text, delay = 0, ready, className = '' }) {
    const from = { opacity: 0, y: 10, filter: 'blur(8px)' }
    const to = { opacity: 1, y: 0, filter: 'blur(0px)' }
    return (
        <p className={className} aria-label={text}>
            {text.split(' ').map((w, i) => (
                <motion.span
                    key={i}
                    aria-hidden="true"
                    className="mr-[0.28em] inline-block"
                    initial={from}
                    animate={ready ? to : from}
                    transition={{ duration: 0.8, delay: delay + i * 0.045, ease: EASE }}
                >
                    {w}
                </motion.span>
            ))}
        </p>
    )
}

/* ------------------------------------------------------------------ */
/*  Hero                                                               */
/*  <HeroSection ready={!loading} />  – `ready` starts the intro so    */
/*  it plays after the preloader lifts. Defaults to true.              */
/* ------------------------------------------------------------------ */
export default function HeroSection({ ready = true }) {
    const containerRef = useRef(null)
    const reduceMotion = useReducedMotion()

    /* ---------- destination slider ---------- */
    const [{ active, prev }, setSlide] = useState({ active: 0, prev: 0 })
    const goTo = useCallback(
        (i) => setSlide((s) => (i === s.active ? s : { active: i, prev: s.active })),
        [],
    )

    const current = SLIDES[active]

    /* ---------- mouse parallax ---------- */
    const mouseX = useMotionValue(0)
    const mouseY = useMotionValue(0)
    const springX = useSpring(mouseX, { stiffness: 40, damping: 20 })
    const springY = useSpring(mouseY, { stiffness: 40, damping: 20 })
    const bgX = useTransform(springX, [-0.5, 0.5], [14, -14])
    const bgY = useTransform(springY, [-0.5, 0.5], [8, -8])
    const textX = useTransform(springX, [-0.5, 0.5], [-10, 10])
    const textY = useTransform(springY, [-0.5, 0.5], [-6, 6])

    const handleMouseMove = (e) => {
        if (reduceMotion || !containerRef.current) return
        const rect = containerRef.current.getBoundingClientRect()
        mouseX.set((e.clientX - rect.left) / rect.width - 0.5)
        mouseY.set((e.clientY - rect.top) / rect.height - 0.5)
    }
    const handleMouseLeave = () => {
        mouseX.set(0)
        mouseY.set(0)
    }

    /* ---------- scroll-linked exit ---------- */
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start start', 'end start'],
    })
    const sceneScale = useTransform(scrollYProgress, [0, 1], [1, 1.12])
    const headY = useTransform(scrollYProgress, [0, 1], [0, -140])
    const headFade = useTransform(scrollYProgress, [0, 0.65], [1, 0])

    /* ---------- stat count-up ---------- */
    const [travellersCount, setTravellersCount] = useState(reduceMotion ? 500 : 0)
    useEffect(() => {
        if (reduceMotion) {
            setTravellersCount(500)
            return
        }
        if (!ready) return
        const controls = animate(0, 500, {
            duration: 2.4,
            delay: 1.6,
            ease: EASE,
            onUpdate: (v) => setTravellersCount(Math.round(v)),
        })
        return () => controls.stop()
    }, [reduceMotion, ready])

    /* ---------- actions ---------- */
    const handleBookNow = () => {
        window.dispatchEvent(
            new CustomEvent('open-booking-modal', {
                detail: {
                    destination: `${current.name} Expedition`,
                    persons: '2 Persons',
                    days: current.days,
                },
            }),
        )
    }

    const rv = (from, to) => ({ initial: from, animate: ready ? to : from })
    const fadeUp = (delay) => ({
        ...rv({ opacity: 0, y: 28 }, { opacity: 1, y: 0 }),
        transition: { duration: 0.9, delay, ease: EASE },
    })

    const openClip = 'inset(0% 0% 0% 0% round 0px)'
    const closedClip = 'inset(14% 20% 14% 20% round 48px)'

    return (
        <section
            ref={containerRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="relative flex min-h-[100svh] w-full flex-col overflow-hidden bg-[#01040b] text-white lg:h-[100svh]"
        >
            {/* =============================== BACKDROP =============================== */}
            <motion.div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 overflow-hidden"
                initial={{ clipPath: reduceMotion ? openClip : closedClip }}
                animate={{ clipPath: ready || reduceMotion ? openClip : closedClip }}
                transition={{ duration: 1.9, ease: EASE }}
            >
                <motion.div
                    className="absolute -inset-6"
                    style={{ scale: sceneScale, x: bgX, y: bgY, transformOrigin: '50% 100%' }}
                >
                    <img
                        src={photo(SLIDES[prev].img, 2000)}
                        alt=""
                        className="absolute inset-0 h-full w-full scale-[1.04] object-cover"
                    />
                    <motion.img
                        key={active}
                        src={photo(current.img, 2000)}
                        alt=""
                        className="absolute inset-0 h-full w-full scale-[1.04] object-cover"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, ease: 'easeInOut' }}
                    />
                </motion.div>

                {/* legibility + mood */}
                <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(1,4,11,0.78)_0%,rgba(1,4,11,0.25)_58%,rgba(1,4,11,0.5)_100%)]" />
                <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#01040b]/70 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 h-[62%] bg-gradient-to-t from-[#01040b] via-[#01040b]/60 to-transparent" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_45%,transparent_55%,rgba(1,4,8,0.55)_100%)]" />
                <svg className="absolute inset-0 h-full w-full opacity-[0.07] mix-blend-overlay" aria-hidden="true">
                    <filter id="hero-noise">
                        <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" stitchTiles="stitch" />
                    </filter>
                    <rect width="100%" height="100%" filter="url(#hero-noise)" />
                </svg>
            </motion.div>

            {/* =============================== CONTENT =============================== */}
            <div className="relative z-30 h-16 w-full shrink-0 sm:h-24" />

            <motion.div
                style={{ y: headY, opacity: headFade }}
                className="relative z-30 mx-auto grid min-h-0 w-full max-w-[1600px] flex-1 grid-cols-1 content-start gap-4 px-5 pb-3 pt-3 sm:gap-6 sm:px-8 sm:pt-6 lg:grid-cols-[1fr_auto] lg:content-stretch lg:items-end lg:gap-10 lg:pt-8"
            >
                {/* headline block */}
                <motion.div style={{ x: textX, y: textY }} className="flex flex-col items-start self-start">
                    {/* rotating script tagline */}
                    <motion.div
                        {...rv({ opacity: 0, y: -20, rotate: -8 }, { opacity: 1, y: 0, rotate: -3 })}
                        transition={{ duration: 1, delay: 1.1, ease: EASE }}
                        className="relative mb-[clamp(6px,1.6svh,16px)] inline-flex items-baseline gap-[0.3em] text-[clamp(1.8rem,min(5.5vw,6svh),4rem)] font-bold leading-none"
                        style={script}
                    >
                        <span className="text-white drop-shadow-[0_3px_14px_rgba(0,0,0,0.6)]">Explore the</span>
                        <span className="relative inline-block">
                            <span className="inline-flex overflow-hidden py-[0.12em]" style={{ color: LIME }}>
                                <AnimatePresence mode="wait" initial={false}>
                                    <motion.span
                                        key={active}
                                        className="inline-block"
                                        initial={{ y: '110%' }}
                                        animate={{ y: 0 }}
                                        exit={{ y: '-110%' }}
                                        transition={{ duration: 0.55, ease: EASE }}
                                    >
                                        {current.tag}
                                    </motion.span>
                                </AnimatePresence>
                            </span>
                            <svg
                                viewBox="0 0 300 24"
                                fill="none"
                                preserveAspectRatio="none"
                                aria-hidden="true"
                                className="absolute -bottom-2 left-0 h-3 w-full overflow-visible"
                            >
                                <motion.path
                                    d="M4 16 C 60 4, 120 22, 180 10 S 270 8, 296 14"
                                    stroke={LIME}
                                    strokeWidth="4"
                                    strokeLinecap="round"
                                    vectorEffect="non-scaling-stroke"
                                    initial={{ pathLength: 0 }}
                                    animate={{ pathLength: ready ? 1 : 0 }}
                                    transition={{ duration: 1, delay: 1.7, ease: 'easeInOut' }}
                                />
                            </svg>
                        </span>
                    </motion.div>

                    <h1
                        aria-label="Go Far. Feel More."
                        className="m-0 flex flex-col items-start text-[clamp(2.5rem,min(15vw,22svh),14rem)] uppercase leading-[0.88] tracking-[0.005em] drop-shadow-[0_10px_40px_rgba(0,0,0,0.45)]"
                        style={display}
                    >
                        <MaskedLine text="GO FAR." delay={0.25} ready={ready} className="text-white" />
                        <MaskedLine text="FEEL MORE." delay={0.5} ready={ready} className="text-[#c5f82a]" />
                    </h1>
                </motion.div>

                {/* destination rail: column on desktop, swipe row on mobile */}
                <motion.div
                    {...fadeUp(1.9)}
                    className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 [scrollbar-width:none] [-webkit-overflow-scrolling:touch] sm:-mx-8 sm:px-8 lg:mx-0 lg:w-[292px] lg:flex-col lg:overflow-visible lg:px-0 lg:pb-0 [&::-webkit-scrollbar]:hidden"
                    role="tablist"
                    aria-label="Featured destinations"
                >
                    {SLIDES.map((s, i) => {
                        const on = i === active
                        return (
                            <button
                                key={s.name}
                                type="button"
                                role="tab"
                                aria-selected={on}
                                onClick={() => goTo(i)}
                                className={`group relative flex min-w-[176px] shrink-0 items-center gap-3 overflow-hidden rounded-2xl border p-2 pr-4 text-left backdrop-blur-xl transition-colors duration-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c5f82a] lg:min-w-0 ${on
                                    ? 'border-[#c5f82a]/60 bg-[#04170d]/70'
                                    : 'border-white/15 bg-[#04170d]/40 hover:border-white/40'
                                    }`}
                            >
                                <img
                                    src={photo(s.img, 160)}
                                    alt=""
                                    loading="lazy"
                                    className="h-12 w-12 flex-none rounded-xl object-cover"
                                />
                                <span className="block min-w-0 flex-1 leading-tight" style={heading}>
                                    <span className="block truncate text-[15px] font-semibold text-white">{s.name}</span>
                                    <span className="block truncate text-[11.5px] text-white/60">{s.region}</span>
                                </span>
                                <span
                                    className={`grid h-7 w-7 flex-none place-items-center rounded-full transition-all duration-300 ${on ? 'rotate-0 bg-[#c5f82a] text-[#04170d]' : '-rotate-45 bg-white/10 text-white/70 group-hover:rotate-0'
                                        }`}
                                >
                                    <ArrowUpRight className="h-3.5 w-3.5 stroke-[2.5]" />
                                </span>
                            </button>
                        )
                    })}
                </motion.div>
            </motion.div>

            {/* bottom info: card on the left, stats on the right */}
            <div className="relative z-30 mx-auto flex w-full max-w-[1600px] shrink-0 flex-col gap-3 px-4 pb-4 sm:px-8 sm:pb-6 lg:flex-row lg:items-end lg:justify-between">
                <motion.div
                    {...fadeUp(1.8)}
                    className="w-full max-w-[540px] rounded-[24px] border border-white/20 bg-[#04170d]/55 p-3.5 backdrop-blur-xl sm:rounded-[28px] sm:p-5"
                >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-5">
                        <button
                            type="button"
                            onClick={handleBookNow}
                            className="group relative inline-flex flex-none items-center gap-4 self-start overflow-hidden rounded-full bg-[#c5f82a] py-1.5 pl-6 pr-1.5 text-[14px] font-semibold text-[#04170d] transition-colors hover:bg-[#d4ff4d] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c5f82a] focus-visible:ring-offset-2 focus-visible:ring-offset-[#04170d]"
                            style={heading}
                        >
                            <span
                                className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 -skew-x-[20deg] animate-[hero-sheen_3.8s_ease-in-out_infinite] bg-white/60 blur-[6px] motion-reduce:hidden"
                                aria-hidden="true"
                            />
                            <span className="relative py-2.5">Book now</span>
                            <span className="relative grid h-11 w-11 place-items-center rounded-full bg-[#04170d] text-[#c5f82a] transition-transform duration-500 group-hover:rotate-45">
                                <ArrowUpRight className="h-5 w-5 stroke-[2.5]" />
                            </span>
                        </button>
                        <BlurWords
                            delay={2.1}
                            ready={ready}
                            className="m-0 text-[12.5px] leading-relaxed text-white/85 sm:text-[13px] [@media(max-height:620px)]:hidden"
                            text="Hand-planned journeys to the world's most breathtaking places, with experts beside you every step."
                        />
                    </div>
                </motion.div>

                <motion.div
                    {...fadeUp(2.0)}
                    className="flex items-center justify-between gap-4 lg:items-end lg:justify-end lg:gap-6"
                >
                    <div className="flex items-center gap-3 rounded-full border border-white/20 bg-[#04170d]/55 p-2 pr-5 backdrop-blur-xl">
                        <div className="flex -space-x-3">
                            {TRUST_AVATARS.map((src, idx) => (
                                <img
                                    key={idx}
                                    src={src}
                                    alt=""
                                    className="h-9 w-9 rounded-full border-2 border-white object-cover shadow-lg transition-transform duration-300 hover:z-10 hover:-translate-y-1"
                                />
                            ))}
                        </div>
                        <div className="leading-none">
                            <div
                                className="flex items-baseline text-[clamp(26px,3.6svh,40px)] font-extrabold tracking-[-0.04em]"
                                style={heading}
                            >
                                <span className="tabular-nums">{travellersCount}</span>
                                <span style={{ color: LIME }}>K+</span>
                            </div>
                            <p className="m-0 mt-1 text-[11px] text-white/70" style={heading}>
                                happy travellers
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>

            <style>{`
        @keyframes hero-wave { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-0.03em); } }
        @keyframes hero-sheen { 0% { transform: translateX(0) skewX(-20deg); } 60%, 100% { transform: translateX(520%) skewX(-20deg); } }
      `}</style>
        </section>
    )
}