const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './qa',
  timeout: 90_000,
  expect: {
    timeout: 10_000
  },
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: [
    ['list'],
    ['html', { open: 'never', outputFolder: 'playwright-report' }]
  ],
  use: {
    baseURL: process.env.NALA_BASE_URL || 'https://nala-test.com/repo_deploy',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1440, height: 1080 }
      }
    },
    {
      name: 'mobile-chrome',
      use: {
        ...devices['Pixel 7']
      }
    }
  ]
});
