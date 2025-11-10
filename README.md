# 🎭 Playwright E2E Automation Framework

[![Playwright Tests](https://github.com/YOUR_USERNAME/YOUR_REPO/actions/workflows/playwright-ci.yml/badge.svg)](https://github.com/YOUR_USERNAME/YOUR_REPO/actions/workflows/playwright-ci.yml)
[![PR Checks](https://github.com/YOUR_USERNAME/YOUR_REPO/actions/workflows/pr-checks.yml/badge.svg)](https://github.com/YOUR_USERNAME/YOUR_REPO/actions/workflows/pr-checks.yml)
[![Nightly Tests](https://github.com/YOUR_USERNAME/YOUR_REPO/actions/workflows/nightly-tests.yml/badge.svg)](https://github.com/YOUR_USERNAME/YOUR_REPO/actions/workflows/nightly-tests.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Complete End-to-End Test Automation Framework for [calculateyouremi.in](https://www.calculateyouremi.in) using Playwright with TypeScript.

## 📋 Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Project Structure](#project-structure)
- [Configuration](#configuration)
- [Running Tests](#running-tests)
- [Test Suites](#test-suites)
- [Reporting](#reporting)
- [CI/CD Integration](#cicd-integration)
- [Best Practices](#best-practices)

## ✨ Features

- ✅ **TypeScript-based** - Type-safe test automation
- ✅ **Page Object Model** - Maintainable and scalable architecture
- ✅ **Multiple Test Suites** - Sanity, Smoke, Regression, and Negative tests
- ✅ **Data-Driven Testing** - JSON-based test data management
- ✅ **Parallel Execution** - Fast test execution with sharding
- ✅ **Cross-Browser Testing** - Chrome, Firefox, Safari, and mobile browsers
- ✅ **Allure Reporting** - Beautiful and detailed test reports
- ✅ **CI/CD Ready** - GitHub Actions workflow included
- ✅ **Environment Management** - Multiple environment support
- ✅ **Custom Utilities** - Logger, validators, and helpers

## 📦 Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Git

## 🚀 Installation

1. **Clone the repository**
```bash
cd /Users/arwin10/Documents/Test_EMI_Calculator_Playwright
```

2. **Install dependencies**
```bash
npm install
```

3. **Install Playwright browsers**
```bash
npx playwright install --with-deps
```

4. **Setup environment variables**
```bash
cp .env.example .env
# Edit .env file with your configuration
```

## 📁 Project Structure

```
Test_EMI_Calculator_Playwright/
├── .github/
│   └── workflows/
│       └── playwright-ci.yml       # CI/CD pipeline
├── fixtures/
│   ├── baseFixture.ts              # Base test fixtures
│   └── testDataFixture.ts          # Test data fixtures
├── pages/
│   ├── BasePage.ts                 # Base page class
│   └── HomePage.ts                 # Home page object model
├── tests/
│   ├── sanity/                     # Basic functional checks
│   ├── smoke/                      # Critical path tests
│   ├── regression/                 # Full feature coverage
│   └── negative/                   # Error handling tests
├── utils/
│   ├── config.ts                   # Configuration management
│   ├── helpers.ts                  # Utility functions
│   ├── logger.ts                   # Custom logger
│   ├── validators.ts               # EMI validation logic
│   └── testData.json               # Test data sets
├── reports/                        # Test reports directory
├── playwright.config.ts            # Playwright configuration
├── package.json                    # Dependencies
├── tsconfig.json                   # TypeScript configuration
└── README.md                       # Documentation
```

## ⚙️ Configuration

### Environment Variables (.env)

```bash
ENV=dev                             # Environment: dev, staging, prod
DEV_BASE_URL=https://www.calculateyouremi.in
HEADLESS=true                       # Run browsers in headless mode
TIMEOUT=30000                       # Default timeout
RETRIES=2                           # Test retry attempts
WORKERS=4                           # Parallel workers
SCREENSHOT_ON_FAILURE=true          # Capture screenshots on failure
VIDEO_ON_FAILURE=true               # Record video on failure
TRACE_ON_FAILURE=true               # Enable trace on failure
LOG_LEVEL=info                      # Logging level
```

### Playwright Config

The `playwright.config.ts` supports:
- Multiple browsers (Chromium, Firefox, WebKit)
- Mobile and tablet viewports
- Parallel execution
- Multiple reporters (HTML, JSON, JUnit, Allure)
- Screenshot and video capture
- Trace recording

## 🧪 Running Tests

### Run All Tests
```bash
npm test
```

### Run Specific Test Suite
```bash
npm run test:sanity       # Basic functional checks
npm run test:smoke        # Critical path tests
npm run test:regression   # Full regression suite
npm run test:negative     # Negative test cases
```

### Run Tests in Headed Mode
```bash
npm run test:headed
```

### Run Tests in Debug Mode
```bash
npm run test:debug
```

### Run Tests in UI Mode
```bash
npm run test:ui
```

### Run Tests on Specific Browser
```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
npx playwright test --project=mobile-chrome
```

### Run Specific Test File
```bash
npx playwright test tests/sanity/homePage.sanity.spec.ts
```

### Run Tests with Tag
```bash
npx playwright test --grep @smoke
```

## 📊 Test Suites

### 1. Sanity Suite (tests/sanity/)
Basic smoke tests to verify core functionality:
- Homepage loads successfully
- Calculator form elements present
- Basic navigation works
- Page metadata exists

### 2. Smoke Suite (tests/smoke/)
Critical path end-to-end tests:
- EMI calculations for different loan types
- Result validation with formula
- Responsive design testing
- Performance validation
- Chart and table rendering

### 3. Regression Suite (tests/regression/)
Comprehensive feature coverage:
- Data-driven testing with multiple inputs
- Dynamic updates and recalculations
- SEO and meta tag validation
- Navigation flow testing
- Edge case handling
- Decimal and boundary testing

### 4. Negative Suite (tests/negative/)
Error handling and validation:
- Invalid input validation
- Boundary value testing
- Special character handling
- Network interruption simulation
- Browser compatibility issues
- Session and state management

## 📈 Reporting

### HTML Report
```bash
npm run report
```

### Allure Report
```bash
# Generate report
npm run allure:generate

# Open report
npm run allure:open

# Serve report
npm run allure:serve
```

### View Reports Location
- **HTML Report**: `reports/html-report/index.html`
- **Allure Report**: `allure-report/index.html`
- **JSON Results**: `reports/test-results.json`
- **JUnit Results**: `reports/junit-results.xml`

## 🔄 CI/CD Integration

### GitHub Actions

The project includes a complete CI/CD pipeline (`.github/workflows/playwright-ci.yml`):

**Triggers:**
- Push to main/develop branches
- Pull requests
- Manual workflow dispatch
- Daily scheduled runs (2 AM UTC)

**Jobs:**
- **Sanity**: Quick validation tests
- **Smoke**: Critical path tests
- **Test**: Full test suite with sharding (4 parallel shards)
- **Regression**: Complete regression suite
- **Negative**: Error handling tests
- **Report**: Generate and publish Allure reports

**Artifacts:**
- Test results
- Screenshots on failure
- Videos on failure
- Allure reports
- GitHub Pages deployment (optional)

### Running in CI
```bash
# Set environment variables in GitHub Secrets
ENV=prod
HEADLESS=true
```

## 🧮 EMI Validation

The framework includes a comprehensive EMI validator (`utils/validators.ts`) that:
- Calculates EMI using standard formula: `EMI = [P × R × (1+R)^N] / [(1+R)^N-1]`
- Validates results with configurable tolerance
- Generates amortization schedules
- Validates input ranges
- Calculates total interest and amount payable

## 🛠️ Utilities

### Logger (`utils/logger.ts`)
Custom logger with context and pretty printing:
```typescript
const logger = new Logger('TestContext');
logger.info('Test started');
logger.step('Navigated to home page');
logger.error('Test failed', error);
```

### Helpers (`utils/helpers.ts`)
Reusable functions:
- `waitForPageLoad()` - Wait for page to fully load
- `getElementText()` - Get element text with wait
- `takeScreenshot()` - Capture screenshots
- `parseNumber()` - Parse currency values
- `retryAction()` - Retry failed actions

### Validators (`utils/validators.ts`)
EMI calculation and validation:
- `calculateEMI()` - Calculate expected EMI
- `validateEMI()` - Validate actual vs expected
- `generateAmortizationSchedule()` - Generate payment schedule
- `validateInputRanges()` - Validate input boundaries

## 📝 Test Data Management

Test data is managed in `utils/testData.json`:
- **validTestCases**: Standard test scenarios
- **edgeCases**: Boundary value tests
- **negativeTestCases**: Invalid input tests
- **performanceTestCases**: Performance benchmarks

## 🎯 Best Practices

1. **Page Object Model**: All page interactions through POM
2. **DRY Principle**: Reusable fixtures and utilities
3. **Explicit Waits**: No hard-coded waits
4. **Independent Tests**: Each test can run independently
5. **Descriptive Names**: Clear test and function names
6. **Error Handling**: Graceful error handling with retries
7. **Screenshots**: Automatic capture on failure
8. **Logging**: Detailed logging for debugging
9. **Type Safety**: Full TypeScript type coverage
10. **Code Review**: Follow PR review process

## 🐛 Debugging

### Debug Single Test
```bash
npx playwright test tests/sanity/homePage.sanity.spec.ts --debug
```

### View Trace
```bash
npx playwright show-trace trace.zip
```

### Screenshots
Located in `reports/screenshots/`

### Videos
Located in `test-results/`

## 📞 Support

For issues and questions:
- Create an issue in the repository
- Check Playwright documentation: https://playwright.dev
- Review test logs and reports

## 📄 License

MIT License - feel free to use and modify.

---

**Happy Testing! 🎭**
