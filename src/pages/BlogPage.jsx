import { useEffect, useMemo, useRef, useState } from 'react'
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion'
import {
  ArrowRight,
  ArrowUpRight,
  Bookmark,
  CheckCircle2,
  LayoutGrid,
  List,
  Search,
  Send,
  Share2,
  X,
} from 'lucide-react'
import PageTransition from '../components/layout/PageTransition'
import { blogPosts, blogCategories } from '../data/blogPosts'

/* -------------------------------------------------------------------------- */
/*  Cinematic Journal tokens                                                  */
/*  ink #070908 · surface #0d1211 · bone #f2ede3 · gold #e8a33d · teal #0f4c4f */
/*  (teal shadows + golden highlights, the classic cinematic grade)           */
/* -------------------------------------------------------------------------- */

const EASE = [0.16, 1, 0.3, 1]
const pad = (n) => String(n).padStart(2, '0')

/* ---------- small building blocks ---------- */

function Reveal({ children, delay = 0, y = 32, className = '' }) {
  const rm = useReducedMotion()
  return (
    <motion.div
      className={className}
      initial={rm ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-8% 0px' }}
      transition={{ duration: 1, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  )
}

function Eyebrow({ children }) {
  return (
    <span className="flex items-center gap-3 text-[11px] uppercase tracking-[0.28em] text-[#f2ede3]/55">
      <span className="h-px w-10 bg-[#e8a33d]" />
      {children}
    </span>
  )
}

function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: 0.3 })
  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[70] h-[2px] origin-left bg-[#e8a33d]"
    />
  )
}

/* ---------- post cards ---------- */

function PostCard({ post, index, onOpen, setCursor }) {
  const wide = index % 4 === 0 || index % 4 === 3
  return (
    <Reveal className={`${wide ? 'lg:col-span-7' : 'lg:col-span-5'} ${index % 2 === 1 ? 'lg:mt-24' : ''}`}>
      <article
        role="button"
        tabIndex={0}
        aria-label={`Read: ${post.title}`}
        onClick={() => onOpen(post)}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), onOpen(post))}
        onMouseEnter={() => setCursor({ type: 'read' })}
        onMouseLeave={() => setCursor(null)}
        className="group cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-[#e8a33d] focus-visible:ring-offset-8 focus-visible:ring-offset-[#070908]"
      >
        <div className={`relative overflow-hidden bg-[#0d1211] ${wide ? 'aspect-[16/11]' : 'aspect-[4/5]'}`}>
          <img
            src={post.image}
            alt={post.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.07]"
          />
          <div className="absolute inset-0 bg-[#0f4c4f]/25 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#070908]/80 via-transparent to-[#070908]/20" />
          <span className="absolute left-5 top-5 font-nunito text-sm font-light tracking-[0.2em] text-[#f2ede3]/90">
            {pad(index + 1)}
          </span>
          <span className="absolute bottom-5 left-5 border border-[#f2ede3]/30 bg-[#070908]/50 px-3 py-1 text-[10px] uppercase tracking-[0.24em] text-[#f2ede3] backdrop-blur-md">
            {post.category}
          </span>
        </div>

        <div className="mt-6 flex items-start justify-between gap-8">
          <div className="min-w-0">
            <p className="text-[11px] uppercase tracking-[0.24em] text-[#f2ede3]/45">
              {post.date} — {post.readTime}
            </p>
            <h3 className="mt-3 font-nunito text-2xl font-light leading-[1.1] tracking-[-0.025em] text-[#f2ede3] transition-colors duration-500 group-hover:text-[#e8a33d] sm:text-3xl">
              {post.title}
            </h3>
            <p className="mt-3 line-clamp-2 max-w-md font-sans text-sm leading-relaxed text-[#f2ede3]/55">
              {post.excerpt}
            </p>
          </div>
          <span className="mt-1 grid h-12 w-12 shrink-0 place-items-center rounded-full border border-[#f2ede3]/20 text-[#f2ede3] transition-all duration-500 group-hover:rotate-45 group-hover:border-[#e8a33d] group-hover:bg-[#e8a33d] group-hover:text-[#070908]">
            <ArrowUpRight className="h-4 w-4" />
          </span>
        </div>
      </article>
    </Reveal>
  )
}

