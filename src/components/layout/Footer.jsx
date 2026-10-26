import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { ArrowUp, ArrowUpRight, Mail, MapPin, Phone } from 'lucide-react'
import { brand } from '../../data/brand'

const EASE = [0.16, 1, 0.3, 1]
const VIEW = { once: true, amount: 0.05 }

/* Brand logo mark from /public */
const LOGO_SRC = '/logo-white.png'

/*  Palette
    emerald  #0f3d22   deep forest  #07241a   ivory  #fbf7ee
    gold     #c9a24b / #e8d3a0   blush  #f2b8c6   burgundy #7d1230  */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,500;1,600&display=swap');
.chis-serif { font-family: 'Cormorant Garamond', Georgia, 'Times New Roman', serif; }
.chis-letter {
  background: linear-gradient(180deg, #1f6b3f 0%, #0f3d22 45%, #07241a 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  filter: drop-shadow(0 2px 0 rgba(201,162,75,0.35));
}

/* ---------- flower life-cycle: grow > unfurl > open > sway ---------- */

/* 1. branches draw themselves */
.fl-grow { stroke-dasharray: 1; stroke-dashoffset: 1; }
[data-bloom="1"] .fl-grow { animation: fl-draw 2s cubic-bezier(.45,0,.2,1) forwards; }
@keyframes fl-draw { to { stroke-dashoffset: 0; } }

/* 2. leaves unfurl from the stem */
.fl-leaf { transform-box: view-box; transform-origin: 0 0; transform: scale(0) rotate(-45deg); opacity: 0; }
[data-bloom="1"] .fl-leaf { animation: fl-leaf 1.5s cubic-bezier(.2,.9,.25,1.12) forwards; }
@keyframes fl-leaf {
  0%   { transform: scale(0) rotate(-45deg); opacity: 0; }
  30%  { opacity: 1; }
  100% { transform: scale(1) rotate(0deg); opacity: 1; }
}

/* 3. peony petals open one by one, outer ring first */
.fl-petal { transform-box: view-box; transform-origin: 0 0; transform: scale(.04) rotate(35deg); opacity: 0; }
[data-bloom="1"] .fl-petal { animation: fl-petal 2.4s cubic-bezier(.22,.9,.28,1.06) forwards; }
@keyframes fl-petal {
  0%   { transform: scale(.04) rotate(var(--r0, 35deg)); opacity: 0; }
  22%  { opacity: 1; }
  100% { transform: scale(1) rotate(0deg); opacity: 1; }
}

/* 4. small blossoms pop open with a little overshoot */
.fl-bp { transform-box: view-box; transform-origin: 25px 25px; transform: scale(0) rotate(-60deg); opacity: 0; }
[data-bloom="1"] .fl-bp { animation: fl-bp 1.3s cubic-bezier(.3,1.5,.5,1) forwards; }
@keyframes fl-bp {
  0%   { transform: scale(0) rotate(-60deg); opacity: 0; }
  25%  { opacity: 1; }
  100% { transform: scale(1) rotate(0deg); opacity: 1; }
}
.fl-pop { transform-box: fill-box; transform-origin: center; transform: scale(0); opacity: 0; }
[data-bloom="1"] .fl-pop { animation: fl-pop .9s cubic-bezier(.3,1.7,.5,1) forwards; }
@keyframes fl-pop { 0% { transform: scale(0); opacity: 0; } 30% { opacity: 1; } 100% { transform: scale(1); opacity: 1; } }

/* 5. after blooming: a slow breeze */
.fl-breathe { transform-origin: 50% 60%; }
.fl-sway { transform-origin: 12% 95%; }
[data-bloom="1"] .fl-breathe { animation: fl-breathe 6.5s ease-in-out infinite alternate; }
[data-bloom="1"] .fl-sway { animation: fl-sway 8s ease-in-out infinite alternate; }
@keyframes fl-breathe { from { transform: rotate(-2deg) scale(1); } to { transform: rotate(2.2deg) scale(1.035); } }
@keyframes fl-sway { from { transform: rotate(-1.8deg); } to { transform: rotate(2deg); } }

/* 6. a few petals drift down */
.fl-fall { opacity: 0; pointer-events: none; }
[data-bloom="1"] .fl-fall { animation: fl-fall linear infinite; }
@keyframes fl-fall {
  0%   { transform: translate3d(0,0,0) rotate(0deg); opacity: 0; }
  10%  { opacity: .95; }
  50%  { transform: translate3d(calc(var(--dx) * -.35), 8vw, 0) rotate(calc(var(--rot) * .5)); }
  100% { transform: translate3d(var(--dx), 16vw, 0) rotate(var(--rot)); opacity: 0; }
}

@media (prefers-reduced-motion: reduce) {
  .fl-petal, .fl-leaf, .fl-pop, .fl-bp { transform: none !important; opacity: 1 !important; animation: none !important; }
  .fl-grow { stroke-dashoffset: 0 !important; animation: none !important; }
  .fl-breathe, .fl-sway { animation: none !important; }
  .fl-fall { display: none; }
}
`

const SOCIALS = [
  {
    key: 'instagram',
    label: 'Instagram',
    path: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z',
  },
  { key: 'facebook', label: 'Facebook', path: 'M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z' },
  { key: 'x', label: 'X (Twitter)', path: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z' },
  { key: 'youtube', label: 'YouTube', path: 'M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z' },
]

const COLUMNS = [
  {
    title: 'Memberships',
    links: [
      { label: 'Silver ownership', to: '/vacation-packages' },
      { label: 'Gold ownership', to: '/vacation-packages' },
      { label: 'Compare plans', to: '/vacation-packages#compare-plans' },
      { label: 'EMI & fees', to: '/vacation-packages' },
    ],
  },
  {
    title: 'Destinations',
    links: [
      { label: 'Mountain Chalets', to: '/destinations' },
      { label: 'Coastal Villas', to: '/destinations' },
      { label: 'Heritage Retreats', to: '/destinations' },
      { label: 'City Gateways', to: '/destinations' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About us', to: '/about' },
      { label: 'Contact', to: '/contact' },
      { label: 'Member portal', href: 'https://member.countryholidaysinnsuites.com/' },
      { label: 'Redeem voucher', href: 'https://www.countryholidaysinnsuites.com/chis/voucher' },
      { label: 'Admin portal', to: '/admin/login' },
      { label: 'Terms of use', to: '/terms' },
    ],
  },
]

/* ------------------------------------------------------------------ */
/*  Botanical artwork (inline SVG, animated with CSS in the block above) */
/* ------------------------------------------------------------------ */

/* Petal outline pointing up from (0,0): wide belly, softly ruffled tip */
const petalPath = (L, W) =>
  `M0 0C${-W * 0.5} ${-L * 0.12} ${-W * 1.15} ${-L * 0.5} ${-W * 0.85} ${-L * 0.82}` +
  `C${-W * 0.7} ${-L} ${-W * 0.25} ${-L * 0.98} ${-W * 0.1} ${-L * 0.93}` +
  `Q0 ${-L * 1.02} ${W * 0.1} ${-L * 0.93}` +
  `C${W * 0.25} ${-L * 0.98} ${W * 0.7} ${-L} ${W * 0.85} ${-L * 0.82}` +
  `C${W * 1.15} ${-L * 0.5} ${W * 0.5} ${-L * 0.12} 0 0Z`

/* base → middle → tip colour for each petal ring, per flower tone */
const TONES = {
  pink: {
    o: ['#cf5f80', '#ec9db3', '#fbdfe6'],
    m: ['#d96d8d', '#f0a9bc', '#fde9ee'],
    i: ['#e085a0', '#f5bccb', '#fff1f4'],
    c: ['#e89bb1', '#f8cfda', '#fff6f8'],
    edge: '#c8587a',
  },
  wine: {
    o: ['#3f0818', '#8e1a38', '#c4506a'],
    m: ['#4f0b1f', '#9c2240', '#d0647b'],
    i: ['#5f0f26', '#ab2c49', '#d9788c'],
    c: ['#70152d', '#b8395a', '#e08a9b'],
    edge: '#3a0715',
  },
}

function ArtDefs() {
  return (
    <svg width="0" height="0" className="absolute" aria-hidden="true" focusable="false">
      <defs>
        {Object.entries(TONES).flatMap(([tone, rings]) =>
          ['o', 'm', 'i', 'c'].map((g) => (
            <linearGradient key={`${tone}-${g}`} id={`pe-${tone}-${g}`} x1="0" y1="1" x2="0" y2="0">
              <stop offset="0" stopColor={rings[g][0]} />
              <stop offset="0.55" stopColor={rings[g][1]} />
              <stop offset="1" stopColor={rings[g][2]} />
            </linearGradient>
          )),
        )}
        <linearGradient id="leaf-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#a3b58e" />
          <stop offset="1" stopColor="#5a7550" />
        </linearGradient>
        <radialGradient id="gold-dot" cx="40%" cy="35%" r="70%">
          <stop offset="0" stopColor="#fbe9a8" />
          <stop offset="1" stopColor="#c9a24b" />
        </radialGradient>
      </defs>
    </svg>
  )
}

/* every animated piece reads its start time from --b (set per flower) plus its own offset */
const at = (t) => ({ animationDelay: `calc(var(--b, 0s) + ${t}s)` })

function Leaf({ x, y, r, s, t }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
      <g className="fl-leaf" style={at(t)}>
        <path d="M0 0C8-9 30-9 42 0C30 9 8 9 0 0Z" fill="url(#leaf-g)" stroke="#44603a" strokeWidth="0.6" strokeOpacity="0.55" />
        <path d="M2 0H37" stroke="#fff" strokeOpacity="0.4" strokeWidth="0.8" />
        <path d="M10 0L19-4.5M10 0L19 4.5M21 0L29-3.6M21 0L29 3.6" stroke="#fff" strokeOpacity="0.22" strokeWidth="0.6" fill="none" />
      </g>
    </g>
  )
}

/* Peony: four rings of ruffled petals, each one opens on its own, outer ring first */
const RINGS = [
  { n: 9, L: 44, W: 17, off: 0, b: 0, g: 'o' },
  { n: 8, L: 35, W: 15, off: 20, b: 0.5, g: 'm' },
  { n: 7, L: 26, W: 12.5, off: 8, b: 1.0, g: 'i' },
  { n: 5, L: 16, W: 9, off: 30, b: 1.45, g: 'c' },
]
function Peony({ tone = 'pink' }) {
  const edge = TONES[tone].edge
  return (
    <svg viewBox="0 0 100 100" className="block h-auto w-full overflow-visible" style={{ filter: 'drop-shadow(0 4px 4px rgba(60,20,30,0.28))' }} aria-hidden="true">
      <circle cx="50" cy="50" r="12" fill="#4a0c1b" opacity="0.35" className="fl-pop" style={at(0.2)} />
      {RINGS.map((ring, ri) =>
        Array.from({ length: ring.n }).map((_, i) => (
          <g key={`${ri}-${i}`} transform={`translate(50 50) rotate(${ring.off + (i * 360) / ring.n}) translate(0 -2)`}>
            <g className="fl-petal" style={{ ...at(ring.b + i * 0.07), '--r0': i % 2 ? '-35deg' : '35deg' }}>
              <path d={petalPath(ring.L, ring.W)} fill={`url(#pe-${tone}-${ring.g})`} stroke={edge} strokeOpacity="0.3" strokeWidth="0.5" />
              <path d={`M0 ${-ring.L * 0.12}V${-ring.L * 0.72}M0 ${-ring.L * 0.2}L${-ring.W * 0.45} ${-ring.L * 0.62}M0 ${-ring.L * 0.2}L${ring.W * 0.45} ${-ring.L * 0.62}`} stroke="#fff" strokeOpacity="0.2" strokeWidth="0.5" fill="none" />
            </g>
          </g>
        )),
      )}
      {/* golden stamens appear last */}
      <circle cx="50" cy="50" r="3.4" fill="url(#gold-dot)" className="fl-pop" style={at(2.2)} />
      {Array.from({ length: 14 }).map((_, i) => {
        const a = (i * 360) / 14
        const d = 5 + (i % 3) * 2
        return (
          <circle key={i} cx={50 + d * Math.cos((a * Math.PI) / 180)} cy={50 + d * Math.sin((a * Math.PI) / 180)} r="1.05" fill="#e8c766" className="fl-pop" style={at(2.3 + i * 0.03)} />
        )
      })}
    </svg>
  )
}

