"use client"

import { useCallback, useMemo } from 'react'
import type { RoomOption } from '@/components/features/booking-system/ABS_RoomSelectionCarousel/types'
import type { SelectedCustomizations } from '@/components/features/booking-system/ABS_RoomCustomization/types'
import type { OfferData } from '@/components/features/booking-system/ABS_SpecialOffers/types'
import type { SelectionError } from '@/stores/user-selections-store'

interface ValidationRule {
  id: string
  check: (data: any, context?: any) => boolean
  message: string
  severity: 'error' | 'warning'
}

interface ValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
}

/**
 * Selection validation hook with comprehensive rules
 * 
 * Features:
 * 1. Real-time validation
 * 2. Business rule enforcement
 * 3. Context-aware validation
 * 4. Extensible rule system
 */
export function useSelectionValidation() {
  // Room validation rules
  const roomValidationRules = useMemo<ValidationRule[]>(() => [
    {
      id: 'room-required-fields',
      check: (room: RoomOption) => {
        return !!(room.roomType && room.price !== undefined && room.price >= 0)
      },
      message: 'Room must have a valid type and price',
      severity: 'error'
    },
    {
      id: 'room-dates',
      check: (room: RoomOption, context: { reservationInfo?: any }) => {
        if (!context.reservationInfo) return false
        
        const checkIn = new Date(context.reservationInfo.checkIn)
        const checkOut = new Date(context.reservationInfo.checkOut)
        const today = new Date()
        
        return checkIn >= today && checkOut > checkIn
      },
      message: 'Invalid check-in or check-out dates',
      severity: 'error'
    },
    {
      id: 'room-price-reasonable',
      check: (room: RoomOption) => {
        return room.price > 0 && room.price <= 10000 // €10,000 max per night
      },
      message: 'Room price seems unreasonable',
      severity: 'warning'
    },
    // Availability check omitted: RoomOption does not include availability here
  ], [])

  // Customization validation rules
  const customizationValidationRules = useMemo<ValidationRule[]>(() => [
    {
      id: 'customization-room-exists',
      check: (data: { roomId: string; customizations: SelectedCustomizations }) => {
        return !!data.roomId
      },
      message: 'Room ID is required for customizations',
      severity: 'error'
    },
    {
      id: 'customization-valid-options',
      check: (data: { customizations: SelectedCustomizations }) => {
        // Check if customization options are valid
        return Object.values(data.customizations).every(custom => 
          custom && typeof custom.price === 'number' && custom.price >= 0
        )
      },
      message: 'Invalid customization options',
      severity: 'error'
    },
    {
      id: 'customization-total-reasonable',
      check: (data: { total: number }) => {
        return data.total >= 0 && data.total <= 5000 // €5,000 max customizations
      },
      message: 'Customization total seems too high',
      severity: 'warning'
    }
  ], [])

  // Offer validation rules
  const offerValidationRules = useMemo<ValidationRule[]>(() => [
    {
      id: 'offer-required-fields',
      check: (offer: OfferData) => {
        return !!(offer.name && offer.price !== undefined)
      },
      message: 'Offer must have a name and price',
      severity: 'error'
    },
    {
      id: 'offer-price-valid',
      check: (offer: OfferData) => {
        return typeof offer.price === 'number' && offer.price >= 0
      },
      message: 'Offer price must be a valid positive number',
      severity: 'error'
    },
    // Drop date/availability checks until the offer type supports these fields
  ], [])

  // Business logic validation rules
  const businessValidationRules = useMemo<ValidationRule[]>(() => [
    {
      id: 'max-rooms-per-reservation',
      check: (data: any, context: { roomCount?: number }) => {
        return !context.roomCount || context.roomCount <= 5
      },
      message: 'Maximum 5 rooms per reservation',
      severity: 'error'
    },
    {
      id: 'max-extras-per-reservation',
      check: (data: any, context: { extraCount?: number }) => {
        return !context.extraCount || context.extraCount <= 10
      },
      message: 'Maximum 10 extra services per reservation',
      severity: 'warning'
    },
    {
      id: 'total-price-limit',
      check: (data: any, context: { totalPrice?: number }) => {
        return !context.totalPrice || context.totalPrice <= 50000 // €50,000 max
      },
      message: 'Total reservation amount exceeds limit',
      severity: 'error'
    }
  ], [])

  // Validate single selection
  const validateSelection = useCallback((
    type: 'room' | 'customization' | 'offer',
    data: any,
    context?: any
  ): ValidationResult => {
    let rules: ValidationRule[]
    
    switch (type) {
      case 'room':
        rules = roomValidationRules
        break
      case 'customization':
        rules = customizationValidationRules
        break
      case 'offer':
        rules = offerValidationRules
        break
      default:
        return { isValid: true, errors: [], warnings: [] }
    }
    
    const errors: string[] = []
    const warnings: string[] = []
    
    for (const rule of rules) {
      try {
        if (!rule.check(data, context)) {
          if (rule.severity === 'error') {
            errors.push(rule.message)
          } else {
            warnings.push(rule.message)
          }
        }
      } catch (error) {
        console.error(`Validation rule ${rule.id} failed:`, error)
        errors.push(`Validation error: ${rule.id}`)
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors,
      warnings
    }
  }, [roomValidationRules, customizationValidationRules, offerValidationRules])

  // Validate entire selection state
  const validateAllSelections = useCallback((
    rooms: any[],
    extras: any[],
    totalPrice: number
  ): ValidationResult => {
    const errors: string[] = []
    const warnings: string[] = []
    
    // Business rule validation
    const businessContext = {
      roomCount: rooms.length,
      extraCount: extras.length,
      totalPrice
    }
    
    for (const rule of businessValidationRules) {
      try {
        if (!rule.check(null, businessContext)) {
          if (rule.severity === 'error') {
            errors.push(rule.message)
          } else {
            warnings.push(rule.message)
          }
        }
      } catch (error) {
        console.error(`Business validation rule ${rule.id} failed:`, error)
        errors.push(`Business validation error: ${rule.id}`)
      }
    }
    
    // Validate individual rooms
    for (const room of rooms) {
      const roomValidation = validateSelection('room', room)
      errors.push(...roomValidation.errors)
      warnings.push(...roomValidation.warnings)
    }
    
    // Validate individual offers/extras
    for (const extra of extras) {
      const extraValidation = validateSelection('offer', extra)
      errors.push(...extraValidation.errors)
      warnings.push(...extraValidation.warnings)
    }
    
    // Check for duplicate selections
    const roomIds = rooms.map(r => r.id).filter(Boolean)
    const extraIds = extras.map(e => e.id).filter(Boolean)
    
    if (new Set(roomIds).size !== roomIds.length) {
      errors.push('Duplicate room selections detected')
    }
    
    if (new Set(extraIds).size !== extraIds.length) {
      warnings.push('Duplicate service selections detected')
    }
    
    return {
      isValid: errors.length === 0,
      errors: [...new Set(errors)], // Remove duplicates
      warnings: [...new Set(warnings)]
    }
  }, [businessValidationRules, validateSelection])

  // Get validation errors as SelectionError objects
  const getValidationErrors = useCallback((
    rooms: any[] = [],
    extras: any[] = [],
    totalPrice: number = 0
  ): SelectionError[] => {
    const validation = validateAllSelections(rooms, extras, totalPrice)
    
    const errors: SelectionError[] = []
    
    // Convert validation errors to SelectionError format
    validation.errors.forEach((message, index) => {
      errors.push({
        id: `validation-error-${index}-${Date.now()}`,
        type: 'validation',
        message,
        timestamp: Date.now(),
        recoverable: false
      })
    })
    
    validation.warnings.forEach((message, index) => {
      errors.push({
        id: `validation-warning-${index}-${Date.now()}`,
        type: 'validation',
        message,
        timestamp: Date.now(),
        recoverable: false
      })
    })
    
    return errors
  }, [validateAllSelections])

  // Custom validation rule registration
  const addCustomRule = useCallback((
    type: 'room' | 'customization' | 'offer' | 'business',
    rule: ValidationRule
  ) => {
    // In a real app, this would update the rule sets
    console.log(`Custom rule registered for ${type}:`, rule)
  }, [])

  return {
    validateSelection,
    validateAllSelections,
    getValidationErrors,
    addCustomRule
  }
}