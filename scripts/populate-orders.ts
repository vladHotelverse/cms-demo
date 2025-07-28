import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'
import { randomUUID } from 'crypto'

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing required environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Spanish names from v0 branch
const spanishNames = [
  { name: "Ana García", email: "ana@garcia.com" },
  { name: "Carlos López", email: "carlos@lopez.com" },
  { name: "María Rodríguez", email: "maria@rodriguez.com" },
  { name: "José Martínez", email: "jose@martinez.com" },
  { name: "Laura Sánchez", email: "laura@sanchez.com" },
  { name: "David González", email: "david@gonzalez.com" },
  { name: "Carmen Fernández", email: "carmen@fernandez.com" },
  { name: "Miguel Pérez", email: "miguel@perez.com" },
  { name: "Isabel Ruiz", email: "isabel@ruiz.com" },
  { name: "Antonio Jiménez", email: "antonio@jimenez.com" },
  { name: "Pilar Moreno", email: "pilar@moreno.com" },
  { name: "Francisco Álvarez", email: "francisco@alvarez.com" },
  { name: "Rosa Romero", email: "rosa@romero.com" },
  { name: "Manuel Torres", email: "manuel@torres.com" },
  { name: "Dolores Vázquez", email: "dolores@vazquez.com" },
  { name: "Jesús Ramos", email: "jesus@ramos.com" },
  { name: "Amparo Castro", email: "amparo@castro.com" },
  { name: "Ángel Ortega", email: "angel@ortega.com" },
  { name: "Remedios Delgado", email: "remedios@delgado.com" },
  { name: "Fernando Herrera", email: "fernando@herrera.com" },
  { name: "Encarnación Molina", email: "encarnacion@molina.com" },
  { name: "Rafael Vargas", email: "rafael@vargas.com" },
  { name: "Josefa Iglesias", email: "josefa@iglesias.com" },
  { name: "Enrique Medina", email: "enrique@medina.com" },
  { name: "Concepción Garrido", email: "concepcion@garrido.com" },
  { name: "Pablo Serrano", email: "pablo@serrano.com" },
  { name: "Mercedes Peña", email: "mercedes@pena.com" },
  { name: "Andrés Cruz", email: "andres@cruz.com" },
  { name: "Esperanza Flores", email: "esperanza@flores.com" },
  { name: "Ramón Herrero", email: "ramon@herrero.com" },
  { name: "Milagros Cabrera", email: "milagros@cabrera.com" },
  { name: "Sebastián Bernal", email: "sebastian@bernal.com" },
  { name: "Asunción León", email: "asuncion@leon.com" },
  { name: "Emilio Blanco", email: "emilio@blanco.com" },
  { name: "Rosario Suárez", email: "rosario@suarez.com" },
  { name: "Gregorio Vega", email: "gregorio@vega.com" },
  { name: "Purificación Morales", email: "purificacion@morales.com" },
  { name: "Patricio Santos", email: "patricio@santos.com" },
  { name: "Inmaculada Pastor", email: "inmaculada@pastor.com" },
  { name: "Evaristo Lorenzo", email: "evaristo@lorenzo.com" },
  { name: "Nieves Pascual", email: "nieves@pascual.com" },
  { name: "Celestino Soler", email: "celestino@soler.com" },
  { name: "Visitación Aguilar", email: "visitacion@aguilar.com" },
  { name: "Teodoro Lozano", email: "teodoro@lozano.com" },
  { name: "Natividad Cano", email: "natividad@cano.com" },
  { name: "Leopoldo Prieto", email: "leopoldo@prieto.com" },
  { name: "Presentación Calvo", email: "presentacion@calvo.com" },
  { name: "Casimiro Campos", email: "casimiro@campos.com" },
  { name: "Angustias Reyes", email: "angustias@reyes.com" },
  { name: "Saturnino Vila", email: "saturnino@vila.com" }
]

const roomTypes = ['Standard', 'Superior', 'Deluxe', 'Suite', 'Presidential Suite']
const occupancies = ['1/0/0', '2/0/0', '1/1/0', '2/1/0', '3/0/1', '3/1/0']

