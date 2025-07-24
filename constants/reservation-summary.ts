// Image URLs
export const IMAGES = {
  roomUpgrade: {
    main: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&h=600&fit=crop&crop=center',
    terrace: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&h=600&fit=crop&crop=center',
    oceanView: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=800&h=600&fit=crop&crop=center'
  },
  upperFloor: {
    room: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&h=600&fit=crop&crop=center',
    cityView: 'https://images.unsplash.com/photo-1514214246283-d427a95c5d2f?w=800&h=600&fit=crop&crop=center',
    exclusive: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop&crop=center'
  },
  wellness: {
    spa: 'https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=800&h=600&fit=crop&crop=center',
    massage: 'https://images.unsplash.com/photo-1596178060671-7a80dc8059ea?w=800&h=600&fit=crop&crop=center',
    yoga: 'https://images.unsplash.com/photo-1599447421416-3414500d18a5?w=800&h=600&fit=crop&crop=center'
  },
  business: {
    meetingRoom: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop&crop=center',
    businessCenter: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&h=600&fit=crop&crop=center',
    workspace: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&h=600&fit=crop&crop=center'
  },
  romantic: {
    dinner: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop&crop=center',
    champagne: 'https://images.unsplash.com/photo-1558642891-54be180ea339?w=800&h=600&fit=crop&crop=center',
    roses: 'https://images.unsplash.com/photo-1522936643032-5f3cde4cad06?w=800&h=600&fit=crop&crop=center'
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