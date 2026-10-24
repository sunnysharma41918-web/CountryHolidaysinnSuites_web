import PageTransition from '../components/layout/PageTransition'
import SectionHeading from '../components/ui/SectionHeading'
import DestinationCard from '../components/ui/DestinationCard'
import { destinations } from '../data/destinations'

export default function DestinationsPage() {
  return (
    <PageTransition>
      <section className="bg-[#f9f4ee] pt-28 pb-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-12">
          <SectionHeading eyebrow="Destinations" title="A place for every kind of escape." description="Choose a destination to explore its available properties and plan your next stay." />
          <div className="mt-8 sm:mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {destinations.map((destination) => (
              <DestinationCard key={destination.slug} destination={destination} />
            ))}
          </div>
        </div>
      </section>
    </PageTransition>
  )
}
