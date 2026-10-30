import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight, ChevronDown, Search, X } from 'lucide-react'
import { Link } from 'react-router-dom'
import { destinationMenuGroups, getDestinationBySlug } from '../../data/destinations'

/*
  Theme (matches Navbar + hero):
    panel   #1c2110   soft surface #2b3519   accent #b9e26a   green #6aa22f   cream #f3f1e4
  Colors are written as literal Tailwind classes below so Tailwind can detect them.
*/
const EASE = [0.16, 1, 0.3, 1]
const display = { fontFamily: "'Anton', 'Impact', sans-serif" }

const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b9e26a]'

function resolveGroup(group) {
  return {
    ...group,
    items: group.destinations.map(getDestinationBySlug).filter(Boolean),
  }
}

/* highlights the part of a name that matches the search */
function Highlight({ text, query }) {
  const q = query.trim().toLowerCase()
  if (!q) return text
  const i = text.toLowerCase().indexOf(q)
  if (i < 0) return text
  return (
    <>
      {text.slice(0, i)}
      <mark className="bg-transparent font-semibold text-[#b9e26a]">{text.slice(i, i + q.length)}</mark>
      {text.slice(i + q.length)}
    </>
  )
}

const openBooking = (onNavigate) => {
  onNavigate?.()
  window.dispatchEvent(
    new CustomEvent('open-booking-modal', {
      detail: {
        destination: 'Help me choose a destination',
        persons: '2 Persons',
        days: 'Custom Exploration',
      },
    }),
  )
}

/* ---------------------------------------------------------------- Desktop */

