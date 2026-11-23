import { motion, useReducedMotion } from 'framer-motion'
import {
  Compass,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  ArrowUpRight,
  ChevronRight,
  Headphones,
  Award,
  CalendarCheck,
} from 'lucide-react'
import { Link } from 'react-router-dom'

const EASE = [0.16, 1, 0.3, 1]

const STEPS = [
  {
    step: '01',
    phase: 'Discovery',
    title: 'Tell Us What You Love',
    desc: 'Share your dates, travelers, and the kind of escape you envision — from high-altitude thrills to quiet coastal wellness and grand family gatherings.',
    icon: Compass,
    highlights: [
      'Tailored destinations & dates',
      'Custom travel style & pace',
      'Zero-commitment holiday inquiry',
    ],
    accentColor: '#096c27',
  },
  {
    step: '02',
    phase: 'Curation',
    title: 'We Curate Every Detail',
    desc: 'Our dedicated holiday desk verifies handpicked partner resorts, private transfers, and certified local guides into one effortless itinerary.',
    icon: Sparkles,
    highlights: [
      'Verified 4★ & 5★ luxury stays',
      'Private transfers & activities',
      'Guaranteed transparent rates',
    ],
    accentColor: '#06501b',
  },
  {
    step: '03',
    phase: 'Departure',
    title: 'Arrive, Unwind & Enjoy',
    desc: 'Everything is locked in before you set out. Travel with complete peace of mind, knowing our 24/7 human concierge desk is just one tap away.',
    icon: ShieldCheck,
    highlights: [
      'Guaranteed priority check-in',
      '24/7 on-call travel assistance',
      'CHIS member perks & privileges',
    ],
    accentColor: '#096c27',
  },
]