// Available order items based on ABS structure
const availableItems = [
  // Room upgrades
  { type: 'room_upgrade', name: 'Suite Upgrade', description: 'Upgrade to luxury suite with ocean view', basePrice: 100 },
  { type: 'room_upgrade', name: 'Deluxe Upgrade', description: 'Upgrade to deluxe room with balcony', basePrice: 50 },
  
  // Customizations
  { type: 'customization', name: 'Late Checkout', description: 'Checkout extended until 3 PM', basePrice: 25 },
  { type: 'customization', name: 'Early Check-in', description: 'Check-in from 12 PM', basePrice: 20 },
  { type: 'customization', name: 'Extra Towels', description: 'Additional towel set', basePrice: 10 },
  { type: 'customization', name: 'Room Service', description: 'Welcome drinks and snacks', basePrice: 35 },
  { type: 'customization', name: 'Minibar Refill', description: 'Complimentary minibar refill', basePrice: 45 },
  
  // Special offers
  { type: 'special_offer', name: 'Spa Package', description: 'Full spa treatment including massage and facial', basePrice: 75 },
  { type: 'special_offer', name: 'Dinner Package', description: 'Three-course dinner at our restaurant', basePrice: 60 },
  { type: 'special_offer', name: 'Breakfast Upgrade', description: 'Continental to buffet breakfast upgrade', basePrice: 15 },
  { type: 'special_offer', name: 'City Tour', description: 'Guided city tour with transportation', basePrice: 40 },
  { type: 'special_offer', name: 'Wine Tasting', description: 'Local wine tasting experience', basePrice: 30 },
  { type: 'special_offer', name: 'Beach Access', description: 'Private beach club access', basePrice: 25 }
]

// Helper function to generate dates in October 2025
const generateOctoberDate = (day: number) => {
  const date = new Date(2025, 9, day) // Month is 0-indexed, so 9 = October
  return date.toISOString().split('T')[0]
}

// Helper function to get random items
const getRandomItems = <T>(array: T[], count: number): T[] => {
  const shuffled = [...array].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, count)
}

// Helper function to generate random order
const generateRandomOrder = (index: number) => {
  const guest = spanishNames[index % spanishNames.length]
  const roomType = roomTypes[Math.floor(Math.random() * roomTypes.length)]
  const occupancy = occupancies[Math.floor(Math.random() * occupancies.length)]
  
  // Random check-in date between Oct 9-11, 2025
  const checkInDay = 9 + Math.floor(Math.random() * 3) // 9, 10, or 11
  const nights = 1 + Math.floor(Math.random() * 3) // 1, 2, or 3 nights
  
  const checkInDate = generateOctoberDate(checkInDay)
  const checkOutDate = generateOctoberDate(checkInDay + nights)
  
  // 60% chance of having items (with extras), 40% chance of being recommendation only
  const hasExtras = Math.random() < 0.6
  
  let orderItems: any[] = []
  let totalPrice = 0
  
  if (hasExtras) {
    // Generate 1-4 random items
    const itemCount = 1 + Math.floor(Math.random() * 4)
    const selectedItems = getRandomItems(availableItems, itemCount)
    
    orderItems = selectedItems.map(item => {
      const price = item.basePrice + Math.floor(Math.random() * 20) - 10 // ±10 price variation
      totalPrice += price
      
      return {
        type: item.type,
        item_id: `${item.type}_${Math.random().toString(36).substr(2, 5)}`,
        name: item.name,
        description: item.description,
        price: price,
        quantity: 1,
        metadata: { category: item.type, generated: true }
      }
    })
  }
  
  return {
    guest,
    roomType,
    occupancy,
    checkInDate,
    checkOutDate,
    hasExtras,
    orderItems,
    totalPrice
  }
}

