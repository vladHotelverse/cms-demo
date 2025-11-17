# TypeScript Errors Audit
**Date:** 2025-11-17
**Task:** P0.1.1 - Enable TypeScript Build Checking
**Status:** Errors identified and categorized

## Summary

**Total Errors:** 175 TypeScript errors found
**Categories:**
- API Route Type Errors: 2
- Playwright/Testing Errors: 149
- Store Type Errors: 6
- Mock Data Errors: 1
- Utility Type Errors: 2
- Total unique issues across files

---

## Category 1: API Route Errors (Next.js 15 Compatibility)

### Files Affected:
- `.next/types/app/api/orders/[id]/route.ts`

### Errors:

#### Error 1: GET route handler signature
```
.next/types/app/api/orders/[id]/route.ts(49,7): error TS2344:
Type '{ __tag__: "GET"; __param_position__: "second"; __param_type__: { params: { id: string; }; }; }'
does not satisfy the constraint 'ParamCheck<RouteContext>'.
```

**Issue:** Next.js 15 requires route handler params to be async/Promise
**Affected File:** `app/api/orders/[id]/route.ts`
**Fix Required:** Update route handler signature to:
```typescript
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  // ... rest of code
}
```

#### Error 2: PATCH route handler signature
```
.next/types/app/api/orders/[id]/route.ts(283,7): error TS2344:
Same issue as GET handler
```

**Fix Required:** Same as above for PATCH handler

---

## Category 2: Playwright/E2E Testing Errors (149 errors)

### Root Cause:
Missing `@playwright/test` types - these are dev dependencies not installed in production TypeScript check

### Files Affected (22 files):
1. `e2e/fixtures/mock-data.ts` - 3 errors
2. `e2e/flows/add-recommendations.spec.ts` - 14 errors
3. `e2e/flows/preview-recommendations.spec.ts` - 15 errors
4. `e2e/flows/preview-reserved-items.spec.ts` - 15 errors
5. `e2e/front-desk-upsell.spec.ts` - 2 errors
6. `e2e/playwright.config.ts` - 1 error
7. `e2e/support/auth.setup.ts` - 3 errors
8. `e2e/support/commands/api-helpers.ts` - 1 error
9. `e2e/support/commands/test-helpers.ts` - 4 errors
10. `e2e/support/database-setup.ts` - 1 error
11. `e2e/support/global-setup.ts` - 1 error
12. `e2e/support/global-teardown.ts` - 1 error
13. `e2e/support/page-objects/AuthPage.ts` - 3 errors
14. `e2e/support/page-objects/BasePage.ts` - 1 error
15. `e2e/support/page-objects/BookingPage.ts` - 1 error
16. `e2e/support/page-objects/FrontDeskUpsellPage.ts` - 1 error
17. `e2e/support/page-objects/HomePage.ts` - 1 error
18. `e2e/tests/a11y/accessibility.a11y.spec.ts` - 10 errors
19. `e2e/tests/api/orders.api.spec.ts` - 9 errors
20. `e2e/tests/auth/login.spec.ts` - 5 errors
21. `e2e/tests/components/shadcn-ui-integration.spec.ts` - 11 errors
22. `e2e/tests/performance/lighthouse.spec.ts` - 8 errors
23. `e2e/tests/security/security.spec.ts` - 10 errors
24. `e2e/tests/user-flows/booking-journey.spec.ts` - 7 errors
25. `e2e/tests/user-flows/reservation-management.spec.ts` - 12 errors
26. `e2e/tests/visual/homepage.visual.spec.ts` - 7 errors
27. `e2e/utils/test-helpers.ts` - 2 errors

### Common Error Patterns:

#### Pattern 1: Cannot find module '@playwright/test'
```
error TS2307: Cannot find module '@playwright/test' or its corresponding type declarations.
```
**Occurrences:** 27 files
**Solution:** Either:
1. Exclude e2e/ from tsconfig.json (recommended for production builds)
2. Install @playwright/test as devDependency
3. Create separate tsconfig for e2e tests

#### Pattern 2: Implicit 'any' type parameters
```
error TS7031: Binding element 'page' implicitly has an 'any' type.
error TS7006: Parameter 'route' implicitly has an 'any' type.
```
**Occurrences:** ~100 instances
**Solution:** Add proper types from Playwright Test

