# Front Desk Upsell E2E Tests

Comprehensive end-to-end tests for the Front Desk Upsell functionality, covering three main user flows:

1. **Preview Reserved Items** - Users viewing existing reservations with reserved items
2. **Preview Recommendations** - Users viewing the recommendation interface 
3. **Add Recommendations** - Users adding room upgrades and services to reservations

## Test Structure

```
e2e/
├── flows/                          # Individual flow test files
│   ├── preview-reserved-items.spec.ts    # Flow 1: Preview reserved items
│   ├── preview-recommendations.spec.ts   # Flow 2: Preview recommendations  
│   └── add-recommendations.spec.ts       # Flow 3: Add recommendations
├── utils/                          # Test utilities and helpers
│   └── test-helpers.ts             # Common test functions and data validation
├── front-desk-upsell.spec.ts      # Main comprehensive test suite
├── playwright.config.ts           # Playwright configuration
└── README.md                       # This file
```

## Key Test Features

### 🎯 **Dynamic Data Testing**
- Tests don't rely on static data or specific reservations
- Dynamically finds reservations with "reserved items" or "Recommend" buttons
- Validates data formats and calculations without hardcoded values

### 🔄 **Flow-Based Testing**
- Each test covers complete user journeys, not just individual components
- Tests realistic user interactions and state management
- Validates cross-flow navigation and tab management

### 🛡️ **Robust Error Handling**
- Tests handle edge cases like empty states and missing data
- Validates proper loading states and error conditions
- Includes fallback testing for different UI configurations

## Test Coverage

### Flow 1: Preview Reserved Items
- ✅ Opening reservation summary from reserved items button
- ✅ Validating service tables and status indicators  
- ✅ Testing tab management and navigation
- ✅ Verifying commission calculations
- ✅ Handling multiple reserved item tabs

### Flow 2: Preview Recommendations
- ✅ Opening recommendation interface
- ✅ Validating room upgrade options and pricing
- ✅ Testing customization categories and options
- ✅ Verifying stay enhancement displays
- ✅ Testing carousel navigation (rooms and offers)
- ✅ Validating loyalty discounts and pricing

### Flow 3: Add Recommendations  
- ✅ Adding room upgrades and verifying total updates
- ✅ Adding stay enhancements with quantity controls
- ✅ Testing room customization selections
- ✅ Validating pricing calculations and commission updates
- ✅ Testing clear all selections functionality
- ✅ Complete selection flow with confirmation

## Running the Tests

### Prerequisites

1. **Development Server**: Ensure the Next.js development server is running:
   ```bash
   pnpm run dev
   ```

2. **Playwright Installation**: Install Playwright browsers:
   ```bash
   npx playwright install
   ```

### Test Execution

**Run all E2E tests:**
```bash
npx playwright test
```

**Run specific flow tests:**
```bash
# Flow 1: Preview reserved items
npx playwright test flows/preview-reserved-items.spec.ts

# Flow 2: Preview recommendations  
npx playwright test flows/preview-recommendations.spec.ts

# Flow 3: Add recommendations
npx playwright test flows/add-recommendations.spec.ts
```

**Run with UI mode (interactive):**
```bash
npx playwright test --ui
```

**Run in headed mode (visible browser):**
```bash
npx playwright test --headed
```

**Generate test report:**
```bash
npx playwright show-report
```

### Browser Testing

Tests run across multiple browsers and viewports:
- **Desktop**: Chrome, Firefox, Safari, Edge
- **Mobile**: Chrome (Pixel 5), Safari (iPhone 12)

## Test Helper Classes

### `FrontDeskTestHelpers`
Provides common actions for front desk upsell testing:

```typescript
const helpers = new FrontDeskTestHelpers(page);

// Wait for data to load
await helpers.waitForReservationDataLoad();

// Click first reservation with reserved items
await helpers.clickFirstReservedItemsReservation();

// Add room upgrade
await helpers.addRoomUpgrade();

// Add stay enhancement
await helpers.addStayEnhancement();
```

### `DataValidationHelpers`
Validates data formats and business logic:

```typescript
// Validate reservation data format
DataValidationHelpers.validateReservationData(reservationData);

// Validate commission amount format
DataValidationHelpers.validateCommissionAmount('€123.45');
```

### `MockDataHelpers`
Creates test data when needed:

```typescript
// Create mock reservation
const mockReservation = MockDataHelpers.createMockReservation({
  extras: 'Recommend'
});
```

## Best Practices

### 🎯 **Data Independence**
- Tests find elements dynamically using patterns, not specific text
- Use regex patterns for flexible matching: `/\d+ reserved items?/`
- Validate data formats without hardcoded values

### ⚡ **Performance Optimization**
- Tests wait for actual data loading, not arbitrary timeouts
- Use efficient selectors and avoid overly broad searches
- Batch similar operations to reduce test execution time

### 🔧 **Maintainability**
- Helper functions encapsulate common operations
- Clear test descriptions explain what each test validates
- Modular test structure allows easy addition of new flows

### 🛡️ **Reliability**
- Tests handle different UI states gracefully
- Include proper error handling and edge case testing
- Use appropriate waits and timeouts for dynamic content

## Test Data Requirements

Tests are designed to work with any reservation data that includes:

- **Reserved Items Flow**: Reservations with buttons containing text like "X reserved items"
- **Recommendations Flow**: Reservations with "Recommend" buttons
- **Dynamic Content**: Mock data generation that creates realistic reservation scenarios

## Debugging

### Common Issues

**Test timeouts:**
- Increase timeout in specific tests if needed
- Check if development server is running properly
- Verify network conditions

**Element not found:**
- Check if UI has changed and update selectors
- Verify data is loading properly
- Use `page.pause()` for interactive debugging

**Flaky tests:**
- Add appropriate waits for dynamic content
- Check for race conditions in state updates
- Verify test isolation between runs

### Debug Commands

```bash
# Run with debug mode
npx playwright test --debug

# Run single test with pause
npx playwright test --headed --pause-on-failure

# Generate trace for analysis
npx playwright test --trace on
```

## Contributing

When adding new tests:

1. **Follow naming conventions**: `feature-action.spec.ts`
2. **Use helper functions**: Leverage existing test helpers when possible
3. **Add proper assertions**: Verify both UI state and business logic
4. **Test edge cases**: Include error conditions and empty states
5. **Update documentation**: Keep README and comments current

## Integration with CI/CD

Tests are configured for CI environments:
- Retry failed tests automatically
- Generate HTML reports
- Capture screenshots and videos on failure
- Run in headless mode for performance

Add to CI pipeline:
```yaml
- name: Run E2E Tests
  run: |
    pnpm install
    pnpm run build
    npx playwright install --with-deps
    npx playwright test
```