import { amenities } from '../../data/amenities'
import AmenityItem from '../ui/AmenityItem'
import SectionHeading from '../ui/SectionHeading'

export default function AmenitiesSection() {
  return (
    <section className="bg-[#f5f0e7] py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <SectionHeading eyebrow="Amenities" title="Comfort that feels effortless." description="Every property is designed around ease, warmth, and the details that make a getaway feel personal." />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {amenities.map((amenity) => (
            <AmenityItem key={amenity.name} amenity={amenity} />
          ))}
        </div>
      </div>
    </section>
  )
}
