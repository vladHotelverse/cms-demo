import { test, expect } from '@playwright/test';
import { FrontDeskUpsellPage } from '../../support/page-objects/FrontDeskUpsellPage';

test.describe('shadcn/ui Components Integration', () => {
  let frontDeskPage: FrontDeskUpsellPage;

  test.beforeEach(async ({ page }) => {
    frontDeskPage = new FrontDeskUpsellPage(page);
  });

  test('should render Table component correctly', async ({ page }) => {
    await frontDeskPage.navigate();
    await frontDeskPage.waitForReservationsToLoad();

    // Test Table component from shadcn/ui
    const table = page.locator('[data-testid="reservations-table"]');
    await expect(table).toBeVisible();
    
    // Verify table structure
    const tableHeader = table.locator('thead');
    const tableBody = table.locator('tbody');
    
    await expect(tableHeader).toBeVisible();
    await expect(tableBody).toBeVisible();
    
    // Check that header has correct columns
    const headerCells = tableHeader.locator('th');
    const headerCount = await headerCells.count();
    expect(headerCount).toBe(7); // Based on the actual table structure
  });

  test('should handle Input component interactions', async ({ page }) => {
    await frontDeskPage.navigate();
    await frontDeskPage.waitForReservationsToLoad();

    // Test Input component (search)
    const searchInput = page.locator('[data-testid="reservations-search-input"]');
    await expect(searchInput).toBeVisible();
    
    // Test typing in input
    await searchInput.fill('test search');
    await expect(searchInput).toHaveValue('test search');
    
    // Test clearing input
    await searchInput.clear();
    await expect(searchInput).toHaveValue('');
  });

  test('should render Button components with proper variants', async ({ page }) => {
    await frontDeskPage.navigate();
    await frontDeskPage.waitForReservationsToLoad();

    const reservationCount = await frontDeskPage.getReservationCount();
    
    if (reservationCount > 0) {
      // Find buttons in the extras column
      const extrasButtons = page.locator('[data-testid^="extras-button-"]');
      const buttonCount = await extrasButtons.count();
      
      expect(buttonCount).toBeGreaterThan(0);
      
      // Test button hover states
      const firstButton = extrasButtons.first();
      await firstButton.hover();
      
      // Verify button is interactive
      await expect(firstButton).toBeEnabled();
    }
  });

  test('should handle PersonSelector component', async ({ page }) => {
    await frontDeskPage.navigate();
    await frontDeskPage.waitForReservationsToLoad();

    // Open a reservation details tab to access PersonSelector
    const reservationCount = await frontDeskPage.getReservationCount();
    
    if (reservationCount > 0) {
      const firstRow = page.locator('[data-testid^="reservation-row-"]').first();
      const locator = await firstRow.getAttribute('data-testid');
      const locatorId = locator?.replace('reservation-row-', '') || '';
      
      // Click extras button to open details/summary
      await frontDeskPage.clickExtrasButton(locatorId);
      
      // Wait for tab to open
      await page.waitForTimeout(1000);
      
      // Look for PersonSelector component
      const personSelector = page.locator('[data-testid="person-selector"]');
      
      if (await personSelector.isVisible()) {
        // Test Select component interaction
        await personSelector.click();
        
        // Verify select options appear
        const selectContent = page.locator('[data-radix-select-content]');
        await expect(selectContent).toBeVisible({ timeout: 2000 });
        
        // Select an option
        const option = selectContent.locator('[data-radix-select-item]').first();
        if (await option.isVisible()) {
          await option.click();
        }
      }
    }
  });

  test('should handle Tabs navigation', async ({ page }) => {
    await frontDeskPage.navigate();
    await frontDeskPage.waitForReservationsToLoad();

    // Test main tabs navigation
    const dashboardTab = page.locator('[data-value="dashboard"]');
    if (await dashboardTab.isVisible()) {
      await dashboardTab.click();
      
      // Wait for tab content
      await page.waitForTimeout(500);
      
      // Should show dashboard content
      const dashboardContent = page.locator('[data-value="dashboard"]');
      await expect(dashboardContent).toBeVisible();
      
      // Navigate back to main tab
      const mainTab = page.locator('[data-value="front-desk-upsell"]');
      if (await mainTab.isVisible()) {
        await mainTab.click();
        await frontDeskPage.waitForReservationsToLoad();
      }
    }
  });

  test('should handle Alert components display', async ({ page }) => {
    await frontDeskPage.navigate();
    
    // Alert components are shown at the top of the page
    // They appear automatically or on certain actions
    
    // Look for any existing alerts
    const alert = page.locator('[role="alert"]').first();
    
    if (await alert.isVisible({ timeout: 2000 })) {
      // Verify alert has proper structure
      await expect(alert).toHaveClass(/border-green-500|border-red-500/);
      
      // Alert should have content
      const alertContent = alert.locator('[data-slot="description"]');
      if (await alertContent.isVisible()) {
        const content = await alertContent.textContent();
        expect(content).toBeTruthy();
      }
    }
  });

  test('should handle responsive layout', async ({ page }) => {
    // Test responsive behavior of shadcn/ui components
    
    // Desktop view first
    await page.setViewportSize({ width: 1200, height: 800 });
    await frontDeskPage.navigate();
    await frontDeskPage.waitForReservationsToLoad();
    
    const table = page.locator('[data-testid="reservations-table"]');
    await expect(table).toBeVisible();
    
    // Mobile view
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(500); // Allow layout to adjust
    
    // Table should still be visible but may have different styling
    await expect(table).toBeVisible();
    
    // Search input should be responsive
    const searchInput = page.locator('[data-testid="reservations-search-input"]');
    await expect(searchInput).toBeVisible();
    
    // Reset to desktop
    await page.setViewportSize({ width: 1200, height: 800 });
  });

  test('should handle Card components', async ({ page }) => {
    // Navigate to homepage to test Card components
    await page.goto('/');
    
    const dashboardCards = page.locator('[data-testid="dashboard-cards"]');
    await expect(dashboardCards).toBeVisible();
    
    // Test individual cards
    const quickStatsCard = page.locator('[data-testid="quick-stats-card"]');
    const recentActivityCard = page.locator('[data-testid="recent-activity-card"]');
    const systemStatusCard = page.locator('[data-testid="system-status-card"]');
    
    await expect(quickStatsCard).toBeVisible();
    await expect(recentActivityCard).toBeVisible();
    await expect(systemStatusCard).toBeVisible();
    
    // Verify cards have proper styling (shadcn/ui card classes)
    await expect(quickStatsCard).toHaveClass(/border/);
    await expect(quickStatsCard).toHaveClass(/rounded-lg/);
    
    // Test card content
    const cardTitle = quickStatsCard.locator('h2');
    const cardContent = quickStatsCard.locator('p');
    
    await expect(cardTitle).toBeVisible();
    await expect(cardContent).toBeVisible();
  });

  test('should handle dark mode compatibility', async ({ page }) => {
    // Test shadcn/ui components in different color schemes
    
    await frontDeskPage.navigate();
    await frontDeskPage.waitForReservationsToLoad();
    
    // Check if dark mode toggle exists or can be simulated
    // This depends on the actual implementation
    
    // For now, test that components render correctly
    const table = page.locator('[data-testid="reservations-table"]');
    await expect(table).toBeVisible();
    
    // Verify components have proper CSS custom properties for theming
    const styles = await table.evaluate((el) => {
      const computed = window.getComputedStyle(el);
      return {
        backgroundColor: computed.backgroundColor,
        borderColor: computed.borderColor,
        color: computed.color
      };
    });
    
    // Basic checks that styling is applied
    expect(styles.backgroundColor).toBeTruthy();
    expect(styles.color).toBeTruthy();
  });

  test('should handle form validation states', async ({ page }) => {
    await frontDeskPage.navigate();
    await frontDeskPage.waitForReservationsToLoad();
    
    // Test form validation on search input
    const searchInput = page.locator('[data-testid="reservations-search-input"]');
    
    // Test very long input
    const longString = 'a'.repeat(1000);
    await searchInput.fill(longString);
    
    // Input should handle long content gracefully
    await expect(searchInput).toBeVisible();
    
    // Clear and test special characters
    await searchInput.clear();
    await searchInput.fill('!@#$%^&*()');
    
    // Should not break the component
    await expect(searchInput).toBeVisible();
    
    // Reset
    await searchInput.clear();
  });
});