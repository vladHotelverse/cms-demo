"use client"

import React, { useMemo, useCallback } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { 
  Search, 
  Filter, 
  X, 
  Calendar as CalendarIcon,
  SortAsc,
  SortDesc,
  ChevronDown
} from "lucide-react"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import type { DateRange } from "react-day-picker"
import { useReservationSummaryStore } from "@/stores/reservation-summary-store"
import { useReservationTranslations } from "@/hooks/use-reservation-translations"
import type { RequestedItemsData } from "@/data/reservation-items"

/**
 * Debounced search hook for optimized search input handling
 */
function useDebounced<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = React.useState<T>(value)

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

interface SearchAndFiltersProps {
  className?: string
  showCompactView?: boolean
}

export function SearchAndFilters({ className, showCompactView = false }: SearchAndFiltersProps) {
  const { t } = useReservationTranslations()
  const {
    searchFilters,
    sortConfig,
    requestedItems,
    getItemCounts,
    setSearchFilters,
    setSortConfig
  } = useReservationSummaryStore()

  // Local state for immediate UI updates (before debouncing)
  const [localQuery, setLocalQuery] = React.useState(searchFilters.query)
  const [showFilters, setShowFilters] = React.useState(false)

  // Debounced search query
  const debouncedQuery = useDebounced(localQuery, 300)

  // Update store when debounced query changes
  React.useEffect(() => {
    setSearchFilters({ query: debouncedQuery })
  }, [debouncedQuery, setSearchFilters])

  // Memoized calculations
  const itemCounts = useMemo(() => getItemCounts(), [getItemCounts])
  
  const uniqueAgents = useMemo(() => {
    const agents = new Set<string>()
    Object.values(requestedItems).flat().forEach(item => {
      if (item.agent) agents.add(item.agent)
    })
    return Array.from(agents).sort()
  }, [requestedItems])

  const activeFiltersCount = useMemo(() => {
    let count = 0
    if (searchFilters.status && searchFilters.status !== 'all') count++
    if (searchFilters.agent) count++
    if (searchFilters.category && searchFilters.category !== 'all') count++
    if (searchFilters.dateRange) count++
    return count
  }, [searchFilters])

  // Event handlers
  const handleQueryChange = useCallback((value: string) => {
    setLocalQuery(value)
  }, [])

  const handleStatusFilter = useCallback((status: string) => {
    setSearchFilters({ 
      status: status === 'all' ? undefined : status as 'pending_hotel' | 'confirmed' 
    })
  }, [setSearchFilters])

  const handleAgentFilter = useCallback((agent: string) => {
    setSearchFilters({ agent: agent === 'all' ? undefined : agent })
  }, [setSearchFilters])

  const handleCategoryFilter = useCallback((category: string) => {
    setSearchFilters({ 
      category: category === 'all' ? 'all' : category as keyof RequestedItemsData 
    })
  }, [setSearchFilters])

  const handleDateRangeFilter = useCallback((dateRange: DateRange | undefined) => {
    setSearchFilters({ 
      dateRange: dateRange?.from && dateRange?.to 
        ? { start: dateRange.from, end: dateRange.to }
        : undefined
    })
  }, [setSearchFilters])

  const handleSort = useCallback((field: string) => {
    const newDirection = sortConfig.field === field && sortConfig.direction === 'asc' 
      ? 'desc' 
      : 'asc'
    setSortConfig({ field, direction: newDirection })
  }, [sortConfig, setSortConfig])

  const clearAllFilters = useCallback(() => {
    setLocalQuery('')
    setSearchFilters({
      query: '',
      status: undefined,
      agent: undefined,
      category: 'all',
      dateRange: undefined
    })
  }, [setSearchFilters])

  const clearFilter = useCallback((filterType: string) => {
    switch (filterType) {
      case 'query':
        setLocalQuery('')
        break
      case 'status':
        setSearchFilters({ status: undefined })
        break
      case 'agent':
        setSearchFilters({ agent: undefined })
        break
      case 'category':
        setSearchFilters({ category: 'all' })
        break
      case 'dateRange':
        setSearchFilters({ dateRange: undefined })
        break
    }
  }, [setSearchFilters])

  if (showCompactView) {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t('searchItems')}
            value={localQuery}
            onChange={(e) => handleQueryChange(e.target.value)}
            className="pl-10"
          />
          {localQuery && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
              onClick={() => clearFilter('query')}
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>
        
        <Popover open={showFilters} onOpenChange={setShowFilters}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <Filter className="h-4 w-4" />
              {activeFiltersCount > 0 && (
                <Badge variant="secondary" className="h-5 w-5 p-0 text-xs">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80" align="end">
            <FilterContent
              searchFilters={searchFilters}
              uniqueAgents={uniqueAgents}
              itemCounts={itemCounts}
              onStatusFilter={handleStatusFilter}
              onAgentFilter={handleAgentFilter}
              onCategoryFilter={handleCategoryFilter}
              onDateRangeFilter={handleDateRangeFilter}
              onClearAll={clearAllFilters}
              t={(key: string, fallback?: string) => t(key, {}) || fallback || key}
            />
          </PopoverContent>
        </Popover>
      </div>
    )
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Search Bar */}
      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t('searchRooms', 'Search rooms, extras, agents...')}
            value={localQuery}
            onChange={(e) => handleQueryChange(e.target.value)}
            className="pl-10 pr-8"
          />
          {localQuery && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0"
              onClick={() => clearFilter('query')}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="gap-2"
        >
          <Filter className="h-4 w-4" />
          {t('filters')}
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="h-5 w-5 p-0 text-xs">
              {activeFiltersCount}
            </Badge>
          )}
          <ChevronDown className={cn("h-4 w-4 transition-transform", showFilters && "rotate-180")} />
        </Button>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="p-4 border border-border rounded-lg bg-muted/5">
             <FilterContent
            searchFilters={searchFilters}
            uniqueAgents={uniqueAgents}
            itemCounts={itemCounts}
             onStatusFilter={handleStatusFilter}
             onAgentFilter={handleAgentFilter}
             onCategoryFilter={handleCategoryFilter}
             onDateRangeFilter={handleDateRangeFilter}
             onClearAll={clearAllFilters}
             t={(key: string, fallback?: string) => t(key, {})}
          />
        </div>
      )}

      {/* Active Filters */}
      {activeFiltersCount > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-muted-foreground">{t('activeFilters')}:</span>
          
          {searchFilters.status && searchFilters.status !== 'all' && (
            <Badge variant="secondary" className="gap-1">
              {t('status')}: {t(searchFilters.status)}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => clearFilter('status')}
              />
            </Badge>
          )}
          
          {searchFilters.agent && (
            <Badge variant="secondary" className="gap-1">
              {t('agent')}: {searchFilters.agent}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => clearFilter('agent')}
              />
            </Badge>
          )}
          
          {searchFilters.category && searchFilters.category !== 'all' && (
            <Badge variant="secondary" className="gap-1">
              {t('category')}: {t(searchFilters.category)}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => clearFilter('category')}
              />
            </Badge>
          )}
          
          {searchFilters.dateRange && (
            <Badge variant="secondary" className="gap-1">
              {format(searchFilters.dateRange.start, 'MMM dd')} - {format(searchFilters.dateRange.end, 'MMM dd')}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => clearFilter('dateRange')}
              />
            </Badge>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="h-6 px-2 text-xs"
          >
            {t('clearAll')}
          </Button>
        </div>
      )}

      {/* Sort Controls */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">{t('sortBy')}:</span>
        {[
          { field: 'dateRequested', label: t('dateRequested') },
          { field: 'price', label: t('price') },
          { field: 'agent', label: t('agent') },
          { field: 'status', label: t('status') }
        ].map(({ field, label }) => (
          <Button
            key={field}
            variant={sortConfig.field === field ? "default" : "ghost"}
            size="sm"
            onClick={() => handleSort(field)}
            className="gap-1"
          >
            {label}
            {sortConfig.field === field && (
              sortConfig.direction === 'asc' 
                ? <SortAsc className="h-3 w-3" />
                : <SortDesc className="h-3 w-3" />
            )}
          </Button>
        ))}
      </div>
    </div>
  )
}

