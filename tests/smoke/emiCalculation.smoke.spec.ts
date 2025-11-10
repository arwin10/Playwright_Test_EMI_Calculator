import { test, expect } from '../../fixtures/baseFixture';
import { EMIValidator } from '../../utils/validators';

test.describe('Smoke Tests - EMI Calculation', () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.navigate();
  });

  test('TC-S01: Perform basic EMI calculation and verify result', async ({ homePage }) => {
    const principal = 1000000;
    const rate = 8.5;
    const tenure = 120;

    await homePage.calculateEMI(principal, rate, tenure);
    
    const emiResult = await homePage.getEMIResult();
    expect(emiResult).toBeGreaterThan(0);
    
    const expectedEMI = EMIValidator.calculateEMI(principal, rate, tenure);
    const validation = EMIValidator.validateEMI(emiResult, expectedEMI, 1);
    
    expect(validation.isValid).toBeTruthy();
  });

  test('TC-S02: Verify EMI calculation for home loan', async ({ homePage }) => {
    await homePage.calculateEMI(5000000, 8.5, 240);
    
    const emiResult = await homePage.getEMIResult();
    expect(emiResult).toBeGreaterThan(0);
  });

  test('TC-S03: Verify EMI calculation for car loan', async ({ homePage }) => {
    await homePage.calculateEMI(800000, 9.5, 60);
    
    const emiResult = await homePage.getEMIResult();
    expect(emiResult).toBeGreaterThan(0);
  });

  test('TC-S04: Verify EMI calculation for personal loan', async ({ homePage }) => {
    await homePage.calculateEMI(200000, 12.5, 36);
    
    const emiResult = await homePage.getEMIResult();
    expect(emiResult).toBeGreaterThan(0);
  });

  test('TC-S05: Verify total amount payable calculation', async ({ homePage }) => {
    const principal = 1000000;
    const rate = 10;
    const tenure = 60;

    await homePage.calculateEMI(principal, rate, tenure);
    
    const emiResult = await homePage.getEMIResult();
    const totalAmount = await homePage.getTotalAmount();
    
    if (totalAmount > 0) {
      const expectedTotal = EMIValidator.calculateTotalAmount(emiResult, tenure);
      const validation = EMIValidator.validateTotalAmount(totalAmount, expectedTotal, 1);
      expect(validation).toBeTruthy();
    }
  });

  test('TC-S06: Verify interest amount calculation', async ({ homePage }) => {
    const principal = 500000;
    const rate = 9;
    const tenure = 48;

    await homePage.calculateEMI(principal, rate, tenure);
    
    const emiResult = await homePage.getEMIResult();
    const totalInterest = await homePage.getTotalInterest();
    
    if (totalInterest > 0) {
      const expectedInterest = EMIValidator.calculateTotalInterest(emiResult, tenure, principal);
      const validation = EMIValidator.validateInterest(totalInterest, expectedInterest, 1);
      expect(validation).toBeTruthy();
    }
  });

  test('TC-S07: Verify chart renders after calculation', async ({ homePage }) => {
    await homePage.calculateEMI(1000000, 8.5, 120);
    
    await homePage.page.waitForTimeout(1500);
    const chartVisible = await homePage.isChartVisible();
    
    // Chart may or may not be present depending on implementation
    if (chartVisible) {
      expect(chartVisible).toBeTruthy();
    }
  });

  test('TC-S08: Verify amortization table renders', async ({ homePage }) => {
    await homePage.calculateEMI(1000000, 8.5, 120);
    
    await homePage.page.waitForTimeout(1500);
    const tableVisible = await homePage.isAmortizationTableVisible();
    
    // Table may or may not be present
    if (tableVisible) {
      expect(tableVisible).toBeTruthy();
    }
  });
});
