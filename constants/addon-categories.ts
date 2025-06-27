/**
 * Addon categories configuration
 * Centralized list of available addon categories for the hotel management system
 */
export interface AddonCategory {
  id: string
  name: string
  description?: string
}

export const ADDON_CATEGORIES: AddonCategory[] = [
  { id: "1", name: "Wellness & Spa", description: "Spa treatments, wellness packages, and relaxation services" },
  { id: "2", name: "Tours & Activities", description: "Guided tours, excursions, and recreational activities" },
  { id: "3", name: "Transportation", description: "Airport transfers, car rentals, and transportation services" },
  { id: "4", name: "Food & Beverage", description: "Dining experiences, room service, and beverage packages" },
  { id: "5", name: "Room Amenities", description: "Room upgrades, amenities, and comfort enhancements" },
  { id: "6", name: "Business Services", description: "Meeting rooms, business center, and professional services" },
]

/**
 * Get addon category by ID
 */
export const getAddonCategoryById = (id: string): AddonCategory | undefined => {
  return ADDON_CATEGORIES.find(category => category.id === id)
}

/**
 * Get addon category names for select options
 */
export const getAddonCategoryOptions = () => {
  return ADDON_CATEGORIES.map(category => ({
    value: category.id,
    label: category.name
  }))
}
