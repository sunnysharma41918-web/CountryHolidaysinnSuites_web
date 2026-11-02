// @ts-check
import { test, expect } from '@playwright/test'

test.describe('Suite 6: Responsiveness, Layout Stability & Console Errors', () => {
  const routes = ['/', '/destinations', '/destinations/goa', '/vacation-packages', '/about', '/contact']

  for (const route of routes) {
    test(`6.1 Clean Console Check - ${route}`, async ({ page }) => {
      const pageErrors = []
      page.on('pageerror', (err) => {
        // Exclude third-party CDN / font tracking script warnings if any
        if (!err.message.includes('google-analytics') && !err.message.includes('clarity')) {
          pageErrors.push(err.message)
        }
      })

      await page.goto(route)
      await page.waitForLoadState('networkidle')
      expect(pageErrors, `Expected zero page errors on ${route}`).toEqual([])
    })
  }

  test('6.2 Mobile Viewport - Responsive layout without horizontal overflow', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Verify page content does not scroll horizontally
    const hasHorizontalOverflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth + 2
    })
    expect(hasHorizontalOverflow).toBe(false)
  })

  test('6.3 Mobile Viewport - Mobile navigation toggle operates smoothly', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Find mobile menu hamburger toggle
    const hamburger = page.locator('button[aria-label*="navigation menu" i], button[aria-label*="menu" i]').first()
    await expect(hamburger).toBeVisible({ timeout: 5000 })
    await hamburger.click()
    await page.waitForTimeout(400)
  })
})
