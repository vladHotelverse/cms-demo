/**
 * Advanced algorithms for selection management, conflict resolution,
 * pricing calculations, and duplicate detection
 */

import type { SelectedRoom, SelectedExtra } from '@/stores/user-selections-store'
import type { RoomOption } from '@/components/features/booking-system/ABS_RoomSelectionCarousel/types'
import type { OfferData } from '@/components/features/booking-system/ABS_SpecialOffers/types'

// Types for algorithm results
export interface ConflictResult {
  hasConflicts: boolean
  conflicts: ConflictDetail[]
  suggestions: ConflictResolution[]
}

export interface ConflictDetail {
  id: string
  type: 'duplicate' | 'incompatible' | 'quota_exceeded' | 'time_conflict' | 'resource_conflict'
  severity: 'low' | 'medium' | 'high' | 'critical'
  items: Array<SelectedRoom | SelectedExtra>
  message: string
  autoResolvable: boolean
}

export interface ConflictResolution {
  conflictId: string
  strategy: 'replace' | 'remove' | 'modify' | 'reschedule' | 'upgrade'
  action: string
  confidence: number // 0-1
  estimatedImpact: {
    priceChange: number
    qualityImpact: 'positive' | 'neutral' | 'negative'
    userExperienceImpact: number // -1 to 1
  }
}

// Advanced pricing calculation types
export interface PricingContext {
  baseDate: Date
  seasonalMultiplier?: number
  loyaltyDiscount?: number
  groupSize?: number
  advanceBookingDays?: number
  marketSegment?: 'leisure' | 'business' | 'group' | 'corporate'
}

export interface PricingResult {
  baseTotal: number
  discounts: PricingDiscount[]
  surcharges: PricingSurcharge[]
  finalTotal: number
  savings: number
  breakdown: PricingBreakdown[]
  confidence: number
  validUntil: Date
}

export interface PricingDiscount {
  id: string
  name: string
  type: 'percentage' | 'fixed' | 'tiered'
  value: number
  applicableItems: string[]
  conditions: string[]
  savings: number
}

export interface PricingSurcharge {
  id: string
  name: string
  type: 'percentage' | 'fixed' | 'tiered'
  value: number
  applicableItems: string[]
  reason: string
  amount: number
}

export interface PricingBreakdown {
  itemId: string
  itemName: string
  itemType: 'room' | 'extra'
  basePrice: number
  adjustments: Array<{
    type: 'discount' | 'surcharge'
    name: string
    amount: number
  }>
  finalPrice: number
}

// Duplicate detection types
export interface DuplicateAnalysis {
  hasDuplicates: boolean
  duplicateGroups: DuplicateGroup[]
  similarItems: SimilarItem[]
  recommendations: DuplicateRecommendation[]
}

export interface DuplicateGroup {
  id: string
  items: Array<SelectedRoom | SelectedExtra>
  similarity: number // 0-1
  mergeStrategy: 'keep_first' | 'keep_last' | 'keep_best' | 'merge' | 'manual'
}

export interface SimilarItem {
  item: SelectedRoom | SelectedExtra
  similarTo: Array<SelectedRoom | SelectedExtra>
  similarity: number
  reason: string[]
}

export interface DuplicateRecommendation {
  groupId: string
  action: 'remove' | 'merge' | 'upgrade' | 'reschedule'
  description: string
  confidence: number
  impact: {
    priceChange: number
    qualityChange: 'better' | 'same' | 'worse'
  }
}

/**
 * Advanced Conflict Detection and Resolution Algorithm
 */
export class ConflictResolver {
  private static instance: ConflictResolver
  
  static getInstance(): ConflictResolver {
    if (!ConflictResolver.instance) {
      ConflictResolver.instance = new ConflictResolver()
    }
    return ConflictResolver.instance
  }

