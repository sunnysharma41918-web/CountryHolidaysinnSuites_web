import { useEffect } from 'react'
import Lenis from 'lenis'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import PageTransition from '../components/layout/PageTransition'
import VacationHeroSection from '../components/sections/vacation/VacationHeroSection'
import MembershipPricingSection from '../components/sections/vacation/MembershipPricingSection'
import Membershipabout from '../components/sections/vacation/Membershipabout'
import MemberRoomType from '../components/sections/vacation/MemberRoomType'
import MemberCardSections from '../components/sections/vacation/MemberCardSections'
import { setVacationLenis } from '../components/sections/vacation/content'


export default function VacationPackagesPage() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined

    const lenis = new Lenis({
      allowNestedScroll: true,
      lerp: 0.1,
      smoothWheel: true,
    })
    let animationFrameId

    const updateScrollTrigger = () => ScrollTrigger.update()
    const animateScroll = (time) => {
      lenis.raf(time)
      animationFrameId = window.requestAnimationFrame(animateScroll)
    }

    setVacationLenis(lenis)
    lenis.on('scroll', updateScrollTrigger)
    animationFrameId = window.requestAnimationFrame(animateScroll)

    return () => {
      window.cancelAnimationFrame(animationFrameId)
      lenis.off('scroll', updateScrollTrigger)
      lenis.destroy()
      setVacationLenis(null)
    }
  }, [])

  return (
    <PageTransition>
      <main className="relative isolate min-h-screen overflow-hidden bg-[#efeae0] font-sans text-[#0d0d0c]">
        <VacationHeroSection />
        <Membershipabout />
        <MemberRoomType />
        <MembershipPricingSection />
        <MemberCardSections />
      </main>
    </PageTransition>
  )
}
