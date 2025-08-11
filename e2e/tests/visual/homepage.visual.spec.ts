import { test, expect } from '@playwright/test';

test.describe('Visual Regression Tests - Homepage', () => {
  test('should match homepage screenshot in desktop view', async ({ page }) => {
    await page.goto('/');
    
    // Wait for page to fully load
    await page.waitForLoadState('networkidle');
    
    // Hide dynamic content that might cause flakiness
    await page.addStyleTag({
      content: `
        .dynamic-timestamp, .loading-spinner, .animated-element {
          visibility: hidden !important;
        }
      `
    });

    await expect(page).toHaveScreenshot('homepage-desktop.png', {
      fullPage: true,
      animations: 'disabled'
    });
  });

  test('should match homepage screenshot in mobile view', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    await expect(page).toHaveScreenshot('homepage-mobile.png', {
      fullPage: true,
      animations: 'disabled'
    });
  });

  test('should match navigation component', async ({ page }) => {
    await page.goto('/');
    const navigation = page.locator('nav');
    
    await expect(navigation).toHaveScreenshot('navigation-component.png');
  });

  test('should handle dark mode correctly', async ({ page, browserName }) => {
    test.skip(browserName === 'webkit', 'Dark mode not supported in webkit');
    
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    await expect(page).toHaveScreenshot('homepage-dark-mode.png', {
      fullPage: true
    });
  });

  test('should match booking card components', async ({ page }) => {
    await page.goto('/');
    
    const bookingCards = page.locator('[data-testid="booking-card"]');
    await expect(bookingCards.first()).toBeVisible();
    
    await expect(bookingCards.first()).toHaveScreenshot('booking-card.png');
  });
});