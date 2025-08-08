# Comprehensive Playwright E2E Testing Suite

A complete end-to-end testing framework for Next.js/React applications with advanced testing capabilities including cross-browser testing, visual regression, accessibility testing, API testing, and performance monitoring.

## 🏗️ Architecture Overview

```
e2e/
├── tests/                          # Organized test suites
│   ├── auth/                       # Authentication tests
│   ├── user-flows/                 # Complete user journey tests
│   ├── api/                        # API endpoint testing
│   ├── visual/                     # Visual regression tests
│   ├── a11y/                       # Accessibility tests
│   ├── performance/                # Performance & Core Web Vitals
│   └── security/                   # Security testing
├── flows/                          # Legacy flow tests (preserved)
├── fixtures/                       # Test data and utilities
│   ├── test-data.ts                # Centralized test data
│   └── mock-data.ts                # Mock data helpers
├── support/                        # Test infrastructure
│   ├── page-objects/               # Page Object Model classes
│   ├── commands/                   # Reusable test commands
│   ├── global-setup.ts             # Global test setup
│   ├── global-teardown.ts          # Global test cleanup
│   └── auth.setup.ts               # Authentication setup
├── playwright.config.ts            # Comprehensive Playwright config
└── README.md                       # This documentation
```

## 🚀 Quick Start

### Prerequisites

1. **Node.js & pnpm**: Ensure you have Node.js 18+ and pnpm installed
2. **Development Server**: Start your Next.js application:
   ```bash
   pnpm run dev
   ```

### Installation

```bash
# Install Playwright browsers (required first time)
pnpm run test:e2e:install-deps

# Or just install browsers without system dependencies
pnpm run test:e2e:install
```

### Running Tests

```bash
# Run all E2E tests
pnpm run test:e2e

# Run with interactive UI mode
pnpm run test:e2e:ui

# Run in headed mode (visible browser)
pnpm run test:e2e:headed

# Debug mode with pause capabilities
pnpm run test:e2e:debug
```

## 🎯 Test Categories

### Authentication Testing
```bash
pnpm run test:e2e:auth
```
- User login/logout flows
- Authentication state management
- Protected route access
- Session handling

### API Testing
```bash
pnpm run test:e2e:api
```
- REST API endpoint validation
- Request/response testing
- Data consistency checks
- Error handling verification

### Visual Regression Testing
```bash
pnpm run test:e2e:visual
```
- Screenshot comparison testing
- Cross-browser visual consistency
- Dark mode testing
- Component visual validation

### Accessibility Testing
```bash
pnpm run test:e2e:a11y
```
- WCAG 2.1 AA compliance
- Screen reader compatibility
- Keyboard navigation testing
- Color contrast validation

### Performance Testing
```bash
pnpm run test:e2e:performance
```
- Core Web Vitals monitoring
- Resource loading optimization
- Network throttling simulation
- Performance threshold validation

### Security Testing
```bash
pnpm run test:e2e:security
```
- XSS prevention testing
- CSRF protection validation
- Input sanitization checks
- Authentication security

### User Flow Testing
```bash
pnpm run test:e2e:flows
```
- Complete booking journeys
- Multi-step form processes
- Complex user interactions
- State management validation

## 🖥️ Cross-Browser & Device Testing

### Desktop Testing
```bash
pnpm run test:e2e:desktop
```
Runs tests across:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Microsoft Edge (latest)

### Mobile Testing
```bash
pnpm run test:e2e:mobile
```
Runs tests on:
- Mobile Chrome (Pixel 5)
- Mobile Safari (iPhone 12)
- Samsung Galaxy S9+
- iPad Pro

## 📊 Reporting & Analysis

### Generate Test Reports
```bash
# View HTML report
pnpm run test:e2e:report

# Run tests and automatically open report
pnpm run test:e2e && pnpm run test:e2e:report
```

### Report Formats
- **HTML Report**: Interactive browser-based report
- **JSON Report**: Machine-readable test results
- **JUnit Report**: CI/CD integration format
- **GitHub Actions**: Native GitHub integration

## 🔧 Configuration Features

### Comprehensive Browser Coverage
- **Desktop**: Chrome, Firefox, Safari, Edge
- **Mobile**: iPhone, Android devices
- **Tablet**: iPad Pro support
- **Dark Mode**: Automated dark theme testing
- **Performance**: Network throttling simulation

