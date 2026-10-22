export default function ExperienceCard({ experience }) {
  return (
    <article className="group overflow-hidden rounded-[1.8rem] border border-[#e3dccd] bg-white shadow-soft">
      <div className="overflow-hidden">
        <img src={experience.image} alt={experience.title} className="h-72 w-full object-cover transition duration-700 group-hover:scale-105" />
      </div>
      <div className="space-y-4 p-6">
        <p className="text-xs uppercase tracking-[0.2em] text-[#8a7f68]">Curated experience</p>
        <h3 className="font-display text-3xl text-midnight">{experience.title}</h3>
        <p className="text-sm leading-7 text-charcoal/80">{experience.description}</p>
      </div>
    </article>
  )
}
