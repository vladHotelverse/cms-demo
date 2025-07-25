import type { CompatibilityRules, DisabledOptions, SelectedCustomizations, ConflictResolution } from './types'

// Default compatibility rules for room customization options
export const defaultCompatibilityRules: CompatibilityRules = {
  mutuallyExclusive: [
    {
      options: ['garden-access', 'pool-access', 'beach-access'],
      reason: 'Only one access type can be selected'
    },
    {
      options: ['ground-floor', 'upper-floor'],
      reason: 'Only one floor preference can be selected'
    },
    {
      options: ['afternoon-sun', 'all-day-sun'],
      reason: 'Only one sun orientation can be selected'
    },
    {
      options: ['city-view', 'garden-view', 'lateral-sea-view', 'pool-view', 'sea-frontal-view', 'stage-view'],
      reason: 'Only one view type can be selected'
    },
    {
      options: ['twin', 'king', 'sofa'],
      reason: 'Only one bed configuration can be selected'
    }
  ],
  conflicts: [
    {
      option: 'garden-access',
      disables: ['all-day-sun', 'pool', 'beach-access', 'pool-view', 'sea-frontal-view'],
      reason: 'Garden access conflicts with pool/beach areas and sea views'
    },
    {
      option: 'pool-access',
      disables: ['garden-access', 'quiet-zone', 'beach-access'],
      reason: 'Pool access conflicts with garden access, quiet zones, and beach access'
    },
    {
      option: 'beach-access',
      disables: ['garden-access', 'pool-access', 'quiet-zone', 'city-view', 'garden-view'],
      reason: 'Beach access conflicts with garden/pool access and inland views'
    },
    {
      option: 'ground-floor',
      disables: ['sea-frontal-view', 'best-views', 'upper-floor'],
      reason: 'Ground floor rooms cannot have elevated sea views'
    },
    {
      option: 'upper-floor',
      disables: ['ground-floor', 'garden-access'],
      reason: 'Upper floors conflict with ground floor access to gardens'
    },
    {
      option: 'quiet-zone',
      disables: ['pool', 'stage-view', 'pool-access'],
      reason: 'Quiet zones are away from pool and entertainment areas'
    },
    {
      option: 'stage-view',
      disables: ['quiet-zone', 'sea-frontal-view'],
      reason: 'Stage view rooms are in entertainment areas, not quiet zones'
    },
    {
      option: 'connecting-room',
      disables: ['adapted-room'],
      reason: 'Connecting rooms may not be available as adapted rooms'
    },
    {
      option: 'best-views',
      disables: ['ground-floor', 'city-view'],
      reason: 'Best views are typically from upper floors with premium vistas'
    }
  ]
}

// Rule evaluation engine
export class CompatibilityEngine {
  private rules: CompatibilityRules

  constructor(rules: CompatibilityRules = defaultCompatibilityRules) {
    this.rules = rules
  }

  /**
   * Evaluate which options should be disabled based on current selections
   */
  evaluateDisabledOptions(selectedOptions: SelectedCustomizations): DisabledOptions {
    const disabled: DisabledOptions = {}
    const selectedOptionIds = new Set(
      Object.values(selectedOptions)
        .filter(Boolean)
        .map(selection => selection!.id)
    )

    // Check mutually exclusive groups
    for (const group of this.rules.mutuallyExclusive) {
      const selectedInGroup = group.options.find(opt => selectedOptionIds.has(opt))
      
      if (selectedInGroup) {
        // Find the category of the selected option
        const selectedCategory = this.findOptionCategory(selectedInGroup, selectedOptions)
        
        // Skip mutual exclusivity for exact views
        if (selectedCategory === 'vistaExacta') {
          continue
        }
        
        for (const option of group.options) {
          if (option !== selectedInGroup) {
            disabled[option] = {
              disabled: true,
              reason: group.reason || 'Mutually exclusive option selected',
              conflictsWith: [selectedInGroup]
            }
          }
        }
      }
    }

    // Check logical conflicts
    for (const selectedId of selectedOptionIds) {
      const conflictRule = this.rules.conflicts.find(rule => rule.option === selectedId)
      
      if (conflictRule) {
        for (const disabledOption of conflictRule.disables) {
          disabled[disabledOption] = {
            disabled: true,
            reason: conflictRule.reason || `Conflicts with ${selectedId}`,
            conflictsWith: [selectedId]
          }
        }
      }
    }

    return disabled
  }

