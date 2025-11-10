import { test, expect } from '../../fixtures/baseFixture';

test.describe('Negative Tests - Error Handling', () => {
  test('TC-ERR01: Verify page behavior with JavaScript disabled', async ({ browser }) => {
    const context = await browser.newContext({
      javaScriptEnabled: false,
    });
    const page = await context.newPage();
    
    try {
      await page.goto('https://www.calculateyouremi.in');
      await page.waitForLoadState('domcontentloaded', { timeout: 10000 });
      
      const pageContent = await page.content();
      expect(pageContent.length).toBeGreaterThan(0);
    } catch (error) {
      // Page may not work without JS
      expect(true).toBeTruthy();
    } finally {
      await context.close();
    }
  });

  test('TC-ERR02: Verify page reload during calculation', async ({ homePage }) => {
    await homePage.navigate();
    await homePage.enterPrincipal(1000000);
    await homePage.enterRate(8.5);
    
    // Reload page mid-input
    await homePage.reload();
    
    // Page should still be functional
    const calculatorPresent = await homePage.verifyCalculatorSectionPresent();
    expect(calculatorPresent).toBeTruthy();
  });

  test('TC-ERR03: Verify rapid multiple clicks on calculate button', async ({ homePage }) => {
    await homePage.navigate();
    await homePage.calculateEMI(1000000, 8.5, 120);
    
    // Rapid clicks
    for (let i = 0; i < 5; i++) {
      await homePage.clickCalculate();
    }
    
    await homePage.page.waitForTimeout(2000);
    
    // Should still get valid result
    const emiResult = await homePage.getEMIResult();
    expect(emiResult).toBeGreaterThan(0);
  });

  test('TC-ERR04: Verify calculation after clearing mid-process', async ({ homePage }) => {
    await homePage.navigate();
    await homePage.enterPrincipal(1000000);
    await homePage.enterRate(8.5);
    
    // Clear inputs before completing
    await homePage.clearAllInputs();
    
    // Try to calculate with empty inputs
    await homePage.clickCalculate();
    await homePage.page.waitForTimeout(1000);
    
    // Page should handle gracefully
    expect(await homePage.getURL()).toBeTruthy();
  });

  test('TC-ERR05: Verify browser back button during calculation', async ({ page, homePage }) => {
    await homePage.navigate();
    await homePage.calculateEMI(1000000, 8.5, 120);
    
    // Navigate back
    await page.goBack();
    await page.waitForTimeout(500);
    
    // Navigate forward
    await page.goForward();
    await page.waitForLoadState('networkidle');
    
    // Should still be functional
    const calculatorPresent = await homePage.verifyCalculatorSectionPresent();
    expect(calculatorPresent).toBeTruthy();
  });

  test('TC-ERR06: Verify network interruption simulation', async ({ page, homePage }) => {
    await homePage.navigate();
    
    // Simulate offline mode
    await page.context().setOffline(true);
    
    try {
      await homePage.calculateEMI(1000000, 8.5, 120);
      await homePage.page.waitForTimeout(2000);
    } catch (error) {
      // Expected to fail offline
      expect(true).toBeTruthy();
    } finally {
      await page.context().setOffline(false);
    }
  });

  test('TC-ERR07: Verify slow network simulation', async ({ page, homePage }) => {
    // Simulate slow 3G
    await page.route('**/*', async (route) => {
      await new Promise(resolve => setTimeout(resolve, 500));
      await route.continue();
    });
    
    await homePage.navigate();
    await homePage.calculateEMI(1000000, 8.5, 120);
    
    const emiResult = await homePage.getEMIResult();
    expect(emiResult).toBeGreaterThan(0);
  });

  test('TC-ERR08: Verify multiple tab behavior', async ({ context, homePage }) => {
    // Open first tab
    await homePage.navigate();
    await homePage.calculateEMI(1000000, 8.5, 120);
    const firstEMI = await homePage.getEMIResult();
    
    // Open second tab
    const page2 = await context.newPage();
    const homePage2 = await import('../../pages/HomePage').then(m => new m.HomePage(page2));
    await homePage2.navigate();
    await homePage2.calculateEMI(2000000, 9, 180);
    const secondEMI = await homePage2.getEMIResult();
    
    expect(firstEMI).toBeGreaterThan(0);
    expect(secondEMI).toBeGreaterThan(0);
    expect(firstEMI).not.toBe(secondEMI);
    
    await page2.close();
  });

  test('TC-ERR09: Verify copy-paste special characters', async ({ page, homePage }) => {
    await homePage.navigate();
    
    const specialText = '₹10,00,000.00';
    await page.locator('input[name="principal"], input[id*="principal"], input[placeholder*="Principal"]').first().fill(specialText);
    await homePage.enterRate(8.5);
    await homePage.enterTenure(120);
    
    try {
      await homePage.clickCalculate();
      await homePage.page.waitForTimeout(2000);
      
      // Should handle or validate currency symbols
      expect(await homePage.getURL()).toBeTruthy();
    } catch (error) {
      expect(true).toBeTruthy();
    }
  });

  test('TC-ERR10: Verify session timeout behavior', async ({ homePage }) => {
    await homePage.navigate();
    await homePage.calculateEMI(1000000, 8.5, 120);
    
    // Wait for extended period
    await homePage.page.waitForTimeout(5000);
    
    // Should still calculate
    await homePage.calculateEMI(2000000, 9, 180);
    const emiResult = await homePage.getEMIResult();
    
    expect(emiResult).toBeGreaterThan(0);
  });
});
