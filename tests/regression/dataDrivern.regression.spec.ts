import { test, expect } from '../../fixtures/testDataFixture';
import { EMIValidator } from '../../utils/validators';

test.describe('Regression Tests - Data Driven', () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.navigate();
  });

  test('TC-DD01: Verify EMI calculation with multiple valid inputs', async ({ homePage, validTestData }) => {
    for (const testCase of validTestData.slice(0, 5)) {
      await homePage.calculateEMI(testCase.principal, testCase.rate, testCase.tenure);
      
      const emiResult = await homePage.getEMIResult();
      expect(emiResult).toBeGreaterThan(0);
      
      const expectedEMI = EMIValidator.calculateEMI(
        testCase.principal,
        testCase.rate,
        testCase.tenure
      );
      
      const validation = EMIValidator.validateEMI(emiResult, expectedEMI, 1);
      expect(validation.isValid).toBeTruthy();
      
      await homePage.clearAllInputs();
    }
  });

  test('TC-DD02: Verify edge case calculations', async ({ homePage, edgeCaseData }) => {
    for (const testCase of edgeCaseData) {
      await homePage.calculateEMI(testCase.principal, testCase.rate, testCase.tenure);
      
      const emiResult = await homePage.getEMIResult();
      expect(emiResult).toBeGreaterThan(0);
      
      await homePage.clearAllInputs();
    }
  });

  test('TC-DD03: Verify decimal rate handling', async ({ homePage }) => {
    const testCases = [
      { principal: 1000000, rate: 8.25, tenure: 120 },
      { principal: 1000000, rate: 8.75, tenure: 120 },
      { principal: 1000000, rate: 8.125, tenure: 120 },
    ];

    for (const testCase of testCases) {
      await homePage.calculateEMI(testCase.principal, testCase.rate, testCase.tenure);
      
      const emiResult = await homePage.getEMIResult();
      const expectedEMI = EMIValidator.calculateEMI(
        testCase.principal,
        testCase.rate,
        testCase.tenure
      );
      
      const validation = EMIValidator.validateEMI(emiResult, expectedEMI, 1);
      expect(validation.isValid).toBeTruthy();
      
      await homePage.clearAllInputs();
    }
  });

  test('TC-DD04: Verify various tenure periods', async ({ homePage }) => {
    const principal = 1000000;
    const rate = 8.5;
    const tenures = [12, 24, 36, 60, 120, 180, 240, 300, 360];

    for (const tenure of tenures) {
      await homePage.calculateEMI(principal, rate, tenure);
      
      const emiResult = await homePage.getEMIResult();
      expect(emiResult).toBeGreaterThan(0);
      
      await homePage.clearAllInputs();
    }
  });

  test('TC-DD05: Verify various principal amounts', async ({ homePage }) => {
    const rate = 8.5;
    const tenure = 120;
    const principals = [100000, 500000, 1000000, 2500000, 5000000, 10000000];

    for (const principal of principals) {
      await homePage.calculateEMI(principal, rate, tenure);
      
      const emiResult = await homePage.getEMIResult();
      expect(emiResult).toBeGreaterThan(0);
      
      await homePage.clearAllInputs();
    }
  });

  test('TC-DD06: Verify various interest rates', async ({ homePage }) => {
    const principal = 1000000;
    const tenure = 120;
    const rates = [6.5, 7.0, 7.5, 8.0, 8.5, 9.0, 9.5, 10.0, 11.0, 12.0];

    for (const rate of rates) {
      await homePage.calculateEMI(principal, rate, tenure);
      
      const emiResult = await homePage.getEMIResult();
      expect(emiResult).toBeGreaterThan(0);
      
      await homePage.clearAllInputs();
    }
  });
});
