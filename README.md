# Country Holidays Inn & Suites (CHIS) — Web Platform

Comprehensive full-stack web application for **Country Holidays Inn & Suites (CHIS)**, featuring resort catalogs, membership packages, interactive travel experiences, inquiry management, and an administrative control portal.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite 8, Tailwind CSS 3.4, Framer Motion 14, GSAP, Lenis Smooth Scroll
- **Backend**: Node.js (ESM), Express.js 4, Mongoose 8, MongoDB Atlas
- **Security**: JWT Authentication (HTTP-only cookies & Bearer tokens), Helmet, Rate Limiting, Mongo Sanitize, Bcryptjs
- **Typography**: Custom fonts **Rader** (headings) & **Varela Round** (body text)
- **Brand Palette**: Forest Green (`#096c27`), Emerald (`#297f33`), Lime (`#b3d565`), Warm Canvas (`#fbfdfa`)

---

## 🚀 Quick Start

### 1. Frontend Setup
```bash
# Navigate to the project root
cd CountryHolidaysinnSuites_web

# Install dependencies
npm install

# Start Vite dev server
npm run dev
# Running on http://localhost:5173
```

### 2. Backend Setup
```bash
# Navigate to the backend directory
cd CountryHolidaysinnSuites_web/backend

# Configure environment
cp .env.example .env
# Edit .env with your MONGODB_URI and JWT_SECRET

# Install dependencies
npm install

# Seed Admin & Resort Data
npm run seed:admin
# Default Admin: admin@countryholidaysinnsuites.com / Admin@CHIS2026!

npm run seed:properties

# Start API server
npm run dev
# Running on http://localhost:5000
```

### 3. Production Build
```bash
npm run build
# Compiles optimized bundle to /dist
```

---

## 🗺️ Key Routes

### Public Experience
- `/` — Homepage with video hero, resort highlights, deals ticker, and FAQs
- `/destinations` — Destination directory & category views (`/destinations/category/:category`)
- `/destinations/:slug` — Region-specific property showcase
- `/resorts` & `/resorts/:slug` — Resort listings, photo galleries, and room amenities
- `/vacation-packages` — Silver, Gold, and Platinum holiday club memberships
- `/experiences` / `/activity` — Adventure activities & the continuous sine wave process
- `/about` — Heritage, company milestones, and core values
- `/contact` — Direct inquiry capture with URL parameter pre-filling

### Admin Control Portal
- `/admin/login` — Secure administrator sign-in
- `/admin/dashboard` — Property, inquiry, and system health metrics
- `/admin/offers` — Flash deals, ticker announcement marquee, and festival greetings manager
- `/admin/properties` — Create, edit, and archive resort inventory
- `/admin/audit-logs` — Audit trail of modifications
- `/admin/system` — System status, database metrics, and cache controls

---

## 📞 Official Contacts
- **Headquarters**: 126, 1st Floor, Devika Tower 6, Nehru Place, New Delhi - 110019
- **Phone / WhatsApp**: +91 8130701133
- **Inquiries**: info@countryholidaysinnsuites.com
- **Customer Care**: customercare@countryholidaysinnsuites.com
