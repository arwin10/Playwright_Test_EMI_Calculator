# Contributing to Playwright EMI Calculator Test Framework

Thank you for your interest in contributing! This document provides guidelines for contributing to this project.

## 🤝 How to Contribute

### 1. Fork the Repository
```bash
git clone <your-fork-url>
cd Test_EMI_Calculator_Playwright
```

### 2. Create a Feature Branch
```bash
git checkout -b feature/your-feature-name
```

### 3. Make Your Changes
- Follow the existing code style
- Add tests for new features
- Update documentation as needed

### 4. Run Tests
```bash
npm test
npm run test:sanity
```

### 5. Commit Your Changes
```bash
git add .
git commit -m "feat: add new feature"
```

### 6. Push and Create PR
```bash
git push origin feature/your-feature-name
```

## 📝 Coding Standards

### TypeScript Style Guide
- Use TypeScript for all new files
- Use async/await instead of promises
- Use meaningful variable and function names
- Add type annotations where helpful
- Follow the existing folder structure

### Test Writing Guidelines
- One test should verify one behavior
- Use descriptive test names
- Follow AAA pattern (Arrange, Act, Assert)
- Use Page Object Model for UI interactions
- Add appropriate wait conditions
- Clean up after tests

### Example Test Structure
```typescript
test('TC-XX: Should do something specific', async ({ homePage }) => {
  // Arrange
  await homePage.navigate();
  
  // Act
  await homePage.calculateEMI(1000000, 8.5, 120);
  
  // Assert
  const result = await homePage.getEMIResult();
  expect(result).toBeGreaterThan(0);
});
```

## 🏗️ Project Structure Guidelines

### Adding New Page Objects
1. Extend `BasePage` class
2. Add to `pages/` directory
3. Use descriptive selector names
4. Add methods for all page actions
5. Include error handling

### Adding New Tests
1. Choose appropriate suite (sanity/smoke/regression/negative)
2. Use fixtures from `fixtures/`
3. Add test data to `utils/testData.json`
4. Follow naming convention: `featureName.suiteType.spec.ts`

### Adding New Utilities
1. Add to `utils/` directory
2. Export functions/classes
3. Add JSDoc comments
4. Include error handling
5. Add unit tests if complex

## 🧪 Testing Your Changes

### Run All Tests
```bash
npm test
```

### Run Specific Suite
```bash
npm run test:sanity
npm run test:smoke
```

### Run in Debug Mode
```bash
npm run test:debug
```

## 📋 Pull Request Checklist

- [ ] Tests pass locally
- [ ] New tests added for new features
- [ ] Documentation updated
- [ ] Code follows style guidelines
- [ ] Commit messages are clear
- [ ] No console errors or warnings
- [ ] Screenshots/videos attached for UI changes

## 🐛 Reporting Bugs

### Bug Report Template
```markdown
**Description**
Clear description of the bug

**Steps to Reproduce**
1. Step 1
2. Step 2
3. Step 3

**Expected Behavior**
What should happen

**Actual Behavior**
What actually happens

**Screenshots**
If applicable

**Environment**
- OS: [e.g., macOS 12.0]
- Node version: [e.g., 18.0.0]
- Playwright version: [e.g., 1.40.0]
```

## 💡 Feature Requests

### Feature Request Template
```markdown
**Feature Description**
Clear description of the feature

**Use Case**
Why is this feature needed?

**Proposed Solution**
How should it work?

**Alternatives Considered**
Other approaches considered
```

## 📖 Documentation

- Update README.md for major changes
- Add JSDoc comments for functions
- Update SETUP_GUIDE.md if setup changes
- Add examples for complex features

## 🎯 Commit Message Guidelines

Use conventional commits:
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `test:` - Test changes
- `refactor:` - Code refactoring
- `style:` - Code style changes
- `chore:` - Build/config changes

Example:
```
feat: add amortization table validation

- Added table parsing utility
- Added validation for table data
- Updated regression tests
```

## 🔍 Code Review Process

1. All PRs require review
2. Address review comments
3. Ensure CI/CD passes
4. Squash commits if needed
5. Maintainer will merge

## 📞 Questions?

- Open an issue for discussion
- Tag maintainers for urgent matters
- Check existing issues first

---

Thank you for contributing! 🙏
