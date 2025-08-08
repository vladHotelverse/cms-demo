import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class AuthPage extends BasePage {
  private readonly emailInput: Locator;
  private readonly passwordInput: Locator;
  private readonly loginButton: Locator;
  private readonly logoutButton: Locator;
  private readonly errorMessage: Locator;
  private readonly signUpLink: Locator;
  private readonly forgotPasswordLink: Locator;

  constructor(page: Page) {
    super(page, '/auth/login');
    this.emailInput = page.locator('input[name="email"]');
    this.passwordInput = page.locator('input[name="password"]');
    this.loginButton = page.locator('button[type="submit"]:has-text("Login")');
    this.logoutButton = page.locator('[data-testid="logout-button"]');
    this.errorMessage = page.locator('[data-testid="error-message"]');
    this.signUpLink = page.locator('a:has-text("Sign up")');
    this.forgotPasswordLink = page.locator('a:has-text("Forgot password")');
  }

  async login(email: string, password: string): Promise<void> {
    await this.fillWithValidation(this.emailInput, email);
    await this.fillWithValidation(this.passwordInput, password);
    await this.clickWithRetry(this.loginButton);
    await this.handleLoadingStates();
  }

  async logout(): Promise<void> {
    await this.clickWithRetry(this.logoutButton);
    await this.handleLoadingStates();
  }

  async clickSignUp(): Promise<void> {
    await this.clickWithRetry(this.signUpLink);
  }

  async clickForgotPassword(): Promise<void> {
    await this.clickWithRetry(this.forgotPasswordLink);
  }

  async getErrorMessage(): Promise<string> {
    return await this.getElementText(this.errorMessage);
  }

  async isLoginFormVisible(): Promise<boolean> {
    return await this.isElementVisible(this.emailInput);
  }

  async isLoggedIn(): Promise<boolean> {
    return await this.isElementVisible(this.logoutButton);
  }

  get errorMessage(): Locator {
    return this.errorMessage;
  }

  async waitForLoginComplete(): Promise<void> {
    await this.page.waitForURL('**/dashboard', { timeout: 10000 });
  }

  async clearForm(): Promise<void> {
    await this.emailInput.clear();
    await this.passwordInput.clear();
  }
}