  /**
   * Comprehensive conflict analysis
   */
  analyzeConflicts(
    rooms: SelectedRoom[], 
    extras: SelectedExtra[]
  ): ConflictResult {
    const conflicts: ConflictDetail[] = []
    const suggestions: ConflictResolution[] = []

    // Check for room conflicts
    conflicts.push(...this.detectRoomConflicts(rooms))
    
    // Check for extra service conflicts
    conflicts.push(...this.detectExtraConflicts(extras))
    
    // Check for cross-category conflicts
    conflicts.push(...this.detectCrossCategoryConflicts(rooms, extras))
    
    // Generate resolution suggestions
    conflicts.forEach(conflict => {
      suggestions.push(...this.generateResolutions(conflict, rooms, extras))
    })

    return {
      hasConflicts: conflicts.length > 0,
      conflicts,
      suggestions
    }
  }

  private detectRoomConflicts(rooms: SelectedRoom[]): ConflictDetail[] {
    const conflicts: ConflictDetail[] = []

    // Duplicate room types
    const roomTypeGroups = this.groupBy(rooms, 'roomType')
    Object.entries(roomTypeGroups).forEach(([roomType, roomsOfType]) => {
      if (roomsOfType.length > 1) {
        conflicts.push({
          id: `duplicate_room_${roomType}`,
          type: 'duplicate',
          severity: 'high',
          items: roomsOfType,
          message: `Multiple rooms of type "${roomType}" selected`,
          autoResolvable: true
        })
      }
    })

    // Date conflicts (overlapping stays)
    for (let i = 0; i < rooms.length; i++) {
      for (let j = i + 1; j < rooms.length; j++) {
        const room1 = rooms[i]
        const room2 = rooms[j]
        
        if (this.datesOverlap(room1.checkIn, room1.checkOut, room2.checkIn, room2.checkOut)) {
          conflicts.push({
            id: `date_conflict_${room1.id}_${room2.id}`,
            type: 'time_conflict',
            severity: 'critical',
            items: [room1, room2],
            message: `Room bookings have overlapping dates`,
            autoResolvable: false
          })
        }
      }
    }

    // Quota conflicts (max 3 rooms per reservation)
    if (rooms.length > 3) {
      conflicts.push({
        id: 'room_quota_exceeded',
        type: 'quota_exceeded',
        severity: 'critical',
        items: rooms.slice(3),
        message: `Maximum of 3 rooms allowed per reservation`,
        autoResolvable: false
      })
    }

    return conflicts
  }

  private detectExtraConflicts(extras: SelectedExtra[]): ConflictDetail[] {
    const conflicts: ConflictDetail[] = []

    // Service incompatibilities
    const incompatibleServices = [
      ['Early Check-in', 'Late Check-out'],
      ['Private Spa Session', 'Group Spa Package'],
      ['Airport Transfer', 'Car Rental'],
      ['Breakfast Package', 'Room Service Breakfast']
    ]

    incompatibleServices.forEach(([service1, service2]) => {
      const has1 = extras.find(e => e.name.includes(service1))
      const has2 = extras.find(e => e.name.includes(service2))
      
      if (has1 && has2) {
        conflicts.push({
          id: `incompatible_${service1}_${service2}`,
          type: 'incompatible',
          severity: 'medium',
          items: [has1, has2],
          message: `${service1} and ${service2} cannot be booked together`,
          autoResolvable: true
        })
      }
    })

    // Time-based conflicts for same-day services
    const sameDayServices = extras.filter(e => 
      Array.isArray(e.serviceDate) ? e.serviceDate.length === 1 : true
    )
    
    const servicesByDate = this.groupBy(sameDayServices, (extra) => {
      const date = Array.isArray(extra.serviceDate) ? extra.serviceDate[0] : extra.serviceDate
      return date.toString()
    })

    Object.entries(servicesByDate).forEach(([date, servicesOnDate]) => {
      if (servicesOnDate.length > 2) {
        const timeConflictServices = servicesOnDate.filter(s => 
          s.name.includes('Spa') || s.name.includes('Massage') || s.name.includes('Tour')
        )
        
        if (timeConflictServices.length > 1) {
          conflicts.push({
            id: `time_conflict_${date}`,
            type: 'time_conflict',
            severity: 'medium',
            items: timeConflictServices,
            message: `Multiple time-intensive services scheduled for ${date}`,
            autoResolvable: true
          })
        }
      }
    })

    return conflicts
  }

