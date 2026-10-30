// src/data/offers.js
// Centralized store and management service for public & admin offers

export const DEFAULT_OFFERS = [
  {
    id: 'offer-1',
    category: 'membership',
    badge: '35% OFF · FESTIVE SPECIAL',
    title: '10-Year Silver Vacation Membership',
    subtitle: 'Couple & Family Vacation Club Ownership',
    img: '1571896349842-33c89424de2d', // Luxury pool resort
    tagline: 'Guaranteed 6N/7D annual stays locked at today’s tariff for an entire decade.',
    code: 'CHIS35',
    discount: 'Save ₹1,61,000',
    originalPrice: '₹4,60,000',
    offerPrice: '₹2,99,000',
    emi: '₹12,450 / month',
    validTill: 'Valid till 30 Nov 2026',
    perks: ['6N / 7D every year', 'Zero peak surcharge', 'Carry forward unused nights'],
    destinationDetail: 'CHIS 10-Year Silver Membership (Festive 35% Off Offer)',
    active: true,
    showInTicker: true,
    tickerText: 'Festive Holiday Special: Flat 35% OFF on 10 & 30-Year Memberships',
  },
  {
    id: 'offer-2',
    category: 'stay',
    badge: 'FREE GIFT · 2N/3D VOUCHER',
    title: 'Complimentary 2-Night Stay Voucher',
    subtitle: 'Zero-Obligation Welcome Privilege',
    img: '1507525428034-b723cf961d3e', // Tropical beach
    tagline: 'Claim a free 2-night getaway at 50+ scenic partner resorts on booking a consultation.',
    code: 'FREE2STAY',
    discount: '100% Free Gift',
    originalPrice: '₹18,000',
    offerPrice: '₹0 Free',
    emi: 'No purchase required',
    validTill: 'First 50 enquiries this week',
    perks: ['Choice of 50+ Indian destinations', 'Daily breakfast included', 'Flexible 1-year validity'],
    destinationDetail: 'Complimentary 2N/3D Stay Voucher (Welcome Privilege)',
    active: true,
    showInTicker: true,
    tickerText: 'Complimentary 2N/3D Luxury Stay Voucher with every first-time consultation',
  },
  {
    id: 'offer-3',
    category: 'seasonal',
    badge: '0% SURCHARGE · WINTER EXPEDITIONS',
    title: 'Tatra Mountains Winter Wonderland',
    subtitle: 'Poland Alpine Chalet & Ski Getaway',
    img: '1506905925346-21bda4d32df4', // Snowy alpine mountains
    tagline: 'Experience Poland’s breathtaking snow trails and alpine chalets with zero high-season surcharge.',
    code: 'ZEROSURGE',
    discount: 'Peak Surge Waived',
    originalPrice: '₹75,000',
    offerPrice: '₹54,999',
    emi: 'Per person on twin share',
    validTill: 'Season: Nov 2026 – Feb 2027',
    perks: ['Complimentary ski transfers', 'Private chalet stay', '24/7 dedicated concierge'],
    destinationDetail: 'Tatra Mountains Winter Wonderland (Zero Surcharge Package)',
    active: true,
    showInTicker: true,
    tickerText: 'Zero Peak-Season Tariff Hike on Tatra Mountains & Goa Winter Stays',
  },
  {
    id: 'offer-4',
    category: 'membership',
    badge: 'PRESTIGE VIP · ₹1,50,000 OFF',
    title: '30-Year Gold Suite Lifetime Ownership',
    subtitle: 'Grand 2-Bedroom Suite Entitlement',
    img: '1582719508461-905c673771fd', // Grand suite interior
    tagline: 'Three decades of inflation-proof holiday ownership in lavish 2-bedroom suites for 4 adults.',
    code: 'GOLDVIP',
    discount: 'Flat ₹1,50,000 Off',
    originalPrice: '₹9,60,000',
    offerPrice: '₹8,10,000',
    emi: '₹33,750 / month',
    validTill: 'Only 10 suites allocated',
    perks: ['Dual private bedrooms', 'Global RCI & luxury access', 'Dedicated holiday concierge'],
    destinationDetail: 'CHIS 30-Year Gold Suite Lifetime Membership (VIP Savings)',
    active: true,
    showInTicker: true,
    tickerText: 'Prestige VIP: Save ₹1,50,000 on 30-Year 2-Bedroom Gold Suite Ownership',
  },
  {
    id: 'offer-5',
    category: 'stay',
    badge: '30% OFF · TROPICAL ESCAPE',
    title: 'Bali Luxury Pool Villa & Spa Retreat',
    subtitle: '5N / 6D Island Gateway Experience',
    img: '1537996194471-e657df975ab4', // Bali villa
    tagline: 'Unwind in a private infinity pool villa in Seminyak with daily gourmet dining and spa credits.',
    code: 'BALI30',
    discount: '30% Off Package',
    originalPrice: '₹62,000',
    offerPrice: '₹43,400',
    emi: 'Per couple package',
    validTill: 'Valid for bookings by Dec 2026',
    perks: ['Private pool villa stay', 'Free couple Balinese spa', 'Airport limousine transfer'],
    destinationDetail: 'Bali Luxury Pool Villa & Spa Retreat (30% Off Escape)',
    active: true,
    showInTicker: true,
    tickerText: 'Bali Tropical Luxury Packages Starting @ ₹43,400/couple with Private Pool Villa',
  },
  {
    id: 'offer-6',
    category: 'seasonal',
    badge: 'FAMILY SPECIAL · KIDS STAY FREE',
    title: 'Grand Heritage Family Vacation Pass',
    subtitle: 'Rajasthan, Jim Corbett & Goa Properties',
    img: '1566073771259-6a8506099945', // Heritage resort
    tagline: 'Bring the whole family together. Up to 2 children stay and dine completely free.',
    code: 'FAMILYFUN',
    discount: 'Kids Free Privilege',
    originalPrice: '₹42,000',
    offerPrice: '₹28,500',
    emi: 'All-inclusive family rate',
    validTill: 'Valid all year round',
    perks: ['2 Kids (<10 yrs) free stay & meals', 'Guided heritage walk', 'Complimentary room upgrade'],
    destinationDetail: 'Grand Heritage Family Vacation Pass (Kids Stay Free)',
    active: true,
    showInTicker: true,
    tickerText: 'Family Holiday Pass: Kids Stay & Dine Free across Rajasthan & Goa Properties',
  },
]

