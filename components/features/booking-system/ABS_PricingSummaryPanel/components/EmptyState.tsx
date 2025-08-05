import clsx from 'clsx'
import { ArrowUpCircle } from 'lucide-react'
import type React from 'react'
import SectionCard from './SectionCard'
import type { AvailableSection } from '../types'

interface EmptyStateProps {
  availableActiveSections: AvailableSection[]
  emptyCartMessage: string
  exploreLabel: string
  fromLabel: string
  euroSuffix: string
  customizeStayTitle: string
  chooseOptionsSubtitle: string
}

const EmptyState: React.FC<EmptyStateProps> = ({
  availableActiveSections,
  emptyCartMessage,
  exploreLabel,
  fromLabel,
  euroSuffix,
  customizeStayTitle,
  chooseOptionsSubtitle,
}) => {
  if (availableActiveSections.length === 1) {
    // Single section - show icon
    return (
      <div className="text-center space-y-4">
        <div className="w-16 h-16 mx-auto bg-neutral-100 rounded-full flex items-center justify-center">
          <ArrowUpCircle className="w-8 h-8 text-neutral-400" />
        </div>
        <div className="space-y-2">
          <h3 className="text-base font-medium text-neutral-900">{customizeStayTitle}</h3>
          <p className="text-sm text-neutral-500 max-w-sm mx-auto">{emptyCartMessage}</p>
        </div>
      </div>
    )
  }

  // Default to multiple sections (or when no sections are available which defaults to the cards)
  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-base font-medium text-neutral-900 mb-2">{customizeStayTitle}</h3>
        <p className="text-sm text-neutral-500">{chooseOptionsSubtitle}</p>
      </div>
      <div className={clsx('grid gap-3 grid-cols-1')}>
        {availableActiveSections.map((section, index) => (
          <SectionCard
            key={`${section.type}-${index}`}
            section={section}
            exploreLabel={exploreLabel}
            fromLabel={fromLabel}
            euroSuffix={euroSuffix}
          />
        ))}
      </div>
    </div>
  )
}

export default EmptyState
