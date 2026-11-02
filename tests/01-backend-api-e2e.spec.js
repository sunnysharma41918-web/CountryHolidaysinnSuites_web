// @ts-check
import { test, expect } from '@playwright/test'

const RENDER_BASE = 'https://chis-2mji.onrender.com/api'
const ADMIN_EMAIL = 'admin@countryholidaysinnsuites.com'
const ADMIN_PASSWORD = 'Admin@CHIS2026!'

test.describe('Suite 1: Render Backend & MongoDB Atlas API E2E', () => {
  let adminToken = ''
  let createdPropertyId = ''

  test('1.1 Health Check - Backend is online and MongoDB is connected', async ({ request }) => {
    const res = await request.get(`${RENDER_BASE}/health`)
    expect(res.ok()).toBeTruthy()
    const data = await res.json()
    expect(data.status).toBe('ok')
    expect(data.database).toBeDefined()
    expect(data.database.connected).toBe(true)
    expect(data.database.state).toBe('connected')
  })

  test('1.2 Auth Login - Rejects invalid credentials with 401', async ({ request }) => {
    const res = await request.post(`${RENDER_BASE}/auth/login`, {
      data: {
        email: ADMIN_EMAIL,
        password: 'WrongPassword123!',
      },
    })
    expect(res.status()).toBe(401)
    const data = await res.json()
    expect(data.success).toBe(false)
  })

  test('1.3 Auth Login - Successfully authenticates Super Admin and issues JWT', async ({ request }) => {
    const res = await request.post(`${RENDER_BASE}/auth/login`, {
      data: {
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
      },
    })
    expect(res.ok()).toBeTruthy()
    const data = await res.json()
    expect(data.success).toBe(true)
    expect(data.token).toBeDefined()
    expect(data.user).toBeDefined()
    expect(data.user.role).toBe('super_admin')
    expect(data.user.email).toBe(ADMIN_EMAIL)
    adminToken = data.token
  })

  test('1.4 Public Properties - Returns published properties with pagination', async ({ request }) => {
    const res = await request.get(`${RENDER_BASE}/properties`)
    expect(res.ok()).toBeTruthy()
    const data = await res.json()
    expect(data.success).toBe(true)
    expect(Array.isArray(data.properties)).toBe(true)
    expect(data.total).toBeGreaterThanOrEqual(17)
    expect(data.properties.length).toBeGreaterThan(0)

    // Verify schema shape
    const sample = data.properties[0]
    expect(sample.name).toBeDefined()
    expect(sample.destination).toBeDefined()
    expect(sample.status).toBe('published')
    expect(sample.isActive).toBe(true)
  })

  test('1.5 Public Properties - Filters by destination (Goa returns 7 properties)', async ({ request }) => {
    const res = await request.get(`${RENDER_BASE}/properties?destination=Goa`)
    expect(res.ok()).toBeTruthy()
    const data = await res.json()
    expect(data.success).toBe(true)
    expect(Array.isArray(data.properties)).toBe(true)
    expect(data.properties.length).toBeGreaterThanOrEqual(7)
    for (const prop of data.properties) {
      expect(prop.destination.toLowerCase()).toBe('goa')
    }
  })

  test('1.6 Admin Dashboard Stats - Returns real database counts (isFallback: false)', async ({ request }) => {
    expect(adminToken).toBeTruthy()
    const res = await request.get(`${RENDER_BASE}/admin/stats`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    })
    expect(res.ok()).toBeTruthy()
    const data = await res.json()
    expect(data.success).toBe(true)
    expect(data.stats).toBeDefined()
    expect(data.stats.totalProperties).toBeGreaterThanOrEqual(17)
    expect(data.stats.isFallback).toBe(false)
  })

  test('1.7 Property CRUD - Create, Read, Update, and Safely Delete test record', async ({ request }) => {
    expect(adminToken).toBeTruthy()

    // 1. CREATE test property
    const uniqueSlug = `test-resort-${Date.now()}`
    const createRes = await request.post(`${RENDER_BASE}/admin/properties`, {
      headers: {
        Authorization: `Bearer ${adminToken}`,
        'Content-Type': 'application/json',
      },
      data: {
        name: '[TEST_E2E] Automated Test Resort',
        slug: uniqueSlug,
        destination: 'Goa',
        location: 'Calangute, North Goa',
        city: 'Calangute',
        state: 'Goa',
        country: 'India',
        description: 'Temporary automated test property created by Playwright E2E suite.',
        image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800',
        coverImage: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800',
        status: 'draft',
        isActive: false,
        source: 'VIA_OTA',
        amenities: ['Free Wi-Fi', 'Swimming Pool'],
      },
    })

    expect(createRes.ok()).toBeTruthy()
    const createData = await createRes.json()
    expect(createData.success).toBe(true)
    expect(createData.property).toBeDefined()
    createdPropertyId = createData.property._id || createData.property.id
    expect(createdPropertyId).toBeTruthy()

    // 2. READ by ID
    const getRes = await request.get(`${RENDER_BASE}/admin/properties/${createdPropertyId}`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    })
    expect(getRes.ok()).toBeTruthy()
    const getData = await getRes.json()
    expect(getData.property.name).toBe('[TEST_E2E] Automated Test Resort')

    // 3. UPDATE property
    const updateRes = await request.patch(`${RENDER_BASE}/admin/properties/${createdPropertyId}`, {
      headers: {
        Authorization: `Bearer ${adminToken}`,
        'Content-Type': 'application/json',
      },
      data: {
        description: 'Updated test description by Playwright suite.',
      },
    })
    expect(updateRes.ok()).toBeTruthy()
    const updateData = await updateRes.json()
    expect(updateData.success).toBe(true)

    // 4. CLEANUP / PERMANENT DELETE (zero residue in production database)
    const deleteRes = await request.delete(`${RENDER_BASE}/admin/properties/${createdPropertyId}?permanent=true`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    })
    expect(deleteRes.ok()).toBeTruthy()
    const deleteData = await deleteRes.json()
    expect(deleteData.success).toBe(true)
  })

  test('1.8 Audit Logs - Trail records admin action', async ({ request }) => {
    expect(adminToken).toBeTruthy()
    const res = await request.get(`${RENDER_BASE}/admin/audit-logs`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    })
    expect(res.ok()).toBeTruthy()
    const data = await res.json()
    expect(data.success).toBe(true)
    expect(Array.isArray(data.logs)).toBe(true)
    expect(data.logs.length).toBeGreaterThan(0)
  })
})
