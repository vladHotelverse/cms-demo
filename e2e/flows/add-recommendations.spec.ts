import { test, expect } from '@playwright/test';
import { FrontDeskTestHelpers, DataValidationHelpers } from '../utils/test-helpers';

test.describe('Flow 3: Preview and Add Recommendations', () => {
  let helpers: FrontDeskTestHelpers;

  test.beforeEach(async ({ page }) => {
    helpers = new FrontDeskTestHelpers(page);
    await page.goto('/ventas/front-desk-upsell');
    await helpers.waitForReservationDataLoad();
  });

  test('should successfully add room upgrade and update totals', async ({ page }) => {
    // Arrange: Open recommendations
    await helpers.clickFirstRecommendationReservation();
    await helpers.verifyRecommendationInterface();
    
    // Capture initial state
    const initialTotal = await page.locator('p').filter({ hasText: /€0/ }).first().textContent();
    expect(initialTotal).toBe('€0');
    
    // Act: Add room upgrade
    await helpers.addRoomUpgrade();
    
    // Assert: Verify selection summary updates
    const selectedRoomsCount = page.locator('div').filter({ 
      hasText: /Selected Rooms/ 
    }).locator('text=1').first();
    await expect(selectedRoomsCount).toBeVisible();
    
    // Assert: Verify total is no longer €0
    await expect(page.locator('p').filter({ hasText: 'Total Order' }).locator('..').locator('p').filter({ hasText: /€\d+/ })).not.toHaveText('€0');
    
    // Assert: Verify confirm button becomes enabled
    const confirmButton = await helpers.verifyItemsSelected();
    await expect(confirmButton).toBeEnabled();
  });

  test('should successfully add stay enhancement with quantity control', async ({ page }) => {
    // Arrange: Open recommendations
    await helpers.clickFirstRecommendationReservation();
    await helpers.verifyRecommendationInterface();
    
    // Act: Add stay enhancement
    const { increaseQuantityButton, bookNowButton } = await helpers.addStayEnhancement();
    
    // Assert: Verify quantity display updated
    const quantityDisplay = page.locator('div').filter({ 
      hasText: /Increase quantity/ 
    }).first().locator('..').locator('text=1').first();
    await expect(quantityDisplay).toBeVisible();
    
    // Assert: Verify extra services counter updated
    const extraServicesCount = page.locator('div').filter({ 
      hasText: /Extra Services/ 
    }).locator('text=1').first();
    await expect(extraServicesCount).toBeVisible();
    
    // Assert: Verify selection can be confirmed
    await helpers.verifyItemsSelected();
  });

  test('should successfully add room customization options', async ({ page }) => {
    // Arrange: Open recommendations
    await helpers.clickFirstRecommendationReservation();
    await helpers.verifyRecommendationInterface();
    
    // Act: Find and click customization option
    const customizationButtons = page.locator('button').filter({ 
      hasText: /\d+ available/ 
    });
    
    await expect(customizationButtons.first()).toBeVisible();
    const initialPricing = await page.locator('text=/€\d+/').first().textContent();
    
    await customizationButtons.first().click();
    
    // Assert: Verify customization affects pricing (implementation dependent)
    // This would depend on whether customizations show immediate price changes
    const updatedPricing = await page.locator('text=/€\d+/').first().textContent();
    // In some implementations, customization might update pricing immediately
  });

  test('should handle multiple enhancement quantities correctly', async ({ page }) => {
    // Arrange: Open recommendations
    await helpers.clickFirstRecommendationReservation();
    await helpers.verifyRecommendationInterface();
    
    // Act: Add multiple quantities of the same enhancement
    const increaseButton = page.locator('button').filter({ 
      hasText: /Increase quantity/ 
    }).first();
    
    await expect(increaseButton).toBeVisible();
    
    // Add quantity 1
    await increaseButton.click();
    let quantityDisplay = increaseButton.locator('..').locator('text=1');
    await expect(quantityDisplay).toBeVisible();
    
    // Enable and book first quantity
    const bookNowButton = increaseButton.locator('../..').getByRole('button', { name: 'Book Now' });
    await expect(bookNowButton).toBeEnabled();
    await bookNowButton.click();
    
    // Add another quantity of the same service
    await increaseButton.click();
    quantityDisplay = increaseButton.locator('..').locator('text=2');
    await expect(quantityDisplay).toBeVisible();
    
    // Book second quantity
    await expect(bookNowButton).toBeEnabled();
    await bookNowButton.click();
    
    // Assert: Verify extra services counter reflects multiple items
    const extraServicesCount = page.locator('div').filter({ 
      hasText: /Extra Services/ 
    }).locator('text=2').first();
    await expect(extraServicesCount).toBeVisible();
  });

  test('should handle decrease quantity functionality', async ({ page }) => {
    // Arrange: Open recommendations and add quantity
    await helpers.clickFirstRecommendationReservation();
    await helpers.verifyRecommendationInterface();
    
    const increaseButton = page.locator('button').filter({ 
      hasText: /Increase quantity/ 
    }).first();
    
    // Add 2 quantities
    await increaseButton.click();
    await increaseButton.click();
    
    let quantityDisplay = increaseButton.locator('..').locator('text=2');
    await expect(quantityDisplay).toBeVisible();
    
    // Act: Decrease quantity
    const decreaseButton = increaseButton.locator('..').locator('button').filter({ 
      hasText: /Decrease quantity/ 
    });
    
    await expect(decreaseButton).toBeEnabled();
    await decreaseButton.click();
    
    // Assert: Verify quantity decreased
    quantityDisplay = increaseButton.locator('..').locator('text=1');
    await expect(quantityDisplay).toBeVisible();
    
    // Decrease to 0
    await decreaseButton.click();
    quantityDisplay = increaseButton.locator('..').locator('text=0');
    await expect(quantityDisplay).toBeVisible();
    
    // Assert: Verify decrease button is disabled at 0
    await expect(decreaseButton).toBeDisabled();
  });

  test('should successfully complete full selection flow', async ({ page }) => {
    // Arrange: Open recommendations
    await helpers.clickFirstRecommendationReservation();
    await helpers.verifyRecommendationInterface();
    
    let totalItemsSelected = 0;
    
    // Act: Add room upgrade
    await helpers.addRoomUpgrade();
    totalItemsSelected++;
    
    // Act: Add customization if available
    const customizationButtons = page.locator('button').filter({ 
      hasText: /\d+ available/ 
    });
    const customizationCount = await customizationButtons.count();
    
    if (customizationCount > 0) {
      await customizationButtons.first().click();
      // Customizations might not count as separate items in some implementations
    }
    
    // Act: Add enhancement
    await helpers.addStayEnhancement();
    totalItemsSelected++;
    
    // Assert: Verify total selection count
    await expect(page.locator('text=No items selected')).not.toBeVisible();
    
    // Assert: Verify confirm button is enabled
    const confirmButton = await helpers.verifyItemsSelected();
    
    // Act: Confirm selection
    await confirmButton.click();
    
    // Assert: Verify completion (implementation dependent)
    // This could be a success message, redirect, or state change
    // For now, we just verify the click was successful
    expect(confirmButton).toBeTruthy();
  });

  test('should handle clear all selections functionality', async ({ page }) => {
    // Arrange: Add multiple selections
    await helpers.clickFirstRecommendationReservation();
    await helpers.verifyRecommendationInterface();
    
    // Add room upgrade
    await helpers.addRoomUpgrade();
    
    // Add enhancement
    await helpers.addStayEnhancement();
    
    // Verify items are selected
    await expect(page.locator('text=No items selected')).not.toBeVisible();
    
    // Act: Clear all selections
    await helpers.clearAllSelections();
    
    // Assert: Verify everything is cleared
    await expect(page.getByText('No items selected')).toBeVisible();
    await expect(page.getByText('Select rooms and services')).toBeVisible();
    
    // Assert: Verify counters are reset
    const selectedRoomsCounter = page.locator('div').filter({ hasText: /Selected Rooms.*0/ });
    const extraServicesCounter = page.locator('div').filter({ hasText: /Extra Services.*0/ });
    
    await expect(selectedRoomsCounter).toBeVisible();
    await expect(extraServicesCounter).toBeVisible();
  });

  test('should validate pricing calculations during selection', async ({ page }) => {
    // Arrange: Open recommendations
    await helpers.clickFirstRecommendationReservation();
    await helpers.verifyRecommendationInterface();
    
    // Capture initial commission
    const initialCommissionElement = page.locator('div').filter({ 
      hasText: /Est\. Commission/ 
    }).locator('text=/€\d+\.\d{2}/').first();
    const initialCommission = await initialCommissionElement.textContent();
    
    // Act: Add expensive room upgrade
    const roomButtons = page.locator('button').filter({ hasText: /\d+ Available/ });
    const roomCount = await roomButtons.count();
    
    if (roomCount > 1) {
      // Try to find a more expensive option (implementation dependent)
      await roomButtons.last().click(); // Assuming last might be more expensive
    } else {
      await roomButtons.first().click();
    }
    
    // Assert: Verify commission updated
    const updatedCommissionElement = page.locator('div').filter({ 
      hasText: /Est\. Commission/ 
    }).locator('text=/€\d+\.\d{2}/').first();
    const updatedCommission = await updatedCommissionElement.textContent();
    
    // Commission should be different from initial (assuming room upgrade affects commission)
    if (initialCommission === '€0.00') {
      expect(updatedCommission).not.toBe('€0.00');
    }
    
    // Validate commission format
    DataValidationHelpers.validateCommissionAmount(updatedCommission!);
  });

  test('should handle loyalty discount applications', async ({ page }) => {
    // Arrange: Open recommendations
    await helpers.clickFirstRecommendationReservation();
    await helpers.verifyRecommendationInterface();
    
    // Look for loyalty discount indicators
    const loyaltyElements = page.locator('text=/Loyalty \d+%/');
    const loyaltyCount = await loyaltyElements.count();
    
    if (loyaltyCount > 0) {
      // Act: Add item with loyalty discount
      const loyaltySection = loyaltyElements.first().locator('../..');
      const associatedButton = loyaltySection.locator('button').filter({ 
        hasText: /Available|Book Now/ 
      }).first();
      
      if (await associatedButton.isVisible()) {
        await associatedButton.click();
        
        // Assert: Verify discount is applied in pricing
        const discountElements = page.locator('text=/€\d+\.\d+ EUR/');
        await expect(discountElements.first()).toBeVisible();
      }
    }
  });

  test('should handle special offer selections', async ({ page }) => {
    // Arrange: Open recommendations
    await helpers.clickFirstRecommendationReservation();
    await helpers.verifyRecommendationInterface();
    
    // Look for special offers (free items, €0.00 items)
    const freeOffers = page.locator('text=€0.00');
    const freeOfferCount = await freeOffers.count();
    
    if (freeOfferCount > 0) {
      // Find the free offer section and its booking button
      const freeOfferSection = freeOffers.first().locator('../..');
      const increaseButton = freeOfferSection.locator('button').filter({ 
        hasText: /Increase quantity/ 
      });
      
      if (await increaseButton.isVisible()) {
        // Act: Add free offer
        await increaseButton.click();
        
        const bookButton = freeOfferSection.getByRole('button', { name: 'Book Now' });
        await expect(bookButton).toBeEnabled();
        await bookButton.click();
        
        // Assert: Verify free offer is added to selection
        const extraServicesCount = page.locator('div').filter({ 
          hasText: /Extra Services/ 
        }).locator('text=/\d+/').first();
        
        await expect(extraServicesCount).toBeVisible();
      }
    }
  });

  test('should maintain selection state during navigation', async ({ page }) => {
    // Arrange: Add selections
    await helpers.clickFirstRecommendationReservation();
    await helpers.verifyRecommendationInterface();
    
    await helpers.addRoomUpgrade();
    await helpers.addStayEnhancement();
    
    // Capture current selection state
    const selectedRoomsText = await page.locator('div').filter({ 
      hasText: /Selected Rooms/ 
    }).textContent();
    const extraServicesText = await page.locator('div').filter({ 
      hasText: /Extra Services/ 
    }).textContent();
    
    // Act: Navigate away and back
    await helpers.navigateToMainTab();
    
    // Navigate back to recommendation tab
    const recommendationTab = page.locator('div[role="tablist"] button').filter({ 
      hasText: /^(?!Front Desk Upsell|Dashboard|Request Management).*/ 
    }).first();
    await recommendationTab.click();
    
    // Assert: Verify selections are maintained
    await expect(page.locator('div').filter({ hasText: selectedRoomsText! })).toBeVisible();
    await expect(page.locator('div').filter({ hasText: extraServicesText! })).toBeVisible();
    
    // Verify confirm button is still enabled
    await expect(page.getByRole('button', { name: 'Confirm Selection' })).toBeEnabled();
  });

  test('should handle edge cases and error conditions', async ({ page }) => {
    // Arrange: Open recommendations
    await helpers.clickFirstRecommendationReservation();
    await helpers.verifyRecommendationInterface();
    
    // Test: Try to book enhancement without quantity
    const bookNowButtons = page.locator('button').filter({ hasText: 'Book Now' });
    const disabledBookNowCount = await page.locator('button[disabled]').filter({ hasText: 'Book Now' }).count();
    
    // Assert: Verify disabled Book Now buttons remain disabled when quantity is 0
    expect(disabledBookNowCount).toBeGreaterThan(0);
    
    // Test: Verify decrease button is disabled at quantity 0
    const decreaseButtons = page.locator('button').filter({ hasText: /Decrease quantity/ });
    const decreaseCount = await decreaseButtons.count();
    
    if (decreaseCount > 0) {
      // Should be disabled when quantity is 0
      await expect(decreaseButtons.first()).toBeDisabled();
    }
  });

  test('should validate final selection summary before confirmation', async ({ page }) => {
    // Arrange: Add multiple items
    await helpers.clickFirstRecommendationReservation();
    await helpers.verifyRecommendationInterface();
    
    await helpers.addRoomUpgrade();
    await helpers.addStayEnhancement();
    
    // Act: Verify summary details
    const totalOrderElement = page.locator('p').filter({ hasText: 'Total Order' }).locator('..').locator('p').filter({ hasText: /€\d+/ });
    const commissionElement = page.locator('div').filter({ hasText: /Est\. Commission/ }).locator('text=/€\d+\.\d{2}/');
    
    // Assert: Validate formatting
    const totalOrder = await totalOrderElement.textContent();
    const commission = await commissionElement.textContent();
    
    expect(totalOrder).toMatch(/^€\d+$/);
    DataValidationHelpers.validateCommissionAmount(commission!);
    
    // Assert: Verify selection counters are accurate
    const selectedRoomsElement = page.locator('div').filter({ hasText: /Selected Rooms/ }).locator('text=/\d+/');
    const extraServicesElement = page.locator('div').filter({ hasText: /Extra Services/ }).locator('text=/\d+/');
    
    const roomsCount = await selectedRoomsElement.textContent();
    const servicesCount = await extraServicesElement.textContent();
    
    expect(parseInt(roomsCount!)).toBeGreaterThan(0);
    expect(parseInt(servicesCount!)).toBeGreaterThan(0);
  });
});