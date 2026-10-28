import { MotionConfig } from 'framer-motion'
import PageTransition from '../components/layout/PageTransition'
import {
  CSS,
  useSmoothScroll,
  HeroSection,
  AboutSection,
  ServicesSection,
  PropertiesSection,
  PlacesSection,
  PartnersSection,
  TestimonialsSection,
  FaqSection,
} from '../components/sections/landing'

export default function LandingPage() {
  useSmoothScroll()

  return (
    <PageTransition>
      <MotionConfig reducedMotion="user">
        <style>{CSS}</style>
        <div className="page-landing lp w-full bg-[#fbfdfa] text-[#0b1f12] [overflow-x:clip] relative">
          <HeroSection />

          {/* Light Glassmorphic canvas with delicate pastel glows & soft grid */}
          <div className="relative isolate overflow-hidden bg-gradient-to-b from-[#fbfdfa] via-[#f3f7f4] to-[#fbfdfa]">
            {/* Subtle light mesh grid with soft fade out at bottom */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(13,74,58,0.025)_1px,transparent_1px),linear-gradient(to_bottom,rgba(13,74,58,0.025)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:linear-gradient(to_bottom,black_85%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_bottom,black_85%,transparent_100%)]"
            />

            {/* Soft Ambient Pastel Glows for Glass Refraction */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -top-24 left-1/4 h-[600px] w-[600px] rounded-full bg-emerald-200/35 blur-[130px]"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute top-1/4 -right-20 h-[650px] w-[650px] rounded-full bg-[#fbd75b]/20 blur-[140px]"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute top-2/4 -left-20 h-[700px] w-[700px] rounded-full bg-emerald-100/40 blur-[140px]"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute bottom-1/4 right-1/4 h-[600px] w-[600px] rounded-full bg-teal-100/35 blur-[130px]"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute bottom-10 left-10 h-[500px] w-[500px] rounded-full bg-[#fbd75b]/15 blur-[120px]"
            />

            <div className="relative z-10">
              <AboutSection />
              <ServicesSection />
              <PropertiesSection />
              <PlacesSection />
              <PartnersSection />
              <TestimonialsSection />
              <FaqSection />
            </div>
          </div>
        </div>
      </MotionConfig>
    </PageTransition>
  )
}