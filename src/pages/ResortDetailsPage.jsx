import { ArrowLeft, Check, MapPin, Star } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { getResortBySlug, resorts } from '../data/resorts'
import { destinations } from '../data/destinations'
import PageTransition from '../components/layout/PageTransition'
import ResortCard from '../components/ui/ResortCard'

export default function ResortDetailsPage() {
  const { slug } = useParams()
  const resort = getResortBySlug(slug)

  if (!resort) {
    return (
      <PageTransition>
        <section className="bg-[#f8f4ee] py-24">
          <div className="mx-auto max-w-4xl px-5 text-center sm:px-8 lg:px-12">
            <h1 className="font-display text-6xl text-midnight">Property not found</h1>
            <p className="mt-5 text-base text-charcoal/75">
              The property you’re looking for isn’t available in our current collection.
            </p>
            <Link
              to="/resorts"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-midnight px-6 py-3 text-sm uppercase tracking-[0.2em] text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Browse properties
            </Link>
          </div>
        </section>
      </PageTransition>
    )
  }

  const destinationResorts = resorts.filter(
    (item) => item.destination === resort.destination && item.slug !== resort.slug
  )
  const mapQuery = resort.mapQuery || resort.location
  const destinationDescription =
    resort.destinationDescription ||
    `Discover the character, scenery, and local experiences that make ${resort.destination} a memorable place to stay.`
  const highlights = resort.highlights || resort.amenities.slice(0, 4)
  const destination = destinations.find(
    (item) => item.resortDestination === resort.destination
  )
  const destinationPath = destination ? `/destinations/${destination.slug}` : '/destinations'

  return (
    <PageTransition>
      <section className="bg-[#f8f4ee] pb-20 pt-28 sm:pb-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
          <Link
            to={destinationPath}
            className="mb-7 inline-flex items-center gap-2 text-sm font-medium text-midnight transition hover:text-gold"
          >
            <ArrowLeft className="h-4 w-4" />
            All properties in {resort.destination}
          </Link>

          <div className="relative overflow-hidden rounded-[2rem] border border-[#e8dfcf] bg-white shadow-soft">
            <img
              src={resort.image}
              alt={resort.name}
              className="h-[340px] w-full object-cover sm:h-[500px]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6 text-white sm:p-10">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#ff5938]">
                Featured property
              </p>
              <h1 className="mt-2 max-w-4xl font-display text-4xl sm:text-6xl">{resort.name}</h1>
              <p className="mt-3 flex items-center gap-2 text-sm text-white/85">
                <MapPin className="h-4 w-4 text-[#ff5938]" />
                {resort.location}
              </p>
            </div>
          </div>

          <div className="mt-10 grid gap-10 lg:grid-cols-[1.15fr_0.85fr]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
                About the property
              </p>
              <p className="mt-4 max-w-3xl text-base leading-8 text-charcoal/80">
                {resort.description}
              </p>

              <section className="mt-10" aria-labelledby="property-highlights">
                <h2 id="property-highlights" className="font-display text-3xl text-midnight sm:text-4xl">
                  Property Highlights
                </h2>
                <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                  {highlights.map((highlight) => (
                    <li
                      key={highlight}
                      className="flex items-start gap-3 rounded-2xl border border-[#e8dfcf] bg-white p-4 text-sm leading-6 text-charcoal/80"
                    >
                      <Check className="mt-1 h-4 w-4 shrink-0 text-gold" />
                      {highlight}
                    </li>
                  ))}
                </ul>
              </section>

              <section className="mt-10 rounded-[1.8rem] bg-white p-6 sm:p-8" aria-labelledby="destination-guide">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
                  Destination guide
                </p>
                <h2 id="destination-guide" className="mt-2 font-display text-3xl text-midnight sm:text-4xl">
                  Know Your Destination
                </h2>
                <p className="mt-4 text-sm leading-7 text-charcoal/75">{destinationDescription}</p>
                <p className="mt-3 text-sm leading-7 text-charcoal/75">
                  {resort.knowYourDestination ||
                    `Ask our team for help choosing the best season and experiences for your stay in ${resort.destination}.`}
                </p>
              </section>
            </div>

            <aside className="h-fit rounded-[1.8rem] border border-[#e6ddce] bg-[#fffdf8] p-6 shadow-sm sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8a7f68]">
                Your destination
              </p>
              <p className="mt-2 font-display text-4xl text-midnight">{resort.destination}</p>
              <div className="mt-5 flex items-start gap-3 text-sm leading-6 text-charcoal/75">
                <MapPin className="mt-1 h-4 w-4 shrink-0 text-gold" />
                {resort.location}
              </div>
              <div className="mt-5 flex items-center gap-2 text-sm text-charcoal/75">
                <Star className="h-4 w-4 text-gold" />
                Signature hospitality experience
              </div>
              <Link
                to="/contact"
                className="mt-8 inline-flex w-full items-center justify-center rounded-full bg-gold px-6 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-midnight transition hover:bg-[#e84a28] hover:text-white"
              >
                Plan my stay
              </Link>
            </aside>
          </div>

          <section className="mt-12" aria-labelledby="property-amenities">
            <h2 id="property-amenities" className="font-display text-3xl text-midnight sm:text-4xl">
              Amenities
            </h2>
            <div className="mt-5 flex flex-wrap gap-3">
              {resort.amenities.map((amenity) => (
                <span
                  key={amenity}
                  className="rounded-full border border-[#d8cfbf] bg-white px-4 py-2 text-xs font-medium text-midnight"
                >
                  {amenity}
                </span>
              ))}
            </div>
          </section>

          <section className="mt-12" aria-labelledby="property-location">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">Find us</p>
            <h2 id="property-location" className="mt-2 font-display text-3xl text-midnight sm:text-4xl">
              Location
            </h2>
            <p className="mt-3 flex items-start gap-2 text-sm leading-6 text-charcoal/75">
              <MapPin className="mt-1 h-4 w-4 shrink-0 text-gold" />
              {resort.location}
            </p>
            <div className="mt-5 overflow-hidden rounded-[1.8rem] border border-[#e8dfcf] bg-white">
              <iframe
                title={`Map showing ${resort.name}`}
                src={`https://www.google.com/maps?q=${encodeURIComponent(mapQuery)}&output=embed`}
                className="h-[320px] w-full sm:h-[420px]"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </section>

          <section className="mt-14" aria-labelledby="related-properties">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
              Keep exploring
            </p>
            <h2 id="related-properties" className="mt-2 font-display text-3xl text-midnight sm:text-4xl">
              Related Properties
            </h2>
            {destinationResorts.length ? (
              <div className="mt-7 grid gap-7 lg:grid-cols-2">
                {destinationResorts.map((relatedResort) => (
                  <ResortCard key={relatedResort.slug} resort={relatedResort} />
                ))}
              </div>
            ) : (
              <p className="mt-4 text-sm leading-7 text-charcoal/75">
                More stays in {resort.destination} will be added to this collection soon.
              </p>
            )}
          </section>
        </div>
      </section>
    </PageTransition>
  )
}
