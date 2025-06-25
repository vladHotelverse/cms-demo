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
    callCenter: "Call Center",
    frontDeskUpsell: "Front Desk Upsell",
    gestionSolicitudesVentas: "Gestión Solicitudes",
    analiticaVentas: "Analítica Ventas",
    usuariosYComisiones: "Usuarios y Comisiones",
    hotelverseBeach: "Hotelverse Beach",
    hotel: "Hotel",
    mapa: "Mapa",
    gestion: "Gestión",
    gestionSolicitudesGestion: "Gestión Solicitudes",
    contenido: "Contenido",
    informacion: "Información",
    instalaciones: "Instalaciones",
    habitaciones: "Habitaciones",
    atributos: "Atributos",
    extrasContenido: "Extras",
    experiencias: "Experiencias",
    recomendaciones: "Recomendaciones",
    precios: "Precios",
    precioHabitacion: "Precio de Habitación",
    upselling: "Upselling",
    extrasPrecios: "Extras",
    commissions: "Commissions",
    discounts: "Discounts",
    segmentos: "Segmentos",
    hotelTitle: "Hotel",

    // Page titles
    welcomeToHotelverse: "Bienvenido a Hotelverse CMS",
    quickStats: "Estadísticas Rápidas",
    recentActivity: "Actividad Reciente",
    systemStatus: "Estado del Sistema",
    overviewText: "Resumen de tu sistema de gestión hotelera",
    latestUpdates: "Últimas actualizaciones y cambios",
    allSystemsOperational: "Todos los sistemas operativos",

    // Call Center page
    chooseYourRoom: "Elige tu habitación",
    createNewRequest: "Crea tu nueva solicitud en un solo clic",
    hotel: "Hotel",
    segment: "Segmento",
    select: "Seleccionar",
    cancel: "Cancelar",
    start: "Empezar",
    dashboard: "Dashboard",
    dashboardComingSoon: "Funcionalidad del dashboard próximamente...",
    pleaseSelectHotel: "Por favor selecciona un hotel",
    startingFlowFor: "Iniciando flujo para hotel:",

    // Front Desk Upsell page
    frontDeskUpsell: "Front Desk Upsell",
    gestionSolicitudes: "Gestión Solicitudes",
    showingReservations: "Mostrando reservas con fecha de entrada hoy y los próximos 15 días",
    reservations: "reservas",
    locator: "Locator",
    guest: "Huésped",
    checkIn: "Check-in",
    checkOut: "Check-out",
    status: "Estado",
    previousClient: "Cliente Anterior",
    new: "Nuevo",
    canceled: "Cancelado",
    noReservationsFound: "No se encontraron reservas que coincidan con la búsqueda",
    assignUpsell: "Asignar Upsell",
    selectStaffMember: "Seleccionar miembro del staff",
    upsellAssignedTo: "Upsell asignado a",
    for: "para",
    pleaseSelectStaff: "Por favor selecciona un miembro del staff",
    requestManagementComingSoon: "Funcionalidad de gestión de solicitudes próximamente...",

    // Atributos page
    atributosManagement: "Gestión de Atributos",
    equipmentCategories: "Categorías de Equipamiento",
    translations: "Traducciones",

    // Addons pages
    addonsManagement: "Gestión de Addons",
    createAddon: "Crear Addon",
    addonsBands: "Bandas de Addons",
    addBand: "Agregar Banda",
    addonsPricing: "Precios de Addons (Extras)",

    // Calendar page
    calendarManagement: "Gestión de Calendario",
    yearCalendar: "Calendario Anual",
    exceptions: "Excepciones",

    // Reservation modal
    reservationInformation: "Información de tu reserva",
    reservationCode: "Código de reserva",
    stayDates: "Fechas de estancia",
    roomType: "Tipo habitación",
    viewAsListBlocks: "Ver como lista/bloques",
    segment: "Segmento",
    agent: "Agente",
    list: "Lista",
    blocks: "Bloques",
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
    gestionSolicitudesGestion: "Request Management",
    contenido: "Content",
    informacion: "Information",
    instalaciones: "Facilities",
    habitaciones: "Rooms",
    atributos: "Attributes",
    extrasContenido: "Extras",
    experiencias: "Experiences",
    recomendaciones: "Recommendations",
    precios: "Prices",
    precioHabitacion: "Room Price",
    upselling: "Upselling",
    extrasPrecios: "Extras",
    commissions: "Commissions",
    discounts: "Discounts",
    segmentos: "Segments",
    hotelTitle: "Hotel Info",

    // Page titles
    welcomeToHotelverse: "Welcome to Hotelverse CMS",
    quickStats: "Quick Stats",
    recentActivity: "Recent Activity",
    systemStatus: "System Status",
    overviewText: "Overview of your hotel management system",
    latestUpdates: "Latest updates and changes",
    allSystemsOperational: "All systems operational",

    // Call Center page
    chooseYourRoom: "Choose your room",
    createNewRequest: "Create your new request in one click",
    hotel: "Hotel",
    segment: "Segment",
    select: "Select",
    cancel: "Cancel",
    start: "Start",
    dashboard: "Dashboard",
    dashboardComingSoon: "Dashboard functionality coming soon...",
    pleaseSelectHotel: "Please select a hotel",
    startingFlowFor: "Starting flow for hotel:",

    // Front Desk Upsell page
    frontDeskUpsell: "Front Desk Upsell",
    gestionSolicitudes: "Request Management",
    showingReservations: "Showing reservations with check-in date today and next 15 days",
    reservations: "reservations",
    locator: "Locator",
    guest: "Guest",
    checkIn: "Check-in",
    checkOut: "Check-out",
    status: "Status",
    previousClient: "Previous Client",
    new: "New",
    canceled: "Canceled",
    noReservationsFound: "No reservations found matching the search",
    assignUpsell: "Assign Upsell",
    selectStaffMember: "Select staff member",
    upsellAssignedTo: "Upsell assigned to",
    for: "for",
    pleaseSelectStaff: "Please select a staff member",
    requestManagementComingSoon: "Request management functionality coming soon...",

    // Atributos page
    atributosManagement: "Attributes Management",
    equipmentCategories: "Equipment Categories",
    translations: "Translations",

    // Addons pages
    addonsManagement: "Addons Management",
    createAddon: "Create Addon",
    addonsBands: "Addons Bands",
    addBand: "Add Band",
    addonsPricing: "Addons Pricing (Extras)",

    // Calendar page
    calendarManagement: "Calendar Management",
    yearCalendar: "Year Calendar",
    exceptions: "Exceptions",

    // Reservation modal
    reservationInformation: "Your reservation information",
    reservationCode: "Reservation code",
    stayDates: "Stay dates",
    roomType: "Room type",
    viewAsListBlocks: "View as list/blocks",
    segment: "Segment",
    agent: "Agent",
    list: "List",
    blocks: "Blocks",
  },
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [currentLanguage, setCurrentLanguage] = useState<Language>("es")

  const setLanguage = (language: Language) => {
    setCurrentLanguage(language)
  }

  const toggleLanguage = () => {
    setCurrentLanguage((prevLang) => (prevLang === "es" ? "en" : "es"))
  }

  const t = (key: string): string => {
    return translations[currentLanguage][key as keyof (typeof translations)[Language]] || key
  }

  return (
    <LanguageContext.Provider value={{ currentLanguage, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