  /**
   * Check if selecting a new option would create conflicts
   */
  checkForConflicts(
    newOptionId: string, 
    newOptionCategory: string,
    selectedOptions: SelectedCustomizations,
    sectionOptions: Record<string, any[]>
  ): ConflictResolution | null {
    const selectedOptionIds = new Set(
      Object.values(selectedOptions)
        .filter(Boolean)
        .map(selection => selection!.id)
    )

    // Check mutually exclusive conflicts
    for (const group of this.rules.mutuallyExclusive) {
      if (group.options.includes(newOptionId)) {
        // Skip mutual exclusivity for exact views - they can have multiple selections
        if (newOptionCategory === 'vistaExacta') {
          continue
        }
        
        const conflictingOption = group.options.find(opt => 
          opt !== newOptionId && selectedOptionIds.has(opt)
        )
        
        if (conflictingOption) {
          const conflictingCategory = this.findOptionCategory(conflictingOption, selectedOptions)
          
          // Skip mutual exclusivity if the conflicting option is also an exact view
          if (conflictingCategory === 'vistaExacta') {
            continue
          }
          
          const conflictingOptionDetails = this.findOptionDetails(conflictingOption, sectionOptions)
          const newOptionDetails = this.findOptionDetails(newOptionId, sectionOptions)
          
          if (conflictingCategory && conflictingOptionDetails && newOptionDetails) {
            return {
              type: 'mutually_exclusive',
              currentOption: {
                id: conflictingOption,
                label: conflictingOptionDetails.label || conflictingOptionDetails.name,
                category: conflictingCategory
              },
              conflictingOption: {
                id: newOptionId,
                label: newOptionDetails.label || newOptionDetails.name,
                category: newOptionCategory
              },
              reason: group.reason || 'These options are mutually exclusive'
            }
          }
        }
      }
    }

    // Check logical conflicts
    const conflictRule = this.rules.conflicts.find(rule => rule.option === newOptionId)
    if (conflictRule) {
      for (const disabledOption of conflictRule.disables) {
        if (selectedOptionIds.has(disabledOption)) {
          const conflictingCategory = this.findOptionCategory(disabledOption, selectedOptions)
          const conflictingOptionDetails = this.findOptionDetails(disabledOption, sectionOptions)
          const newOptionDetails = this.findOptionDetails(newOptionId, sectionOptions)
          
          if (conflictingCategory && conflictingOptionDetails && newOptionDetails) {
            return {
              type: 'logical_conflict',
              currentOption: {
                id: disabledOption,
                label: conflictingOptionDetails.label || conflictingOptionDetails.name,
                category: conflictingCategory
              },
              conflictingOption: {
                id: newOptionId,
                label: newOptionDetails.label || newOptionDetails.name,
                category: newOptionCategory
              },
              reason: conflictRule.reason || `${newOptionId} conflicts with ${disabledOption}`
            }
          }
        }
      }
    }

    // Check reverse conflicts (if current selections disable the new option)
    for (const selectedId of selectedOptionIds) {
      const selectedConflictRule = this.rules.conflicts.find(rule => rule.option === selectedId)
      if (selectedConflictRule && selectedConflictRule.disables.includes(newOptionId)) {
        const conflictingCategory = this.findOptionCategory(selectedId, selectedOptions)
        const conflictingOptionDetails = this.findOptionDetails(selectedId, sectionOptions)
        const newOptionDetails = this.findOptionDetails(newOptionId, sectionOptions)
        
        if (conflictingCategory && conflictingOptionDetails && newOptionDetails) {
          return {
            type: 'logical_conflict',
            currentOption: {
              id: selectedId,
              label: conflictingOptionDetails.label || conflictingOptionDetails.name,
              category: conflictingCategory
            },
            conflictingOption: {
              id: newOptionId,
              label: newOptionDetails.label || newOptionDetails.name,
              category: newOptionCategory
            },
            reason: selectedConflictRule.reason || `${selectedId} conflicts with ${newOptionId}`
          }
        }
      }
    }

    return null
  }

  /**
   * Resolve conflicts by removing conflicting options
   */
  resolveConflicts(
    newOptionId: string,
    newOptionCategory: string,
    selectedOptions: SelectedCustomizations,
    removeConflicting: boolean = true
  ): SelectedCustomizations {
    if (!removeConflicting) return selectedOptions

    const newSelections = { ...selectedOptions }
    const selectedOptionIds = new Set(
      Object.values(selectedOptions)
        .filter(Boolean)
        .map(selection => selection!.id)
    )

    // Remove mutually exclusive options
    for (const group of this.rules.mutuallyExclusive) {
      if (group.options.includes(newOptionId)) {
        // Skip mutual exclusivity for exact views
        if (newOptionCategory === 'vistaExacta') {
          continue
        }
        
        for (const option of group.options) {
          if (option !== newOptionId && selectedOptionIds.has(option)) {
            const categoryToRemove = this.findOptionCategory(option, selectedOptions)
            
            // Skip removing if the conflicting option is also an exact view
            if (categoryToRemove === 'vistaExacta') {
              continue
            }
            
            if (categoryToRemove) {
              delete newSelections[categoryToRemove]
            }
          }
        }
      }
    }

    // Remove logically conflicting options
    const conflictRule = this.rules.conflicts.find(rule => rule.option === newOptionId)
    if (conflictRule) {
      for (const disabledOption of conflictRule.disables) {
        if (selectedOptionIds.has(disabledOption)) {
          const categoryToRemove = this.findOptionCategory(disabledOption, selectedOptions)
          if (categoryToRemove) {
            delete newSelections[categoryToRemove]
          }
        }
      }
    }

    return newSelections
  }

  private findOptionCategory(optionId: string, selectedOptions: SelectedCustomizations): string | null {
    for (const [category, selection] of Object.entries(selectedOptions)) {
      if (selection?.id === optionId) {
        return category
      }
    }
    return null
  }

  private findOptionDetails(optionId: string, sectionOptions: Record<string, any[]>): any | null {
    for (const options of Object.values(sectionOptions)) {
      const option = options.find(opt => opt.id === optionId)
      if (option) return option
    }
    return null
  }
} 