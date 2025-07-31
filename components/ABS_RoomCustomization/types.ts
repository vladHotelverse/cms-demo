export interface CustomizationOption {
  id: string
  icon?: string
  label: string
  description?: string
  price: number
  availability?: string
}

export interface ViewOption {
  id: string
  label: string
  description?: string
  price: number
  imageUrl?: string
}

export interface ExactViewOption {
  id: string
  name: string
  description?: string
  price: number
  icon: string
  imageUrl: string
  availability?: string
}

export interface SelectedCustomizations {
  [key: string]: { id: string; label: string; price: number } | undefined
}

// New types for compatibility system
export interface CompatibilityRule {
  option: string
  disables: string[]
  reason?: string
}

export interface MutuallyExclusiveGroup {
  options: string[]
  reason?: string
}

export interface CompatibilityRules {
  mutuallyExclusive: MutuallyExclusiveGroup[]
  conflicts: CompatibilityRule[]
}

export interface DisabledOptions {
  [optionId: string]: {
    disabled: boolean
    reason: string
    conflictsWith: string[]
  }
}

export interface ConflictResolution {
  type: 'mutually_exclusive' | 'logical_conflict'
  currentOption: { id: string; label: string; category: string }
  conflictingOption: { id: string; label: string; category: string }
  reason: string
}

export interface SectionConfig {
  key: string
  title: string
  icon?: React.ComponentType<{ className?: string }>
  infoText?: string
  hasModal?: boolean
  hasFeatures?: boolean
}

export interface RoomCustomizationTexts {
  improveText: string
  selectedText: string
  selectText: string
  pricePerNightText: string
  featuresText: string
  understood: string
  addForPriceText: string
  availableOptionsText: string
  removeText: string
  showMoreText: string
  showLessText: string
  // New texts for compatibility system
  optionDisabledText: string
  conflictWithText: string
  keepCurrentText: string
  switchToNewText: string
  conflictDialogTitle: string
  conflictDialogDescription: string
}

export interface RoomCustomizationProps {
  className?: string
  id?: string
  title: string
  subtitle: string
  sections: SectionConfig[]
  sectionOptions: Record<string, CustomizationOption[] | ViewOption[] | ExactViewOption[]>
  initialSelections?: SelectedCustomizations
  onCustomizationChange?: (category: string, optionId: string, optionLabel: string, optionPrice: number) => void
  texts: RoomCustomizationTexts
  fallbackImageUrl?: string
  compatibilityRules?: CompatibilityRules
  mode?: 'interactive' | 'consultation'
  readonly?: boolean
}
