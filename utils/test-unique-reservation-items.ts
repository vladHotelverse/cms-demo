/**
 * Test file to demonstrate the unique reservation items generator
 * Run this to see how different reservations get different items
 */

import { generateUniqueReservationItems } from './generate-unique-reservation-items'

// Test reservations with different properties
const testReservations = [
  {
    id: 'res-001',
    locator: 'ABC123',
    name: 'John Smith',
    email: 'john@example.com',
    checkIn: '15/02/2024',
    nights: '3',
    roomType: 'Standard',
    aci: 'Leisure',
    status: 'confirmed',
    extras: '5 reserved items',
    hasHotelverseRequest: false
  },
  {
    id: 'res-002',
    locator: 'XYZ789',
    name: 'Maria Garcia',
    email: 'maria@example.com',
    checkIn: '20/06/2024',
    nights: '7',
    roomType: 'Deluxe',
    aci: 'Business',
    status: 'confirmed',
    extras: '8 reserved items',
    hasHotelverseRequest: true
  },
  {
    id: 'res-003',
    locator: 'DEF456',
    name: 'James Wilson',
    email: 'james@example.com',
    checkIn: '10/12/2024',
    nights: '2',
    roomType: 'Suite',
    aci: 'Business',
    status: 'confirmed',
    extras: '3 reserved items',
    hasHotelverseRequest: false
  },
  // Same reservation ID should always generate same items
  {
    id: 'res-001', // Same as first one
    locator: 'ABC123',
    name: 'John Smith',
    email: 'john@example.com',
    checkIn: '15/02/2024',
    nights: '3',
    roomType: 'Standard',
    aci: 'Leisure',
    status: 'confirmed',
    extras: '5 reserved items',
    hasHotelverseRequest: false
  }
]

// Test the generator
console.log('Testing Unique Reservation Items Generator\n')
console.log('=' .repeat(50))

testReservations.forEach((reservation, index) => {
  console.log(`\nTest ${index + 1}: ${reservation.name} - ${reservation.roomType} - ${reservation.nights} nights`)
  console.log(`Reservation ID: ${reservation.id}`)
  console.log(`Extras: ${reservation.extras}`)
  console.log('-'.repeat(50))
  
  const items = generateUniqueReservationItems(reservation)
  
  console.log(`Generated ${items.rooms.length} room items:`)
  items.rooms.forEach(room => {
    console.log(`  - ${room.roomType} (Room ${room.roomNumber})`)
    console.log(`    Price: €${room.price} | Status: ${room.status}`)
    console.log(`    Attributes: ${room.attributes.join(', ')}`)
  })
  
  console.log(`\nGenerated ${items.extras.length} extra items:`)
  items.extras.forEach(extra => {
    console.log(`  - ${extra.name}: ${extra.description}`)
    console.log(`    Price: €${extra.price} | Units: ${extra.units} | Type: ${extra.type}`)
    console.log(`    Agent: ${extra.agent} | Commission: €${extra.commission}`)
  })
  
  console.log(`\nGenerated ${items.bidding.length} bidding items:`)
  items.bidding.forEach(bid => {
    console.log(`  - Upgrade to ${bid.pujaType} (${bid.pujaNumber})`)
    console.log(`    Bid Price: €${bid.price} | Room Price: €${bid.roomPrice}`)
    console.log(`    Attributes: ${bid.attributes.join(', ')}`)
  })
  
  const totalItems = items.rooms.length + items.extras.length + items.bidding.length
  console.log(`\nTotal items generated: ${totalItems}`)
  console.log('=' .repeat(50))
})

// Verify consistency
console.log('\nConsistency Check:')
console.log('Reservation res-001 appears twice (index 0 and 3)')
console.log('Both should generate identical items due to consistent seeding.')

const items1 = generateUniqueReservationItems(testReservations[0])
const items2 = generateUniqueReservationItems(testReservations[3])

const areIdentical = 
  JSON.stringify(items1.rooms) === JSON.stringify(items2.rooms) &&
  JSON.stringify(items1.extras) === JSON.stringify(items2.extras) &&
  JSON.stringify(items1.bidding) === JSON.stringify(items2.bidding)

console.log(`Items are identical: ${areIdentical ? 'YES ✓' : 'NO ✗'}`)

export {}