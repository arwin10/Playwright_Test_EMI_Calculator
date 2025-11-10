import { test, expect } from '../../fixtures/baseFixture';

test.describe('Smoke Tests - Responsive Design', () => {
  test('TC-R01: Verify desktop viewport functionality', async ({ page, homePage }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await homePage.navigate();
    
    await homePage.calculateEMI(1000000, 8.5, 120);
    const emiResult = await homePage.getEMIResult();
    
    expect(emiResult).toBeGreaterThan(0);
  });

  test('TC-R02: Verify tablet viewport functionality', async ({ page, homePage }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await homePage.navigate();
    
    const calculatorPresent = await homePage.verifyCalculatorSectionPresent();
    expect(calculatorPresent).toBeTruthy();
    
    await homePage.calculateEMI(500000, 9, 60);
    const emiResult = await homePage.getEMIResult();
    
    expect(emiResult).toBeGreaterThan(0);
  });

  test('TC-R03: Verify mobile viewport functionality', async ({ page, homePage }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await homePage.navigate();
    
    const calculatorPresent = await homePage.verifyCalculatorSectionPresent();
    expect(calculatorPresent).toBeTruthy();
    
    await homePage.calculateEMI(300000, 10, 36);
    const emiResult = await homePage.getEMIResult();
    
    expect(emiResult).toBeGreaterThan(0);
  });

  test('TC-R04: Verify large desktop viewport', async ({ page, homePage }) => {
    await page.setViewportSize({ width: 2560, height: 1440 });
    await homePage.navigate();
    
    await homePage.verifyPageLoaded();
    const calculatorPresent = await homePage.verifyCalculatorSectionPresent();
    
    expect(calculatorPresent).toBeTruthy();
  });
});
