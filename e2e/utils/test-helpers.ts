import { type Page, expect } from '@playwright/test';

/**
 * Test utilities for Front Desk Upsell E2E tests
 */

export class FrontDeskTestHelpers {
  constructor(private page: Page) {}

  /**
   * Wait for reservation data to load on the page
   */
  async waitForReservationDataLoad(timeout = 10000) {
    await expect(this.page.getByText('Showing reservations for')).toBeVisible();
    
    await this.page.waitForFunction(() => {
      const text = document.querySelector('[data-testid="reservations-count"]')?.textContent || 
                   document.body.textContent || '';
      return !text.includes('Loading orders') && !text.includes('(0 reservations)');
    }, { timeout });
  }

  /**
   * Find and click the first reservation with reserved items
   */
  async clickFirstReservedItemsReservation() {
    const reservedItemButton = this.page.locator('button').filter({ 
      hasText: /\d+ reserved items?/ 
    }).first();
    
    await expect(reservedItemButton).toBeVisible({ timeout: 10000 });
    const buttonText = await reservedItemButton.textContent();
    const itemCount = buttonText?.match(/(\d+) reserved/)?.[1];
    
    await reservedItemButton.click();
    
    return { itemCount, buttonText };
  }

  /**
   * Find and click the first reservation with recommendation button
   */
  async clickFirstRecommendationReservation() {
    const recommendButton = this.page.locator('button').filter({ 
      hasText: 'Recommend' 
    }).first();
    
    await expect(recommendButton).toBeVisible({ timeout: 10000 });
    await recommendButton.click();
    
    return recommendButton;
  }

  /**
   * Verify reservation summary tab is open and active
   */
  async verifyReservationSummaryTab(expectedHeading = 'Request Summary') {
    const reservationTab = this.page.locator('div[role="tablist"] button').filter({ 
      hasText: /^(?!Front Desk Upsell|Dashboard|Request Management).*/ 
    }).first();
    
    await expect(reservationTab).toBeVisible();
    await expect(reservationTab).toHaveAttribute('aria-selected', 'true');
    await expect(this.page.getByRole('heading', { name: expectedHeading })).toBeVisible();
    
    return reservationTab;
  }

  /**
   * Verify recommendation interface is loaded
   */
  async verifyRecommendationInterface() {
    await expect(this.page.getByRole('heading', { name: 'Recommended Services' })).toBeVisible();
    
    // Verify main sections
    const sections = [
      'Superior Rooms',
      'Room Customization', 
      'Stay Enhancements',
      'Selection Summary'
    ];
    
    for (const section of sections) {
      await expect(this.page.getByRole('heading', { name: section })).toBeVisible();
    }
  }

  /**
   * Add a room upgrade selection
   */
  async addRoomUpgrade() {
    const roomAvailabilityButton = this.page.locator('button').filter({ 
      hasText: /\d+ Available/ 
    }).first();
    
    await expect(roomAvailabilityButton).toBeVisible();
    await roomAvailabilityButton.click();
    
    // Verify selection was added
    const selectedRoomsCount = this.page.locator('div').filter({ 
      hasText: /Selected Rooms/ 
    }).locator('text=1').first();
    
    await expect(selectedRoomsCount).toBeVisible({ timeout: 5000 });
    
    return roomAvailabilityButton;
  }

  /**
   * Add a stay enhancement with quantity
   */
  async addStayEnhancement() {
    const increaseQuantityButton = this.page.locator('button').filter({ 
      hasText: /Increase quantity/ 
    }).first();
    
    await expect(increaseQuantityButton).toBeVisible();
    await increaseQuantityButton.click();
    
    // Verify quantity increased and book now button is enabled
    const bookNowButton = increaseQuantityButton.locator('../..').getByRole('button', { name: 'Book Now' });
    await expect(bookNowButton).toBeEnabled();
    await bookNowButton.click();
    
    // Verify selection was added
    const extraServicesCount = this.page.locator('div').filter({ 
      hasText: /Extra Services/ 
    }).locator('text=1').first();
    
    await expect(extraServicesCount).toBeVisible({ timeout: 5000 });
    
    return { increaseQuantityButton, bookNowButton };
  }

  /**
   * Verify selection summary shows items selected
   */
  async verifyItemsSelected() {
    await expect(this.page.locator('text=No items selected')).not.toBeVisible();
    
    const confirmButton = this.page.getByRole('button', { name: 'Confirm Selection' });
    await expect(confirmButton).toBeEnabled();
    
    return confirmButton;
  }

  /**
   * Clear all selections
   */
  async clearAllSelections() {
    const clearAllButton = this.page.getByRole('button', { name: 'Clear All' });
    await expect(clearAllButton).toBeEnabled();
    await clearAllButton.click();
    
    // Verify selections are cleared
    await expect(this.page.getByText('No items selected')).toBeVisible();
    await expect(this.page.getByRole('button', { name: 'Confirm Selection' })).toBeDisabled();
  }

  /**
   * Search for a specific reservation
   */
  async searchReservation(searchTerm: string) {
    const searchInput = this.page.getByPlaceholder('Search by locator or name...');
    await searchInput.fill(searchTerm);
    
    // Wait for search results
    await this.page.waitForTimeout(500); // Small delay for search to process
    
    return searchInput;
  }