  private detectCrossCategoryConflicts(
    rooms: SelectedRoom[], 
    extras: SelectedExtra[]
  ): ConflictDetail[] {
    const conflicts: ConflictDetail[] = []

    // Check for capacity mismatches
    rooms.forEach(room => {
      const groupServices = extras.filter(e => 
        e.name.includes('Group') || e.units > 4
      )
      
      if (room.roomType.includes('Single') && groupServices.length > 0) {
        conflicts.push({
          id: `capacity_mismatch_${room.id}`,
          type: 'incompatible',
          severity: 'low',
          items: [room, ...groupServices],
          message: `Single room with group services may not be suitable`,
          autoResolvable: true
        })
      }
    })

    return conflicts
  }

  private generateResolutions(
    conflict: ConflictDetail,
    rooms: SelectedRoom[],
    extras: SelectedExtra[]
  ): ConflictResolution[] {
    const resolutions: ConflictResolution[] = []

    switch (conflict.type) {
      case 'duplicate':
        resolutions.push({
          conflictId: conflict.id,
          strategy: 'remove',
          action: 'Remove duplicate items, keep the most recent selection',
          confidence: 0.9,
          estimatedImpact: {
            priceChange: -conflict.items.slice(1).reduce((sum, item) => sum + item.price, 0),
            qualityImpact: 'neutral',
            userExperienceImpact: 0.1
          }
        })
        break

      case 'incompatible':
        resolutions.push({
          conflictId: conflict.id,
          strategy: 'replace',
          action: 'Replace conflicting service with compatible alternative',
          confidence: 0.7,
          estimatedImpact: {
            priceChange: 0,
            qualityImpact: 'neutral',
            userExperienceImpact: 0.2
          }
        })
        break

      case 'time_conflict':
        resolutions.push({
          conflictId: conflict.id,
          strategy: 'reschedule',
          action: 'Reschedule conflicting services to different times/dates',
          confidence: 0.6,
          estimatedImpact: {
            priceChange: 0,
            qualityImpact: 'neutral',
            userExperienceImpact: -0.1
          }
        })
        break

      case 'quota_exceeded':
        resolutions.push({
          conflictId: conflict.id,
          strategy: 'remove',
          action: 'Remove excess items beyond quota limit',
          confidence: 0.8,
          estimatedImpact: {
            priceChange: -conflict.items.reduce((sum, item) => sum + item.price, 0),
            qualityImpact: 'negative',
            userExperienceImpact: -0.3
          }
        })
        break
    }

    return resolutions
  }

  private datesOverlap(
    start1: string, end1: string, 
    start2: string, end2: string
  ): boolean {
    const s1 = new Date(start1)
    const e1 = new Date(end1)
    const s2 = new Date(start2)
    const e2 = new Date(end2)

    return s1 <= e2 && s2 <= e1
  }

  private groupBy<T>(array: T[], keyOrFn: string | ((item: T) => string)): Record<string, T[]> {
    const groups: Record<string, T[]> = {}
    
    array.forEach(item => {
      const key = typeof keyOrFn === 'function' ? keyOrFn(item) : (item as any)[keyOrFn]
      if (!groups[key]) {
        groups[key] = []
      }
      groups[key].push(item)
    })
    
    return groups
  }
}

/**
 * Advanced Pricing Calculation Engine
 */
export class PricingEngine {
  private static instance: PricingEngine
  
  static getInstance(): PricingEngine {
    if (!PricingEngine.instance) {
      PricingEngine.instance = new PricingEngine()
    }
    return PricingEngine.instance
  }

  /**
   * Calculate optimized pricing with all applicable discounts and surcharges
   */
  calculateOptimizedPricing(
    rooms: SelectedRoom[],
    extras: SelectedExtra[],
    context: PricingContext
  ): PricingResult {
    const baseTotal = this.calculateBaseTotal(rooms, extras)
    const discounts = this.calculateDiscounts(rooms, extras, context)
    const surcharges = this.calculateSurcharges(rooms, extras, context)
    const breakdown = this.generateBreakdown(rooms, extras, discounts, surcharges)
    
    const totalDiscounts = discounts.reduce((sum, d) => sum + d.savings, 0)
    const totalSurcharges = surcharges.reduce((sum, s) => sum + s.amount, 0)
    const finalTotal = Math.max(0, baseTotal - totalDiscounts + totalSurcharges)

    return {
      baseTotal,
      discounts,
      surcharges,
      finalTotal,
      savings: totalDiscounts,
      breakdown,
      confidence: this.calculatePricingConfidence(rooms, extras, context),
      validUntil: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
    }
  }

