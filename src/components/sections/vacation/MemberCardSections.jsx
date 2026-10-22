import React, { useEffect, useRef, useState } from "react";
import silverCard from "../../../assets/chis-silver-card.png";
import goldCard from "../../../assets/chis-gold-card.png";

/* ------------------------------------------------------------------
   Content. Edit freely. Member benefits are shared at onboarding,
   so no discounts or perks are listed on this page.
------------------------------------------------------------------- */
const TIERS = [
  {
    id: "silver",
    tag: "T-1",
    label: "Silver",
    img: silverCard,
    line: "Start your holiday journey with CHIS.",
    pos: "left-0 top-0",
    rot: "-rotate-[5deg]",
    from: "-translate-x-16",
  },
  {
    id: "gold",
    tag: "T-2",
    label: "Gold",
    img: goldCard,
    line: "The fuller way to holiday with CHIS.",
    pos: "right-0 bottom-0",
    rot: "rotate-[4deg]",
    from: "translate-x-16",
  },
];

const WORDS = ["slow weekends", "family trips", "couple getaways", "long breaks"];

const STEPS = [
  { t: "Choose your card", s: "Pick T-1 Silver or T-2 Gold. Both come with your CHIS membership.", thumbs: true },
  { t: "Take membership", s: "Tap the button and tell us you are in. It takes a moment." },
  { t: "Get onboarded", s: "We welcome you and share your member benefits with you." },
  { t: "Start your vacations", s: "Your card is yours. Start planning where to wake up next." },
];

/* ------------------------------------------------------------------
   Helpers
------------------------------------------------------------------- */
function useInView(threshold = 0.2) {
  const ref = useRef(null);
  const [seen, setSeen] = useState(
    () => typeof window === "undefined" || !("IntersectionObserver" in window)
  );
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return [ref, seen];
}

