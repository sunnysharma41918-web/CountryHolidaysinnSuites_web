import { statistics } from '../../data/statistics'
import AnimatedCounter from '../ui/AnimatedCounter'

export default function StatisticsSection() {
  return (
    <section className="bg-[#f4efe9] py-20">
      <div className="mx-auto grid max-w-7xl gap-8 px-5 sm:px-8 md:grid-cols-3 lg:px-12">
        {statistics.map((stat) => (
          <div key={stat.label} className="rounded-[1.7rem] border border-[#e0d8ca] bg-[#fffdf9] p-8 shadow-sm">
            <AnimatedCounter value={stat.value} suffix={stat.suffix} label={stat.label} />
          </div>
        ))}
      </div>
    </section>
  )
}
