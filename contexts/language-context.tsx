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
    analiticaVentas: "Analítica de Ventas",
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

    // Toast messages and notifications
    bandUpdated: "Banda actualizada",
    bandCreated: "Banda creada",
    bandDeleted: "Banda eliminada",
    addonUpdated: "Addon actualizado",
    addonCreated: "Addon creado",
    addonDeleted: "Addon eliminado",
    changesSaved: "Cambios guardados",
    changesDiscarded: "Cambios descartados",
    translationsSaved: "Traducciones guardadas",
    equipmentAdded: "Equipamiento agregado",
    exceptionAdded: "Excepción agregada",
    exceptionRemoved: "Excepción eliminada",
    itemAdded: "Elemento agregado",
    itemRemoved: "Elemento eliminado",
    pricingUpdated: "Precios actualizados",

    // Error messages
    somethingWentWrong: "Algo salió mal",
    unexpectedErrorMessage: "Encontramos un error inesperado. Por favor intenta recargar la página o contacta soporte si el problema persiste.",
    errorDetails: "Detalles del Error",
    unexpectedErrorOccurred: "Ocurrió un error inesperado",
    tryAgain: "Intentar de nuevo",
    reloadPage: "Recargar página",
    goHome: "Ir al inicio",
    show: "Mostrar",
    hide: "Ocultar",
    technicalDetails: "Detalles técnicos",
    errorStack: "Stack del error:",
    componentStack: "Stack de componentes:",
    error: "Error",

    // Form validation messages
    validationError: "Error de validación",
    fixErrorsBeforeSaving: "Por favor corrige los errores antes de guardar",
    success: "Éxito",
    addonUpdatedSuccessfully: "Addon actualizado exitosamente",
    addonCreatedSuccessfully: "Addon creado exitosamente",
    failedToSaveAddon: "Error al guardar addon. Por favor intenta de nuevo",
    addonDeletedSuccessfully: "Addon eliminado exitosamente",
    failedToDeleteAddon: "Error al eliminar addon. Por favor intenta de nuevo",
    editAddon: "Editar Addon",
    createNewAddon: "Crear Nuevo Addon",
    basicInformation: "Información Básica",
    configureBasicAddonDetails: "Configura los detalles básicos del addon",
    enterAddonName: "Ingresa el nombre del addon",
    enterAddonDescription: "Ingresa la descripción del addon",
    selectACategory: "Selecciona una categoría",
    imageUrl: "URL de Imagen",
    editBand: "Editar Banda",
    addBand: "Agregar Banda",
    bandName: "Nombre de la banda",
    bandDescription: "Descripción de la banda",

    // Form labels and placeholders
    name: "Nombre",
    description: "Descripción",
    type: "Tipo",
    category: "Categoría",
    language: "Idioma",
    selectCategory: "Seleccionar categoría",
    selectLanguage: "Seleccionar idioma",
    selectType: "Seleccionar tipo",
    selectItemType: "Seleccionar tipo de elemento",
    selectStartMonth: "Seleccionar mes de inicio",
    selectEndMonth: "Seleccionar mes final",
    selectBand: "Seleccionar banda",
    selectDate: "Seleccionar fecha",
    selectReason: "Seleccionar motivo...",
    addonName: "Nombre del addon",
    addonDescription: "Descripción del addon",
    bandName: "Nombre de la banda",
    bandDescription: "Descripción de la banda",
    exceptionName: "Nombre de la excepción",
    nameOfException: "Nombre de la excepción",
    enterTranslation: "Introducir traducción",
    addNotes: "Agregar notas sobre este elemento",

    // Button labels
    create: "Crear",
    update: "Actualizar",
    edit: "Editar",
    delete: "Eliminar",
    save: "Guardar",
    cancel: "Cancelar",
    confirm: "Confirmar",
    add: "Agregar",
    remove: "Eliminar",
    reset: "Restablecer",
    close: "Cerrar",
    clear: "Limpiar",

    // Tab labels
    general: "General",
    translations: "Traducciones",
    media: "Medios",
    bands: "Bandas",
    calendar: "Calendario",
    categories: "Categorías",
    bandPricing: "Precios de Bandas",
    calendarBands: "Bandas del Calendario",

    // Status and validation messages
    missingRequiredFields: "Faltan campos obligatorios",
    pleaseSelectReason: "Por favor selecciona un motivo",
    bookingConfirmedSuccessfully: "Reserva confirmada exitosamente",
    fillAllRequiredFields: "Por favor completa todos los campos obligatorios",
    missingLink: "Falta enlace",
    provideLinkForExperience: "Por favor proporciona un enlace para la experiencia",
    missingEmail: "Falta email",
    provideNotificationEmail: "Por favor proporciona al menos un email de notificación",
    invalidDateRange: "Rango de fechas inválido",
    fromMonthBeforeToMonth: "El mes de inicio debe ser anterior o igual al mes final",
    calendarExceptionRemoved: "La excepción del calendario ha sido eliminada",
    exceptionsHaveBeenSaved: "Tus excepciones han sido guardadas exitosamente",
    exceptionChangesReset: "Tus cambios de excepción han sido restablecidos",
    calendarItemRemoved: "El elemento del calendario ha sido eliminado",

    // Common UI elements
    unknown: "Desconocido",
    none: "Ninguno",
    optional: "Opcional",
    required: "Obligatorio",
    loading: "Cargando",
    search: "Buscar",
    filter: "Filtrar",
    sort: "Ordenar",
    ascending: "Ascendente",
    descending: "Descendente",

    // Data types and categories
    extra: "Extra",
    experience: "Experiencia",
    standard: "Estándar",
    premium: "Premium",
    luxury: "Lujo",
    business: "Negocios",
    family: "Familia",

    // Room types
    standardRoom: "Habitación Estándar",
    deluxeDoubleRoom: "Habitación Doble Deluxe",
    suite: "Suite",
    premiumRoom: "Habitación Premium",
    familyRoom: "Habitación Familiar",

    // Commission reasons
    upsellServices: "Servicios de Upsell",
    roomUpgrade: "Mejora de Habitación",
    extendedStay: "Estancia Extendida",
    additionalServices: "Servicios Adicionales",
    specialPackage: "Paquete Especial",
    loyaltyProgramBenefits: "Beneficios del Programa de Lealtad",

    // Equipment categories
    bathroom: "Baño",
    bedroom: "Dormitorio",
    kitchen: "Cocina",
    livingRoom: "Sala de Estar",
    outdoor: "Exterior",
    amenities: "Amenidades",

    // Addon categories
    wellness: "Bienestar",
    activities: "Actividades",
    transportation: "Transporte",
    dining: "Gastronomía",
    roomAmenities: "Amenidades de Habitación",
    businessServices: "Servicios de Negocios",

    // Equipment items
    towels: "Toallas",
    hairdryer: "Secador de Pelo",
    toiletries: "Artículos de Tocador",
    pillows: "Almohadas",
    blankets: "Mantas",
    tvRemote: "Control Remoto de TV",
    microwave: "Microondas",
    coffeeMaker: "Cafetera",
    utensils: "Utensilios",
    sofa: "Sofá",
    smartTv: "TV Inteligente",
    patioFurniture: "Muebles de Patio",
    bbqGrill: "Parrilla BBQ",
    gymAccessCard: "Tarjeta de Acceso al Gimnasio",
    swimmingPoolKey: "Llave de la Piscina",
    bathrobes: "Batas de Baño",
    slippers: "Pantuflas",
    safe: "Caja Fuerte",
    miniBar: "Mini Bar",
    deskLamp: "Lámpara de Escritorio",

    // Exception types
    cleaning: "Limpieza",
    maintenance: "Mantenimiento",
    inspection: "Inspección",
    specialEvent: "Evento Especial",
    staffMeeting: "Reunión de Personal",

    // Months
    january: "Enero",
    february: "Febrero",
    march: "Marzo",
    april: "Abril",
    may: "Mayo",
    june: "Junio",
    july: "Julio",
    august: "Agosto",
    september: "Septiembre",
    october: "Octubre",
    november: "Noviembre",
    december: "Diciembre",

    // Days of week
    monday: "Lunes",
    tuesday: "Martes",
    wednesday: "Miércoles",
    thursday: "Jueves",
    friday: "Viernes",
    saturday: "Sábado",
    sunday: "Domingo",

    // Theme toggle
    light: "Claro",
    dark: "Oscuro",
    system: "Sistema",

    // Reservation modal specific
    configuration: "Configuración",
    viewAs: "Ver como:",
    availableServices: "Servicios Disponibles",
    servicesTablesWillBeDisplayed: "Aquí se mostrarán las tablas de servicios y extras disponibles",
    priceSummary: "Resumen de Precios",
    baseRoom: "Habitación base",
    extraServices: "Servicios extras",
    total: "Total",
    confirmBooking: "Confirmar Reserva",
    commissionReason: "Motivo de la Comisión",
    pleaseSelectCommissionReason: "Por favor selecciona el motivo de la comisión antes de continuar",

    // Sample data - Hotels
    hotelPlayaDelCarmen: "Hotel Playa del Carmen",
    hotelCancunBeach: "Hotel Cancún Beach",
    hotelRivieraMaya: "Hotel Riviera Maya",
    hotelTulumParadise: "Hotel Tulum Paradise",

    // Sample data - Addons
    spaTreatment: "Tratamiento de Spa",
    spaTreatmentDesc: "Tratamiento de spa relajante con terapeutas profesionales",
    airportTransfer: "Traslado al Aeropuerto",
    airportTransferDesc: "Traslado privado desde/hacia el aeropuerto",
    breakfastInRoom: "Desayuno en la Habitación",
    breakfastInRoomDesc: "Disfrute de un delicioso desayuno en la comodidad de su habitación",
    laundryService: "Servicio de Lavandería",
    laundryServiceDesc: "Servicio profesional de lavandería y planchado",
    roomDecoration: "Decoración de Habitación",
    roomDecorationDesc: "Decoración especial para celebraciones",
    cityTour: "Tour por la Ciudad",
    cityTourDesc: "Tour guiado por las principales atracciones de la ciudad",
    wineTasting: "Cata de Vinos",
    wineTastingDesc: "Experiencia exclusiva de cata de vinos con sumilleres locales",

    // Band descriptions
    basicAddonsPackage: "Paquete básico de addons para habitaciones estándar",
    enhancedAddonsPackage: "Paquete mejorado de addons para habitaciones premium con servicios adicionales",
    comprehensiveAddonsPackage: "Paquete completo de addons para suites de lujo con beneficios exclusivos",
    specializedAddonsPackage:
      "Paquete especializado de addons para viajeros de negocios con servicios relacionados al trabajo",
    familyFriendlyAddonsPackage: "Paquete de addons familiar con actividades y servicios para niños",

    // Success messages with dynamic content
    successfullyUpdatedBand: "Banda actualizada exitosamente",
    successfullyCreatedBand: "Banda creada exitosamente",
    successfullyDeletedBand: "Banda eliminada exitosamente",
    successfullyUpdatedAddon: "Addon actualizado exitosamente",
    successfullyCreatedAddon: "Addon creado exitosamente",
    successfullyDeletedAddon: "Addon eliminado exitosamente",
    successfullySavedTranslations: "Traducciones guardadas exitosamente para",
    translationChangesReset: "Tus cambios de traducción han sido restablecidos",

    // Counts and statistics
    band: "banda",
    bands: "bandas",
    addon: "addon",
    addons: "addons",
    item: "elemento",
    items: "elementos",
    email: "email",
    emails: "emails",
    hasLink: "Tiene enlace",

    // Sales analytics
    analiticaVentas: "Analítica de Ventas",
    revenue: "Ingresos",
    management: "Gestión",
    commission: "Comisión",
    today: "Hoy",
    thisWeek: "Esta Semana",
    thisMonth: "Este Mes",
    lastMonth: "Mes Pasado",
    thisYear: "Este Año",
    allAgents: "Todos los Agentes",
    allProducts: "Todos los Productos",
    product: "Producto",
    roomNumber: "Número de Habitación",
    extras: "Extras",
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

    // Toast messages and notifications
    bandUpdated: "Band updated",
    bandCreated: "Band created",
    bandDeleted: "Band deleted",
    addonUpdated: "Addon updated",
    addonCreated: "Addon created",
    addonDeleted: "Addon deleted",
    changesSaved: "Changes saved",
    changesDiscarded: "Changes discarded",
    translationsSaved: "Translations saved",
    equipmentAdded: "Equipment added",
    exceptionAdded: "Exception added",
    exceptionRemoved: "Exception removed",
    itemAdded: "Item added",
    itemRemoved: "Item removed",
    pricingUpdated: "Pricing updated",

    // Error messages
    somethingWentWrong: "Something went wrong",
    unexpectedErrorMessage: "We encountered an unexpected error. Please try refreshing the page or contact support if the problem persists.",
    errorDetails: "Error Details",
    unexpectedErrorOccurred: "An unexpected error occurred",
    tryAgain: "Try Again",
    reloadPage: "Reload Page",
    goHome: "Go Home",
    show: "Show",
    hide: "Hide",
    technicalDetails: "Technical Details",
    errorStack: "Error Stack:",
    componentStack: "Component Stack:",
    error: "Error",

    // Form validation messages
    validationError: "Validation Error",
    fixErrorsBeforeSaving: "Please fix the errors before saving.",
    success: "Success",
    addonUpdatedSuccessfully: "Addon updated successfully.",
    addonCreatedSuccessfully: "Addon created successfully.",
    failedToSaveAddon: "Failed to save addon. Please try again.",
    addonDeletedSuccessfully: "Addon deleted successfully.",
    failedToDeleteAddon: "Failed to delete addon. Please try again.",
    editAddon: "Edit Addon",
    createNewAddon: "Create New Addon",
    basicInformation: "Basic Information",
    configureBasicAddonDetails: "Configure the basic addon details",
    enterAddonName: "Enter addon name",
    enterAddonDescription: "Enter addon description",
    selectACategory: "Select a category",
    imageUrl: "Image URL",
    editBand: "Edit Band",
    addBand: "Add Band",
    bandName: "Band name",
    bandDescription: "Band description",

    // Form labels and placeholders
    name: "Name",
    description: "Description",
    type: "Type",
    category: "Category",
    language: "Language",
    selectCategory: "Select a category",
    selectLanguage: "Select language",
    selectType: "Select type",
    selectItemType: "Select item type",
    selectStartMonth: "Select start month",
    selectEndMonth: "Select end month",
    selectBand: "Select band",
    selectDate: "Select date",
    selectReason: "Select reason...",
    addonName: "Addon name",
    addonDescription: "Addon description",
    bandName: "Band name",
    bandDescription: "Band description",
    exceptionName: "Exception name",
    nameOfException: "Name of exception",
    enterTranslation: "Enter translation",
    addNotes: "Add notes about this item",

    // Button labels
    create: "Create",
    update: "Update",
    edit: "Edit",
    delete: "Delete",
    save: "Save",
    cancel: "Cancel",
    confirm: "Confirm",
    add: "Add",
    remove: "Remove",
    reset: "Reset",
    close: "Close",
    clear: "Clear",

    // Tab labels
    general: "General",
    translations: "Translations",
    media: "Media",
    bands: "Bands",
    calendar: "Calendar",
    categories: "Categories",
    bandPricing: "Band Pricing",
    calendarBands: "Calendar Bands",

    // Status and validation messages
    missingRequiredFields: "Missing required fields",
    pleaseSelectReason: "Please select a reason",
    bookingConfirmedSuccessfully: "Booking confirmed successfully",
    fillAllRequiredFields: "Please fill in all required fields",
    missingLink: "Missing link",
    provideLinkForExperience: "Please provide a link for the experience",
    missingEmail: "Missing email",
    provideNotificationEmail: "Please provide at least one notification email",
    invalidDateRange: "Invalid date range",
    fromMonthBeforeToMonth: "From month must be before or equal to To month",
    calendarExceptionRemoved: "Calendar exception has been removed",
    exceptionsHaveBeenSaved: "Your exceptions have been saved successfully",
    exceptionChangesReset: "Your exception changes have been reset",
    calendarItemRemoved: "Calendar item has been removed",

    // Common UI elements
    unknown: "Unknown",
    none: "None",
    optional: "Optional",
    required: "Required",
    loading: "Loading",
    search: "Search",
    filter: "Filter",
    sort: "Sort",
    ascending: "Ascending",
    descending: "Descending",

    // Data types and categories
    extra: "Extra",
    experience: "Experience",
    standard: "Standard",
    premium: "Premium",
    luxury: "Luxury",
    business: "Business",
    family: "Family",

    // Room types
    standardRoom: "Standard Room",
    deluxeDoubleRoom: "Deluxe Double Room",
    suite: "Suite",
    premiumRoom: "Premium Room",
    familyRoom: "Family Room",

    // Commission reasons
    upsellServices: "Upsell Services",
    roomUpgrade: "Room Upgrade",
    extendedStay: "Extended Stay",
    additionalServices: "Additional Services",
    specialPackage: "Special Package",
    loyaltyProgramBenefits: "Loyalty Program Benefits",

    // Equipment categories
    bathroom: "Bathroom",
    bedroom: "Bedroom",
    kitchen: "Kitchen",
    livingRoom: "Living Room",
    outdoor: "Outdoor",
    amenities: "Amenities",

    // Addon categories
    wellness: "Wellness",
    activities: "Activities",
    transportation: "Transportation",
    dining: "Dining",
    roomAmenities: "Room Amenities",
    businessServices: "Business Services",

    // Equipment items
    towels: "Towels",
    hairdryer: "Hairdryer",
    toiletries: "Toiletries",
    pillows: "Pillows",
    blankets: "Blankets",
    tvRemote: "TV Remote",
    microwave: "Microwave",
    coffeeMaker: "Coffee Maker",
    utensils: "Utensils",
    sofa: "Sofa",
    smartTv: "Smart TV",
    patioFurniture: "Patio Furniture",
    bbqGrill: "BBQ Grill",
    gymAccessCard: "Gym Access Card",
    swimmingPoolKey: "Swimming Pool Key",
    bathrobes: "Bathrobes",
    slippers: "Slippers",
    safe: "Safe",
    miniBar: "Mini Bar",
    deskLamp: "Desk Lamp",

    // Exception types
    cleaning: "Cleaning",
    maintenance: "Maintenance",
    inspection: "Inspection",
    specialEvent: "Special Event",
    staffMeeting: "Staff Meeting",

    // Months
    january: "January",
    february: "February",
    march: "March",
    april: "April",
    may: "May",
    june: "June",
    july: "July",
    august: "August",
    september: "September",
    october: "October",
    november: "November",
    december: "December",

    // Days of week
    monday: "Monday",
    tuesday: "Tuesday",
    wednesday: "Wednesday",
    thursday: "Thursday",
    friday: "Friday",
    saturday: "Saturday",
    sunday: "Sunday",

    // Theme toggle
    light: "Light",
    dark: "Dark",
    system: "System",

    // Reservation modal specific
    configuration: "Configuration",
    viewAs: "View as:",
    availableServices: "Available Services",
    servicesTablesWillBeDisplayed: "Here will be displayed the tables of available services and extras",
    priceSummary: "Price Summary",
    baseRoom: "Base room",
    extraServices: "Extra services",
    total: "Total",
    confirmBooking: "Confirm Booking",
    commissionReason: "Commission Reason",
    pleaseSelectCommissionReason: "Please select the commission reason before continuing",

    // Sample data - Hotels
    hotelPlayaDelCarmen: "Hotel Playa del Carmen",
    hotelCancunBeach: "Hotel Cancún Beach",
    hotelRivieraMaya: "Hotel Riviera Maya",
    hotelTulumParadise: "Hotel Tulum Paradise",

    // Sample data - Addons
    spaTreatment: "Spa Treatment",
    spaTreatmentDesc: "Relaxing spa treatment with professional therapists",
    airportTransfer: "Airport Transfer",
    airportTransferDesc: "Private transfer from/to the airport",
    breakfastInRoom: "Breakfast in Room",
    breakfastInRoomDesc: "Enjoy a delicious breakfast in the comfort of your room",
    laundryService: "Laundry Service",
    laundryServiceDesc: "Professional laundry and ironing service",
    roomDecoration: "Room Decoration",
    roomDecorationDesc: "Special decoration for celebrations",
    cityTour: "City Tour",
    cityTourDesc: "Guided tour around the city's main attractions",
    wineTasting: "Wine Tasting",
    wineTastingDesc: "Exclusive wine tasting experience with local sommeliers",

    // Band descriptions
    basicAddonsPackage: "Basic addons package for standard rooms",
    enhancedAddonsPackage: "Enhanced addons package for premium rooms with additional services",
    comprehensiveAddonsPackage: "Comprehensive addons package for luxury suites with exclusive benefits",
    specializedAddonsPackage: "Specialized addons package for business travelers with work-related services",
    familyFriendlyAddonsPackage: "Family-friendly addons package with activities and services for children",

    // Success messages with dynamic content
    successfullyUpdatedBand: "Successfully updated band",
    successfullyCreatedBand: "Successfully created band",
    successfullyDeletedBand: "Successfully deleted band",
    successfullyUpdatedAddon: "Successfully updated addon",
    successfullyCreatedAddon: "Successfully created addon",
    successfullyDeletedAddon: "Successfully deleted addon",
    successfullySavedTranslations: "Successfully saved translations for",
    translationChangesReset: "Your translation changes have been reset",

    // Counts and statistics
    band: "band",
    bands: "bands",
    addon: "addon",
    addons: "addons",
    item: "item",
    items: "items",
    email: "email",
    emails: "emails",
    hasLink: "Has link",

    // Sales analytics
    analiticaVentas: "Sales Analytics",
    revenue: "Revenue",
    management: "Management",
    commission: "Commission",
    today: "Today",
    thisWeek: "This Week",
    thisMonth: "This Month",
    lastMonth: "Last Month",
    thisYear: "This Year",
    allAgents: "All Agents",
    allProducts: "All Products",
    product: "Product",
    roomNumber: "Room Number",
    extras: "Extras",
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
