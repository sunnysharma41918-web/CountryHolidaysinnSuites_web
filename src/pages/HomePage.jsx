import PageTransition from '../components/layout/PageTransition'
import HeroSection from '../components/sections/HeroSection'
import AboutSection from '../components/sections/AboutSection'
import MountainClipsSection from '../components/sections/MountainClipsSection'
import LuxurySection from '../components/sections/LuxurySection'
import RecreationSection from '../components/sections/RecreationSection'
import DestinationsSection from '../components/sections/DestinationsSection'
import TripFAQSection from '../components/sections/TripFAQSection'
import TripTestimonialsSection from '../components/sections/TripTestimonialsSection'
import ExclusiveDealsSection from '../components/sections/ExclusiveDealsSection'

export default function HomePage() {
  const handleOpenEstimate = (data) => {
    window.dispatchEvent(
      new CustomEvent('open-booking-modal', {
        detail: data || {},
      })
    )
  }

  const handleSelectPackage = (pkg) => {
    window.dispatchEvent(
      new CustomEvent('open-booking-modal', {
        detail: {
          destination: pkg.title || pkg.name,
          days: pkg.duration || '3 Nights 2 Days',
          persons: '2 Persons',
        },
      })
    )
  }

  return (
    <PageTransition>
      <div className="w-full overflow-hidden">
        {/* 1. Hero Section */}
        <HeroSection />

        {/* 2. About Country Holidays InnSuites Section */}
        <AboutSection onOpenEstimate={handleOpenEstimate} />

        {/* 3. Mountain Clips Section */}
        <MountainClipsSection onSelectPackage={handleSelectPackage} />

        {/* 4. Luxury Welcome Section */}
        <LuxurySection onSelectPackage={handleSelectPackage} />

        {/* 5. Featured Destinations */}
        <DestinationsSection />

        {/* 6. Popular Places For Recreation Section */}
        <RecreationSection onBookTrip={handleSelectPackage} />

        {/* 7. Frequently Asked Questions Section */}
        <TripFAQSection />

        {/* 8. People Speak About Us Testimonials */}
        <TripTestimonialsSection />

        {/* 9. Exclusive Deals Newsletter CTA */}
        <ExclusiveDealsSection />
      </div>
    </PageTransition>
  )
}
