import type { Booking, RoomAttribute, AlternativeRoom } from "@/lib/types/booking"

const roomTypes = [
  "Doble", "Doble Deluxe", "Junior Suite"
]

const roomOptions = ["Standard", "Premium", "VIP", "Option"]

const guestNames = [
  "John Doe", "Jane Smith", "Peter Jones", "Sarah Wilson", "Michael Brown",
  "Emily Davis", "David Johnson", "Lisa Garcia", "Robert Miller", "Amanda Taylor",
  "Christopher Anderson", "Jessica Thomas", "Matthew Jackson", "Ashley White", "Daniel Harris",
  "Megan Martin", "Andrew Thompson", "Stephanie Garcia", "Kevin Rodriguez", "Nicole Lewis",
  "James Walker", "Samantha Hall", "Ryan Allen", "Lauren Young", "Brandon King",
  "Victoria Wright", "Tyler Lopez", "Rachel Hill", "Jordan Green", "Alexis Adams",
  "Nathan Baker", "Brittany Gonzalez", "Jonathan Nelson", "Danielle Carter", "Austin Mitchell",
  "Kayla Perez", "Sean Roberts", "Vanessa Turner", "Kyle Phillips", "Jasmine Campbell",
  "Eric Parker", "Chloe Evans", "Ian Edwards", "Brooke Collins", "Derek Stewart",
  "Paige Sanchez", "Trevor Morris", "Haley Rogers", "Corey Reed", "Tiffany Cook"
]

const specialRequests = [
  "Late checkout", "Airport transfer", "Spa appointment", "Restaurant reservation",
  "Extra towels", "Quiet room", "High floor", "Baby crib", "Wheelchair accessible",
  "Pet-friendly", "Non-smoking", "City view", "Balcony", "Mini-bar", "Room service"
]

const roomAttributes: RoomAttribute[] = [
  { id: "wifi", name: "WiFi", icon: "wifi", selected: false },
  { id: "parking", name: "Parking", icon: "car", selected: false },
  { id: "breakfast", name: "Breakfast", icon: "coffee", selected: false },
  { id: "dining", name: "Dining", icon: "utensils", selected: false },
  { id: "spa", name: "Spa Access", icon: "waves", selected: false },
  { id: "gym", name: "Gym Access", icon: "dumbbell", selected: false },
  { id: "pool", name: "Pool Access", icon: "waves", selected: false },
  { id: "concierge", name: "Concierge", icon: "bell", selected: false }
]

function getRandomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
}

function getRandomItems<T>(array: T[], count: number): T[] {
  const shuffled = [...array].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, Math.min(count, array.length))
}

function generateAlternatives(currentNumber: number, roomType: string): AlternativeRoom[] {
  const alternatives: AlternativeRoom[] = []
  const count = Math.floor(Math.random() * 3) + 2 // 2-4 alternatives (more realistic range)
  
  // Create pool of similar room types for more realistic alternatives
  const sameTypeRooms = [roomType] // Include same type
  const similarTypes = roomTypes.filter(type => 
    type !== roomType && (
      (type.includes("Suite") && roomType.includes("Suite")) ||
      (type.includes("Deluxe") && roomType.includes("Deluxe")) ||
      (type === "Doble" && roomType === "Doble")
    )
  )
  const availableTypes = [...sameTypeRooms, ...similarTypes.slice(0, 2)] // Mix of same and similar types
  
  for (let i = 0; i < count; i++) {
    const altNumber = currentNumber + (i * 10) + Math.floor(Math.random() * 8) + 1 // More spread out room numbers
    if (altNumber <= 999) { // Reasonable room number limit
      const altType = availableTypes[Math.floor(Math.random() * availableTypes.length)]
      alternatives.push({
        number: altNumber,
        type: altType,
        available: Math.random() > 0.2 // 80% chance available (higher than before)
      })
    }
  }
  
  return alternatives
}

