import { useCallback, useState, useMemo, useEffect } from 'react'
import type { 
  CustomizationOption, 
  SelectedCustomizations, 
  ViewOption, 
  ExactViewOption,
  CompatibilityRules,
  ConflictResolution
} from '../types'
import { CompatibilityEngine, defaultCompatibilityRules } from '../compatibilityRules'

interface UseCustomizationStateProps {
  initialSelections?: SelectedCustomizations
  sectionOptions: Record<string, CustomizationOption[] | ViewOption[] | ExactViewOption[]>
  onCustomizationChange?: (category: string, optionId: string, optionLabel: string, optionPrice: number) => void
  compatibilityRules?: CompatibilityRules
}

export const useCustomizationState = ({
  initialSelections = {},
  sectionOptions,
  onCustomizationChange,
  compatibilityRules = defaultCompatibilityRules,
}: UseCustomizationStateProps) => {
  const [selectedOptions, setSelectedOptions] = useState<SelectedCustomizations>(initialSelections)
  const [openSections, setOpenSections] = useState<Record<string, boolean>>(
    Object.fromEntries(Object.keys(sectionOptions).map((key) => [key, true]))
  )
  const [pendingConflict, setPendingConflict] = useState<ConflictResolution | null>(null)

  // Sync internal state when initialSelections changes (e.g., when removed from pricing panel)
  useEffect(() => {
    setSelectedOptions(initialSelections)
  }, [initialSelections])

  // Initialize compatibility engine
  const compatibilityEngine = useMemo(() => new CompatibilityEngine(compatibilityRules), [compatibilityRules])

  // Calculate disabled options based on current selections
  const disabledOptions = useMemo(() => 
    compatibilityEngine.evaluateDisabledOptions(selectedOptions), 
    [compatibilityEngine, selectedOptions]
  )

  const toggleSection = useCallback((sectionKey: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [sectionKey]: !prev[sectionKey],
    }))
  }, [])

  const handleSelect = useCallback(
    (category: string, optionId: string) => {
      const options = sectionOptions[category] as Array<CustomizationOption | ViewOption | ExactViewOption> | undefined
      const optionDetails = options?.find((o) => (o as any).id === optionId) as (CustomizationOption | ViewOption | ExactViewOption | undefined)

      if (!optionDetails) return

      const currentSelectedId = selectedOptions[category]?.id

      if (currentSelectedId === optionId) {
        // Deselect if already selected
        const newSelectedOptions = { ...selectedOptions }
        delete newSelectedOptions[category]
        setSelectedOptions(newSelectedOptions)
        onCustomizationChange?.(category, '', '', 0)
        return
      }

      // Check if option is disabled
      if (disabledOptions[optionId]?.disabled) {
        console.warn(`Option ${optionId} is disabled: ${disabledOptions[optionId].reason}`)
        return
      }

      // Check for conflicts before selecting
      const conflict = compatibilityEngine.checkForConflicts(
        optionId, 
        category, 
        selectedOptions, 
        sectionOptions
      )

      if (conflict) {
        setPendingConflict(conflict)
        return
      }

      // No conflicts, proceed with selection
      selectOption(category, optionId, optionDetails)
    },
    [selectedOptions, sectionOptions, onCustomizationChange, disabledOptions, compatibilityEngine]
  )

  const selectOption = useCallback((category: string, optionId: string, optionDetails: any) => {
    const optionLabel = 'label' in optionDetails ? optionDetails.label : optionDetails.name
    setSelectedOptions((prev) => ({
      ...prev,
      [category]: {
        id: optionId,
        label: optionLabel,
        price: optionDetails.price,
      },
    }))
    onCustomizationChange?.(category, optionId, optionLabel, optionDetails.price)
  }, [onCustomizationChange])

  const resolveConflict = useCallback(
    (keepNew: boolean) => {
      if (!pendingConflict) return

      const { conflictingOption } = pendingConflict
      const optArray = sectionOptions[conflictingOption.category] as Array<CustomizationOption | ViewOption | ExactViewOption> | undefined
      const optionDetails = optArray?.find(
        (o) => (o as any).id === conflictingOption.id
      ) as (CustomizationOption | ViewOption | ExactViewOption | undefined)

      if (!optionDetails) {
        setPendingConflict(null)
        return
      }

      if (keepNew) {
        // Remove conflicting options and select the new one
        const resolvedSelections = compatibilityEngine.resolveConflicts(
          conflictingOption.id,
          conflictingOption.category,
          selectedOptions,
          true
        )
        
        setSelectedOptions(resolvedSelections)
        
        // Select the new option
        selectOption(conflictingOption.category, conflictingOption.id, optionDetails)
      }

      setPendingConflict(null)
    },
    [pendingConflict, sectionOptions, selectedOptions, compatibilityEngine, selectOption]
  )

  const dismissConflict = useCallback(() => {
    setPendingConflict(null)
  }, [])

  const isOptionDisabled = useCallback(
    (optionId: string): boolean => {
      return disabledOptions[optionId]?.disabled || false
    },
    [disabledOptions]
  )

  const getDisabledReason = useCallback(
    (optionId: string): string | null => {
      return disabledOptions[optionId]?.reason || null
    },
    [disabledOptions]
  )

  const getConflictingOptions = useCallback(
    (optionId: string): string[] => {
      return disabledOptions[optionId]?.conflictsWith || []
    },
    [disabledOptions]
  )

  return {
    selectedOptions,
    openSections,
    disabledOptions,
    pendingConflict,
    toggleSection,
    handleSelect,
    resolveConflict,
    dismissConflict,
    isOptionDisabled,
    getDisabledReason,
    getConflictingOptions,
  }
}
