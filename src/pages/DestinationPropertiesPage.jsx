import { ArrowLeft, ArrowUpRight, MapPin } from 'lucide-react'
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
      <section className="bg-[#efeae0] pb-20 pt-28 text-[#0d0d0c] sm:pb-28">
        <div className="mx-auto max-w-[1600px] px-5 sm:px-8 lg:px-12">
          <Link
            to="/destinations"
            className="mb-7 inline-flex items-center gap-2 text-sm font-medium text-[#0d0d0c] transition hover:text-[#d9361b]"
          >
            <ArrowLeft className="h-4 w-4" />
            All destinations
          </Link>

          <div className="relative isolate flex min-h-[430px] items-end overflow-hidden rounded-[1.5rem] bg-[#0d0d0c] sm:min-h-[540px] sm:rounded-[2rem] lg:min-h-[600px]">
            <img
              src={destination.image}
              alt={destination.name}
              className="absolute inset-0 -z-10 h-full w-full object-cover"
            />
            <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-r from-[#0d0d0c]/70 via-[#0d0d0c]/20 to-transparent" />
            <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-t from-[#0d0d0c]/80 via-transparent to-[#0d0d0c]/10" />
            <div className="relative z-10 w-full p-6 text-white sm:p-10 lg:p-14">
              <div className="max-w-3xl">
                <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#ff765d]">
                  <span className="h-2 w-2 rounded-full bg-[#ff5938]" />
                  Destination guide
                </p>
                <h1 className="mt-4 font-display text-5xl leading-[0.92] sm:text-7xl lg:text-8xl">
                  {destination.name}
                </h1>
                <p className="mt-4 flex items-center gap-2 text-sm text-white/80 sm:text-base">
                  <MapPin className="h-4 w-4 text-[#ff5938]" />
                  {destination.region || destination.name}
                </p>
                <p className="mt-5 max-w-xl text-sm leading-7 text-white/80 sm:text-base">
                  {destination.description}
                </p>
                <a
                  href="#destination-stays"
                  className="mt-7 inline-flex items-center gap-3 rounded-full bg-[#efeae0] py-1.5 pl-5 pr-1.5 text-sm font-semibold text-[#0d0d0c] transition-colors hover:bg-[#ff5938] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ff5938] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0d0d0c]"
                >
                  Explore stays
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-[#0d0d0c] text-white">
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </a>
              </div>
            </div>
          </div>

          <div className="grid gap-8 py-16 sm:py-20 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-7">
              <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#d9361b]">
                <span className="h-2 w-2 rounded-full bg-[#ff5938]" />
                Get to know the destination
              </p>
              <h2 className="mt-4 max-w-3xl font-sans text-3xl font-semibold uppercase leading-[0.95] tracking-[-0.055em] sm:text-5xl">
                Find your own way to <span className="text-[#d9361b]">{destination.name}.</span>
              </h2>
              <p className="mt-6 max-w-2xl text-base leading-8 text-[#0d0d0c]/70">
                {destination.knowYourDestination || destination.description}
              </p>
            </div>
            <aside className="flex flex-col justify-between gap-6 rounded-[1.5rem] border border-[#0d0d0c]/10 bg-white/65 p-6 sm:p-8 lg:col-span-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#d9361b]">Your stay</p>
                <p className="mt-3 font-display text-3xl text-[#0d0d0c]">
                  {destinationResorts.length
                    ? `${destinationResorts.length} ${destinationResorts.length === 1 ? 'stay' : 'stays'} to explore`
                    : 'A stay worth looking forward to'}
                </p>
                <p className="mt-3 text-sm leading-7 text-[#0d0d0c]/65">
                  {destinationResorts.length
                    ? `Explore places to stay in ${destination.name} and find the right base for your trip.`
                    : `We’re preparing property details for ${destination.name}. Check back soon for places to stay.`}
                </p>
              </div>
              <Link
                to="/destinations"
                className="inline-flex w-fit items-center gap-2 text-sm font-semibold text-[#0d0d0c] transition hover:text-[#d9361b]"
              >
                Browse other destinations
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </aside>
          </div>

          <div id="destination-stays" className="scroll-mt-28 border-t border-[#0d0d0c]/15 pt-8">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#d9361b]">
                  Places to stay
                </p>
                <h2 className="mt-3 font-sans text-3xl font-semibold uppercase leading-[0.95] tracking-[-0.055em] sm:text-5xl">
                  Stay awhile in {destination.name}.
                </h2>
              </div>
              <p className="max-w-md text-sm leading-7 text-[#0d0d0c]/65">
                Browse available properties and open a stay for its highlights, amenities, and location details.
              </p>
            </div>
          {destinationResorts.length ? (
            <div className="mt-9 grid gap-7 lg:grid-cols-2">
              {destinationResorts.map((resort) => (
                <ResortCard key={resort.slug} resort={resort} />
              ))}
            </div>
          ) : (
            <div className="mt-9 rounded-[1.5rem] border border-dashed border-[#0d0d0c]/20 bg-white/55 px-6 py-12 text-center sm:py-16">
              <h3 className="font-display text-3xl text-[#0d0d0c]">
                Property listings are coming soon
              </h3>
              <p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-[#0d0d0c]/65">
                We are preparing local demo listings for {destination.name}. Check back soon to
                explore available stays.
              </p>
            </div>
          )}
          </div>
        </div>
      </section>
    </PageTransition>
  )
}
