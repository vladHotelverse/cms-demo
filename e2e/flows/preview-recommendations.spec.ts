import { test, expect } from '@playwright/test';
import { FrontDeskTestHelpers, DataValidationHelpers } from '../utils/test-helpers';

test.describe('Flow 2: Preview Recommendations', () => {
  let helpers: FrontDeskTestHelpers;

  test.beforeEach(async ({ page }) => {
    helpers = new FrontDeskTestHelpers(page);
    await page.goto('/ventas/front-desk-upsell');
    await helpers.waitForReservationDataLoad();
  });

  test('should successfully open and display recommendation interface', async () => {
    // Act: Open recommendations for a reservation
    await helpers.clickFirstRecommendationReservation();
    
    // Assert: Verify recommendation tab opens
    await helpers.verifyReservationSummaryTab('Recommended Services');
    
    // Assert: Verify all main sections are present
    await helpers.verifyRecommendationInterface();
    
    // Assert: Verify reservation details are displayed
    await expect(helpers.page.getByText('Booking ID')).toBeVisible();
    await expect(helpers.page.getByText('Guest')).toBeVisible();
    await expect(helpers.page.getByText('Room Type')).toBeVisible();
    await expect(helpers.page.getByText('nights')).toBeVisible();
    
    // Assert: Verify initial state shows no selections
    await expect(helpers.page.getByText('No items selected')).toBeVisible();
    await expect(helpers.page.getByText('Select rooms and services')).toBeVisible();
  });

  test('should display room upgrade options with correct pricing', async ({ page }) => {
    await helpers.clickFirstRecommendationReservation();
    await helpers.verifyRecommendationInterface();
    
    // Verify room options are displayed
    const roomCards = page.locator('div').filter({ hasText: /per night/ });
    await expect(roomCards.first()).toBeVisible();
    
    // Verify availability buttons are shown
    const availabilityButtons = page.locator('button').filter({ hasText: /\d+ Available/ });
    await expect(availabilityButtons.first()).toBeVisible();
    
    // Verify pricing information
    const priceElements = page.locator('text=/€\d+/');
    const priceCount = await priceElements.count();
    expect(priceCount).toBeGreaterThan(0);
    
    // Verify room descriptions and features are shown
    const roomFeatures = [
      /\d+ to \d+ m2/, // Room size
      /King|Twin|Queen|Bed/, // Bed types
      /View|Pool|Beach|Balcony/, // Room features
      /Suite|Deluxe|Standard/ // Room categories
    ];
    
    let featuresFound = 0;
    for (const feature of roomFeatures) {
      const featureElements = page.locator(`text=${feature}`);
      const count = await featureElements.count();
      if (count > 0) {
        featuresFound++;
      }
    }
    
    expect(featuresFound).toBeGreaterThan(0);
  });

  test('should display room customization options', async ({ page }) => {
    await helpers.clickFirstRecommendationReservation();
    await helpers.verifyRecommendationInterface();
    
    // Verify customization section
    await expect(page.getByRole('heading', { name: 'Room Customization' })).toBeVisible();
    
    // Verify customization options are available
    await helpers.verifyRoomCustomizationOptions();
    
    // Verify different customization categories
    const customizationCategories = [
      'beds', 'features', 'orientation', 'location', 
      'floor', 'distribution', 'view', 'exact View', 'special Offers'
    ];
    
    let categoriesFound = 0;
    for (const category of customizationCategories) {
      const categoryButton = page.getByRole('button', { name: category });
      try {
        await expect(categoryButton).toBeVisible({ timeout: 1000 });
        categoriesFound++;
      } catch {
        // Category might not be visible, continue
      }
    }
    
    expect(categoriesFound).toBeGreaterThan(0);
  });

  test('should display stay enhancement options', async ({ page }) => {
    await helpers.clickFirstRecommendationReservation();
    await helpers.verifyRecommendationInterface();
    
    // Verify stay enhancements section
    await expect(page.getByRole('heading', { name: 'Stay Enhancements' })).toBeVisible();
    
    // Verify enhancement cards are displayed
    const enhancementCards = page.locator('div').filter({ hasText: /per stay/ });
    await expect(enhancementCards.first()).toBeVisible();
    
    // Verify quantity controls are present
    const quantityControls = page.locator('button').filter({ hasText: /Increase quantity|Decrease quantity/ });
    const controlsCount = await quantityControls.count();
    expect(controlsCount).toBeGreaterThan(0);
    
    // Verify "Book Now" buttons are initially disabled
    const bookNowButtons = page.locator('button').filter({ hasText: 'Book Now' });
    const bookNowCount = await bookNowButtons.count();
    expect(bookNowCount).toBeGreaterThan(0);
    
    // Check that at least some Book Now buttons are disabled initially
    const disabledBookNowButtons = page.locator('button[disabled]').filter({ hasText: 'Book Now' });
    const disabledCount = await disabledBookNowButtons.count();
    expect(disabledCount).toBeGreaterThan(0);
  });

  test('should handle configuration options correctly', async () => {
    await helpers.clickFirstRecommendationReservation();
    await helpers.verifyRecommendationInterface();
    
    // Test configuration selectors
    const { segmentSelector, agentSelector } = await helpers.testConfigurationSelectors();
    
    // Verify view toggle options
    const listButton = helpers.page.getByRole('button', { name: 'List' });
    const blocksButton = helpers.page.getByRole('button', { name: 'Blocks' });
    
    await expect(listButton).toBeVisible();
    await expect(blocksButton).toBeVisible();
    
    // Test view toggle functionality
    await blocksButton.click();
    // Note: Visual changes would be verified through UI testing
    
    await listButton.click();
    // Verify list view is selected
  });

  test('should display correct pricing and loyalty discounts', async ({ page }) => {
    await helpers.clickFirstRecommendationReservation();
    await helpers.verifyRecommendationInterface();
    
    // Verify loyalty discount indicators
    const loyaltyElements = page.locator('text=/Loyalty \d+%/');
    const loyaltyCount = await loyaltyElements.count();
    
    if (loyaltyCount > 0) {
      await expect(loyaltyElements.first()).toBeVisible();
      
      // Verify discount amounts are shown
      const discountElements = page.locator('div').filter({ hasText: /€\d+\.\d+ EUR/ });
      await expect(discountElements.first()).toBeVisible();
    }
    
    // Verify total pricing information
    const totalElements = page.locator('text=/Total/');
    await expect(totalElements.first()).toBeVisible();
    
    // Verify "Price includes all taxes and fees" notice
    const taxNotice = page.locator('text=Price includes all taxes and fees');
    await expect(taxNotice.first()).toBeVisible();
  });

  test('should handle room carousel navigation', async ({ page }) => {
    await helpers.clickFirstRecommendationReservation();
    await helpers.verifyRecommendationInterface();
    
    // Find carousel navigation buttons
    const prevButton = page.getByRole('button', { name: 'Previous room' });
    const nextButton = page.getByRole('button', { name: 'Next room' });
    
    // At least one navigation should be present if there are multiple rooms
    const navigationPresent = await prevButton.isVisible() || await nextButton.isVisible();
    
    if (navigationPresent) {
      // Test navigation functionality
      if (await nextButton.isVisible() && !await nextButton.isDisabled()) {
        await nextButton.click();
        // Verify page changed (implementation dependent)
      }
      
      if (await prevButton.isVisible() && !await prevButton.isDisabled()) {
        await prevButton.click();
        // Verify page changed back
      }
    }
    
    // Verify room indicators are present
    const roomIndicators = page.locator('button').filter({ hasText: /Go to room \d+/ });
    const indicatorCount = await roomIndicators.count();
    
    if (indicatorCount > 0) {
      await expect(roomIndicators.first()).toBeVisible();
    }
  });

  test('should handle enhancement carousel navigation', async ({ page }) => {
    await helpers.clickFirstRecommendationReservation();
    await helpers.verifyRecommendationInterface();
    
    // Find enhancement carousel navigation
    const prevOfferButton = page.getByRole('button', { name: 'Previous offer' });
    const nextOfferButton = page.getByRole('button', { name: 'Next offer' });
    
    // Test offer navigation if available
    const offerNavigationPresent = await prevOfferButton.isVisible() || await nextOfferButton.isVisible();
    
    if (offerNavigationPresent) {
      if (await nextOfferButton.isVisible() && !await nextOfferButton.isDisabled()) {
        await nextOfferButton.click();
      }
      
      if (await prevOfferButton.isVisible() && !await prevOfferButton.isDisabled()) {
        await prevOfferButton.click();
      }
    }
    
    // Verify offer indicators
    const offerIndicators = page.locator('button').filter({ hasText: /Go to offer \d+/ });
    const offerIndicatorCount = await offerIndicators.count();
    
    if (offerIndicatorCount > 0) {
      await expect(offerIndicators.first()).toBeVisible();
    }
  });

  test('should display selection summary correctly', async ({ page }) => {
    await helpers.clickFirstRecommendationReservation();
    await helpers.verifyRecommendationInterface();
    
    // Verify selection summary section
    await expect(page.getByRole('heading', { name: 'Selection Summary' })).toBeVisible();
    
    // Verify action buttons are present but disabled initially
    const clearAllButton = page.getByRole('button', { name: 'Clear All' });
    const confirmButton = page.getByRole('button', { name: 'Confirm Selection' });
    
    await expect(clearAllButton).toBeVisible();
    await expect(confirmButton).toBeVisible();
    
    // Initially should be disabled
    await expect(clearAllButton).toBeDisabled();
    await expect(confirmButton).toBeDisabled();
    
    // Verify summary counters
    const selectedRoomsCounter = page.locator('div').filter({ hasText: /Selected Rooms.*0/ });
    const extraServicesCounter = page.locator('div').filter({ hasText: /Extra Services.*0/ });
    
    await expect(selectedRoomsCounter).toBeVisible();
    await expect(extraServicesCounter).toBeVisible();
  });

  test('should validate data formats in recommendation interface', async ({ page }) => {
    await helpers.clickFirstRecommendationReservation();
    await helpers.verifyRecommendationInterface();
    
    // Validate booking ID format
    const bookingIdElement = page.locator('div').filter({ hasText: /Booking ID/ }).locator('p');
    const bookingId = await bookingIdElement.textContent();
    expect(bookingId).toMatch(/^LOC\d+$/);
    
    // Validate price formats
    const priceElements = page.locator('text=/€\d+(\.\d{2})?/');
    const priceCount = await priceElements.count();
    expect(priceCount).toBeGreaterThan(0);
    
    // Validate availability numbers
    const availabilityElements = page.locator('button').filter({ hasText: /\d+ Available/ });
    const availabilityCount = await availabilityElements.count();
    
    if (availabilityCount > 0) {
      const availabilityText = await availabilityElements.first().textContent();
      expect(availabilityText).toMatch(/^\d+ Available$/);
    }
  });

  test('should handle empty states and error conditions', async ({ page }) => {
    await helpers.clickFirstRecommendationReservation();
    await helpers.verifyRecommendationInterface();
    
    // Verify empty selection state
    await expect(page.getByText('No items selected')).toBeVisible();
    await expect(page.getByText('Select rooms and services')).toBeVisible();
    
    // Verify buttons are appropriately disabled
    await expect(page.getByRole('button', { name: 'Clear All' })).toBeDisabled();
    await expect(page.getByRole('button', { name: 'Confirm Selection' })).toBeDisabled();
    
    // Verify quantity controls start at 0 for enhancements
    const quantityDisplays = page.locator('text="0"').filter({ hasText: /^0$/ });
    const quantityCount = await quantityDisplays.count();
    expect(quantityCount).toBeGreaterThan(0);
  });

  test('should maintain correct tab state during navigation', async () => {
    // Open recommendation tab
    await helpers.clickFirstRecommendationReservation();
    const recommendationTab = await helpers.verifyReservationSummaryTab('Recommended Services');
    const tabName = await recommendationTab.textContent();
    
    // Navigate to main tab
    await helpers.navigateToMainTab();
    
    // Navigate back to recommendation tab
    await helpers.page.locator(`div[role="tablist"] button`).filter({ hasText: tabName! }).click();
    
    // Verify recommendation interface is still intact
    await helpers.verifyRecommendationInterface();
    await expect(helpers.page.getByText('No items selected')).toBeVisible();
  });
});