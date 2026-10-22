export default function SectionHeading({ eyebrow, title, description, align = 'left' }) {
  return (
    <div className={`mb-12 max-w-2xl ${align === 'center' ? 'mx-auto text-center' : ''}`}>
      <p className="mb-3 text-xs font-medium uppercase tracking-[0.25em] text-gold">{eyebrow}</p>
      <h2 className="font-display text-4xl leading-none text-midnight sm:text-5xl">{title}</h2>
      {description && <p className="mt-5 text-base leading-7 text-charcoal/80">{description}</p>}
    </div>
  )
}
