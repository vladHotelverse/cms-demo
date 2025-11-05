# Hotel CMS - Comprehensive Codebase Review & Refactoring Plan

**Generated:** November 5, 2025
**Repository:** cms-demo
**Branch:** claude/codebase-review-plan-011CUpL7Cvs5VXHapcAgxctC
**Tech Stack:** Next.js 15, React 19, TypeScript 5, Supabase, Tailwind CSS, Zustand

---

## Executive Summary

This codebase represents a modern, well-architected hotel management system with strong foundations in React 19, TypeScript, and Next.js 15. The project demonstrates good use of modern patterns including:

- ✅ Type-safe development with TypeScript strict mode
- ✅ Component-based architecture with Radix UI
- ✅ State management with Zustand
- ✅ Comprehensive E2E testing with Playwright
- ✅ Modern styling with Tailwind CSS

However, there are **critical issues** that need immediate attention and several opportunities for improvement:

- ⚠️ **CRITICAL:** Build configuration ignores TypeScript/ESLint errors
- ⚠️ **HIGH:** No unit test coverage (only E2E tests)
- ⚠️ **HIGH:** 171 console statements in production code
- ⚠️ **MEDIUM:** Large monolithic components (up to 593 lines)
- ⚠️ **MEDIUM:** Mock data mixed with production code
- ⚠️ **MEDIUM:** Deprecated type definitions still in use

**Estimated Effort:** 6-8 weeks for complete refactoring
**Quick Wins (Week 1):** Can address 40% of issues with high impact

---

## Table of Contents

