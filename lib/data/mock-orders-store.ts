import { randomUUID } from 'crypto'

export interface MockOrderItem {
  id: string
  order_id: string
  type: string
  item_id: string
  name: string
  description?: string
  price: number
  quantity: number
  metadata?: Record<string, unknown>
}

export interface MockProposal {
  id: string
  order_id: string
  type: string
  title: string
  description?: string
  price_difference: number
  status: string
  original_item_id?: string
  proposed_item_data?: Record<string, unknown>
  expires_at?: string
  created_at: string
}

export interface MockOrder {
  id: string
  user_email: string
  user_name: string
  reservation_code: string
  check_in: string
  check_out: string
  room_type: string
  occupancy: string
  status: string
  total_price: number
  notes?: string
  created_at: string
  order_items: MockOrderItem[]
  hotel_proposals: MockProposal[]
}

const guestNames = [
  { name: 'Ana García', email: 'ana@garcia.com' },
  { name: 'Carlos López', email: 'carlos@lopez.com' },
  { name: 'María Rodríguez', email: 'maria@rodriguez.com' },
  { name: 'José Martínez', email: 'jose@martinez.com' },
  { name: 'Laura Sánchez', email: 'laura@sanchez.com' },
  { name: 'David González', email: 'david@gonzalez.com' },
  { name: 'Carmen Fernández', email: 'carmen@fernandez.com' },
  { name: 'Miguel Pérez', email: 'miguel@perez.com' },
  { name: 'Isabel Ruiz', email: 'isabel@ruiz.com' },
  { name: 'Antonio Jiménez', email: 'antonio@jimenez.com' },
]

const roomTypes = ['Standard', 'Superior', 'Deluxe', 'Suite', 'Presidential Suite']
const occupancies = ['1/0/0', '2/0/0', '1/1/0', '2/1/0', '3/0/1']
const availableItems = [
  { type: 'room_upgrade', name: 'Suite Upgrade', description: 'Upgrade to luxury suite', basePrice: 100 },
  { type: 'customization', name: 'Late Checkout', description: 'Checkout until 3 PM', basePrice: 25 },
  { type: 'customization', name: 'Early Check-in', description: 'Check-in from 12 PM', basePrice: 20 },
  { type: 'special_offer', name: 'Spa Package', description: 'Full spa treatment', basePrice: 75 },
  { type: 'special_offer', name: 'Dinner Package', description: 'Three-course dinner', basePrice: 60 },
]

function generateMockOrders(): MockOrder[] {
  const orders: MockOrder[] = []
  const baseDate = new Date(2026, 4, 20)

  for (let i = 0; i < 50; i++) {
    const guest = guestNames[i % guestNames.length]
    const roomType = roomTypes[i % roomTypes.length]
    const occupancy = occupancies[i % occupancies.length]
    const checkIn = new Date(baseDate)
    checkIn.setDate(checkIn.getDate() + (i % 10) - 5)
    const nights = 1 + (i % 4)
    const checkOut = new Date(checkIn)
    checkOut.setDate(checkOut.getDate() + nights)
    const hasExtras = i % 3 !== 0
    const orderId = `order-${String(i + 1).padStart(3, '0')}`

    const orderItems: MockOrderItem[] = []
    let totalPrice = 0

    if (hasExtras) {
      const itemCount = 1 + (i % 3)
      for (let j = 0; j < itemCount; j++) {
        const item = availableItems[(i + j) % availableItems.length]
        const price = item.basePrice + (j * 5)
        totalPrice += price
        orderItems.push({
          id: `${orderId}-item-${j}`,
          order_id: orderId,
          type: item.type,
          item_id: `${item.type}_${j}`,
          name: item.name,
          description: item.description,
          price,
          quantity: 1,
        })
      }
    }

    orders.push({
      id: orderId,
      user_email: guest.email,
      user_name: guest.name,
      reservation_code: `LOC${1000 + i}`,
      check_in: checkIn.toISOString().split('T')[0],
      check_out: checkOut.toISOString().split('T')[0],
      room_type: roomType,
      occupancy,
      status: i % 3 === 0 ? 'confirmed' : 'pending',
      total_price: totalPrice,
      notes: hasExtras ? 'Order with selected items' : 'Recommendation only',
      created_at: checkIn.toISOString(),
      order_items: orderItems,
      hotel_proposals: [],
    })
  }

  return orders
}

let ordersStore: MockOrder[] = generateMockOrders()

