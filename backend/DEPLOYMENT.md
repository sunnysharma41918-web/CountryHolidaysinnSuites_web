# Country Holidays Inn & Suites - Production Deployment Guide

This guide walks through configuring and deploying the **Country Holidays Inn & Suites** Property Management Backend and Admin Panel using **MongoDB Atlas Free Tier (M0)** and cloud hosting platforms (e.g. Render, Railway, Vercel, Netlify).

---

## 1. MongoDB Atlas Free Tier Setup

1. **Sign Up / Log In**:
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) and create an account.
2. **Create a Free Cluster**:
   - Choose the **M0 Free Tier** (512 MB storage, shared RAM, free forever).
   - Select your preferred cloud provider and closest region (e.g., AWS / Mumbai `ap-south-1`).
   - Click **Create Cluster**.
3. **Configure Database Access (Least-Privilege User)**:
   - In Atlas left sidebar, navigate to **Security** > **Database Access**.
   - Click **Add New Database User**.
   - Authentication Method: **Password**.
   - Create a username (e.g., `chis_db_admin`) and a strong auto-generated password.
   - Database User Privileges: Select **Read and write to any database** (or restrict strictly to `chis_db`).
   - Save the user.
4. **Configure Network Access (IP Whitelist)**:
   - Navigate to **Security** > **Network Access**.
   - Click **Add IP Address**.
   - For hosting platforms with dynamic IPs (e.g. Render, Vercel), add `0.0.0.0/0` (Allow access from anywhere).
   - For dedicated servers, whitelist your server's static IP.
5. **Retrieve Connection String**:
   - Go to **Database Deployments** > Click **Connect** on your cluster.
   - Select **Drivers** > Node.js (version 5.5 or later).
   - Copy the SRV connection string:
     ```
     mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/chis_db?retryWrites=true&w=majority
     ```
   - Replace `<username>` and `<password>` with your database user credentials.

---

## 2. Backend Setup & Seeding

### Environment Variables (`backend/.env`)
Copy `backend/.env.example` to `backend/.env` and fill in the values:

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://chis_db_admin:<password>@cluster0.xxxxx.mongodb.net/chis_db?retryWrites=true&w=majority
JWT_SECRET=YOUR_SUPER_LONG_RANDOM_SECRET_KEY_MIN_32_CHARS
JWT_EXPIRES_IN=7d
CLIENT_URL=https://your-frontend-domain.com

# Initial Super Admin Seed Credentials
ADMIN_SEED_EMAIL=admin@countryholidaysinnsuites.com
ADMIN_SEED_PASSWORD=SecurePassword2026!
ADMIN_SEED_NAME=Principal Administrator

# Optional SMTP Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-specific-password
SMTP_FROM=Country Holidays Inn & Suites <noreply@countryholidaysinnsuites.com>
```

### Seeding Initial Data
Run the following commands in the `backend/` folder:

1. **Seed the Super Admin account**:
   ```bash
   npm run seed:admin
   ```
2. **Seed Initial Resort Catalog** (Imports the 7 baseline properties into MongoDB):
   ```bash
   npm run seed:properties
   ```

---

## 3. Production Deployment Options

### Backend Hosting (e.g., Render / Railway / Node Server)
- **Root Directory**: `backend`
- **Build Command**: `npm install`
- **Start Command**: `node server.js`
- **Environment Variables**: Add all variables defined in `backend/.env`.

### Frontend Hosting (e.g., Vercel / Netlify / Cloudflare Pages)
- **Root Directory**: `CountryHolidaysinnSuites_web`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Environment Variables**:
  - `VITE_API_URL`: `https://your-backend-api-domain.com/api` (Leave empty or set to `/api` if using a reverse proxy or same-origin rewrite).

---

## 4. Security Hardening Checklist
- [x] Passwords hashed with bcrypt (salt rounds: 12)
- [x] JWT sessions issued with secure HttpOnly and SameSite cookies
- [x] Helmet security headers configured
- [x] express-mongo-sanitize enabled to neutralize NoSQL operator injection
- [x] Rate limiting on authentication routes (15 requests / 15 mins) and general API (500 requests / 15 mins)
- [x] Password field excluded by default in User model (`select: false`)
- [x] Public property queries restricted strictly to `status: 'published'` and `isActive: true`
- [x] Whitelisted payload attributes in Property creation/updates to prevent mass assignment
- [x] All admin actions (creates, updates, status changes, archives) logged with user ID, diff, IP, and timestamp
