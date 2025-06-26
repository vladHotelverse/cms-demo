import { BaseEntity } from './common'

/**
 * @deprecated Use types from lib/validations/addon.ts instead
 * This interface is kept for backward compatibility
 */
export interface Addon extends BaseEntity {
  name: string
  description: string
  type: "extra" | "experience"
  categoryId: string
  image?: string
  // For type "extra"
  emails?: string[]
  // For type "experience"
  link?: string
  translations?: {
    [language: string]: {
      name: string
      description: string
    }
  }
}

// Re-export the new types for convenience
export type { 
  Addon as AddonNew,
  CreateAddonData,
  UpdateAddonData,
  AddonFormData,
  AddonTranslation
} from '../lib/validations/addon'
