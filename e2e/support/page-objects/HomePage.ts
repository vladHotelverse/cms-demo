import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
  private readonly homepage: Locator;
  private readonly dashboardCards: Locator;
  private readonly quickStatsCard: Locator;
  private readonly recentActivityCard: Locator;
  private readonly systemStatusCard: Locator;
  private readonly navigationMenu: Locator;

  constructor(page: Page) {
    super(page, '/');
    this.homepage = page.locator('[data-testid="homepage"]');
    this.dashboardCards = page.locator('[data-testid="dashboard-cards"]');
    this.quickStatsCard = page.locator('[data-testid="quick-stats-card"]');
    this.recentActivityCard = page.locator('[data-testid="recent-activity-card"]');
    this.systemStatusCard = page.locator('[data-testid="system-status-card"]');
    this.navigationMenu = page.locator('nav');
  }

  async navigateToFrontDeskUpsell(): Promise<void> {
    // Navigate to the actual front desk upsell page
    await this.page.goto('/ventas/front-desk-upsell');
    await this.handleLoadingStates();
  }

  async isDashboardVisible(): Promise<boolean> {
    return await this.isElementVisible(this.dashboardCards);
  }

  async getQuickStatsText(): Promise<string> {
    return await this.getElementText(this.quickStatsCard);
  }

  async getRecentActivityText(): Promise<string> {
    return await this.getElementText(this.recentActivityCard);
  }

  async getSystemStatusText(): Promise<string> {
    return await this.getElementText(this.systemStatusCard);
  }

  async clickDashboardCard(cardType: 'quick-stats' | 'recent-activity' | 'system-status'): Promise<void> {
    let card: Locator;
    switch (cardType) {
      case 'quick-stats':
        card = this.quickStatsCard;
        break;
      case 'recent-activity':
        card = this.recentActivityCard;
        break;
      case 'system-status':
        card = this.systemStatusCard;
        break;
    }
    await this.clickWithRetry(card);
  }

  async waitForDashboardToLoad(): Promise<void> {
    await this.waitForElement(this.dashboardCards);
    await this.handleLoadingStates();
  }
}