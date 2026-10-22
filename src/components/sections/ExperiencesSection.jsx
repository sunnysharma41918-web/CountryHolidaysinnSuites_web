import { experiences } from '../../data/experiences'
import ExperienceCard from '../ui/ExperienceCard'
import SectionHeading from '../ui/SectionHeading'

export default function ExperiencesSection() {
  return (
    <section className="bg-[#102720] py-24 text-white">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <SectionHeading eyebrow="Experiences" title="Every stay is a story worth returning to." description="Thoughtful escapes designed around comfort, connection, and time well spent." />
        <div className="mt-12 grid gap-8 md:grid-cols-2 xl:grid-cols-4">
          {experiences.map((experience) => (
            <ExperienceCard key={experience.title} experience={experience} />
          ))}
        </div>
      </div>
    </section>
  )
}