#### Pattern 3: Private property access
```
error TS2341: Property 'page' is private and only accessible within class 'FrontDeskTestHelpers'.
```
**Occurrences:** ~15 instances
**Solution:** Change private properties to protected or public in test helper classes

#### Pattern 4: Missing exports
```
error TS2305: Module '"../../support/page-objects/BookingPage"' has no exported member 'BookingPage'.
```
**Solution:** Ensure proper exports in page object classes

---

## Category 3: Zustand Store Errors (6 errors)

### Files Affected:
- `stores/reservation-summary-store.ts` - 4 errors
- `stores/user-selections-store.ts` - 2 errors

### Errors:

#### reservation-summary-store.ts:219
```
error TS2349: This expression is not callable.
Each member of the union type has signatures, but none are compatible with each other.
```
**Issue:** Union type ambiguity on array method
**Context:** `.find()` method on BiddingItem[]

#### reservation-summary-store.ts:226
```
error TS2349: This expression is not callable.
```
**Issue:** Same as above for `.filter()` method

#### reservation-summary-store.ts:385
```
error TS2339: Property 'attributes' does not exist on type 'RoomItem | ExtraItem | BiddingItem'.
Property 'attributes' does not exist on type 'ExtraItem'.
```
**Issue:** Missing discriminated union type guard
**Solution:** Add type guard or narrow type before accessing attributes

#### user-selections-store.ts:291
```
error TS2345: Argument of type '{ originalRoomType: string; ... }' is not assignable to parameter
of type 'Partial<RoomItem>'.
Type 'string' is not assignable to type 'AllowedRoomType | null | undefined'.
```
**Issue:** Type mismatch - string not assignable to AllowedRoomType
**Solution:** Cast string to AllowedRoomType or update type definition

#### user-selections-store.ts:295
```
error TS2339: Property 'name' does not exist on type 'RoomOption'.
```
**Issue:** Missing property in type definition

#### user-selections-store.ts:705
```
error TS2345: Same as :291 - originalRoomType type mismatch
```

---

## Category 4: Mock Data Errors (1 error)

### File: lib/data/mock-bookings.ts:109

```
error TS2339: Property 'hasChooseRoom' does not exist on type
'{ hasKey: boolean; hasAlternatives: boolean; hasUpgrade: boolean; roomType: string; }'.
```

**Issue:** Missing property in type definition
**Solution:** Add `hasChooseRoom` to the type or remove usage

---

## Category 5: Utility Type Errors (2 errors)

### File: utils/test-unique-reservation-items.ts

#### Line 81:
```
error TS18048: 'room.attributes' is possibly 'undefined'.
```
**Solution:** Add optional chaining or type guard

#### Line 95:
```
error TS18048: 'bid.attributes' is possibly 'undefined'.
```
**Solution:** Add optional chaining or type guard

---

## Recommended Fix Order

### Phase 1: Exclude E2E Tests (Quick Win)
1. Update `tsconfig.json` to exclude e2e directory from production build
2. Create `tsconfig.e2e.json` for test files
3. This eliminates 149 errors immediately

### Phase 2: Fix API Routes (Critical - 2 errors)
1. Update `app/api/orders/[id]/route.ts` GET handler
2. Update `app/api/orders/[id]/route.ts` PATCH handler
3. These are blocking production builds

### Phase 3: Fix Store Type Errors (6 errors)
1. Fix `reservation-summary-store.ts` union type issues
2. Fix `user-selections-store.ts` type assignments
3. Add proper type guards

### Phase 4: Fix Utility Errors (3 errors)
1. Add optional chaining in `test-unique-reservation-items.ts`
2. Update mock data type in `lib/data/mock-bookings.ts`

---

## tsconfig.json Changes Needed

```json
{
  "exclude": [
    "node_modules",
    ".next",
    "e2e"  // Add this line
  ]
}
```

Create separate `e2e/tsconfig.json`:
```json
{
  "extends": "../tsconfig.json",
  "compilerOptions": {
    "types": ["@playwright/test", "node"]
  },
  "include": [
    "**/*.ts"
  ]
}
```

---

## Success Criteria

- [ ] TypeScript build completes without errors
- [ ] All API routes properly typed for Next.js 15
- [ ] Store type errors resolved
- [ ] E2E tests excluded from main build (but still type-checked separately)
- [ ] Production build succeeds

---

**Status:** Documentation complete ✅
**Next Task:** P0.1.2 - Fix TypeScript Errors - Component Props