  private calculateBaseTotal(rooms: SelectedRoom[], extras: SelectedExtra[]): number {
    const roomsTotal = rooms.reduce((sum, room) => 
      sum + room.price + (room.customizationTotal || 0), 0
    )
    
    const extrasTotal = extras.reduce((sum, extra) => 
      sum + extra.price * extra.units, 0
    )
    
    return roomsTotal + extrasTotal
  }

  private calculateDiscounts(
    rooms: SelectedRoom[],
    extras: SelectedExtra[],
    context: PricingContext
  ): PricingDiscount[] {
    const discounts: PricingDiscount[] = []

    // Early booking discount
    if (context.advanceBookingDays && context.advanceBookingDays > 30) {
      const discountRate = Math.min(0.15, context.advanceBookingDays / 365 * 0.5)
      discounts.push({
        id: 'early_booking',
        name: 'Early Booking Discount',
        type: 'percentage',
        value: discountRate,
        applicableItems: rooms.map(r => r.id),
        conditions: [`Booked ${context.advanceBookingDays} days in advance`],
        savings: rooms.reduce((sum, room) => sum + room.price * discountRate, 0)
      })
    }

    // Bulk service discount
    if (extras.length >= 3) {
      const bulkDiscount = 0.1
      discounts.push({
        id: 'bulk_services',
        name: 'Multiple Services Discount',
        type: 'percentage',
        value: bulkDiscount,
        applicableItems: extras.map(e => e.id),
        conditions: [`${extras.length} services selected`],
        savings: extras.reduce((sum, extra) => sum + extra.price * bulkDiscount, 0)
      })
    }

    // Loyalty discount
    if (context.loyaltyDiscount && context.loyaltyDiscount > 0) {
      const totalApplicable = rooms.reduce((sum, room) => sum + room.price, 0)
      discounts.push({
        id: 'loyalty',
        name: 'Loyalty Member Discount',
        type: 'percentage',
        value: context.loyaltyDiscount,
        applicableItems: rooms.map(r => r.id),
        conditions: ['Loyalty member'],
        savings: totalApplicable * context.loyaltyDiscount
      })
    }

    // Group size discount
    if (context.groupSize && context.groupSize > 4) {
      const groupDiscount = Math.min(0.2, (context.groupSize - 4) * 0.03)
      const totalApplicable = this.calculateBaseTotal(rooms, extras)
      discounts.push({
        id: 'group_size',
        name: 'Group Discount',
        type: 'percentage',
        value: groupDiscount,
        applicableItems: [...rooms.map(r => r.id), ...extras.map(e => e.id)],
        conditions: [`Group of ${context.groupSize} people`],
        savings: totalApplicable * groupDiscount
      })
    }

    return discounts
  }

  private calculateSurcharges(
    rooms: SelectedRoom[],
    extras: SelectedExtra[],
    context: PricingContext
  ): PricingSurcharge[] {
    const surcharges: PricingSurcharge[] = []

    // Peak season surcharge
    if (context.seasonalMultiplier && context.seasonalMultiplier > 1) {
      const surchargeRate = context.seasonalMultiplier - 1
      const totalApplicable = this.calculateBaseTotal(rooms, extras)
      surcharges.push({
        id: 'peak_season',
        name: 'Peak Season Surcharge',
        type: 'percentage',
        value: surchargeRate,
        applicableItems: [...rooms.map(r => r.id), ...extras.map(e => e.id)],
        reason: 'High demand period',
        amount: totalApplicable * surchargeRate
      })
    }

    // Last-minute booking surcharge
    if (context.advanceBookingDays !== undefined && context.advanceBookingDays < 7) {
      const surchargeRate = Math.max(0, (7 - context.advanceBookingDays) * 0.02)
      const totalApplicable = rooms.reduce((sum, room) => sum + room.price, 0)
      surcharges.push({
        id: 'last_minute',
        name: 'Last-Minute Booking Fee',
        type: 'percentage',
        value: surchargeRate,
        applicableItems: rooms.map(r => r.id),
        reason: `Booked only ${context.advanceBookingDays} days in advance`,
        amount: totalApplicable * surchargeRate
      })
    }

    return surcharges
  }

