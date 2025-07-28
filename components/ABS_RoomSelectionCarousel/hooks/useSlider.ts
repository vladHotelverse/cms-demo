import { useState, useMemo, useEffect } from 'react'
import type { RoomOption } from '../types'

export interface UseSliderProps {
  room: RoomOption
  minPrice: number
  onMakeOffer?: (price: number, room: RoomOption) => void
  offerMadeText?: string
  activeBid?: {
    roomId: string | number
    bidAmount: number
    status: 'pending' | 'submitted' | 'accepted' | 'rejected'
  }
}

export interface UseSliderReturn {
  proposedPrice: number
  setProposedPrice: (price: number) => void
  maxPrice: number
  makeOffer: () => void
  resetBid: () => void
  formattedOfferText: string
  bidStatus: 'idle' | 'submitted'
  submittedPrice: number | null
}

export const useSlider = ({
  room,
  minPrice,
  onMakeOffer,
  offerMadeText = 'You offered {price}',
  activeBid,
}: UseSliderProps): UseSliderReturn => {
  const maxPrice = useMemo(() => room.price, [room.price])
  const hasActiveBid = activeBid?.roomId === room.id

  // Calculate default price: 80% of room price, but not less than minPrice
  const defaultPrice = useMemo(() => {
    const eightyPercentOfMax = Math.round(maxPrice * 0.8)
    return Math.max(eightyPercentOfMax, minPrice)
  }, [maxPrice, minPrice])

  const initialPrice = hasActiveBid ? activeBid.bidAmount : defaultPrice
  const [proposedPrice, setProposedPrice] = useState<number>(initialPrice)
  const [submittedPrice, setSubmittedPrice] = useState<number | null>(hasActiveBid ? activeBid.bidAmount : null)
  const [bidStatus, setBidStatus] = useState<'idle' | 'submitted'>(hasActiveBid ? 'submitted' : 'idle')

  // Effect to sync with external activeBid changes
  useEffect(() => {
    const isCurrentlyActive = activeBid?.roomId === room.id
    if (isCurrentlyActive) {
      setProposedPrice(activeBid.bidAmount)
      setBidStatus('submitted')
      setSubmittedPrice(activeBid.bidAmount)
    } else {
      // If the bid for this room is cancelled or another is made, reset it
      setProposedPrice(defaultPrice)
      setBidStatus('idle')
      setSubmittedPrice(null)
    }
  }, [activeBid, room.id, defaultPrice])

  // Memoize the offer text to avoid re-creating it on every render
  const formattedOfferText = useMemo(() => {
    if (bidStatus === 'submitted' && submittedPrice) {
      return offerMadeText.replace('{price}', submittedPrice.toString())
    }
    return ''
  }, [bidStatus, submittedPrice, offerMadeText])

  const makeOffer = () => {
    setSubmittedPrice(proposedPrice)
    setBidStatus('submitted')
    if (onMakeOffer) {
      onMakeOffer(proposedPrice, room)
    }
  }

  const resetBid = () => {
    setSubmittedPrice(null)
    setBidStatus('idle')
    setProposedPrice(defaultPrice)
  }

  return {
    proposedPrice,
    setProposedPrice,
    maxPrice,
    makeOffer,
    resetBid,
    formattedOfferText,
    bidStatus,
    submittedPrice,
  }
}