async function cleanAndPopulateOrders() {
  console.log('🧹 Cleaning orders table...')
  
  try {
    // Delete all existing orders (this will cascade to order_items and hotel_proposals)
    // First get all order IDs
    const { data: existingOrders, error: fetchError } = await supabase
      .from('orders')
      .select('id')

    if (fetchError) {
      console.error('Error fetching existing orders:', fetchError)
      return
    }

    let totalDeleted = 0
    if (existingOrders && existingOrders.length > 0) {
      // Delete in batches
      for (const order of existingOrders) {
        const { error: deleteError } = await supabase
          .from('orders')
          .delete()
          .eq('id', order.id)
        
        if (!deleteError) {
          totalDeleted++
        }
      }
    }

    console.log(`✓ Deleted ${totalDeleted} existing orders`)
    
    console.log('🎲 Generating 50 random orders...')
    
    let successCount = 0
    let errorCount = 0

    for (let i = 0; i < 50; i++) {
      try {
        const orderData = generateRandomOrder(i)
        const orderId = randomUUID()
        
        // Generate unique reservation code
        const reservationCode = `HTL${Date.now().toString().slice(-6)}${Math.random().toString(36).substr(2, 3)}`.toUpperCase()
        
        // Insert main order
        const { data: order, error: orderError } = await supabase
          .from('orders')
          .insert({
            id: orderId,
            user_email: orderData.guest.email,
            user_name: orderData.guest.name,
            reservation_code: reservationCode,
            check_in: orderData.checkInDate,
            check_out: orderData.checkOutDate,
            room_type: orderData.roomType,
            occupancy: orderData.occupancy,
            status: 'confirmed',
            total_price: orderData.totalPrice,
            notes: orderData.hasExtras ? 'Order with selected items' : 'Recommendation only - no items selected'
          })
          .select()
          .single()

        if (orderError) {
          console.error(`Error creating order for ${orderData.guest.name}:`, orderError)
          errorCount++
          continue
        }

        // Insert order items if any
        if (orderData.orderItems.length > 0) {
          const orderItemsWithOrderId = orderData.orderItems.map(item => ({
            ...item,
            order_id: orderId
          }))

          const { error: itemsError } = await supabase
            .from('order_items')
            .insert(orderItemsWithOrderId)

          if (itemsError) {
            console.error(`Error creating order items for ${orderData.guest.name}:`, itemsError)
            // Don't fail the whole order for items error
          }
        }

        const statusEmoji = orderData.hasExtras ? '🛍️' : '💡'
        const itemsText = orderData.hasExtras ? `${orderData.orderItems.length} items (${orderData.totalPrice}€)` : 'recommendation'
        console.log(`${statusEmoji} ${orderData.guest.name} - ${orderData.checkInDate} - ${itemsText}`)
        
        successCount++
        
        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 50))
      } catch (err) {
        console.error(`Unexpected error for order ${i + 1}:`, err)
        errorCount++
      }
    }

    console.log(`\n📊 Summary:`)
    console.log(`✅ Successfully created: ${successCount} orders`)
    if (errorCount > 0) {
      console.log(`❌ Failed: ${errorCount} orders`)
    }
    
    // Show breakdown from the actual created orders
    const createdOrdersWithItems = successCount - (50 - successCount) // Simple calculation from what we just created
    console.log(`\n📈 Final Breakdown (${successCount} total orders):`)
    
    // Count from our actual creation process
    let actualWithItems = 0
    let actualRecommendations = 0
    
    const { data: verifyOrders } = await supabase
      .from('orders')
      .select(`
        id,
        total_price,
        order_items(id)
      `)
    
    if (verifyOrders) {
      verifyOrders.forEach(order => {
        if (order.order_items && order.order_items.length > 0) {
          actualWithItems++
        } else {
          actualRecommendations++
        }
      })
      
      console.log(`🛍️  Orders with items: ${actualWithItems}`)
      console.log(`💡 Recommendation only: ${actualRecommendations}`)
      console.log(`📊 Total verified: ${verifyOrders.length}`)
    }

  } catch (error) {
    console.error('Script failed:', error)
  }
}

// Run the script
cleanAndPopulateOrders()
  .then(() => {
    console.log('\n🎉 Script completed successfully!')
    process.exit(0)
  })
  .catch((err) => {
    console.error('💥 Script failed:', err)
    process.exit(1)
  })