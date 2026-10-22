import { resorts } from '../../../data/resorts'
import ResortCard from '../../ui/ResortCard'
import { RESORT_COLLECTION_ID } from './content'

export default function ResortCollectionSection() {
  return (
    <section
      id={RESORT_COLLECTION_ID}
      className="scroll-mt-24 bg-[#f8f4ee] py-16 sm:py-20"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <div className="mb-10">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
            Explore our collection
          </p>
          <h2 className="mt-2 font-display text-4xl text-midnight sm:text-5xl">
            Featured resorts
          </h2>
        </div>
        <div className="grid gap-8 lg:grid-cols-2">
          {resorts.map((resort) => (
            <ResortCard key={resort.slug} resort={resort} />
          ))}
        </div>
      </div>
    </section>
  )
}