export function getMockOrders(filters?: { status?: string; date?: string }): MockOrder[] {
  let result = [...ordersStore]

  if (filters?.status) {
    result = result.filter((o) => o.status === filters.status)
  }

  if (filters?.date === 'today') {
    const today = new Date().toISOString().split('T')[0]
    result = result.filter((o) => o.created_at.startsWith(today))
  }

  return result.sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  )
}

export function getMockOrderById(id: string): MockOrder | undefined {
  return ordersStore.find((o) => o.id === id)
}

export function createMockOrder(body: Record<string, unknown>): MockOrder {
  const id = randomUUID()
  const order: MockOrder = {
    id,
    user_email: (body.userEmail as string) || 'guest@example.com',
    user_name: (body.userName as string) || 'Guest',
    reservation_code: (body.reservationCode as string) || `LOC${Date.now().toString().slice(-6)}`,
    check_in: (body.checkIn as string) || new Date().toISOString().split('T')[0],
    check_out: (body.checkOut as string) || new Date().toISOString().split('T')[0],
    room_type: (body.roomType as string) || 'Standard',
    occupancy: (body.occupancy as string) || '2/0/0',
    status: (body.status as string) || 'confirmed',
    total_price: (body.totalPrice as number) || 0,
    notes: body.notes as string | undefined,
    created_at: new Date().toISOString(),
    order_items: [],
    hotel_proposals: [],
  }

  const selections = body.selections as Array<Record<string, unknown>> | undefined
  if (selections?.length) {
    order.order_items = selections.map((item, index) => ({
      id: `${id}-item-${index}`,
      order_id: id,
      type: (item.type as string) || 'customization',
      item_id: (item.itemId as string) || (item.id as string) || `item-${index}`,
      name: (item.name as string) || 'Item',
      description: item.description as string | undefined,
      price: (item.price as number) || 0,
      quantity: (item.quantity as number) || 1,
      metadata: (item.metadata as Record<string, unknown>) || item,
    }))
    order.total_price = order.order_items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    )
  }

  ordersStore = [order, ...ordersStore]
  return order
}

export function updateMockOrder(id: string, updates: Record<string, unknown>): MockOrder | undefined {
  const index = ordersStore.findIndex((o) => o.id === id)
  if (index === -1) return undefined

  ordersStore[index] = { ...ordersStore[index], ...updates } as MockOrder
  return ordersStore[index]
}

export function createMockProposal(body: Record<string, unknown>): MockProposal {
  const proposal: MockProposal = {
    id: randomUUID(),
    order_id: body.orderId as string,
    type: body.type as string,
    title: body.title as string,
    description: body.description as string | undefined,
    price_difference: (body.priceDifference as number) || 0,
    status: 'pending',
    original_item_id: body.originalItemId as string | undefined,
    proposed_item_data: body.proposedItemData as Record<string, unknown> | undefined,
    expires_at: body.expiresAt as string | undefined,
    created_at: new Date().toISOString(),
  }

  const order = ordersStore.find((o) => o.id === proposal.order_id)
  if (order) {
    order.hotel_proposals.push(proposal)
  }

  return proposal
}

export function updateMockProposal(proposalId: string, status: string): MockProposal | undefined {
  for (const order of ordersStore) {
    const proposal = order.hotel_proposals.find((p) => p.id === proposalId)
    if (proposal) {
      proposal.status = status
      return proposal
    }
  }
  return undefined
}

export function transformMockOrderForApi(order: MockOrder) {
  const checkInDate = new Date(order.check_in)
  const formattedCheckIn = `${checkInDate.getDate().toString().padStart(2, '0')}/${(checkInDate.getMonth() + 1).toString().padStart(2, '0')}/${checkInDate.getFullYear()}`
  const itemCount = order.order_items.length
  const hasItems = itemCount > 0
  let extrasText = 'recommendation'

  if (hasItems) {
    const totalItemsPrice = order.order_items.reduce(
      (sum, item) => sum + item.price * (item.quantity || 1),
      0,
    )
    extrasText = `${itemCount} reserved (${totalItemsPrice.toFixed(0)}€)`
  }

  return {
    id: order.id,
    locator: order.reservation_code,
    name: order.user_name,
    email: order.user_email,
    checkIn: formattedCheckIn,
    nights: order.check_out
      ? Math.ceil(
          (new Date(order.check_out).getTime() - new Date(order.check_in).getTime()) /
            (1000 * 60 * 60 * 24),
        ).toString()
      : '3',
    roomType: order.room_type,
    aci: order.occupancy,
    status: order.status === 'confirmed' ? 'New' : order.status,
    extras: extrasText,
    extrasCount: itemCount,
    hasExtras: hasItems,
    hasHotelverseRequest: true,
    orderItems: order.order_items,
    proposals: order.hotel_proposals,
  }
}