### Advanced Testing Capabilities
- **Visual Testing**: Screenshot comparison with tolerance settings
- **Accessibility**: Automated axe-core integration
- **Performance**: Core Web Vitals and Lighthouse metrics
- **API Testing**: Full REST API validation
- **Security**: XSS, CSRF, and input validation testing

### Smart Test Organization
- **Setup Dependencies**: Automated test environment preparation
- **Parallel Execution**: Fast test runs with intelligent parallelization
- **Retry Logic**: Automatic retry for flaky tests
- **Global Setup/Teardown**: Environment management

## 🧪 Page Object Model

### Base Page Class
```typescript
import { BasePage } from './support/page-objects/BasePage';

class MyPage extends BasePage {
  constructor(page: Page) {
    super(page, '/my-route');
  }
}
```

### Available Page Objects
- **HomePage**: Landing page interactions
- **AuthPage**: Authentication flows
- **BookingPage**: Booking process management
- **BasePage**: Common page functionality

## 📋 Test Data Management

### Centralized Test Data
```typescript
import { TestData } from '../fixtures/test-data';

const userData = TestData.getValidUser();
const bookingData = TestData.getBookingData();
```

### Mock Data Helpers
```typescript
import { MockDataHelpers } from '../fixtures/mock-data';

// Create mock reservations
const mockReservation = MockDataHelpers.createMockReservation();

// Setup API mocking
await MockDataHelpers.mockApiResponse(page, 'api/orders', mockData);
```

## 🛠️ Development Workflow

### Adding New Tests

1. **Create Test File**: Place in appropriate category folder
2. **Use Page Objects**: Leverage existing page object models
3. **Follow Naming Convention**: `feature-name.spec.ts`
4. **Add Test Data**: Use centralized test data classes
5. **Update Scripts**: Add new npm scripts if needed

### Test Organization Guidelines

```typescript
test.describe('Feature Name', () => {
  test.beforeEach(async ({ page }) => {
    // Setup for each test
  });

  test('should perform specific action', async ({ page }) => {
    // Test implementation
  });
});
```

## 📈 CI/CD Integration

### GitHub Actions Integration
```yaml
- name: Run E2E Tests
  run: |
    pnpm install
    pnpm run test:e2e:install-deps
    pnpm run test:e2e
```

### Environment Variables
```bash
# Test environment configuration
PLAYWRIGHT_TEST_BASE_URL=http://localhost:3000
NODE_ENV=test
NEXT_TELEMETRY_DISABLED=1
```

## 🐛 Debugging & Troubleshooting

### Debug Mode
```bash
# Interactive debugging
pnpm run test:e2e:debug

# Run specific test with debugging
npx playwright test tests/auth/login.spec.ts --debug
```

### Common Issues

**Test Timeouts**
- Increase timeout in specific tests
- Check network conditions
- Verify server is running

**Element Not Found**
- Update selectors after UI changes
- Use data-testid attributes
- Check element visibility timing

**Visual Test Failures**
```bash
# Update visual baselines
pnpm run test:e2e:update-snapshots
```

## 📚 Best Practices

### Test Writing Guidelines
1. **Use Data Test IDs**: `data-testid="element-name"`
2. **Wait for Elements**: Use proper wait strategies
3. **Handle Dynamic Content**: Account for loading states
4. **Isolate Tests**: Ensure test independence
5. **Clear Test Names**: Describe what the test validates

### Performance Optimization
- Use `page.waitForLoadState('networkidle')` sparingly
- Implement smart waiting strategies
- Leverage parallel test execution
- Mock external API calls when appropriate

### Maintenance Strategy
- Regular test review and updates
- Monitor test stability metrics
- Update selectors proactively
- Maintain comprehensive documentation

## 🔗 Integration Points

### Existing Front Desk Tests
The comprehensive setup preserves and enhances existing Front Desk Upsell functionality tests while adding extensive new capabilities.

### API Integration
Tests validate both UI interactions and underlying API responses for complete coverage.

### Performance Monitoring
Integrated performance testing ensures Core Web Vitals remain within acceptable thresholds.

## 📖 Additional Resources

- [Playwright Documentation](https://playwright.dev/)
- [Testing Best Practices](https://playwright.dev/docs/best-practices)
- [Page Object Model Guide](https://playwright.dev/docs/pom)
- [Accessibility Testing](https://playwright.dev/docs/accessibility-testing)
- [Visual Testing Guide](https://playwright.dev/docs/test-screenshots)

---

This comprehensive E2E testing suite provides enterprise-grade testing capabilities ensuring application quality, performance, and accessibility across all supported browsers and devices.