function ListRow({ post, index, onOpen, setCursor }) {
  return (
    <Reveal y={20}>
      <div
        role="button"
        tabIndex={0}
        aria-label={`Read: ${post.title}`}
        onClick={() => onOpen(post)}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), onOpen(post))}
        onMouseEnter={() => setCursor({ type: 'preview', post })}
        onMouseLeave={() => setCursor(null)}
        className="group grid cursor-pointer grid-cols-12 items-center gap-4 border-t border-[#f2ede3]/10 py-7 transition-colors duration-500 hover:bg-[#f2ede3]/[0.025] focus:outline-none focus-visible:bg-[#f2ede3]/[0.04] md:py-10"
      >
        <span className="col-span-2 pl-2 font-nunito text-sm font-light tracking-[0.2em] text-[#f2ede3]/40 md:col-span-1">
          {pad(index + 1)}
        </span>
        <h3 className="col-span-10 font-nunito text-2xl font-light leading-[1.05] tracking-[-0.03em] text-[#f2ede3] transition-all duration-500 group-hover:translate-x-3 group-hover:text-[#e8a33d] sm:text-4xl md:col-span-6 lg:text-5xl">
          {post.title}
        </h3>
        <span className="col-span-3 hidden text-[11px] uppercase tracking-[0.24em] text-[#f2ede3]/50 md:block">
          {post.category}
        </span>
        <span className="col-span-2 hidden text-[11px] uppercase tracking-[0.24em] text-[#f2ede3]/40 md:block">
          {post.readTime}
        </span>
      </div>
    </Reveal>
  )
}

/* ---------- featured cover story ---------- */

function FeaturedStory({ post, onOpen, setCursor }) {
  const ref = useRef(null)
  const rm = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], rm ? ['0%', '0%'] : ['-9%', '9%'])

  return (
    <section className="mx-auto max-w-[96rem] px-5 pt-16 sm:px-8 sm:pt-24 lg:px-12">
      <Reveal>
        <Eyebrow>Cover story</Eyebrow>
      </Reveal>

      <Reveal className="mt-6" y={48}>
        <article
          ref={ref}
          role="button"
          tabIndex={0}
          aria-label={`Read cover story: ${post.title}`}
          onClick={() => onOpen(post)}
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), onOpen(post))}
          onMouseEnter={() => setCursor({ type: 'read' })}
          onMouseLeave={() => setCursor(null)}
          className="group relative h-[82svh] min-h-[540px] cursor-pointer overflow-hidden bg-[#0d1211] focus:outline-none focus-visible:ring-1 focus-visible:ring-[#e8a33d]"
        >
          <motion.img
            src={post.image}
            alt=""
            style={{ y }}
            className="absolute inset-x-0 -top-[12%] h-[124%] w-full object-cover transition-transform duration-[1600ms] ease-out group-hover:scale-[1.04]"
          />
          <div className="absolute inset-0 bg-[#0f4c4f]/30 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#070908] via-[#070908]/35 to-[#070908]/30" />

          <div className="absolute inset-0 flex flex-col justify-between p-6 sm:p-10 lg:p-14">
            <div className="flex items-start justify-between gap-6">
              <span className="bg-[#e8a33d] px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.26em] text-[#070908]">
                {post.category}
              </span>
              <span className="text-[11px] uppercase tracking-[0.26em] text-[#f2ede3]/70">
                {post.date} — {post.readTime}
              </span>
            </div>

            <div className="grid items-end gap-8 lg:grid-cols-12">
              <div className="lg:col-span-9">
                <h2 className="font-nunito text-[clamp(2.25rem,6.6vw,6.75rem)] font-light leading-[0.95] tracking-[-0.045em] text-[#f2ede3]">
                  {post.title}
                </h2>
                <p className="mt-6 line-clamp-2 max-w-xl font-sans text-sm leading-relaxed text-[#f2ede3]/70 sm:text-base">
                  {post.excerpt}
                </p>
                <div className="mt-8 flex items-center gap-3">
                  <img
                    src={post.author.avatar}
                    alt={post.author.name}
                    className="h-10 w-10 rounded-full border border-[#f2ede3]/30 object-cover"
                  />
                  <div>
                    <p className="text-sm font-medium text-[#f2ede3]">{post.author.name}</p>
                    <p className="text-xs text-[#f2ede3]/50">{post.author.role}</p>
                  </div>
                </div>
              </div>

              <div className="hidden justify-end lg:col-span-3 lg:flex">
                <span className="grid h-28 w-28 place-items-center rounded-full border border-[#f2ede3]/30 text-[#f2ede3] transition-all duration-700 group-hover:rotate-45 group-hover:border-[#e8a33d] group-hover:bg-[#e8a33d] group-hover:text-[#070908]">
                  <ArrowUpRight className="h-8 w-8" />
                </span>
              </div>
            </div>
          </div>
        </article>
      </Reveal>
    </section>
  )
}

