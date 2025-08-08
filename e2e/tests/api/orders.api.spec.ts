import { test, expect } from '@playwright/test';
import { APIHelpers } from '../../support/commands/api-helpers';

test.describe('Orders API Testing', () => {
  let apiHelpers: APIHelpers;

  test.beforeAll(async ({ request }) => {
    apiHelpers = new APIHelpers(request);
  });

  test('should create a new order', async ({ request }) => {
    const orderData = {
      customerName: 'John Doe',
      room: 'Deluxe Suite',
      checkIn: '2024-08-15',
      checkOut: '2024-08-20'
    };

    const response = await apiHelpers.createOrder(orderData);
    
    expect(response.status()).toBe(201);
    const responseData = await response.json();
    expect(responseData).toHaveProperty('id');
    expect(responseData.customerName).toBe(orderData.customerName);
  });

  test('should retrieve order by ID', async ({ request }) => {
    // First create an order
    const orderData = {
      customerName: 'Jane Doe',
      room: 'Standard Room',
      checkIn: '2024-08-10',
      checkOut: '2024-08-12'
    };

    const createResponse = await apiHelpers.createOrder(orderData);
    const createdOrder = await createResponse.json();

    // Then retrieve it
    const getResponse = await apiHelpers.getOrder(createdOrder.id);
    expect(getResponse.status()).toBe(200);
    
    const retrievedOrder = await getResponse.json();
    expect(retrievedOrder.id).toBe(createdOrder.id);
  });

  test('should update order status', async ({ request }) => {
    const orderData = {
      customerName: 'Bob Smith',
      room: 'Presidential Suite',
      checkIn: '2024-09-01',
      checkOut: '2024-09-05'
    };

    const createResponse = await apiHelpers.createOrder(orderData);
    const createdOrder = await createResponse.json();

    const updateResponse = await apiHelpers.updateOrderStatus(createdOrder.id, 'confirmed');
    expect(updateResponse.status()).toBe(200);
    
    const updatedOrder = await updateResponse.json();
    expect(updatedOrder.status).toBe('confirmed');
  });

  test('should handle invalid order ID', async ({ request }) => {
    const response = await apiHelpers.getOrder('invalid-id');
    expect(response.status()).toBe(404);
  });

  test('should validate required fields', async ({ request }) => {
    const invalidOrderData = {
      customerName: '',
      room: 'Standard Room'
    };

    const response = await apiHelpers.createOrder(invalidOrderData);
    expect(response.status()).toBe(400);
  });
});