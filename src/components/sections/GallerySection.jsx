import { gallery } from '../../data/gallery'
import GalleryGrid from '../ui/GalleryGrid'
import SectionHeading from '../ui/SectionHeading'

export default function GallerySection() {
  return (
    <section className="py-24 bg-[#fffdf8]">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <SectionHeading eyebrow="Gallery" title="The details that stay with you." description="A visual diary of quiet luxury, warm textures, and destination-driven design." align="center" />
        <div className="mt-12">
          <GalleryGrid images={gallery} />
        </div>
      </div>
    </section>
  )
}
