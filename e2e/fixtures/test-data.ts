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
        userEmail: 'api-test@example.com',
        userName: 'API Test Customer',
        reservationCode: 'API001',
        checkIn: '2024-08-20',
        checkOut: '2024-08-25',
        roomType: 'Doble Deluxe',
        occupancy: '2/0/0',
        status: 'confirmed',
        totalPrice: 2500.00,
        notes: 'Test reservation for API testing',
        selections: [
          {
            type: 'customization',
            name: 'Spa Package',
            description: 'Relaxing spa treatment',
            price: 150.00,
            quantity: 1
          }
        ]
      },
      proposal: {
        title: 'Test Hotel Proposal',
        description: 'This is a test proposal for hotel services',
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
      id: 'order-001',
      locator: 'LOC1001',
      name: 'John Smith',
      email: 'john.smith@example.com',
      checkIn: '15/08/2024',
      nights: '3',
      roomType: 'Doble Deluxe',
      aci: '2/0/0',
      status: 'New',
      extras: 'Recommend',
      extrasCount: 0,
      hasExtras: false,
      hasHotelverseRequest: true,
      orderItems: [],
      proposals: []
    };
  }

  static getMockReservationWithExtras() {
    return {
      id: 'order-002',
      locator: 'LOC1002',
      name: 'Maria Garcia',
      email: 'maria.garcia@example.com',
      checkIn: '16/08/2024',
      nights: '5',
      roomType: 'Junior Suite',
      aci: '2/1/0',
      status: 'Confirmed',
      extras: '3 reserved items',
      extrasCount: 3,
      hasExtras: true,
      hasHotelverseRequest: true,
      orderItems: [
        { name: 'Spa Package', price: 150, quantity: 1 },
        { name: 'Airport Transfer', price: 50, quantity: 2 }
      ],
      proposals: []
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