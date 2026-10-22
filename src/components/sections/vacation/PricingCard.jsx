import { formatINR, openEnquiry } from './content'

export default function PricingCard({ plan }) {
  return (
    <article className="group flex h-full flex-col rounded-[2rem] border border-[#d8cfbf] bg-white p-7 shadow-sm transition-all duration-500 hover:-translate-y-1.5 hover:border-midnight/40 hover:shadow-xl motion-reduce:transition-none motion-reduce:hover:translate-y-0">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-midnight">
            {plan.category} · {plan.categoryName}
          </p>
          <p className="mt-1 text-sm text-midnight/60">{plan.occupancy}</p>
        </div>
        <span className="flex-shrink-0 rounded-full bg-[#f8f4ee] px-3 py-1 text-xs font-medium text-midnight">
          {plan.years} years
        </span>
      </div>

      <div className="mt-8">
        <p className="font-display text-5xl leading-none text-midnight">{formatINR(plan.price)}</p>
        <p className="mt-3 text-sm text-midnight/70">
          Annual ASF <span className="font-medium text-midnight">{formatINR(plan.asf)}</span>
        </p>
      </div>

      <ul className="mt-6 space-y-2 border-t border-[#eadfc8] pt-5 text-sm text-midnight/75">
        <li>6N/7D stays across 500+ destinations</li>
        <li>24-month EMI facility advertised</li>
      </ul>

      <p className="mt-5 rounded-xl border border-dashed border-[#d8cfbf] bg-[#f8f4ee] px-3 py-2 text-xs leading-5 text-midnight/70">
        Historical / demo pricing (2021 price list), to be verified.
      </p>

      <button
        type="button"
        onClick={() => openEnquiry(plan)}
        className="mt-6 w-full rounded-full bg-midnight px-5 py-3 text-sm font-medium text-white transition-all duration-300 hover:bg-midnight/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-midnight/40 focus-visible:ring-offset-2 active:scale-[0.98]"
      >
        Enquire Now
      </button>
    </article>
  )
}
