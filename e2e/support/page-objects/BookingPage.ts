import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class ReservationDetailsPage extends BasePage {
  // Reservation details elements (based on actual app structure)
  private readonly reservationHeader: Locator;
  private readonly roomSelection: Locator;
  private readonly selectionSummary: Locator;
  private readonly recommendationsSection: Locator;
  private readonly closeTabButton: Locator;
  private readonly saveButton: Locator;

  constructor(page: Page) {
    super(page, '/ventas/front-desk-upsell'); // Base URL, but this is a tab-based interface
    this.reservationHeader = page.locator('[data-testid*="room-header-"]').first();
    this.roomSelection = page.locator('[data-testid="person-selector"]'); // Uses existing PersonSelector
    this.selectionSummary = page.locator('.selection-summary').first();
    this.recommendationsSection = page.locator('.recommendations').first();
    this.closeTabButton = page.locator('button:has-text("Close")').first();
    this.saveButton = page.locator('button:has-text("Save")').first();
  }

  async isReservationDetailsVisible(): Promise<boolean> {
    return await this.isElementVisible(this.reservationHeader);
  }

  async selectNumberOfPersons(persons: number): Promise<void> {
    await this.roomSelection.click();
    const option = this.page.locator(`[data-value="${persons}"]`);
    await this.clickWithRetry(option);
  }

  async isSelectionSummaryVisible(): Promise<boolean> {
    return await this.isElementVisible(this.selectionSummary);
  }

  async closeReservationTab(): Promise<void> {
    await this.clickWithRetry(this.closeTabButton);
  }

  async saveReservationChanges(): Promise<void> {
    await this.clickWithRetry(this.saveButton);
    await this.handleLoadingStates();
  }

  async waitForReservationDetailsToLoad(): Promise<void> {
    await this.waitForElement(this.reservationHeader);
    await this.handleLoadingStates();
  }

  async getReservationHeaderText(): Promise<string> {
    return await this.getElementText(this.reservationHeader);
  }

  // Utility method to check if we're in a reservation details tab
  async isInReservationDetailsMode(): Promise<boolean> {
    const tabContent = this.page.locator('[value*="details_"]').first();
    return await this.isElementVisible(tabContent);
  }
}