import { useState, useEffect } from 'react'
import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { api } from '../../services/api'
import { resorts } from '../../data/resorts'
import ResortCard from '../ui/ResortCard'
import SectionHeading from '../ui/SectionHeading'

export default function FeaturedResortsSection() {
  const [featuredResorts, setFeaturedResorts] = useState(() => resorts.filter((r) => r.featured))

  useEffect(() => {
    let mounted = true
    const loadFeatured = async () => {
      try {
        const res = await api.getProperties({ featured: 'true' })
        if (mounted && res && res.properties && res.properties.length > 0) {
          setFeaturedResorts(res.properties)
        }
      } catch (err) {
        console.warn('Using baseline featured resorts:', err)
      }
    }
    loadFeatured()
    return () => {
      mounted = false
    }
  }, [])

  return (
    <section className="bg-[#f3efe7] py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            eyebrow="Featured stays"
            title="Beautiful places to linger."
            description="Curated destinations chosen for design, comfort, scenery, and slow travel."
          />
          <Link
            to="/resorts"
            className="inline-flex items-center gap-2 text-sm uppercase tracking-[0.2em] text-midnight transition hover:text-gold"
          >
            View all resorts <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid gap-8 lg:grid-cols-2">
          {featuredResorts.map((resort) => (
            <ResortCard key={resort.slug || resort._id || resort.id} resort={resort} />
          ))}
        </div>
      </div>
    </section>
  )
}