  private generateBreakdown(
    rooms: SelectedRoom[],
    extras: SelectedExtra[],
    discounts: PricingDiscount[],
    surcharges: PricingSurcharge[]
  ): PricingBreakdown[] {
    const breakdown: PricingBreakdown[] = []

    // Room breakdown
    rooms.forEach(room => {
      const applicableDiscounts = discounts.filter(d => d.applicableItems.includes(room.id))
      const applicableSurcharges = surcharges.filter(s => s.applicableItems.includes(room.id))
      
      const adjustments = [
        ...applicableDiscounts.map(d => ({
          type: 'discount' as const,
          name: d.name,
          amount: -room.price * d.value
        })),
        ...applicableSurcharges.map(s => ({
          type: 'surcharge' as const,
          name: s.name,
          amount: room.price * s.value
        }))
      ]

      const finalPrice = room.price + adjustments.reduce((sum, adj) => sum + adj.amount, 0)

      breakdown.push({
        itemId: room.id,
        itemName: room.roomType,
        itemType: 'room',
        basePrice: room.price,
        adjustments,
        finalPrice: Math.max(0, finalPrice)
      })
    })

    // Extra breakdown
    extras.forEach(extra => {
      const applicableDiscounts = discounts.filter(d => d.applicableItems.includes(extra.id))
      const applicableSurcharges = surcharges.filter(s => s.applicableItems.includes(extra.id))
      
      const basePrice = extra.price * extra.units
      const adjustments = [
        ...applicableDiscounts.map(d => ({
          type: 'discount' as const,
          name: d.name,
          amount: -basePrice * d.value
        })),
        ...applicableSurcharges.map(s => ({
          type: 'surcharge' as const,
          name: s.name,
          amount: basePrice * s.value
        }))
      ]

      const finalPrice = basePrice + adjustments.reduce((sum, adj) => sum + adj.amount, 0)

      breakdown.push({
        itemId: extra.id,
        itemName: extra.name,
        itemType: 'extra',
        basePrice,
        adjustments,
        finalPrice: Math.max(0, finalPrice)
      })
    })

    return breakdown
  }

  private calculatePricingConfidence(
    rooms: SelectedRoom[],
    extras: SelectedExtra[],
    context: PricingContext
  ): number {
    let confidence = 1.0

    // Reduce confidence for complex scenarios
    if (rooms.length > 2) confidence -= 0.1
    if (extras.length > 5) confidence -= 0.1
    if (context.seasonalMultiplier && context.seasonalMultiplier > 1.5) confidence -= 0.2
    if (context.advanceBookingDays !== undefined && context.advanceBookingDays < 1) confidence -= 0.3

    return Math.max(0.5, confidence)
  }
}

/**
 * Intelligent Duplicate Detection System
 */
export class DuplicateDetector {
  private static instance: DuplicateDetector
  
  static getInstance(): DuplicateDetector {
    if (!DuplicateDetector.instance) {
      DuplicateDetector.instance = new DuplicateDetector()
    }
    return DuplicateDetector.instance
  }

  /**
   * Analyze selections for duplicates and similar items
   */
  analyzeDuplicates(
    rooms: SelectedRoom[],
    extras: SelectedExtra[]
  ): DuplicateAnalysis {
    const duplicateGroups = this.findDuplicateGroups(rooms, extras)
    const similarItems = this.findSimilarItems(rooms, extras)
    const recommendations = this.generateRecommendations(duplicateGroups, similarItems)

    return {
      hasDuplicates: duplicateGroups.length > 0 || similarItems.length > 0,
      duplicateGroups,
      similarItems,
      recommendations
    }
  }

