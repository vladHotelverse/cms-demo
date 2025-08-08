import { chromium, FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
  console.log('Starting global setup...');
  
  // Launch browser for setup tasks
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // Check if the application is running
    const baseURL = config.projects[0]?.use?.baseURL || 'http://localhost:3000';
    console.log(`Checking application availability at ${baseURL}`);
    
    await page.goto(baseURL, { timeout: 30000 });
    console.log('Application is accessible');

    // Perform any necessary setup tasks
    await setupTestDatabase(page);
    await setupTestUsers(page);
    await clearTestData(page);

    console.log('Global setup completed successfully');
  } catch (error) {
    console.error('Global setup failed:', error);
    throw error;
  } finally {
    await context.close();
    await browser.close();
  }
}

async function setupTestDatabase(page: any) {
  console.log('Setting up test database...');
  
  // Mock API responses or setup test data
  try {
    await page.evaluate(() => {
      // Clear any existing test data
      localStorage.clear();
      sessionStorage.clear();
    });
    
    console.log('Test database setup completed');
  } catch (error) {
    console.warn('Database setup warning:', error);
  }
}

async function setupTestUsers(page: any) {
  console.log('Setting up test users...');
  
  try {
    // Create test users or setup authentication
    await page.evaluate(() => {
      // Setup test authentication state
      localStorage.setItem('test-setup', 'complete');
    });
    
    console.log('Test users setup completed');
  } catch (error) {
    console.warn('Test users setup warning:', error);
  }
}

async function clearTestData(page: any) {
  console.log('Clearing any existing test data...');
  
  try {
    // Clear any residual test data
    await page.evaluate(() => {
      // Remove any test-specific data
      const testKeys = Object.keys(localStorage).filter(key => key.startsWith('test-'));
      testKeys.forEach(key => localStorage.removeItem(key));
    });
    
    console.log('Test data cleanup completed');
  } catch (error) {
    console.warn('Test data cleanup warning:', error);
  }
}

export default globalSetup;