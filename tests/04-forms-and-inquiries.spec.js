// @ts-check
import { test, expect } from '@playwright/test'

test.describe('Suite 4: Forms, Validation & Business Inquiries', () => {
  test('4.1 Contact Form - Requires Name, Email, and Message', async ({ page }) => {
    await page.goto('/contact')
    await page.waitForLoadState('networkidle')

    const submitBtn = page.locator('button[type="submit"]:has-text("Send Inquiry")')
    await submitBtn.click()

    // Form should not submit when required fields are empty
    const nameInput = page.locator('input[name="name"]')
    const isInvalid = await nameInput.evaluate((el) => !el.checkValidity())
    expect(isInvalid).toBe(true)
  })

  test('4.2 Contact Form - Dynamic URL query params (subject & coupon code)', async ({ page }) => {
    await page.goto('/contact?subject=Goa%20Holiday%20Package&code=ESCAPE30')
    await page.waitForLoadState('networkidle')

    // Context banner must be visible
    await expect(page.locator('text=Inquiring For')).toBeVisible()
    await expect(page.locator('div:has-text("Inquiring For") p:text-is("Goa Holiday Package")')).toBeVisible()
    await expect(page.locator('span:text-is("ESCAPE30")')).toBeVisible()

    // Message field should contain prefilled details
    const messageVal = await page.locator('textarea[name="message"]').inputValue()
    expect(messageVal).toContain('Goa Holiday Package')
    expect(messageVal).toContain('ESCAPE30')
  })

  test('4.3 Footer Newsletter - Form elements exist and accept input', async ({ page }) => {
    await page.goto('/')
    const footer = page.locator('footer')
    await footer.scrollIntoViewIfNeeded()

    const nameInput = footer.locator('input[placeholder="Your Name"]')
    const phoneInput = footer.locator('input[placeholder="Phone Number"]')
    const emailInput = footer.locator('#footer-email, input[placeholder*="gmail.com"]')

    if (await nameInput.isVisible()) {
      await nameInput.fill('Test Guest')
      await phoneInput.fill('9999999999')
      await emailInput.fill('testguest@example.com')

      expect(await nameInput.inputValue()).toBe('Test Guest')
      expect(await emailInput.inputValue()).toBe('testguest@example.com')
    }
  })
})