function MegaMenu({ groups, onNavigate }) {
  const [activeSlug, setActiveSlug] = useState(groups[0]?.slug)
  const [query, setQuery] = useState('')
  const hoverTimer = useRef(null)
  const catRefs = useRef([])

  const active = groups.find((g) => g.slug === activeSlug) ?? groups[0]
  const isLongList = (active?.items.length ?? 0) > 9

  const visible = useMemo(() => {
    if (!active) return []
    const q = query.trim().toLowerCase()
    if (!q) return active.items
    return active.items.filter((d) => d.name.toLowerCase().includes(q))
  }, [active, query])

  useEffect(() => () => clearTimeout(hoverTimer.current), [])

  if (!active) return null

  const selectGroup = (slug) => {
    setActiveSlug(slug)
    setQuery('')
  }

  /* small delay so moving the mouse diagonally toward the list doesn't switch category */
  const hoverGroup = (slug) => {
    clearTimeout(hoverTimer.current)
    hoverTimer.current = setTimeout(() => selectGroup(slug), 110)
  }
  const cancelHover = () => clearTimeout(hoverTimer.current)

  /* arrow keys move between categories */
  const onCategoryKey = (e, index) => {
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return
    e.preventDefault()
    const next = (index + (e.key === 'ArrowDown' ? 1 : -1) + groups.length) % groups.length
    selectGroup(groups[next].slug)
    catRefs.current[next]?.focus()
  }

  return (
    <div className="grid gap-5 md:grid-cols-[220px_minmax(0,1fr)] md:gap-7">
      {/* ---------- categories ---------- */}
      <div className="flex flex-col justify-between gap-4">
        <nav aria-label="Destination categories" className="space-y-1" onMouseLeave={cancelHover}>
          {groups.map((group, index) => {
            const isActive = group.slug === active.slug
            return (
              <button
                key={group.slug}
                ref={(el) => (catRefs.current[index] = el)}
                type="button"
                onMouseEnter={() => hoverGroup(group.slug)}
                onFocus={() => selectGroup(group.slug)}
                onClick={() => selectGroup(group.slug)}
                onKeyDown={(e) => onCategoryKey(e, index)}
                aria-current={isActive ? 'true' : undefined}
                className={`relative flex w-full items-center justify-between gap-3 rounded-xl px-3.5 py-2.5 text-left text-[14px] font-medium transition-colors ${focusRing} ${isActive ? 'text-[#f3f1e4]' : 'text-[#f3f1e4]/60 hover:text-[#f3f1e4]'
                  }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="dest-category"
                    aria-hidden="true"
                    className="absolute inset-0 rounded-xl bg-[#2b3519]"
                    transition={{ type: 'spring', stiffness: 420, damping: 36 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-3">
                  <span
                    aria-hidden="true"
                    className={`h-4 w-1 rounded-full transition-colors ${isActive ? 'bg-[#6aa22f]' : 'bg-transparent'}`}
                  />
                  {group.label}
                </span>
                <span className="relative z-10 text-xs tabular-nums text-[#f3f1e4]/45">
                  {group.items.length}
                </span>
              </button>
            )
          })}
        </nav>

        <button
          type="button"
          onClick={() => openBooking(onNavigate)}
          className={`hidden items-center justify-between gap-3 rounded-xl border border-white/10 px-3.5 py-3 text-left text-[13px] text-[#f3f1e4]/75 transition-colors hover:border-[#6aa22f] hover:text-[#f3f1e4] md:flex ${focusRing}`}
        >
          <span>
            Not sure where to go?
            <span className="block font-semibold text-[#f3f1e4]">Plan your journey</span>
          </span>
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#6aa22f] text-white">
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </span>
        </button>
      </div>

      {/* ---------- destinations ---------- */}
      <div className="min-w-0">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
          <div className="flex items-baseline gap-3">
            <h3
              className="m-0 text-[1.6rem] uppercase leading-none tracking-[0.01em] text-[#f3f1e4]"
              style={display}
            >
              {active.label}
            </h3>
            <span className="text-xs tabular-nums text-[#f3f1e4]/50">
              {query.trim() ? `${visible.length} of ${active.items.length}` : `${active.items.length} places`}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {isLongList && (
              <label className="relative">
                <span className="sr-only">Search {active.label}</span>
                <Search
                  aria-hidden="true"
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#f3f1e4]/45"
                />
                <input
                  type="text"
                  inputMode="search"
                  autoComplete="off"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Escape' && query && (e.stopPropagation(), setQuery(''))}
                  placeholder="Find a destination"
                  className={`h-9 w-52 rounded-full border border-white/10 bg-white/5 pl-9 pr-8 text-sm text-[#f3f1e4] placeholder:text-[#f3f1e4]/40 ${focusRing}`}
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery('')}
                    aria-label="Clear search"
                    className={`absolute right-1.5 top-1/2 grid h-6 w-6 -translate-y-1/2 place-items-center rounded-full text-[#f3f1e4]/60 hover:bg-white/10 hover:text-white ${focusRing}`}
                  >
                    <X className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                )}
              </label>
            )}
            <Link
              to={`/destinations/category/${active.slug}`}
              onClick={onNavigate}
              className={`inline-flex items-center gap-1 text-sm font-semibold text-[#b9e26a] transition-opacity hover:opacity-80 ${focusRing}`}
            >
              View all
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>

        <AnimatePresence mode="wait" initial={false}>
          {visible.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-8 text-center text-sm text-[#f3f1e4]/60"
            >
              <p className="m-0">No {active.label.toLowerCase()} match “{query}”.</p>
              <button
                type="button"
                onClick={() => setQuery('')}
                className={`mt-2 rounded-full px-3 py-1 font-semibold text-[#b9e26a] hover:underline ${focusRing}`}
              >
                Clear search
              </button>
            </motion.div>
          ) : (
            <motion.ul
              key={active.slug}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, ease: EASE }}
              className="m-0 grid max-h-[clamp(180px,calc(100svh_-_300px),420px)] list-none grid-cols-2 gap-x-2 gap-y-0.5 overflow-y-auto p-0 pr-1 lg:grid-cols-3"
            >
              {visible.map((d) => (
                <li key={d.slug}>
                  <Link
                    to={`/destinations/${d.slug}`}
                    onClick={onNavigate}
                    className={`group flex items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm text-[#f3f1e4]/85 transition-colors hover:bg-[#2b3519] hover:text-white ${focusRing}`}
                  >
                    <span className="truncate">
                      <Highlight text={d.name} query={query} />
                    </span>
                    <ArrowUpRight
                      aria-hidden="true"
                      className="h-3.5 w-3.5 shrink-0 -translate-x-1 text-[#b9e26a] opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100"
                    />
                  </Link>
                </li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

/* ----------------------------------------------------------------- Mobile */

function MobileAccordion({ groups, onNavigate }) {
  const [openSlug, setOpenSlug] = useState(groups[0]?.slug)

  return (
    <div className="space-y-1.5">
      {groups.map((group) => {
        const isOpen = group.slug === openSlug
        const panelId = `dest-panel-${group.slug}`

        return (
          <section
            key={group.slug}
            className={`overflow-hidden rounded-2xl border transition-colors ${isOpen ? 'border-white/15 bg-[#2b3519]/70' : 'border-white/10 bg-white/[0.04]'
              }`}
          >
            <button
              type="button"
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() => setOpenSlug(isOpen ? null : group.slug)}
              className={`flex min-h-12 w-full items-center justify-between gap-3 px-4 py-3 text-left ${focusRing}`}
            >
              <span className="text-[15px] font-medium text-[#f3f1e4]">
                {group.label}
                <span className="ml-2 text-xs font-normal tabular-nums text-[#f3f1e4]/45">
                  {group.items.length}
                </span>
              </span>
              <ChevronDown
                aria-hidden="true"
                className={`h-4 w-4 text-[#f3f1e4]/60 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
              />
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={panelId}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.35, ease: EASE }}
                  className="overflow-hidden"
                >
                  <div className="px-2 pb-3 pt-0.5">
                    <ul className="m-0 grid list-none grid-cols-2 gap-0.5 p-0">
                      {group.items.map((d) => (
                        <li key={d.slug}>
                          <Link
                            to={`/destinations/${d.slug}`}
                            onClick={onNavigate}
                            className={`flex min-h-11 items-center rounded-lg px-2.5 py-2 text-sm text-[#f3f1e4]/85 transition-colors active:bg-[#2b3519] hover:bg-[#2b3519] hover:text-white ${focusRing}`}
                          >
                            <span className="truncate">{d.name}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                    <Link
                      to={`/destinations/category/${group.slug}`}
                      onClick={onNavigate}
                      className={`mt-2 inline-flex min-h-11 items-center gap-1 px-2.5 text-sm font-semibold text-[#b9e26a] ${focusRing}`}
                    >
                      View all {group.label.toLowerCase()}
                      <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </section>
        )
      })}
    </div>
  )
}

/* ------------------------------------------------------------------ Entry */

export default function DestinationMenuLinks({ mode = 'mega', onNavigate }) {
  const groups = useMemo(() => destinationMenuGroups.map(resolveGroup), [])

  if (mode === 'mega') {
    return <MegaMenu groups={groups} onNavigate={onNavigate} />
  }

  return <MobileAccordion groups={groups} onNavigate={onNavigate} />
}