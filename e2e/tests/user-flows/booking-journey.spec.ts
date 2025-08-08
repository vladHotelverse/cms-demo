import { test, expect } from '@playwright/test';
import { BookingPage } from '../../support/page-objects/BookingPage';
import { HomePage } from '../../support/page-objects/HomePage';
import { TestData } from '../../fixtures/test-data';

test.describe('Complete Booking Journey', () => {
  let homePage: HomePage;
  let bookingPage: BookingPage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    bookingPage = new BookingPage(page);
    await homePage.navigate();
  });

  test('should complete end-to-end booking flow', async ({ page }) => {
    const bookingData = TestData.getBookingData();

    // Start booking process
    await homePage.startBooking();
    
    // Select room type
    await bookingPage.selectRoomType(bookingData.roomType);
    
    // Fill guest details
    await bookingPage.fillGuestDetails(bookingData.guestDetails);
    
    // Select dates
    await bookingPage.selectDates(bookingData.checkIn, bookingData.checkOut);
    
    // Add extras
    await bookingPage.addExtras(bookingData.extras);
    
    // Complete booking
    await bookingPage.completeBooking();
    
    // Verify confirmation
    await expect(page.locator('[data-testid="booking-confirmation"]')).toBeVisible();
  });

  test('should handle booking with room upgrades', async ({ page }) => {
    const bookingData = TestData.getBookingDataWithUpgrades();

    await homePage.startBooking();
    await bookingPage.selectRoomType(bookingData.roomType);
    await bookingPage.upgradeRoom(bookingData.upgradeType);
    await bookingPage.completeBooking();

    await expect(bookingPage.totalPrice).toContainText(bookingData.expectedTotal);
  });

  test('should validate booking form errors', async ({ page }) => {
    await homePage.startBooking();
    await bookingPage.attemptBookingWithoutDetails();
    
    await expect(bookingPage.validationErrors).toHaveCount({ atLeast: 1 });
  });
});