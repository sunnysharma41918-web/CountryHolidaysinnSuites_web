export const heroData = {
  headline: 'DISCOVER. EXPLORE. EXPERIENCE.',
  subtitle:
    "Whether you're craving a beach escape, a thrilling mountain track, or a cultural city tour, we've got the perfect getaway for you.",
  heroImage:
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=2000&q=85',
  hikerImage:
    'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?auto=format&fit=crop&w=1200&q=80',
  destinationTag: {
    location: 'Mardi Himal, Austria',
    date: 'March 23, 2025',
  },
  destinations: [
    'Poland, Tatra Mountains',
    'Divčibare, Serbia',
    'Kanisfluh, Austria',
    'Hallstatt, Austria',
    'Dolomites, Italy',
    'Swiss Alps, Switzerland',
  ],
  personOptions: ['1 Person', '2 Persons', '3 - 4 Persons', '5+ Group'],
  daysOptions: ['2 - 3 Days', '3 Nights 2 Days', '5 Nights 4 Days', '7+ Days'],
}

export const mountainClips = [
  {
    id: 'poland-tatra',
    title: 'Poland, Tatra Mountains',
    saves: 17,
    description:
      'Nestled in southern Poland along the border with Slovakia, the Tatra Mountains are the crown jewel of the Carpathian range.',
    duration: '3 Nights 2 Days',
    price: '2500$',
    priceUnit: '/per person',
    thumbnail:
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hikers-reaching-the-top-of-a-mountain-42999-large.mp4',
    isFeatured: false,
    rating: 4.9,
    highlights: ['Alpine Lake Trek', 'Morskie Oko Vista', 'Traditional Highland Cuisine'],
  },
  {
    id: 'divcibare-serbia',
    title: 'Divčibare, Serbia',
    saves: 10,
    description:
      'Nestled in southern Poland along the border with Slovakia, the Tatra Mountains are the crown jewel of the Carpathian range.',
    duration: '3 Nights 2 Days',
    price: '2500$',
    priceUnit: '/per person',
    thumbnail:
      'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=80',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-snowy-mountain-range-under-a-blue-sky-42981-large.mp4',
    isFeatured: true,
    rating: 5.0,
    highlights: ['Snow Ridge Trail', 'Pine Forest Cabins', 'Stargazing Camp'],
  },
  {
    id: 'kanisfluh-austria',
    title: 'Kanisfluh, Austria',
    saves: 15,
    description:
      'Nestled in southern Poland along the border with Slovakia, the Tatra Mountains are the crown jewel of the Carpathian range.',
    duration: '3 Nights 2 Days',
    price: '2500$',
    priceUnit: '/per person',
    thumbnail:
      'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-a-green-mountain-peak-41973-large.mp4',
    isFeatured: false,
    rating: 4.8,
    highlights: ['Limestone Crest Walk', 'Panoramic Sunrise', 'Bregenz Alpine Dairy'],
  },
]

export const luxuryResorts = {
  Austria: {
    country: 'Austria',
    eyebrow: 'Where Every Stay Feels Like a Dream',
    title: 'LUXURY IS READY TO WELCOME YOU.',
    subtitle: 'Escape to a world of serene beauty, luxurious comfort, and unforgettable experiences.',
    resortName: 'Dormio Resort Obertraun',
    location: 'Hallstatt, Austria',
    rating: 5,
    description:
      'Choose your elegant riverside sanctuary, relax in style, and immerse yourself in world-class amenities.',
    mainImage:
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80',
    poolImage:
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=600&q=80',
    aerialImage:
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80',
    hotspots: [
      { name: 'Obertraun Lake Suites', coordinates: '47.5584° N, 13.6896° E' },
      { name: 'Five Fingers Viewing Platform', coordinates: '47.5312° N, 13.7042° E' },
      { name: 'Dachstein Ice Caves', coordinates: '47.5451° N, 13.7122° E' },
    ],
  },
  Poland: {
    country: 'Poland',
    eyebrow: 'Carpathian Elegance & Heritage',
    title: 'ALPINE GRANDEUR IN THE TATRAS.',
    subtitle: 'Indulge in handcrafted wooden architecture, thermo-mineral spas, and pristine panoramic valleys.',
    resortName: 'Aries Hotel & Chalets',
    location: 'Zakopane, Poland',
    rating: 5,
    description:
      'Nestled right at the foot of Giewont Peak with private balconies, indoor stone pools, and gourmet dining.',
    mainImage:
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
    poolImage:
      'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=600&q=80',
    aerialImage:
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=600&q=80',
    hotspots: [
      { name: 'Morskie Oko Private Lodge', coordinates: '49.1972° N, 20.0712° E' },
      { name: 'Kasprowy Wierch Sky Retreat', coordinates: '49.2325° N, 19.9818° E' },
    ],
  },
  Serbia: {
    country: 'Serbia',
    eyebrow: 'Balkan Highlands & Serenity',
    title: 'TIMELESS LUXURY IN DIVČIBARE.',
    subtitle: 'Recharge in pine-scented air, curated wellness sanctuaries, and authentic regional hospitality.',
    resortName: 'Crni Vrh Mountain Resort',
    location: 'Divčibare, Serbia',
    rating: 5,
    description:
      'Surrounded by healing micro-climates, pristine coniferous woods, and signature geothermal wellness pools.',
    mainImage:
      'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1200&q=80',
    poolImage:
      'https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=600&q=80',
    aerialImage:
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=600&q=80',
    hotspots: [
      { name: 'Divčibare Mountain Villas', coordinates: '44.1121° N, 19.9928° E' },
      { name: 'Maljen Summit Chalets', coordinates: '44.0950° N, 20.0034° E' },
    ],
  },
}

export const recreationPlaces = [
  {
    id: 'piberstein-coastal',
    title: 'Piberstein Lake',
    location: 'Western Styria, Austria',
    description:
      'Nestled in western Styria, Piberstein Lake is a popular destination for water sports enthusiasts and nature lovers.',
    duration: '3 Nights 2 Days',
    price: '2500$',
    priceUnit: '/per person',
    image:
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    isFeatured: false,
    category: 'Water Sports',
  },
  {
    id: 'piberstein-alpine',
    title: 'Piberstein Lake',
    location: 'Alpine Reflection Valley',
    description:
      'Nestled in western Styria, Piberstein Lake is a popular destination for water sports enthusiasts and nature lovers.',
    duration: '3 Nights 2 Days',
    price: '2500$',
    priceUnit: '/per person',
    image:
      'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=800&q=80',
    isFeatured: true,
    category: 'Lake Reflection',
  },
  {
    id: 'piberstein-forest',
    title: 'Piberstein Lake',
    location: 'Bregenz Forest Pass',
    description:
      'Nestled in western Styria, Piberstein Lake is a popular destination for water sports enthusiasts and nature lovers.',
    duration: '3 Nights 2 Days',
    price: '2500$',
    priceUnit: '/per person',
    image:
      'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80',
    isFeatured: false,
    category: 'Mountain Trail',
  },
  {
    id: 'hallstatt-fjord',
    title: 'Hallstatt Fjord',
    location: 'Salzkammergut, Austria',
    description:
      'Glide across crystalline waters reflecting 16th-century Alpine cottages and snow-dusted summits.',
    duration: '4 Nights 3 Days',
    price: '2800$',
    priceUnit: '/per person',
    image:
      'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=800&q=80',
    isFeatured: false,
    category: 'Heritage Tour',
  },
]

export const faqSectionData = {
  heading: 'Frequently Asked Questions',
  lakeImage:
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=85',
  boatLakeImage:
    'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=900&q=85',
}
