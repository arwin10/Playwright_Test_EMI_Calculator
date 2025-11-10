# 🚀 Quick Setup Guide

## Step-by-Step Installation

### 1️⃣ Install Dependencies

```bash
npm install
```

This will install:
- `@playwright/test` - Playwright test framework
- `typescript` - TypeScript compiler
- `@types/node` - Node.js type definitions
- `dotenv` - Environment variable management
- `allure-playwright` - Allure reporting
- `allure-commandline` - Allure CLI
- `pino` - Fast logger
- `pino-pretty` - Pretty logging

### 2️⃣ Install Playwright Browsers

```bash
npx playwright install --with-deps
```

This installs Chromium, Firefox, and WebKit browsers with system dependencies.

### 3️⃣ Verify Installation

```bash
npx playwright --version
```

### 4️⃣ Run Your First Test

```bash
npm run test:sanity
```

## 🎯 Quick Start Commands

### Run All Tests
```bash
npm test
```

### Run Specific Suite
```bash
npm run test:sanity       # 1-2 minutes
npm run test:smoke        # 3-5 minutes
npm run test:regression   # 10-15 minutes
npm run test:negative     # 5-7 minutes
```

### Run in Different Modes
```bash
npm run test:headed       # See browser actions
npm run test:debug        # Debug with Playwright Inspector
npm run test:ui           # Interactive UI mode
```

### View Reports
```bash
npm run report            # HTML report
npm run allure:serve      # Allure report
```

## 🔧 Configuration Tips

### 1. Adjust Parallelization
Edit `playwright.config.ts`:
```typescript
workers: process.env.CI ? 2 : 4,  // Change 4 to your CPU cores
```

### 2. Change Base URL
Edit `.env`:
```bash
DEV_BASE_URL=https://your-url.com
```

### 3. Disable Headless Mode
Edit `.env`:
```bash
HEADLESS=false
```

### 4. Increase Timeout
Edit `.env`:
```bash
TIMEOUT=60000  # 60 seconds
```

## 📊 Understanding Test Results

### Test Result Symbols
- ✅ **Passed** - Test executed successfully
- ❌ **Failed** - Test failed with assertion error
- ⏭️ **Skipped** - Test was skipped
- 🔄 **Flaky** - Test passed after retry

### Where to Find Results
- Console output
- `playwright-report/index.html`
- `allure-report/index.html`
- `reports/test-results.json`

## 🐛 Troubleshooting

### Issue: Browsers not installed
```bash
npx playwright install --with-deps
```

### Issue: Port conflict
Check if port 3000 is free or change in config.

### Issue: Timeout errors
Increase timeout in `.env` or `playwright.config.ts`.

### Issue: Selector not found
- Website structure may have changed
- Update selectors in `pages/HomePage.ts`
- Use Playwright Inspector: `npm run test:debug`

### Issue: Module not found
```bash
rm -rf node_modules package-lock.json
npm install
```

## 🎓 Learning Resources

- **Playwright Docs**: https://playwright.dev
- **TypeScript Docs**: https://www.typescriptlang.org
- **Allure Docs**: https://docs.qameta.io/allure/

## 📝 Next Steps

1. ✅ Run sanity tests to verify setup
2. ✅ Explore test files in `tests/` directory
3. ✅ Check Page Object Model in `pages/`
4. ✅ Review utilities in `utils/`
5. ✅ Customize test data in `utils/testData.json`
6. ✅ Add your own test cases
7. ✅ Configure CI/CD pipeline

## 💡 Pro Tips

1. **Use UI Mode for Development**
   ```bash
   npm run test:ui
   ```
   
2. **Use Codegen to Generate Tests**
   ```bash
   npx playwright codegen https://www.calculateyouremi.in
   ```

3. **Run Specific Test**
   ```bash
   npx playwright test tests/sanity/homePage.sanity.spec.ts:7
   ```

4. **Show Browser**
   ```bash
   npx playwright test --headed --project=chromium
   ```

5. **Trace Viewer**
   ```bash
   npx playwright show-trace trace.zip
   ```

---

**You're all set! Happy Testing! 🎉**