const STORAGE_KEY = 'chis_active_offers'

export function getStoredOffers() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed
      }
    }
  } catch (err) {
    console.error('Failed to read stored offers:', err)
  }
  return DEFAULT_OFFERS
}

export function saveStoredOffers(offers) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(offers))
    window.dispatchEvent(new CustomEvent('chis-offers-updated', { detail: offers }))
  } catch (err) {
    console.error('Failed to save offers:', err)
  }
  return offers
}

export function resetOffersToDefault() {
  return saveStoredOffers(DEFAULT_OFFERS)
}

export function updateOffer(id, updatedFields) {
  const current = getStoredOffers()
  const updated = current.map((item) => {
    if (item.id === id) {
      return { ...item, ...updatedFields }
    }
    return item
  })
  return saveStoredOffers(updated)
}

export function toggleOfferStatus(id, field = 'active') {
  const current = getStoredOffers()
  const updated = current.map((item) => {
    if (item.id === id) {
      return { ...item, [field]: !item[field] }
    }
    return item
  })
  return saveStoredOffers(updated)
}

export function addOffer(newOffer) {
  const current = getStoredOffers()
  const id = newOffer.id || `offer-${Date.now()}`
  const created = [{ ...newOffer, id }, ...current]
  return saveStoredOffers(created)
}

export function deleteOffer(id) {
  const current = getStoredOffers()
  const updated = current.filter((item) => item.id !== id)
  return saveStoredOffers(updated)
}

