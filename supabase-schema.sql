-- Hotel Booking System Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Orders table - main booking information
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_email TEXT NOT NULL,
  user_name TEXT,
  reservation_code TEXT, -- From hotel email/reservation system
  
  -- Booking details
  check_in DATE NOT NULL,
  check_out DATE,
  room_type TEXT NOT NULL,
  occupancy TEXT, -- "2/0/0" format (adults/children/infants)
  
  -- Order information
  status TEXT DEFAULT 'confirmed' CHECK (status IN ('pending', 'confirmed', 'modified', 'cancelled')),
  total_price DECIMAL(10,2) DEFAULT 0.00,
  notes TEXT,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Order items table - individual selections (room upgrades, spa, dining, etc.)
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  
  -- Item details
  type TEXT NOT NULL CHECK (type IN ('room_upgrade', 'customization', 'special_offer')),
  item_id TEXT NOT NULL, -- Reference to original item in your app
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  quantity INTEGER DEFAULT 1,
  
  -- Additional data as JSON for flexibility
  metadata JSONB,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Hotel proposals table - suggestions from reception to guests
CREATE TABLE hotel_proposals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  
  -- Proposal details
  type TEXT NOT NULL CHECK (type IN ('room_change', 'item_substitution', 'upgrade_offer', 'price_change')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  price_difference DECIMAL(10,2) DEFAULT 0.00,
  
  -- Original and proposed items (optional)
  original_item_id TEXT,
  proposed_item_data JSONB,
  
  -- Status tracking
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  expires_at TIMESTAMP WITH TIME ZONE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_orders_user_email ON orders(user_email);
CREATE INDEX idx_orders_reservation_code ON orders(reservation_code);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX idx_orders_status ON orders(status);

CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_type ON order_items(type);

CREATE INDEX idx_proposals_order_id ON hotel_proposals(order_id);
CREATE INDEX idx_proposals_status ON hotel_proposals(status);

-- Enable Row Level Security
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE hotel_proposals ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Orders policies
-- Allow users to read their own orders by email
CREATE POLICY "Users can view own orders" ON orders
  FOR SELECT USING (user_email = current_setting('request.jwt.claims', true)::json->>'email');

-- Allow anyone to insert orders (for guest bookings)
CREATE POLICY "Anyone can create orders" ON orders
  FOR INSERT WITH CHECK (true);

-- Allow users to update their own orders
CREATE POLICY "Users can update own orders" ON orders
  FOR UPDATE USING (user_email = current_setting('request.jwt.claims', true)::json->>'email');

-- Order items policies
-- Users can view items for their orders
CREATE POLICY "Users can view own order items" ON order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = order_items.order_id 
      AND orders.user_email = current_setting('request.jwt.claims', true)::json->>'email'
    )
  );

-- Allow insertion of order items for valid orders
CREATE POLICY "Can insert order items for own orders" ON order_items
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = order_items.order_id 
      AND orders.user_email = current_setting('request.jwt.claims', true)::json->>'email'
    )
  );

-- Hotel proposals policies
-- Users can view proposals for their orders
CREATE POLICY "Users can view proposals for own orders" ON hotel_proposals
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = hotel_proposals.order_id 
      AND orders.user_email = current_setting('request.jwt.claims', true)::json->>'email'
    )
  );

-- Hotel staff can insert proposals (we'll handle this with service role)
CREATE POLICY "Service role can manage proposals" ON hotel_proposals
  FOR ALL USING (current_setting('role') = 'service_role');

-- Users can update proposal status (accept/reject)
CREATE POLICY "Users can update proposal status" ON hotel_proposals
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = hotel_proposals.order_id 
      AND orders.user_email = current_setting('request.jwt.claims', true)::json->>'email'
    )
  );

-- Enable real-time for all tables
ALTER PUBLICATION supabase_realtime ADD TABLE orders;
ALTER PUBLICATION supabase_realtime ADD TABLE order_items;
ALTER PUBLICATION supabase_realtime ADD TABLE hotel_proposals;

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_orders_updated_at 
  BEFORE UPDATE ON orders 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_proposals_updated_at 
  BEFORE UPDATE ON hotel_proposals 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert some sample data for testing
INSERT INTO orders (user_email, user_name, reservation_code, check_in, check_out, room_type, occupancy, total_price) VALUES
('maria@hotel.com', 'Maria García', 'oct003', '2025-01-25', '2025-01-28', 'Superior', '2/0/0', 175.00),
('carlos@hotel.com', 'Carlos López', 'oct002', '2025-01-26', '2025-01-30', 'Standard', '1/1/0', 120.00);

-- Insert sample order items
INSERT INTO order_items (order_id, type, item_id, name, description, price, metadata) 
SELECT 
  o.id,
  'room_upgrade',
  'suite_upgrade',
  'Suite Upgrade',
  'Upgrade to luxury suite with ocean view',
  100.00,
  '{"original_room": "Superior", "upgraded_room": "Suite"}'::jsonb
FROM orders o WHERE o.user_email = 'maria@hotel.com';

INSERT INTO order_items (order_id, type, item_id, name, description, price, metadata)
SELECT 
  o.id,
  'special_offer',
  'spa_package',
  'Spa Package',
  'Full spa treatment including massage and facial',
  50.00,
  '{"duration": "2 hours", "includes": ["massage", "facial"]}'::jsonb
FROM orders o WHERE o.user_email = 'maria@hotel.com';

INSERT INTO order_items (order_id, type, item_id, name, description, price, metadata)
SELECT 
  o.id,
  'customization',
  'late_checkout',
  'Late Checkout',
  'Checkout extended until 3 PM',
  25.00,
  '{"original_checkout": "11:00", "extended_checkout": "15:00"}'::jsonb
FROM orders o WHERE o.user_email = 'maria@hotel.com';