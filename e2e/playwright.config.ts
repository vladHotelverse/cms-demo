import { defineConfig, devices } from '@playwright/test';
import path from 'path';

/**
 * Comprehensive Playwright E2E Testing Configuration
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './e2e',
  
  /* Organize tests by feature */
  testMatch: [
    '**/tests/**/*.spec.ts',
    '**/tests/**/*.test.ts',
    '**/flows/**/*.spec.ts',
    '**/*.e2e.spec.ts'
  ],

  /* Run tests in files in parallel */
  fullyParallel: true,
  
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  
  /* Retry on CI only */
  retries: process.env.CI ? 3 : 1,
  
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 2 : undefined,
  
  /* Multiple reporters for comprehensive reporting */
  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['json', { outputFile: 'playwright-report/results.json' }],
    ['junit', { outputFile: 'playwright-report/results.xml' }],
    ['github'], // GitHub Actions integration
    ['line']
  ],

  /* Global configuration */
  timeout: 60000,
  expect: {
    timeout: 15000,
    // Visual comparison tolerance
    threshold: 0.2,
    toHaveScreenshot: {
      threshold: 0.2,
      mode: 'css'
    },
    toMatchAriaSnapshot: {
      mode: 'css'
    }
  },

  /* Shared settings for all projects */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:3000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'retain-on-failure',

    /* Take screenshot on failure and for visual testing */
    screenshot: 'only-on-failure',

    /* Record video on failure */
    video: 'retain-on-failure',

    /* Global test timeout */
    actionTimeout: 15000,
    navigationTimeout: 30000,

    /* Locale and timezone */
    locale: 'en-US',
    timezoneId: 'America/New_York',

    /* Security and privacy settings */
    ignoreHTTPSErrors: false,
    acceptDownloads: true,

    /* Context options for better test reliability */
    contextOptions: {
      strictSelectors: true,
    },

    /* Performance and accessibility testing */
    colorScheme: 'light',
    reducedMotion: 'reduce',

    /* Custom user agent for testing identification */
    userAgent: 'PlaywrightE2E/1.0'
  },

  /* Comprehensive browser and device testing */
  projects: [
    /* Setup project for authentication and database seeding */
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/,
      use: { ...devices['Desktop Chrome'] },
    },

    /* Desktop browsers */
    {
      name: 'Desktop Chrome',
      use: { 
        ...devices['Desktop Chrome'],
        channel: 'chrome'
      },
      dependencies: ['setup']
    },
    {
      name: 'Desktop Firefox',
      use: { ...devices['Desktop Firefox'] },
      dependencies: ['setup']
    },
    {
      name: 'Desktop Safari',
      use: { ...devices['Desktop Safari'] },
      dependencies: ['setup']
    },
    {
      name: 'Desktop Edge',
      use: { 
        ...devices['Desktop Edge'],
        channel: 'msedge'
      },
      dependencies: ['setup']
    },

    /* Mobile testing */
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
      dependencies: ['setup']
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
      dependencies: ['setup']
    },
    {
      name: 'Mobile Samsung',
      use: { ...devices['Galaxy S9+'] },
      dependencies: ['setup']
    },

    /* Tablet testing */
    {
      name: 'Tablet iPad',
      use: { ...devices['iPad Pro'] },
      dependencies: ['setup']
    },

    /* Dark mode testing */
    {
      name: 'Dark Mode',
      use: { 
        ...devices['Desktop Chrome'],
        colorScheme: 'dark'
      },
      dependencies: ['setup']
    },

    /* Performance testing on slower devices */
    {
      name: 'Slow Network',
      use: { 
        ...devices['Desktop Chrome'],
        contextOptions: {
          offline: false,
          // Simulate slow network
        }
      },
      dependencies: ['setup']
    },

    /* API testing */
    {
      name: 'API Tests',
      testMatch: /.*api.*\.spec\.ts/,
      use: { 
        ...devices['Desktop Chrome'],
        // Skip browser for API-only tests
        headless: true
      }
    },

    /* Visual regression testing */
    {
      name: 'Visual Tests',
      testMatch: /.*visual.*\.spec\.ts/,
      use: { 
        ...devices['Desktop Chrome'],
        // Ensure consistent screenshots
        deviceScaleFactor: 1,
        hasTouch: false
      },
      dependencies: ['setup']
    },

    /* Accessibility testing */
    {
      name: 'Accessibility Tests',
      testMatch: /.*a11y.*\.spec\.ts/,
      use: { 
        ...devices['Desktop Chrome'],
        // Enable accessibility tree
        contextOptions: {
          reducedMotion: 'reduce',
          forcedColors: 'none'
        }
      },
      dependencies: ['setup']
    }
  ],

  /* Global setup and teardown */
  globalSetup: require.resolve('./e2e/support/global-setup.ts'),
  globalTeardown: require.resolve('./e2e/support/global-teardown.ts'),

  /* Run your local dev server before starting the tests */
  webServer: {
    command: 'pnpm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 180000,
    stdout: 'ignore',
    stderr: 'pipe',
    env: {
      NODE_ENV: 'test',
      NEXT_TELEMETRY_DISABLED: '1'
    }
  },

  /* Output directories */
  outputDir: 'test-results/',
  
  /* Test directories and patterns to ignore */
  testIgnore: [
    '**/node_modules/**',
    '**/dist/**',
    '**/.next/**',
    '**/coverage/**',
    '**/playwright-report/**',
    '**/test-results/**'
  ],

  /* Metadata for test reporting */
  metadata: {
    'test-environment': process.env.NODE_ENV || 'development',
    'base-url': process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:3000',
    'browser-versions': 'latest',
    'test-framework': 'Playwright'
  }
});