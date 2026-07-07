import type {
  CustomizationOption,
  RoomType,
  SpecialOffer,
  TranslationMap,
} from '@/hooks/useSupabaseContent'

const now = new Date().toISOString()

export const mockRoomTypes: RoomType[] = [
  {
    id: 'room-supreme-luxury',
    room_code: 'supreme-luxury',
    title: {
      en: 'Supreme luxury with divine views',
      es: 'Lujo supremo con vistas divinas',
    },
    description: {
      en: 'Our contemporary Hard Rock Ibiza Suites perfectly capture the authenticity and irreverence of rock n roll.',
      es: 'Nuestras suites contemporáneas Hard Rock Ibiza capturan perfectamente la autenticidad e irreverencia del rock and roll.',
    },
    base_price: 89,
    main_image:
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
    ],
    amenities: [
      '24 Hours Room Service',
      'Balcony',
      'Landmark View',
      'Coffee Machine',
      'King Size Bed',
    ],
    capacity: 2,
    size_sqm: 60,
    room_type: 'ROCK SUITE',
    rating: 4.8,
    active: true,
    sort_order: 1,
    created_at: now,
    updated_at: now,
  },
  {
    id: 'room-80s-nostalgia',
    room_code: '80s-nostalgia',
    title: {
      en: '80s nostalgia unleashed',
      es: 'Nostalgia de los 80 desatada',
    },
    description: {
      en: '60 square-meter space with bold colors, vibrant pop music, and vintage decor.',
      es: 'Espacio de 60 metros cuadrados con colores vibrantes, música pop y decoración vintage.',
    },
    base_price: 120,
    main_image:
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
    ],
    amenities: [
      'Coffee Machine',
      'King Size Bed',
      '80s Themed Decor',
      'Music System',
      'City View',
    ],
    capacity: 2,
    size_sqm: 60,
    room_type: '80S SUITE',
    rating: 4.7,
    active: true,
    sort_order: 2,
    created_at: now,
    updated_at: now,
  },
  {
    id: 'room-deluxe-double',
    room_code: 'deluxe-double',
    title: {
      en: 'Deluxe Double Room with Balcony',
      es: 'Habitación Doble Deluxe con Balcón',
    },
    description: {
      en: 'Spacious double room with private balcony and partial ocean view.',
      es: 'Amplia habitación doble con balcón privado y vista parcial al mar.',
    },
    base_price: 75,
    main_image:
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop',
    ],
    amenities: ['Balcony', 'Ocean View', 'Mini Bar', 'WiFi'],
    capacity: 2,
    size_sqm: 45,
    room_type: 'DELUXE',
    rating: 4.5,
    active: true,
    sort_order: 3,
    created_at: now,
    updated_at: now,
  },
]

export const mockCustomizationOptions: CustomizationOption[] = [
  {
    id: 'custom-twin-beds',
    option_code: 'twin-beds',
    category: 'Beds',
    name: { en: '2 x Twin Beds', es: '2 x Camas Individuales' },
    description: {
      en: 'Two separate single beds',
      es: 'Dos camas individuales separadas',
    },
    price: 0,
    price_type: 'per_night',
    popular: false,
    active: true,
    sort_order: 1,
    created_at: now,
    updated_at: now,
  },
  {
    id: 'custom-king-bed',
    option_code: 'king-bed',
    category: 'Beds',
    name: { en: 'King Size Bed', es: 'Cama King Size' },
    description: {
      en: 'One extra-large king-sized bed',
      es: 'Una cama king extra grande',
    },
    price: 5,
    price_type: 'per_night',
    popular: true,
    active: true,
    sort_order: 2,
    created_at: now,
    updated_at: now,
  },
  {
    id: 'custom-sofa-bed',
    option_code: 'sofa-bed',
    category: 'Beds',
    name: { en: 'Sofa Bed - Single', es: 'Sofá Cama - Individual' },
    description: {
      en: 'Single sofa bed for additional sleeping space',
      es: 'Sofá cama individual para espacio de descanso adicional',
    },
    price: 2,
    price_type: 'per_night',
    popular: false,
    active: true,
    sort_order: 3,
    created_at: now,
    updated_at: now,
  },
  {
    id: 'custom-high-floor',
    option_code: 'high-floor',
    category: 'Room Features',
    name: { en: 'High Floor', es: 'Planta Alta' },
    description: {
      en: 'Room located on a higher floor with better views',
      es: 'Habitación en planta alta con mejores vistas',
    },
    price: 15,
    price_type: 'per_night',
    popular: true,
    active: true,
    sort_order: 4,
    created_at: now,
    updated_at: now,
  },
  {
    id: 'custom-quiet-room',
    option_code: 'quiet-room',
    category: 'Room Features',
    name: { en: 'Quiet Room', es: 'Habitación Tranquila' },
    description: {
      en: 'Room away from elevators and high-traffic areas',
      es: 'Habitación alejada de ascensores y zonas de paso',
    },
    price: 0,
    price_type: 'per_stay',
    popular: false,
    active: true,
    sort_order: 5,
    created_at: now,
    updated_at: now,
  },
]