function Reveal({ children, delay = 0, className = "", from = "translate-y-8" }) {
  const [ref, seen] = useInView();
  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-[900ms] ease-[cubic-bezier(0.2,0.8,0.2,1)] motion-reduce:!translate-x-0 motion-reduce:!translate-y-0 motion-reduce:!opacity-100 motion-reduce:transition-none ${
        seen ? "translate-x-0 translate-y-0 opacity-100" : `${from} opacity-0`
      } ${className}`}
    >
      {children}
    </div>
  );
}

/* Words that rise out of a mask, one after another */
function RiseText({ text, start = 0, step = 0.09, className = "" }) {
  return (
    <span className={className}>
      {text.split(" ").map((w, i) => (
        <span key={i} className="mr-[0.25em] inline-block overflow-hidden align-bottom">
          <span
            style={{ animationDelay: `${start + i * step}s` }}
            className="inline-block animate-[chis-rise_1s_cubic-bezier(0.2,0.8,0.2,1)_both] motion-reduce:animate-none"
          >
            {w}
          </span>
        </span>
      ))}
    </span>
  );
}

/* Card image that tilts toward the pointer and catches a glare */
function TiltCard({ src, alt }) {
  const wrap = useRef(null);
  const glare = useRef(null);

  const move = (e) => {
    const r = wrap.current.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    wrap.current.style.transition = "transform 80ms linear";
    wrap.current.style.transform = `perspective(900px) rotateX(${(0.5 - py) * 14}deg) rotateY(${(px - 0.5) * 18}deg) scale(1.03)`;
    glare.current.style.opacity = "1";
    glare.current.style.background = `radial-gradient(circle at ${px * 100}% ${py * 100}%, rgba(255,255,255,0.38), transparent 55%)`;
  };
  const leave = () => {
    wrap.current.style.transition = "transform 600ms cubic-bezier(0.2,0.8,0.2,1)";
    wrap.current.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg) scale(1)";
    glare.current.style.opacity = "0";
  };

  return (
    <div
      ref={wrap}
      onPointerMove={move}
      onPointerLeave={leave}
      className="relative w-full rounded-[2.6%/4.4%] shadow-[0_30px_60px_-20px_rgba(0,0,0,0.7)]"
    >
      <img src={src} alt={alt} draggable={false} className="block w-full select-none rounded-[2.6%/4.4%]" />
      <div ref={glare} aria-hidden className="pointer-events-none absolute inset-0 rounded-[2.6%/4.4%] opacity-0 transition-opacity duration-300" />
    </div>
  );
}

/* ------------------------------------------------------------------
   Page
------------------------------------------------------------------- */
function MemberCardSections({ onPurchase }) {
  const [tierIndex, setTierIndex] = useState(1); // Gold in front
  const [wordIndex, setWordIndex] = useState(0);
  const [reached, setReached] = useState(-1);
  const [stageRef, stageSeen] = useInView(0.2);

  const tier = TIERS[tierIndex];

  /* rotating phrase (skipped when the visitor prefers reduced motion) */
  useEffect(() => {
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setWordIndex((i) => (i + 1) % WORDS.length), 2600);
    return () => clearInterval(id);
  }, []);

  const take = () => {
    if (onPurchase) {
      onPurchase({ tier: tier.id });
      return;
    }
    openEnquiry();
  };

  const toHow = () => {
    const el = document.getElementById("chis-how");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const membershipBtn =
    "relative inline-flex items-center justify-center overflow-hidden rounded-full px-7 py-3.5 text-sm font-semibold transition duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ff5938] sm:px-9 sm:py-4 sm:text-base";

  const takeButton = () => (
    <button
      type="button"
      onClick={take}
      className={`${membershipBtn} cursor-pointer bg-[#ff5938] text-slate-950 shadow-[0_12px_30px_-10px_rgba(255,89,56,0.4)] hover:-translate-y-0.5 hover:bg-[#ff765d] hover:shadow-[0_18px_36px_-10px_rgba(255,89,56,0.5)] active:translate-y-0`}
    >
      <span aria-hidden className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 -skew-x-[20deg] bg-white/60 blur-[6px] animate-[chis-sheen_3.6s_ease-in-out_infinite] motion-reduce:hidden" />
      <span className="relative">Enquire about CHIS {tier.label} membership</span>
    </button>
  );

  return (
    <section className="relative overflow-hidden bg-transparent text-slate-950">
      <style>{KEYFRAMES}</style>

      <div aria-hidden className="pointer-events-none absolute -right-28 -top-28 h-[460px] w-[460px] rounded-full bg-[#ff5938]/[0.08] blur-[120px] animate-[chis-drift_14s_ease-in-out_infinite] motion-reduce:animate-none" />
      <div aria-hidden className="pointer-events-none absolute -left-40 top-[30%] h-[400px] w-[400px] rounded-full bg-slate-950/[0.035] blur-[120px] animate-[chis-drift_18s_ease-in-out_infinite_reverse] motion-reduce:animate-none" />

      {/* =============== HERO =============== */}
      <div className="relative mx-auto grid max-w-[1180px] items-center gap-14 px-5 pb-20 pt-20 sm:px-8 sm:pt-28 lg:grid-cols-[1.05fr_1fr] lg:gap-10">
        <div>
          <h2 className="m-0 font-sans text-[clamp(42px,7vw,86px)] font-semibold uppercase leading-[0.88] tracking-[-0.06em]">
            <RiseText text="Take the card." className="block" />
            <RiseText text="Take the holiday." start={0.35} className="block text-[#d9361b]" />
          </h2>

          <p className="mb-0 mt-6 min-h-[2.8em] font-sans text-[clamp(20px,2.4vw,28px)] leading-snug text-slate-700 animate-[chis-up_0.9s_0.9s_ease-out_both] motion-reduce:animate-none">
            Made for{" "}
            <span key={wordIndex} className="inline-block font-semibold text-[#d9361b] animate-[chis-up_0.6s_ease-out_both] motion-reduce:animate-none">
              {WORDS[wordIndex]}.
            </span>
          </p>

          <p className="mb-0 mt-2 max-w-[480px] text-[17px] leading-relaxed text-slate-600 animate-[chis-up_0.9s_1.05s_ease-out_both] motion-reduce:animate-none">
            Country Holidays Inn &amp; Suites. Why are you still waiting to take your CHIS membership and enjoy your vacations?
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4 animate-[chis-up_0.9s_1.2s_ease-out_both] motion-reduce:animate-none">
            {takeButton()}
            <button
              type="button"
              onClick={toHow}
              className="rounded-full border border-slate-950/25 bg-white/40 px-7 py-4 text-[15px] font-medium transition hover:border-[#ff5938] hover:bg-[#ff5938]/10 hover:text-[#d9361b] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ff5938]"
            >
              How to get your card
            </button>
          </div>
        </div>

        {/* cards */}
        <div ref={stageRef}>
          <div className="relative mx-auto aspect-[100/78] w-full max-w-[520px]">
            {TIERS.map((t, i) => {
              const front = i === tierIndex;
              return (
                <div
                  key={t.id}
                  role="button"
                  tabIndex={0}
                  aria-label={`Show ${t.label} card`}
                  onClick={() => setTierIndex(i)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setTierIndex(i);
                    }
                  }}
                  style={{ transitionDelay: stageSeen ? `${600 + i * 180}ms` : "0ms" }}
                  className={`absolute w-[78%] cursor-pointer rounded-[2.6%/4.4%] outline-none transition-all duration-[1000ms] ease-[cubic-bezier(0.2,0.8,0.2,1)] focus-visible:ring-4 focus-visible:ring-[#ff5938]/70 motion-reduce:!translate-x-0 motion-reduce:!opacity-100 motion-reduce:transition-none ${t.pos} ${
                    stageSeen ? "translate-x-0 opacity-100" : `${t.from} opacity-0`
                  } ${front ? "z-20" : "z-10"}`}
                >
                  <div className={`transition-all duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)] ${t.rot} ${front ? "scale-100" : "scale-[0.94] brightness-[0.7]"}`}>
                    <div style={{ animationDelay: `${i * 1.2}s` }} className="animate-[chis-float_6s_ease-in-out_infinite] motion-reduce:animate-none">
                      <TiltCard src={t.img} alt={`CHIS ${t.label} membership card`} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8 flex flex-col items-center gap-3">
            <div role="radiogroup" aria-label="Choose your card" className="inline-flex rounded-full border border-slate-950/15 bg-white/60 p-1 shadow-sm">
              {TIERS.map((t, i) => {
                const on = i === tierIndex;
                return (
                  <button
                    key={t.id}
                    type="button"
                    role="radio"
                    aria-checked={on}
                    onClick={() => setTierIndex(i)}
                    className={`rounded-full px-5 py-2.5 text-sm font-medium transition duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff5938] ${
                      on ? "bg-[#ff5938] text-slate-950 shadow-sm" : "text-slate-600 hover:text-slate-950"
                    }`}
                  >
                    {t.tag} · {t.label}
                  </button>
                );
              })}
            </div>
            <p key={tier.id} className="m-0 text-center text-[15px] text-slate-600 animate-[chis-up_0.5s_ease-out_both] motion-reduce:animate-none">
              {tier.line}
            </p>
          </div>
        </div>
      </div>

      {/* =============== HOW TO GET =============== */}
      <div id="chis-how" className="relative mx-auto max-w-[1180px] scroll-mt-8 px-5 pb-24 pt-20 sm:px-8 sm:pb-32 sm:pt-24">
        <div className="grid gap-12 border-t border-slate-950/15 pt-10 sm:pt-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <Reveal from="-translate-x-8" className="lg:sticky lg:top-24 lg:self-start">
            <p className="mb-3 flex items-center gap-2 text-sm font-medium text-slate-600">
              <span className="h-2 w-2 rounded-full bg-[#ff5938]" />
              Simple steps
            </p>
            <h3 className="m-0 font-sans text-[clamp(32px,4.8vw,56px)] font-semibold uppercase leading-[0.9] tracking-[-0.055em]">
              How to get your CHIS card
            </h3>
            <p className="mb-0 mt-4 max-w-[420px] text-[17px] leading-relaxed text-slate-600">
              Four short steps from deciding to checking in. No long forms, no waiting around.
            </p>
          </Reveal>

          <ol className="relative m-0 list-none p-0">
            <div aria-hidden className="absolute bottom-6 left-[21px] top-6 w-px bg-slate-950/15" />
            <div
              aria-hidden
              style={{ height: `${Math.min(100, ((reached + 0.6) / STEPS.length) * 100)}%` }}
              className="absolute left-[21px] top-6 max-h-[calc(100%-3rem)] w-px bg-gradient-to-b from-[#ff5938] to-[#ff5938]/30 transition-[height] duration-[1200ms] ease-out motion-reduce:transition-none"
            />
            {STEPS.map((s, i) => (
              <Step key={s.t} index={i} step={s} onSeen={() => setReached((r) => Math.max(r, i))} />
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

/* one timeline step: slides in from the right when scrolled into view */
function Step({ index, step, onSeen }) {
  const [ref, seen] = useInView(0.45);
  useEffect(() => {
    if (seen) onSeen();
  }, [seen]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <li
      ref={ref}
      className={`relative flex gap-6 pb-14 transition-all duration-[900ms] ease-[cubic-bezier(0.2,0.8,0.2,1)] last:pb-0 motion-reduce:!translate-x-0 motion-reduce:!opacity-100 motion-reduce:transition-none ${
        seen ? "translate-x-0 opacity-100" : "translate-x-10 opacity-0"
      }`}
    >
      <span
        className={`relative z-10 grid h-11 w-11 flex-none place-items-center rounded-full border font-sans text-lg transition-all duration-700 ${
          seen ? "border-[#ff5938] bg-[#ff5938] text-slate-950 shadow-[0_0_0_6px_rgba(255,89,56,0.14)]" : "border-slate-950/20 bg-white text-slate-500"
        }`}
      >
        {index + 1}
      </span>
      <div className="pt-1.5">
        <p className="m-0 font-sans text-[clamp(22px,2.4vw,28px)] font-semibold uppercase leading-[0.95] tracking-[-0.04em] text-slate-950">{step.t}</p>
        <p className="mb-0 mt-2 max-w-[420px] text-[16px] leading-relaxed text-slate-600">{step.s}</p>
        {step.thumbs && (
          <div className="mt-5 flex items-center">
            <img src={silverCard} alt="CHIS Silver card" className="w-[120px] -rotate-[5deg] rounded-md shadow-[0_10px_20px_-8px_rgba(0,0,0,0.6)]" />
            <img src={goldCard} alt="CHIS Gold card" className="-ml-6 w-[120px] rotate-[4deg] rounded-md shadow-[0_10px_20px_-8px_rgba(0,0,0,0.6)]" />
          </div>
        )}
      </div>
    </li>
  );
}

export default MemberCardSections;

const KEYFRAMES = `
@keyframes chis-float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-9px); } }
@keyframes chis-up { from { opacity: 0; transform: translateY(22px); } to { opacity: 1; transform: translateY(0); } }
@keyframes chis-rise { from { transform: translateY(110%); } to { transform: translateY(0); } }
@keyframes chis-drift { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(-40px, 30px); } }
@keyframes chis-sheen { 0% { transform: translateX(0) skewX(-20deg); } 60%, 100% { transform: translateX(520%) skewX(-20deg); } }
`;