import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class FrontDeskUpsellPage extends BasePage {
  // Core elements
  private readonly searchInput: Locator;
  private readonly reservationsTable: Locator;
  private readonly reservationRows: Locator;
  private readonly loadingIndicator: Locator;

  constructor(page: Page) {
    super(page, '/ventas/front-desk-upsell');
    this.searchInput = page.locator('[data-testid="reservations-search-input"]');
    this.reservationsTable = page.locator('[data-testid="reservations-table"]');
    this.reservationRows = page.locator('[data-testid^="reservation-row-"]');
    this.loadingIndicator = page.locator('text=Loading orders...');
  }

  async searchReservations(searchTerm: string): Promise<void> {
    await this.fillWithValidation(this.searchInput, searchTerm);
    await this.handleLoadingStates();
  }

  async getReservationRow(locator: string): Promise<Locator> {
    return this.page.locator(`[data-testid="reservation-row-${locator}"]`);
  }

  async clickExtrasButton(locator: string): Promise<void> {
    const extrasButton = this.page.locator(`[data-testid="extras-button-${locator}"]`);
    await this.clickWithRetry(extrasButton);
  }

  async getReservationCount(): Promise<number> {
    await this.waitForReservationsToLoad();
    return await this.reservationRows.count();
  }

  async waitForReservationsToLoad(): Promise<void> {
    // Wait for loading to complete
    await this.page.waitForFunction(() => {
      const loadingText = document.querySelector('text=Loading orders...');
      return !loadingText || loadingText.textContent !== 'Loading orders...';
    }, { timeout: 30000 });
    await this.handleLoadingStates();
  }

  async getReservationData(locator: string): Promise<{
    name: string;
    email: string;
    checkIn: string;
    nights: string;
    roomType: string;
    extras: string;
  }> {
    const row = await this.getReservationRow(locator);
    
    return {
      name: await row.locator('td:nth-child(2) .font-medium').textContent() || '',
      email: await row.locator('td:nth-child(2) .text-gray-500').textContent() || '',
      checkIn: await row.locator('td:nth-child(5)').textContent() || '',
      nights: await row.locator('td:nth-child(6)').textContent() || '',
      roomType: await row.locator('td:nth-child(4)').textContent() || '',
      extras: await row.locator('td:nth-child(7) button').textContent() || '',
    };
  }

  async isReservationVisible(locator: string): Promise<boolean> {
    const row = await this.getReservationRow(locator);
    return await this.isElementVisible(row);
  }

  async clearSearchInput(): Promise<void> {
    await this.searchInput.clear();
    await this.handleLoadingStates();
  }

  async getSearchInputValue(): Promise<string> {
    return await this.searchInput.inputValue();
  }

  async isTableVisible(): Promise<boolean> {
    return await this.isElementVisible(this.reservationsTable);
  }

  async waitForSearchResults(): Promise<void> {
    await this.page.waitForTimeout(500); // Allow for search debounce
    await this.handleLoadingStates();
  }

  // Navigation methods
  async openReservationDetails(locator: string): Promise<void> {
    await this.clickExtrasButton(locator);
    await this.handleLoadingStates();
  }

  async isReservationDetailsTabOpen(locator: string): Promise<boolean> {
    const tabSelector = `[value="details_${locator}"], [value="summary_${locator}"]`;
    const tab = this.page.locator(tabSelector).first();
    return await this.isElementVisible(tab);
  }
}