import { Page, Locator } from '@playwright/test';

export class TestHelpers {
  static async waitForDataLoad(page: Page, timeout: number = 30000): Promise<void> {
    await page.waitForLoadState('networkidle', { timeout });
    
    // Wait for any loading indicators to disappear
    const loadingIndicators = [
      '.loading',
      '.spinner',
      '[data-loading="true"]',
      '[aria-label*="loading" i]'
    ];
    
    for (const selector of loadingIndicators) {
      try {
        await page.locator(selector).waitFor({ state: 'hidden', timeout: 5000 });
      } catch {
        // Continue if selector not found
      }
    }
  }

  static async fillFormWithDelay(page: Page, formData: Record<string, string>, delay: number = 100): Promise<void> {
    for (const [fieldName, value] of Object.entries(formData)) {
      const field = page.locator(`input[name="${fieldName}"], select[name="${fieldName}"], textarea[name="${fieldName}"]`);
      await field.fill(value);
      await page.waitForTimeout(delay);
    }
  }

  static async takeFullPageScreenshot(page: Page, filename: string): Promise<void> {
    await page.screenshot({
      path: `test-results/screenshots/${filename}`,
      fullPage: true
    });
  }

  static async scrollToBottom(page: Page): Promise<void> {
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });
  }

  static async scrollToTop(page: Page): Promise<void> {
    await page.evaluate(() => {
      window.scrollTo(0, 0);
    });
  }

  static async clearAllCookies(page: Page): Promise<void> {
    await page.context().clearCookies();
  }

  static async setLocalStorage(page: Page, items: Record<string, string>): Promise<void> {
    await page.evaluate((items) => {
      for (const [key, value] of Object.entries(items)) {
        localStorage.setItem(key, value);
      }
    }, items);
  }

  static async getLocalStorage(page: Page, key: string): Promise<string | null> {
    return await page.evaluate((key) => localStorage.getItem(key), key);
  }

  static async waitForAnimation(page: Page, element: Locator): Promise<void> {
    await element.waitFor({ state: 'visible' });
    await page.waitForTimeout(500); // Allow animation to complete
  }

  static async hoverAndWait(element: Locator, waitMs: number = 500): Promise<void> {
    await element.hover();
    await element.page().waitForTimeout(waitMs);
  }

  static async clickAndWaitForNavigation(page: Page, element: Locator): Promise<void> {
    await Promise.all([
      page.waitForNavigation(),
      element.click()
    ]);
  }

  static async getElementsText(elements: Locator): Promise<string[]> {
    const texts: string[] = [];
    const count = await elements.count();
    
    for (let i = 0; i < count; i++) {
      const text = await elements.nth(i).textContent();
      texts.push(text || '');
    }
    
    return texts;
  }

  static async waitForElementCount(elements: Locator, expectedCount: number, timeout: number = 10000): Promise<void> {
    await elements.first().waitFor({ timeout });
    
    let attempts = 0;
    const maxAttempts = timeout / 100;
    
    while (attempts < maxAttempts) {
      const currentCount = await elements.count();
      if (currentCount === expectedCount) {
        return;
      }
      await elements.page().waitForTimeout(100);
      attempts++;
    }
    
    throw new Error(`Expected ${expectedCount} elements, but found ${await elements.count()}`);
  }

  static async retryAction<T>(action: () => Promise<T>, maxRetries: number = 3, delay: number = 1000): Promise<T> {
    let lastError: Error;
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await action();
      } catch (error) {
        lastError = error as Error;
        if (attempt < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }
    
    throw lastError!;
  }

  static generateRandomString(length: number = 8): string {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  static formatCurrency(amount: number, currency: string = 'EUR'): string {
    return new Intl.NumberFormat('en-EU', {
      style: 'currency',
      currency: currency
    }).format(amount);
  }

  static parseCurrency(currencyString: string): number {
    return parseFloat(currencyString.replace(/[€$,]/g, ''));
  }

  static formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  static addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }
}