import { test, expect } from '../../fixtures/baseFixture';

test.describe('Regression Tests - Dynamic Updates', () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.navigate();
  });

  test('TC-DU01: Verify EMI updates when principal changes', async ({ homePage }) => {
    await homePage.calculateEMI(1000000, 8.5, 120);
    const firstEMI = await homePage.getEMIResult();
    
    await homePage.enterPrincipal(2000000);
    await homePage.clickCalculate();
    const secondEMI = await homePage.getEMIResult();
    
    expect(secondEMI).toBeGreaterThan(firstEMI);
  });

  test('TC-DU02: Verify EMI updates when rate changes', async ({ homePage }) => {
    await homePage.calculateEMI(1000000, 8.5, 120);
    const firstEMI = await homePage.getEMIResult();
    
    await homePage.enterRate(10);
    await homePage.clickCalculate();
    const secondEMI = await homePage.getEMIResult();
    
    expect(secondEMI).toBeGreaterThan(firstEMI);
  });

  test('TC-DU03: Verify EMI updates when tenure changes', async ({ homePage }) => {
    await homePage.calculateEMI(1000000, 8.5, 120);
    const firstEMI = await homePage.getEMIResult();
    
    await homePage.enterTenure(60);
    await homePage.clickCalculate();
    const secondEMI = await homePage.getEMIResult();
    
    expect(secondEMI).toBeGreaterThan(firstEMI);
  });

  test('TC-DU04: Verify recalculation after clearing inputs', async ({ homePage }) => {
    await homePage.calculateEMI(1000000, 8.5, 120);
    const firstEMI = await homePage.getEMIResult();
    
    await homePage.clearAllInputs();
    await homePage.calculateEMI(500000, 9, 60);
    const secondEMI = await homePage.getEMIResult();
    
    expect(secondEMI).not.toBe(firstEMI);
    expect(secondEMI).toBeGreaterThan(0);
  });

  test('TC-DU05: Verify multiple sequential calculations', async ({ homePage }) => {
    const calculations = [
      { principal: 500000, rate: 8, tenure: 60 },
      { principal: 1000000, rate: 9, tenure: 120 },
      { principal: 1500000, rate: 7.5, tenure: 180 },
    ];

    const results: number[] = [];

    for (const calc of calculations) {
      await homePage.calculateEMI(calc.principal, calc.rate, calc.tenure);
      const emiResult = await homePage.getEMIResult();
      results.push(emiResult);
      expect(emiResult).toBeGreaterThan(0);
    }

    expect(results[0]).not.toBe(results[1]);
    expect(results[1]).not.toBe(results[2]);
  });
});
