import { ArrowLeft } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import PageTransition from '../components/layout/PageTransition'
import DestinationCard from '../components/ui/DestinationCard'
import SectionHeading from '../components/ui/SectionHeading'
import { destinationMenuGroups, getDestinationBySlug } from '../data/destinations'

export default function DestinationCategoryPage() {
  const { category } = useParams()
  const group = destinationMenuGroups.find((item) => item.slug === category)
  const categoryDestinations = group
    ? group.destinations.map(getDestinationBySlug).filter(Boolean)
    : []

  if (!group) {
    return (
      <PageTransition>
        <section className="bg-[#f9f4ee] py-32">
          <div className="mx-auto max-w-4xl px-5 text-center sm:px-8">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold">
              Destinations
            </p>
            <h1 className="mt-3 font-display text-5xl text-midnight">Category not found</h1>
            <Link
              to="/destinations"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-midnight px-6 py-3 text-sm uppercase tracking-[0.16em] text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              All destinations
            </Link>
          </div>
        </section>
      </PageTransition>
    )
  }

  return (
    <PageTransition>
      <section className="bg-[#f9f4ee] py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
          <Link
            to="/destinations"
            className="mb-7 inline-flex items-center gap-2 text-sm font-medium text-midnight transition hover:text-gold"
          >
            <ArrowLeft className="h-4 w-4" />
            All destinations
          </Link>
          <SectionHeading
            eyebrow={`${categoryDestinations.length} destinations`}
            title={group.label}
            description={`Explore every destination available in ${group.label} and choose a place to start planning your stay.`}
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {categoryDestinations.map((destination) => (
              <DestinationCard key={destination.slug} destination={destination} />
            ))}
          </div>
        </div>
      </section>
    </PageTransition>
  )
}