/* ========================================================================= */
/*  FESTIVAL GREETINGS & SEASONAL BANNER SERVICE                             */
/* ========================================================================= */

export const FESTIVAL_PRESETS = {
  diwali: {
    id: 'diwali',
    name: 'Diwali',
    emoji: '🪔',
    badge: '🪔 HAPPY DIWALI',
    title: 'Happy Diwali',
    message: 'Wishing you & your family a joyous, illuminated Diwali from Country Holidays Inn & Suites! May your travels be blessed with light, luxury & prosperity. ✨',
    promoCode: 'DIWALI2026',
    discount: 'Diwali Privilege',
  },
  new_year: {
    id: 'new_year',
    name: 'New Year',
    emoji: '🎆',
    badge: '🎆 HAPPY NEW YEAR',
    title: 'Happy New Year 2027',
    message: 'Warmest New Year wishes from CHIS! Begin 2027 with unforgettable adventures across 3,500+ luxury resorts worldwide.',
    promoCode: 'NEWYEAR2027',
    discount: 'Early Bird 2027',
  },
  christmas: {
    id: 'christmas',
    name: 'Christmas',
    emoji: '🎄',
    badge: '🎄 MERRY CHRISTMAS',
    title: 'Merry Christmas',
    message: 'Merry Christmas from the CHIS Family! Unbox magical winter retreats and snowy mountain escapes this festive holiday season.',
    promoCode: 'XMASMAGIC',
    discount: 'Winter Gift Voucher',
  },
  holi: {
    id: 'holi',
    name: 'Holi',
    emoji: '🎨',
    badge: '🎨 HAPPY HOLI',
    title: 'Happy Holi',
    message: 'May your life be painted with colors of joy, love, and vibrant holidays! Happy Holi from Country Holidays Inn & Suites.',
    promoCode: 'HOLICOLORS',
    discount: 'Spring Break Deal',
  },
  eid: {
    id: 'eid',
    name: 'Eid',
    emoji: '🌙',
    badge: '🌙 EID MUBARAK',
    title: 'Eid Mubarak',
    message: 'Eid Mubarak! Wishing you and your loved ones peace, happiness, and memorable journeys together.',
    promoCode: 'EIDMUBARAK',
    discount: 'Festive Stay Package',
  },
  custom: {
    id: 'custom',
    name: 'Custom Festival',
    emoji: '✨',
    badge: '✨ FESTIVE WISHES',
    title: 'Season Greetings',
    message: 'Warm festive greetings from Country Holidays Inn & Suites! Enjoy exclusive holiday packages and special membership perks.',
    promoCode: 'FESTIVECHIS',
    discount: 'Special Privilege',
  },
}

export const DEFAULT_FESTIVAL_GREETING = {
  enabled: true,
  occasion: 'diwali',
  title: 'Happy Diwali',
  badge: '🪔 HAPPY DIWALI',
  message: 'Wishing you & your family a prosperous and illuminated Diwali from Country Holidays Inn & Suites! May every journey shine bright with joy & luxury. ✨',
  promoCode: 'DIWALI2026',
  destination: 'CHIS Diwali Festive Holiday Offer',
}

const GREETING_STORAGE_KEY = 'chis_festival_greeting'

export function getFestivalGreeting() {
  try {
    const raw = localStorage.getItem(GREETING_STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      return { ...DEFAULT_FESTIVAL_GREETING, ...parsed }
    }
  } catch (err) {
    console.error('Failed to read festival greeting:', err)
  }
  return DEFAULT_FESTIVAL_GREETING
}

export function saveFestivalGreeting(greeting) {
  try {
    localStorage.setItem(GREETING_STORAGE_KEY, JSON.stringify(greeting))
    window.dispatchEvent(new CustomEvent('chis-festival-greeting-updated', { detail: greeting }))
    window.dispatchEvent(new CustomEvent('chis-offers-updated'))
  } catch (err) {
    console.error('Failed to save festival greeting:', err)
  }
  return greeting
}
