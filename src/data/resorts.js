// Synchronized with MongoDB Atlas and baseline
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
    "id": 1,
    "_id": "6ae44e0dd9a43f7b3f1c17ff",
    "internalId": "CHIS-01",
    "slug": "the-grand-imperial-agra",
    "name": "The Grand Imperial, Agra",
    "title": "The Grand Imperial, Agra",
    "source": "VIA_OTA",
    "status": "published",
    "isActive": true,
    "location": "Agra,U.P",
    "destination": "Agra",
    "city": "Agra",
    "state": "Uttar Pradesh",
    "country": "India",
    "address": "",
    "mapQuery": "32 / 107-A, Mahatma Gandhi Rd, opposite D.M Bungalow, Chhipitola, Rakabganj, Agra, Uttar Pradesh 282001",
    "description": "The Grand Imperial in Agra is a historic, Grade-II colonial-era heritage luxury hotel located on M.G. Road",
    "image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRRcwcllaYdHLfGPOUYCX48ogj9m97VJ7ZezS2VDaCu1082w4mi6vvjTVhT&s=10",
    "coverImage": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRRcwcllaYdHLfGPOUYCX48ogj9m97VJ7ZezS2VDaCu1082w4mi6vvjTVhT&s=10",
    "gallery": [],
    "amenities": [
      "Restaurant",
      "Outdoor Pool",
      "Free Wi-Fi",
      "Oceanfront Suites",
      "Room Service"
    ],
    "highlights": [],
    "featured": false,
    "contactDetails": {
      "phone": "91-562-2251190",
      "email": "info@hotelgrandimperial.com",
      "website": "https://www.hotelgrandimperial.com/"
    }
  },
  {
    "id": 2,
    "_id": "6ae44f95d9a43f7b3f1c1829",
    "internalId": "CHIS-02",
    "slug": "mayfair-hideaway-spa-resort",
    "name": "Mayfair Hideaway Spa Resort",
    "title": "Mayfair Hideaway Spa Resort",
    "source": "VIA_OTA",
    "status": "published",
    "isActive": true,
    "location": "Gorkomarad, Goa",
    "destination": "Goa",
    "city": "Gorkomarad",
    "state": "Goa",
    "country": "India",
    "address": "",
    "mapQuery": "Gorkomarad, Canaguinim, Goa 403703",
    "description": "The Mayfair Hideaway Spa Resort is an intimate 4-star boutique luxury resort located in Betul, South Goa, where the Sal River meets the Arabian Sea",
    "image": "https://cf.bstatic.com/xdata/images/hotel/max1024x768/29807934.jpg?k=d6bbfbef9e209c493021242242ced823e7e5b71d874c5048e65515cb449bafcd&o=",
    "coverImage": "https://cf.bstatic.com/xdata/images/hotel/max1024x768/29807934.jpg?k=d6bbfbef9e209c493021242242ced823e7e5b71d874c5048e65515cb449bafcd&o=",
    "gallery": [],
    "amenities": [
      "Restaurant",
      "Outdoor Pool",
      "Free Wi-Fi",
      "Oceanfront Suites",
      "Mountain Views",
      "Family Friendly",
      "Heritage Architecture",
      "Rooftop Dining",
      "Fitness Centre",
      "Room Service"
    ],
    "highlights": [],
    "featured": false,
    "contactDetails": {
      "phone": "91 832 272 1111",
      "email": "reservations@mayfairhotels.com",
      "website": "https://www.mayfairhotels.com/on-sea-morjim-goa/contact-us.html"
    }
  },
  {
    "id": 3,
    "_id": "6ae450acd9a43f7b3f1c1841",
    "internalId": "CHIS-03",
    "slug": "red-fox-hotel-morjim-goa",
    "name": "Red Fox Hotel, Morjim, Goa",
    "title": "Red Fox Hotel, Morjim, Goa",
    "source": "VIA_OTA",
    "status": "published",
    "isActive": true,
    "location": "Morjim, Goa",
    "destination": "Goa",
    "city": "Morjim",
    "state": "Goa",
    "country": "India",
    "address": "",
    "mapQuery": "1435, Kannaikwada Morjim, Goa, Morjim, Goa 403512",
    "description": "The Red Fox Hotel, Morjim, Goa (formerly known as Turtle Beach Resort) is a mid-scale, beach-adjacent property managed under the Lemon Tree Hotels group.",
    "image": "https://static.toiimg.com/thumb/msid-67878926,width-550,height-433.jpg",
    "coverImage": "https://static.toiimg.com/thumb/msid-67878926,width-550,height-433.jpg",
    "gallery": [],
    "amenities": [
      "Restaurant",
      "Outdoor Pool",
      "Free Wi-Fi",
      "Spa Access",
      "Oceanfront Suites",
      "Mountain Views",
      "Family Friendly",
      "Heritage Architecture",
      "Private Balconies",
      "Rooftop Dining",
      "Fitness Centre",
      "Room Service"
    ],
    "highlights": [],
    "featured": false,
    "contactDetails": {
      "phone": "",
      "email": "",
      "website": ""
    }
  },
  {
    "id": 4,
    "_id": "6ae45186d9a43f7b3f1c1855",
    "internalId": "CHIS-04",
    "slug": "i-love-bell-bottoms",
    "name": "I Love Bell Bottoms",
    "title": "I Love Bell Bottoms",
    "source": "VIA_OTA",
    "status": "published",
    "isActive": true,
    "location": "Anjuna, Goa",
    "destination": "Goa",
    "city": "Anjuna",
    "state": "Goa",
    "country": "India",
    "address": "",
    "mapQuery": "544, 2, Ozran Beach Rd, Vagator, Coutinho Vaddo, Anjuna, Goa 403509",
    "description": "I Love Bell Bottoms is a vibrant, 1970s and 1980s retro-themed 4-star boutique hotel located near Vagator Beach in Anjuna, Goa",
    "image": "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0f/db/ae/c1/i-love-bell-bottoms.jpg?w=900&h=500&s=1",
    "coverImage": "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0f/db/ae/c1/i-love-bell-bottoms.jpg?w=900&h=500&s=1",
    "gallery": [],
    "amenities": [
      "Restaurant",
      "Outdoor Pool",
      "Free Wi-Fi",
      "Spa Access",
      "Oceanfront Suites",
      "Mountain Views",
      "Family Friendly",
      "Heritage Architecture",
      "Private Balconies",
      "Rooftop Dining",
      "Fitness Centre",
      "Room Service"
    ],
    "highlights": [],
    "featured": false,
    "contactDetails": {
      "phone": "91 866 963 5000",
      "email": "bellbottoms246@outlook.com",
      "website": "https://i-love-bell-bottoms.goa-india-hotels-resorts.com/en/"
    }
  },
  {
    "id": 5,
    "_id": "6ae452ddd9a43f7b3f1c1879",
    "internalId": "CHIS-05",
    "slug": "white-woods-resort-spa",
    "name": "White Woods Resort & Spa",
    "title": "White Woods Resort & Spa",
    "source": "VIA_OTA",
    "status": "published",
    "isActive": true,
    "location": "Morjim, Goa",
    "destination": "Goa",
    "city": "Morjim",
    "state": "Goa",
    "country": "India",
    "address": "",
    "mapQuery": "New wada ,Morjim, Pernem, Morjim, Goa 403512",
    "description": "White Woods Resort & Spa is a 3-star boutique nature retreat managed by Stone Wood Hotels & Resorts in Morjim, North Goa",
    "image": "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2e/c1/24/fa/caption.jpg?w=900&h=500&s=1",
    "coverImage": "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2e/c1/24/fa/caption.jpg?w=900&h=500&s=1",
    "gallery": [],
    "amenities": [
      "Restaurant",
      "Outdoor Pool",
      "Free Wi-Fi",
      "Spa Access",
      "Oceanfront Suites",
      "Mountain Views"
    ],
    "highlights": [],
    "featured": false,
    "contactDetails": {
      "phone": "",
      "email": "",
      "website": ""
    }
  },
  {
    "id": 6,
    "_id": "6ae45380d9a43f7b3f1c188f",
    "internalId": "CHIS-06",
    "slug": "stone-wood-resort-mandrem",
    "name": "Stone Wood Resort Mandrem",
    "title": "Stone Wood Resort Mandrem",
    "source": "VIA_OTA",
    "status": "published",
    "isActive": true,
    "location": "Mandrem, Goa",
    "destination": "Goa",
    "city": "Mandrem",
    "state": "Goa",
    "country": "India",
    "address": "",
    "mapQuery": "Survey No 291/8B, Ashvewada, Pernem, Mandrem, Goa, 403527",
    "description": "Stone Wood Resort & Spa, Mandrem is a nature-inspired boutique resort located in North Goa",
    "image": "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2d/6d/1e/15/caption.jpg?w=900&h=500&s=1",
    "coverImage": "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2d/6d/1e/15/caption.jpg?w=900&h=500&s=1",
    "gallery": [],
    "amenities": [
      "Restaurant",
      "Outdoor Pool",
      "Free Wi-Fi",
      "Spa Access",
      "Oceanfront Suites",
      "Mountain Views",
      "Heritage Architecture",
      "Private Balconies",
      "Rooftop Dining",
      "Fitness Centre",
      "Room Service",
      "Family Friendly"
    ],
    "highlights": [],
    "featured": false,
    "contactDetails": {
      "phone": "+91 86 6961 3408",
      "email": "gm.mandrem@stonewoodresorts.com",
      "website": ""
    }
  },
  {
    "id": 7,
    "_id": "6ae4547ad9a43f7b3f1c18a5",
    "internalId": "CHIS-07",
    "slug": "neelams-the-grand",
    "name": "Neelams The Grand",
    "title": "Neelams The Grand",
    "source": "VIA_OTA",
    "status": "published",
    "isActive": true,
    "location": "Calangute, Goa",
    "destination": "Goa",
    "city": "Calangute",
    "state": "Goa",
    "country": "India",
    "address": "",
    "mapQuery": "GQV8+828, Post Office Rd, near KFC, Near Calangute Beach, Bardez, Calangute, Goa 403516",
    "description": "Neelams The Grand is a 4-star resort located on Post Office Road in Naika Vaddo, Calangute, North Goa, situated about 2 km from Calangute Beach",
    "image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ1id2xSVFKH-dCszjSURJ6PotTt48FgVZJdSKICrxbL69XEE-MiG8yk4OC&s=10",
    "coverImage": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ1id2xSVFKH-dCszjSURJ6PotTt48FgVZJdSKICrxbL69XEE-MiG8yk4OC&s=10",
    "gallery": [],
    "amenities": [
      "Restaurant",
      "Outdoor Pool",
      "Free Wi-Fi",
      "Spa Access",
      "Oceanfront Suites",
      "Mountain Views",
      "Family Friendly",
      "Heritage Architecture",
      "Private Balconies",
      "Rooftop Dining",
      "Fitness Centre",
      "Room Service"
    ],
    "highlights": [],
    "featured": false,
    "contactDetails": {
      "phone": "+91 832-2281800",
      "email": "Reservation@thegrandgoa.com",
      "website": "https://neelamshotels.com/contact-us/"
    }
  },
  {
    "id": 8,
    "_id": "6ae4553ed9a43f7b3f1c18c3",
    "internalId": "CHIS-08",
    "slug": "regenta-central-north-goa-by-royal-orchid-hotels-ltd",
    "name": "Regenta Central North Goa by Royal Orchid Hotels Ltd",
    "title": "Regenta Central North Goa by Royal Orchid Hotels Ltd",
    "source": "VIA_OTA",
    "status": "published",
    "isActive": true,
    "location": "Arpora, Goa",
    "destination": "Goa",
    "city": "Arpora",
    "state": "Goa",
    "country": "India",
    "address": "",
    "mapQuery": "House No -131, 11, Nagva, Arpora, Goa 403516",
    "description": "Regenta Central North Goa by Royal Orchid Hotels is a 4-star contemporary hotel located in Arpora-Nagoa, North Goa",
    "image": "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/34/09/6c/dd/caption.jpg?w=900&h=500&s=1",
    "coverImage": "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/34/09/6c/dd/caption.jpg?w=900&h=500&s=1",
    "gallery": [],
    "amenities": [
      "Restaurant",
      "Outdoor Pool",
      "Rooftop Dining",
      "Private Balconies",
      "Free Wi-Fi",
      "Family Friendly",
      "Room Service"
    ],
    "highlights": [],
    "featured": false,
    "contactDetails": {
      "phone": "+91 8322988800",
      "email": "gm.rcng@royalorchidhotels.com",
      "website": "https://www.royalorchidhotels.com/"
    }
  },
  {
    "id": 9,
    "_id": "6ae46d00d9a43f7b3f1c1960",
    "internalId": "CHIS-09",
    "slug": "the-desert-palace",
    "name": "The Desert Palace",
    "title": "The Desert Palace",
    "source": "VIA_OTA",
    "status": "published",
    "isActive": true,
    "location": "Jaisalmer, Rajasthan",
    "destination": "Jaisalmer",
    "city": "Jaisalmer",
    "state": "Rajasthan",
    "country": "India",
    "address": "",
    "mapQuery": "Jaisalmer, Rajasthan 345001",
    "description": "The Desert Palace, also known as SKK The Fern Jaisalmer, is a 4-star luxury family-friendly resort and hotel designed in the style of a traditional Rajasthani palace",
    "image": "https://images.trvl-media.com/lodging/21000000/20200000/20192500/20192442/a2131a3d.jpg?impolicy=resizecrop&rw=575&rh=575&ra=fill",
    "coverImage": "https://images.trvl-media.com/lodging/21000000/20200000/20192500/20192442/a2131a3d.jpg?impolicy=resizecrop&rw=575&rh=575&ra=fill",
    "gallery": [],
    "amenities": [
      "Restaurant",
      "Outdoor Pool",
      "Free Wi-Fi",
      "Spa Access",
      "Oceanfront Suites",
      "Mountain Views",
      "Family Friendly",
      "Heritage Architecture",
      "Private Balconies",
      "Rooftop Dining"
    ],
    "highlights": [],
    "featured": false,
    "contactDetails": {
      "phone": "+91-79-23977600",
      "email": "crs@tihr.in",
      "website": "https://www.desertpalace.co.za/hotel/"
    }
  },
  {
    "id": 10,
    "_id": "6ae46dd9d9a43f7b3f1c1970",
    "internalId": "CHIS-10",
    "slug": "chokhi-dhani-the-palace-hotel-jaisalmer",
    "name": "Chokhi Dhani The Palace Hotel Jaisalmer",
    "title": "Chokhi Dhani The Palace Hotel Jaisalmer",
    "source": "VIA_OTA",
    "status": "published",
    "isActive": true,
    "location": "Jaisalmer, Rajasthan",
    "destination": "Jaisalmer",
    "city": "Jaisalmer",
    "state": "Rajasthan",
    "country": "India",
    "address": "",
    "mapQuery": "National Highway, 15, Barmer Rd, opposite Maheshwari Hospital, Suthar Para, Jaisalmer, Rajasthan 345001",
    "description": "Chokhi Dhani The Palace Hotel Jaisalmer is a 4-star luxury heritage resort located on Barmer Road (National Highway 15) in Jaisalmer, Rajasthan",
    "image": "https://cf.bstatic.com/xdata/images/hotel/max500/903725592.jpg?k=603c9e3abd0dd1289544973c75731472312a20106d37da953f449aa48f8e0a79&o=&hp=1",
    "coverImage": "https://cf.bstatic.com/xdata/images/hotel/max500/903725592.jpg?k=603c9e3abd0dd1289544973c75731472312a20106d37da953f449aa48f8e0a79&o=&hp=1",
    "gallery": [],
    "amenities": [
      "Restaurant",
      "Outdoor Pool",
      "Fitness Centre",
      "Rooftop Dining",
      "Room Service",
      "Private Balconies",
      "Free Wi-Fi",
      "Heritage Architecture",
      "Oceanfront Suites",
      "Mountain Views",
      "Family Friendly"
    ],
    "highlights": [],
    "featured": false,
    "contactDetails": {
      "phone": "+91-8769561634",
      "email": "reservation@chokhidhanijaisalmer.com",
      "website": "mailto:som@chokhidhanijaisalmer.com"
    }
  },
  {
    "id": 11,
    "_id": "6ae46f00d9a43f7b3f1c1984",
    "internalId": "CHIS-11",
    "slug": "the-dunes-cochin",
    "name": "The Dunes Cochin",
    "title": "The Dunes Cochin",
    "source": "VIA_OTA",
    "status": "published",
    "isActive": true,
    "location": "Kochi, kerala",
    "destination": "Kochi",
    "city": "Kochi",
    "state": "kerala",
    "country": "India",
    "address": "",
    "mapQuery": "X7HM+RM5, Doraiswamy Iyer Rd, Shenoys, Dwaraswami, Kochi, Keralam 682035",
    "description": "Comfort meets convenience at The Dunes, a contemporary design four star facility business class hotel perched right in the heart of the city. The Dunes sets imperial amenities and exquisite service at a location providing easy access to city major attractions. Hotel’s luxury rooms, suites, restaurants and meeting venues display sheer elegance making the hospitality and refinement shine through. Whether for business or leisure, The Dunes presents a unique blend of avant-garde architecture, deep comfort and personalized service to discover.",
    "image": "https://www.duneshotels.com/images/cohin-thumb.jpg",
    "coverImage": "https://www.duneshotels.com/images/cohin-thumb.jpg",
    "gallery": [],
    "amenities": [
      "Outdoor Pool",
      "Restaurant",
      "Fitness Centre",
      "Rooftop Dining",
      "Free Wi-Fi",
      "Oceanfront Suites",
      "Mountain Views",
      "Family Friendly",
      "Heritage Architecture",
      "Private Balconies",
      "Room Service"
    ],
    "highlights": [],
    "featured": false,
    "contactDetails": {
      "phone": "+91 (0) 484 238 4030",
      "email": "fb@duneshotels.com",
      "website": "https://www.duneshotels.com/dunescochin/contact.html"
    }
  },
  {
    "id": 12,
    "_id": "6ae470d3d9a43f7b3f1c1998",
    "internalId": "CHIS-12",
    "slug": "olive-downtown",
    "name": "Olive Downtown",
    "title": "Olive Downtown",
    "source": "VIA_OTA",
    "status": "published",
    "isActive": true,
    "location": "Ernakulam,Kochi",
    "destination": "Kochi",
    "city": "Kochi",
    "state": "kerala",
    "country": "India",
    "address": "",
    "mapQuery": "28/286, Jn, Kadavanthra Junction, Kadavanthra, Kochi, Ernakulam, Keralam 682020",
    "description": "Olive Downtown is a 5-star business and leisure hotel located at Kadavanthra Junction on S.A. Road in Kochi, Kerala",
    "image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTUJYWz0O1tDMKyQZs568PoW7CJFkoJkFbmEpR5BN2vVfTJV9ZBR7620Ds&s=10",
    "coverImage": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTUJYWz0O1tDMKyQZs568PoW7CJFkoJkFbmEpR5BN2vVfTJV9ZBR7620Ds&s=10",
    "gallery": [],
    "amenities": [
      "Restaurant",
      "Fitness Centre",
      "Free Wi-Fi",
      "Rooftop Dining",
      "Spa Access",
      "Oceanfront Suites",
      "Mountain Views",
      "Family Friendly",
      "Heritage Architecture",
      "Private Balconies"
    ],
    "highlights": [],
    "featured": false,
    "contactDetails": {
      "phone": "+91 484 4222333",
      "email": "downtown@olivehotels.com",
      "website": ""
    }
  },
  {
    "id": 13,
    "_id": "6ae494b7d37be247b915feda",
    "internalId": "CHIS-13",
    "slug": "the-munnar-queen-resort-and-spa",
    "name": "The Munnar Queen Resort And Spa",
    "title": "The Munnar Queen Resort And Spa",
    "source": "VIA_OTA",
    "status": "published",
    "isActive": true,
    "location": "Munnar",
    "destination": "Munnar",
    "city": "Munnar",
    "state": "Kerala",
    "country": "India",
    "address": "",
    "mapQuery": "Chithirapuram South, Anachal Road Chithirapuram, Munnar, Keralam 685565",
    "description": "The Munnar Queen is a 4-star eco-friendly mountain resort and spa situated in Chithirapuram, about 7 to 10 km from Munnar town in Kerala, India.",
    "image": "https://pix10.agoda.net/hotelImages/1270545/0/7f220d9264da5e676378d0bd7a7a2c14.jpg?va=1&ce=2&s=414x232",
    "coverImage": "https://pix10.agoda.net/hotelImages/1270545/0/7f220d9264da5e676378d0bd7a7a2c14.jpg?va=1&ce=2&s=414x232",
    "gallery": [],
    "amenities": [
      "Restaurant",
      "Outdoor Pool",
      "Rooftop Dining",
      "Fitness Centre",
      "Room Service",
      "Free Wi-Fi",
      "Oceanfront Suites",
      "Private Balconies",
      "Heritage Architecture",
      "Mountain Views",
      "Family Friendly"
    ],
    "highlights": [],
    "featured": false,
    "contactDetails": {
      "phone": "+91 90485 33333",
      "email": "bookings@munnarqueen.in",
      "website": "https://www.munnarqueen.in/contact-munnar-queen.php"
    }
  },
  {
    "id": 14,
    "_id": "6ae578e59e2b744d659e9c15",
    "internalId": "CHIS-14",
    "slug": "gokulam-park-munnar",
    "name": "Gokulam Park Munnar",
    "title": "Gokulam Park Munnar",
    "source": "VIA_OTA",
    "status": "published",
    "isActive": true,
    "location": "Munnar",
    "destination": "Munnar",
    "city": "Munnar",
    "state": "Kerala",
    "country": "India",
    "address": "",
    "mapQuery": "South, Chithirapuram Powerhouse Road, Road, Munnar, Chithirapuram, Keralam 685565",
    "description": "Gokulam Park Munnar is a 4-star hillside hotel located in Chithirapuram, Power House Road, Munnar, Kerala",
    "image": "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/15/b6/13/b4/gokulam-park-munnar.jpg?w=900&h=-1&s=1",
    "coverImage": "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/15/b6/13/b4/gokulam-park-munnar.jpg?w=900&h=-1&s=1",
    "gallery": [],
    "amenities": [
      "Restaurant",
      "Outdoor Pool",
      "Free Wi-Fi",
      "Private Balconies",
      "Heritage Architecture",
      "Family Friendly",
      "Mountain Views",
      "Rooftop Dining",
      "Fitness Centre",
      "Room Service"
    ],
    "highlights": [],
    "featured": false,
    "contactDetails": {
      "phone": "+91 70252 50706",
      "email": "rsv.munnar@gokulamhotels.com",
      "website": "https://gokulamhotels.com/gokulam-park-munnar-location"
    }
  },
  {
    "id": 15,
    "_id": "6ae57ac623a15c4214b5fc80",
    "internalId": "CHIS-15",
    "slug": "country-holidays-resorts-hassan-valley-shimla",
    "name": "Country Holidays Resorts Hassan Valley Shimla",
    "title": "Country Holidays Resorts Hassan Valley Shimla",
    "source": "VIA_OTA",
    "status": "published",
    "isActive": true,
    "location": "Shimla, Himachal Pradesh 171012",
    "destination": "Shimla",
    "city": "Shimla",
    "state": "Himachal Pradesh",
    "country": "India",
    "address": "",
    "mapQuery": "Hassan Valley, Village Gawai, P.O. Maloothi, Patgehar Road, near Dhalli, Shimla, Himachal Pradesh 171012",
    "description": "Country Holidays Resorts Hassan Valley is a 3-star forest and hill resort located in the scenic Hassan Valley near Dhalli, along the Kufri hill ranges in Shimla, Himachal Pradesh",
    "image": "https://pix10.agoda.net/hotelImages/32661782/-1/b5bc3f189592bc9eabaca33484be72d6.png?ce=0&s=800x600",
    "coverImage": "https://pix10.agoda.net/hotelImages/32661782/-1/b5bc3f189592bc9eabaca33484be72d6.png?ce=0&s=800x600",
    "gallery": [],
    "amenities": [
      "Restaurant",
      "Free Wi-Fi",
      "Oceanfront Suites",
      "Mountain Views",
      "Family Friendly",
      "Heritage Architecture",
      "Private Balconies",
      "Rooftop Dining",
      "Fitness Centre",
      "Room Service"
    ],
    "highlights": [],
    "featured": false,
    "contactDetails": {
      "phone": "",
      "email": "",
      "website": ""
    }
  },
  {
    "id": 16,
    "_id": "6ae57bfd23a15c4214b5fc90",
    "internalId": "CHIS-16",
    "slug": "eulogia-inn",
    "name": "Eulogia Inn",
    "title": "Eulogia Inn",
    "source": "VIA_OTA",
    "status": "published",
    "isActive": true,
    "location": "Gota, Ahmedabad, Gujarat 382481",
    "destination": "Ahmedabad",
    "city": "Ahmedabad",
    "state": "Gujarat",
    "country": "India",
    "address": "",
    "mapQuery": "Beside Prime Status, Opp. Safal Vivan, Gota Bridge, Gota, Ahmedabad, Gujarat 382481",
    "description": "Eulogia Inn is a 4-star, pure-vegetarian boutique and business hotel located near the Gota Bridge on the Sarkhej-Gandhinagar (S.G.) Highway in Ahmedabad, Gujarat",
    "image": "https://www.dsspm.com/wp-content/uploads/2021/06/hotel-grand-elulogia-b.jpg",
    "coverImage": "https://www.dsspm.com/wp-content/uploads/2021/06/hotel-grand-elulogia-b.jpg",
    "gallery": [],
    "amenities": [
      "Restaurant",
      "Fitness Centre",
      "Room Service",
      "Rooftop Dining",
      "Outdoor Pool",
      "Private Balconies",
      "Heritage Architecture",
      "Oceanfront Suites",
      "Mountain Views",
      "Family Friendly"
    ],
    "highlights": [],
    "featured": false,
    "contactDetails": {
      "phone": "+91 72111 98891",
      "email": "info@eulogiainn.com",
      "website": "https://eulogiainn.com/contact.html"
    }
  },
  {
    "id": 17,
    "_id": "6ae57e9823a15c4214b5fcb4",
    "internalId": "CHIS-17",
    "slug": "winsome-resort-spa",
    "name": "Winsome Resort & Spa",
    "title": "Winsome Resort & Spa",
    "source": "VIA_OTA",
    "status": "published",
    "isActive": true,
    "location": "Jim Corbett, Khempur, Uttarakhand 244715",
    "destination": "Jim Corbett",
    "city": "Khempur",
    "state": "Uttarakhand",
    "country": "India",
    "address": "",
    "mapQuery": "Vilage Nandpur, Choi, Gabua (Near Dabka River Jim Corbett National Park, Khempur, Uttarakhand 244715",
    "description": "Winsome Resort & Spa is a 4-star luxury property spanning 17 bighas near the boundary of Jim Corbett National Park in Uttarakhand",
    "image": "https://www.winsomeresorts.com/images/photos/3.jpg",
    "coverImage": "https://www.winsomeresorts.com/images/photos/3.jpg",
    "gallery": [],
    "amenities": [
      "Restaurant",
      "Fitness Centre",
      "Room Service",
      "Rooftop Dining",
      "Free Wi-Fi",
      "Private Balconies",
      "Heritage Architecture",
      "Oceanfront Suites",
      "Mountain Views",
      "Family Friendly"
    ],
    "highlights": [],
    "featured": false,
    "contactDetails": {
      "phone": "",
      "email": "",
      "website": ""
    }
  },
  {
    "id": 101,
    "internalId": "CHIS-PROP-1001",
    "slug": "harbor-ridge-retreat",
    "name": "Harbor Ridge Retreat",
    "title": "Harbor Ridge Retreat",
    "source": "VIA_OTA",
    "status": "published",
    "isActive": true,
    "location": "Maui, Hawaii",
    "destination": "Hawaii",
    "city": "Maui",
    "state": "Hawaii",
    "country": "United States",
    "description": "An oceanside hideaway blending relaxed luxury, sunrise views, and comfortable gathering spaces for restorative escapes.",
    "image": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
    "coverImage": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
    "gallery": [],
    "amenities": [
      "Oceanfront Suites",
      "Outdoor Dining",
      "Spa Access",
      "Family Friendly",
      "Infinity Pool"
    ],
    "highlights": [
      "Oceanfront sunrise vistas",
      "Curated wellness spa"
    ],
    "featured": true
  },
  {
    "id": 102,
    "internalId": "CHIS-PROP-1002",
    "slug": "cypress-cove-hotel",
    "name": "Cypress Cove Hotel",
    "title": "Cypress Cove Hotel",
    "source": "VIA_OTA",
    "status": "published",
    "isActive": true,
    "location": "Big Sur, California",
    "destination": "California Coast",
    "city": "Big Sur",
    "state": "California",
    "country": "United States",
    "description": "A calming coastal property surrounded by cliffs and redwood vistas, designed for slow mornings and scenic afternoons.",
    "image": "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80",
    "coverImage": "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80",
    "gallery": [],
    "amenities": [
      "Private Balconies",
      "Wellness Studio",
      "Sunset Lounge"
    ],
    "highlights": [
      "Pacific Ocean cliffside views"
    ],
    "featured": true
  },
  {
    "id": 103,
    "internalId": "CHIS-PROP-1003",
    "slug": "amber-glen-suites",
    "name": "Amber Glen Suites",
    "title": "Amber Glen Suites",
    "source": "VIA_OTA",
    "status": "published",
    "isActive": true,
    "location": "Aspen, Colorado",
    "destination": "Colorado",
    "city": "Aspen",
    "state": "Colorado",
    "country": "United States",
    "description": "A cozy mountain lodge elevated with soft textures, fireside lounges, and direct access to crisp alpine paths.",
    "image": "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80",
    "coverImage": "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80",
    "gallery": [],
    "amenities": [
      "Heated Pool",
      "Ski Storage",
      "Fireside Lounges"
    ],
    "highlights": [
      "Snow-capped peak panoramas"
    ],
    "featured": true
  },
  {
    "id": 104,
    "internalId": "CHIS-PROP-1004",
    "slug": "sapphire-bay-resort",
    "name": "Sapphire Bay Resort",
    "title": "Sapphire Bay Resort",
    "source": "VIA_OTA",
    "status": "published",
    "isActive": true,
    "location": "Cancún Coast, Mexico",
    "destination": "Mexico",
    "city": "Cancun",
    "state": "Quintana Roo",
    "country": "Mexico",
    "description": "Tropical warmth, quiet sun decks, and curated dining experiences set right along the white-sand coastline.",
    "image": "https://images.unsplash.com/photo-1493558103817-58b2924bce98?auto=format&fit=crop&w=1200&q=80",
    "coverImage": "https://images.unsplash.com/photo-1493558103817-58b2924bce98?auto=format&fit=crop&w=1200&q=80",
    "gallery": [],
    "amenities": [
      "Private Beach Access",
      "Infinity Pool",
      "Cabana Service"
    ],
    "highlights": [
      "Caribbean turquoise views"
    ],
    "featured": true
  }
]

export const getAllResorts = () => {
  const custom = getCustomResorts()
  if (!custom || custom.length === 0) return initialResorts
  const mergedMap = new Map()
  initialResorts.forEach((r) => mergedMap.set(String(r.id || r._id || r.slug), r))
  custom.forEach((c) => mergedMap.set(String(c.id || c._id || c.slug), { ...mergedMap.get(String(c.id)), ...c }))
  return Array.from(mergedMap.values())
}

export const resorts = getAllResorts()

export const getResortBySlug = (slug) => {
  const all = getAllResorts()
  return all.find((r) => r.slug === slug || String(r.id) === String(slug) || String(r._id) === String(slug))
}