export function generateMockBookings(): Booking[] {
  const bookings: Booking[] = []
  const today = new Date()
  
  // Create 4 specific test scenarios to match reference logic
  const edgeCases = [
    // Case 1: Room Assigned (Has Key) - final assignment, no options
    { hasKey: true, hasAlternatives: false, hasUpgrade: false, roomType: "Junior Suite" },
    // Case 2: Room Pre-selected (No Key) - single room selected but not assigned
    { hasKey: false, hasAlternatives: false, hasUpgrade: false, roomType: "Doble" },
    // Case 3: Room with Alternatives (No Key) - multiple options available
    { hasKey: false, hasAlternatives: true, hasUpgrade: false, roomType: "Doble Deluxe" },
    // Case 4: Room with Upgrade (No Key) - upgrade available, may have alternatives  
    { hasKey: false, hasAlternatives: true, hasUpgrade: true, roomType: "Doble Deluxe" }
  ]
  
  for (let i = 0; i < 50; i++) {
    const guestName = guestNames[i]
    
    // Use edge cases for first few bookings, then random generation
    const useEdgeCase = i < edgeCases.length
    const edgeCase = useEdgeCase ? edgeCases[i] : null
    
    const roomType = edgeCase?.roomType || roomTypes[Math.floor(Math.random() * roomTypes.length)]
    const roomNumber = 100 + i + Math.floor(Math.random() * 400) // Room numbers 100-599
    // Generate key status first (most important factor)
    const hasKey = edgeCase?.hasKey ?? (Math.random() > 0.4) // 60% chance has key
    
    // When guest has key: room is assigned, no upgrades or alternatives shown
    // When guest has no key: can have upgrades and alternatives
    const hasUpgrade = hasKey ? false : (edgeCase?.hasUpgrade ?? (Math.random() > 0.6)) // 40% of no-key rooms have upgrades
    const hasChooseRoom = edgeCase?.hasChooseRoom ?? (Math.random() > 0.6) // 40% chance can choose room
    
    // Generate alternatives logic: only create alternatives if no key assigned
    // This matches our Room field logic: alternatives only show when !hasKey
    const hasAlternatives = hasKey ? false : (edgeCase?.hasAlternatives ?? (Math.random() > 0.15)) // 85% of no-key rooms have alternatives
    
    // Generate check-in dates (next 60 days)
    const checkInDate = getRandomDate(today, new Date(today.getTime() + 60 * 24 * 60 * 60 * 1000))
    // Check-out 1-14 days after check-in
    const checkOutDate = new Date(checkInDate.getTime() + (Math.floor(Math.random() * 14) + 1) * 24 * 60 * 60 * 1000)
    // Last request up to 30 days before check-in
    const lastRequestDate = getRandomDate(
      new Date(checkInDate.getTime() - 30 * 24 * 60 * 60 * 1000),
      checkInDate
    )
    
    // Calculate nights and base price
    const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (24 * 60 * 60 * 1000))
    const basePrice = Math.floor(Math.random() * 300) + 100 // $100-400 per night
    const totalPrice = basePrice * nights + (Math.floor(Math.random() * 200)) // Add extras
    
    // Generate room attributes with better distribution
    // Higher-tier rooms get more attributes, basic rooms get fewer
    const tierMultiplier = roomType.includes("Suite") ? 1.5 : 
                          roomType.includes("Deluxe") ? 1.2 : 1.0
    const maxAttributes = Math.min(6, Math.floor((Math.random() * 4 + 1) * tierMultiplier)) // 1-6 attributes based on room tier
    const selectedAttributes = getRandomItems(roomAttributes, maxAttributes)
    const roomAttrs = roomAttributes.map(attr => ({
      ...attr,
      selected: selectedAttributes.some(sel => sel.id === attr.id)
    }))
    
    // Generate extras
    const confirmedExtras = Math.floor(Math.random() * 6) // 0-5 confirmed extras
    const pendingExtras = Math.floor(Math.random() * 3) // 0-2 pending extras
    const extraItems = getRandomItems(specialRequests, confirmedExtras + pendingExtras).map((request, idx) => ({
      id: `extra-${i}-${idx}`,
      name: request,
      status: (idx < confirmedExtras ? "confirmed" : "pending") as "confirmed" | "pending",
      price: Math.floor(Math.random() * 100) + 25 // $25-125
    }))
    
    const booking: Booking = {
      id: `booking-${i + 1}`,
      locator: `HV${String(123456 + i).padStart(6, '0')}`,
      guest: {
        id: `guest-${i + 1}`,
        name: guestName,
        email: `${guestName.toLowerCase().replace(' ', '.')}@email.com`,
        phone: `+1-555-${String(Math.floor(Math.random() * 9000) + 1000)}`,
        vipStatus: Math.random() > 0.9 // 10% VIP
      },
      lastRequest: lastRequestDate,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      price: totalPrice,
      status: ["confirmed", "pending", "checked-in"][Math.floor(Math.random() * 3)] as any,
      room: {
        type: roomType,
        number: roomNumber,
        option: roomOptions[Math.floor(Math.random() * roomOptions.length)],
        status: ["confirmed", "standard", "priority"][Math.floor(Math.random() * 3)] as any,
        hasUpgrade,
        hasChooseRoom,
        hasKey,
        hasAlternatives,
        attributes: roomAttrs,
        alternatives: hasAlternatives ? generateAlternatives(roomNumber, roomType) : undefined,
        originalRoom: hasUpgrade ? {
          type: roomTypes[Math.floor(Math.random() * roomTypes.length)],
          number: roomNumber - 50
        } : undefined,
        upgradedRoom: hasUpgrade ? {
          type: roomType,
          number: roomNumber
        } : undefined
      },
      extras: {
        id: `extras-${i + 1}`,
        name: "Room Extras",
        confirmed: confirmedExtras,
        pending: pendingExtras,
        status: confirmedExtras > 3 ? "priority" : pendingExtras > 1 ? "standard" : "confirmed",
        items: extraItems
      },
      notes: Math.random() > 0.7 ? `Special note for booking ${i + 1}` : undefined,
      specialRequests: getRandomItems(specialRequests, Math.floor(Math.random() * 3)),
      createdAt: new Date(lastRequestDate.getTime() - Math.floor(Math.random() * 7) * 24 * 60 * 60 * 1000),
      updatedAt: lastRequestDate
    }
    
    bookings.push(booking)
  }
  
  return bookings.sort((a, b) => a.checkIn.getTime() - b.checkIn.getTime())
}

export const mockBookings = generateMockBookings()