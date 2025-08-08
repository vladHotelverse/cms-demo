export class TestData {
  static getValidUser() {
    return {
      email: 'test@example.com',
      password: 'testpassword123',
      name: 'Test User'
    };
  }

  static getInvalidUser() {
    return {
      email: 'invalid@example.com',
      password: 'wrongpassword'
    };
  }

  static getBookingData() {
    return {
      roomType: 'Deluxe Suite',
      guestDetails: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '+1234567890'
      },
      checkIn: '2024-12-01',
      checkOut: '2024-12-05',
      guests: 2,
      extras: ['Spa Package', 'Airport Transfer'],
      expectedTotal: '€1,250.00'
    };
  }

  static getBookingDataWithUpgrades() {
    return {
      roomType: 'Standard Room',
      upgradeType: 'Ocean View',
      guestDetails: {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@example.com',
        phone: '+1987654321'
      },
      checkIn: '2024-12-10',
      checkOut: '2024-12-15',
      expectedTotal: '€1,850.00'
    };
  }

  static getApiTestData() {
    return {
      order: {
        customerName: 'API Test Customer',
        room: 'Presidential Suite',
        checkIn: '2024-08-20',
        checkOut: '2024-08-25',
        totalAmount: 2500.00,
        status: 'pending'
      },
      proposal: {
        title: 'Test Proposal',
        description: 'This is a test proposal',
        price: 1500.00,
        validUntil: '2024-12-31'
      }
    };
  }

  static getTestEnvironmentConfig() {
    return {
      baseURL: process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:3000',
      timeout: 30000,
      retries: process.env.CI ? 2 : 0
    };
  }

  static getMockReservationData() {
    return {
      id: 'MOCK-001',
      guestName: 'Mock Guest',
      roomType: 'Deluxe Room',
      checkIn: '2024-08-15',
      checkOut: '2024-08-18',
      status: 'confirmed',
      extras: 'Recommend',
      reservedItems: ['Spa Treatment', 'Room Service']
    };
  }

  static getPerformanceThresholds() {
    return {
      firstContentfulPaint: 2000,
      largestContentfulPaint: 4000,
      cumulativeLayoutShift: 0.1,
      totalBlockingTime: 300
    };
  }
}