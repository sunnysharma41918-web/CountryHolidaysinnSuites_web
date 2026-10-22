import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { brand } from '../../data/brand'
import SectionHeading from '../ui/SectionHeading'
import ImageReveal from '../ui/ImageReveal'

export default function BrandStorySection() {
  return (
    <section className="py-24 bg-[#f9f4ee]">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-2 lg:px-12">
        <div className="flex flex-col justify-center">
          <SectionHeading eyebrow="Our story" title="Hospitality with a sense of place." description={brand.description} />
          <p className="mb-8 max-w-xl text-base leading-8 text-charcoal/80">
            We design every stay around the spirit of the destination — thoughtful details, warm service, and spaces that feel both elevated and deeply comfortable.
          </p>
          <Link to="/about" className="inline-flex items-center gap-2 text-sm uppercase tracking-[0.2em] text-midnight hover:text-gold">
            Learn more <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <ImageReveal
          src="https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80"
          alt="Luxury resort lounge"
          className="h-[520px] w-full"
        />
      </div>
    </section>
  )
}
