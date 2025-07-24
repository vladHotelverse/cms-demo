/**
 * Supabase Real-time utilities for CMS
 * Handles real-time subscriptions for hotel management
 */

import { createClient } from './client'
import type { RealtimeChannel } from '@supabase/supabase-js'

export interface OrderUpdate {
  id: string
  type: 'INSERT' | 'UPDATE' | 'DELETE'
  order: any
}

export interface ProposalUpdate {
  id: string
  type: 'INSERT' | 'UPDATE' | 'DELETE'
  proposal: any
}

let ordersChannel: RealtimeChannel | null = null
let proposalsChannel: RealtimeChannel | null = null

/**
 * Subscribe to new orders from ABS
 */
export function subscribeToOrders(onOrderUpdate: (update: OrderUpdate) => void) {
  const supabase = createClient()
  
  // Clean up existing subscription
  if (ordersChannel) {
    supabase.removeChannel(ordersChannel)
  }
  
  ordersChannel = supabase
    .channel('orders-changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'orders'
      },
      (payload) => {
        console.log('Order change received:', payload)
        onOrderUpdate({
          id: payload.new?.id || payload.old?.id || '',
          type: payload.eventType as 'INSERT' | 'UPDATE' | 'DELETE',
          order: payload.new || payload.old
        })
      }
    )
    .subscribe((status) => {
      console.log('Orders subscription status:', status)
    })
  
  return ordersChannel
}

/**
 * Subscribe to proposal status changes from ABS
 */
export function subscribeToProposals(onProposalUpdate: (update: ProposalUpdate) => void) {
  const supabase = createClient()
  
  // Clean up existing subscription
  if (proposalsChannel) {
    supabase.removeChannel(proposalsChannel)
  }
  
  proposalsChannel = supabase
    .channel('proposals-changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'hotel_proposals'
      },
      (payload) => {
        console.log('Proposal change received:', payload)
        onProposalUpdate({
          id: payload.new?.id || payload.old?.id || '',
          type: payload.eventType as 'INSERT' | 'UPDATE' | 'DELETE',
          proposal: payload.new || payload.old
        })
      }
    )
    .subscribe((status) => {
      console.log('Proposals subscription status:', status)
    })
  
  return proposalsChannel
}

/**
 * Clean up all subscriptions
 */
export function unsubscribeAll() {
  const supabase = createClient()
  
  if (ordersChannel) {
    supabase.removeChannel(ordersChannel)
    ordersChannel = null
  }
  
  if (proposalsChannel) {
    supabase.removeChannel(proposalsChannel)
    proposalsChannel = null
  }
}

/**
 * Send real-time notification to ABS about proposal
 */
export function notifyABSOfProposal(orderId: string, proposal: any) {
  const supabase = createClient()
  
  // Send a broadcast message to ABS clients
  const channel = supabase.channel(`order-${orderId}`)
  
  channel
    .send({
      type: 'broadcast',
      event: 'new_proposal',
      payload: { orderId, proposal }
    })
    .then(() => {
      console.log('Proposal notification sent to ABS')
    })
    .catch((error) => {
      console.error('Failed to send proposal notification:', error)
    })
}