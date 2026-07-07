import { NextRequest, NextResponse } from 'next/server'
import { isMockDataMode } from '@/lib/config/data-source'
import {
  getMockOrderById,
  updateMockOrder,
} from '@/lib/data/mock-orders-store'
import { createClient } from '@/lib/supabase/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: orderId } = await params

    if (isMockDataMode()) {
      const order = getMockOrderById(orderId)
      if (!order) {
        return NextResponse.json({ error: 'Order not found' }, { status: 404 })
      }
      return NextResponse.json(order)
    }

    const supabase = await createClient()

    const { data: order, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items(*),
        hotel_proposals(*)
      `)
      .eq('id', orderId)
      .single()

    if (error) {
      console.error('Database error:', error)
      const order = getMockOrderById(orderId)
      if (order) return NextResponse.json(order)
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    return NextResponse.json(order)
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: orderId } = await params
    const body = await request.json()

    if (isMockDataMode()) {
      const order = updateMockOrder(orderId, body)
      if (!order) {
        return NextResponse.json({ error: 'Order not found' }, { status: 404 })
      }
      return NextResponse.json(order)
    }

    const supabase = await createClient()

    const { data: order, error } = await supabase
      .from('orders')
      .update(body)
      .eq('id', orderId)
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      const order = updateMockOrder(orderId, body)
      if (order) return NextResponse.json(order)
      return NextResponse.json({ error: 'Failed to update order' }, { status: 500 })
    }

    return NextResponse.json(order)
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
