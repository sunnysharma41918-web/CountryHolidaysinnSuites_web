import PageTransition from '../components/layout/PageTransition'
import SectionHeading from '../components/ui/SectionHeading'
import { brand } from '../data/brand'
import { Compass, Award, ShieldCheck, Users } from 'lucide-react'

export default function AboutPage() {
  return (
    <PageTransition>
      <section className="bg-white py-20 sm:py-24">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-2 lg:px-12 items-center">
          <div>
            <span className="text-xs font-bold tracking-widest text-[#ff5938] uppercase">
              About COUNTRY HOLIDAYS INNSUITES
            </span>
            <h1 className="font-display text-3xl sm:text-5xl font-extrabold text-slate-900 uppercase mt-2 tracking-tight">
              Crafting Unforgettable Expeditions
            </h1>
            <p className="mt-5 text-base sm:text-lg text-slate-600 leading-relaxed">
              {brand.description}
            </p>
            <p className="mt-4 text-sm sm:text-base text-slate-500 leading-relaxed">
              Founded by passionate hospitality and travel experts, COUNTRY HOLIDAYS INNSUITES bridges the gap between raw natural exploration and world-class luxury stays. From the Tatra summits of Poland to the serene waters of Piberstein and Hallstatt, we create journeys that stay with you forever.
            </p>

            <div className="grid grid-cols-2 gap-4 mt-8 pt-6 border-t border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#ff5938] flex items-center justify-center shrink-0">
                  <Compass className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900">120+ Routes</h4>
                  <p className="text-xs text-slate-500">Expertly Curated</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#ff5938] flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900">100% Certified</h4>
                  <p className="text-xs text-slate-500">Alpine Guides</p>
                </div>
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-[32px] border border-slate-100 shadow-2xl bg-slate-100 aspect-[4/3]">
            <img
              src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80"
              alt="TripMaker Expedition"
              className="h-full w-full object-cover hover:scale-105 transition-transform duration-700"
            />
          </div>
        </div>
      </section>
    </PageTransition>
  )
}
