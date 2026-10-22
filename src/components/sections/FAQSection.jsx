import { faqs } from '../../data/faqs'
import Accordion from '../ui/Accordion'
import SectionHeading from '../ui/SectionHeading'

export default function FAQSection() {
  return (
    <section className="bg-[#f8f4ee] py-24">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:px-12">
        <SectionHeading eyebrow="FAQ" title="Questions guests often ask." description="Clear information to help travelers plan a comfortable stay and a thoughtful trip." />
        <Accordion items={faqs} />
      </div>
    </section>
  )
}
