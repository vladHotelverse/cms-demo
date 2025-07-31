"use client"

import React, { useCallback, useMemo } from 'react'
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"
import { cn } from "@/lib/utils"

/**
 * Pagination component props
 */
interface PaginationProps {
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
  onPageChange: (page: number) => void
  onItemsPerPageChange: (itemsPerPage: number) => void
  disabled?: boolean
  showItemsPerPage?: boolean
  showSummary?: boolean
  className?: string
}

/**
 * Main pagination component
 */
export function Pagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
  disabled = false,
  showItemsPerPage = true,
  showSummary = true,
  className
}: PaginationProps) {
  const handlePageChange = useCallback((page: number) => {
    if (page >= 1 && page <= totalPages && !disabled) {
      onPageChange(page)
    }
  }, [onPageChange, totalPages, disabled])

  const handleItemsPerPageChange = useCallback((value: string) => {
    if (!disabled) {
      onItemsPerPageChange(parseInt(value, 10))
    }
  }, [onItemsPerPageChange, disabled])

  // Generate page numbers with ellipsis
  const pageNumbers = useMemo(() => {
    const pages: (number | 'ellipsis')[] = []
    const showEllipsis = totalPages > 7

    if (!showEllipsis) {
      // Show all pages if 7 or fewer
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Always show first page
      pages.push(1)

      if (currentPage <= 4) {
        // Near the beginning
        for (let i = 2; i <= Math.min(5, totalPages - 1); i++) {
          pages.push(i)
        }
        if (totalPages > 5) {
          pages.push('ellipsis')
        }
      } else if (currentPage >= totalPages - 3) {
        // Near the end
        pages.push('ellipsis')
        for (let i = Math.max(totalPages - 4, 2); i <= totalPages - 1; i++) {
          pages.push(i)
        }
      } else {
        // In the middle
        pages.push('ellipsis')
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i)
        }
        pages.push('ellipsis')
      }

      // Always show last page if more than 1 page
      if (totalPages > 1) {
        pages.push(totalPages)
      }
    }

    return pages
  }, [currentPage, totalPages])

  const startItem = (currentPage - 1) * itemsPerPage + 1
  const endItem = Math.min(currentPage * itemsPerPage, totalItems)

  if (totalPages <= 1 && !showSummary) {
    return null
  }

  return (
    <div className={cn("flex items-center justify-between space-x-4", className)}>
      {/* Summary */}
      {showSummary && (
        <div className="text-sm text-muted-foreground">
          Showing {startItem}-{endItem} of {totalItems} results
        </div>
      )}

      <div className="flex items-center space-x-4">
        {/* Items per page selector */}
        {showItemsPerPage && (
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">Show</span>
            <Select
              value={itemsPerPage.toString()}
              onValueChange={handleItemsPerPageChange}
              disabled={disabled}
            >
              <SelectTrigger className="w-16">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Page navigation */}
        {totalPages > 1 && (
          <div className="flex items-center space-x-1">
            {/* Previous button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={disabled || currentPage <= 1}
              aria-label="Go to previous page"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            {/* Page numbers */}
            {pageNumbers.map((pageNum, index) => (
              <React.Fragment key={`page-${index}`}>
                {pageNum === 'ellipsis' ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled
                    className="px-1"
                    aria-label="More pages"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    variant={currentPage === pageNum ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(pageNum)}
                    disabled={disabled}
                    aria-label={`Go to page ${pageNum}`}
                    aria-current={currentPage === pageNum ? "page" : undefined}
                  >
                    {pageNum}
                  </Button>
                )}
              </React.Fragment>
            ))}

            {/* Next button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={disabled || currentPage >= totalPages}
              aria-label="Go to next page"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

/**
 * Pagination state and logic hook
 */
interface UsePaginationProps {
  totalItems: number
  initialPage?: number
  initialItemsPerPage?: number
}

interface UsePaginationReturn {
  currentPage: number
  itemsPerPage: number
  totalPages: number
  offset: number
  handlePageChange: (page: number) => void
  handleItemsPerPageChange: (itemsPerPage: number) => void
  getPaginatedItems: (items: any[]) => any[]
  paginationProps: PaginationProps
}

export function usePagination({
  totalItems,
  initialPage = 1,
  initialItemsPerPage = 25
}: UsePaginationProps): UsePaginationReturn {
  const [currentPage, setCurrentPage] = React.useState(initialPage)
  const [itemsPerPage, setItemsPerPage] = React.useState(initialItemsPerPage)

  // Calculate total pages
  const totalPages = Math.ceil(totalItems / itemsPerPage)

  // Handle page change
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)))
  }, [totalPages])

  // Handle items per page change
  const handleItemsPerPageChange = useCallback((newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage)
    // Adjust current page if necessary
    const newTotalPages = Math.ceil(totalItems / newItemsPerPage)
    setCurrentPage(prevPage => Math.min(prevPage, newTotalPages))
  }, [totalItems])

  // Reset to first page when total items change
  React.useEffect(() => {
    setCurrentPage(1)
  }, [totalItems])

  // Calculate offset for data fetching
  const offset = (currentPage - 1) * itemsPerPage

  // Get paginated items from an array
  const getPaginatedItems = React.useCallback((items: any[]) => {
    return items.slice(offset, offset + itemsPerPage)
  }, [offset, itemsPerPage])

  return {
    currentPage,
    itemsPerPage,
    totalPages,
    offset,
    handlePageChange,
    handleItemsPerPageChange,
    getPaginatedItems,
    paginationProps: {
      currentPage,
      totalPages,
      totalItems,
      itemsPerPage,
      onPageChange: handlePageChange,
      onItemsPerPageChange: handleItemsPerPageChange
    }
  }
}

/**
 * Compact pagination component for smaller spaces
 */
interface CompactPaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  disabled?: boolean
  className?: string
}

export function CompactPagination({
  currentPage,
  totalPages,
  onPageChange,
  disabled = false,
  className
}: CompactPaginationProps) {
  const handlePageChange = useCallback((page: number) => {
    if (page >= 1 && page <= totalPages && !disabled) {
      onPageChange(page)
    }
  }, [onPageChange, totalPages, disabled])

  if (totalPages <= 1) {
    return null
  }

  return (
    <div className={cn("flex items-center justify-center space-x-1", className)}>
      <Button
        variant="outline"
        size="sm"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={disabled || currentPage <= 1}
        aria-label="Previous page"
      >
        <ChevronLeft className="h-3 w-3" />
      </Button>
      
      <span className="text-sm px-2">
        {currentPage} of {totalPages}
      </span>
      
      <Button
        variant="outline"
        size="sm"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={disabled || currentPage >= totalPages}
        aria-label="Next page"
      >
        <ChevronRight className="h-3 w-3" />
      </Button>
    </div>
  )
}