/* Five-petal blossom */
function Blossom() {
  return (
    <svg viewBox="0 0 50 50" className="block h-auto w-full overflow-visible" style={{ filter: 'drop-shadow(0 1px 1.5px rgba(90,60,40,0.3))' }} aria-hidden="true">
      {[0, 72, 144, 216, 288].map((a, i) => (
        <circle key={a} className="fl-bp" style={at(i * 0.09)} cx={25 + 10 * Math.cos(((a - 90) * Math.PI) / 180)} cy={25 + 10 * Math.sin(((a - 90) * Math.PI) / 180)} r="9" fill="#fffaf0" stroke="#efc3cb" strokeWidth="0.8" />
      ))}
      <circle className="fl-pop" style={at(0.55)} cx="25" cy="25" r="4.2" fill="url(#gold-dot)" />
      {[0, 60, 120, 180, 240, 300].map((a, i) => (
        <circle key={a} className="fl-pop" style={at(0.65 + i * 0.03)} cx={25 + 6.4 * Math.cos((a * Math.PI) / 180)} cy={25 + 6.4 * Math.sin((a * Math.PI) / 180)} r="0.9" fill="#b9892f" />
      ))}
    </svg>
  )
}

/* Curving branch: the stem draws itself, then each leaf unfurls in order */
const SPRIG_LEAVES = [
  { x: 14, y: 80, r: -155, s: 0.55 },
  { x: 20, y: 66, r: -25, s: 0.6 },
  { x: 27, y: 52, r: -160, s: 0.55 },
  { x: 35, y: 40, r: -20, s: 0.55 },
  { x: 44, y: 28, r: -150, s: 0.5 },
  { x: 54, y: 17, r: -35, s: 0.5 },
  { x: 62, y: 8, r: -120, s: 0.4 },
]
function Sprig() {
  return (
    <svg viewBox="0 0 100 100" className="block h-auto w-full overflow-visible" aria-hidden="true">
      <path d="M8 98C18 74 28 44 62 6" pathLength="1" className="fl-grow" style={at(0)} fill="none" stroke="#6b7f5a" strokeWidth="1.2" strokeLinecap="round" />
      {SPRIG_LEAVES.map((l, i) => (
        <Leaf key={i} {...l} t={0.35 + i * 0.22} />
      ))}
    </svg>
  )
}

