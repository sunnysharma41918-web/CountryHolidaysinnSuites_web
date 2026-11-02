export const viaOtaDestinationNames = [
  'Agra',
  'Ahmedabad',
  'Alleppey',
  'Amritsar',
  'Bangalore',
  'Bikaner',
  'Binsar',
  'Chandigarh',
  'Chennai',
  'Chittorgarh',
  'Delhi',
  'Gangtok',
  'Goa',
  'Gujarat',
  'Gurgaon',
  'Haridwar',
  'Indore',
  'Jaipur',
  'Jaisalmer',
  'Jim Corbett',
  'Jodhpur',
  'Katra',
  'Kaushambi',
  'Kerala',
  'Kochi',
  'Kumbhalgarh',
  'Lonavala',
  'Manali',
  'McLeod Ganj',
  'Mukteshwar',
  'Munnar',
  'Mussoorie',
  'Nainital',
  'Pushkar',
  'Ranthambore',
  'Rishikesh',
  'Shimla',
  'Thekkady',
  'Udaipur',
  'Vadodara',
  'Zirakpur',
]

export const viaOtaExchangeDestinationNames = [
  'Alleppey',
  'Amritsar',
  'Bali',
  'Bangalore',
  'Bangkok',
  'Bhimtal',
  'Bhubaneshwar',
  'Chennai',
  'Delhi',
  'Dharamshala',
  'Dubai',
  'Gangtok',
  'Georgia',
  'Goa',
  'Gurgaon',
  'Hyderabad',
  'Istanbul',
  'Jaipur',
  'Jim Corbett',
  'Jodhpur',
  'Kerala',
  'Kochi',
  'Kuala Lumpur',
  'London',
  'Malaysia',
  'Manali',
  'Mumbai',
  'Mussoorie',
  'Mysore',
  'Ooty',
  'Paris',
  'Pattaya',
  'Phuket',
  'Puri',
  'Ranthambore',
  'Rome',
  'Shimla',
  'Shirdi',
  'Spain',
  'Sri Lanka',
  'Thiruvananthapuram',
  'Udaipur',
  'Vrindavan',
]

// Automatically import all destination images from src/assets/Des-img
const localDestinationImages = import.meta.glob('../assets/Des-img/*', {
  eager: true,
  import: 'default',
})

const destinationImageMap = {}
for (const [filePath, resolvedUrl] of Object.entries(localDestinationImages)) {
  const filename = filePath.split(/[/\\]/).pop() || ''
  const key = filename.replace(/\.[^.]+$/, '').toLowerCase().trim()
  if (key) {
    destinationImageMap[key] = resolvedUrl
  }
}

// Spelling / alias variations between destination names and image filenames
const destinationNameAliases = {
  lonavala: 'lonavla',
  vadodara: 'vadodra',
  bhubaneshwar: 'bhubaneswar',
}

const DEFAULT_FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1200&q=80'

export const getDestinationImage = (name, fallback = DEFAULT_FALLBACK_IMAGE) => {
  if (!name) return fallback
  const normalized = name.toLowerCase().trim()
  if (normalized === 'rishikesh') {
    return 'https://images.unsplash.com/photo-1596895111956-bf1cf0599ce5?auto=format&fit=crop&w=1200&q=80'
  }
  const aliased = destinationNameAliases[normalized] || normalized
  return destinationImageMap[aliased] || fallback
}

const toDestinationSlug = (name) =>
  name
    .normalize('NFKD')
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')

const destinationRegions = {
  Bali: 'Indonesia',
  Bangkok: 'Thailand',
  Dubai: 'United Arab Emirates',
  Georgia: 'Georgia',
  Istanbul: 'Turkey',
  Alleppey: 'Kerala, India',
  'Kuala Lumpur': 'Malaysia',
  London: 'United Kingdom',
  Malaysia: 'Malaysia',
  Paris: 'France',
  Pattaya: 'Thailand',
  Phuket: 'Thailand',
  Rome: 'Italy',
  Spain: 'Spain',
  'Sri Lanka': 'Sri Lanka',
}

const curatedDestinationNames = ['Agra', 'Hawaii', 'Big Sur', 'Aspen', 'Cancún Coast', 'Bali']

export const destinations = [
  {
    slug: 'agra',
    name: 'Agra',
    description: 'Discover Mughal architecture, the Taj Mahal, and welcoming heritage stays in the heart of Agra.',
    image: getDestinationImage(
      'Agra',
      'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1200&q=80'
    ),
    resortDestination: 'Agra',
    region: 'Uttar Pradesh, India',
    knowYourDestination:
      'Agra is home to the Taj Mahal, Agra Fort, and a rich Mughal legacy. Plan time for the historic sites, local crafts, and the city’s celebrated cuisine.',
  },
  {
    slug: 'hawaii',
    name: 'Hawaii',
    description: 'Oceanfront calm, volcanic landscapes, and the kind of nights that linger well after the sun sets.',
    image:
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80',
    resortDestination: 'Hawaii',
    region: 'United States',
  },
  {
    slug: 'big-sur',
    name: 'Big Sur',
    description: 'Cliffside drama, coastal trails, and slow luxury experiences tucked between sea and forest.',
    image:
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80',
    resortDestination: 'California Coast',
    region: 'California, United States',
  },
  {
    slug: 'aspen',
    name: 'Aspen',
    description: 'Alpine air, warm hospitality, and a distinctly elevated winter escape for every kind of traveler.',
    image:
      'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=900&q=80',
    resortDestination: 'Colorado',
    region: 'Colorado, United States',
  },
  {
    slug: 'mexico',
    name: 'Cancún Coast',
    description: 'Vibrant beaches, curated leisure, and elegantly designed spaces for sunshine-driven itineraries.',
    image:
      'https://images.unsplash.com/photo-1493558103817-58b2924bce98?auto=format&fit=crop&w=900&q=80',
    resortDestination: 'Mexico',
    region: 'Quintana Roo, Mexico',
  },
  {
    slug: 'bali',
    name: 'Bali',
    description: 'A restorative island escape with lush landscapes, cultural landmarks, and coastal hospitality.',
    image: getDestinationImage(
      'Bali',
      'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=900&q=80'
    ),
    resortDestination: 'Bali',
    region: 'Indonesia',
  },
  ...[...new Set([...viaOtaDestinationNames, ...viaOtaExchangeDestinationNames])]
    .filter((name) => !curatedDestinationNames.includes(name))
    .map((name) => ({
      slug: toDestinationSlug(name),
      name,
      description:
        name === 'Alleppey'
          ? 'Cruise Kerala’s palm-lined backwaters, discover quiet canals, and experience a slower side of coastal India.'
          : `Explore ${name} and find a comfortable base for discovering its local highlights and nearby experiences.`,
      image: getDestinationImage(name),
      resortDestination: name,
      region: destinationRegions[name] || 'India',
      ...(name === 'Alleppey' && {
        knowYourDestination:
          'Alleppey, also known as Alappuzha, is known for its calm backwaters, canals, and houseboat journeys. Take time to enjoy the waterways and the relaxed pace of Kerala’s coast.',
      }),
    })),
]

export const destinationMenuGroups = [
  {
    label: 'VIA OTA',
    slug: 'via-ota',
    destinations: viaOtaDestinationNames.map(toDestinationSlug),
  },
  {
    label: 'VIA OTA EXCHANGE',
    slug: 'via-ota-exchange',
    destinations: viaOtaExchangeDestinationNames.map(toDestinationSlug),
  },
]

export const getDestinationBySlug = (slug) =>
    destinations.find((destination) => destination.slug === slug)
