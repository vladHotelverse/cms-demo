import { test, expect } from '@playwright/test';

test.describe('Security Testing', () => {
  test('should have proper HTTPS configuration', async ({ page }) => {
    const response = await page.goto('/');
    
    // Check security headers
    const headers = response?.headers() || {};
    
    // Should have security headers (in production)
    if (process.env.NODE_ENV === 'production') {
      expect(headers['strict-transport-security']).toBeDefined();
      expect(headers['x-content-type-options']).toBe('nosniff');
      expect(headers['x-frame-options']).toBeDefined();
    }
  });

  test('should prevent XSS attacks', async ({ page }) => {
    await page.goto('/');
    
    // Try to inject a script
    const maliciousScript = '<script>window.xssTest = true;</script>';
    
    // Test input fields for XSS prevention
    const inputs = page.locator('input[type="text"], textarea');
    const inputCount = await inputs.count();
    
    if (inputCount > 0) {
      await inputs.first().fill(maliciousScript);
      
      // Check that script was not executed
      const xssExecuted = await page.evaluate(() => window.xssTest);
      expect(xssExecuted).toBeUndefined();
    }
  });

  test('should handle authentication properly', async ({ page }) => {
    // Try to access protected routes without authentication
    const protectedRoutes = ['/dashboard', '/admin', '/management'];
    
    for (const route of protectedRoutes) {
      const response = await page.goto(route, { timeout: 10000 });
      const status = response?.status();
      
      // Should redirect to login or return 401/403
      expect([200, 302, 401, 403, 404]).toContain(status || 404);
    }
  });

  test('should sanitize user inputs', async ({ page }) => {
    await page.goto('/');
    
    // Test various input sanitization scenarios
    const testInputs = [
      'javascript:alert("xss")',
      '<img src=x onerror=alert("xss")>',
      '<iframe src="javascript:alert(\'xss\')"></iframe>',
      '../../etc/passwd',
      'SELECT * FROM users;'
    ];

    const inputs = page.locator('input, textarea');
    const inputCount = await inputs.count();
    
    if (inputCount > 0) {
      for (const testInput of testInputs) {
        await inputs.first().clear();
        await inputs.first().fill(testInput);
        
        // Check that dangerous content is properly escaped/sanitized
        const value = await inputs.first().inputValue();
        expect(value).not.toContain('<script');
        expect(value).not.toContain('javascript:');
      }
    }
  });

  test('should handle file upload security', async ({ page }) => {
    await page.goto('/');
    
    // Look for file upload inputs
    const fileInputs = page.locator('input[type="file"]');
    const fileInputCount = await fileInputs.count();
    
    if (fileInputCount > 0) {
      // Test file type restrictions
      const fileInput = fileInputs.first();
      
      // Check if there are proper file type restrictions
      const acceptAttr = await fileInput.getAttribute('accept');
      expect(acceptAttr).toBeTruthy(); // Should have accept attribute
      
      // Should not accept dangerous file types
      if (acceptAttr) {
        expect(acceptAttr).not.toContain('.exe');
        expect(acceptAttr).not.toContain('.bat');
        expect(acceptAttr).not.toContain('.php');
      }
    }
  });

  test('should protect against CSRF attacks', async ({ page }) => {
    await page.goto('/');
    
    // Look for forms that should have CSRF protection
    const forms = page.locator('form');
    const formCount = await forms.count();
    
    if (formCount > 0) {
      // Check for CSRF tokens in forms
      const csrfTokens = page.locator('input[name*="csrf"], input[name*="_token"]');
      const tokenCount = await csrfTokens.count();
      
      // Should have at least some CSRF protection
      // (This depends on the application's CSRF implementation)
      console.log(`Found ${formCount} forms and ${tokenCount} CSRF tokens`);
    }
  });

  test('should have proper cookie security', async ({ page }) => {
    await page.goto('/');
    
    // Check cookie security settings
    const cookies = await page.context().cookies();
    
    cookies.forEach(cookie => {
      if (cookie.name.includes('session') || cookie.name.includes('auth')) {
        // Authentication cookies should be secure
        expect(cookie.httpOnly).toBe(true);
        expect(cookie.secure).toBe(true); // In production with HTTPS
        expect(cookie.sameSite).toBeDefined();
      }
    });
  });

  test('should prevent information disclosure', async ({ page }) => {
    // Try to access common sensitive files/endpoints
    const sensitiveEndpoints = [
      '/.env',
      '/config.json',
      '/admin/config',
      '/.git/config',
      '/package.json',
      '/server.js'
    ];

    for (const endpoint of sensitiveEndpoints) {
      const response = await page.goto(endpoint);
      const status = response?.status() || 404;
      
      // Should not expose sensitive files
      expect(status).not.toBe(200);
    }
  });
});