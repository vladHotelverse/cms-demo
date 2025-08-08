import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class BookingPage extends BasePage {
  private readonly roomTypeSelector: Locator;
  private readonly guestDetailsForm: Locator;
  private readonly datePickerCheckIn: Locator;
  private readonly datePickerCheckOut: Locator;
  private readonly extrasSection: Locator;
  private readonly totalPriceDisplay: Locator;
  private readonly completeBookingButton: Locator;
  private readonly validationErrorsList: Locator;
  private readonly upgradeOptions: Locator;

  constructor(page: Page) {
    super(page, '/booking');
    this.roomTypeSelector = page.locator('[data-testid="room-type-selector"]');
    this.guestDetailsForm = page.locator('[data-testid="guest-details-form"]');
    this.datePickerCheckIn = page.locator('input[name="checkIn"]');
    this.datePickerCheckOut = page.locator('input[name="checkOut"]');
    this.extrasSection = page.locator('[data-testid="extras-section"]');
    this.totalPriceDisplay = page.locator('[data-testid="total-price"]');
    this.completeBookingButton = page.locator('[data-testid="complete-booking"]');
    this.validationErrorsList = page.locator('[data-testid="validation-errors"]');
    this.upgradeOptions = page.locator('[data-testid="upgrade-options"]');
  }

  async selectRoomType(roomType: string): Promise<void> {
    const roomOption = this.roomTypeSelector.locator(`text=${roomType}`);
    await this.clickWithRetry(roomOption);
  }

  async fillGuestDetails(guestDetails: any): Promise<void> {
    await this.fillWithValidation(
      this.guestDetailsForm.locator('input[name="firstName"]'),
      guestDetails.firstName
    );
    await this.fillWithValidation(
      this.guestDetailsForm.locator('input[name="lastName"]'),
      guestDetails.lastName
    );
    await this.fillWithValidation(
      this.guestDetailsForm.locator('input[name="email"]'),
      guestDetails.email
    );
    await this.fillWithValidation(
      this.guestDetailsForm.locator('input[name="phone"]'),
      guestDetails.phone
    );
  }

  async selectDates(checkIn: string, checkOut: string): Promise<void> {
    await this.fillWithValidation(this.datePickerCheckIn, checkIn);
    await this.fillWithValidation(this.datePickerCheckOut, checkOut);
  }

  async addExtras(extras: string[]): Promise<void> {
    for (const extra of extras) {
      const extraCheckbox = this.extrasSection.locator(`input[type="checkbox"][value="${extra}"]`);
      await extraCheckbox.check();
    }
  }

  async upgradeRoom(upgradeType: string): Promise<void> {
    const upgradeOption = this.upgradeOptions.locator(`text=${upgradeType}`);
    await this.clickWithRetry(upgradeOption);
  }

  async completeBooking(): Promise<void> {
    await this.clickWithRetry(this.completeBookingButton);
    await this.handleLoadingStates();
  }

  async attemptBookingWithoutDetails(): Promise<void> {
    await this.clickWithRetry(this.completeBookingButton);
  }

  async getTotalPrice(): Promise<string> {
    return await this.getElementText(this.totalPriceDisplay);
  }

  async getValidationErrors(): Promise<string[]> {
    const errors = await this.validationErrorsList.locator('li').all();
    const errorTexts = [];
    for (const error of errors) {
      errorTexts.push(await error.textContent() || '');
    }
    return errorTexts;
  }

  async waitForPriceUpdate(): Promise<void> {
    await this.page.waitForTimeout(500); // Wait for price calculation
    await this.handleLoadingStates();
  }

  get totalPrice(): Locator {
    return this.totalPriceDisplay;
  }

  get validationErrors(): Locator {
    return this.validationErrorsList.locator('li');
  }

  async isBookingFormValid(): Promise<boolean> {
    const errorCount = await this.validationErrors.count();
    return errorCount === 0;
  }

  async clearAllFields(): Promise<void> {
    await this.guestDetailsForm.locator('input').first().clear();
    await this.datePickerCheckIn.clear();
    await this.datePickerCheckOut.clear();
  }
}