  private findDuplicateGroups(
    rooms: SelectedRoom[],
    extras: SelectedExtra[]
  ): DuplicateGroup[] {
    const groups: DuplicateGroup[] = []

    // Find exact room duplicates
    const roomGroups = this.groupBy(rooms, 'roomType')
    Object.entries(roomGroups).forEach(([roomType, roomsOfType]) => {
      if (roomsOfType.length > 1) {
        groups.push({
          id: `room_duplicate_${roomType}`,
          items: roomsOfType,
          similarity: 1.0,
          mergeStrategy: 'keep_last'
        })
      }
    })

    // Find exact extra service duplicates
    const extraGroups = this.groupBy(extras, 'name')
    Object.entries(extraGroups).forEach(([name, extrasOfType]) => {
      if (extrasOfType.length > 1) {
        groups.push({
          id: `extra_duplicate_${name}`,
          items: extrasOfType,
          similarity: 1.0,
          mergeStrategy: 'merge'
        })
      }
    })

    // Find near-duplicate services (similar names/types)
    for (let i = 0; i < extras.length; i++) {
      for (let j = i + 1; j < extras.length; j++) {
        const similarity = this.calculateSimilarity(extras[i], extras[j])
        if (similarity > 0.8 && similarity < 1.0) {
          groups.push({
            id: `similar_extras_${extras[i].id}_${extras[j].id}`,
            items: [extras[i], extras[j]],
            similarity,
            mergeStrategy: 'keep_best'
          })
        }
      }
    }

    return groups
  }

  private findSimilarItems(
    rooms: SelectedRoom[],
    extras: SelectedExtra[]
  ): SimilarItem[] {
    const similarItems: SimilarItem[] = []

    // Find similar room types
    rooms.forEach((room, index) => {
      const similar = rooms.slice(index + 1).filter(otherRoom => {
        const similarity = this.calculateRoomSimilarity(room, otherRoom)
        return similarity > 0.6 && similarity < 1.0
      })

      if (similar.length > 0) {
        similarItems.push({
          item: room,
          similarTo: similar,
          similarity: Math.max(...similar.map(s => this.calculateRoomSimilarity(room, s))),
          reason: ['Similar room types', 'Overlapping amenities']
        })
      }
    })

    // Find similar services
    extras.forEach((extra, index) => {
      const similar = extras.slice(index + 1).filter(otherExtra => {
        const similarity = this.calculateSimilarity(otherExtra, extra)
        return similarity > 0.6 && similarity < 1.0
      })

      if (similar.length > 0) {
        similarItems.push({
          item: extra,
          similarTo: similar,
          similarity: Math.max(...similar.map(s => this.calculateSimilarity(extra, s))),
          reason: this.getSimilarityReasons(extra, similar[0])
        })
      }
    })

    return similarItems
  }

  private generateRecommendations(
    duplicateGroups: DuplicateGroup[],
    similarItems: SimilarItem[]
  ): DuplicateRecommendation[] {
    const recommendations: DuplicateRecommendation[] = []

    duplicateGroups.forEach(group => {
      switch (group.mergeStrategy) {
        case 'keep_last':
          recommendations.push({
            groupId: group.id,
            action: 'remove',
            description: `Remove duplicate items, keep the most recent selection`,
            confidence: 0.9,
            impact: {
              priceChange: -group.items.slice(0, -1).reduce((sum, item) => sum + item.price, 0),
              qualityChange: 'same'
            }
          })
          break

        case 'merge':
          recommendations.push({
            groupId: group.id,
            action: 'merge',
            description: `Combine duplicate services into a single booking`,
            confidence: 0.8,
            impact: {
              priceChange: 0,
              qualityChange: 'same'
            }
          })
          break

        case 'keep_best': {
          const bestItem = this.findBestItem(group.items)
          recommendations.push({
            groupId: group.id,
            action: 'remove',
            description: `Keep the highest quality option: ${(bestItem as any).name || (bestItem as any).roomType}`,
            confidence: 0.7,
            impact: {
              priceChange: group.items.filter(item => item.id !== bestItem.id)
                .reduce((sum, item) => sum - item.price, 0),
              qualityChange: 'better'
            }
          })
          break
        }
      }
    })

    similarItems.forEach(item => {
      recommendations.push({
        groupId: `similar_${item.item.id}`,
        action: 'upgrade',
        description: `Consider upgrading to a premium version that includes similar services`,
        confidence: 0.6,
        impact: {
          priceChange: item.similarTo.reduce((sum, similar) => sum + similar.price * 0.1, 0),
          qualityChange: 'better'
        }
      })
    })

    return recommendations
  }