/* Places an art piece inside a letter (x / y / w are % of the letter box) */
function Art({ k, x, y, w, rot = 0, flip = false, z = 1, delay = 0, idx = 0, tone }) {
  const motionClass = k === 'sprig' ? 'fl-sway' : 'fl-breathe'
  return (
    <div
      className="pointer-events-none absolute"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: `${w}%`,
        zIndex: z,
        '--b': `${delay}s`,
        transform: `translate(-50%, -50%) rotate(${rot}deg) scaleX(${flip ? -1 : 1})`,
      }}
    >
      <div className={motionClass} style={{ animationDelay: `calc(var(--b) + ${3 + (idx % 4) * 0.6}s)` }}>
        {k === 'peony' ? <Peony tone={tone} /> : k === 'blossom' ? <Blossom /> : <Sprig />}
      </div>
    </div>
  )
}

/* Per-letter flower arrangements. Tweak x / y / w to nudge any flower.
   Order matters: branches grow first, peonies open next, blossoms pop last. */
const LETTERS = [
  {
    ch: 'C',
    art: [
      { k: 'sprig', x: 14, y: 36, w: 78, rot: -8, z: 1 },
      { k: 'sprig', x: 82, y: 92, w: 40, rot: 100, flip: true, z: 1 },
      { k: 'peony', tone: 'pink', x: 27, y: 76, w: 56, z: 3 },
      { k: 'peony', tone: 'wine', x: 52, y: 90, w: 38, z: 4 },
      { k: 'blossom', x: 8, y: 60, w: 17, z: 4 },
      { k: 'blossom', x: 18, y: 96, w: 15, z: 4 },
      { k: 'blossom', x: 70, y: 16, w: 15, z: 2 },
    ],
  },
  {
    ch: 'H',
    art: [
      { k: 'sprig', x: 6, y: 42, w: 66, rot: 2, z: 1 },
      { k: 'peony', tone: 'pink', x: 20, y: 76, w: 46, z: 3 },
      { k: 'blossom', x: 6, y: 26, w: 20, z: 4 },
      { k: 'blossom', x: 18, y: 50, w: 16, z: 4 },
      { k: 'blossom', x: 36, y: 94, w: 15, z: 4 },
    ],
  },
  {
    ch: 'I',
    art: [
      { k: 'sprig', x: 48, y: 46, w: 74, rot: 6, z: 1 },
      { k: 'peony', tone: 'pink', x: 24, y: 66, w: 32, z: 3 },
      { k: 'blossom', x: 26, y: 30, w: 24, z: 4 },
      { k: 'blossom', x: 64, y: 56, w: 20, z: 4 },
      { k: 'blossom', x: 40, y: 82, w: 18, z: 4 },
    ],
  },
  {
    ch: 'S',
    art: [
      { k: 'sprig', x: 90, y: 58, w: 62, rot: 18, z: 1 },
      { k: 'peony', tone: 'pink', x: 78, y: 84, w: 50, z: 3 },
      { k: 'blossom', x: 92, y: 32, w: 18, z: 4 },
      { k: 'blossom', x: 62, y: 96, w: 15, z: 4 },
      { k: 'blossom', x: 99, y: 74, w: 14, z: 4 },
    ],
  },
]

