import { Page, Locator } from '@playwright/test';

export abstract class BasePage {
  protected page: Page;
  protected url: string;

  constructor(page: Page, url: string = '') {
    this.page = page;
    this.url = url;
  }

  async navigate(): Promise<void> {
    await this.page.goto(this.url);
    await this.waitForPageLoad();
  }

  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }

  async takeScreenshot(name: string): Promise<void> {
    await this.page.screenshot({ path: `test-results/screenshots/${name}.png` });
  }

  async scrollToElement(locator: Locator): Promise<void> {
    await locator.scrollIntoViewIfNeeded();
  }

  async waitForElement(locator: Locator, options?: { timeout?: number }): Promise<void> {
    await locator.waitFor(options);
  }

  async clickWithRetry(locator: Locator, maxRetries: number = 3): Promise<void> {
    for (let i = 0; i < maxRetries; i++) {
      try {
        await locator.click();
        return;
      } catch (error) {
        if (i === maxRetries - 1) throw error;
        await this.page.waitForTimeout(1000);
      }
    }
  }

  async fillWithValidation(locator: Locator, value: string): Promise<void> {
    await locator.fill(value);
    await this.page.waitForTimeout(100);
    const inputValue = await locator.inputValue();
    if (inputValue !== value) {
      throw new Error(`Failed to fill input. Expected: ${value}, Actual: ${inputValue}`);
    }
  }

  async getElementText(locator: Locator): Promise<string> {
    await this.waitForElement(locator);
    return await locator.textContent() || '';
  }

  async isElementVisible(locator: Locator): Promise<boolean> {
    try {
      await locator.waitFor({ state: 'visible', timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  protected async handleLoadingStates(): Promise<void> {
    // Wait for any loading spinners to disappear
    const loadingSpinners = this.page.locator('.loading, .spinner, [data-loading="true"]');
    try {
      await loadingSpinners.waitFor({ state: 'hidden', timeout: 10000 });
    } catch {
      // Continue if no loading spinners found
    }
  }
}