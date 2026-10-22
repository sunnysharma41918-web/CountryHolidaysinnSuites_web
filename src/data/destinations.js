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
    image:
      'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1200&q=80',
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
    image:
      'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=900&q=80',
    resortDestination: 'Bali',
    region: 'Indonesia',
  },
  ...[...new Set([...viaOtaDestinationNames, ...viaOtaExchangeDestinationNames])]
    .filter((name) => !curatedDestinationNames.includes(name))
    .map((name) => ({
      slug: toDestinationSlug(name),
      name,
      description: `Explore ${name} and find a comfortable base for discovering its local highlights and nearby experiences.`,
      image:
        'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1200&q=80',
      resortDestination: name,
      region: destinationRegions[name] || 'India',
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