/* a few loose petals drifting down once everything has opened */
const FALLING = [
  { l: '12%', dur: '11s', del: '5s', dx: '3vw', rot: '320deg' },
  { l: '31%', dur: '13s', del: '8s', dx: '-2vw', rot: '-280deg' },
  { l: '47%', dur: '12s', del: '6.5s', dx: '2.5vw', rot: '400deg' },
  { l: '63%', dur: '14s', del: '9.5s', dx: '-3vw', rot: '-360deg' },
  { l: '78%', dur: '12.5s', del: '7s', dx: '2vw', rot: '300deg' },
  { l: '90%', dur: '15s', del: '11s', dx: '-2.5vw', rot: '-330deg' },
]

/* ------------------------------------------------------------------ */
/*  Pieces                                                            */
/* ------------------------------------------------------------------ */

function RevealLine({ children, show, delay = 0, className = '' }) {
  const reduce = useReducedMotion()
  return (
    <span className="block overflow-hidden pb-[0.12em]">
      <motion.span
        className={`block ${className}`}
        initial={reduce ? false : { y: '110%' }}
        animate={{ y: show || reduce ? 0 : '110%' }}
        transition={{ duration: 1.1, delay, ease: EASE }}
      >
        {children}
      </motion.span>
    </span>
  )
}

