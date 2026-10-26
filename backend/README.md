# Country Holidays Inn & Suites — Property Management Backend

A production-ready Node.js & Express REST API for **Country Holidays Inn & Suites (CHISS)**. Manages properties, rooms, destinations, customer enquiries, and role-based administrative accounts with MongoDB Atlas integration.

---

## Features
- **Architecture**: ES Modules (`import/export`), Express 4, Mongoose 8
- **Authentication**: JWT authentication with HTTP-only cookies and Authorization header support
- **Role-Based Access Control**: `super_admin`, `admin`, `editor` permissions
- **Security**:
  - Helmet HTTP security headers
  - Express Mongo Sanitize (NoSQL injection prevention)
  - Express Rate Limit (DDoS / brute force prevention)
  - CORS with configurable origins
- **Database**: MongoDB Atlas Free Tier (M0) compatible
- **Audit Logging**: Tracks administrative activity (create, update, delete properties)

---

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Create `.env` from `.env.example`:
```bash
cp .env.example .env
```
Fill in your `MONGODB_URI` and `JWT_SECRET`.

### 3. Seed Database
```bash
# Seed initial administrator account (Username: admin, Password: Admin@CHIS2026!)
npm run seed:admin

# Seed standard properties and resorts
npm run seed:properties
```

### 4. Start Server
```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```
The server will start on port `5000` (or `PORT` specified in `.env`).

---

## API Endpoints Overview

### Authentication
- `POST /api/auth/login` - Admin login (Username or Email)
- `GET /api/auth/me` - Current session profile
- `POST /api/auth/logout` - Invalidate session

### Properties
- `GET /api/properties` - List all properties (supports pagination, filtering by destination/category, search)
- `GET /api/properties/:slug` - Get single property details
- `POST /api/properties` - Create property (Admin/SuperAdmin)
- `PUT /api/properties/:id` - Update property (Admin/SuperAdmin)
- `DELETE /api/properties/:id` - Delete property (SuperAdmin)

### Audit & System
- `GET /api/audit-logs` - Administrative audit logs
- `GET /api/health` - Server health and database connection status

---

## Deployment
See [DEPLOYMENT.md](DEPLOYMENT.md) for step-by-step instructions for deploying to cloud providers (Render, Railway, DigitalOcean, etc.).
