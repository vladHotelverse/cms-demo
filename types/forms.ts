/**
 * Form-related type definitions
 */

import { ReactNode } from 'react'
import { FieldError, SelectOption } from './common'

/**
 * Form field base properties
 */
export interface BaseFormFieldProps {
  name: string
  label: string
  required?: boolean
  disabled?: boolean
  error?: string
  description?: string
  className?: string
}

/**
 * Input field types
 */
export type InputType = 
  | 'text'
  | 'email'
  | 'password'
  | 'url'
  | 'tel'
  | 'number'
  | 'search'

/**
 * Form field variants
 */
export type FormFieldVariant = 
  | 'input'
  | 'textarea'
  | 'select'
  | 'checkbox'
  | 'radio'
  | 'switch'
  | 'file'
  | 'date'
  | 'time'
  | 'datetime'

/**
 * Form validation rule
 */
export interface ValidationRule {
  required?: boolean | string
  minLength?: number | { value: number; message: string }
  maxLength?: number | { value: number; message: string }
  min?: number | { value: number; message: string }
  max?: number | { value: number; message: string }
  pattern?: RegExp | { value: RegExp; message: string }
  validate?: (value: any) => boolean | string
}

/**
 * Form field configuration
 */
export interface FormFieldConfig extends BaseFormFieldProps {
  type: FormFieldVariant
  inputType?: InputType
  placeholder?: string
  options?: SelectOption[]
  multiple?: boolean
  rows?: number
  validation?: ValidationRule
  defaultValue?: any
  render?: (props: any) => ReactNode
}

/**
 * Form configuration
 */
export interface FormConfig {
  fields: FormFieldConfig[]
  onSubmit: (data: any) => void | Promise<void>
  onCancel?: () => void
  onDelete?: () => void
  submitLabel?: string
  cancelLabel?: string
  deleteLabel?: string
  showDelete?: boolean
  isLoading?: boolean
  defaultValues?: Record<string, any>
  validation?: 'onChange' | 'onBlur' | 'onSubmit'
}

/**
 * Form state
 */
export interface FormState {
  values: Record<string, any>
  errors: Record<string, string>
  touched: Record<string, boolean>
  isSubmitting: boolean
  isValid: boolean
  isDirty: boolean
}

/**
 * Form actions
 */
export interface FormActions {
  setValue: (name: string, value: any) => void
  setError: (name: string, error: string) => void
  clearError: (name: string) => void
  setTouched: (name: string, touched: boolean) => void
  reset: (values?: Record<string, any>) => void
  submit: () => void
  validate: (name?: string) => boolean
}

/**
 * Form context type
 */
export interface FormContextType extends FormState, FormActions {
  config: FormConfig
}

/**
 * Form step for multi-step forms
 */
export interface FormStep {
  id: string
  title: string
  description?: string
  fields: string[]
  validation?: (values: Record<string, any>) => Record<string, string>
  isValid?: (values: Record<string, any>) => boolean
}

/**
 * Multi-step form configuration
 */
export interface MultiStepFormConfig extends Omit<FormConfig, 'fields'> {
  steps: FormStep[]
  fields: FormFieldConfig[]
  currentStep: number
  onStepChange?: (step: number) => void
  showStepIndicator?: boolean
  allowStepNavigation?: boolean
}

/**
 * Form submission result
 */
export interface FormSubmissionResult {
  success: boolean
  data?: any
  errors?: FieldError[]
  message?: string
}

/**
 * Dynamic form field
 */
export interface DynamicFormField extends FormFieldConfig {
  condition?: (values: Record<string, any>) => boolean
  dependencies?: string[]
}

/**
 * Form section
 */
export interface FormSection {
  id: string
  title: string
  description?: string
  fields: string[]
  collapsible?: boolean
  defaultExpanded?: boolean
  variant?: 'card' | 'simple'
}

/**
 * Advanced form configuration with sections
 */
export interface AdvancedFormConfig extends FormConfig {
  sections?: FormSection[]
  layout?: 'single-column' | 'two-column' | 'grid'
  spacing?: 'compact' | 'normal' | 'relaxed'
}
