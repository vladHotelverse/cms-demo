import { Page } from '@playwright/test';

export class MockDataHelpers {
  static createMockReservation(overrides: any = {}) {
    return {
      id: `RES-${Date.now()}`,
      guestName: 'Test Guest',
      roomType: 'Standard Room',
      checkIn: '2024-08-15',
      checkOut: '2024-08-18',
      status: 'confirmed',
      total: 500.00,
      extras: 'Recommend',
      reservedItems: ['Breakfast', 'WiFi'],
      ...overrides
    };
  }

  static async mockApiResponse(page: Page, endpoint: string, responseData: any) {
    await page.route(`**/${endpoint}`, async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(responseData)
      });
    });
  }

  static async mockApiError(page: Page, endpoint: string, statusCode: number = 500) {
    await page.route(`**/${endpoint}`, async route => {
      await route.fulfill({
        status: statusCode,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Mock API Error' })
      });
    });
  }

  static createMockOrdersData(count: number = 5) {
    const orders = [];
    for (let i = 1; i <= count; i++) {
      orders.push({
        id: `ORDER-${i.toString().padStart(3, '0')}`,
        customerName: `Customer ${i}`,
        room: i % 2 === 0 ? 'Deluxe Suite' : 'Standard Room',
        checkIn: `2024-08-${(15 + i).toString().padStart(2, '0')}`,
        checkOut: `2024-08-${(18 + i).toString().padStart(2, '0')}`,
        status: ['pending', 'confirmed', 'completed'][i % 3],
        total: 400 + (i * 150)
      });
    }
    return orders;
  }

  static async setupMockDatabase(page: Page) {
    const mockOrders = this.createMockOrdersData(10);
    
    await this.mockApiResponse(page, 'api/orders', mockOrders);
    await this.mockApiResponse(page, 'api/proposals', [
      {
        id: 'PROP-001',
        title: 'Weekend Special',
        description: 'Special offer for weekend stays',
        price: 299.99,
        validUntil: '2024-12-31'
      }
    ]);
  }

  static generateRandomBookingData() {
    const roomTypes = ['Standard Room', 'Deluxe Suite', 'Presidential Suite', 'Ocean View'];
    const names = ['John Doe', 'Jane Smith', 'Bob Johnson', 'Alice Wilson'];
    
    return {
      guestName: names[Math.floor(Math.random() * names.length)],
      roomType: roomTypes[Math.floor(Math.random() * roomTypes.length)],
      checkIn: new Date(Date.now() + Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      nights: Math.floor(Math.random() * 7) + 1,
      guests: Math.floor(Math.random() * 4) + 1
    };
  }
}