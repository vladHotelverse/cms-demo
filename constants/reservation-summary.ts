// Image URLs
export const IMAGES = {
  roomUpgrade: {
    main: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=120&h=80&fit=crop&crop=center',
    terrace: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=120&h=80&fit=crop&crop=center',
    oceanView: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=120&h=80&fit=crop&crop=center'
  },
  upperFloor: {
    room: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=120&h=80&fit=crop&crop=center',
    cityView: 'https://images.unsplash.com/photo-1561501900-3701fa6a0864?w=120&h=80&fit=crop&crop=center',
    exclusive: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=120&h=80&fit=crop&crop=center'
  },
  wellness: {
    spa: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=120&h=80&fit=crop&crop=center',
    massage: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=120&h=80&fit=crop&crop=center',
    yoga: 'https://images.unsplash.com/photo-1506629905607-21d4b4b3c8e5?w=120&h=80&fit=crop&crop=center'
  }
} as const

// Price configurations
export const COMMISSION_PERCENTAGE = 15

// Status configurations
export const STATUS_STYLES = {
  pending_hotel: {
    color: "bg-amber-50 text-amber-700 border-amber-200",
    dotColor: "bg-amber-400"
  },
  confirmed: {
    color: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dotColor: "bg-emerald-400"
  }
} as const

// Date formats
export const DEFAULT_DATE_RANGE = '19/07/2025 - 23/07/2025'
export const DEFAULT_NIGHTS = 4