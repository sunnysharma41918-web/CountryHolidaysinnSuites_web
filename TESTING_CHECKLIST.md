# Country Holidays Inn & Suites - Testing & Verification Checklist

Use this checklist to verify functionality, security controls, and end-to-end integration across the admin panel, backend API, and public website.

---

## 1. Authentication & Session Security
- [ ] **Admin Login**:
  - Visit `/admin/login` on the frontend.
  - Test valid credentials (`admin@countryholidaysinnsuites.com` / seeded password).
  - Confirm redirect to `/admin/dashboard`.
  - Confirm `chis_admin_token` cookie is set with `HttpOnly` and `SameSite` flags.
- [ ] **Invalid Credentials**:
  - Enter incorrect email or password.
  - Verify descriptive error alert ("Invalid email or password credentials").
  - Confirm no user existence leakage or sensitive stack traces.
- [ ] **Route Protection**:
  - Attempt accessing `/admin/dashboard` or `/admin/properties` in an incognito/logged-out window.
  - Verify immediate redirect to `/admin/login`.
- [ ] **Forgot Password Flow**:
  - Visit `/admin/forgot-password`.
  - Submit admin email.
  - Confirm success notice. In development, verify the generated reset token link printed to the server terminal.
  - Open `/admin/reset-password/<token>` and save a new password.
  - Verify ability to sign in with the new password.
- [ ] **Admin Logout**:
  - Click the **Logout** button in the sidebar or top bar.
  - Verify cookie is cleared and user is redirected to `/admin/login`.

---

## 2. Admin Dashboard & Metrics
- [ ] **KPI Metrics Verification**:
  - Confirm Total Properties count matches database/catalog records.
  - Verify breakdown of Published, Draft, and Archived stays.
  - Confirm active stays counter reflects active toggle status.
- [ ] **OTA Source Distribution Card**:
  - Confirm visual progress bars and percentage calculation for `VIA_OTA` vs `VIA_OTA_EXCHANGE`.
- [ ] **Destination Inventory**:
  - Confirm property counts per destination (e.g. Agra, Hawaii, Colorado).
- [ ] **Recent Audit Feed**:
  - Confirm recent admin events (logins, property edits) display in the dashboard timeline.
- [ ] **Refresh Button**:
  - Click **Refresh** and verify smooth metric reload without page refresh.

---

## 3. Properties Management (CRUD & Workflow)
- [ ] **Search & Multi-Filter**:
  - Search by property name (e.g., "Grand Imperial"). Confirm instant table filtering.
  - Filter by status tab (`Published`, `Draft`, `Archived`). Verify correct row filtering.
  - Filter by Source (`VIA OTA` vs `VIA OTA EXCHANGE`).
  - Filter by Destination (`Agra`, `Hawaii`, etc.).
- [ ] **Create New Property (`/admin/properties/new`)**:
  - Fill in Name, click **Generate from Name** for URL slug.
  - Enter Internal Property ID or leave empty for auto-generation.
  - Select Source (`VIA_OTA` or `VIA_OTA_EXCHANGE`).
  - Enter External OTA ID (e.g., `OTA-TEST-101`).
  - Enter Destination, Display Location, and Address.
  - Enter Description and add 2–3 highlights.
  - Click amenity tags to add/remove amenities.
  - Add Cover Image URL and verify live preview renders immediately.
  - Add 2 gallery image URLs and verify gallery preview thumbnails.
  - Set status to `draft` or `published`.
  - Click **Create Property**. Confirm success notification and redirect.
- [ ] **Quick Status Transitions**:
  - Change property status from the table dropdown (e.g., Draft to Published).
  - Verify status badge color updates dynamically (Green = Published, Amber = Draft, Gray = Archived).
- [ ] **Active Toggle**:
  - Click the Active switch on any property row.
  - Confirm immediate update and notification banner.
- [ ] **Quick View Modal**:
  - Click the **Eye** icon on any property row.
  - Verify modal opens showing cover photo, identifiers, amenities, gallery, and contact info.
- [ ] **Edit Property (`/admin/properties/:id/edit`)**:
  - Modify description, add a new highlight or amenity.
  - Save changes and verify updates persist in both table and database.
- [ ] **Safe Archival**:
  - Click the **Archive** button on a published property.
  - Confirm the safe archive confirmation dialog appears.
  - Click **Safely Archive**. Verify status transitions to `archived` and property is unlisted from public guest searches.

---

## 4. Audit Trail & Governance
- [ ] **Audit Log Recording**:
  - Visit `/admin/audit-logs`.
  - Confirm audit entries exist for:
    - `AUTH_LOGIN`
    - `PROPERTY_CREATE`
    - `PROPERTY_UPDATE`
    - `PROPERTY_STATUS_CHANGE`
- [ ] **Payload Diff Inspector**:
  - Click **Inspect** on any `PROPERTY_UPDATE` log row.
  - Verify the JSON modal displays the exact attributes changed (`from` vs `to`).
- [ ] **Audit Filters**:
  - Filter by action type (e.g., `PROPERTY_STATUS_CHANGE`).
  - Confirm only relevant event records display.

---

## 5. Public Website Integration & Resilience
- [ ] **Curated Resorts Page (`/resorts`)**:
  - Navigate to `/resorts` on the public website.
  - Confirm all active, published properties are displayed.
  - Verify search bar filters live properties.
  - Verify destination pill filters work.
  - Verify draft and archived properties are **NEVER** displayed to public visitors.
- [ ] **Resort Details Page (`/resorts/:slug`)**:
  - Click **View retreat** on any card.
  - Verify high-resolution cover image, location, highlights, destination guide, amenities, Google map embed, and related stays render properly.
- [ ] **Featured Stays on Homepage (`/`)**:
  - Navigate to `/`.
  - Verify the "Featured stays" section renders active featured properties from the API.
- [ ] **Destination Properties Page (`/destinations/:slug`)**:
  - Open any destination (e.g., `/destinations/agra`).
  - Verify the "Places to stay" section dynamically shows stays matching that destination.
- [ ] **Offline Fallback Resilience**:
  - If backend is stopped or MongoDB Atlas connection is pending, verify public website falls back gracefully to baseline properties without breaking or showing white-screens.
