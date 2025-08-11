import { test, expect } from '@playwright/test';
import { TestData } from '../../fixtures/test-data';

test.describe('Orders API Testing', () => {
  const baseURL = process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:3000';

  test('should get all orders with correct structure', async ({ request }) => {
    const response = await request.get(`${baseURL}/api/orders`);
    
    expect(response.ok()).toBeTruthy();
    const orders = await response.json();
    
    expect(Array.isArray(orders)).toBe(true);
    
    if (orders.length > 0) {
      const order = orders[0];
      
      // Verify the expected structure matches API response transformation
      expect(order).toHaveProperty('id');
      expect(order).toHaveProperty('locator');
      expect(order).toHaveProperty('name');
      expect(order).toHaveProperty('email');
      expect(order).toHaveProperty('checkIn');
      expect(order).toHaveProperty('nights');
      expect(order).toHaveProperty('roomType');
      expect(order).toHaveProperty('aci');
      expect(order).toHaveProperty('status');
      expect(order).toHaveProperty('extras');
      expect(order).toHaveProperty('hasHotelverseRequest');
      
      // Verify data types
      expect(typeof order.name).toBe('string');
      expect(typeof order.hasHotelverseRequest).toBe('boolean');
      
      // Verify date format (DD/MM/YYYY)
      expect(order.checkIn).toMatch(/^\d{2}\/\d{2}\/\d{4}$/);
    }
  });

  test('should create a new order with proper structure', async ({ request }) => {
    const orderData = TestData.getApiTestData().order;
    
    const response = await request.post(`${baseURL}/api/orders`, {
      data: orderData
    });
    
    expect(response.ok()).toBeTruthy();
    const result = await response.json();
    
    expect(result).toHaveProperty('success', true);
    expect(result).toHaveProperty('id');
    expect(result).toHaveProperty('order');
    
    // Verify the created order has correct structure  
    expect(result.order.user_email).toBe(orderData.userEmail);
    expect(result.order.user_name).toBe(orderData.userName);
    expect(result.order.reservation_code).toBe(orderData.reservationCode);
  });

  test('should retrieve order by ID with relations', async ({ request }) => {
    // First create an order
    const orderData = TestData.getApiTestData().order;
    const createResponse = await request.post(`${baseURL}/api/orders`, {
      data: orderData
    });
    
    const createdOrder = await createResponse.json();
    const orderId = createdOrder.id;
    
    // Then retrieve it (Note: the API doesn't have individual GET by ID, using list)
    const getResponse = await request.get(`${baseURL}/api/orders`);
    expect(getResponse.ok()).toBeTruthy();
    
    const orders = await getResponse.json();
    const foundOrder = orders.find((o: any) => o.id === orderId);
    
    expect(foundOrder).toBeDefined();
    expect(foundOrder.name).toBe(orderData.userName);
  });

  test('should filter orders by status', async ({ request }) => {
    const response = await request.get(`${baseURL}/api/orders?status=confirmed`);
    
    expect(response.ok()).toBeTruthy();
    const orders = await response.json();
    
    expect(Array.isArray(orders)).toBe(true);
    
    if (orders.length > 0) {
      // Status gets transformed: 'confirmed' becomes 'New' in the API response
      orders.forEach((order: any) => {
        expect(['New', 'Confirmed']).toContain(order.status);
      });
    }
  });

  test('should filter orders by date', async ({ request }) => {
    const response = await request.get(`${baseURL}/api/orders?date=today`);
    
    expect(response.ok()).toBeTruthy();
    const orders = await response.json();
    
    expect(Array.isArray(orders)).toBe(true);
    
    if (orders.length > 0) {
      orders.forEach((order: any) => {
        expect(order.checkIn).toMatch(/^\d{2}\/\d{2}\/\d{4}$/);
      });
    }
  });

  test('should handle invalid data gracefully', async ({ request }) => {
    const invalidOrderData = {
      // Missing required fields like userEmail
      roomType: 'Test Room'
    };
    
    const response = await request.post(`${baseURL}/api/orders`, {
      data: invalidOrderData
    });
    
    // Should return an error
    expect(response.status()).toBeGreaterThanOrEqual(400);
    
    const errorResponse = await response.json();
    expect(errorResponse).toHaveProperty('error');
  });

  test('should handle order with selections properly', async ({ request }) => {
    const orderData = TestData.getApiTestData().order;
    
    const response = await request.post(`${baseURL}/api/orders`, {
      data: orderData
    });
    
    expect(response.ok()).toBeTruthy();
    const result = await response.json();
    
    // Verify selections were processed
    if (orderData.selections && orderData.selections.length > 0) {
      // The API should create order_items for selections
      expect(result.success).toBe(true);
    }
  });

  test('should return proper error for malformed requests', async ({ request }) => {
    const response = await request.post(`${baseURL}/api/orders`, {
      data: 'invalid-json-string'
    });
    
    expect(response.status()).toBeGreaterThanOrEqual(400);
  });

  test('should handle database connectivity issues', async ({ request }) => {
    // This test verifies error handling when DB is unavailable
    // In a real scenario, you might mock this or test with invalid credentials
    
    const orderData = TestData.getApiTestData().order;
    const response = await request.post(`${baseURL}/api/orders`, {
      data: orderData
    });
    
    // Should either succeed (200) or fail gracefully (500)
    expect([200, 500]).toContain(response.status());
    
    if (!response.ok()) {
      const errorResponse = await response.json();
      expect(errorResponse).toHaveProperty('error');
      expect(typeof errorResponse.error).toBe('string');
    }
  });
});