  private calculateSimilarity(item1: SelectedExtra, item2: SelectedExtra): number {
    if (item1.name === item2.name) return 1.0

    const nameWords1 = item1.name.toLowerCase().split(' ')
    const nameWords2 = item2.name.toLowerCase().split(' ')
    const commonWords = nameWords1.filter(word => nameWords2.includes(word))
    const nameSimilarity = commonWords.length / Math.max(nameWords1.length, nameWords2.length)

    const typeSimilarity = item1.type === item2.type ? 1.0 : 0.0
    
    return (nameSimilarity * 0.7) + (typeSimilarity * 0.3)
  }

  private calculateRoomSimilarity(room1: SelectedRoom, room2: SelectedRoom): number {
    if (room1.roomType === room2.roomType) return 1.0

    const type1Words = room1.roomType.toLowerCase().split(' ')
    const type2Words = room2.roomType.toLowerCase().split(' ')
    const commonWords = type1Words.filter(word => type2Words.includes(word))
    const typeSimilarity = commonWords.length / Math.max(type1Words.length, type2Words.length)

    const attributes1 = room1.attributes || []
    const attributes2 = room2.attributes || []
    const commonAttributes = attributes1.filter(attr => attributes2.includes(attr))
    const attributeSimilarity = attributes1.length > 0 && attributes2.length > 0 
      ? commonAttributes.length / Math.max(attributes1.length, attributes2.length)
      : 0

    return (typeSimilarity * 0.6) + (attributeSimilarity * 0.4)
  }

  private getSimilarityReasons(item1: SelectedExtra, item2: SelectedExtra): string[] {
    const reasons: string[] = []

    if (item1.type === item2.type) {
      reasons.push('Same service type')
    }

    const nameWords1 = item1.name.toLowerCase().split(' ')
    const nameWords2 = item2.name.toLowerCase().split(' ')
    const commonWords = nameWords1.filter(word => nameWords2.includes(word))
    
    if (commonWords.length > 0) {
      reasons.push(`Common keywords: ${commonWords.join(', ')}`)
    }

    if (Math.abs(item1.price - item2.price) < item1.price * 0.2) {
      reasons.push('Similar pricing')
    }

    return reasons
  }

  private findBestItem(items: Array<SelectedRoom | SelectedExtra>): SelectedRoom | SelectedExtra {
    // Simple heuristic: highest price usually means better quality
    return items.reduce((best, current) => 
      current.price > best.price ? current : best
    )
  }

  private groupBy<T>(array: T[], keyOrFn: string | ((item: T) => string)): Record<string, T[]> {
    const groups: Record<string, T[]> = {}
    
    array.forEach(item => {
      const key = typeof keyOrFn === 'function' ? keyOrFn(item) : (item as any)[keyOrFn]
      if (!groups[key]) {
        groups[key] = []
      }
      groups[key].push(item)
    })
    
    return groups
  }
}

// Export singleton instances for easy use
export const conflictResolver = ConflictResolver.getInstance()
export const pricingEngine = PricingEngine.getInstance()
export const duplicateDetector = DuplicateDetector.getInstance()

// Utility functions for common operations
export const optimizeSelections = (
  rooms: SelectedRoom[],
  extras: SelectedExtra[],
  context: PricingContext
) => {
  const conflicts = conflictResolver.analyzeConflicts(rooms, extras)
  const pricing = pricingEngine.calculateOptimizedPricing(rooms, extras, context)
  const duplicates = duplicateDetector.analyzeDuplicates(rooms, extras)

  return {
    conflicts,
    pricing,
    duplicates,
    recommendations: [
      ...conflicts.suggestions,
      ...duplicates.recommendations
    ].sort((a, b) => b.confidence - a.confidence) // Sort by confidence
  }
}