export default function ProcessWaveSection() {
  const reduced = !!useReducedMotion()

  return (
    <section
      id="how-it-works"
      className="relative isolate w-full overflow-hidden bg-gradient-to-b from-white via-[#fbfdfa] to-white px-5 py-20 sm:px-8 sm:py-24 lg:px-12"
    >
      {/* Ambient background soft glow orbs */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-20 top-1/4 h-80 w-80 rounded-full bg-[#b3d565]/15 blur-3xl -z-10"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 bottom-1/4 h-80 w-80 rounded-full bg-[#096c27]/10 blur-3xl -z-10"
      />

      <div className="relative mx-auto w-full max-w-[1240px]">
        {/* ================= Header ================= */}
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: EASE }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-[#096c27]/20 bg-[#096c27]/5 px-4 py-1.5 font-varela text-xs font-semibold uppercase tracking-[0.2em] text-[#096c27]">
            <Compass className="h-3.5 w-3.5" />
            <span>How It Works</span>
          </div>

          <h2 className="mt-4 font-rader text-3xl font-bold tracking-tight text-[#063a2f] sm:text-4xl lg:text-[46px] leading-[1.1]">
            Three simple steps to <span className="text-[#096c27]">your next escape.</span>
          </h2>

          <p className="mx-auto mt-3.5 max-w-2xl font-varela text-sm leading-relaxed text-[#0d4a3a]/75 sm:text-base">
            From your very first idea to 24/7 on-ground assistance, our travel desk handles every
            detail so all you need to do is pack your bags.
          </p>
        </motion.div>

        {/* ================= Visual Connector Track (Desktop) ================= */}
        <div className="relative mt-12 hidden lg:block" aria-hidden="true">
          <div className="mx-auto flex max-w-4xl items-center justify-between px-16">
            {STEPS.map((s, idx) => (
              <div key={s.step} className="flex items-center">
                {/* Milestone Node */}
                <div className="relative flex items-center justify-center">
                  <span className="absolute h-10 w-10 animate-ping rounded-full bg-[#b3d565]/30" />
                  <div className="relative flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#096c27] bg-white font-rader text-sm font-bold text-[#096c27] shadow-md">
                    {s.step}
                  </div>
                </div>

                {/* Connecting Line between nodes */}
                {idx < STEPS.length - 1 && (
                  <div className="relative mx-4 h-[2px] w-64 bg-gradient-to-r from-[#096c27] via-[#b3d565] to-[#096c27]">
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1 text-[#096c27]">
                      <ChevronRight className="h-4 w-4" />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ================= 3 Step Cards Grid ================= */}
        <div className="mt-10 grid grid-cols-1 gap-6 sm:mt-12 md:grid-cols-3 lg:gap-8">
          {STEPS.map((s, idx) => {
            const Icon = s.icon
            return (
              <motion.article
                key={s.step}
                initial={reduced ? false : { opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6, delay: idx * 0.15, ease: EASE }}
                className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-[#096c27]/15 bg-white p-6 sm:p-8 shadow-[0_10px_35px_-10px_rgba(9,108,39,0.08)] transition-all duration-500 hover:-translate-y-2 hover:border-[#096c27]/40 hover:shadow-[0_24px_50px_-12px_rgba(9,108,39,0.18)]"
              >
                {/* Giant faint watermark numeral */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute right-4 top-2 select-none font-rader text-[100px] font-extrabold leading-none text-slate-100 transition-colors duration-500 group-hover:text-[#b3d565]/20 -z-0"
                >
                  {s.step}
                </span>

                <div className="relative z-10">
                  {/* Top Phase Badge & Icon */}
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#f3f8e6] px-3 py-1 font-varela text-[11px] font-bold uppercase tracking-wider text-[#096c27] border border-[#096c27]/10">
                      Step {s.step} · {s.phase}
                    </span>

                    <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#096c27] to-[#063a2f] text-white shadow-md transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6">
                      <Icon className="h-6 w-6 text-[#b3d565]" />
                    </div>
                  </div>

                  {/* Card Title & Description */}
                  <h3 className="mt-6 font-rader text-2xl font-bold tracking-tight text-[#063a2f]">
                    {s.title}
                  </h3>

                  <p className="mt-3 font-varela text-sm leading-relaxed text-[#0d4a3a]/75">
                    {s.desc}
                  </p>

                  {/* Highlights checklist */}
                  <ul className="mt-6 space-y-2.5 border-t border-slate-100 pt-5 list-none p-0">
                    {s.highlights.map((item) => (
                      <li key={item} className="flex items-center gap-2.5 font-varela text-xs text-[#063a2f]/85">
                        <span className="grid h-4 w-4 shrink-0 place-items-center rounded-full bg-[#096c27]/10 text-[#096c27]">
                          <CheckCircle2 className="h-3 w-3" strokeWidth={3} />
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Bottom interactive indicator */}
                <div className="relative z-10 mt-7 pt-4 border-t border-slate-100/80 flex items-center justify-between text-xs font-bold text-[#096c27]">
                  <span className="font-varela text-[11px] tracking-wide text-slate-400 group-hover:text-[#096c27] transition-colors">
                    CHIS Care Standard
                  </span>
                  <span className="grid h-7 w-7 place-items-center rounded-full bg-[#f3f8e6] text-[#096c27] transition-transform duration-300 group-hover:rotate-45 group-hover:bg-[#096c27] group-hover:text-white">
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </span>
                </div>

                {/* Bottom decorative color bar */}
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-[#096c27] via-[#b3d565] to-[#096c27] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                />
              </motion.article>
            )
          })}
        </div>

        {/* ================= Bottom Trust & Action Banner ================= */}
        <div className="mt-14 flex flex-col items-center justify-between gap-6 rounded-2xl border border-[#096c27]/15 bg-white p-6 shadow-sm sm:flex-row sm:p-7">
          <div className="flex flex-wrap items-center justify-center gap-6 sm:justify-start">
            <div className="flex items-center gap-2.5">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#f3f8e6] text-[#096c27]">
                <Award className="h-5 w-5" />
              </span>
              <div>
                <p className="font-varela text-xs font-bold text-[#063a2f]">3,500+ Luxury Stays</p>
                <p className="font-varela text-[11px] text-slate-500">Verified international network</p>
              </div>
            </div>

            <div className="hidden h-8 w-px bg-slate-200 md:block" />

            <div className="flex items-center gap-2.5">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#f3f8e6] text-[#096c27]">
                <Headphones className="h-5 w-5" />
              </span>
              <div>
                <p className="font-varela text-xs font-bold text-[#063a2f]">24/7 Human Desk</p>
                <p className="font-varela text-[11px] text-slate-500">Always on call while you travel</p>
              </div>
            </div>

            <div className="hidden h-8 w-px bg-slate-200 lg:block" />

            <div className="hidden items-center gap-2.5 lg:flex">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#f3f8e6] text-[#096c27]">
                <CalendarCheck className="h-5 w-5" />
              </span>
              <div>
                <p className="font-varela text-xs font-bold text-[#063a2f]">Flexible Booking</p>
                <p className="font-varela text-[11px] text-slate-500">Split & carry forward nights</p>
              </div>
            </div>
          </div>

          <Link
            to="/contact?subject=Travel%20Plan%20Enquiry"
            className="font-varela group inline-flex shrink-0 items-center gap-2.5 rounded-full bg-[#096c27] px-6 py-3 text-xs font-bold text-white shadow-md transition-all hover:bg-[#06501b] hover:shadow-lg focus:outline-none focus-visible:ring-4 focus-visible:ring-[#096c27]/40"
          >
            <span>Plan with Our Travel Desk</span>
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:rotate-45" />
          </Link>
        </div>
      </div>
    </section>
  )
}