/* ---------- full-screen story reader ---------- */

function ArticleReader({ post, nextPost, onClose, onOpenPost, onBook }) {
  const scrollRef = useRef(null)
  const [saved, setSaved] = useState(false)
  const [copied, setCopied] = useState(false)
  const { scrollYProgress } = useScroll({ container: scrollRef })
  const heroY = useTransform(scrollYProgress, [0, 0.4], ['0%', '8%'])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 })
    setSaved(false)
  }, [post.id])

  const blocks = useMemo(
    () =>
      post.content
        .split('\n\n')
        .map((t) => t.trim())
        .filter(Boolean),
    [post.content],
  )
  const firstParagraph = blocks.findIndex((b) => !b.startsWith('###'))

  const share = async () => {
    const url = window.location.href
    try {
      if (navigator.share) {
        await navigator.share({ title: post.title, text: post.excerpt, url })
      } else {
        await navigator.clipboard.writeText(url)
        setCopied(true)
        setTimeout(() => setCopied(false), 1800)
      }
    } catch {
      /* share dismissed */
    }
  }

  const iconBtn =
    'grid h-11 w-11 place-items-center rounded-full border border-[#f2ede3]/25 bg-[#070908]/50 text-[#f2ede3] backdrop-blur-md transition-colors duration-300 hover:border-[#e8a33d] hover:text-[#e8a33d] focus:outline-none focus-visible:ring-1 focus-visible:ring-[#e8a33d]'

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={post.title}
      initial={{ clipPath: 'inset(100% 0% 0% 0%)' }}
      animate={{ clipPath: 'inset(0% 0% 0% 0%)' }}
      exit={{ clipPath: 'inset(100% 0% 0% 0%)' }}
      transition={{ duration: 0.9, ease: EASE }}
      className="fixed inset-0 z-[100] bg-[#070908] text-[#f2ede3]"
    >
      <motion.div
        aria-hidden="true"
        style={{ scaleX: scrollYProgress }}
        className="absolute inset-x-0 top-0 z-30 h-[2px] origin-left bg-[#e8a33d]"
      />

      {/* top bar */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-center justify-between px-5 py-5 sm:px-8 lg:px-12">
        <span className="pointer-events-auto hidden text-[11px] uppercase tracking-[0.28em] text-[#f2ede3]/70 sm:block">
          CHIS Journal — {post.category}
        </span>
        <div className="pointer-events-auto ml-auto flex items-center gap-2.5">
          <button type="button" onClick={() => setSaved((s) => !s)} aria-pressed={saved} aria-label="Save story" className={iconBtn}>
            <Bookmark className={`h-4 w-4 ${saved ? 'fill-[#e8a33d] text-[#e8a33d]' : ''}`} />
          </button>
          <button type="button" onClick={share} aria-label="Share story" className={iconBtn}>
            {copied ? <CheckCircle2 className="h-4 w-4 text-[#e8a33d]" /> : <Share2 className="h-4 w-4" />}
          </button>
          <button type="button" onClick={onClose} aria-label="Close story" className={iconBtn}>
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div ref={scrollRef} className="h-full overflow-y-auto overscroll-contain">
        {/* hero */}
        <div className="relative h-[80svh] min-h-[480px] overflow-hidden">
          <motion.img
            src={post.image}
            alt=""
            style={{ y: heroY }}
            className="absolute inset-x-0 -top-[10%] h-[120%] w-full object-cover"
          />
          <div className="absolute inset-0 bg-[#0f4c4f]/30 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#070908] via-[#070908]/40 to-[#070908]/50" />

          <div className="absolute inset-x-0 bottom-0 mx-auto max-w-6xl px-5 pb-12 sm:px-8 sm:pb-16 lg:px-12">
            <div className="flex flex-wrap items-center gap-4 text-[11px] uppercase tracking-[0.26em] text-[#f2ede3]/70">
              <span className="bg-[#e8a33d] px-3.5 py-1 font-semibold text-[#070908]">{post.category}</span>
              <span>{post.date}</span>
              <span className="text-[#e8a33d]">/</span>
              <span>{post.readTime}</span>
            </div>
            <h2 className="mt-6 max-w-5xl font-nunito text-[clamp(2.5rem,7vw,6.5rem)] font-light leading-[0.95] tracking-[-0.045em]">
              {post.title}
            </h2>
          </div>
        </div>

        {/* body */}
        <div className="mx-auto max-w-2xl px-5 pb-40 pt-14 sm:px-8 sm:pt-20">
          <div className="flex items-center gap-4 border-b border-[#f2ede3]/10 pb-8">
            <img
              src={post.author.avatar}
              alt={post.author.name}
              className="h-12 w-12 rounded-full border border-[#f2ede3]/25 object-cover"
            />
            <div>
              <p className="text-sm font-medium">{post.author.name}</p>
              <p className="text-xs text-[#f2ede3]/50">{post.author.role}</p>
            </div>
          </div>

          <p className="mt-10 font-nunito text-2xl font-light italic leading-[1.35] tracking-[-0.01em] text-[#f2ede3] sm:text-3xl">
            {post.excerpt}
          </p>

          <div className="mt-12 space-y-6 font-sans text-base leading-[1.85] text-[#f2ede3]/75 sm:text-[1.0625rem]">
            {blocks.map((block, idx) => {
              if (block.startsWith('###')) {
                return (
                  <h4
                    key={idx}
                    className="pt-8 font-nunito text-2xl font-light tracking-[-0.02em] text-[#f2ede3] sm:text-3xl"
                  >
                    {block.replace(/^###\s*/, '')}
                  </h4>
                )
              }
              const dropCap = idx === firstParagraph
              return (
                <p
                  key={idx}
                  className={
                    dropCap
                      ? 'first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:font-nunito first-letter:text-[4.5rem] first-letter:font-light first-letter:leading-[0.8] first-letter:text-[#e8a33d]'
                      : undefined
                  }
                >
                  {block}
                </p>
              )
            })}
          </div>

          <div className="mt-14 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="border border-[#f2ede3]/15 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-[#f2ede3]/55"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* next story */}
          {nextPost && nextPost.id !== post.id && (
            <button
              type="button"
              onClick={() => onOpenPost(nextPost)}
              className="group mt-20 block w-full border-t border-[#f2ede3]/10 pt-10 text-left focus:outline-none"
            >
              <span className="text-[11px] uppercase tracking-[0.28em] text-[#f2ede3]/45">Next story</span>
              <span className="mt-4 flex items-end justify-between gap-6">
                <span className="font-nunito text-3xl font-light leading-[1.05] tracking-[-0.03em] transition-colors duration-500 group-hover:text-[#e8a33d] sm:text-5xl">
                  {nextPost.title}
                </span>
                <ArrowRight className="mb-2 h-7 w-7 shrink-0 text-[#e8a33d] transition-transform duration-500 group-hover:translate-x-2" />
              </span>
            </button>
          )}
        </div>
      </div>

      {/* floating concierge CTA */}
      <div className="pointer-events-none absolute inset-x-0 bottom-6 z-20 flex justify-center px-5">
        <button
          type="button"
          onClick={() => onBook(post.title)}
          className="pointer-events-auto inline-flex items-center gap-3 rounded-full bg-[#e8a33d] py-2 pl-7 pr-2 text-sm font-semibold text-[#070908] shadow-[0_10px_50px_-8px_#e8a33d] transition-transform duration-300 hover:scale-[1.03] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#f2ede3]"
        >
          Plan this expedition
          <span className="grid h-10 w-10 place-items-center rounded-full bg-[#070908] text-[#e8a33d]">
            <ArrowUpRight className="h-4 w-4" />
          </span>
        </button>
      </div>
    </motion.div>
  )
}

/* ---------- page ---------- */

export default function BlogPage() {
  const rm = useReducedMotion()
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [view, setView] = useState('grid')
  const [activeArticle, setActiveArticle] = useState(null)
  const [subscribed, setSubscribed] = useState(false)
  const [newsletterEmail, setNewsletterEmail] = useState('')
  const [cursor, setCursor] = useState(null)
  const [canHover, setCanHover] = useState(false)

  /* custom cursor follower (fine pointers only) */
  const mx = useMotionValue(-300)
  const my = useMotionValue(-300)
  const sx = useSpring(mx, { stiffness: 260, damping: 28, mass: 0.4 })
  const sy = useSpring(my, { stiffness: 260, damping: 28, mass: 0.4 })

  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    setCanHover(fine)
    if (!fine) return undefined
    const move = (e) => {
      mx.set(e.clientX)
      my.set(e.clientY)
    }
    window.addEventListener('mousemove', move)
    return () => window.removeEventListener('mousemove', move)
  }, [mx, my])

  /* reader: lock page scroll + Escape to close */
  useEffect(() => {
    if (!activeArticle) return undefined
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e) => e.key === 'Escape' && setActiveArticle(null)
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [activeArticle])

  const openArticle = (post) => {
    setCursor(null)
    setActiveArticle(post)
  }

  const filteredPosts = useMemo(() => {
    const q = searchQuery.toLowerCase()
    return blogPosts.filter((post) => {
      const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory
      const matchesSearch =
        post.title.toLowerCase().includes(q) ||
        post.excerpt.toLowerCase().includes(q) ||
        post.tags.some((tag) => tag.toLowerCase().includes(q))
      return matchesCategory && matchesSearch
    })
  }, [selectedCategory, searchQuery])

  const featuredPost = useMemo(() => blogPosts.find((p) => p.featured) || blogPosts[0], [])
  const showFeatured = selectedCategory === 'All' && !searchQuery && !!featuredPost
  const gridPosts = showFeatured ? filteredPosts.filter((p) => p.id !== featuredPost.id) : filteredPosts

  const counts = useMemo(() => {
    const map = {}
    blogCategories.forEach((cat) => {
      map[cat] = cat === 'All' ? blogPosts.length : blogPosts.filter((p) => p.category === cat).length
    })
    return map
  }, [])

  const marqueeItems = useMemo(() => {
    const cats = blogCategories.filter((c) => c !== 'All')
    const base = cats.length ? cats : ['Journal']
    return [...base, ...base, ...base, ...base]
  }, [])

  const nextPost = useMemo(() => {
    if (!activeArticle) return null
    const i = blogPosts.findIndex((p) => p.id === activeArticle.id)
    return blogPosts[(i + 1) % blogPosts.length]
  }, [activeArticle])

  const handleOpenBooking = (articleTitle) => {
    window.dispatchEvent(
      new CustomEvent('open-booking-modal', {
        detail: {
          destination: `Blog Experience: ${articleTitle}`,
          persons: '2 Persons',
          days: '6N/7D Holiday',
        },
      }),
    )
    setActiveArticle(null)
  }

  const handleSubscribe = (e) => {
    e.preventDefault()
    if (!newsletterEmail) return
    setSubscribed(true)
    setTimeout(() => setNewsletterEmail(''), 2000)
  }

  const TITLE = ['Stories', 'worth the', 'journey.']

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#070908] text-[#f2ede3] antialiased selection:bg-[#e8a33d] selection:text-[#070908]">
        <style>{`
          @keyframes bj-marquee { to { transform: translateX(-50%); } }
          @keyframes bj-drift { 0%,100% { transform: translate3d(0,0,0) scale(1); } 50% { transform: translate3d(5%,6%,0) scale(1.1); } }
          .bj-marquee { animation: bj-marquee 42s linear infinite; }
          .bj-drift { animation: bj-drift 22s ease-in-out infinite; }
          @media (prefers-reduced-motion: reduce) { .bj-marquee, .bj-drift { animation: none; } }
        `}</style>

        <ScrollProgress />

        {/* film grain */}
        <svg
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-[60] h-full w-full opacity-[0.06] mix-blend-overlay"
          xmlns="http://www.w3.org/2000/svg"
        >
          <filter id="bj-grain">
            <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#bj-grain)" />
        </svg>

        {/* custom cursor */}
        {canHover && !activeArticle && (
          <AnimatePresence>
            {cursor?.type === 'read' && (
              <motion.div
                key="cursor-read"
                aria-hidden="true"
                style={{ x: sx, y: sy, marginLeft: -48, marginTop: -48 }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                transition={{ duration: 0.35, ease: EASE }}
                className="pointer-events-none fixed left-0 top-0 z-[90] grid h-24 w-24 place-items-center rounded-full bg-[#e8a33d] text-[11px] font-semibold uppercase tracking-[0.22em] text-[#070908]"
              >
                Read
              </motion.div>
            )}
            {cursor?.type === 'preview' && (
              <motion.div
                key="cursor-preview"
                aria-hidden="true"
                style={{ x: sx, y: sy, marginLeft: 28, marginTop: -112 }}
                initial={{ opacity: 0, scale: 0.85, rotate: -5 }}
                animate={{ opacity: 1, scale: 1, rotate: -3 }}
                exit={{ opacity: 0, scale: 0.85 }}
                transition={{ duration: 0.35, ease: EASE }}
                className="pointer-events-none fixed left-0 top-0 z-[90] h-56 w-72 overflow-hidden border border-[#f2ede3]/20 shadow-2xl"
              >
                <img src={cursor.post.image} alt="" className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-[#0f4c4f]/25 mix-blend-multiply" />
              </motion.div>
            )}
          </AnimatePresence>
        )}

        {/* ================================================================== */}
        {/* HERO                                                               */}
        {/* ================================================================== */}
        <section className="relative isolate overflow-hidden pb-10 pt-36 sm:pt-44">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
            <div className="bj-drift absolute -left-[15%] -top-[25%] h-[60vw] w-[60vw] rounded-full bg-[#0f4c4f]/55 blur-3xl" />
            <div className="bj-drift absolute -bottom-[30%] -right-[10%] h-[45vw] w-[45vw] rounded-full bg-[#e8a33d]/12 blur-3xl [animation-delay:-9s]" />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#f2ede30d_1px,transparent_1px)] [background-size:25%_100%]" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,#070908_100%)]" />
          </div>

          <div className="mx-auto max-w-[96rem] px-5 sm:px-8 lg:px-12">
            <div className="flex items-center justify-between">
              <Eyebrow>CHIS Journal</Eyebrow>
              <span className="hidden text-[11px] uppercase tracking-[0.28em] text-[#f2ede3]/45 sm:block">
                Vol. 26 — {pad(blogPosts.length)} stories
              </span>
            </div>

            <h1 className="mt-10 font-nunito text-[clamp(3.5rem,13.5vw,12.5rem)] font-light leading-[0.88] tracking-[-0.055em]">
              {TITLE.map((line, i) => (
                <span key={line} className="block overflow-hidden pb-[0.1em]">
                  <motion.span
                    className={`block ${i === 2 ? 'italic text-[#e8a33d]' : ''}`}
                    initial={rm ? false : { y: '110%' }}
                    animate={{ y: '0%' }}
                    transition={{ duration: 1.3, delay: 0.1 + i * 0.12, ease: EASE }}
                  >
                    {line}
                  </motion.span>
                </span>
              ))}
            </h1>

            <motion.div
              initial={rm ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.7, ease: EASE }}
              className="mt-10 grid gap-8 lg:grid-cols-12"
            >
              <p className="max-w-md font-sans text-base leading-relaxed text-[#f2ede3]/60 sm:text-lg lg:col-span-5 lg:col-start-8">
                Insider destination guides, hospitality secrets and slow-travel dispatches from our alpine and coastal
                expedition leads.
              </p>
            </motion.div>

            {/* controls */}
            <div className="mt-14 flex flex-col gap-6 border-y border-[#f2ede3]/10 py-5 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
                {blogCategories.map((cat) => {
                  const active = selectedCategory === cat
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedCategory(cat)}
                      className={`relative pb-1.5 text-sm transition-colors duration-300 focus:outline-none focus-visible:text-[#e8a33d] ${active ? 'text-[#f2ede3]' : 'text-[#f2ede3]/40 hover:text-[#f2ede3]/80'
                        }`}
                    >
                      {cat}
                      <sup className="ml-1 text-[10px] text-[#e8a33d]">{pad(counts[cat] ?? 0)}</sup>
                      {active && (
                        <motion.span
                          layoutId="bj-tab-underline"
                          className="absolute inset-x-0 -bottom-px h-px bg-[#e8a33d]"
                          transition={{ duration: 0.5, ease: EASE }}
                        />
                      )}
                    </button>
                  )
                })}
              </div>

              <div className="flex items-center gap-6">
                <label className="flex w-full items-center gap-3 border-b border-[#f2ede3]/20 pb-2 transition-colors focus-within:border-[#e8a33d] lg:w-64">
                  <Search className="h-4 w-4 shrink-0 text-[#f2ede3]/45" />
                  <input
                    type="text"
                    placeholder="Search stories, tags"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-transparent text-sm text-[#f2ede3] placeholder-[#f2ede3]/35 focus:outline-none"
                  />
                  {searchQuery && (
                    <button type="button" onClick={() => setSearchQuery('')} aria-label="Clear search">
                      <X className="h-4 w-4 text-[#f2ede3]/50 hover:text-[#e8a33d]" />
                    </button>
                  )}
                </label>

                <div className="hidden items-center gap-1 sm:flex" role="group" aria-label="Layout">
                  {[
                    { id: 'grid', Icon: LayoutGrid, label: 'Grid view' },
                    { id: 'list', Icon: List, label: 'Index view' },
                  ].map(({ id, Icon, label }) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setView(id)}
                      aria-pressed={view === id}
                      aria-label={label}
                      className={`grid h-10 w-10 place-items-center rounded-full border transition-colors duration-300 ${view === id
                          ? 'border-[#e8a33d] text-[#e8a33d]'
                          : 'border-transparent text-[#f2ede3]/40 hover:text-[#f2ede3]'
                        }`}
                    >
                      <Icon className="h-4 w-4" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================== */}
        {/* MARQUEE                                                            */}
        {/* ================================================================== */}
        <div aria-hidden="true" className="overflow-hidden border-b border-[#f2ede3]/10 py-5">
          <div className="bj-marquee flex w-max items-center gap-10 whitespace-nowrap">
            {marqueeItems.map((item, i) => (
              <span key={`${item}-${i}`} className="flex items-center gap-10">
                <span className="font-nunito text-4xl font-light uppercase tracking-[-0.02em] text-transparent [-webkit-text-stroke:1px_rgba(242,237,227,0.35)] sm:text-6xl">
                  {item}
                </span>
                <span className="text-xl text-[#e8a33d]">✦</span>
              </span>
            ))}
          </div>
        </div>

        {/* ================================================================== */}
        {/* FEATURED                                                           */}
        {/* ================================================================== */}
        {showFeatured && <FeaturedStory post={featuredPost} onOpen={openArticle} setCursor={setCursor} />}

        {/* ================================================================== */}
        {/* ARTICLES                                                           */}
        {/* ================================================================== */}
        <section className="mx-auto max-w-[96rem] px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
          <div className="mb-14 flex items-end justify-between gap-6">
            <h2 className="font-nunito text-[clamp(2rem,5vw,4.5rem)] font-light leading-none tracking-[-0.04em]">
              {searchQuery ? (
                <>
                  Results for <span className="italic text-[#e8a33d]">“{searchQuery}”</span>
                </>
              ) : selectedCategory === 'All' ? (
                'All stories'
              ) : (
                selectedCategory
              )}
            </h2>
            <span className="shrink-0 text-[11px] uppercase tracking-[0.28em] text-[#f2ede3]/45">
              {pad(filteredPosts.length)} {filteredPosts.length === 1 ? 'story' : 'stories'}
            </span>
          </div>

          {filteredPosts.length === 0 ? (
            <div className="border border-[#f2ede3]/10 px-6 py-24 text-center">
              <Search className="mx-auto mb-5 h-10 w-10 text-[#f2ede3]/20" />
              <h3 className="font-nunito text-3xl font-light tracking-[-0.02em]">Nothing found on this route.</h3>
              <p className="mx-auto mt-3 max-w-md text-sm text-[#f2ede3]/50">
                Try different keywords, check the spelling, or explore another category.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('All')
                  setSearchQuery('')
                }}
                className="mt-8 rounded-full bg-[#e8a33d] px-7 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#070908] transition-transform hover:scale-[1.04]"
              >
                Reset filters
              </button>
            </div>
          ) : view === 'list' ? (
            <div key={`list-${selectedCategory}`} className="border-b border-[#f2ede3]/10">
              {filteredPosts.map((post, i) => (
                <ListRow key={post.id} post={post} index={i} onOpen={openArticle} setCursor={setCursor} />
              ))}
            </div>
          ) : (
            gridPosts.length > 0 && (
              <div key={`grid-${selectedCategory}`} className="grid items-start gap-x-8 gap-y-20 lg:grid-cols-12">
                {gridPosts.map((post, i) => (
                  <PostCard key={post.id} post={post} index={i} onOpen={openArticle} setCursor={setCursor} />
                ))}
              </div>
            )
          )}
        </section>

        {/* ================================================================== */}
        {/* NEWSLETTER                                                         */}
        {/* ================================================================== */}
        <section className="relative isolate overflow-hidden border-t border-[#f2ede3]/10">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute -right-[10%] top-0 h-[45vw] w-[45vw] rounded-full bg-[#0f4c4f]/45 blur-3xl" />
            <div className="absolute -left-[10%] bottom-[-30%] h-[35vw] w-[35vw] rounded-full bg-[#e8a33d]/10 blur-3xl" />
          </div>

          <div className="mx-auto max-w-[96rem] px-5 py-24 sm:px-8 sm:py-32 lg:px-12">
            <Reveal>
              <Eyebrow>Insider dispatch</Eyebrow>
            </Reveal>
            <Reveal delay={0.1}>
              <h3 className="mt-8 max-w-5xl font-nunito text-[clamp(2.75rem,8.5vw,8rem)] font-light leading-[0.92] tracking-[-0.05em]">
                Letters from <span className="italic text-[#e8a33d]">the road.</span>
              </h3>
            </Reveal>

            <div className="mt-14 grid gap-10 lg:grid-cols-12">
              <Reveal delay={0.15} className="lg:col-span-4">
                <p className="max-w-sm font-sans text-base leading-relaxed text-[#f2ede3]/60">
                  Join 18,000+ travellers. Curated itineraries, off-peak resort deals and seasonal booking openings,
                  twice a month. No spam.
                </p>
              </Reveal>

              <Reveal delay={0.25} className="lg:col-span-6 lg:col-start-7">
                {subscribed ? (
                  <div className="flex items-center gap-3 border border-[#e8a33d]/40 bg-[#e8a33d]/10 p-5 text-[#e8a33d]">
                    <CheckCircle2 className="h-5 w-5 shrink-0" />
                    <p className="text-sm font-medium">
                      Welcome aboard. Check your inbox shortly for our 2026 Alpine Guide.
                    </p>
                  </div>
                ) : (
                  <form
                    onSubmit={handleSubscribe}
                    className="flex items-end gap-4 border-b border-[#f2ede3]/30 pb-4 transition-colors focus-within:border-[#e8a33d]"
                  >
                    <input
                      type="email"
                      required
                      placeholder="Your email address"
                      value={newsletterEmail}
                      onChange={(e) => setNewsletterEmail(e.target.value)}
                      aria-label="Email address"
                      className="min-w-0 flex-1 bg-transparent font-nunito text-2xl font-light tracking-[-0.02em] text-[#f2ede3] placeholder-[#f2ede3]/30 focus:outline-none sm:text-4xl"
                    />
                    <button
                      type="submit"
                      aria-label="Subscribe"
                      className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-[#e8a33d] text-[#070908] transition-all duration-500 hover:rotate-45 hover:shadow-[0_0_40px_-6px_#e8a33d] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#f2ede3]"
                    >
                      <Send className="h-5 w-5" />
                    </button>
                  </form>
                )}
              </Reveal>
            </div>
          </div>
        </section>

        {/* ================================================================== */}
        {/* READER                                                             */}
        {/* ================================================================== */}
        <AnimatePresence>
          {activeArticle && (
            <ArticleReader
              key="reader"
              post={activeArticle}
              nextPost={nextPost}
              onClose={() => setActiveArticle(null)}
              onOpenPost={setActiveArticle}
              onBook={handleOpenBooking}
            />
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  )
}