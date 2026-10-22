import * as Icons from 'lucide-react'

export default function AmenityItem({ amenity }) {
  const Icon = Icons[amenity.icon] || Icons.Star

  return (
    <div className="rounded-[1.4rem] border border-[#e5dcc5] bg-[#fffdf9] p-5 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-soft">
      <div className="mb-4 inline-flex rounded-full bg-[#efe1bf] p-3 text-midnight">
        <Icon className="h-5 w-5" />
      </div>
      <p className="text-base font-medium text-midnight">{amenity.name}</p>
    </div>
  )
}
