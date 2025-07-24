export interface RequestedItem {
  id: string
  name?: string // For backward compatibility
  description?: string // For backward compatibility
  nameKey?: string // For i18n support
  descriptionKey?: string // For i18n support
  price: number
  status: 'pending_hotel' | 'confirmed'
  includesHotels: boolean
  agent?: string // Agent who sold the service (name or "Online")
  commission?: number // Commission amount
}

export interface RequestedItemsData {
  extras: RequestedItem[]
  upsell: RequestedItem[]
  atributos: RequestedItem[]
}

export const requestedItemsData: RequestedItemsData = {
  extras: [
    {
      id: "e1",
      name: "Early Check In",
      description: "Check-in desde las 12:00",
      price: 25,
      status: "pending_hotel",
      includesHotels: true,
      agent: "María García",
      commission: 2.5
    },
    {
      id: "e2",
      name: "Late Checkout",
      description: "Check-out hasta las 14:00",
      price: 30,
      status: "confirmed",
      includesHotels: true,
      agent: "Online",
      commission: 3.0
    },
    {
      id: "e3",
      name: "Cuna bebé",
      description: "Cuna para bebé con ropa de cama",
      price: 15,
      status: "pending_hotel",
      includesHotels: true,
      agent: "Carlos López",
      commission: 1.5
    }
  ],
  upsell: [
    {
      id: "u1",
      name: "Superior Room Upgrade",
      description: "Vista al mar, balcón privado",
      price: 355,
      status: "confirmed",
      includesHotels: true,
      agent: "Online",
      commission: 35.5
    },
    {
      id: "u2",
      name: "Paquete Romántico",
      description: "Botella de cava, pétalos de rosa, desayuno en habitación",
      price: 95,
      status: "pending_hotel",
      includesHotels: false,
      agent: "María García",
      commission: 9.5
    }
  ],
  atributos: [
    {
      id: "a1",
      name: "Habitación Tranquila",
      description: "Alejada de ascensores y zonas comunes",
      price: 0,
      status: "confirmed",
      includesHotels: true,
      agent: "Online",
      commission: 0
    },
    {
      id: "a2",
      name: "Piso Alto",
      description: "Plantas 8-12 con mejores vistas",
      price: 45,
      status: "pending_hotel",
      includesHotels: true,
      agent: "Ana Rodríguez",
      commission: 4.5
    },
    {
      id: "a3",
      name: "Cerca del Spa",
      description: "Acceso directo a zona wellness",
      price: 35,
      status: "pending_hotel",
      includesHotels: true,
      agent: "María García",
      commission: 3.5
    }
  ]
}