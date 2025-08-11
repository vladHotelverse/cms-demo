"use client"

import React, { useMemo, useCallback } from 'react'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { 
  CheckSquare, 
  Square, 
  ChevronDown, 
  Check, 
  X, 
  Trash2,
  Loader2,
  AlertTriangle
} from "lucide-react"
import { useReservationSummaryStore } from "@/stores/reservation-summary-store"
import { useReservationTranslations } from "@/hooks/use-reservation-translations"
import type { RequestedItemsData } from "@/data/reservation-items"

interface BulkActionsProps {
  category?: keyof RequestedItemsData | 'all'
  className?: string
}

export function BulkActions({ category = 'all', className }: BulkActionsProps) {
  const { t } = useReservationTranslations()
  const {
    selectedItems,
    requestedItems,
    asyncStates,
    toggleItemSelection,
    selectAllItems,
    clearSelection,
    bulkUpdateItems
  } = useReservationSummaryStore()

  const [confirmDialog, setConfirmDialog] = React.useState<{
    open: boolean
    action: 'confirm' | 'decline' | 'delete' | null
    itemCount: number
  }>({
    open: false,
    action: null,
    itemCount: 0
  })

  // Get items for the specified category
  const categoryItems = useMemo(() => {
    if (category === 'all') {
      return Object.values(requestedItems).flat()
    }
    return requestedItems[category]
  }, [requestedItems, category])

  // Filter selected items for current category
  const selectedItemsInCategory = useMemo(() => {
    const itemIds = new Set(categoryItems.map(item => item.id))
    return Array.from(selectedItems).filter(id => itemIds.has(id))
  }, [selectedItems, categoryItems])

  const selectedCount = selectedItemsInCategory.length
  const totalCount = categoryItems.length
  const hasSelection = selectedCount > 0
  const isAllSelected = selectedCount === totalCount && totalCount > 0
  const isPartiallySelected = selectedCount > 0 && selectedCount < totalCount

  // Selection handlers
  const handleSelectAll = useCallback(() => {
    if (isAllSelected) {
      clearSelection()
    } else {
      selectAllItems(category === 'all' ? undefined : category)
    }
  }, [isAllSelected, clearSelection, selectAllItems, category])

  const handleToggleItem = useCallback((itemId: string) => {
    toggleItemSelection(itemId)
  }, [toggleItemSelection])

  // Bulk action handlers
  const handleBulkAction = useCallback(async (action: 'confirm' | 'decline' | 'delete') => {
    if (selectedItemsInCategory.length === 0) return

    setConfirmDialog({
      open: true,
      action,
      itemCount: selectedItemsInCategory.length
    })
  }, [selectedItemsInCategory.length])

  const confirmBulkAction = useCallback(async () => {
    const { action } = confirmDialog
    if (!action || selectedItemsInCategory.length === 0) return

    try {
      const result = await bulkUpdateItems(action, selectedItemsInCategory)
      
      // Clear selection after successful bulk action
      if (result.success.length > 0) {
        clearSelection()
      }

      // Show toast or notification with results
      console.log('Bulk action result:', result)
    } catch (error) {
      console.error('Bulk action failed:', error)
    } finally {
      setConfirmDialog({ open: false, action: null, itemCount: 0 })
    }
  }, [confirmDialog, selectedItemsInCategory, bulkUpdateItems, clearSelection])

  // Get action button configurations
  const getActionConfig = useCallback((action: 'confirm' | 'decline' | 'delete') => {
    const configs = {
      confirm: {
        icon: Check,
        label: t('confirmSelected'),
        variant: 'default' as const,
        className: 'text-green-600 hover:text-green-700'
      },
      decline: {
        icon: X,
        label: t('declineSelected'),
        variant: 'outline' as const,
        className: 'text-orange-600 hover:text-orange-700'
      },
      delete: {
        icon: Trash2,
        label: t('deleteSelected'),
        variant: 'outline' as const,
        className: 'text-red-600 hover:text-red-700'
      }
    }
    return configs[action]
  }, [t])

  if (totalCount === 0) return null

  const isLoading = asyncStates.bulkUpdate.loading

  return (
    <>
      <div className={`flex items-center gap-3 p-3 bg-muted/5 border border-border rounded-lg ${className}`}>
        {/* Select All Checkbox */}
        <div className="flex items-center gap-2">
          <Checkbox
            checked={isAllSelected}
            // Indeterminate visual state is not supported via types; skip for TS cleanliness
            onCheckedChange={handleSelectAll}
            aria-label={isAllSelected ? t('deselectAll') : t('selectAll')}
          />
          <span className="text-sm text-muted-foreground">
            {hasSelection ? (
              <>
                {selectedCount} of {totalCount} selected
              </>
            ) : (
              <>
                {totalCount} items
              </>
            )}
          </span>
        </div>

        {/* Bulk Actions */}
        {hasSelection && (
          <div className="flex items-center gap-2 ml-auto">
            <Badge variant="secondary" className="text-xs">
              {selectedCount} selected
            </Badge>

            {/* Quick Actions */}
            <div className="flex items-center gap-1">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleBulkAction('confirm')}
                disabled={isLoading}
                className="gap-1 text-green-600 hover:text-green-700 hover:bg-green-50"
              >
                <Check className="h-3 w-3" />
                Confirm
              </Button>

              <Button
                size="sm"
                variant="outline"
                onClick={() => handleBulkAction('decline')}
                disabled={isLoading}
                className="gap-1 text-orange-600 hover:text-orange-700 hover:bg-orange-50"
              >
                <X className="h-3 w-3" />
                Decline
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={isLoading}
                    className="gap-1"
                  >
                    {isLoading ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <ChevronDown className="h-3 w-3" />
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => handleBulkAction('delete')}
                    className="text-red-600 focus:text-red-600"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    {t('deleteSelected')}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={clearSelection}>
                    <Square className="h-4 w-4 mr-2" />
                    {t('clearSelection')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        )}
      </div>

      {/* Confirmation Dialog */}
      <AlertDialog open={confirmDialog.open} onOpenChange={(open) => !open && setConfirmDialog({ open: false, action: null, itemCount: 0 })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-full">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <AlertDialogTitle>
                  {confirmDialog.action === 'delete' 
                    ? t('confirmDelete') 
                    : confirmDialog.action === 'confirm'
                    ? t('confirmItems')
                    : t('declineItems')
                  }
                </AlertDialogTitle>
                <AlertDialogDescription>
                  {confirmDialog.action === 'delete' ? (
                    <>
                      This will permanently delete {confirmDialog.itemCount} selected item{confirmDialog.itemCount !== 1 ? 's' : ''}. 
                      This action cannot be undone.
                    </>
                  ) : (
                    <>
                      This will {confirmDialog.action} {confirmDialog.itemCount} selected item{confirmDialog.itemCount !== 1 ? 's' : ''}.
                    </>
                  )}
                </AlertDialogDescription>
              </div>
            </div>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>
              {t('cancel')}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmBulkAction}
              disabled={isLoading}
              className={confirmDialog.action === 'delete' ? 'bg-red-600 hover:bg-red-700' : ''}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              {confirmDialog.action === 'delete' 
                ? t('delete') 
                : confirmDialog.action === 'confirm'
                ? t('confirm')
                : t('decline')
              }
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

/**
 * Individual item selection checkbox component
 */
interface ItemSelectionCheckboxProps {
  itemId: string
  className?: string
}

export function ItemSelectionCheckbox({ itemId, className }: ItemSelectionCheckboxProps) {
  const { selectedItems, toggleItemSelection } = useReservationSummaryStore()
  
  const isSelected = selectedItems.has(itemId)
  
  const handleToggle = useCallback(() => {
    toggleItemSelection(itemId)
  }, [itemId, toggleItemSelection])
  
  return (
    <Checkbox
      checked={isSelected}
      onCheckedChange={handleToggle}
      className={className}
      aria-label={`Select item ${itemId}`}
    />
  )
}