1. [Codebase Overview](#codebase-overview)
2. [Critical Issues & Quick Wins](#critical-issues--quick-wins)
3. [Priority 1: Critical Fixes](#priority-1-critical-fixes-week-1)
4. [Priority 2: Architecture & Components](#priority-2-architecture--components-weeks-2-3)
5. [Priority 3: Code Quality](#priority-3-code-quality-weeks-3-4)
6. [Priority 4: Testing Strategy](#priority-4-testing-strategy-weeks-4-6)
7. [Priority 5: Performance](#priority-5-performance-optimization-weeks-6-8)
8. [Implementation Roadmap](#implementation-roadmap)
9. [Success Metrics](#success-metrics)

---

## Codebase Overview

### Project Statistics

| Metric | Count | Quality |
|--------|-------|---------|
| Total TypeScript Files | 164 | ✅ Good |
| Component Files | 145 | ✅ Good |
| Total Component Lines | 23,504 | ⚠️ Review |
| Zustand Stores | 5 | ✅ Good |
| API Routes | 3 | ⚠️ Limited |
| Type Definitions | 8 | ✅ Good |
| Custom Hooks | 7 | ⚠️ Limited |
| Context Providers | 2 | ✅ Good |
| E2E Tests | 8 categories | ✅ Good |
| Unit Tests | 0 | ❌ Critical |
| Console Statements | 171 (41 files) | ❌ Poor |
| Pages/Routes | 12 | ✅ Good |

### Architecture Strengths

1. **Modern Stack:** Next.js 15 with App Router, React 19, TypeScript 5
2. **UI Foundation:** Comprehensive Radix UI + shadcn/ui implementation
3. **State Management:** Lightweight Zustand stores with computed values
4. **Type Safety:** Strict TypeScript with Zod validation
5. **Testing Infrastructure:** Well-configured Playwright for E2E testing
6. **Internationalization:** Multi-language support with Context API
7. **Styling:** Consistent Tailwind CSS with dark mode support

### Architecture Weaknesses

1. **No Unit Tests:** Complete absence of component/hook unit tests
2. **Large Components:** Some components exceed 500+ lines
3. **Mixed Concerns:** Production code contains mock data generators
4. **API Layer:** Limited API routes, unclear data fetching patterns
5. **Error Handling:** Inconsistent error handling across components
6. **Documentation:** Limited inline documentation and JSDoc

---

## Critical Issues & Quick Wins

### 🚨 Immediate Action Required (This Week)

#### 1. Build Configuration Ignoring Errors
**File:** `next.config.mjs:3-8`
**Impact:** ❌ CRITICAL
**Effort:** 5 minutes

```javascript
// ❌ CURRENT - DANGEROUS
const nextConfig = {
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  // ...
}

// ✅ RECOMMENDED
const nextConfig = {
  // Remove these lines completely
  images: { unoptimized: true },
}
```

**Rationale:** Ignoring build errors masks serious bugs that could reach production. This is a security and reliability risk.

**Action Plan:**
1. Remove `ignoreDuringBuilds` and `ignoreBuildErrors`
2. Run `npm run build` to surface all errors
3. Fix all TypeScript errors (estimated 10-20 errors)
4. Fix all ESLint errors (estimated 20-40 errors)
5. Commit with message: "fix: enable build error checking"

---

#### 2. Remove Console Logging
**Files:** 41 files, 171 occurrences
**Impact:** ⚠️ HIGH
**Effort:** 2-3 hours

**Top Offenders:**
- `reservation-summary-store.ts`: Multiple console.log calls
- `app/ventas/front-desk-upsell/page.tsx:195`: console.log('View mode changed:')
- `app/api/orders/route.ts:35,79`: console.error in API routes

**Recommended Approach:**

```typescript
// ✅ Create a debug utility
// lib/utils/logger.ts
export const logger = {
  debug: (...args: any[]) => {
    if (process.env.NODE_ENV === 'development') {
      console.log('[DEBUG]', ...args)
    }
  },
  error: (...args: any[]) => {
    console.error('[ERROR]', ...args)
    // Add error tracking service here (Sentry, LogRocket, etc.)
  },
  warn: (...args: any[]) => {
    console.warn('[WARN]', ...args)
  },
  info: (...args: any[]) => {
    console.info('[INFO]', ...args)
  }
}

// Replace all console.log with logger.debug
// Keep console.error but wrap with logger.error for tracking
```

**Action Plan:**
1. Create `lib/utils/logger.ts`
2. Run find/replace: `console.log` → `logger.debug`
3. Run find/replace: `console.error` → `logger.error`
4. Add ESLint rule to prevent future console usage
5. Add error tracking service integration

---

#### 3. Remove Deprecated Types
**File:** `types/addon.ts:4-6`
**Impact:** ⚠️ MEDIUM
**Effort:** 30 minutes

```typescript
// ❌ DEPRECATED - Remove entire file
// types/addon.ts
/**
 * @deprecated Use types from lib/validations/addon.ts instead
 */

// ✅ Action: Delete types/addon.ts
// ✅ Update all imports to use lib/validations/addon.ts
```

**Action Plan:**
1. Find all imports of `@/types/addon`
2. Replace with `@/lib/validations/addon`
3. Delete `types/addon.ts`
4. Run TypeScript check to ensure no broken imports

---

## Priority 1: Critical Fixes (Week 1)

### 1.1 Fix Build Configuration ⚡ QUICK WIN
- **Effort:** 5 minutes + 2 hours fixing errors
- **Impact:** Critical security and reliability
- **See:** [Immediate Action Required](#1-build-configuration-ignoring-errors)

### 1.2 Create Environment Configuration
**Missing:** `.env.example` file
**Impact:** ⚠️ HIGH - New developers cannot set up project
**Effort:** 15 minutes

```bash
# Create .env.example
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NODE_ENV=development
```

**Action Plan:**
1. Create `.env.example` with all required variables
2. Add setup instructions to README.md
3. Document which variables are required vs optional
4. Add validation on app startup for required env vars

### 1.3 Replace Simulated API Calls
**File:** `stores/reservation-summary-store.ts:99-107`
**Impact:** ⚠️ HIGH - Misleading development experience
**Effort:** 4-6 hours

```typescript
// ❌ CURRENT - Simulated with artificial delays
const simulateApiCall = async <T>(operation: () => T, delay = 500): Promise<T> => {
  await new Promise(resolve => setTimeout(resolve, delay))
  if (Math.random() < 0.1) {
    throw new Error(`Network error during operation`)
  }
  return operation()
}

// ✅ RECOMMENDED - Real API calls
const apiCall = async <T>(endpoint: string, options?: RequestInit): Promise<T> => {
  const response = await fetch(endpoint, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  })

  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`)
  }

  return response.json()
}
```

**Action Plan:**
1. Create API client utility in `lib/api/client.ts`
2. Replace all `simulateApiCall()` with real API calls
3. Create missing API endpoints in `app/api/`
4. Add error handling and retry logic
5. Update tests to mock real API endpoints

### 1.4 Add Missing API Routes
**Current:** Only 3 API routes
**Needed:** 8-10 additional routes
**Effort:** 1-2 days

**Missing API Routes:**
```
app/api/
├── orders/          ✅ EXISTS
├── proposals/       ✅ EXISTS
├── reservations/    ❌ MISSING - Create for reservation management
├── recommendations/ ❌ MISSING - Create for hotel recommendations
├── rooms/          ❌ MISSING - Create for room management
├── extras/         ❌ MISSING - Create for extras/addons
├── users/          ❌ MISSING - Create for user management
└── analytics/      ❌ MISSING - Create for sales analytics
```

**Recommended Implementation:**

```typescript
// app/api/reservations/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

const reservationSchema = z.object({
  locator: z.string(),
  guestName: z.string(),
  email: z.string().email(),
  checkIn: z.string(),
  nights: z.number().min(1),
  roomType: z.string(),
})

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)

    // Build query with filters
    let query = supabase.from('reservations').select('*')

    // Apply filters from search params
    const status = searchParams.get('status')
    if (status) query = query.eq('status', status)

    const { data, error } = await query

    if (error) throw error

    return NextResponse.json({ data, success: true })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch reservations', success: false },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validated = reservationSchema.parse(body)

    const supabase = await createClient()
    const { data, error } = await supabase
      .from('reservations')
      .insert(validated)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ data, success: true }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors, success: false },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to create reservation', success: false },
      { status: 500 }
    )
  }
}
```

---

## Priority 2: Architecture & Components (Weeks 2-3)

### 2.1 Refactor Large Components

#### Front Desk Upsell Page (593 lines)
**File:** `app/ventas/front-desk-upsell/page.tsx`
**Current Size:** 593 lines
**Target Size:** <200 lines
**Effort:** 1-2 days

**Issues:**
- Mock data generation inside component (lines 76-110, 207-266)
- Multiple responsibilities (table, tabs, modals, search, sorting)
- Complex state management (9 useState hooks)
- Inline helper functions

**Refactoring Plan:**

```
app/ventas/front-desk-upsell/
├── page.tsx                    # Main page (150 lines)
├── components/
│   ├── ReservationsTable.tsx   # Table component (100 lines)
│   ├── ReservationFilters.tsx  # Search and filters (80 lines)
│   ├── TabNavigation.tsx       # Tab management (60 lines)
│   └── AlertNotification.tsx   # Alert component (40 lines)
├── hooks/
│   ├── useReservations.ts      # Data fetching hook (50 lines)
│   ├── useReservationTabs.ts   # Tab management hook (80 lines)
│   └── useSorting.ts          # Sorting logic (40 lines)
└── utils/
    ├── mockDataGenerator.ts    # Mock data (move to /data folder)
    └── reservationHelpers.ts   # Helper functions
```

**Implementation:**

```typescript
// ✅ hooks/useReservations.ts
export function useReservations() {
  const [orders, setOrders] = useState<OrderFromAPI[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchReservations() {
      try {
        setLoading(true)
        const response = await fetch('/api/reservations')
        const data = await response.json()
        setOrders(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchReservations()
  }, [])

  return { orders, loading, error, refetch: fetchReservations }
}

// ✅ components/ReservationsTable.tsx
interface ReservationsTableProps {
  reservations: OrderFromAPI[]
  onRowClick: (reservation: OrderFromAPI) => void
  sortConfig: SortConfig
  onSort: (field: SortField) => void
}

export function ReservationsTable({
  reservations,
  onRowClick,
  sortConfig,
  onSort
}: ReservationsTableProps) {
  return (
    <Table>
      <TableHeader>
        {/* Table headers */}
      </TableHeader>
      <TableBody>
        {reservations.map(reservation => (
          <TableRow key={reservation.id} onClick={() => onRowClick(reservation)}>
            {/* Table cells */}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

// ✅ page.tsx - Much cleaner
export default function FrontDeskUpsellPage() {
  const { orders, loading } = useReservations()
  const { tabs, activeTab, openTab, closeTab } = useReservationTabs()
  const { sortedData, sortConfig, handleSort } = useSorting(orders)

  return (
    <div className="w-full h-full">
      <TabNavigation tabs={tabs} activeTab={activeTab} onClose={closeTab} />
      <ReservationFilters />
      <ReservationsTable
        reservations={sortedData}
        sortConfig={sortConfig}
        onSort={handleSort}
      />
    </div>
  )
}
```

**Benefits:**
- ✅ Each component has single responsibility
- ✅ Easier to test each piece independently
- ✅ Reusable components across the application
- ✅ Improved readability and maintainability

---

### 2.2 Implement SelectionSummary Refactoring

**Reference:** Detailed plan exists in `REFACTORING_ANALYSIS.md`
**Effort:** 3-4 days
**Impact:** ⚠️ HIGH

The SelectionSummary component refactoring is already well-documented. Key actions:

1. ✅ Split monolithic component into focused components
2. ✅ Implement priority-based operation queue
3. ✅ Add optimistic updates with rollback
4. ✅ Create validation system
5. ✅ Add virtual scrolling for large datasets
6. ✅ Implement network resilience

**Status:** Architecture designed, needs implementation
**Timeline:** Week 2-3
**Owner:** To be assigned

---

### 2.3 Standardize Store Patterns

**Current Issues:**
- Inconsistent error handling across stores
- Mixed sync/async operations
- No centralized API client
- Duplicate logic in multiple stores

**Recommended Pattern:**

```typescript
// ✅ lib/store/createAsyncStore.ts - Store factory
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

export interface AsyncState<T> {
  data: T | null
  loading: boolean
  error: string | null
}

export interface AsyncActions<T> {
  setData: (data: T) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  reset: () => void
}

export function createAsyncStore<T, Actions = {}>(
  name: string,
  initialData: T,
  actions: (set: any, get: any) => Actions
) {
  return create<AsyncState<T> & AsyncActions<T> & Actions>()(
    devtools(
      (set, get) => ({
        // State
        data: initialData,
        loading: false,
        error: null,

        // Standard actions
        setData: (data) => set({ data, error: null }),
        setLoading: (loading) => set({ loading }),
        setError: (error) => set({ error, loading: false }),
        reset: () => set({ data: initialData, loading: false, error: null }),

        // Custom actions
        ...actions(set, get)
      }),
      { name }
    )
  )
}

// ✅ Usage example
export const useRoomStore = createAsyncStore(
  'roomStore',
  { rooms: [], selectedRooms: new Set() },
  (set, get) => ({
    addRoom: async (room: Room) => {
      set({ loading: true })
      try {
        const response = await apiClient.post('/api/rooms', room)
        set((state) => ({
          data: { ...state.data, rooms: [...state.data.rooms, response] },
          loading: false
        }))
      } catch (error) {
        set({ error: error.message, loading: false })
      }
    },

    selectRoom: (roomId: string) => {
      set((state) => {
        const newSet = new Set(state.data.selectedRooms)
        newSet.add(roomId)
        return { data: { ...state.data, selectedRooms: newSet } }
      })
    }
  })
)
```

---

## Priority 3: Code Quality (Weeks 3-4)

### 3.1 Separate Mock Data from Production Code

**Issue:** Mock data generators mixed with production components

**Files to Refactor:**
- `app/ventas/front-desk-upsell/page.tsx:76-110, 207-266`
- Other components with embedded mock data

**Recommended Structure:**

```
data/
├── mock/                       # Mock data (development only)
│   ├── reservations.ts
│   ├── orders.ts
│   └── generators.ts
├── seeds/                      # Database seeds
│   ├── seed-reservations.ts
│   └── seed-orders.ts
└── constants/                  # Actual constants
    ├── room-types.ts
    └── occupancy-options.ts
```

**Implementation:**

```typescript
// ✅ data/mock/generators.ts
export const mockDataGenerators = {
  reservation: (overrides?: Partial<OrderFromAPI>): OrderFromAPI => ({
    id: `mock-${Date.now()}`,
    locator: generateLocator(),
    name: faker.name.fullName(),
    email: faker.internet.email(),
    // ... rest of fields
    ...overrides
  }),

  reservations: (count: number): OrderFromAPI[] => {
    return Array.from({ length: count }, (_, i) =>
      mockDataGenerators.reservation({ id: `mock-${i}` })
    )
  }
}

// ✅ hooks/useReservations.ts
import { mockDataGenerators } from '@/data/mock/generators'

export function useReservations() {
  const [orders, setOrders] = useState<OrderFromAPI[]>([])

  useEffect(() => {
    async function fetchData() {
      // In development, use mock data
      if (process.env.NODE_ENV === 'development') {
        setOrders(mockDataGenerators.reservations(50))
        return
      }

      // In production, fetch real data
      const response = await fetch('/api/reservations')
      setOrders(await response.json())
    }

    fetchData()
  }, [])

  return { orders }
}
```

---

### 3.2 Add JSDoc Documentation

**Current State:** Minimal documentation
**Target:** All public functions, complex logic, and exported components
**Effort:** 2-3 days

**Standards:**

```typescript
/**
 * Fetches reservations from the API with optional filtering
 *
 * @param filters - Optional filters for reservations
 * @param filters.status - Filter by reservation status
 * @param filters.dateRange - Filter by check-in date range
 * @returns Promise resolving to array of reservations
 * @throws {APIError} When the API request fails
 *
 * @example
 * ```ts
 * const reservations = await fetchReservations({
 *   status: 'confirmed',
 *   dateRange: { start: new Date(), end: addDays(new Date(), 7) }
 * })
 * ```
 */
export async function fetchReservations(
  filters?: ReservationFilters
): Promise<OrderFromAPI[]> {
  // Implementation
}

/**
 * Component for displaying a list of reservations in a table format
 *
 * @component
 * @example
 * ```tsx
 * <ReservationsTable
 *   reservations={data}
 *   onRowClick={handleClick}
 *   sortConfig={{ field: 'checkIn', direction: 'asc' }}
 *   onSort={handleSort}
 * />
 * ```
 */
export function ReservationsTable({ ... }: ReservationsTableProps) {
  // Implementation
}
```

**Automation:**
```bash
# Install TypeDoc for generating documentation
npm install --save-dev typedoc

# Add script to package.json
"docs:generate": "typedoc --out docs/api src"
```

---

### 3.3 Improve Type Safety

**Issues Found:**
- Use of `any` types in several places
- Missing null checks in some functions
- Inconsistent error types

**Action Items:**

```typescript
// ❌ BEFORE - Using 'any'
const handleClick = (item: any) => {
  console.log(item.id)
}

// ✅ AFTER - Proper typing
const handleClick = (item: OrderFromAPI) => {
  logger.debug(`Clicked item: ${item.id}`)
}

// ❌ BEFORE - No null checking
function calculateTotal(items: RequestedItem[]) {
  return items.reduce((sum, item) => sum + item.price, 0)
}

// ✅ AFTER - Safe with null checking
function calculateTotal(items: RequestedItem[] | null): number {
  if (!items || items.length === 0) return 0
  return items.reduce((sum, item) => sum + (item.price ?? 0), 0)
}

// ✅ Create error types
// lib/errors/api-errors.ts
export class APIError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public code: string
  ) {
    super(message)
    this.name = 'APIError'
  }
}

export class ValidationError extends Error {
  constructor(
    message: string,
    public field: string,
    public value: any
  ) {
    super(message)
    this.name = 'ValidationError'
  }
}
```

---

## Priority 4: Testing Strategy (Weeks 4-6)

### 4.1 Add Unit Testing Infrastructure

**Current:** No unit tests
**Goal:** 70%+ code coverage
**Effort:** 1-2 weeks

**Setup:**

```bash
# Install testing dependencies
npm install --save-dev \
  @testing-library/react \
  @testing-library/jest-dom \
  @testing-library/user-event \
  @testing-library/react-hooks \
  jest \
  jest-environment-jsdom \
  @types/jest

# Create Jest config
```

```javascript
// jest.config.js
const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  collectCoverageFrom: [
    'components/**/*.{js,jsx,ts,tsx}',
    'lib/**/*.{js,jsx,ts,tsx}',
    'hooks/**/*.{js,jsx,ts,tsx}',
    'stores/**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
  ],
  coverageThresholds: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
}

module.exports = createJestConfig(customJestConfig)
```

**Test Examples:**

```typescript
// __tests__/hooks/useReservations.test.ts
import { renderHook, waitFor } from '@testing-library/react'
import { useReservations } from '@/hooks/useReservations'

describe('useReservations', () => {
  beforeEach(() => {
    global.fetch = jest.fn()
  })

  it('should fetch reservations on mount', async () => {
    const mockData = [{ id: '1', name: 'Test' }]
    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockData,
    })

    const { result } = renderHook(() => useReservations())

    expect(result.current.loading).toBe(true)

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.orders).toEqual(mockData)
  })

  it('should handle errors gracefully', async () => {
    ;(global.fetch as jest.Mock).mockRejectedValue(
      new Error('API Error')
    )

    const { result } = renderHook(() => useReservations())

    await waitFor(() => {
      expect(result.current.error).toBe('API Error')
    })
  })
})

// __tests__/components/ReservationsTable.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { ReservationsTable } from '@/components/ReservationsTable'

describe('ReservationsTable', () => {
  const mockReservations = [
    {
      id: '1',
      locator: 'LOC001',
      name: 'John Doe',
      email: 'john@example.com',
      checkIn: '01/01/2026',
      nights: '3',
      roomType: 'Deluxe',
      aci: '2/0/0',
      status: 'Confirmed',
      extras: '2 reserved items',
    },
  ]

  it('should render reservations', () => {
    render(
      <ReservationsTable
        reservations={mockReservations}
        onRowClick={jest.fn()}
        sortConfig={{ field: 'checkIn', direction: 'asc' }}
        onSort={jest.fn()}
      />
    )

    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('LOC001')).toBeInTheDocument()
  })

  it('should call onRowClick when row is clicked', () => {
    const onRowClick = jest.fn()

    render(
      <ReservationsTable
        reservations={mockReservations}
        onRowClick={onRowClick}
        sortConfig={{ field: 'checkIn', direction: 'asc' }}
        onSort={jest.fn()}
      />
    )

    fireEvent.click(screen.getByText('John Doe'))
    expect(onRowClick).toHaveBeenCalledWith(mockReservations[0])
  })

  it('should handle sorting', () => {
    const onSort = jest.fn()

    render(
      <ReservationsTable
        reservations={mockReservations}
        onRowClick={jest.fn()}
        sortConfig={{ field: 'checkIn', direction: 'asc' }}
        onSort={onSort}
      />
    )

    fireEvent.click(screen.getByText('Check In'))
    expect(onSort).toHaveBeenCalledWith('checkIn')
  })
})

// __tests__/stores/useReservationStore.test.ts
import { act, renderHook } from '@testing-library/react'
import { useReservationSummaryStore } from '@/stores/reservation-summary-store'

describe('useReservationSummaryStore', () => {
  beforeEach(() => {
    const { result } = renderHook(() => useReservationSummaryStore())
    act(() => {
      result.current.reset?.() // Reset store between tests
    })
  })

  it('should toggle detailed view', () => {
    const { result } = renderHook(() => useReservationSummaryStore())

    expect(result.current.showDetailedView).toBe(false)

    act(() => {
      result.current.setShowDetailedView(true)
    })

    expect(result.current.showDetailedView).toBe(true)
  })

  it('should handle item selection', () => {
    const { result } = renderHook(() => useReservationSummaryStore())

    act(() => {
      result.current.toggleItemSelection('item-1')
    })

    expect(result.current.selectedItems.has('item-1')).toBe(true)

    act(() => {
      result.current.toggleItemSelection('item-1')
    })

    expect(result.current.selectedItems.has('item-1')).toBe(false)
  })
})
```

**Testing Strategy:**

1. **Unit Tests (70% coverage target)**
   - All custom hooks
   - All utility functions
   - All stores (Zustand)
   - Complex components

2. **Integration Tests (30% coverage)**
   - Page components
   - API routes
   - Form submissions

3. **E2E Tests (Already good coverage)**
   - Critical user flows
   - Cross-browser testing
   - Mobile testing

**Package.json Scripts:**

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:ci": "jest --ci --coverage --maxWorkers=2",
    "test:all": "npm run test:ci && npm run test:e2e"
  }
}
```

---

### 4.2 Add API Integration Tests

**Goal:** Test all API routes with real Supabase integration

```typescript
// __tests__/api/orders.test.ts
import { createMocks } from 'node-mocks-http'
import { GET, POST } from '@/app/api/orders/route'

describe('/api/orders', () => {
  describe('GET', () => {
    it('should return orders', async () => {
      const { req } = createMocks({
        method: 'GET',
        url: '/api/orders',
      })

      const response = await GET(req)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(Array.isArray(data)).toBe(true)
    })

    it('should filter by status', async () => {
      const { req } = createMocks({
        method: 'GET',
        url: '/api/orders?status=confirmed',
      })

      const response = await GET(req)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.every(order => order.status === 'confirmed')).toBe(true)
    })
  })

  describe('POST', () => {
    it('should create an order', async () => {
      const orderData = {
        userEmail: 'test@example.com',
        userName: 'Test User',
        reservationCode: 'TEST001',
        checkIn: '2026-05-20',
        checkOut: '2026-05-23',
        roomType: 'Deluxe',
        occupancy: '2/0/0',
      }

      const { req } = createMocks({
        method: 'POST',
        url: '/api/orders',
        body: orderData,
      })

      const response = await POST(req)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.order).toBeDefined()
    })
  })
})
```

---

## Priority 5: Performance Optimization (Weeks 6-8)

### 5.1 Implement Code Splitting

**Current:** Large bundle size with all components loaded upfront
**Goal:** Reduce initial bundle by 40%

```typescript
// ✅ Lazy load heavy components
import dynamic from 'next/dynamic'

const ReservationDetailsTab = dynamic(
  () => import('@/components/features/reservations/reservation-details-tab'),
  { loading: () => <LoadingSpinner /> }
)

const SalesAnalytics = dynamic(
  () => import('@/components/features/sales/sales-analytics'),
  { ssr: false, loading: () => <LoadingSpinner /> }
)

// ✅ Lazy load modals only when opened
const [showModal, setShowModal] = useState(false)
const Modal = dynamic(() => import('@/components/ui/modal'))

{showModal && <Modal />}
```

### 5.2 Optimize Image Loading

**Current:** `unoptimized: true` in next.config.mjs
**Issue:** Large image files, slow loading

```javascript
// ❌ CURRENT
const nextConfig = {
  images: { unoptimized: true },
}

// ✅ RECOMMENDED
const nextConfig = {
  images: {
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
    domains: ['your-image-cdn.com'], // Add your image domains
  },
}
```

```tsx
// ✅ Use Next.js Image component
import Image from 'next/image'

<Image
  src="/room-deluxe.jpg"
  alt="Deluxe Room"
  width={800}
  height={600}
  priority={false} // Load lazily
  placeholder="blur"
  blurDataURL="data:image/..." // Add blur placeholder
/>
```

### 5.3 Add Database Indexes

**Review Supabase schema for missing indexes**

```sql
-- Example: Add indexes for common queries
CREATE INDEX IF NOT EXISTS idx_orders_check_in
  ON orders(check_in);

CREATE INDEX IF NOT EXISTS idx_orders_status
  ON orders(status);

CREATE INDEX IF NOT EXISTS idx_orders_user_email
  ON orders(user_email);

CREATE INDEX IF NOT EXISTS idx_order_items_order_id
  ON order_items(order_id);

-- Composite indexes for common filter combinations
CREATE INDEX IF NOT EXISTS idx_orders_status_check_in
  ON orders(status, check_in);
```

### 5.4 Implement React Query for Data Fetching

**Benefits:**
- Automatic caching
- Background refetching
- Optimistic updates
- Request deduplication

```bash
npm install @tanstack/react-query
```

```typescript
// lib/providers/query-provider.tsx
'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useState } from 'react'

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            cacheTime: 5 * 60 * 1000, // 5 minutes
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}

// ✅ hooks/useReservations.ts - React Query version
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

export function useReservations(filters?: ReservationFilters) {
  return useQuery({
    queryKey: ['reservations', filters],
    queryFn: () => fetchReservations(filters),
    staleTime: 30 * 1000, // 30 seconds
  })
}

export function useCreateReservation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createReservation,
    onSuccess: () => {
      // Invalidate and refetch reservations
      queryClient.invalidateQueries({ queryKey: ['reservations'] })
    },
  })
}

// ✅ Usage in components
function ReservationsPage() {
  const { data, isLoading, error } = useReservations()
  const createMutation = useCreateReservation()

  if (isLoading) return <LoadingSpinner />
  if (error) return <ErrorMessage error={error} />

  return (
    <div>
      <ReservationsTable data={data} />
      <Button onClick={() => createMutation.mutate(newReservation)}>
        Create
      </Button>
    </div>
  )
}
```

---

## Implementation Roadmap

### Week 1: Critical Fixes & Quick Wins
- [ ] Remove build error ignoring
- [ ] Fix all TypeScript errors
- [ ] Fix all ESLint errors
- [ ] Create logger utility
- [ ] Remove all console.log statements
- [ ] Delete deprecated types
- [ ] Create .env.example
- [ ] Add environment validation

**Deliverables:** Clean build, no console logs, proper env setup

---

### Week 2-3: Architecture & Components
- [ ] Refactor front-desk-upsell page
- [ ] Extract hooks and utilities
- [ ] Separate mock data from production
- [ ] Implement SelectionSummary refactoring
- [ ] Create missing API routes
- [ ] Replace simulated API calls
- [ ] Standardize store patterns

**Deliverables:** Cleaner architecture, real API integration

---

### Week 3-4: Code Quality
- [ ] Add JSDoc documentation
- [ ] Improve type safety (remove `any`)
- [ ] Create error type hierarchy
- [ ] Add null safety checks
- [ ] Standardize error handling
- [ ] Code review and cleanup

**Deliverables:** Well-documented, type-safe codebase

---

### Week 4-6: Testing
- [ ] Set up Jest + React Testing Library
- [ ] Write unit tests for hooks (70% coverage)
- [ ] Write unit tests for utilities (80% coverage)
- [ ] Write unit tests for stores (70% coverage)
- [ ] Write component tests (60% coverage)
- [ ] Write API integration tests
- [ ] Set up CI/CD with test automation

**Deliverables:** 70%+ test coverage, automated testing

---

### Week 6-8: Performance
- [ ] Implement code splitting
- [ ] Enable image optimization
- [ ] Add database indexes
- [ ] Implement React Query
- [ ] Add bundle analyzer
- [ ] Performance testing
- [ ] Optimize bundle size

**Deliverables:** 40% smaller bundle, faster load times

---

## Success Metrics

### Code Quality Metrics

| Metric | Current | Target | How to Measure |
|--------|---------|--------|----------------|
| TypeScript Errors | Unknown (hidden) | 0 | `npm run build` |
| ESLint Errors | Unknown (hidden) | 0 | `npm run lint` |
| Console Statements | 171 | 0 | Grep search |
| Test Coverage | 0% | 70%+ | Jest coverage |
| Bundle Size | Unknown | -40% | Next.js analyze |
| Lighthouse Score | Unknown | 90+ | Lighthouse CI |

### Performance Metrics

| Metric | Target | How to Measure |
|--------|--------|----------------|
| First Contentful Paint | <1.5s | Lighthouse |
| Time to Interactive | <3s | Lighthouse |
| Total Blocking Time | <200ms | Lighthouse |
| Cumulative Layout Shift | <0.1 | Lighthouse |
| Bundle Size (First Load JS) | <200kb | Next.js build |

### Developer Experience Metrics

| Metric | Target | How to Measure |
|--------|--------|----------------|
| Build Time | <30s | CI/CD logs |
| Test Execution Time | <2min | Jest timing |
| Hot Reload Time | <1s | Dev experience |
| New Developer Onboarding | <30min | Documentation |

---

## Maintenance Plan

### Daily
- [ ] Run linter before commits
- [ ] Run unit tests before push
- [ ] Review console errors

### Weekly
- [ ] Run full test suite
- [ ] Check bundle size
- [ ] Review error logs
- [ ] Update dependencies

### Monthly
- [ ] Dependency security audit
- [ ] Performance testing
- [ ] Code review sessions
- [ ] Documentation updates

### Quarterly
- [ ] Major dependency updates
- [ ] Architecture review
- [ ] Technical debt assessment
- [ ] Performance optimization

---

## Conclusion

This codebase has a strong foundation with modern technologies and good architectural patterns. The refactoring plan addresses critical issues first, then systematically improves architecture, code quality, testing, and performance.

**Key Priorities:**
1. ✅ Fix build configuration (Week 1)
2. ✅ Add unit testing (Weeks 4-6)
3. ✅ Refactor large components (Weeks 2-3)
4. ✅ Remove console logging (Week 1)
5. ✅ Implement real API integration (Weeks 2-3)

**Expected Outcomes:**
- 🎯 Zero build errors
- 🎯 70%+ test coverage
- 🎯 40% smaller bundle size
- 🎯 Clean, maintainable codebase
- 🎯 Improved developer experience

**Total Effort:** 6-8 weeks with 1-2 developers

---

**Document Version:** 1.0
**Last Updated:** November 5, 2025
**Next Review:** After Week 2 implementation
