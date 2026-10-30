import { motion, useReducedMotion } from 'framer-motion'
import { Flag, BarChart3, Package, ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'

const EASE = [0.16, 1, 0.3, 1]

/* S-wave path in 1200 x 480 canvas matching the reference design */
const WAVE_D =
  'M 0 310 C 90 310, 150 340, 230 340 C 330 340, 430 180, 580 180 C 700 180, 780 320, 880 310 C 920 305, 950 250, 990 230 C 1040 210, 1120 220, 1200 220'

const STEPS = [
  {
    num: '1',
    title: 'Tell us what you love',
    desc: 'Share your dates, group size and the kind of thrill or calm you want.',
    icon: Flag,
    // Node position in percent of 1200 x 480
    nodeX: (230 / 1200) * 100, // 19.17%
    nodeY: (340 / 480) * 100, // 70.83%
    // Text placed ABOVE Node 1 (left aligned)
    textStyle: { left: '5%', top: '34%', width: '310px' },
  },
  {
    num: '2',
    title: 'We curate the details',
    desc: 'Verified guides, stays and transfers, planned and confirmed by our travel desk.',
    icon: BarChart3,
    nodeX: (580 / 1200) * 100, // 48.33%
    nodeY: (180 / 480) * 100, // 37.5%
    // Text placed BELOW Node 2 (centered)
    textStyle: { left: '48.33%', top: '62%', transform: 'translateX(-50%)', width: '320px' },
  },
  {
    num: '3',
    title: 'Show up and enjoy',
    desc: 'Everything is arranged, with real people on call 24/7 while you travel.',
    icon: Package,
    nodeX: (990 / 1200) * 100, // 82.5%
    nodeY: (230 / 480) * 100, // 47.92%
    // Text placed BELOW Node 3
    textStyle: { left: '79%', top: '62%', transform: 'translateX(-50%)', width: '310px' },
  },
]

/* Hexagon Node matching the reference image's luminous badge */
function HexagonNode({ icon: Icon, delay = 0, reduced }) {
  return (
    <motion.div
      initial={reduced ? false : { scale: 0, opacity: 0 }}
      whileInView={{ scale: 1, opacity: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20, delay }}
      className="relative shrink-0"
    >
      <motion.div
        animate={reduced ? undefined : { y: [0, -4, 0] }}
        transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut', delay: delay + 0.6 }}
        className="relative flex h-14 w-14 items-center justify-center sm:h-16 sm:w-16 drop-shadow-[0_12px_22px_rgba(9,108,39,0.22)]"
      >
        {/* Soft glow halo */}
        <span
          aria-hidden="true"
          className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#096c27]/25 to-[#b3d565]/40 blur-md"
        />

        {/* Crisp Hexagon SVG */}
        <svg viewBox="0 0 64 64" className="relative h-full w-full overflow-visible" aria-hidden="true">
          <polygon
            points="32,4 58,19 58,45 32,60 6,45 6,19"
            fill="#ffffff"
            stroke="#096c27"
            strokeWidth="2"
            strokeLinejoin="round"
          />
        </svg>

        {/* Icon inside */}
        <span className="absolute inset-0 flex items-center justify-center text-[#096c27]">
          <Icon className="h-6 w-6 stroke-[2.2]" aria-hidden="true" />
        </span>
      </motion.div>
    </motion.div>
  )
}

export default function ProcessWaveSection() {
  const reduced = !!useReducedMotion()

  return (
    <section
      id="how-it-works"
      className="relative isolate w-full overflow-hidden bg-white px-5 py-20 sm:px-8 sm:py-24 lg:px-12"
    >
      {/* Subtle background ambient watermark (e.g. 362 / CHIS like the reference) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-8 top-10 select-none font-rader text-[7rem] font-bold text-slate-100 sm:text-[9rem] lg:right-16 lg:top-8"
      >
        362
      </div>

      <div className="relative mx-auto w-full max-w-[1240px]">
        {/* ───── Header matching reference ───── */}
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: EASE }}
          className="text-center"
        >
          <div className="flex items-center justify-center gap-3 font-varela text-xs font-semibold uppercase tracking-[0.2em] text-[#096c27]">
            <span className="h-[1.5px] w-6 bg-[#096c27]/40" />
            <span>How it works</span>
            <span className="h-[1.5px] w-6 bg-[#096c27]/40" />
          </div>
          <h2 className="mt-3 font-rader text-3xl font-bold tracking-tight text-[#063a2f] sm:text-4xl lg:text-[44px]">
            Three steps to <span className="text-[#096c27]">your adventure.</span>
          </h2>
        </motion.div>

        {/* ═════════ Desktop (lg+): Wave Line with positioned text & giant watermark numerals ═════════ */}
        <div className="relative mt-12 hidden lg:block min-h-[480px]">
          {/* Continuous Wave SVG */}
          <div className="pointer-events-none absolute inset-0 select-none">
            <svg
              viewBox="0 0 1200 480"
              preserveAspectRatio="none"
              fill="none"
              aria-hidden="true"
              className="h-full w-full overflow-visible"
            >
              <defs>
                <linearGradient id="chisProcessWaveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#096c27" stopOpacity="0.4" />
                  <stop offset="25%" stopColor="#096c27" />
                  <stop offset="65%" stopColor="#297f33" />
                  <stop offset="100%" stopColor="#096c27" stopOpacity="0.8" />
                </linearGradient>
              </defs>

              {/* Underlying soft blur glow for the line */}
              <motion.path
                initial={reduced ? false : { pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 1.6, ease: EASE }}
                d={WAVE_D}
                stroke="#096c27"
                strokeOpacity="0.2"
                strokeWidth="8"
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
                className="blur-sm"
              />

              {/* Main crisp wavy stroke */}
              <motion.path
                initial={reduced ? false : { pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 1.6, ease: EASE }}
                d={WAVE_D}
                stroke="url(#chisProcessWaveGrad)"
                strokeWidth="3.5"
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
              />
            </svg>
          </div>

          {/* 3 Step Nodes on the line */}
          {STEPS.map((s, idx) => (
            <div
              key={s.num}
              className="absolute z-10 -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${s.nodeX}%`, top: `${s.nodeY}%` }}
            >
              <HexagonNode icon={s.icon} delay={0.4 + idx * 0.2} reduced={reduced} />
            </div>
          ))}

          {/* 3 Step Content Blocks with Giant Watermark Numerals matching reference layout */}
          {STEPS.map((s, idx) => (
            <motion.div
              key={`text-${s.num}`}
              initial={reduced ? false : { opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.8, delay: 0.5 + idx * 0.2, ease: EASE }}
              className="absolute z-20"
              style={s.textStyle}
            >
              <div className="relative">
                {/* Giant faint grey numeral positioned behind/next to title */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-2 -top-8 select-none font-rader text-[78px] font-extrabold leading-none text-slate-200/80 -z-10"
                >
                  {s.num}
                </span>

                <h3 className="m-0 font-rader text-[20px] font-bold leading-snug tracking-tight text-[#063a2f]">
                  {s.title}
                </h3>
                <p className="font-varela mb-0 mt-2 text-[13.5px] leading-relaxed text-[#0d4a3a]/75">
                  {s.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ═════════ Mobile / Tablet: Responsive vertical step layout ═════════ */}
        <div className="mt-12 space-y-6 lg:hidden">
          {STEPS.map((s, idx) => (
            <motion.div
              key={s.num}
              initial={reduced ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: idx * 0.15, ease: EASE }}
              className="relative overflow-hidden rounded-2xl border border-slate-100 bg-[#fbfdfa] p-5 shadow-sm"
            >
              {/* Giant faint numeral */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-4 right-2 select-none font-rader text-7xl font-extrabold text-slate-100 -z-10"
              >
                {s.num}
              </span>

              <div className="flex items-start gap-4">
                <HexagonNode icon={s.icon} delay={idx * 0.15} reduced={reduced} />
                <div className="min-w-0 flex-1">
                  <h3 className="font-rader text-lg font-bold text-[#063a2f]">{s.title}</h3>
                  <p className="font-varela mt-1.5 text-sm leading-relaxed text-[#0d4a3a]/75">{s.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ───── Footer metadata row matching reference bottom ───── */}
        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-slate-100 pt-6 sm:flex-row">
          <p className="font-varela text-xs text-slate-400">
            Country Holidays Inn & Suites • Curated Vacations
          </p>
          <Link
            to="/contact?subject=Travel%20Plan%20Enquiry"
            className="group inline-flex items-center gap-1.5 font-varela text-xs font-bold text-[#096c27] transition hover:text-[#297f33]"
          >
            <span>Plan your journey with our travel desk</span>
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </section>
  )
}
