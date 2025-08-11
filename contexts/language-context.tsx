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


