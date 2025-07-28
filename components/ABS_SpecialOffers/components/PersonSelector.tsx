import type React from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select'
import type { OfferLabels } from '../types'

export interface PersonSelectorProps {
  value: number
  onChange: (value: number) => void
  maxPersons?: number
  disabled?: boolean
  labels: OfferLabels
  className?: string
}

const PersonSelector: React.FC<PersonSelectorProps> = ({
  value,
  onChange,
  maxPersons = 10,
  disabled = false,
  labels,
  className = '',
}) => {
  const options = Array.from({ length: maxPersons }, (_, i) => i + 1)

  const labelId = `person-selector-label-${Math.random().toString(36).substr(2, 9)}`

  return (
    <div className={`space-y-2 ${className}`}>
      <label htmlFor={`select-${labelId}`} id={labelId} className="text-sm font-medium text-neutral-700">
        {labels.numberOfPersons}
      </label>
      <Select value={value.toString()} onValueChange={(val) => onChange(Number(val))} disabled={disabled}>
        <SelectTrigger data-testid="person-selector" className="w-full" aria-labelledby={labelId}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((num) => (
            <SelectItem key={num} value={num.toString()}>
              {num} {num === 1 ? labels.personSingular : labels.personPlural}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

export default PersonSelector