interface FilterContentProps {
  searchFilters: any
  uniqueAgents: string[]
  itemCounts: any
  onStatusFilter: (status: string) => void
  onAgentFilter: (agent: string) => void
  onCategoryFilter: (category: string) => void
  onDateRangeFilter: (dateRange: DateRange | undefined) => void
  onClearAll: () => void
  t: (key: string, fallback?: string) => string
}

function FilterContent({
  searchFilters,
  uniqueAgents,
  itemCounts,
  onStatusFilter,
  onAgentFilter,
  onCategoryFilter,
  onDateRangeFilter,
  onClearAll,
  t
}: FilterContentProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-medium">{t('filters')}</h4>
        <Button variant="ghost" size="sm" onClick={onClearAll}>
          {t('clearAll')}
        </Button>
      </div>

      {/* Status Filter */}
      <div className="space-y-2">
        <label className="text-sm font-medium">{t('status')}</label>
        <Select value={searchFilters.status || 'all'} onValueChange={onStatusFilter}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('allStatuses')}</SelectItem>
            <SelectItem value="pending_hotel">{t('pending_hotel')}</SelectItem>
            <SelectItem value="confirmed">{t('confirmed')}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Agent Filter */}
      <div className="space-y-2">
        <label className="text-sm font-medium">{t('agent')}</label>
        <Select value={searchFilters.agent || 'all'} onValueChange={onAgentFilter}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('allAgents')}</SelectItem>
            {uniqueAgents.map(agent => (
              <SelectItem key={agent} value={agent}>{agent}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Category Filter */}
      <div className="space-y-2">
        <label className="text-sm font-medium">{t('category')}</label>
        <Select value={searchFilters.category || 'all'} onValueChange={onCategoryFilter}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('allCategories')}</SelectItem>
            <SelectItem value="rooms">
              {t('rooms')} ({itemCounts.rooms.total})
            </SelectItem>
            <SelectItem value="extras">
              {t('extras')} ({itemCounts.extras.total})
            </SelectItem>
            <SelectItem value="bidding">
              {t('bidding')} ({itemCounts.bidding.total})
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Date Range Filter */}
      <div className="space-y-2">
        <label className="text-sm font-medium">{t('dateRange')}</label>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full justify-start gap-2">
              <CalendarIcon className="h-4 w-4" />
              {searchFilters.dateRange ? (
                `${format(searchFilters.dateRange.start, 'MMM dd')} - ${format(searchFilters.dateRange.end, 'MMM dd')}`
              ) : (
                t('selectDateRange')
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="range"
              selected={searchFilters.dateRange ? {
                from: searchFilters.dateRange.start,
                to: searchFilters.dateRange.end
              } : undefined}
              onSelect={onDateRangeFilter}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
}