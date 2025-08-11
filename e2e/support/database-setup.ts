import { createClient } from '@supabase/supabase-js';

// Database setup utility for test isolation
export class DatabaseSetup {
  private supabase: ReturnType<typeof createClient>;

  constructor() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Missing Supabase environment variables for testing');
    }

    this.supabase = createClient(supabaseUrl, supabaseAnonKey);
  }

  /**
   * Clean up test data from all tables
   */
  async cleanupTestData(): Promise<void> {
    try {
      // Delete test orders and related data
      // First delete order_items (foreign key constraint)
      await this.supabase
        .from('order_items')
        .delete()
        .like('order_id', 'test-%');

      // Then delete hotel_proposals
      await this.supabase
        .from('hotel_proposals')
        .delete()
        .like('order_id', 'test-%');

      // Finally delete orders
      await this.supabase
        .from('orders')
        .delete()
        .or('user_email.like.*@test.com,reservation_code.like.TEST%,id.like.test-%');

      console.log('Test data cleanup completed');
    } catch (error) {
      console.error('Error cleaning up test data:', error);
      throw error;
    }
  }

  /**
   * Seed test data for E2E tests
   */
  async seedTestData(): Promise<void> {
    try {
      await this.cleanupTestData(); // Clean first

      // Create test orders
      const testOrders = [
        {
          id: 'test-order-001',
          user_email: 'john.smith@test.com',
          user_name: 'John Smith',
          reservation_code: 'TEST001',
          check_in: '2024-08-20',
          check_out: '2024-08-23',
          room_type: 'Doble Deluxe',
          occupancy: '2/0/0',
          status: 'confirmed',
          total_price: 450.00,
          notes: 'Test reservation for E2E testing'
        },
        {
          id: 'test-order-002',
          user_email: 'maria.garcia@test.com',
          user_name: 'Maria Garcia',
          reservation_code: 'TEST002',
          check_in: '2024-08-21',
          check_out: '2024-08-26',
          room_type: 'Junior Suite',
          occupancy: '2/1/0',
          status: 'confirmed',
          total_price: 750.00,
          notes: 'Test reservation with extras'
        }
      ];

      const { data: orders, error: ordersError } = await this.supabase
        .from('orders')
        .insert(testOrders)
        .select();

      if (ordersError) throw ordersError;

      // Add order items for the second order
      if (orders && orders.length > 1) {
        const orderItems = [
          {
            order_id: orders[1].id,
            type: 'customization',
            item_id: 'spa-package',
            name: 'Spa Package',
            description: 'Relaxing spa treatment',
            price: 150.00,
            quantity: 1
          },
          {
            order_id: orders[1].id,
            type: 'service',
            item_id: 'airport-transfer',
            name: 'Airport Transfer',
            description: 'Round trip airport transfer',
            price: 50.00,
            quantity: 2
          }
        ];

        const { error: itemsError } = await this.supabase
          .from('order_items')
          .insert(orderItems);

        if (itemsError) throw itemsError;
      }

      console.log('Test data seeded successfully');
    } catch (error) {
      console.error('Error seeding test data:', error);
      throw error;
    }
  }

  /**
   * Create a test order via API (for API testing)
   */
  async createTestOrder(orderData: any): Promise<string> {
    try {
      const { data, error } = await this.supabase
        .from('orders')
        .insert({
          id: `test-${Date.now()}`,
          user_email: orderData.userEmail,
          user_name: orderData.userName,
          reservation_code: orderData.reservationCode || `TEST${Date.now()}`,
          check_in: orderData.checkIn,
          check_out: orderData.checkOut,
          room_type: orderData.roomType,
          occupancy: orderData.occupancy,
          status: orderData.status || 'confirmed',
          total_price: orderData.totalPrice || 0,
          notes: orderData.notes || 'Test order'
        })
        .select()
        .single();

      if (error) throw error;

      return data.id;
    } catch (error) {
      console.error('Error creating test order:', error);
      throw error;
    }
  }

  /**
   * Get test orders for validation
   */
  async getTestOrders(): Promise<any[]> {
    try {
      const { data, error } = await this.supabase
        .from('orders')
        .select('*, order_items(*), hotel_proposals(*)')
        .or('user_email.like.*@test.com,reservation_code.like.TEST%,id.like.test-%')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Error fetching test orders:', error);
      throw error;
    }
  }

  /**
   * Check if database is accessible and ready for tests
   */
  async healthCheck(): Promise<boolean> {
    try {
      const { error } = await this.supabase
        .from('orders')
        .select('count')
        .limit(1);

      return !error;
    } catch (error) {
      console.error('Database health check failed:', error);
      return false;
    }
  }
}