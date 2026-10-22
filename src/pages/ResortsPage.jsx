import { useMemo, useState } from 'react'
import { resorts } from '../data/resorts'
import ResortCard from '../components/ui/ResortCard'
import SectionHeading from '../components/ui/SectionHeading'
import PageTransition from '../components/layout/PageTransition'

export default function ResortsPage() {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('All')

  const filters = ['All', ...new Set(resorts.map((item) => item.destination))]

  const visibleResorts = useMemo(() => {
    return resorts.filter((resort) => {
      const matchesSearch = `${resort.name} ${resort.location}`.toLowerCase().includes(search.toLowerCase())
      const matchesFilter = filter === 'All' || resort.destination === filter
      return matchesSearch && matchesFilter
    })
  }, [search, filter])

  return (
    <PageTransition>
      <section className="bg-[#f8f4ee] py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
          <SectionHeading eyebrow="Resorts" title="Curated stays across iconic destinations." description="Explore a collection of properties shaped by scenery, comfort, and meaningful hospitality." />

          <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by resort or destination"
              className="w-full rounded-full border border-[#d8cfbf] bg-white px-5 py-3 text-sm text-midnight outline-none placeholder:text-midnight/50 md:max-w-md"
            />
            <div className="flex flex-wrap gap-2">
              {filters.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setFilter(item)}
                  className={`rounded-full px-4 py-2 text-xs uppercase tracking-[0.18em] transition ${filter === item ? 'bg-midnight text-white' : 'border border-[#d8cfbf] bg-white text-midnight'}`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {visibleResorts.length === 0 ? (
            <div className="rounded-[2rem] border border-dashed border-[#d8cfbf] bg-white px-6 py-12 text-center">
              <h3 className="font-display text-4xl text-midnight">No resorts match your search.</h3>
              <button type="button" onClick={() => { setSearch(''); setFilter('All') }} className="mt-6 rounded-full bg-midnight px-5 py-3 text-sm uppercase tracking-[0.18em] text-white">
                Clear filters
              </button>
            </div>
          ) : (
            <div className="grid gap-8 lg:grid-cols-2">
              {visibleResorts.map((resort) => (
                <ResortCard key={resort.slug} resort={resort} />
              ))}
            </div>
          )}
        </div>
      </section>
    </PageTransition>
  )
}
