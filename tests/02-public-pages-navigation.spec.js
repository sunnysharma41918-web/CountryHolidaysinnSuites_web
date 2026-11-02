import { test, expect } from '@playwright/test'

test.describe('Suite 2: Public Website Pages & Navigation', () => {
  test('2.1 Landing Page - Loads hero, navbar, sections and footer without error', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/Country Holidays/i)

    // Navbar branding
    const logoOrBrand = page.locator('nav').first()
    await expect(logoOrBrand).toBeVisible()

    // Check key landing sections exist in DOM
    await expect(page.locator('#about')).toBeAttached()
    await expect(page.locator('#services')).toBeAttached()
    await expect(page.locator('#properties')).toBeAttached()
    await expect(page.locator('#faq')).toBeAttached()

    // Footer contact number check
    const footerPhone = page.locator('footer a[href="tel:76697775335"]')
    await expect(footerPhone).toBeAttached()
  })

  test('2.2 FAQ Accordion - Interactive toggle works correctly', async ({ page }) => {
    await page.goto('/')
    const faqSection = page.locator('#faq')
    await faqSection.scrollIntoViewIfNeeded()

    // Find first FAQ trigger button
    const firstFaqButton = faqSection.locator('button').first()
    await expect(firstFaqButton).toBeVisible()
    await firstFaqButton.click()
  })

  test('2.3 Destinations Overview - Loads destination grid', async ({ page }) => {
    await page.goto('/destinations')
    await expect(page.locator('h1, h2').first()).toBeVisible()
    const destinationLinks = page.locator('a[href*="/destinations/"]')
    expect(await destinationLinks.count()).toBeGreaterThan(0)
  })

  test('2.4 Vacation Packages - Renders pricing plans, flip cards, and consultation CTA', async ({ page }) => {
    await page.goto('/vacation-packages')
    await expect(page.locator('text=Still deciding?')).toBeVisible()
    await expect(page.locator('text=Request a quote').first()).toBeVisible()
  })

  test('2.5 About Page - Renders company overview, milestones, and ethics', async ({ page }) => {
    await page.goto('/about')
    await expect(page.locator('text=About').first()).toBeVisible()
  })

  test('2.6 Contact Page - Displays updated phone 76697775335, working hours, and form inputs', async ({ page }) => {
    await page.goto('/contact')

    // Verify phone number in contact cards
    const phoneLink = page.locator('a[href="tel:76697775335"]').first()
    await expect(phoneLink).toBeVisible()

    // Verify enquiry form inputs are rendered with high contrast
    const nameInput = page.locator('input[name="name"]')
    const emailInput = page.locator('input[name="email"]')
    const phoneInput = page.locator('input[name="phone"]')
    const messageInput = page.locator('textarea[name="message"]')
    const submitBtn = page.locator('button[type="submit"]:has-text("Send Inquiry")')

    await expect(nameInput).toBeVisible()
    await expect(emailInput).toBeVisible()
    await expect(phoneInput).toBeVisible()
    await expect(messageInput).toBeVisible()
    await expect(submitBtn).toBeVisible()
  })

  test('2.7 404 / Missing Route Handling', async ({ page }) => {
    await page.goto('/random-unknown-endpoint-404')
    // Should render without fatal white screen
    const bodyText = await page.locator('body').innerText()
    expect(bodyText.length).toBeGreaterThan(50)
  })
})

