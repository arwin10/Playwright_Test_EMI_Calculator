# 📋 Test Plan - EMI Calculator

## 1. Introduction

### 1.1 Purpose
This document outlines the test strategy for the EMI Calculator application at https://www.calculateyouremi.in

### 1.2 Scope
- Functional testing of EMI calculation
- UI/UX validation
- Performance testing
- Cross-browser compatibility
- Responsive design testing
- Error handling and validation

### 1.3 Test Objectives
- Verify accurate EMI calculations
- Ensure user-friendly interface
- Validate error handling
- Confirm performance benchmarks
- Test across multiple devices/browsers

## 2. Test Strategy

### 2.1 Test Levels

#### Sanity Tests (Priority: Critical)
- Quick validation of core functionality
- Execution time: 1-2 minutes
- Frequency: Every commit
- Scope: Basic UI and functionality checks

#### Smoke Tests (Priority: High)
- Critical path validation
- Execution time: 3-5 minutes
- Frequency: Every build
- Scope: End-to-end user journeys

#### Regression Tests (Priority: Medium)
- Comprehensive feature coverage
- Execution time: 10-15 minutes
- Frequency: Before release
- Scope: All features and edge cases

#### Negative Tests (Priority: Medium)
- Error handling validation
- Execution time: 5-7 minutes
- Frequency: Weekly
- Scope: Invalid inputs and error scenarios

### 2.2 Test Types

1. **Functional Testing**
   - EMI calculation accuracy
   - Form input validation
   - Result display verification
   - Navigation testing

2. **UI/UX Testing**
   - Element visibility
   - Layout consistency
   - Responsive design
   - Accessibility

3. **Performance Testing**
   - Page load time < 3s
   - Calculation response time < 2s
   - Resource utilization

4. **Compatibility Testing**
   - Chrome, Firefox, Safari
   - Desktop, Tablet, Mobile
   - Different screen resolutions

5. **Security Testing**
   - Input sanitization
   - XSS prevention
   - CSRF protection (if applicable)

## 3. Test Scenarios

### 3.1 Sanity Test Cases (8 tests)

| ID | Test Case | Priority | Expected Result |
|----|-----------|----------|-----------------|
| TC-01 | Homepage loads | Critical | Page loads in < 3s |
| TC-02 | Calculator form visible | Critical | All inputs present |
| TC-03 | Header present | High | Header displays correctly |
| TC-04 | Footer present | High | Footer displays correctly |
| TC-05 | Page title correct | Medium | Title contains "EMI" |
| TC-06 | Inputs accept values | Critical | Values entered successfully |
| TC-07 | Calculate button works | Critical | Button triggers calculation |
| TC-08 | Meta tags exist | Low | Meta data present |

### 3.2 Smoke Test Cases (15 tests)

| ID | Test Case | Priority | Expected Result |
|----|-----------|----------|-----------------|
| TC-S01 | Basic EMI calculation | Critical | Accurate result displayed |
| TC-S02 | Home loan calculation | Critical | EMI > 0 |
| TC-S03 | Car loan calculation | High | EMI > 0 |
| TC-S04 | Personal loan calculation | High | EMI > 0 |
| TC-S05 | Total amount validation | High | Correct total amount |
| TC-S06 | Interest validation | High | Correct interest |
| TC-S07 | Chart rendering | Medium | Chart displays |
| TC-S08 | Table rendering | Medium | Table displays |
| TC-R01 | Desktop viewport | High | Works on 1920x1080 |
| TC-R02 | Tablet viewport | High | Works on 768x1024 |
| TC-R03 | Mobile viewport | Critical | Works on 375x812 |
| TC-R04 | Large desktop | Medium | Works on 2560x1440 |
| TC-P01 | Page load time | Critical | < 3 seconds |
| TC-P02 | Load metrics | High | Acceptable metrics |
| TC-P03 | Calculation speed | High | < 3 seconds |

### 3.3 Regression Test Cases (25+ tests)

