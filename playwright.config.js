import { defineConfig, devices } from '@playwright/test'

/**
 * Playwright E2E Configuration for Country Holidays Inn & Suites (CHIS)
 */
export default defineConfig({
  testDir: './tests',
  fullyParallel: false, // Run sequentially to avoid race conditions with live backend/DB
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 1,
  timeout: 35000,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: 'http://localhost:4173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'off',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'npx vite preview --port 4173',
    port: 4173,
    reuseExistingServer: true,
    timeout: 30000,
  },
})
