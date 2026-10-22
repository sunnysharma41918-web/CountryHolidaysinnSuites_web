import Button from '../ui/Button'

export default function CTASection() {
  return (
    <section className="relative overflow-hidden bg-[#0d201b] py-24 text-white">
      <div className="absolute inset-0 opacity-80">
        <img
          src="https://images.unsplash.com/photo-1493558103817-58b2924bce98?auto=format&fit=crop&w=1600&q=80"
          alt="Beach resort"
          className="h-full w-full object-cover"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-[#0d201b]/90 via-[#0d201b]/70 to-[#0d201b]/40" />
      <div className="relative mx-auto max-w-5xl px-5 text-center sm:px-8 lg:px-12">
        <p className="text-xs uppercase tracking-[0.35em] text-gold">Your next chapter</p>
        <h2 className="mt-6 font-display text-5xl leading-none sm:text-6xl">Find the escape that fits your pace.</h2>
        <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-white/75">
          Discover beautifully considered stays designed for rest, connection, and memorable moments.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Button to="/resorts">Explore resorts</Button>
          <Button to="/contact" variant="secondary">Plan a getaway</Button>
        </div>
      </div>
    </section>
  )
}
