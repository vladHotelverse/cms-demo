import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
  private readonly bookNowButton: Locator;
  private readonly navigationMenu: Locator;
  private readonly searchForm: Locator;
  private readonly roomCards: Locator;
  private readonly headerLogo: Locator;

  constructor(page: Page) {
    super(page, '/');
    this.bookNowButton = page.locator('[data-testid="book-now-button"]').first();
    this.navigationMenu = page.locator('nav');
    this.searchForm = page.locator('[data-testid="search-form"]');
    this.roomCards = page.locator('[data-testid="room-card"]');
    this.headerLogo = page.locator('[data-testid="header-logo"]');
  }

  async startBooking(): Promise<void> {
    await this.handleLoadingStates();
    await this.clickWithRetry(this.bookNowButton);
  }

  async searchRooms(checkIn: string, checkOut: string, guests: number): Promise<void> {
    await this.fillWithValidation(
      this.searchForm.locator('input[name="checkIn"]'), 
      checkIn
    );
    await this.fillWithValidation(
      this.searchForm.locator('input[name="checkOut"]'), 
      checkOut
    );
    await this.searchForm.locator('select[name="guests"]').selectOption(guests.toString());
    await this.searchForm.locator('button[type="submit"]').click();
  }

  async navigateToSection(sectionName: string): Promise<void> {
    const sectionLink = this.navigationMenu.locator(`a:has-text("${sectionName}")`);
    await this.clickWithRetry(sectionLink);
  }

  async getRoomCardCount(): Promise<number> {
    await this.waitForElement(this.roomCards.first());
    return await this.roomCards.count();
  }

  async selectRoom(roomIndex: number): Promise<void> {
    const roomCard = this.roomCards.nth(roomIndex);
    const selectButton = roomCard.locator('button:has-text("Select")');
    await this.clickWithRetry(selectButton);
  }

  async isHeaderLogoVisible(): Promise<boolean> {
    return await this.isElementVisible(this.headerLogo);
  }

  async getPageTitle(): Promise<string> {
    return await this.page.title();
  }

  async scrollToRooms(): Promise<void> {
    await this.scrollToElement(this.roomCards.first());
  }

  async waitForRoomsToLoad(): Promise<void> {
    await this.waitForElement(this.roomCards.first());
    await this.handleLoadingStates();
  }
}