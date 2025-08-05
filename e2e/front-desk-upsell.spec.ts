import { test, expect, type Page } from '@playwright/test';

test.describe('Front Desk Upsell Flows', () => {
  let page: Page;

  test.beforeEach(async ({ browser }) => {
    page = await browser.newPage();
    await page.goto('/ventas/front-desk-upsell');
    
    // Wait for the page to load and data to be generated
    await expect(page.getByText('Showing reservations for')).toBeVisible();
    await page.waitForFunction(() => {
      const text = document.querySelector('[data-testid="reservations-count"]')?.textContent || 
                   document.body.textContent || '';
      return !text.includes('Loading orders') && !text.includes('(0 reservations)');
    }, { timeout: 10000 });
  });

  test.afterEach(async () => {
    await page.close();
  });

  test.describe('User Flow 1: Preview Reserved Items', () => {
    test('should successfully preview items for reservation with reserved items', async () => {
      // Step 1: Find a reservation with reserved items
      const reservedItemButton = page.locator('button').filter({ 
        hasText: /\d+ reserved items?/ 
      }).first();
      
      await expect(reservedItemButton).toBeVisible({ timeout: 10000 });
      
      // Get reservation details before clicking
      const buttonText = await reservedItemButton.textContent();
      const itemCount = buttonText?.match(/(\d+) reserved/)?.[1];
      expect(itemCount).toBeTruthy();
      
      // Step 2: Click on reserved items button
      await reservedItemButton.click();
      
      // Step 3: Verify reservation summary tab opens
      const reservationTab = page.locator('div[role="tablist"] button').filter({ 
        hasText: /^(?!Front Desk Upsell|Dashboard|Request Management).*/ 
      }).first();
      
      await expect(reservationTab).toBeVisible();
      await expect(reservationTab).toHaveAttribute('aria-selected', 'true');
      
      // Step 4: Verify reservation summary content is displayed
      await expect(page.getByRole('heading', { name: 'Request Summary' })).toBeVisible();
      
      // Verify reservation details section
      await expect(page.getByText('Booking ID')).toBeVisible();
      await expect(page.getByText('Guest')).toBeVisible();
      await expect(page.getByText('Room Type')).toBeVisible();
      await expect(page.getByText('Check-in')).toBeVisible();
      
      // Verify commission and total calculations
      await expect(page.getByText('Total Order')).toBeVisible();
      await expect(page.getByText('Est. Commission')).toBeVisible();
      
      // Step 5: Verify service tables are present
      const roomSection = page.locator('div').filter({ hasText: /Room.*\d+/ }).first();
      await expect(roomSection).toBeVisible();
      
      const extrasSection = page.locator('div').filter({ hasText: /Extra.*\d+/ }).first();
      await expect(extrasSection).toBeVisible();
      
      // Step 6: Verify service status indicators work
      const statusElements = page.locator('text=confirmed, text=pending hotel');
      await expect(statusElements.first()).toBeVisible();
      
      // Step 7: Verify back navigation works
      const backButton = page.getByRole('button', { name: 'Back' });
      await expect(backButton).toBeVisible();
      await backButton.click();
      
      // Should return to main reservation list
      await expect(page.getByRole('tab', { name: 'Front Desk Upsell' })).toHaveAttribute('aria-selected', 'true');
    });

    test('should handle multiple reserved item tabs correctly', async () => {
      // Open first reserved items
      const firstReservedButton = page.locator('button').filter({ 
        hasText: /\d+ reserved items?/ 
      }).first();
      await firstReservedButton.click();
      
      // Verify first tab is active
      const firstTab = page.locator('div[role="tablist"] button').filter({ 
        hasText: /^(?!Front Desk Upsell|Dashboard|Request Management).*/ 
      }).first();
      await expect(firstTab).toHaveAttribute('aria-selected', 'true');
      
      // Go back to main list
      await page.getByRole('tab', { name: 'Front Desk Upsell' }).click();
      
      // Open second reserved items (different reservation)
      const allReservedButtons = page.locator('button').filter({ 
        hasText: /\d+ reserved items?/ 
      });
      const buttonCount = await allReservedButtons.count();
      
      if (buttonCount > 1) {
        await allReservedButtons.nth(1).click();
        
        // Should now have two tabs open
        const tabs = page.locator('div[role="tablist"] button').filter({ 
          hasText: /^(?!Front Desk Upsell|Dashboard|Request Management).*/ 
        });
        await expect(tabs).toHaveCount(2);
      }
    });
  });

  test.describe('User Flow 2: Preview Recommendations', () => {
    test('should successfully preview recommendations for reservation', async () => {
      // Step 1: Find a reservation with "Recommend" button
      const recommendButton = page.locator('button').filter({ 
        hasText: 'Recommend' 
      }).first();
      
      await expect(recommendButton).toBeVisible({ timeout: 10000 });
      
      // Step 2: Click on recommend button
      await recommendButton.click();
      
      // Step 3: Verify recommendation tab opens
      const recommendationTab = page.locator('div[role="tablist"] button').filter({ 
        hasText: /^(?!Front Desk Upsell|Dashboard|Request Management).*/ 
      }).first();
      
      await expect(recommendationTab).toBeVisible();
      await expect(recommendationTab).toHaveAttribute('aria-selected', 'true');
      
      // Step 4: Verify recommendation interface loads
      await expect(page.getByRole('heading', { name: 'Recommended Services' })).toBeVisible();
      
      // Verify reservation details are shown
      await expect(page.getByText('Booking ID')).toBeVisible();
      await expect(page.getByText('Guest')).toBeVisible();
      
      // Step 5: Verify main recommendation sections are present
      await expect(page.getByRole('heading', { name: 'Superior Rooms' })).toBeVisible();
      await expect(page.getByRole('heading', { name: 'Room Customization' })).toBeVisible();
      await expect(page.getByRole('heading', { name: 'Stay Enhancements' })).toBeVisible();
      await expect(page.getByRole('heading', { name: 'Selection Summary' })).toBeVisible();
      
      // Step 6: Verify room options are displayed
      const roomCards = page.locator('div').filter({ hasText: /per night/ });
      await expect(roomCards.first()).toBeVisible();
      
      // Step 7: Verify customization options are available
      const customizationButtons = page.locator('button').filter({ 
        hasText: /\d+ available/ 
      });
      await expect(customizationButtons.first()).toBeVisible();
      
      // Step 8: Verify stay enhancements are shown
      const enhancementCards = page.locator('div').filter({ hasText: /per stay/ });
      await expect(enhancementCards.first()).toBeVisible();
      
      // Step 9: Verify selection summary shows empty state
      await expect(page.getByText('No items selected')).toBeVisible();
      await expect(page.getByText('Select rooms and services')).toBeVisible();
      
      // Step 10: Verify configuration options work
      const segmentSelector = page.locator('div').filter({ hasText: /Segment:/ }).locator('button').first();
      await expect(segmentSelector).toBeVisible();
      
      const agentSelector = page.locator('div').filter({ hasText: /Agent:/ }).locator('button').first();
      await expect(agentSelector).toBeVisible();
    });

    test('should handle view toggle between List and Blocks', async () => {
      // Open recommendations
      const recommendButton = page.locator('button').filter({ 
        hasText: 'Recommend' 
      }).first();
      await recommendButton.click();
      
      // Wait for interface to load
      await expect(page.getByRole('heading', { name: 'Recommended Services' })).toBeVisible();
      
      // Find view toggle buttons
      const listButton = page.getByRole('button', { name: 'List' });
      const blocksButton = page.getByRole('button', { name: 'Blocks' });
      
      await expect(listButton).toBeVisible();
      await expect(blocksButton).toBeVisible();
      
      // Test toggle functionality
      await blocksButton.click();
      // Verify blocks view is active (implementation would show visual changes)
      
      await listButton.click();
      // Verify list view is active
    });
  });

  test.describe('User Flow 3: Preview and Add Recommendations', () => {
    test('should successfully add room upgrade recommendation', async () => {
      // Step 1: Open recommendations
      const recommendButton = page.locator('button').filter({ 
        hasText: 'Recommend' 
      }).first();
      await recommendButton.click();
      
      // Wait for interface to load
      await expect(page.getByRole('heading', { name: 'Recommended Services' })).toBeVisible();
      
      // Step 2: Select a room upgrade
      const roomAvailabilityButton = page.locator('button').filter({ 
        hasText: /\d+ Available/ 
      }).first();
      
      await expect(roomAvailabilityButton).toBeVisible();
      const initialTotal = await page.locator('text=€0').first().textContent();
      
      await roomAvailabilityButton.click();
      
      // Step 3: Verify selection is reflected in summary
      const selectedRoomsCount = page.locator('div').filter({ 
        hasText: /Selected Rooms/ 
      }).locator('text=1').first();
      
      await expect(selectedRoomsCount).toBeVisible({ timeout: 5000 });
      
      // Step 4: Verify total is updated
      await expect(page.locator('text=€0').first()).not.toBeVisible();
      
      // Step 5: Verify confirm button becomes enabled
      const confirmButton = page.getByRole('button', { name: 'Confirm Selection' });
      await expect(confirmButton).toBeEnabled();
    });

    test('should successfully add stay enhancements', async () => {
      // Step 1: Open recommendations
      const recommendButton = page.locator('button').filter({ 
        hasText: 'Recommend' 
      }).first();
      await recommendButton.click();
      
      await expect(page.getByRole('heading', { name: 'Recommended Services' })).toBeVisible();
      
      // Step 2: Add a stay enhancement with quantity controls
      const increaseQuantityButton = page.locator('button').filter({ 
        hasText: /Increase quantity/ 
      }).first();
      
      await expect(increaseQuantityButton).toBeVisible();
      await increaseQuantityButton.click();
      
      // Step 3: Verify quantity increased
      const quantityDisplay = increaseQuantityButton.locator('..').locator('text=1').first();
      await expect(quantityDisplay).toBeVisible();
      
      // Step 4: Verify corresponding "Book Now" button becomes enabled
      const bookNowButton = increaseQuantityButton.locator('../..').getByRole('button', { name: 'Book Now' });
      await expect(bookNowButton).toBeEnabled();
      
      // Step 5: Click Book Now to add to selection
      await bookNowButton.click();
      
      // Step 6: Verify selection summary updates
      const extraServicesCount = page.locator('div').filter({ 
        hasText: /Extra Services/ 
      }).locator('text=1').first();
      
      await expect(extraServicesCount).toBeVisible({ timeout: 5000 });
    });

    test('should successfully add room customization options', async () => {
      // Step 1: Open recommendations
      const recommendButton = page.locator('button').filter({ 
        hasText: 'Recommend' 
      }).first();
      await recommendButton.click();
      
      await expect(page.getByRole('heading', { name: 'Room Customization' })).toBeVisible();
      
      // Step 2: Select a bed type customization
      const bedTypeButton = page.locator('div').filter({ 
        hasText: /King Size Bed|Twin Beds/ 
      }).locator('button').filter({ hasText: /available/ }).first();
      
      await expect(bedTypeButton).toBeVisible();
      await bedTypeButton.click();
      
      // Step 3: Verify customization is reflected in pricing
      // The system should show updated pricing with customization costs
      await expect(page.locator('text=€').first()).toBeVisible();
    });

    test('should handle complete flow: select multiple items and confirm', async () => {
      // Step 1: Open recommendations
      const recommendButton = page.locator('button').filter({ 
        hasText: 'Recommend' 
      }).first();
      await recommendButton.click();
      
      await expect(page.getByRole('heading', { name: 'Recommended Services' })).toBeVisible();
      
      // Step 2: Add room upgrade
      const roomButton = page.locator('button').filter({ 
        hasText: /\d+ Available/ 
      }).first();
      await roomButton.click();
      
      // Step 3: Add customization
      const customizationButton = page.locator('div').filter({ 
        hasText: /available/ 
      }).locator('button').first();
      await customizationButton.click();
      
      // Step 4: Add enhancement
      const enhancementQuantityButton = page.locator('button').filter({ 
        hasText: /Increase quantity/ 
      }).first();
      await enhancementQuantityButton.click();
      
      const bookNowButton = enhancementQuantityButton.locator('../..').getByRole('button', { name: 'Book Now' });
      await bookNowButton.click();
      
      // Step 5: Verify all selections are in summary
      await expect(page.locator('text=No items selected')).not.toBeVisible();
      
      // Step 6: Confirm selection
      const confirmButton = page.getByRole('button', { name: 'Confirm Selection' });
      await expect(confirmButton).toBeEnabled();
      await confirmButton.click();
      
      // Step 7: Verify success state or next step
      // This would depend on the actual implementation
      // Could be a success message, redirect, or updated state
    });

    test('should handle clear all selections functionality', async () => {
      // Step 1: Open recommendations and add items
      const recommendButton = page.locator('button').filter({ 
        hasText: 'Recommend' 
      }).first();
      await recommendButton.click();
      
      await expect(page.getByRole('heading', { name: 'Recommended Services' })).toBeVisible();
      
      // Add a room
      const roomButton = page.locator('button').filter({ 
        hasText: /\d+ Available/ 
      }).first();
      await roomButton.click();
      
      // Verify item was added
      await expect(page.locator('text=No items selected')).not.toBeVisible();
      
      // Step 2: Clear all selections
      const clearAllButton = page.getByRole('button', { name: 'Clear All' });
      await expect(clearAllButton).toBeEnabled();
      await clearAllButton.click();
      
      // Step 3: Verify selections are cleared
      await expect(page.getByText('No items selected')).toBeVisible();
      await expect(page.getByRole('button', { name: 'Confirm Selection' })).toBeDisabled();
    });
  });

  test.describe('Cross-flow Navigation and State Management', () => {
    test('should maintain tab state when switching between flows', async () => {
      // Open a reserved items tab
      const reservedButton = page.locator('button').filter({ 
        hasText: /\d+ reserved items?/ 
      }).first();
      await reservedButton.click();
      
      const firstTabName = await page.locator('div[role="tablist"] button[aria-selected="true"]').textContent();
      
      // Go back and open a recommendation tab
      await page.getByRole('tab', { name: 'Front Desk Upsell' }).click();
      
      const recommendButton = page.locator('button').filter({ 
        hasText: 'Recommend' 
      }).first();
      await recommendButton.click();
      
      // Verify both tabs exist
      const tabs = page.locator('div[role="tablist"] button').filter({ 
        hasText: /^(?!Front Desk Upsell|Dashboard|Request Management).*/ 
      });
      await expect(tabs).toHaveCount(2);
      
      // Switch back to first tab
      await page.locator('div[role="tablist"] button').filter({ hasText: firstTabName! }).click();
      await expect(page.getByRole('heading', { name: 'Request Summary' })).toBeVisible();
    });

    test('should handle tab closing correctly', async () => {
      // Open a recommendation tab
      const recommendButton = page.locator('button').filter({ 
        hasText: 'Recommend' 
      }).first();
      await recommendButton.click();
      
      // Find and click the close button on the tab
      const closeButton = page.locator('div[role="tablist"] button[aria-selected="true"]').locator('button').last();
      await closeButton.click();
      
      // Should return to main Front Desk Upsell tab
      await expect(page.getByRole('tab', { name: 'Front Desk Upsell' })).toHaveAttribute('aria-selected', 'true');
    });
  });

  test.describe('Error Handling and Edge Cases', () => {
    test('should handle empty reservation list gracefully', async () => {
      // Clear search to ensure we see the empty state if no data
      const searchInput = page.getByPlaceholder('Search by locator or name...');
      await searchInput.fill('NonExistentReservation123456');
      
      await expect(page.getByText('No reservations found')).toBeVisible();
      
      // Clear search
      await searchInput.clear();
    });

    test('should handle search functionality correctly', async () => {
      // Wait for data to load
      await page.waitForFunction(() => {
        const text = document.body.textContent || '';
        return !text.includes('Loading orders') && !text.includes('(0 reservations)');
      });
      
      // Get first guest name from the table
      const firstGuestName = await page.locator('table tbody tr').first().locator('td').nth(1).locator('div div').first().textContent();
      
      if (firstGuestName) {
        const searchInput = page.getByPlaceholder('Search by locator or name...');
        await searchInput.fill(firstGuestName);
        
        // Should show only that reservation
        await expect(page.getByText('(1 reservations)')).toBeVisible();
        
        // Verify the guest name is still visible
        await expect(page.getByText(firstGuestName)).toBeVisible();
      }
    });
  });
});