export const mockSpecialOffers: SpecialOffer[] = [
  {
    id: 'offer-all-inclusive',
    offer_code: 'all-inclusive',
    title: { en: 'All inclusive package', es: 'Paquete todo incluido' },
    description: {
      en: 'Enjoy unlimited access to all amenities, meals and beverages.',
      es: 'Disfruta acceso ilimitado a todas las comodidades, comidas y bebidas.',
    },
    image:
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&h=300&fit=crop',
    price: 50,
    price_type: 'per_person',
    requires_date_selection: false,
    allows_multiple_dates: false,
    max_quantity: 10,
    popular: true,
    active: true,
    sort_order: 1,
    created_at: now,
    updated_at: now,
  },
  {
    id: 'offer-spa-access',
    offer_code: 'spa-access',
    title: { en: 'Spa Access', es: 'Acceso al Spa' },
    description: {
      en: 'Enjoy a day of relaxation at our luxury spa.',
      es: 'Disfruta de un día de relajación en nuestro spa de lujo.',
    },
    image:
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=400&h=300&fit=crop',
    price: 50,
    price_type: 'per_person',
    requires_date_selection: true,
    allows_multiple_dates: false,
    max_quantity: 4,
    popular: false,
    active: true,
    sort_order: 2,
    created_at: now,
    updated_at: now,
  },
  {
    id: 'offer-airport-transfer',
    offer_code: 'airport-transfer',
    title: { en: 'Airport Transfer', es: 'Traslado al Aeropuerto' },
    description: {
      en: 'Convenient transportation to and from the airport.',
      es: 'Transporte conveniente hacia y desde el aeropuerto.',
    },
    image:
      'https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=400&h=300&fit=crop',
    price: 35,
    price_type: 'per_person',
    requires_date_selection: false,
    allows_multiple_dates: false,
    max_quantity: 6,
    popular: false,
    active: true,
    sort_order: 3,
    created_at: now,
    updated_at: now,
  },
]

const translationEntries: Array<{ key: string; en: string; es: string }> = [
  { key: 'chooseYourSuperiorRoomLabel', en: 'Choose your Superior Room!', es: '¡Elige tu Habitación Superior!' },
  { key: 'customizeYourStayTitle', en: 'Customize Your Stay', es: 'Personaliza tu Estancia' },
  { key: 'enhanceYourStayLabel', en: 'Enhance your stay', es: 'Mejora tu estancia' },
  { key: 'selectRoomDescription', en: 'Choose from our selection of premium rooms and suites', es: 'Elige de nuestra selección de habitaciones y suites premium' },
  { key: 'bookNow', en: 'Book Now', es: 'Reservar Ahora' },
  { key: 'select', en: 'UPGRADE NOW', es: 'MEJORAR AHORA' },
  { key: 'learnMore', en: 'Learn More', es: 'Saber Más' },
  { key: 'selected', en: 'Selected', es: 'Seleccionado' },
  { key: 'perNight', en: 'night', es: 'noche' },
  { key: 'upgradeNow', en: 'UPGRADE NOW', es: 'MEJORAR AHORA' },
  { key: 'remove', en: 'Remove', es: 'Eliminar' },
  { key: 'noRoomsAvailable', en: 'No rooms available', es: 'No hay habitaciones disponibles' },
  { key: 'instantConfirmation', en: 'Instant Confirmation', es: 'Confirmación Instantánea' },
  { key: 'commission', en: 'Commission', es: 'Comisión' },
  { key: 'total', en: 'Total', es: 'Total' },
  { key: 'popular', en: 'Popular', es: 'Popular' },
  { key: 'perStay', en: 'per stay', es: 'por estancia' },
  { key: 'perPerson', en: 'per person', es: 'por persona' },
]

export function getMockTranslations(language: string): TranslationMap {
  const map: TranslationMap = {}
  for (const entry of translationEntries) {
    map[entry.key] = language === 'es' ? entry.es : entry.en
  }
  return map
}
