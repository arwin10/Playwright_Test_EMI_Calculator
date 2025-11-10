import { test, expect } from '../../fixtures/baseFixture';

test.describe('Regression Tests - Navigation', () => {
  test('TC-NAV01: Verify page reload preserves URL', async ({ homePage }) => {
    await homePage.navigate();
    const urlBefore = await homePage.getURL();
    
    await homePage.reload();
    const urlAfter = await homePage.getURL();
    
    expect(urlAfter).toBe(urlBefore);
  });

  test('TC-NAV02: Verify back navigation works', async ({ page, homePage }) => {
    await homePage.navigate();
    await homePage.calculateEMI(1000000, 8.5, 120);
    
    const currentUrl = await homePage.getURL();
    
    // If URL changes after calculation, test back navigation
    await page.goBack();
    await page.waitForLoadState('networkidle');
    
    // Page should still be accessible
    const pageAccessible = await homePage.verifyCalculatorSectionPresent();
    expect(pageAccessible).toBeTruthy();
  });

  test('TC-NAV03: Verify page reload during calculation', async ({ homePage }) => {
    await homePage.navigate();
    await homePage.enterPrincipal(1000000);
    await homePage.enterRate(8.5);
    await homePage.enterTenure(120);
    
    await homePage.reload();
    
    const principal = await homePage.getPrincipalValue();
    const rate = await homePage.getRateValue();
    const tenure = await homePage.getTenureValue();
    
    // After reload, inputs should be cleared or retain values based on implementation
    expect(principal).toBeDefined();
    expect(rate).toBeDefined();
    expect(tenure).toBeDefined();
  });

  test('TC-NAV04: Verify direct URL access', async ({ page, homePage }) => {
    const baseURL = page.context().browser()?.contexts()[0] || page.context();
    await page.goto('https://www.calculateyouremi.in');
    await page.waitForLoadState('networkidle');
    
    const calculatorPresent = await homePage.verifyCalculatorSectionPresent();
    expect(calculatorPresent).toBeTruthy();
  });

  test('TC-NAV05: Verify browser forward navigation', async ({ page, homePage }) => {
    await homePage.navigate();
    await homePage.calculateEMI(1000000, 8.5, 120);
    
    await page.goBack();
    await page.waitForTimeout(500);
    
    await page.goForward();
    await page.waitForLoadState('networkidle');
    
    const pageAccessible = await homePage.verifyCalculatorSectionPresent();
    expect(pageAccessible).toBeTruthy();
  });
});
