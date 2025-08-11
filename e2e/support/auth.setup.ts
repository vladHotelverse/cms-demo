import { test as setup } from '@playwright/test';
import { AuthPage } from './page-objects/AuthPage';
import { TestData } from '../fixtures/test-data';

const authFile = 'e2e/.auth/user.json';

setup('authenticate as regular user', async ({ page }) => {
  const authPage = new AuthPage(page);
  const userData = TestData.getValidUser();

  await authPage.navigate();
  await authPage.login(userData.email, userData.password);

  // Wait for authentication to complete
  await page.waitForURL('**/dashboard');
  
  // Save authentication state
  await page.context().storageState({ path: authFile });
  
  console.log('Authentication setup completed');
});

setup('setup test environment', async ({ page }) => {
  await page.goto('/');
  
  // Setup any necessary test environment configurations
  await page.evaluate(() => {
    // Set test environment flags
    window.localStorage.setItem('test-environment', 'true');
    window.localStorage.setItem('disable-analytics', 'true');
    
    // Mock external services if needed
    window.localStorage.setItem('mock-payment-service', 'true');
  });
  
  console.log('Test environment setup completed');
});