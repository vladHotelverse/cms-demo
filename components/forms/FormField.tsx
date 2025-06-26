/**
 * Reusable form field component with consistent styling and error handling
 */
import React from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { cn } from '@/lib/utils'

interface BaseFormFieldProps {
  label: string
  name: string
  error?: string
  required?: boolean
  disabled?: boolean
  className?: string
  description?: string
}

interface InputFormFieldProps extends BaseFormFieldProps {
  type: 'text' | 'email' | 'url' | 'password'
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

interface TextareaFormFieldProps extends BaseFormFieldProps {
  type: 'textarea'
  value: string
  onChange: (value: string) => void
  placeholder?: string
  rows?: number
}

interface SelectFormFieldProps extends BaseFormFieldProps {
  type: 'select'
  value: string
  onChange: (value: string) => void
  options: Array<{ value: string; label: string }>
  placeholder?: string
}

type FormFieldProps = InputFormFieldProps | TextareaFormFieldProps | SelectFormFieldProps

/**
 * FormField component that handles different input types with consistent styling
 */
export const FormField: React.FC<FormFieldProps> = (props) => {
  const { label, name, error, required, disabled, className, description } = props

  const renderInput = () => {
    switch (props.type) {
      case 'textarea':
        return (
          <Textarea
            id={name}
            name={name}
            value={props.value}
            onChange={(e) => props.onChange(e.target.value)}
            placeholder={props.placeholder}
            disabled={disabled}
            rows={props.rows || 3}
            className={cn(error && 'border-red-500 focus:border-red-500')}
          />
        )
      
      case 'select':
        return (
          <Select
            value={props.value}
            onValueChange={props.onChange}
            disabled={disabled}
          >
            <SelectTrigger className={cn(error && 'border-red-500 focus:border-red-500')}>
              <SelectValue placeholder={props.placeholder} />
            </SelectTrigger>
            <SelectContent>
              {props.options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )
      
      default:
        return (
          <Input
            id={name}
            name={name}
            type={props.type}
            value={props.value}
            onChange={(e) => props.onChange(e.target.value)}
            placeholder={props.placeholder}
            disabled={disabled}
            className={cn(error && 'border-red-500 focus:border-red-500')}
          />
        )
    }
  }

  return (
    <div className={cn('space-y-2', className)}>
      <Label htmlFor={name} className="text-sm font-medium">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
      {renderInput()}
      {error && (
        <p className="text-sm text-red-500 mt-1">{error}</p>
      )}
    </div>
  )
}

/**
 * FormField with memo for performance optimization
 */
export default React.memo(FormField)

