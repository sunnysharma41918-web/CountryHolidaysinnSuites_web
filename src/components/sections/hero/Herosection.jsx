import { useState, useEffect } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { ArrowUpRight, ArrowDown, Play, X } from 'lucide-react'

/* ------------------------------------------------------------------ */
/*  IMAGES — local photos from public/images/                          */
/*    public/images/01.jpg                                             */
/*    public/images/02.jpg                                             */
/*    public/images/03.jpg                                             */
/* ------------------------------------------------------------------ */
const HERO_DIR = `${import.meta.env.BASE_URL}images`.replace(/\/+$/, '')
const VIDEO_SRC = '/car-travel.mp4'

const SLIDES = [
    {
        id: '01',
        src: `${HERO_DIR}/01.jpg`,
        tag: 'Explore the unseen',
        title: ['Worlds', 'Beyond', 'Boundaries'],
        desc: 'Breathtaking destinations, serene landscapes and unforgettable stays for modern explorers.',
    },
    {
        id: '02',
        src: `${HERO_DIR}/02.jpg`,
        tag: 'Into the wilderness',
        title: ['Elysian', 'Hidden', 'Sanctuaries'],
        desc: 'Ancient forests, emerald waterways and quiet trails, untouched by modern noise.',
    },
    {
        id: '03',
        src: `${HERO_DIR}/03.jpg`,
        tag: 'Awaken your senses',
        title: ['Above', 'Celestial', 'Heights'],
        desc: 'Highland retreats, crisp mountain air and panoramic views that reach the horizon.',
    },
]

const STATS = [
    { value: '250+', label: 'Destinations' },
    { value: '50K+', label: 'Happy travelers' },
    { value: '4.9', label: 'Guest rating' },
]

const SLIDE_MS = 8000
const EASE = [0.16, 1, 0.3, 1]
const GREEN = '#6aa22f'

