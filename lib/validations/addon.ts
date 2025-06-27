import { z } from 'zod'
import { VALIDATION_RULES } from '@/constants'

/**
 * Addon translation schema
 */
const addonTranslationSchema = z.object({
  name: z.string()
    .min(VALIDATION_RULES.name.minLength, 'Name must be at least 2 characters')
    .max(VALIDATION_RULES.name.maxLength, 'Name must be less than 100 characters'),
  description: z.string()
    .max(VALIDATION_RULES.description.maxLength, 'Description must be less than 500 characters')
    .optional()
})

/**
 * Base addon schema
 */
export const addonSchema = z.object({
  id: z.string().optional(),
  name: z.string()
    .min(VALIDATION_RULES.name.minLength, 'Name is required and must be at least 2 characters')
    .max(VALIDATION_RULES.name.maxLength, 'Name must be less than 100 characters'),
  description: z.string()
    .max(VALIDATION_RULES.description.maxLength, 'Description must be less than 500 characters'),
  type: z.enum(['extra', 'experience'], {
    required_error: 'Type is required'
  }),
  categoryId: z.string({
    required_error: 'Category is required'
  }).min(1, 'Category is required'),
  image: z.string().url('Invalid image URL').optional().or(z.literal('')),
  emails: z.array(z.string().email('Invalid email format')).optional(),
  link: z.string().url('Invalid URL format').optional().or(z.literal('')),
  translations: z.record(z.string(), addonTranslationSchema).optional()
})

/**
 * Schema for creating a new addon
 */
export const createAddonSchema = addonSchema.omit({ id: true })

/**
 * Schema for updating an existing addon
 */
export const updateAddonSchema = addonSchema.partial().extend({
  id: z.string().min(1, 'ID is required for updates')
})

/**
 * Schema for addon form data (allows partial data during form editing)
 */
export const addonFormSchema = addonSchema.partial().extend({
  name: z.string().min(1, 'Name is required'),
  type: z.enum(['extra', 'experience']),
  categoryId: z.string().min(1, 'Category is required')
})

/**
 * Type definitions derived from schemas
 */
export type Addon = z.infer<typeof addonSchema>
export type CreateAddonData = z.infer<typeof createAddonSchema>
export type UpdateAddonData = z.infer<typeof updateAddonSchema>
export type AddonFormData = z.infer<typeof addonFormSchema>
export type AddonTranslation = z.infer<typeof addonTranslationSchema>

/**
 * Validation helper functions
 */
export const validateAddon = (data: unknown) => {
  return addonSchema.safeParse(data)
}

export const validateAddonForm = (data: unknown) => {
  return addonFormSchema.safeParse(data)
}

export const validateCreateAddon = (data: unknown) => {
  return createAddonSchema.safeParse(data)
}

export const validateUpdateAddon = (data: unknown) => {
  return updateAddonSchema.safeParse(data)
}
