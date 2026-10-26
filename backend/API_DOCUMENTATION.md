# Country Holidays Inn & Suites - REST API Documentation

Base URL: `http://localhost:5000/api` (Development) or `https://api.yourdomain.com/api` (Production)

---

## 1. System & Health

### `GET /api/health`
Checks API and database operational status.
- **Access**: Public
- **Response**:
```json
{
  "status": "ok",
  "timestamp": "2026-10-26T07:15:00.000Z",
  "uptimeSeconds": 1284,
  "database": {
    "connected": true,
    "state": "connected"
  }
}
```

---

## 2. Authentication API (`/api/auth`)

### `POST /api/auth/login`
Signs in an administrator using email and password. Sets an `HttpOnly` cookie and returns a JWT token.
- **Access**: Public (Rate-limited: 15 req / 15 min)
- **Request Body**:
```json
{
  "email": "admin@countryholidaysinnsuites.com",
  "password": "SecurePassword2026!"
}
```
- **Response** (200 OK):
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "671cc81a1d9547d7a1b49120",
    "name": "Principal Administrator",
    "email": "admin@countryholidaysinnsuites.com",
    "role": "super_admin",
    "isActive": true,
    "lastLogin": "2026-10-26T07:15:00.000Z"
  }
}
```

### `POST /api/auth/logout`
Terminates the session and clears the authentication cookie.
- **Access**: Protected
- **Response** (200 OK):
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

### `GET /api/auth/me`
Retrieves details of the currently authenticated administrator.
- **Access**: Protected
- **Response** (200 OK):
```json
{
  "success": true,
  "user": {
    "id": "671cc81a1d9547d7a1b49120",
    "name": "Principal Administrator",
    "email": "admin@countryholidaysinnsuites.com",
    "role": "super_admin",
    "isActive": true
  }
}
```

### `POST /api/auth/forgot-password`
Initiates a secure password reset request with a one-time crypto token (valid for 1 hour).
- **Access**: Public (Rate-limited)
- **Request Body**:
```json
{
  "email": "admin@countryholidaysinnsuites.com"
}
```
- **Response** (200 OK):
```json
{
  "success": true,
  "message": "If a matching administrative account exists, a secure password reset link has been dispatched."
}
```

### `POST /api/auth/reset-password/:token`
Resets the administrator's password using the token sent via email.
- **Access**: Public (Rate-limited)
- **Request Body**:
```json
{
  "password": "NewSecurePassword2026!",
  "confirmPassword": "NewSecurePassword2026!"
}
```

---

## 3. Public Properties API (`/api/properties`)

Only returns properties where `status: "published"` and `isActive: true`.

### `GET /api/properties`
Fetches published resort listings with search, destination filtering, and pagination.
- **Access**: Public
- **Query Parameters**:
  - `search`: String (matches name, location, destination)
  - `destination`: String (e.g. `Agra`, `Hawaii`, `All`)
  - `featured`: Boolean (`true` or `false`)
  - `page`: Integer (default: `1`)
  - `limit`: Integer (default: `20`)
  - `sortBy`: String (default: `createdAt`)
  - `order`: `asc` or `desc` (default: `desc`)
- **Response** (200 OK):
```json
{
  "success": true,
  "count": 7,
  "total": 7,
  "page": 1,
  "totalPages": 1,
  "properties": [
    {
      "internalId": "CHIS-PROP-1001",
      "slug": "harbor-ridge-retreat",
      "name": "Harbor Ridge Retreat",
      "source": "VIA_OTA",
      "location": "Maui, Hawaii",
      "destination": "Hawaii",
      "description": "An oceanside hideaway blending relaxed luxury...",
      "image": "https://images.unsplash.com/...",
      "gallery": ["https://images.unsplash.com/..."],
      "amenities": ["Oceanfront Suites", "Spa Access"],
      "highlights": ["Oceanfront sunrise vistas"],
      "featured": true,
      "status": "published",
      "isActive": true
    }
  ]
}
```

### `GET /api/properties/:slugOrId`
Fetches a single published property by its unique slug or ObjectId.
- **Access**: Public
- **Response** (200 OK):
```json
{
  "success": true,
  "property": { ... },
  "relatedProperties": [ ... ]
}
```

---

## 4. Admin Management API (`/api/admin`)

All `/api/admin/*` endpoints require authentication via JWT cookie or `Authorization: Bearer <token>`.

### `GET /api/admin/stats`
Dashboard statistics and KPI metrics.
- **Access**: Protected (`super_admin`, `admin`, `editor`)
- **Response** (200 OK):
```json
{
  "success": true,
  "stats": {
    "totalProperties": 7,
    "publishedCount": 7,
    "draftCount": 0,
    "archivedCount": 0,
    "activeCount": 7,
    "inactiveCount": 0,
    "sourceBreakdown": {
      "VIA_OTA": 4,
      "VIA_OTA_EXCHANGE": 3
    },
    "destinationStats": [
      { "destination": "Agra", "count": 3 },
      { "destination": "Hawaii", "count": 1 }
    ],
    "recentActivity": [ ... ]
  }
}
```

### `GET /api/admin/properties`
Fetches all properties (including drafts and archived) with administrative filters.
- **Access**: Protected
- **Query Parameters**:
  - `status`: `All`, `published`, `draft`, `archived`
  - `source`: `All`, `VIA_OTA`, `VIA_OTA_EXCHANGE`
  - `destination`: String
  - `search`: String
  - `page`: Integer (default: `1`)
  - `limit`: Integer (default: `10`)

### `GET /api/admin/properties/:id`
Fetches complete property record and its related audit history.
- **Access**: Protected

### `POST /api/admin/properties`
Registers a new property.
- **Access**: Protected
- **Request Body**:
```json
{
  "name": "Grand Cliffside Retreat",
  "slug": "grand-cliffside-retreat",
  "internalId": "CHIS-PROP-1008",
  "source": "VIA_OTA",
  "externalId": "OTA-EXP-9921",
  "destination": "Agra",
  "location": "Near Taj East Gate, Agra, Uttar Pradesh",
  "city": "Agra",
  "state": "Uttar Pradesh",
  "country": "India",
  "description": "A luxury boutique property overlooking iconic landmarks...",
  "highlights": ["Direct monument access", "Panoramic rooftop pool"],
  "amenities": ["Outdoor Pool", "Restaurant", "Free Wi-Fi"],
  "image": "https://images.unsplash.com/photo-...",
  "gallery": ["https://images.unsplash.com/photo-..."],
  "status": "published",
  "isActive": true,
  "featured": true
}
```

### `PATCH /api/admin/properties/:id`
Updates an existing property. Automatically computes and records an audit log of modified attributes.
- **Access**: Protected

### `PATCH /api/admin/properties/:id/status`
Updates property status (`draft` | `published` | `archived`) or active state.
- **Access**: Protected
- **Request Body**:
```json
{
  "status": "published",
  "isActive": true
}
```

### `DELETE /api/admin/properties/:id`
Safely archives or permanently removes a property.
- **Access**:
  - Safe Archive: `admin`, `super_admin`
  - Permanent Delete: `super_admin` only (`?permanent=true`)

### `GET /api/admin/audit-logs`
Retrieves governance audit trail with pagination and filters.
- **Access**: Protected (`super_admin`, `admin`)
