export default function ImageCollage({ images = [] }) {
  if (images.length === 0) {
    return (
      <div className="relative h-full min-h-[22rem] overflow-hidden rounded-[2rem] bg-gradient-to-br from-midnight via-midnight/90 to-[#d8cfbf]">
        <div className="absolute -right-10 -top-10 h-56 w-56 rounded-full border border-white/20" />
        <div className="absolute -bottom-16 -left-10 h-72 w-72 rounded-full border border-white/15" />
        <p className="absolute bottom-6 left-6 max-w-[14rem] font-display text-3xl leading-tight text-white/90">
          Stays shaped by scenery and comfort.
        </p>
      </div>
    )
  }

  const [main, second, third] = images

  return (
    <div className="grid h-full min-h-[22rem] grid-cols-5 gap-3">
      <div className="col-span-3 overflow-hidden rounded-[2rem]">
        <img
          src={main}
          alt="CHIS resort"
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-[1200ms] hover:scale-105 motion-reduce:transition-none"
        />
      </div>
      <div className="col-span-2 grid grid-rows-2 gap-3">
        {[second, third].map((src, index) =>
          src ? (
            <div key={src} className="overflow-hidden rounded-[1.5rem]">
              <img
                src={src}
                alt="CHIS resort"
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-[1200ms] hover:scale-105 motion-reduce:transition-none"
              />
            </div>
          ) : (
            <div key={`empty-${index}`} className="rounded-[1.5rem] bg-[#e7dfd0]" />
          )
        )}
      </div>
    </div>
  )
}
