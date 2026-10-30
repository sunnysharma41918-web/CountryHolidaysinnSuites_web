import { MotionConfig } from 'framer-motion'
import PageTransition from '../components/layout/PageTransition'
import travelMapDoodlesGreen from '../assets/travel-map-doodles-green.png'
import {
  CSS,
  useSmoothScroll,
  HeroSection,
  AboutSection,
  ServicesSection,
  PropertiesSection,
  OffersSection,
  PlacesSection,
  PartnersSection,
  TestimonialsSection,
  FaqSection,
  FlightTrailConnector,
} from '../components/sections/landing'

export default function LandingPage() {
  useSmoothScroll()

  return (
    <PageTransition>
      <MotionConfig reducedMotion="user">
        <style>{CSS}</style>
        <div className="page-landing lp w-full bg-[#fbfdfa] text-[#0b1f12] [overflow-x:clip] relative">
          <HeroSection />

          {/* Light Glassmorphic canvas with GPU-optimized ambient glows */}
          <div className="relative isolate [overflow-x:clip] bg-gradient-to-b from-[#fbfdfa] via-[#f3f7f4] to-[#fbfdfa]">
            {/* Travel doodle sketch elements (clean GPU rasterization, no heavy multi-pass filter) */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 z-0 bg-repeat opacity-[0.07] [mask-image:linear-gradient(to_bottom,black_94%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_bottom,black_94%,transparent_100%)]"
              style={{
                backgroundImage: `url(${travelMapDoodlesGreen})`,
                backgroundSize: '460px auto',
              }}
            />

            {/* Subtle light mesh grid with soft fade out at bottom */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(13,74,58,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(13,74,58,0.02)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:linear-gradient(to_bottom,black_85%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_bottom,black_85%,transparent_100%)]"
            />

            {/* Ambient soft glow orbs (GPU hardware accelerated with translateZ) */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute top-[8%] left-1/4 h-[550px] w-[550px] rounded-full bg-emerald-200/25 blur-[120px] will-change-transform [transform:translateZ(0)]"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute top-[24%] -right-20 h-[600px] w-[600px] rounded-full bg-[#fbd75b]/18 blur-[130px] will-change-transform [transform:translateZ(0)]"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute top-[44%] -left-20 h-[650px] w-[650px] rounded-full bg-[#0d4a3a]/10 blur-[140px] will-change-transform [transform:translateZ(0)]"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute top-[65%] right-1/4 h-[600px] w-[600px] rounded-full bg-[#297f33]/12 blur-[130px] will-change-transform [transform:translateZ(0)]"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute bottom-[15%] left-10 h-[550px] w-[550px] rounded-full bg-[#fbd75b]/16 blur-[120px] will-change-transform [transform:translateZ(0)]"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute bottom-10 right-10 h-[480px] w-[480px] rounded-full bg-emerald-100/25 blur-[120px] will-change-transform [transform:translateZ(0)]"
            />

            <div className="relative z-10">
              {/* Flight art line connecting Hero to About section */}
              <FlightTrailConnector variant="ltr" className="pt-2 sm:pt-4 -mb-2 sm:-mb-4" />
              <AboutSection />
              {/* Flight art line connecting About to Services */}
              <FlightTrailConnector variant="rtl" />
              <ServicesSection />
              {/* Flight art line connecting Services to Properties */}
              <FlightTrailConnector variant="ltr" />
              <PropertiesSection />
              {/* Flight art line connecting Properties to Offers */}
              <FlightTrailConnector variant="rtl" />
              <OffersSection />
              {/* Flight art line connecting Offers to Places */}
              <FlightTrailConnector variant="ltr" />
              <PlacesSection />
              {/* Flight art line connecting Places to Major Partners */}
              <FlightTrailConnector variant="rtl" />
              <PartnersSection />
              {/* Flight art line connecting Partners to Testimonials */}
              <FlightTrailConnector variant="ltr" />
              <TestimonialsSection />
              {/* Flight art line connecting Testimonials to FAQ */}
              <FlightTrailConnector variant="rtl" />
              <FaqSection />
            </div>
          </div>
        </div>
      </MotionConfig>
    </PageTransition>
  )
}
