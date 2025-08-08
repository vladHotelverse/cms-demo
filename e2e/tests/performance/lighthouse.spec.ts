import { test, expect } from '@playwright/test';
import { TestData } from '../../fixtures/test-data';

test.describe('Performance Testing', () => {
  test('should meet performance thresholds on homepage', async ({ page }) => {
    const thresholds = TestData.getPerformanceThresholds();

    await page.goto('/');

    // Get Core Web Vitals using JavaScript
    const vitals = await page.evaluate(() => {
      return new Promise((resolve) => {
        if ('web-vital' in window) {
          // If web-vitals library is available
          const vitals: any = {};
          
          new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
              if (entry.name === 'first-contentful-paint') {
                vitals.fcp = entry.startTime;
              }
            }
          }).observe({ entryTypes: ['paint'] });

          // Wait a bit then resolve
          setTimeout(() => resolve(vitals), 3000);
        } else {
          resolve({});
        }
      });
    });

    // Basic performance checks
    const navigationTiming = await page.evaluate(() => {
      const timing = performance.timing;
      return {
        domContentLoaded: timing.domContentLoadedEventEnd - timing.navigationStart,
        fullyLoaded: timing.loadEventEnd - timing.navigationStart,
        firstPaint: performance.getEntriesByType('paint')[0]?.startTime || 0
      };
    });

    // Assert performance metrics
    expect(navigationTiming.domContentLoaded).toBeLessThan(thresholds.firstContentfulPaint);
    expect(navigationTiming.firstPaint).toBeLessThan(thresholds.firstContentfulPaint);
  });

  test('should load images efficiently', async ({ page }) => {
    await page.goto('/');
    
    // Check for lazy loading implementation
    const images = page.locator('img');
    const imageCount = await images.count();
    
    if (imageCount > 0) {
      // Check if images have loading="lazy" attribute
      const lazyImages = page.locator('img[loading="lazy"]');
      const lazyCount = await lazyImages.count();
      
      // At least some images should use lazy loading
      expect(lazyCount).toBeGreaterThanOrEqual(Math.floor(imageCount / 2));
    }
  });

  test('should have efficient resource loading', async ({ page }) => {
    const response = await page.goto('/');
    
    // Check response time
    expect(response?.status()).toBe(200);
    
    // Monitor network requests
    const resourceRequests: any[] = [];
    
    page.on('response', response => {
      resourceRequests.push({
        url: response.url(),
        status: response.status(),
        size: response.headers()['content-length'] || 0
      });
    });

    await page.waitForLoadState('networkidle');

    // Check for reasonable number of requests
    expect(resourceRequests.length).toBeLessThan(50);
    
    // Check that critical resources loaded successfully
    const failedRequests = resourceRequests.filter(req => req.status >= 400);
    expect(failedRequests).toHaveLength(0);
  });

  test('should handle slow network conditions', async ({ page }) => {
    // Simulate slow network
    await page.route('**/*', async route => {
      await new Promise(resolve => setTimeout(resolve, 100)); // 100ms delay
      await route.continue();
    });

    const startTime = Date.now();
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    const loadTime = Date.now() - startTime;

    // Should still load within reasonable time even with slow network
    expect(loadTime).toBeLessThan(10000); // 10 seconds
  });
});