"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

export type Language = "es" | "en"

interface LanguageContextType {
  currentLanguage: Language
  setLanguage: (language: Language) => void
  toggleLanguage: () => void
  t: (key: string) => string
}

const translations = {
  es: {
    // Sidebar translations
    inicio: "Inicio",
    admin: "Admin",
    maestros: "Maestros",
    confPreciosIniciales: "Conf. Precios Iniciales",
    ventas: "Ventas",
    callCenter: "Centro de Llamadas",
    frontDeskUpsell: "Venta Adicional Recepción",
    gestionSolicitudesVentas: "Gestión Solicitudes",
    analiticaVentas: "Analítica de Ventas",
    usuariosYComisiones: "Usuarios y Comisiones",
    hotelverseBeach: "Hotelverse Beach",
    hotel: "Hotel",
    mapa: "Mapa",
    gestion: "Gestión",
    frontDesk: "Recepción",
    gestionSolicitudesGestion: "Gestión Solicitudes",
    contenido: "Contenido",

    // Basic translations for front desk
    reserved: "reservados",
    roomType: "Tipo de Habitación",
    checkIn: "Check-in",
    nights: "Noches",
    searchPlaceholder: "Buscar por localizador o nombre...",
    noReservationsFound: "No se encontraron reservas",
    frontDeskAgent: "Agente de Recepción",
    locator: "Localizador",
    guest: "Huésped",
    checkOut: "Check-out",
    status: "Estado",
    commission: "Comisión",
    night: "noche",
    recommendation: "recomendación",
    reservations: "reservas",
    
    // Page titles
    welcomeToHotelverse: "Bienvenido a Hotelverse CMS",
    quickStats: "Estadísticas Rápidas",
    recentActivity: "Actividad Reciente",
    systemStatus: "Estado del Sistema",
    overviewText: "Resumen general del sistema de gestión hotelera.",
    latestUpdates: "Últimas actualizaciones de reservas y solicitudes.",
    allSystemsOperational: "Todos los sistemas operativos (modo demo con datos mock).",
    precios: "Precios",
    informacion: "Información",
    hotelTitle: "Hotel",
    instalaciones: "Instalaciones",
    habitaciones: "Habitaciones",
    atributos: "Atributos",
    extrasContenido: "Extras",
    experiencias: "Experiencias",
    recomendaciones: "Recomendaciones",
    precioHabitacion: "Precio Habitación",
    upselling: "Upselling",
    extrasPrecios: "Extras",
    commissions: "Comisiones",
    discounts: "Descuentos",
    segmentos: "Segmentos",
    gestionSolicitudes: "Gestión Solicitudes",
    dashboard: "Panel",
    dashboardComingSoon: "Próximamente",
    requestManagementComingSoon: "Próximamente",
    salesAnalytics: "Analítica de Ventas",
    comprehensiveSalesDescription: "Métricas y rendimiento de ventas",
    refresh: "Actualizar",
    export: "Exportar",
    filters: "Filtros",

    // Front desk
    showingReservationsForDays: "Mostrando reservas de los próximos 7 días",
    viewAs: "Ver como:",
    configuration: "Configuración",
    recommend: "Recomendar",
    manageOrder: "Gestionar pedido",
    "Booking ID": "ID Reserva",
    extras: "Extras",
    aci: "A / C / I",
    aciTooltip: "Adultos / Niños / Bebés",
    loadingOrders: "Cargando reservas...",
    roomAssignments: "Asignación de habitaciones",
    monthlyPerformanceBreakdown: "Rendimiento mensual",
    monthlyPerformance: "Rendimiento mensual",
    activeAgents: "Agentes activos",
    avgConversion: "Conversión media",
    salesTeamMembers: "Miembros del equipo de ventas",
    improvement: "mejora",
    vsLastMonthShort: "vs mes anterior",
    selectHotelToContinue: "Selecciona un hotel para continuar",
    statusNew: "Nuevo",
    statusPending: "Pendiente",

    // Sales analytics
    pickADate: "Seleccionar fecha",
    agent: "Agente",
    product: "Producto",
    dateRange: "Rango de fechas",
    allAgents: "Todos los agentes",
    allProducts: "Todos los productos",
    roomUpsells: "Upselling habitaciones",
    absServices: "Servicios ABS",
    extraServices: "Servicios extra",
    today: "Hoy",
    thisWeek: "Esta semana",
    thisMonth: "Este mes",
    lastMonth: "Mes pasado",
    thisQuarter: "Este trimestre",
    thisYear: "Este año",
    revenue: "Ingresos",
    management: "Gestión",
    totalRequests: "Total solicitudes",
    totalRevenue: "Ingresos totales",
    averageRequest: "Solicitud media",
    totalUpgrades: "Total mejoras",
    vsLastMonth: "vs mes anterior",
    revenueGoal: "Objetivo ingresos",
    upsellGoal: "Objetivo upselling",
    targetAchievement: "Logro del objetivo",
    progress: "Progreso",

    // Calendar & content
    calendarManagement: "Gestión de calendario",
    yearCalendar: "Calendario anual",
    exceptions: "Excepciones",
    atributosManagement: "Gestión de atributos",
    equipmentCategories: "Categorías de equipamiento",
    translations: "Traducciones",

    // Addons
    addonsManagement: "Gestión de extras",
    createAddon: "Crear extra",
    addonsPricing: "Precios de extras",
    addonsBands: "Bandas de extras",
    addBand: "Añadir banda",
    basicAddonsPackage: "Paquete básico de extras",
    enhancedAddonsPackage: "Paquete mejorado de extras",
    comprehensiveAddonsPackage: "Paquete completo de extras",
    specializedAddonsPackage: "Paquete especializado de extras",
    familyFriendlyAddonsPackage: "Paquete familiar de extras",

    // Call center
    chooseYourRoom: "Elige tu habitación",
    createNewRequest: "Crear una nueva solicitud",
    segment: "Segmento",
    select: "Seleccionar",
    cancel: "Cancelar",
    start: "Iniciar",
    hotelPlayaDelCarmen: "Hotel Playa del Carmen",
    hotelCancunBeach: "Hotel Cancún Beach",
    hotelRivieraMaya: "Hotel Riviera Maya",
    hotelTulumParadise: "Hotel Tulum Paradise",
    standard: "Estándar",
    premium: "Premium",
    luxury: "Lujo",
    business: "Negocios",
    family: "Familia",
    pleaseSelectHotel: "Por favor selecciona un hotel",
    startingFlowFor: "Iniciando flujo para",
  },
  en: {
    // Sidebar translations
    inicio: "Home",
    admin: "Admin",
    maestros: "Masters",
    confPreciosIniciales: "Initial Price Config.",
    ventas: "Sales",
    callCenter: "Call Center",
    frontDeskUpsell: "Front Desk Upsell",
    gestionSolicitudesVentas: "Request Management",
    analiticaVentas: "Sales Analytics",
    usuariosYComisiones: "Users & Commissions",
    hotelverseBeach: "Hotelverse Beach",
    hotel: "Hotel",
    mapa: "Map",
    gestion: "Management",
    frontDesk: "Front Desk",
    gestionSolicitudesGestion: "Request Management",
    contenido: "Content",

    // Basic translations for front desk
    reserved: "reserved",
    roomType: "Room Type",
    checkIn: "Check-in",
    nights: "Nights",
    searchPlaceholder: "Search by locator or name...",
    noReservationsFound: "No reservations found",
    frontDeskAgent: "Front Desk Agent",
    locator: "Locator",
    guest: "Guest", 
    checkOut: "Check-out",
    status: "Status",
    commission: "Commission",
    night: "night",
    recommendation: "recommendation",
    reservations: "reservations",
    
    // Page titles
    welcomeToHotelverse: "Welcome to Hotelverse CMS",
    quickStats: "Quick Stats",
    recentActivity: "Recent Activity",
    systemStatus: "System Status",
    overviewText: "Overview of the hotel management system.",
    latestUpdates: "Latest updates from reservations and requests.",
    allSystemsOperational: "All systems operational (demo mode with mock data).",
    precios: "Pricing",
    informacion: "Information",
    hotelTitle: "Hotel",
    instalaciones: "Facilities",
    habitaciones: "Rooms",
    atributos: "Attributes",
    extrasContenido: "Extras",
    experiencias: "Experiences",
    recomendaciones: "Recommendations",
    precioHabitacion: "Room Pricing",
    upselling: "Upselling",
    extrasPrecios: "Extras Pricing",
    commissions: "Commissions",
    discounts: "Discounts",
    segmentos: "Segments",
    gestionSolicitudes: "Request Management",
    dashboard: "Dashboard",
    dashboardComingSoon: "Coming soon",
    requestManagementComingSoon: "Coming soon",
    salesAnalytics: "Sales Analytics",
    comprehensiveSalesDescription: "Sales metrics and performance",
    refresh: "Refresh",
    export: "Export",
    filters: "Filters",

    // Front desk
    showingReservationsForDays: "Showing reservations for the next 7 days",
    viewAs: "View as:",
    configuration: "Configuration",
    recommend: "Recommend",
    manageOrder: "Manage order",
    "Booking ID": "Booking ID",
    extras: "Extras",
    aci: "A / C / I",
    aciTooltip: "Adults / Children / Infants",
    loadingOrders: "Loading reservations...",
    roomAssignments: "Room assignments",
    monthlyPerformanceBreakdown: "Monthly performance breakdown",
    monthlyPerformance: "Monthly performance",
    activeAgents: "Active Agents",
    avgConversion: "Avg. Conversion",
    salesTeamMembers: "Sales team members",
    improvement: "improvement",
    vsLastMonthShort: "vs last month",
    selectHotelToContinue: "Select a hotel to continue",
    statusNew: "New",
    statusPending: "Pending",

    // Sales analytics
    pickADate: "Pick a date",
    agent: "Agent",
    product: "Product",
    dateRange: "Date Range",
    allAgents: "All agents",
    allProducts: "All products",
    roomUpsells: "Room upsells",
    absServices: "ABS services",
    extraServices: "Extra services",
    today: "Today",
    thisWeek: "This week",
    thisMonth: "This month",
    lastMonth: "Last month",
    thisQuarter: "This quarter",
    thisYear: "This year",
    revenue: "Revenue",
    management: "Management",
    totalRequests: "Total Requests",
    totalRevenue: "Total Revenue",
    averageRequest: "Average Request",
    totalUpgrades: "Total Upgrades",
    vsLastMonth: "vs last month",
    revenueGoal: "Revenue Goal",
    upsellGoal: "Upsell Goal",
    targetAchievement: "Target achievement",
    progress: "Progress",

    // Calendar & content
    calendarManagement: "Calendar Management",
    yearCalendar: "Year Calendar",
    exceptions: "Exceptions",
    atributosManagement: "Attributes Management",
    equipmentCategories: "Equipment Categories",
    translations: "Translations",

    // Addons
    addonsManagement: "Addons Management",
    createAddon: "Create Addon",
    addonsPricing: "Addons Pricing",
    addonsBands: "Addons Bands",
    addBand: "Add Band",
    basicAddonsPackage: "Basic addons package",
    enhancedAddonsPackage: "Enhanced addons package",
    comprehensiveAddonsPackage: "Comprehensive addons package",
    specializedAddonsPackage: "Specialized addons package",
    familyFriendlyAddonsPackage: "Family-friendly addons package",

    // Call center
    chooseYourRoom: "Choose Your Room",
    createNewRequest: "Create a new request",
    segment: "Segment",
    select: "Select",
    cancel: "Cancel",
    start: "Start",
    hotelPlayaDelCarmen: "Hotel Playa del Carmen",
    hotelCancunBeach: "Hotel Cancun Beach",
    hotelRivieraMaya: "Hotel Riviera Maya",
    hotelTulumParadise: "Hotel Tulum Paradise",
    standard: "Standard",
    premium: "Premium",
    luxury: "Luxury",
    business: "Business",
    family: "Family",
    pleaseSelectHotel: "Please select a hotel",
    startingFlowFor: "Starting flow for",
  }
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [currentLanguage, setCurrentLanguage] = useState<Language>("en")

  const setLanguage = (language: Language) => setCurrentLanguage(language)
  const toggleLanguage = () => setCurrentLanguage(prev => (prev === "es" ? "en" : "es"))

  const t = (key: string): string => {
    return translations[currentLanguage][key as keyof typeof translations[typeof currentLanguage]] || key
  }

  return (
    <LanguageContext.Provider value={{ currentLanguage, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) throw new Error("useLanguage must be used within a LanguageProvider")
  return context
}


