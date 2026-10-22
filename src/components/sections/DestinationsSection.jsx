import { destinations } from '../../data/destinations'
import DestinationCard from '../ui/DestinationCard'
import SectionHeading from '../ui/SectionHeading'

export default function DestinationsSection() {
  return (
    <section className="py-24 bg-[#fffdf8]">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <SectionHeading eyebrow="Destinations" title="Moments shaped by the landscape." description="A collection of immersive destinations chosen for their beauty, character, and opportunity to slow down." align="center" />
        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {destinations.map((destination) => (
            <DestinationCard key={destination.slug} destination={destination} />
          ))}
        </div>
      </div>
    </section>
  )
}
