import { test, expect } from '@playwright/test'

const ADMIN_EMAIL = 'admin@countryholidaysinnsuites.com'
const ADMIN_PASSWORD = 'Admin@CHIS2026!'

test.describe('Suite 5: Admin Portal Authentication & Management E2E', () => {
  test('5.1 Route Protection - Unauthenticated /admin redirects to login', async ({ page }) => {
    // Clear any existing localStorage token
    await page.goto('/login')
    await page.evaluate(() => localStorage.clear())

    await page.goto('/admin')
    await page.waitForLoadState('networkidle')
    expect(page.url()).toContain('/admin/login')
  })

  test('5.2 Admin Login - Invalid credentials show error notification', async ({ page }) => {
    await page.goto('/admin/login')
    await page.waitForLoadState('networkidle')
    await page.fill('input#username', 'invalid@user.com')
    await page.fill('input#password', 'WrongPassword!')
    await page.click('button[type="submit"]')

    // Alert or error message should be displayed
    const errorBanner = page.locator('.text-red-700, .bg-red-50, [role="alert"]')
    await expect(errorBanner.first()).toBeVisible({ timeout: 10000 })
  })

  test('5.3 Full Admin Lifecycle - Login, Dashboard KPIs, Properties Table, Navigation & Logout', async ({ page }) => {
    test.setTimeout(75000)

    // 1. LOGIN
    await page.goto('/admin/login')
    await page.waitForLoadState('networkidle')
    await page.fill('input#username', ADMIN_EMAIL)
    await page.fill('input#password', ADMIN_PASSWORD)
    await page.click('button[type="submit"]')

    // Wait for redirect to dashboard (ensure it has moved past /admin/login)
    await page.waitForURL((url) => !url.pathname.includes('/login') && url.pathname.startsWith('/admin'), { timeout: 35000 })
    expect(page.url()).not.toContain('/login')

    // 2. DASHBOARD
    await expect(page.locator('h1')).toContainText('Dashboard', { timeout: 25000 })
    await expect(page.locator('aside')).toContainText('Principal Administrator', { timeout: 15000 })

    // 3. PROPERTIES TABLE
    await page.goto('/admin/properties')
    await page.waitForLoadState('networkidle')

    // Verify property rows exist
    const rows = page.locator('table tbody tr')
    const rowCount = await rows.count()
    expect(rowCount).toBeGreaterThanOrEqual(1)

    // Verify search works
    const searchInput = page.locator('input[placeholder*="Search" i], input[type="search"]')
    if (await searchInput.isVisible()) {
      await searchInput.fill('Goa')
      // Wait for table to update with search results
      await expect(page.locator('table tbody')).toContainText(/Goa|Mayfair/i, { timeout: 15000 })
    }

    // 4. AUDIT LOGS PAGE
    await page.goto('/admin/audit-logs')
    await page.waitForLoadState('networkidle')
    await expect(page.locator('body')).toContainText(/audit/i, { timeout: 15000 })

    // 5. LOGOUT
    const logoutBtn = page.locator('button:has-text("Log out"), button:has-text("Logout"), button:has-text("Sign Out")')
    if (await logoutBtn.first().isVisible()) {
      await logoutBtn.first().click()
      await page.waitForURL((url) => url.pathname.includes('/admin/login'), { timeout: 15000 })
      expect(page.url()).toContain('/admin/login')
    }
  })
})
