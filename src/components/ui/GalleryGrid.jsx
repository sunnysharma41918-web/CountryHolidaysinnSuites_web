export default function GalleryGrid({ images }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {images.map((image, index) => (
        <div
          key={image}
          className={`overflow-hidden rounded-[1.8rem] ${index % 2 === 0 ? 'lg:translate-y-10' : ''}`}
        >
          <img src={image} alt="Hospitality gallery" className="h-72 w-full object-cover transition duration-700 hover:scale-105" />
        </div>
      ))}
    </div>
  )
}