/* Link: slides right and draws an underline on hover */
function FooterLink({ to, href, children }) {
  const cls =
    'group relative inline-flex w-fit text-[15px] text-[#0b1f12]/70 transition-colors duration-300 hover:text-[#096c27] focus-visible:text-[#096c27] focus-visible:outline-none'
  const inner = (
    <span className="relative transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1.5 group-focus-visible:translate-x-1.5 motion-reduce:transition-none">
      {children}
      <span
        aria-hidden="true"
        className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-[#c9a24b] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100 group-focus-visible:scale-x-100 motion-reduce:transition-none"
      />
    </span>
  )
  return to ? (
    <Link to={to} className={cls}>{inner}</Link>
  ) : (
    <a href={href} target="_blank" rel="noreferrer" className={cls}>{inner}</a>
  )
}

/* Dark rounded call-to-action card with a gold spotlight that follows the pointer */
function CtaCard({ onClick }) {
  const reduce = useReducedMotion()
  const ref = useRef(null)
  const show = useInView(ref, { once: true, amount: 0.2 })

  const move = (e) => {
    const el = ref.current
    if (!el || reduce || e.pointerType !== 'mouse') return
    const r = el.getBoundingClientRect()
    el.style.setProperty('--sx', `${e.clientX - r.left}px`)
    el.style.setProperty('--sy', `${e.clientY - r.top}px`)
  }

  return (
    <motion.div
      ref={ref}
      onPointerMove={move}
      initial={reduce ? false : { opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEW}
      transition={{ duration: 1, ease: EASE }}
      style={{ '--sx': '50%', '--sy': '50%' }}
      className="group relative isolate overflow-hidden rounded-[1.75rem] bg-[#07241a] px-6 py-12 text-center text-[#faf6ea] shadow-[0_30px_70px_-24px_rgba(7,36,26,0.75)] ring-1 ring-[#c9a24b]/35 sm:rounded-[2rem] sm:py-16"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(ellipse at 15% 110%, rgba(201,162,75,0.28), transparent 55%), repeating-linear-gradient(90deg, rgba(255,255,255,0.035) 0 2px, transparent 2px 26px)',
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: 'radial-gradient(420px circle at var(--sx,50%) var(--sy,50%), rgba(217,189,120,0.2), transparent 60%)' }}
      />

      <h2 className="chis-serif mx-auto max-w-3xl text-[clamp(2.25rem,5.2vw,4.5rem)] font-semibold leading-[1] tracking-[-0.02em]">
        <RevealLine show={show}>Ready to plan your next</RevealLine>
        <RevealLine show={show} delay={0.1} className="italic text-[#e8d3a0]">holiday with CHIS?</RevealLine>
      </h2>

      <motion.p
        initial={reduce ? false : { opacity: 0, y: 16 }}
        animate={show || reduce ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.9, delay: 0.35, ease: EASE }}
        className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-[#faf6ea]/75 sm:text-base"
      >
        Silver and Gold vacation packages, with easy EMI plans.
      </motion.p>

      <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
        <button
          type="button"
          onClick={onClick}
          className="group/btn inline-flex items-center gap-3 rounded-full bg-gradient-to-b from-[#f3dfa6] to-[#c9a24b] py-2 pl-7 pr-2 text-sm font-semibold text-[#07241a] shadow-[0_14px_30px_-10px_rgba(0,0,0,0.6)] transition-transform duration-300 hover:scale-[1.03] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#e8d3a0] focus-visible:ring-offset-2 focus-visible:ring-offset-[#07241a]"
        >
          Plan your trip
          <span className="grid h-10 w-10 place-items-center rounded-full bg-[#07241a] text-[#e8d3a0] transition-transform duration-500 group-hover/btn:rotate-45">
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </span>
        </button>
        <Link
          to="/vacation-packages"
          className="inline-flex h-12 items-center rounded-full border border-[#e8d3a0]/45 px-7 text-sm font-semibold text-[#e8d3a0] transition-colors duration-300 hover:bg-[#e8d3a0] hover:text-[#07241a] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#e8d3a0] focus-visible:ring-offset-2 focus-visible:ring-offset-[#07241a]"
        >
          View vacation packages
        </Link>
      </div>

      {/* For New Membership Enquiry callout in CTA */}
      <div className="mt-7 flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 border-t border-[#e8d3a0]/20 pt-5 text-xs sm:text-sm text-[#faf6ea]/85">
        <span className="font-semibold uppercase tracking-wider text-[#e8d3a0]">
          For New Membership Enquiry:
        </span>
        <span className="font-bold text-white">
          CALL US @ <a href="tel:8130701133" className="text-[#f3dfa6] underline-offset-4 hover:underline">8130701133</a>
        </span>
        <span className="hidden opacity-40 sm:inline">•</span>
        <a href="mailto:info@countryholidaysinnsuites.com" className="text-[#e8d3a0] underline-offset-4 hover:underline">
          info@countryholidaysinnsuites.com
        </a>
      </div>
    </motion.div>
  )
}

