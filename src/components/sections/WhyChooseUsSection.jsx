import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import SectionHeading from '../ui/SectionHeading'

export default function WhyChooseUsSection() {
  return (
    <section className="bg-[#0f201d] py-24 text-white">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:px-12">
        <div className="flex flex-col justify-center">
          <SectionHeading eyebrow="Why choose us" title="A destination-first philosophy." description="We believe thoughtful stays should feel personal, seamless, and inspiring from arrival to departure." />
          <ul className="mt-8 space-y-5 text-white/75">
            <li>• Elevated spaces with warm, character-rich interiors.</li>
            <li>• Personalized service shaped around each guest’s pace.</li>
            <li>• Destination-driven experiences that celebrate local beauty.</li>
            <li>• Familiar comfort blended with refined design details.</li>
          </ul>
          <Link to="/about" className="mt-8 inline-flex items-center gap-2 text-sm uppercase tracking-[0.2em] text-gold">
            Discover the brand <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="overflow-hidden rounded-[2rem] border border-white/10">
          <img
            src="https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80"
            alt="Luxury hotel interior"
            className="h-full min-h-[500px] w-full object-cover"
          />
        </div>
      </div>
    </section>
  )
}
