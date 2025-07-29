import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    const { data: proposal, error } = await supabase
      .from('hotel_proposals')
      .insert({
        order_id: body.orderId,
        type: body.type,
        title: body.title,
        description: body.description,
        price_difference: body.priceDifference || 0,
        original_item_id: body.originalItemId,
        proposed_item_data: body.proposedItemData,
        expires_at: body.expiresAt
      })
      .select()
      .single()

    if (error) {
      console.error('Proposal insert error:', error)
      return NextResponse.json({ error: 'Failed to create proposal' }, { status: 500 })
    }

    return NextResponse.json({ success: true, proposal })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()
    const { proposalId, status } = body

    const { data: proposal, error } = await supabase
      .from('hotel_proposals')
      .update({ status })
      .eq('id', proposalId)
      .select()
      .single()

    if (error) {
      console.error('Proposal update error:', error)
      return NextResponse.json({ error: 'Failed to update proposal' }, { status: 500 })
    }

    return NextResponse.json({ success: true, proposal })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}