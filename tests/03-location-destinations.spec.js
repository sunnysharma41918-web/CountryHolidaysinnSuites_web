import { test, expect } from '@playwright/test'

test.describe('Suite 3: Location-Wise Destinations & Property Displays', () => {
  test('3.1 Goa Destination - Displays all live Goa resorts', async ({ page }) => {
    await page.goto('/destinations/goa')

    // Wait for properties to load
    await page.waitForLoadState('networkidle')

    // Verify destination title
    await expect(page.locator('h1, h2').filter({ hasText: /Goa/i }).first()).toBeVisible()

    // Assert that resort cards are rendered (not empty 0 stays)
    const resortCards = page.locator('article, .group:has(h3)')
    const cardCount = await resortCards.count()
    expect(cardCount).toBeGreaterThanOrEqual(1)

    // Check specific known Goa resort names
    const pageText = await page.innerText('body')
    const hasGoaResort =
      pageText.includes('Mayfair') ||
      pageText.includes('Red Fox') ||
      pageText.includes('Bell Bottoms') ||
      pageText.includes('White Woods') ||
      pageText.includes('Stone Wood') ||
      pageText.includes('Neelams')
    expect(hasGoaResort).toBe(true)
  })

  test('3.2 Munnar Destination - Displays Munnar properties', async ({ page }) => {
    await page.goto('/destinations/munnar')
    await page.waitForLoadState('networkidle')

    const pageText = await page.innerText('body')
    const hasMunnarResort = pageText.includes('Munnar Queen') || pageText.includes('Gokulam Park')
    expect(hasMunnarResort).toBe(true)
  })

  test('3.3 Shimla Destination - Displays Shimla property', async ({ page }) => {
    await page.goto('/destinations/shimla')
    await page.waitForLoadState('networkidle')

    const pageText = await page.innerText('body')
    const hasShimlaResort = pageText.includes('Hassan Valley') || pageText.includes('Shimla')
    expect(hasShimlaResort).toBe(true)
  })

  test('3.4 Jaisalmer Destination - Displays Jaisalmer properties', async ({ page }) => {
    await page.goto('/destinations/jaisalmer')
    await page.waitForLoadState('networkidle')

    const pageText = await page.innerText('body')
    const hasJaisalmerResort = pageText.includes('Desert Palace') || pageText.includes('Chokhi Dhani')
    expect(hasJaisalmerResort).toBe(true)
  })

  test('3.5 Category Browsing - VIA OTA lists destinations without error', async ({ page }) => {
    await page.goto('/destinations/category/via-ota')
    await page.waitForLoadState('networkidle')

    // Check destination cards
    const destinationLinks = page.locator('a[href*="/destinations/"]')
    expect(await destinationLinks.count()).toBeGreaterThan(5)
  })
})