| Category | Test Count | Priority |
|----------|------------|----------|
| Data-driven tests | 6 | High |
| Dynamic updates | 5 | High |
| SEO validation | 8 | Medium |
| Navigation | 5 | Medium |
| Edge cases | 6+ | High |

### 3.4 Negative Test Cases (20+ tests)

| Category | Test Count | Priority |
|----------|------------|----------|
| Input validation | 13 | High |
| Error handling | 10 | High |
| Boundary values | 6 | Medium |
| Network errors | 3 | Medium |

## 4. Test Data

### 4.1 Valid Test Data
- Principal: 10,000 to 100,000,000
- Rate: 0.1% to 30%
- Tenure: 1 to 360 months

### 4.2 Edge Cases
- Minimum values
- Maximum values
- Decimal rates
- Boundary values

### 4.3 Invalid Test Data
- Zero/negative values
- Non-numeric characters
- Special characters
- Overflow values

## 5. Test Environment

### 5.1 Browsers
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

### 5.2 Devices
- Desktop (1920x1080, 2560x1440)
- Tablet (768x1024)
- Mobile (375x812, 414x896)

### 5.3 Operating Systems
- macOS
- Windows
- Linux (Ubuntu)
- iOS
- Android

## 6. Entry and Exit Criteria

### 6.1 Entry Criteria
- Application deployed
- Test environment ready
- Test data prepared
- Test scripts ready

### 6.2 Exit Criteria
- All critical tests pass
- 95%+ pass rate for high priority
- 90%+ pass rate overall
- No critical/blocker bugs
- Performance benchmarks met

## 7. Test Schedule

| Phase | Duration | Tests |
|-------|----------|-------|
| Sanity | 1-2 min | 8 tests |
| Smoke | 3-5 min | 15 tests |
| Regression | 10-15 min | 25+ tests |
| Negative | 5-7 min | 20+ tests |
| **Total** | **20-30 min** | **68+ tests** |

## 8. Risk Assessment

### 8.1 High Risk Areas
- EMI calculation accuracy
- Mobile responsiveness
- Browser compatibility
- Performance on slow networks

### 8.2 Mitigation Strategies
- Mathematical validation
- Cross-browser testing
- Performance monitoring
- Retry logic for flaky tests

## 9. Defect Management

### 9.1 Severity Levels
- **Critical**: Application crash, incorrect calculation
- **High**: Major functionality broken
- **Medium**: Minor functionality issues
- **Low**: Cosmetic issues

### 9.2 Bug Reporting
- Detailed description
- Steps to reproduce
- Screenshots/videos
- Environment details
- Expected vs actual behavior

## 10. Test Deliverables

1. Test scripts (TypeScript)
2. Test reports (HTML, Allure)
3. Screenshots on failure
4. Performance metrics
5. Test summary report
6. Bug reports

## 11. Test Metrics

### 11.1 Key Metrics
- Test execution rate
- Pass/fail percentage
- Defect density
- Test coverage
- Execution time
- Flaky test rate

### 11.2 Success Criteria
- Pass rate > 95%
- Zero critical bugs
- Performance benchmarks met
- All browsers supported
- Mobile compatibility confirmed

## 12. Tools and Technologies

- **Framework**: Playwright
- **Language**: TypeScript
- **Reporting**: Allure, HTML
- **CI/CD**: GitHub Actions
- **Version Control**: Git
- **Logging**: Pino
- **Data Management**: JSON

## 13. Responsibilities

| Role | Responsibility |
|------|----------------|
| Test Lead | Strategy, planning, review |
| Automation Engineer | Script development, maintenance |
| QA Engineer | Test execution, reporting |
| Developer | Bug fixes, support |
| DevOps | CI/CD, infrastructure |

## 14. Approvals

| Name | Role | Signature | Date |
|------|------|-----------|------|
| | Test Lead | | |
| | Project Manager | | |
| | Development Lead | | |

---

**Document Version**: 1.0  
**Last Updated**: 2024  
**Review Cycle**: Quarterly
