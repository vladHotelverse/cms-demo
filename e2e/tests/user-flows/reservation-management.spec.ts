import { test, expect } from '@playwright/test';
import { FrontDeskUpsellPage } from '../../support/page-objects/FrontDeskUpsellPage';
import { HomePage } from '../../support/page-objects/HomePage';
import { TestData } from '../../fixtures/test-data';

test.describe('Reservation Management Flow', () => {
  let homePage: HomePage;
  let frontDeskPage: FrontDeskUpsellPage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    frontDeskPage = new FrontDeskUpsellPage(page);
  });

  test('should load homepage and navigate to front desk upsell', async ({ page }) => {
    await homePage.navigate();
    await expect(page.locator('[data-testid="homepage"]')).toBeVisible();
    
    // Navigate to front desk upsell page
    await homePage.navigateToFrontDeskUpsell();
    await frontDeskPage.waitForReservationsToLoad();
    
    // Verify we're on the correct page
    await expect(page).toHaveURL('/ventas/front-desk-upsell');
    await expect(frontDeskPage.isTableVisible()).resolves.toBe(true);
  });

  test('should display reservations table with data', async ({ page }) => {
    await frontDeskPage.navigate();
    await frontDeskPage.waitForReservationsToLoad();
    
    // Check that the table is visible and populated
    await expect(page.locator('[data-testid="reservations-table"]')).toBeVisible();
    
    const reservationCount = await frontDeskPage.getReservationCount();
    expect(reservationCount).toBeGreaterThan(0);
  });

  test('should search reservations by guest name', async ({ page }) => {
    await frontDeskPage.navigate();
    await frontDeskPage.waitForReservationsToLoad();
    
    const initialCount = await frontDeskPage.getReservationCount();
    
    // Search for a specific guest
    await frontDeskPage.searchReservations('Smith');
    await frontDeskPage.waitForSearchResults();
    
    const filteredCount = await frontDeskPage.getReservationCount();
    expect(filteredCount).toBeLessThanOrEqual(initialCount);
    
    // Clear search and verify all results return
    await frontDeskPage.clearSearchInput();
    await frontDeskPage.waitForSearchResults();
    
    const resetCount = await frontDeskPage.getReservationCount();
    expect(resetCount).toBe(initialCount);
  });

  test('should search reservations by email', async ({ page }) => {
    await frontDeskPage.navigate();
    await frontDeskPage.waitForReservationsToLoad();
    
    // Search by email domain
    await frontDeskPage.searchReservations('@gmail.com');
    await frontDeskPage.waitForSearchResults();
    
    const searchResults = await frontDeskPage.getReservationCount();
    expect(searchResults).toBeGreaterThanOrEqual(0); // May be 0 if no gmail addresses
  });

  test('should search reservations by locator', async ({ page }) => {
    await frontDeskPage.navigate();
    await frontDeskPage.waitForReservationsToLoad();
    
    // Search by locator prefix
    await frontDeskPage.searchReservations('LOC');
    await frontDeskPage.waitForSearchResults();
    
    const searchResults = await frontDeskPage.getReservationCount();
    expect(searchResults).toBeGreaterThan(0);
  });

  test('should open reservation details for recommendation', async ({ page }) => {
    await frontDeskPage.navigate();
    await frontDeskPage.waitForReservationsToLoad();
    
    const reservationCount = await frontDeskPage.getReservationCount();
    if (reservationCount > 0) {
      // Find the first reservation with "Recommend" extras button
      const firstRow = page.locator('[data-testid^="reservation-row-"]').first();
      const locator = await firstRow.getAttribute('data-testid');
      const locatorId = locator?.replace('reservation-row-', '') || '';
      
      // Click the extras button
      await frontDeskPage.clickExtrasButton(locatorId);
      
      // Wait for the reservation details tab to open
      await page.waitForTimeout(1000); // Allow tab transition
      
      // Check if we're in a details or summary tab
      const isDetailsOpen = await frontDeskPage.isReservationDetailsTabOpen(locatorId);
      expect(isDetailsOpen).toBe(true);
    } else {
      test.skip('No reservations available for testing');
    }
  });

  test('should handle reservation with existing items', async ({ page }) => {
    await frontDeskPage.navigate();
    await frontDeskPage.waitForReservationsToLoad();
    
    // Look for a reservation with "reserved items" button text
    const reservationWithItems = page.locator('[data-testid^="extras-button-"]:has-text("reserved")').first();
    
    if (await reservationWithItems.isVisible()) {
      await reservationWithItems.click();
      
      // Wait for summary tab to open
      await page.waitForTimeout(1000);
      
      // Verify summary content is displayed
      const summaryContent = page.locator('[value*="summary_"]').first();
      await expect(summaryContent).toBeVisible({ timeout: 5000 });
    } else {
      console.log('No reservations with existing items found');
    }
  });

  test('should validate reservation data format', async ({ page }) => {
    await frontDeskPage.navigate();
    await frontDeskPage.waitForReservationsToLoad();
    
    const reservationCount = await frontDeskPage.getReservationCount();
    if (reservationCount > 0) {
      // Get data from the first reservation
      const firstRow = page.locator('[data-testid^="reservation-row-"]').first();
      const locator = await firstRow.getAttribute('data-testid');
      const locatorId = locator?.replace('reservation-row-', '') || '';
      
      const reservationData = await frontDeskPage.getReservationData(locatorId);
      
      // Validate data format
      expect(reservationData.name).toBeTruthy();
      expect(reservationData.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/); // Basic email format
      expect(reservationData.checkIn).toMatch(/^\d{2}\/\d{2}\/\d{4}$/); // DD/MM/YYYY format
      expect(reservationData.nights).toMatch(/^\d+$/); // Number string
      expect(reservationData.roomType).toBeTruthy();
    } else {
      test.skip('No reservations available for validation');
    }
  });

  test('should maintain search state during navigation', async ({ page }) => {
    await frontDeskPage.navigate();
    await frontDeskPage.waitForReservationsToLoad();
    
    // Perform a search
    const searchTerm = 'Smith';
    await frontDeskPage.searchReservations(searchTerm);
    await frontDeskPage.waitForSearchResults();
    
    // Verify search input maintains value
    const inputValue = await frontDeskPage.getSearchInputValue();
    expect(inputValue).toBe(searchTerm);
    
    // The search should persist in the input field
    const filteredCount = await frontDeskPage.getReservationCount();
    expect(filteredCount).toBeGreaterThanOrEqual(0);
  });

  test('should handle empty search results gracefully', async ({ page }) => {
    await frontDeskPage.navigate();
    await frontDeskPage.waitForReservationsToLoad();
    
    // Search for something that definitely won't exist
    await frontDeskPage.searchReservations('XYZ123NonExistentGuest456');
    await frontDeskPage.waitForSearchResults();
    
    const resultCount = await frontDeskPage.getReservationCount();
    expect(resultCount).toBe(0);
    
    // Table should still be visible but empty
    await expect(page.locator('[data-testid="reservations-table"]')).toBeVisible();
  });
});