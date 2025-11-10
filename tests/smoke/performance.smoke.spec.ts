import { test, expect } from '../../fixtures/baseFixture';
import config from '../../utils/config';

test.describe('Smoke Tests - Performance', () => {
  test('TC-P01: Verify page load time is under 3 seconds', async ({ page, homePage }) => {
    const startTime = Date.now();
    await homePage.navigate();
    const loadTime = Date.now() - startTime;
    
    expect(loadTime).toBeLessThan(config.performance.maxLoadTime);
  });

  test('TC-P02: Verify page load metrics', async ({ homePage }) => {
    await homePage.navigate();
    
    const metrics = await homePage.getPageLoadMetrics();
    
    expect(metrics.loadTime).toBeLessThan(5000);
    expect(metrics.responseTime).toBeLessThan(config.performance.maxResponseTime);
  });

  test('TC-P03: Verify calculation response time', async ({ homePage }) => {
    await homePage.navigate();
    await homePage.enterPrincipal(1000000);
    await homePage.enterRate(8.5);
    await homePage.enterTenure(120);
    
    const startTime = Date.now();
    await homePage.clickCalculate();
    await homePage.getEMIResult();
    const responseTime = Date.now() - startTime;
    
    expect(responseTime).toBeLessThan(3000);
  });

  test('TC-P04: Verify multiple rapid calculations', async ({ homePage }) => {
    await homePage.navigate();
    
    const calculations = [
      { principal: 500000, rate: 8, tenure: 60 },
      { principal: 1000000, rate: 9, tenure: 120 },
      { principal: 2000000, rate: 7.5, tenure: 180 },
    ];
    
    for (const calc of calculations) {
      const startTime = Date.now();
      await homePage.calculateEMI(calc.principal, calc.rate, calc.tenure);
      const emiResult = await homePage.getEMIResult();
      const duration = Date.now() - startTime;
      
      expect(emiResult).toBeGreaterThan(0);
      expect(duration).toBeLessThan(3000);
    }
  });
});
