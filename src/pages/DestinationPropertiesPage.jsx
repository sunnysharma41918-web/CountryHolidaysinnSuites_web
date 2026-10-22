import { ArrowLeft, MapPin } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import PageTransition from '../components/layout/PageTransition'
import ResortCard from '../components/ui/ResortCard'
import { getDestinationBySlug } from '../data/destinations'
import { resorts } from '../data/resorts'

export default function DestinationPropertiesPage() {
  const { slug } = useParams()
  const destination = getDestinationBySlug(slug)
  const destinationResorts = destination
    ? resorts.filter((resort) => resort.destination === destination.resortDestination)
    : []

  if (!destination) {
    return (
      <PageTransition>
        <section className="bg-[#f8f4ee] py-32">
          <div className="mx-auto max-w-4xl px-5 text-center sm:px-8">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold">Destination</p>
            <h1 className="mt-3 font-display text-5xl text-midnight">Destination not found</h1>
            <Link
              to="/destinations"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-midnight px-6 py-3 text-sm uppercase tracking-[0.16em] text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Browse destinations
            </Link>
          </div>
        </section>
      </PageTransition>
    )
  }

  return (
    <PageTransition>
      <section className="bg-[#f8f4ee] pb-20 pt-28 sm:pb-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
          <Link
            to="/destinations"
            className="mb-7 inline-flex items-center gap-2 text-sm font-medium text-midnight transition hover:text-gold"
          >
            <ArrowLeft className="h-4 w-4" />
            All destinations
          </Link>

          <div className="relative min-h-[320px] overflow-hidden rounded-[2rem] sm:min-h-[440px]">
            <img
              src={destination.image}
              alt={destination.name}
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/25 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6 text-white sm:p-10">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#ff5938]">
                Destination guide
              </p>
              <h1 className="mt-2 font-display text-5xl sm:text-7xl">{destination.name}</h1>
              <p className="mt-3 flex items-center gap-2 text-sm text-white/80">
                <MapPin className="h-4 w-4 text-[#ff5938]" />
                {destination.region || destination.name}
              </p>
            </div>
          </div>

          <div className="mt-12 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
                Places to stay
              </p>
              <h2 className="mt-2 font-display text-4xl text-midnight sm:text-5xl">
                Properties in {destination.name}
              </h2>
            </div>
            <p className="max-w-md text-sm leading-7 text-charcoal/75">
              Browse our handpicked stays and open a property page for highlights, amenities, and
              location details.
            </p>
          </div>

          {destinationResorts.length ? (
            <div className="mt-8 grid gap-7 lg:grid-cols-2">
              {destinationResorts.map((resort) => (
                <ResortCard key={resort.slug} resort={resort} />
              ))}
            </div>
          ) : (
            <div className="mt-8 rounded-[1.8rem] border border-dashed border-[#d8cfbf] bg-white px-6 py-12 text-center">
              <h3 className="font-display text-3xl text-midnight">
                Property listings are coming soon
              </h3>
              <p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-charcoal/75">
                We are preparing local demo listings for {destination.name}. Check back soon to
                explore available stays.
              </p>
            </div>
          )}
        </div>
      </section>
    </PageTransition>
  )
}
