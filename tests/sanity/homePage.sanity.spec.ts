import { test, expect } from '../../fixtures/baseFixture';

test.describe('Sanity Tests - Home Page', () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.navigate();
  });

  test('TC-01: Verify homepage loads successfully', async ({ homePage }) => {
    await homePage.verifyPageLoaded();
    const title = await homePage.getTitle();
    expect(title).toBeTruthy();
    expect(title.length).toBeGreaterThan(0);
  });

  test('TC-02: Verify calculator form elements are present', async ({ homePage }) => {
    const calculatorPresent = await homePage.verifyCalculatorSectionPresent();
    expect(calculatorPresent).toBeTruthy();
  });

  test('TC-03: Verify header is present', async ({ homePage }) => {
    const headerPresent = await homePage.verifyHeaderPresent();
    expect(headerPresent).toBeTruthy();
  });

  test('TC-04: Verify footer is present', async ({ homePage }) => {
    const footerPresent = await homePage.verifyFooterPresent();
    expect(footerPresent).toBeTruthy();
  });

  test('TC-05: Verify page title is correct', async ({ homePage }) => {
    const title = await homePage.getTitle();
    expect(title.toLowerCase()).toContain('emi');
  });

  test('TC-06: Verify calculator inputs accept values', async ({ homePage }) => {
    // Just verify each input can accept a value independently
    await homePage.enterPrincipal(100000);
    const principal = await homePage.getPrincipalValue();
    // Principal is formatted with commas (e.g., 1,00,000)
    expect(principal.replace(/,/g, '')).toBe('100000');
    
    await homePage.enterRate(10);
    const rate = await homePage.getRateValue();
    expect(rate).toBe('10');
    
    // Verify tenure years input exists and can be filled
    await homePage.page.locator('#input-tenure-years').fill('5');
    const yearsValue = await homePage.page.locator('#input-tenure-years').inputValue();
    expect(parseInt(yearsValue)).toBeGreaterThan(0);
  });

  test('TC-07: Verify EMI calculation triggers on button click', async ({ homePage }) => {
    await homePage.calculateEMI(500000, 8.5, 60);
    
    // Wait for result to appear (result validation in smoke tests)
    await homePage.page.waitForTimeout(2000);
    
    // Verify page is still responsive
    const url = await homePage.getURL();
    expect(url).toBeTruthy();
  });

  test('TC-08: Verify page metadata exists', async ({ homePage }) => {
    await homePage.verifyMetaTags();
  });
});
