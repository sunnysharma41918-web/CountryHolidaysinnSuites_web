export const PRICING_ID = 'membership-pricing'
export const RESORT_COLLECTION_ID = 'resort-collection'

export const pricingNotice =
  'Prices are from a 2021 price list and are shown as historical / demo pricing until verified.'

export const emiNote = '24-month EMI facility advertised for all plans.'

let vacationLenis = null

export const setVacationLenis = (lenis) => {
  vacationLenis = lenis
}

export const whyChoose = [
  { title: 'Guaranteed Booking', description: 'Plan your holiday with confidence.' },
  { title: 'No Loss of Holidays', description: 'Make the most of your membership years.' },
  { title: '24/7 Member Support', description: 'Help is available around the clock.' },
  { title: 'Varied Destination Experiences', description: 'Choose from many kinds of stays and places.' },
]

export const highlights = [
  { title: '5–30 year memberships', description: 'Flexible membership terms to choose from.' },
  { title: '6N/7D stays', description: 'Across 500+ destinations.' },
  { title: 'Activities', description: 'Experiences included in your holiday.' },
  { title: 'Flight discounts', description: 'Savings on travel for members.' },
  { title: 'Pickup / drop facilities', description: 'Smoother arrivals and departures.' },
  { title: 'Dining', description: 'Meals as part of the member experience.' },
  { title: 'Member vouchers', description: 'Extra value for members.' },
]

export const apartmentCategories = [
  { id: 'T1', name: 'T1 Standard Room', occupancy: '2 adults + 2 children below 6 years' },
  { id: 'T2', name: 'T2 Two Rooms / Suite', occupancy: '4 adults + 2 children below 6 years' },
]

export const membershipPlans = [
  { id: 't1-10', category: 'T1', categoryName: 'Standard Room', occupancy: '2 adults + 2 children below 6 years', years: 10, price: 460000, asf: 12000 },
  { id: 't1-30', category: 'T1', categoryName: 'Standard Room', occupancy: '2 adults + 2 children below 6 years', years: 30, price: 760000, asf: 12000 },
  { id: 't2-10', category: 'T2', categoryName: 'Two Rooms / Suite', occupancy: '4 adults + 2 children below 6 years', years: 10, price: 660000, asf: 15000 },
  { id: 't2-30', category: 'T2', categoryName: 'Two Rooms / Suite', occupancy: '4 adults + 2 children below 6 years', years: 30, price: 960000, asf: 15000 },
]

export const formatINR = (amount) => `₹${amount.toLocaleString('en-IN')}`

export const scrollToId = (id) => {
  const target = document.getElementById(id)
  if (!target) return

  if (vacationLenis) {
    vacationLenis.scrollTo(target)
    return
  }

  target.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

export const openEnquiry = (plan) => {
  window.dispatchEvent(
    new CustomEvent('open-booking-modal', {
      detail: {
        destination: plan
          ? `CHIS Membership: ${plan.category} ${plan.categoryName}, ${plan.years} years`
          : 'CHIS Membership Enquiry',
        persons: plan ? plan.occupancy : 'Membership enquiry',
        days: '6N/7D stays',
      },
    })
  )
}
