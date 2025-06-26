/**
 * Validation schemas and utilities
 * Centralized export for all validation schemas
 */

export * from './addon'

/**
 * Common validation utilities
 */
import { z } from 'zod'
import { VALIDATION_RULES } from '@/constants'

/**
 * Common field schemas that can be reused across different forms
 */
export const commonSchemas = {
  email: z.string()
    .email('Invalid email format')
    .max(VALIDATION_RULES.email.maxLength, 'Email is too long'),
  
  name: z.string()
    .min(VALIDATION_RULES.name.minLength, 'Name must be at least 2 characters')
    .max(VALIDATION_RULES.name.maxLength, 'Name must be less than 100 characters'),
  
  description: z.string()
    .max(VALIDATION_RULES.description.maxLength, 'Description must be less than 500 characters')
    .optional(),
  
  url: z.string()
    .regex(VALIDATION_RULES.url.pattern, 'Invalid URL format')
    .optional()
    .or(z.literal('')),
  
  id: z.string().min(1, 'ID is required'),
  
  optionalId: z.string().optional(),
  
  requiredString: z.string().min(1, 'This field is required'),
  
  optionalString: z.string().optional()
}

/**
 * Validation result type
 */
export type ValidationResult<T> = {
  success: boolean
  data?: T
  errors?: string[]
}

/**
 * Generic validation helper
 */
export const validateData = <T>(
  schema: z.ZodSchema<T>,
  data: unknown
): ValidationResult<T> => {
  const result = schema.safeParse(data)
  
  if (result.success) {
    return {
      success: true,
      data: result.data
    }
  }
  
  return {
    success: false,
    errors: result.error.errors.map(err => err.message)
  }
}