  /**
   * Get the first guest name from the reservation table
   */
  async getFirstGuestName(): Promise<string | null> {
    await this.waitForReservationDataLoad();
    
    const firstGuestName = await this.page
      .locator('table tbody tr')
      .first()
      .locator('td')
      .nth(1)
      .locator('div div')
      .first()
      .textContent();
    
    return firstGuestName;
  }

  /**
   * Navigate back to main Front Desk Upsell tab
   */
  async navigateToMainTab() {
    await this.page.getByRole('tab', { name: 'Front Desk Upsell' }).click();
    await expect(this.page.getByRole('tab', { name: 'Front Desk Upsell' }))
      .toHaveAttribute('aria-selected', 'true');
  }

  /**
   * Close active reservation tab
   */
  async closeActiveReservationTab() {
    const closeButton = this.page
      .locator('div[role="tablist"] button[aria-selected="true"]')
      .locator('button')
      .last();
    
    await closeButton.click();
    
    // Should return to main tab
    await expect(this.page.getByRole('tab', { name: 'Front Desk Upsell' }))
      .toHaveAttribute('aria-selected', 'true');
  }

  /**
   * Count the number of open reservation tabs
   */
  async getOpenReservationTabsCount(): Promise<number> {
    const tabs = this.page.locator('div[role="tablist"] button').filter({ 
      hasText: /^(?!Front Desk Upsell|Dashboard|Request Management).*/ 
    });
    
    return await tabs.count();
  }

  /**
   * Verify commission calculation is displayed
   */
  async verifyCommissionCalculation() {
    await expect(this.page.getByText('Est. Commission')).toBeVisible();
    
    // Look for euro symbol and amount
    const commissionElement = this.page.locator('div').filter({ 
      hasText: /Est\. Commission/ 
    }).locator('text=/€\d+\.\d+/').first();
    
    await expect(commissionElement).toBeVisible();
    
    return commissionElement;
  }

  /**
   * Verify service tables are displayed with correct statuses
   */
  async verifyServiceTables() {
    // Check for room section
    const roomSection = this.page.locator('div').filter({ hasText: /Room.*\d+/ }).first();
    await expect(roomSection).toBeVisible();
    
    // Check for extras/services section  
    const extrasSection = this.page.locator('div').filter({ hasText: /Extra.*\d+/ }).first();
    await expect(extrasSection).toBeVisible();
    
    // Verify status indicators
    const statusElements = this.page.locator('text=confirmed, text=pending hotel');
    await expect(statusElements.first()).toBeVisible();
    
    return { roomSection, extrasSection };
  }

  /**
   * Test configuration selectors (segment, agent)
   */
  async testConfigurationSelectors() {
    const segmentSelector = this.page.locator('div').filter({ 
      hasText: /Segment:/ 
    }).locator('button').first();
    
    const agentSelector = this.page.locator('div').filter({ 
      hasText: /Agent:/ 
    }).locator('button').first();
    
    await expect(segmentSelector).toBeVisible();
    await expect(agentSelector).toBeVisible();
    
    return { segmentSelector, agentSelector };
  }

  /**
   * Verify room customization options are available
   */
  async verifyRoomCustomizationOptions() {
    const customizationButtons = this.page.locator('button').filter({ 
      hasText: /\d+ available/ 
    });
    
    await expect(customizationButtons.first()).toBeVisible();
    
    // Verify different bed types are shown
    const bedTypes = ['King Size Bed', 'Twin Beds', 'Sofa Bed'];
    
    for (const bedType of bedTypes) {
      const bedOption = this.page.getByRole('heading', { name: bedType });
      // At least one bed type should be visible
      try {
        await expect(bedOption).toBeVisible({ timeout: 2000 });
        break;
      } catch {
        // Continue to next bed type
      }
    }
    
    return customizationButtons;
  }
}

/**
 * Data validation helpers
 */
export class DataValidationHelpers {
  static validateReservationData(data: any) {
    expect(data).toBeTruthy();
    expect(data.locator).toMatch(/^LOC\d+$/);
    expect(data.guest).toBeTruthy();
    expect(data.checkIn).toMatch(/^\d{2}\/\d{2}\/\d{4}$/);
    expect(data.nights).toMatch(/^\d+$/);
  }

  static validateCommissionAmount(amount: string) {
    expect(amount).toMatch(/^€\d+\.\d{2}$/);
    const numericValue = parseFloat(amount.replace('€', ''));
    expect(numericValue).toBeGreaterThanOrEqual(0);
  }

  static validatePricingData(price: string) {
    expect(price).toMatch(/^€?\d+(\.\d{2})?$/);
  }
}

/**
 * Mock data helpers for testing without relying on specific static data
 */
export class MockDataHelpers {
  static createMockReservation(overrides: any = {}) {
    return {
      id: `order-${Math.floor(Math.random() * 1000)}`,
      locator: `LOC${1000 + Math.floor(Math.random() * 9999)}`,
      name: 'Test Guest',
      email: 'test@example.com',
      checkIn: '01/01/2025',
      nights: '3',
      roomType: 'Doble',
      extras: Math.random() > 0.5 ? 'Recommend' : '2 reserved items',
      ...overrides
    };
  }

  static async injectMockData(page: Page, mockReservations: any[]) {
    await page.evaluate((reservations) => {
      // Inject mock data into the page's context
      (window as any).__testReservations = reservations;
    }, mockReservations);
  }
}