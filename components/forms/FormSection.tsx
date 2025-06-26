/**
 * Reusable form section component for organizing form fields
 */
import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

interface FormSectionProps {
  title: string
  description?: string
  children: React.ReactNode
  className?: string
  variant?: 'card' | 'simple'
  collapsible?: boolean
  defaultExpanded?: boolean
}

/**
 * FormSection component for organizing related form fields
 */
export const FormSection: React.FC<FormSectionProps> = ({
  title,
  description,
  children,
  className,
  variant = 'simple',
  collapsible = false,
  defaultExpanded = true
}) => {
  const [isExpanded, setIsExpanded] = React.useState(defaultExpanded)

  const handleToggle = () => {
    if (collapsible) {
      setIsExpanded(!isExpanded)
    }
  }

  const content = (
    <>
      <div 
        className={cn(
          'flex items-center justify-between',
          collapsible && 'cursor-pointer hover:opacity-80'
        )}
        onClick={handleToggle}
      >
        <div>
          <h3 className="text-lg font-semibold">{title}</h3>
          {description && (
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          )}
        </div>
        {collapsible && (
          <button
            type="button"
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label={isExpanded ? 'Collapse section' : 'Expand section'}
          >
            {isExpanded ? '−' : '+'}
          </button>
        )}
      </div>
      
      {(!collapsible || isExpanded) && (
        <>
          {variant === 'simple' && <Separator className="my-4" />}
          <div className="space-y-4">
            {children}
          </div>
        </>
      )}
    </>
  )

  if (variant === 'card') {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {children}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className={cn('space-y-4', className)}>
      {content}
    </div>
  )
}

/**
 * FormSection with memo for performance optimization
 */
export default React.memo(FormSection)
