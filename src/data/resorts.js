// Helper to load user-created / edited properties from localStorage
export const getCustomResorts = () => {
  try {
    const raw = localStorage.getItem('chis_custom_properties')
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export const saveCustomResort = (resort) => {
  try {
    const current = getCustomResorts()
    const index = current.findIndex((r) => String(r.id) === String(resort.id) || r.slug === resort.slug)
    let updated
    if (index >= 0) {
      updated = [...current]
      updated[index] = { ...updated[index], ...resort, updatedAt: new Date().toISOString() }
    } else {
      updated = [{ ...resort, createdAt: new Date().toISOString() }, ...current]
    }
    localStorage.setItem('chis_custom_properties', JSON.stringify(updated))
    window.dispatchEvent(new CustomEvent('chis-properties-updated', { detail: updated }))
    return updated
  } catch {
    return []
  }
}

export const initialResorts = [
  {
    id: 1,
    internalId: 'CHIS-PROP-1001',
    slug: 'harbor-ridge-retreat',
    name: 'Harbor Ridge Retreat',
    title: 'Harbor Ridge Retreat',
    source: 'VIA_OTA',
    status: 'published',
    isActive: true,
    location: 'Maui, Hawaii',
    destination: 'Hawaii',
    city: 'Maui',
    state: 'Hawaii',
    country: 'United States',
    description:
      'An oceanside hideaway blending relaxed luxury, sunrise views, and comfortable gathering spaces for restorative escapes.',
    image:
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    coverImage:
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=900&q=80',
    ],
    amenities: ['Oceanfront Suites', 'Outdoor Dining', 'Spa Access', 'Family Friendly', 'Infinity Pool'],
    highlights: ['Oceanfront sunrise vistas', 'Curated wellness spa', 'Private lanai balconies', 'Authentic island cuisine'],
    featured: true,
  },
  {
    id: 2,
    internalId: 'CHIS-PROP-1002',
    slug: 'cypress-cove-hotel',
    name: 'Cypress Cove Hotel',
    title: 'Cypress Cove Hotel',
    source: 'VIA_OTA',
    status: 'published',
    isActive: true,
    location: 'Big Sur, California',
    destination: 'California Coast',
    city: 'Big Sur',
    state: 'California',
    country: 'United States',
    description:
      'A calming coastal property surrounded by cliffs and redwood vistas, designed for slow mornings and scenic afternoons.',
    image:
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80',
    coverImage:
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1496417263034-38ec4f0b665a?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=900&q=80',
    ],
    amenities: ['Private Balconies', 'Wellness Studio', 'Sunset Lounge', 'Lakeside Walks', 'Fireplace Lounges'],
    highlights: ['Pacific Ocean cliffside views', 'Redwood forest trails', 'Artisanal farm-to-table dining', 'Stargazing decks'],
    featured: true,
  },
  {
    id: 3,
    internalId: 'CHIS-PROP-1003',
    slug: 'amber-glen-suites',
    name: 'Amber Glen Suites',
    title: 'Amber Glen Suites',
    source: 'VIA_OTA_EXCHANGE',
    status: 'published',
    isActive: true,
    location: 'Aspen, Colorado',
    destination: 'Colorado',
    city: 'Aspen',
    state: 'Colorado',
    country: 'United States',
    description:
      'Mountain-facing suites, warm interiors, and elevated dining experiences make this a favorite for winter escapes.',
    image:
      'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1200&q=80',
    coverImage:
      'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1482192505345-5655af888cc4?auto=format&fit=crop&w=900&q=80',
    ],
    amenities: ['Mountain Views', 'Fire Pit', 'Chef Curated Breakfast', 'Ski Shuttle', 'Heated Indoor Pool'],
    highlights: ['Direct ski-in / ski-out access', 'Panoramic Aspen peaks', 'Cozy stone fireplaces', 'Private heated balconies'],
    featured: false,
  },
  {
    id: 4,
    internalId: 'CHIS-PROP-1004',
    slug: 'sapphire-bay-resort',
    name: 'Sapphire Bay Resort',
    title: 'Sapphire Bay Resort',
    source: 'VIA_OTA_EXCHANGE',
    status: 'published',
    isActive: true,
    location: 'Cancún, Mexico',
    destination: 'Mexico',
    city: 'Cancún',
    state: 'Quintana Roo',
    country: 'Mexico',
    description:
      'A vibrant yet polished resort where oceanfront leisure, cultural experiences, and thoughtful service blend effortlessly.',
    image:
      'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1200&q=80',
    coverImage:
      'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1493558103817-58b2924bce98?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80',
    ],
    amenities: ['Beachfront Access', 'Pool Deck', 'Local Dining', 'Wellness Rituals', 'Private Cabanas'],
    highlights: ['Turquoise Caribbean waters', 'Private beach palapas', 'Mayan-inspired spa treatments', 'Swim-up bars'],
    featured: false,
  },
  {
    id: 5,
    internalId: 'CHIS-PROP-1005',
    slug: 'the-grand-imperial-agra',
    name: 'The Grand Imperial, Agra',
    title: 'The Grand Imperial, Agra',
    source: 'VIA_OTA',
    status: 'published',
    isActive: true,
    location: 'M.G. Road, Agra, Uttar Pradesh, India',
    destination: 'Agra',
    city: 'Agra',
    state: 'Uttar Pradesh',
    country: 'India',
    description:
      'A heritage hotel in the heart of Agra, The Grand Imperial pairs classic architecture and gracious hospitality with convenient access to the city’s celebrated Mughal landmarks.',
    destinationDescription:
      'Agra rewards curious travelers with the Taj Mahal, Agra Fort, and an enduring legacy of Mughal art and architecture.',
    knowYourDestination:
      'The Taj Mahal is especially beautiful around sunrise. Agra Fort and the old city are also worth exploring; allow time for local traffic when planning your visits.',
    image:
      'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1400&q=85',
    coverImage:
      'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1400&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=900&q=80',
    ],
    amenities: ['Restaurant', 'Outdoor Pool', 'Free Wi-Fi', 'Heritage Architecture', 'Conference Facilities'],
    highlights: ['Heritage-style interiors', 'Central Agra location', 'On-site dining', 'Easy access to historic landmarks'],
    mapQuery: 'The Grand Imperial Hotel Agra India',
    featured: true,
  },
  {
    id: 6,
    internalId: 'CHIS-PROP-1006',
    slug: 'hotel-clarks-shiraz-agra',
    name: 'Hotel Clarks Shiraz, Agra',
    title: 'Hotel Clarks Shiraz, Agra',
    source: 'VIA_OTA',
    status: 'published',
    isActive: true,
    location: '54, Taj Road, Agra, Uttar Pradesh, India',
    destination: 'Agra',
    city: 'Agra',
    state: 'Uttar Pradesh',
    country: 'India',
    description:
      'A long-established Agra hotel offering comfortable rooms, welcoming service, and a convenient base for exploring the Taj Mahal and other historic attractions.',
    destinationDescription:
      'Agra rewards curious travelers with the Taj Mahal, Agra Fort, and an enduring legacy of Mughal art and architecture.',
    knowYourDestination:
      'The Taj Mahal is closed on Fridays. Check attraction hours before you travel and consider visiting early in the day for a quieter experience.',
    image:
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1400&q=85',
    coverImage:
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1400&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=900&q=80',
    ],
    amenities: ['Restaurant', 'Swimming Pool', 'Fitness Centre', 'Meeting Facilities', 'Bar & Lounge'],
    highlights: ['Taj Road address', 'On-site dining', 'Pool and fitness facilities', 'Comfortable rooms'],
    mapQuery: 'Hotel Clarks Shiraz Agra India',
    featured: true,
  },
  {
    id: 7,
    internalId: 'CHIS-PROP-1007',
    slug: 'hotel-taj-resorts-agra',
    name: 'Hotel Taj Resorts',
    title: 'Hotel Taj Resorts',
    source: 'VIA_OTA_EXCHANGE',
    status: 'published',
    isActive: true,
    location: 'Plot No. 538, Agra, Uttar Pradesh, India',
    destination: 'Agra',
    city: 'Agra',
    state: 'Uttar Pradesh',
    country: 'India',
    description:
      'A relaxed boutique stay close to the Taj Mahal, with a welcoming atmosphere and thoughtful comforts for travelers discovering Agra.',
    destinationDescription:
      'Agra rewards curious travelers with the Taj Mahal, Agra Fort, and an enduring legacy of Mughal art and architecture.',
    knowYourDestination:
      'The Taj Mahal is within the historic Taj Ganj area. Explore nearby cafés and handicraft shops, and use authorized transport around monument entry zones.',
    image:
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1400&q=85',
    coverImage:
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1400&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=900&q=80',
    ],
    amenities: ['Restaurant', 'Rooftop Dining', 'Outdoor Pool', 'Free Wi-Fi', 'Taj Mahal View Terrace'],
    highlights: ['Convenient Taj Mahal access', 'Rooftop dining', 'Outdoor pool', 'Boutique atmosphere'],
    mapQuery: 'Hotel Taj Resorts Agra India',
    featured: true,
  },
]

// Returns all combined active resorts (initial baseline + any customized via admin portal)
export const getAllResorts = () => {
  const custom = getCustomResorts()
  if (!custom || custom.length === 0) return initialResorts

  // Merge custom over initial
  const mergedMap = new Map()
  initialResorts.forEach((r) => mergedMap.set(String(r.id), r))
  custom.forEach((c) => mergedMap.set(String(c.id || c._id || c.slug), { ...mergedMap.get(String(c.id)), ...c }))
  return Array.from(mergedMap.values())
}

export const resorts = getAllResorts()

export const getResortBySlug = (slug) => {
  const all = getAllResorts()
  return all.find((r) => r.slug === slug || String(r.id) === String(slug))
}
