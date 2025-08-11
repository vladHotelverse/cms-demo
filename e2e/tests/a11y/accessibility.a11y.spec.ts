import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility Testing', () => {
  test('should not have any automatically detectable accessibility issues on homepage', async ({ page }) => {
    await page.goto('/');
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('should not have accessibility issues on booking page', async ({ page }) => {
    await page.goto('/ventas/front-desk-upsell');
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .exclude(['#ads']) // Exclude third-party ads from testing
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('should be navigable with keyboard only', async ({ page }) => {
    await page.goto('/');
    
    // Test tab navigation through main elements
    await page.keyboard.press('Tab');
    await expect(page.locator(':focus')).toBeVisible();
    
    // Continue tabbing through interactive elements
    for (let i = 0; i < 10; i++) {
      await page.keyboard.press('Tab');
      const focusedElement = page.locator(':focus');
      await expect(focusedElement).toBeVisible();
    }
  });

  test('should have proper heading hierarchy', async ({ page }) => {
    await page.goto('/');
    
    const headings = await page.locator('h1, h2, h3, h4, h5, h6').all();
    
    // Check that there's exactly one h1
    const h1Count = await page.locator('h1').count();
    expect(h1Count).toBe(1);
    
    // Verify headings have accessible names
    for (const heading of headings) {
      const text = await heading.textContent();
      expect(text?.trim()).toBeTruthy();
    }
  });

  test('should have proper form labels and ARIA attributes', async ({ page }) => {
    await page.goto('/demo/date-picker-demo');
    
    // Check that all form inputs have associated labels
    const inputs = await page.locator('input, textarea, select').all();
    
    for (const input of inputs) {
      const id = await input.getAttribute('id');
      const ariaLabel = await input.getAttribute('aria-label');
      const ariaLabelledBy = await input.getAttribute('aria-labelledby');
      
      if (id) {
        const label = page.locator(`label[for="${id}"]`);
        const hasLabel = await label.count() > 0;
        
        // Input should have either a label, aria-label, or aria-labelledby
        expect(hasLabel || ariaLabel || ariaLabelledBy).toBeTruthy();
      }
    }
  });

  test('should support screen reader announcements', async ({ page }) => {
    await page.goto('/ventas/front-desk-upsell');
    
    // Check for live regions for dynamic content
    const liveRegions = await page.locator('[aria-live], [role="alert"], [role="status"]').count();
    expect(liveRegions).toBeGreaterThan(0);
  });

  test('should have sufficient color contrast', async ({ page }) => {
    await page.goto('/');
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2aa'])
      .withRules(['color-contrast'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('should work with high contrast mode', async ({ page }) => {
    await page.emulateMedia({ forcedColors: 'active' });
    await page.goto('/');
    
    // Verify essential elements are still visible
    await expect(page.locator('main')).toBeVisible();
    await expect(page.locator('nav')).toBeVisible();
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });
});