/* Fonts */
const FONT_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Josefin+Sans:ital,wght@0,100..700;1,100..700&family=Nova+Flat&family=Teachers:wght@400..800&family=Anton&family=Outfit:wght@300;400;500;600&display=swap');
`
const display = { fontFamily: "'Anton', 'Impact', sans-serif" }
const body = { fontFamily: "'Teachers', 'Outfit', sans-serif" }

/* Same horizontal container as Navbar.jsx so logo, content and thumbs line up */
const CONTAINER = 'mx-auto w-full max-w-[1500px] px-5 sm:px-8 lg:px-12'

export default function HeroSection() {
    const reduce = useReducedMotion()
    const [activeIdx, setActiveIdx] = useState(0)
    const [showVideo, setShowVideo] = useState(false)
    const current = SLIDES[activeIdx]

    /* autoplay (paused while the showreel is open) */
    useEffect(() => {
        if (showVideo) return undefined
        const t = setTimeout(() => setActiveIdx((i) => (i + 1) % SLIDES.length), SLIDE_MS)
        return () => clearTimeout(t)
    }, [activeIdx, showVideo])

    /* Esc closes the showreel */
    useEffect(() => {
        if (!showVideo) return undefined
        const onKey = (e) => e.key === 'Escape' && setShowVideo(false)
        window.addEventListener('keydown', onKey)
        return () => window.removeEventListener('keydown', onKey)
    }, [showVideo])

    const scrollToDestinations = () => {
        const el = document.getElementById('destinations') || document.getElementById('places')
        if (el) el.scrollIntoView({ behavior: 'smooth' })
    }

    const openBooking = () => {
        window.dispatchEvent(new CustomEvent('open-booking-modal', { detail: { destination: current.title.join(' ') } }))
    }

    return (
        <section
            aria-label="Hero carousel"
            className="relative flex h-screen h-[100dvh] max-h-[100dvh] w-full flex-col justify-between overflow-hidden bg-[#0c0f06] text-[#f3f1e4] pt-[clamp(4.25rem,9dvh,5.75rem)] pb-[clamp(0.75rem,2.4dvh,1.5rem)] [transform:translateZ(0)]"
            style={body}
        >
            <style>{FONT_CSS}</style>

            {/* ================= BACKGROUND ================= */}
            <div className="absolute inset-0 z-0 select-none overflow-hidden [transform:translateZ(0)] will-change-transform">
                <AnimatePresence initial={false}>
                    <motion.div
                        key={current.id}
                        className="absolute inset-0"
                        initial={{ opacity: 0, scale: 1.08 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1.4, ease: EASE }}
                    >
                        <img
                            src={current.src}
                            alt=""
                            className="h-full w-full object-cover"
                            style={{
                                filter: 'brightness(0.92) contrast(1.05) saturate(1.1)',
                            }}
                        />
                    </motion.div>
                </AnimatePresence>

                {/* cinematic gradient: gentle contrast on left & bottom, completely clean image view */}
                <div
                    className="absolute inset-0"
                    style={{
                        background:
                            'radial-gradient(circle at 18% 45%, rgba(12,15,6,0.52) 0%, rgba(12,15,6,0.2) 55%, transparent 80%), linear-gradient(180deg, rgba(12,15,6,0.3) 0%, transparent 22%, transparent 75%, rgba(12,15,6,0.65) 100%)',
                    }}
                />
            </div>

            {/* ================= MAIN ROW ================= */}
            <div className={`${CONTAINER} relative z-10 grid min-h-0 flex-1 grid-cols-1 items-center gap-4 lg:gap-8 lg:grid-cols-[1fr_auto]`}>
                {/* ---------- left: copy ---------- */}
                <div className="flex max-w-[44rem] flex-col items-start justify-center">
                    <AnimatePresence mode="wait">
                        <motion.h1
                            key={`h-${current.id}`}
                            className="m-0 uppercase leading-[0.88] tracking-[-0.01em] text-[#f3f1e4] text-[length:clamp(2.3rem,min(12vw,calc((100dvh_-_350px)/2.8)),7.5rem)] sm:text-[length:clamp(2.5rem,min(8vw,calc((100dvh_-_330px)/2.8)),7.8rem)]"
                            style={{ ...display, textShadow: '0 10px 50px rgba(20,24,8,0.4)' }}
                            initial="hidden"
                            animate="show"
                            exit="out"
                            variants={{
                                hidden: {},
                                show: { transition: { staggerChildren: 0.09 } },
                                out: { transition: { staggerChildren: 0.04 } },
                            }}
                        >
                            {current.title.map((word, i) => (
                                <span
                                    key={word}
                                    className={`block overflow-hidden pb-[0.04em] ${i === 1 ? 'pl-[1.1em]' : ''}`}
                                >
                                    <motion.span
                                        className="block"
                                        variants={{
                                            hidden: { y: reduce ? 0 : '110%' },
                                            show: { y: 0, transition: { duration: 1.1, ease: EASE } },
                                            out: { y: reduce ? 0 : '-110%', transition: { duration: 0.5, ease: EASE } },
                                        }}
                                    >
                                        {word}
                                    </motion.span>
                                </span>
                            ))}
                        </motion.h1>
                    </AnimatePresence>

                    <AnimatePresence mode="wait">
                        <motion.p
                            key={`d-${current.id}`}
                            initial={reduce ? false : { opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.6, delay: 0.25, ease: EASE }}
                            className="mt-2.5 max-w-[26rem] font-teachers text-[13px] sm:text-[14px] lg:text-[15px] font-normal leading-relaxed text-[#f3f1e4]/85 sm:mt-3.5 [@media(max-height:580px)]:hidden"
                        >
                            {current.desc}
                        </motion.p>
                    </AnimatePresence>

                    <div className="mt-3.5 flex flex-wrap items-center gap-x-4 gap-y-2.5 sm:mt-4.5">
                        <button
                            type="button"
                            onClick={openBooking}
                            className="group inline-flex items-center gap-3 rounded-full bg-[#f3f1e4] py-1.5 pl-6 pr-1.5 text-[13px] sm:text-[14px] font-semibold text-[#1c2110] shadow-[0_10px_30px_rgba(10,14,4,0.35)] transition-transform duration-300 hover:scale-[1.03] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6aa22f] active:scale-95"
                        >
                            <span className="font-teachers font-bold">Explore now</span>
                            <span
                                className="grid h-8 w-8 sm:h-9 sm:w-9 place-items-center rounded-full text-white transition-transform duration-300 group-hover:rotate-45"
                                style={{ background: GREEN }}
                            >
                                <ArrowUpRight className="h-4 w-4" />
                            </span>
                        </button>

                        <button
                            type="button"
                            onClick={() => setShowVideo(true)}
                            className="group inline-flex items-center gap-3 rounded-full py-1 pr-2 text-[13px] sm:text-[14px] font-medium text-[#f3f1e4] transition-colors hover:text-[#b9e26a] focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
                        >
                            <span className="grid h-9 w-9 sm:h-11 sm:w-11 place-items-center rounded-full border border-white/30 bg-white/10 backdrop-blur-md transition-all duration-300 group-hover:scale-105 group-hover:border-[#b9e26a]">
                                <Play className="ml-0.5 h-3.5 w-3.5 fill-current" />
                            </span>
                            <span className="font-teachers font-semibold">Watch showreel</span>
                        </button>
                    </div>
                </div>

                {/* ---------- right: thumbnails ---------- */}
                <div className="hidden items-center gap-3 justify-self-end lg:flex">
                    <div className="flex flex-col gap-2.5">
                        {SLIDES.map((slide, i) => {
                            const isActive = i === activeIdx
                            return (
                                <button
                                    key={slide.id}
                                    type="button"
                                    onClick={() => setActiveIdx(i)}
                                    aria-label={`Show slide ${slide.id}: ${slide.title.join(' ')}`}
                                    aria-current={isActive}
                                    className={`group relative aspect-[4/5] h-[clamp(54px,11dvh,92px)] overflow-hidden rounded-2xl border-2 transition-all duration-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-white ${isActive
                                            ? 'scale-105 border-[#b9e26a] shadow-[0_0_24px_rgba(185,226,106,0.35)]'
                                            : 'border-white/25 opacity-70 hover:border-white/60 hover:opacity-100'
                                        }`}
                                >
                                    <img
                                        src={slide.src}
                                        alt=""
                                        loading="lazy"
                                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                    <span className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />
                                    <span className="absolute bottom-1.5 left-2 font-nova text-[11px] font-semibold text-white/90">
                                        {slide.id}
                                    </span>
                                </button>
                            )
                        })}
                    </div>

                    {/* vertical progress track */}
                    <div className="relative w-[3px] self-stretch overflow-hidden rounded-full bg-white/20" aria-hidden="true">
                        <motion.div
                            className="w-full rounded-full"
                            style={{ height: `${100 / SLIDES.length}%`, background: '#b9e26a' }}
                            animate={{ y: `${activeIdx * 100}%` }}
                            transition={{ duration: 0.6, ease: EASE }}
                        />
                    </div>
                </div>
            </div>

            {/* ================= BOTTOM ROW ================= */}
            <div className={`${CONTAINER} relative z-10 flex flex-wrap sm:flex-nowrap items-end justify-between gap-3 sm:gap-6 pt-2 pb-2 sm:pb-3`}>
                {/* stats */}
                <dl className="m-0 flex items-stretch gap-2.5 min-[380px]:gap-4 sm:gap-8">
                    {STATS.map((s, i) => (
                        <div
                            key={s.label}
                            className={`flex flex-col gap-0.5 sm:gap-1 ${i ? 'border-l border-white/20 pl-2.5 min-[380px]:pl-4 sm:pl-8' : ''}`}
                        >
                            <dd className="m-0 text-[clamp(1.1rem,2vw,1.85rem)] leading-none" style={display}>
                                {s.value}
                            </dd>
                            <dt className="font-teachers text-[9px] min-[380px]:text-[10px] sm:text-[12px] font-light text-white/65">{s.label}</dt>
                        </div>
                    ))}
                </dl>

                {/* pagination + scroll */}
                <div className="flex items-center gap-2.5 sm:gap-6 ml-auto sm:ml-0">
                    <div className="flex items-center gap-1.5 min-[380px]:gap-2.5 sm:gap-3.5">
                        {SLIDES.map((slide, i) => {
                            const isActive = i === activeIdx
                            return (
                                <button
                                    key={slide.id}
                                    type="button"
                                    onClick={() => setActiveIdx(i)}
                                    aria-label={`Go to slide ${slide.id}`}
                                    className="group flex flex-col items-start gap-1 py-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                                >
                                    <span
                                        className={`font-nova text-[10px] sm:text-[12px] font-medium transition-colors ${isActive ? 'text-[#f3f1e4]' : 'text-white/40 group-hover:text-white/80'
                                            }`}
                                    >
                                        {slide.id}
                                    </span>
                                    <span
                                        className={`relative h-[2px] overflow-hidden rounded-full bg-white/25 transition-all duration-500 ${isActive ? 'w-8 min-[380px]:w-10 sm:w-14' : 'w-4 min-[380px]:w-5 sm:w-7'
                                            }`}
                                    >
                                        {isActive && (
                                            <motion.span
                                                key={activeIdx}
                                                className="absolute inset-y-0 left-0 w-full origin-left bg-[#b9e26a]"
                                                initial={{ scaleX: 0 }}
                                                animate={{ scaleX: showVideo ? 0 : 1 }}
                                                transition={{ duration: SLIDE_MS / 1000, ease: 'linear' }}
                                            />
                                        )}
                                    </span>
                                </button>
                            )
                        })}
                    </div>

                    <button
                        type="button"
                        onClick={scrollToDestinations}
                        aria-label="Scroll down to explore"
                        className="hidden h-10 w-10 sm:h-11 sm:w-11 place-items-center rounded-full border border-white/30 bg-white/10 text-white backdrop-blur-md transition-all hover:scale-110 hover:border-transparent hover:bg-[#6aa22f] focus:outline-none focus-visible:ring-2 focus-visible:ring-white sm:grid"
                    >
                        <ArrowDown className="h-4 w-4" />
                    </button>
                </div>
            </div>

            {/* ================= SHOWREEL MODAL ================= */}
            <AnimatePresence>
                {showVideo && (
                    <motion.div
                        role="dialog"
                        aria-modal="true"
                        aria-label="Showreel"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setShowVideo(false)}
                        className="fixed inset-0 z-[60] flex items-center justify-center bg-[#0c0f06]/90 p-4 backdrop-blur-2xl sm:p-8"
                    >
                        <div
                            onClick={(e) => e.stopPropagation()}
                            className="relative w-full max-w-4xl overflow-hidden rounded-3xl border border-white/20 bg-black shadow-2xl"
                        >
                            <button
                                type="button"
                                onClick={() => setShowVideo(false)}
                                aria-label="Close showreel"
                                className="absolute right-4 top-4 z-10 grid h-10 w-10 place-items-center rounded-full bg-white/20 text-white backdrop-blur-md transition hover:bg-white hover:text-black"
                            >
                                <X className="h-5 w-5" />
                            </button>
                            <video src={VIDEO_SRC} controls autoPlay className="aspect-video w-full object-cover" />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    )
}
