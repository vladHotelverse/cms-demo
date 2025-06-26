/**
 * Centralized constants and configuration
 * Export all constants from a single entry point for easy importing
 */

export * from './addon-categories'
export * from './languages'

/**
 * Application-wide constants
 */
export const APP_CONFIG = {
  name: 'Hotel Management System',
  version: '1.0.0',
  defaultLanguage: 'es',
  defaultTheme: 'light',
  maxFileSize: 5 * 1024 * 1024, // 5MB
  supportedImageTypes: ['image/jpeg', 'image/png', 'image/webp'],
} as const

/**
 * Form validation constants
 */
export const VALIDATION_RULES = {
  email: {
    maxLength: 254,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },
  name: {
    minLength: 2,
    maxLength: 100
  },
  description: {
    maxLength: 500
  },
  url: {
    pattern: /^https?:\/\/.+/
  }
} as const

/**
 * UI constants
 */
export const UI_CONFIG = {
  sidebar: {
    width: 280,
    collapsedWidth: 60
  },
  breakpoints: {
    mobile: 768,
    tablet: 1024,
    desktop: 1280
  },
  animations: {
    duration: 200,
    easing: 'ease-in-out'
  }
} as const