/* ------------------------------------------------------------------ */
/*  Footer                                                            */
/* ------------------------------------------------------------------ */

export default function Footer() {
  const reduce = useReducedMotion()
  const markRef = useRef(null)
  const bloom = useInView(markRef, { once: true, amount: 0.25 })
  const phoneHref = brand?.phone ? `tel:${String(brand.phone).replace(/[^\d+]/g, '')}` : undefined

  const fade = (i = 0) => ({
    initial: reduce ? false : { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: VIEW,
    transition: { duration: 0.8, delay: i * 0.07, ease: EASE },
  })

  const openBooking = () =>
    window.dispatchEvent(
      new CustomEvent('open-booking-modal', {
        detail: { destination: 'Footer Enquiry', persons: '2 Persons', days: 'Membership & Holiday Consultation' },
      }),
    )

  return (
    <footer className="relative flex flex-col overflow-hidden bg-[#f3f8e6] text-[#0b1f12]">
      <style>{CSS}</style>
      <ArtDefs />

      <div className="mx-auto flex w-full max-w-[90rem] flex-col px-4 pt-6 sm:px-6 lg:px-8">
        {/* ---------- 1. dark call-to-action card ---------- */}
        <CtaCard onClick={openBooking} />

        {/* ---------- 2. logo + brand + link columns ---------- */}
        <div className="grid gap-10 px-1 pt-14 sm:px-4 lg:grid-cols-12 lg:gap-8 lg:pt-20">
          <motion.div {...fade(0)} className="lg:col-span-5">
            <Link to="/" className="inline-flex items-center gap-4 group">
              <img
                src={LOGO_SRC}
                alt={brand?.name || 'Country Holidays Inn & Suites'}
                width="64"
                height="72"
                onError={(e) => {
                  if (!e.currentTarget.dataset.fallback) {
                    e.currentTarget.dataset.fallback = '1'
                    e.currentTarget.src = '/tree-logo.png'
                  }
                }}
                className="h-[64px] sm:h-[72px] w-auto shrink-0 object-contain drop-shadow-[0_6px_10px_rgba(15,61,34,0.25)] transition-transform duration-300 group-hover:scale-105"
              />
              <span className="chis-serif text-2xl font-semibold leading-tight text-[#096c27] transition-colors duration-300 group-hover:text-[#06501b]">
                {brand?.name || 'Country Holidays Inn & Suites'}
              </span>
            </Link>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-[#0b1f12]/75">
              {brand?.tagline || 'Holiday ownership, built for families.'}
            </p>
            <div className="mt-4 space-y-2 text-sm text-[#0b1f12]/80">
              <div className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#096c27]" />
                <span className="leading-snug">
                  126, 1st Floor, Devika Tower 6, Nehru Place<br />New Delhi - 110019.
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 shrink-0 text-[#096c27]" />
                <span>Customer Care <a href="tel:8130701133" className="font-semibold text-[#096c27] hover:underline">8130701133</a></span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 shrink-0 text-[#096c27]" />
                <span>Phone no : <a href="tel:8130701133" className="font-semibold text-[#096c27] hover:underline">8130701133</a></span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 shrink-0 text-[#096c27]" />
                <a href="mailto:info@countryholidaysinnsuites.com" className="break-all transition-colors hover:text-[#096c27] hover:underline sm:break-normal">info@countryholidaysinnsuites.com</a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 shrink-0 text-[#096c27]" />
                <a href="mailto:customercare@countryholidaysinnsuites.com" className="break-all transition-colors hover:text-[#096c27] hover:underline sm:break-normal">customercare@countryholidaysinnsuites.com</a>
              </div>
            </div>
            <div className="mt-6 flex items-center gap-2.5">
              {SOCIALS.map((s) =>
                brand?.socials?.[s.key] ? (
                  <a
                    key={s.key}
                    href={brand.socials[s.key]}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={s.label}
                    className="group relative grid h-9 w-9 place-items-center overflow-hidden rounded-full border border-[#096c27]/30 text-[#096c27] transition-colors duration-300 hover:text-white focus-visible:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#096c27]"
                  >
                    <span aria-hidden="true" className="absolute inset-0 translate-y-full bg-[#096c27] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0 group-focus-visible:translate-y-0 motion-reduce:transition-none" />
                    <svg viewBox="0 0 24 24" className="relative h-3.5 w-3.5 fill-current" aria-hidden="true"><path d={s.path} /></svg>
                  </a>
                ) : null,
              )}
            </div>
          </motion.div>

          <div className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3 lg:col-span-7 lg:pl-8">
            {COLUMNS.map((col, ci) => (
              <motion.nav key={col.title} {...fade(ci + 1)} aria-label={col.title}>
                <p className="text-[15px] font-semibold text-[#096c27]">{col.title}</p>
                <span aria-hidden="true" className="mt-2 block h-px w-8 bg-gradient-to-r from-[#096c27]/60 to-transparent" />
                <ul className="mt-4 space-y-3">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <FooterLink to={l.to} href={l.href}>{l.label}</FooterLink>
                    </li>
                  ))}
                  {col.title === 'Memberships' && (
                    <li className="pt-2">
                      <div className="rounded-xl border border-[#096c27]/25 bg-[#096c27]/5 p-3 text-xs">
                        <p className="font-bold uppercase tracking-wider text-[#9a6a12]">New Membership Enquiry</p>
                        <a href="tel:8130701133" className="mt-1 block font-bold text-[#096c27] hover:underline">
                          CALL @ 8130701133
                        </a>
                        <a href="mailto:info@countryholidaysinnsuites.com" className="mt-0.5 block truncate text-[11px] text-[#0b1f12]/75 hover:text-[#096c27] hover:underline">
                          info@countryholidaysinnsuites.com
                        </a>
                      </div>
                    </li>
                  )}
                </ul>
              </motion.nav>
            ))}
          </div>
        </div>

        {/* ---------- 3. floral CHIS wordmark ---------- */}
        <div
          ref={markRef}
          data-bloom={bloom ? '1' : '0'}
          aria-hidden="true"
          className="chis-serif relative mx-auto my-8 flex w-full select-none items-end justify-between px-[5%] pb-[2.5vw] pt-[5vw] text-[clamp(3.2rem,21vw,26rem)] font-bold leading-[0.78] sm:my-12 sm:px-[7%]"
        >
          {LETTERS.map((L, li) => (
            <div key={L.ch} className="relative">
              <motion.span
                className="chis-letter block"
                initial={reduce ? false : { opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.01 }}
                transition={{ duration: 0.9, delay: 0.05 + li * 0.1, ease: EASE }}
              >
                {L.ch}
              </motion.span>
              {L.art.map((a, ai) => (
                <Art key={ai} {...a} idx={ai} delay={0.5 + li * 0.35 + ai * 0.12} />
              ))}
            </div>
          ))}

          {FALLING.map((p, i) => (
            <span
              key={i}
              className="fl-fall absolute top-[6%] z-[6]"
              style={{ left: p.l, width: 'clamp(10px, 1.8vw, 26px)', animationDuration: p.dur, animationDelay: p.del, '--dx': p.dx, '--rot': p.rot }}
            >
              <svg viewBox="-11 -23 22 24" className="block h-auto w-full" style={{ filter: 'drop-shadow(0 1px 1px rgba(60,20,30,0.3))' }}>
                <path d={petalPath(22, 9)} fill="url(#pe-pink-m)" stroke="#c8587a" strokeOpacity="0.3" strokeWidth="0.4" />
              </svg>
            </span>
          ))}
        </div>

        {/* divider with diamond */}
        <div aria-hidden="true" className="mb-6 flex items-center gap-4 px-4">
          <span className="h-px flex-1 bg-gradient-to-r from-transparent via-[#096c27]/30 to-[#096c27]/30" />
          <span className="h-2 w-2 rotate-45 bg-[#096c27]" />
          <span className="h-px flex-1 bg-gradient-to-l from-transparent via-[#096c27]/30 to-[#096c27]/30" />
        </div>
      </div>

      {/* ---------- 4. bottom bar ---------- */}
      <div className="relative border-t border-[#096c27]/15">
        <div className="mx-auto flex w-full max-w-[90rem] flex-col items-start justify-between gap-4 px-5 py-4 text-xs text-[#0b1f12]/60 sm:flex-row sm:items-center sm:px-8 lg:px-12">
          <p>{brand?.copyright}</p>
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' })}
            aria-label="Back to top"
            className="group relative grid h-11 w-11 place-items-center overflow-hidden rounded-full border border-[#096c27]/30 text-[#096c27] shadow-[0_10px_24px_-10px_rgba(9,108,39,0.35)] transition-colors duration-300 hover:border-[#096c27] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#096c27]"
          >
            <span aria-hidden="true" className="absolute inset-0 translate-y-full bg-[#096c27] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0 motion-reduce:transition-none" />
            <ArrowUp className="relative h-4 w-4 stroke-[2.5] transition-transform duration-300 group-hover:-translate-y-0.5" />
          </button>
        </div>
      </div>
    </footer>
  )
}