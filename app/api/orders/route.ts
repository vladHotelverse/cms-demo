import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const date = searchParams.get('date')

    let query = supabase
      .from('orders')
      .select(`
        *,
        order_items(*),
        hotel_proposals(*)
      `)
      .order('created_at', { ascending: false })

    // Filter by status if provided
    if (status) {
      query = query.eq('status', status)
    }

    // Filter by date if provided
    if (date === 'today') {
      const today = new Date().toISOString().split('T')[0]
      query = query.gte('created_at', `${today}T00:00:00`)
      query = query.lt('created_at', `${today}T23:59:59`)
    }

    const { data: orders, error } = await query

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 })
    }

    // Transform data to match your existing format
    const transformedOrders = orders?.map(order => {
      // Format date to DD/MM/YYYY
      const checkInDate = new Date(order.check_in)
      const formattedCheckIn = `${checkInDate.getDate().toString().padStart(2, '0')}/${(checkInDate.getMonth() + 1).toString().padStart(2, '0')}/${checkInDate.getFullYear()}`
      
      // Calculate extras status based on order items
      const itemCount = order.order_items?.length || 0
      const hasItems = itemCount > 0
      let extrasText = 'recommendation' // default for no items
      
      if (hasItems && itemCount > 0) {
        // Calculate total price from order items
        const totalItemsPrice = order.order_items?.reduce((sum: number, item: any) => sum + (item.price * (item.quantity || 1)), 0) || 0
        extrasText = `${itemCount} reserved (${totalItemsPrice.toFixed(0)}€)`
      }
      
      return {
        id: order.id,
        locator: order.reservation_code || `loc-${order.id.slice(0, 8)}`,
        name: order.user_name || 'Guest',
        email: order.user_email,
        checkIn: formattedCheckIn,
        nights: order.check_out ? 
          Math.ceil((new Date(order.check_out).getTime() - new Date(order.check_in).getTime()) / (1000 * 60 * 60 * 24)).toString() : 
          '3',
        roomType: order.room_type,
        aci: order.occupancy || '2/0/0',
        status: order.status === 'confirmed' ? 'New' : order.status,
        extras: extrasText,
        extrasCount: itemCount,
        hasExtras: hasItems,
        hasHotelverseRequest: true, // All orders from ABS have this
        orderItems: order.order_items || [],
        proposals: order.hotel_proposals || []
      }
    }) || []

    return NextResponse.json(transformedOrders)
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    // Insert order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_email: body.userEmail,
        user_name: body.userName,
        reservation_code: body.reservationCode,
        check_in: body.checkIn,
        check_out: body.checkOut,
        room_type: body.roomType,
        occupancy: body.occupancy,
        status: body.status || 'confirmed',
        total_price: body.totalPrice || 0,
        notes: body.notes
      })
      .select()
      .single()

    if (orderError) {
      console.error('Order insert error:', orderError)
      return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
    }

    // Insert order items if provided
    if (body.selections && Array.isArray(body.selections)) {
      const orderItems = body.selections.map((item: any) => ({
        order_id: order.id,
        type: item.type || 'customization',
        item_id: item.itemId || item.id || 'unknown',
        name: item.name,
        description: item.description,
        price: item.price || 0,
        quantity: item.quantity || 1,
        metadata: item.metadata || item
      }))

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems)

      if (itemsError) {
        console.error('Order items insert error:', itemsError)
        // Don't fail the whole request, just log the error
      }
    }

    return NextResponse.json({ 
      success: true, 
      id: order.id,
      order: order
    })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}