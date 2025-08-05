import { test, expect } from '@playwright/test';
import { FrontDeskTestHelpers, DataValidationHelpers } from '../utils/test-helpers';

test.describe('Flow 1: Preview Reserved Items', () => {
  let helpers: FrontDeskTestHelpers;

  test.beforeEach(async ({ page }) => {
    helpers = new FrontDeskTestHelpers(page);
    await page.goto('/ventas/front-desk-upsell');
    await helpers.waitForReservationDataLoad();
  });

  test('should successfully preview reservation with reserved items', async () => {
    // Act: Find and click reservation with reserved items
    const { itemCount, buttonText } = await helpers.clickFirstReservedItemsReservation();
    
    // Assert: Verify tab opens and content loads
    await helpers.verifyReservationSummaryTab('Request Summary');
    
    // Assert: Verify reservation details are present
    await expect(helpers.page.getByText('Booking ID')).toBeVisible();
    await expect(helpers.page.getByText('Guest')).toBeVisible();
    await expect(helpers.page.getByText('Room Type')).toBeVisible();
    await expect(helpers.page.getByText('Check-in')).toBeVisible();
    
    // Assert: Verify financial information
    await helpers.verifyCommissionCalculation();
    await expect(helpers.page.getByText('Total Order')).toBeVisible();
    
    // Assert: Verify service tables are displayed
    const { roomSection, extrasSection } = await helpers.verifyServiceTables();
    
    // Assert: Verify we can navigate back
    const backButton = helpers.page.getByRole('button', { name: 'Back' });
    await expect(backButton).toBeVisible();
    await backButton.click();
    
    await expect(helpers.page.getByRole('tab', { name: 'Front Desk Upsell' }))
      .toHaveAttribute('aria-selected', 'true');
  });

  test('should display correct service status indicators', async ({ page }) => {
    await helpers.clickFirstReservedItemsReservation();
    await helpers.verifyReservationSummaryTab();
    
    // Verify different service statuses are shown
    const possibleStatuses = ['confirmed', 'pending hotel', 'cancelled', 'review'];
    let statusFound = false;
    
    for (const status of possibleStatuses) {
      const statusElement = page.locator(`text=${status}`);
      const count = await statusElement.count();
      if (count > 0) {
        await expect(statusElement.first()).toBeVisible();
        statusFound = true;
      }
    }
    
    expect(statusFound).toBe(true);
  });

  test('should handle multiple service types correctly', async ({ page }) => {
    await helpers.clickFirstReservedItemsReservation();
    await helpers.verifyReservationSummaryTab();
    
    // Check for different service sections that might be present
    const serviceSections = [
      { name: 'Room', pattern: /Room.*\d+/ },
      { name: 'Extra', pattern: /Extra.*\d+/ },
      { name: 'Bidding', pattern: /Bidding.*\d+/ }
    ];
    
    let sectionsFound = 0;
    
    for (const section of serviceSections) {
      const sectionElement = page.locator('div').filter({ hasText: section.pattern });
      const count = await sectionElement.count();
      
      if (count > 0) {
        await expect(sectionElement.first()).toBeVisible();
        sectionsFound++;
      }
    }
    
    // At least one service section should be present
    expect(sectionsFound).toBeGreaterThan(0);
  });

  test('should validate reservation data format', async ({ page }) => {
    await helpers.clickFirstReservedItemsReservation();
    await helpers.verifyReservationSummaryTab();
    
    // Extract and validate booking ID
    const bookingIdElement = page.locator('div').filter({ hasText: /Booking ID/ }).locator('p');
    const bookingId = await bookingIdElement.textContent();
    expect(bookingId).toMatch(/^LOC\d+$/);
    
    // Validate date format
    const checkInElement = page.locator('div').filter({ hasText: /Check-in/ }).locator('p');
    const checkInDate = await checkInElement.textContent();
    expect(checkInDate).toMatch(/^\d{2}\/\d{2}\/\d{4}$/);
    
    // Validate commission format
    const commissionElements = page.locator('text=/€\d+\.\d{2}/');
    const commissionCount = await commissionElements.count();
    expect(commissionCount).toBeGreaterThan(0);
  });

  test('should handle tab management correctly', async () => {
    // Open first reserved items tab
    await helpers.clickFirstReservedItemsReservation();
    const tabsCount1 = await helpers.getOpenReservationTabsCount();
    expect(tabsCount1).toBe(1);
    
    // Navigate back to main tab
    await helpers.navigateToMainTab();
    
    // Open another reserved items tab if available
    const reservedButtons = helpers.page.locator('button').filter({ 
      hasText: /\d+ reserved items?/ 
    });
    const buttonCount = await reservedButtons.count();
    
    if (buttonCount > 1) {
      await reservedButtons.nth(1).click();
      const tabsCount2 = await helpers.getOpenReservationTabsCount();
      expect(tabsCount2).toBe(2);
    }
  });

  test('should handle tab closing functionality', async () => {
    await helpers.clickFirstReservedItemsReservation();
    
    // Verify tab is open
    const initialTabsCount = await helpers.getOpenReservationTabsCount();
    expect(initialTabsCount).toBeGreaterThan(0);
    
    // Close the tab
    await helpers.closeActiveReservationTab();
    
    // Verify we're back on main tab
    await expect(helpers.page.getByRole('tab', { name: 'Front Desk Upsell' }))
      .toHaveAttribute('aria-selected', 'true');
  });

  test('should show appropriate loading states', async ({ page }) => {
    // This test verifies the page handles loading states properly
    await page.goto('/ventas/front-desk-upsell');
    
    // Initially should show loading or empty state
    const possibleInitialStates = [
      page.locator('text=Loading orders'),
      page.locator('text=0 reservations'),
      page.locator('text=Showing reservations')
    ];
    
    let stateVisible = false;
    for (const state of possibleInitialStates) {
      try {
        await expect(state).toBeVisible({ timeout: 1000 });
        stateVisible = true;
        break;
      } catch {
        continue;
      }
    }
    
    // Then should load actual data
    await helpers.waitForReservationDataLoad();
    
    // Should not show loading anymore
    await expect(page.locator('text=Loading orders')).not.toBeVisible();
  });

  test('should maintain state when switching between tabs', async () => {
    // Open reserved items tab
    await helpers.clickFirstReservedItemsReservation();
    const reservationTab = await helpers.verifyReservationSummaryTab();
    const tabName = await reservationTab.textContent();
    
    // Switch to main tab
    await helpers.navigateToMainTab();
    
    // Switch back to reservation tab
    await helpers.page.locator(`div[role="tablist"] button`).filter({ hasText: tabName! }).click();
    
    // Verify content is still there
    await expect(helpers.page.getByRole('heading', { name: 'Request Summary' })).toBeVisible();
    await expect(helpers.page.getByText('Booking ID')).toBeVisible();
  });

  test('should handle edge case: no reserved items available', async ({ page }) => {
    await helpers.waitForReservationDataLoad();
    
    // Search for something that would return no results
    await helpers.searchReservation('NoReservationExists12345');
    
    // Should show no results message
    await expect(page.locator('text=No reservations found, text=0 reservations')).toBeVisible();
    
    // Clear search to restore normal state
    const searchInput = page.getByPlaceholder('Search by locator or name...');
    await searchInput.clear();
    
    // Should show reservations again
    await helpers.waitForReservationDataLoad();
  });
});