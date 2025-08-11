import { chromium, FullConfig } from '@playwright/test';

async function globalTeardown(config: FullConfig) {
  console.log('Starting global teardown...');
  
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    const baseURL = config.projects[0]?.use?.baseURL || 'http://localhost:3000';
    
    // Clean up test data
    await cleanupTestData(page, baseURL);
    await cleanupTestFiles();
    
    console.log('Global teardown completed successfully');
  } catch (error) {
    console.error('Global teardown failed:', error);
    // Don't throw error to avoid breaking the test run
  } finally {
    await context.close();
    await browser.close();
  }
}

async function cleanupTestData(page: any, baseURL: string) {
  console.log('Cleaning up test data...');
  
  try {
    await page.goto(baseURL);
    
    // Clear all browser storage
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
      
      // Clear IndexedDB
      if ('indexedDB' in window) {
        indexedDB.databases?.().then(databases => {
          databases.forEach(db => {
            if (db.name?.startsWith('test-')) {
              indexedDB.deleteDatabase(db.name);
            }
          });
        });
      }
    });
    
    // Clear cookies
    await page.context().clearCookies();
    
    console.log('Test data cleanup completed');
  } catch (error) {
    console.warn('Test data cleanup warning:', error);
  }
}

async function cleanupTestFiles() {
  console.log('Cleaning up temporary test files...');
  
  try {
    const fs = require('fs');
    const path = require('path');
    
    // Clean up any temporary test files
    const tempDirs = [
      'test-results/temp',
      'playwright-report/temp'
    ];
    
    tempDirs.forEach(dir => {
      if (fs.existsSync(dir)) {
        fs.rmSync(dir, { recursive: true, force: true });
        console.log(`Cleaned up directory: ${dir}`);
      }
    });
    
    console.log('Test files cleanup completed');
  } catch (error) {
    console.warn('Test files cleanup warning:', error);
  }
}

export default globalTeardown;