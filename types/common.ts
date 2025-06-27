/**
 * Common type definitions used across the application
 */

/**
 * Base entity interface that all entities should extend
 */
export interface BaseEntity {
  id: string
  createdAt?: Date | string
  updatedAt?: Date | string
}

/**
 * API response wrapper
 */
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

/**
 * Pagination parameters
 */
export interface PaginationParams {
  page: number
  limit: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

/**
 * Paginated response
 */
export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

/**
 * Select option interface for form components
 */
export interface SelectOption {
  value: string
  label: string
  disabled?: boolean
  description?: string
}

/**
 * Form field error
 */
export interface FieldError {
  field: string
  message: string
}

/**
 * Loading states
 */
export type LoadingState = 'idle' | 'loading' | 'success' | 'error'

/**
 * Theme types
 */
export type Theme = 'light' | 'dark' | 'system'

/**
 * Language codes
 */
export type LanguageCode = 'es' | 'en' | 'fr' | 'de' | 'it' | 'pt' | 'zh' | 'ja' | 'ru'

/**
 * File upload types
 */
export interface FileUpload {
  file: File
  preview?: string
  progress?: number
  status: 'pending' | 'uploading' | 'success' | 'error'
  error?: string
}

/**
 * Modal state
 */
export interface ModalState {
  isOpen: boolean
  data?: any
}

/**
 * Table column definition
 */
export interface TableColumn<T = any> {
  key: keyof T | string
  label: string
  sortable?: boolean
  width?: string | number
  align?: 'left' | 'center' | 'right'
  render?: (value: any, row: T) => React.ReactNode
}

/**
 * Filter option
 */
export interface FilterOption {
  key: string
  label: string
  type: 'text' | 'select' | 'date' | 'number' | 'boolean'
  options?: SelectOption[]
  placeholder?: string
}

/**
 * Notification types
 */
export interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

/**
 * User permission types
 */
export type Permission = 
  | 'read'
  | 'write'
  | 'delete'
  | 'admin'

/**
 * User role types
 */
export type UserRole = 
  | 'guest'
  | 'user'
  | 'manager'
  | 'admin'
  | 'super_admin'

/**
 * Utility types
 */

/**
 * Make specific properties optional
 */
export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

/**
 * Make specific properties required
 */
export type RequiredBy<T, K extends keyof T> = T & Required<Pick<T, K>>

/**
 * Extract keys of a specific type
 */
export type KeysOfType<T, U> = {
  [K in keyof T]: T[K] extends U ? K : never
}[keyof T]

/**
 * Create a type with all properties optional except specified ones
 */
export type OptionalExcept<T, K extends keyof T> = Partial<T> & Pick<T, K>

/**
 * Deep partial type
 */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

/**
 * Non-empty array type
 */
export type NonEmptyArray<T> = [T, ...T[]]

/**
 * Branded type for type safety
 */
export type Brand<T, B> = T & { __brand: B }
