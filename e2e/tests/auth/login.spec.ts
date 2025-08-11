import { test, expect } from '@playwright/test';
import { AuthPage } from '../../support/page-objects/AuthPage';
import { TestData } from '../../fixtures/test-data';

test.describe('Authentication Flow', () => {
  let authPage: AuthPage;

  test.beforeEach(async ({ page }) => {
    authPage = new AuthPage(page);
    await authPage.navigate();
  });

  test('should login with valid credentials', async ({ page }) => {
    const credentials = TestData.getValidUser();
    
    await authPage.login(credentials.email, credentials.password);
    await expect(page).toHaveURL('/dashboard');
  });

  test('should handle invalid credentials', async ({ page }) => {
    await authPage.login('invalid@email.com', 'wrongpassword');
    await expect(authPage.errorMessage).toBeVisible();
  });

  test('should logout successfully', async ({ page }) => {
    const credentials = TestData.getValidUser();
    
    await authPage.login(credentials.email, credentials.password);
    await authPage.logout();
    await expect(page).toHaveURL('/');
  });
});