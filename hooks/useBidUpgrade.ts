import { useState, useCallback } from 'react'

export interface BidItem {
  id: string
  roomId: string
  roomName: string
  originalPrice: number
  bidPrice: number
  status: 'pending' | 'accepted' | 'rejected' | 'cancelled'
  createdAt: Date
  expiresAt: Date
}

export interface BidUpgradeState {
  bids: BidItem[]
  isLoading: boolean
  error: string | null
}

export function useBidUpgrade() {
  const [state, setState] = useState<BidUpgradeState>({
    bids: [],
    isLoading: false,
    error: null,
  })

  const submitBid = useCallback(async (
    roomId: string,
    roomName: string,
    originalPrice: number,
    bidPrice: number
  ): Promise<string> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }))

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      const newBid: BidItem = {
        id: `bid-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        roomId,
        roomName,
        originalPrice,
        bidPrice,
        status: 'pending',
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
      }

      setState(prev => ({
        ...prev,
        bids: [...prev.bids, newBid],
        isLoading: false,
      }))

      return newBid.id
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to submit bid',
      }))
      throw error
    }
  }, [])

  const cancelBid = useCallback(async (bidId: string): Promise<void> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }))

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))

      setState(prev => ({
        ...prev,
        bids: prev.bids.map(bid =>
          bid.id === bidId ? { ...bid, status: 'cancelled' as const } : bid
        ),
        isLoading: false,
      }))
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to cancel bid',
      }))
      throw error
    }
  }, [])

  const updateBid = useCallback(async (
    bidId: string,
    newBidPrice: number
  ): Promise<void> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }))

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))

      setState(prev => ({
        ...prev,
        bids: prev.bids.map(bid =>
          bid.id === bidId ? { ...bid, bidPrice: newBidPrice } : bid
        ),
        isLoading: false,
      }))
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to update bid',
      }))
      throw error
    }
  }, [])

  const getBidsByStatus = useCallback((status: BidItem['status']) => {
    return state.bids.filter(bid => bid.status === status)
  }, [state.bids])

  const getBidByRoomId = useCallback((roomId: string) => {
    return state.bids.find(bid => bid.roomId === roomId && bid.status !== 'cancelled')
  }, [state.bids])

  return {
    ...state,
    submitBid,
    cancelBid,
    updateBid,
    getBidsByStatus,
    getBidByRoomId,
  }
}