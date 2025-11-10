import { test } from '@playwright/test';

test('Debug selectors', async ({ page }) => {
  await page.goto('https://emicalculator.net/');
  await page.waitForLoadState('networkidle');
  
  console.log('=== CHECKING MAIN CALCULATOR INPUTS ===');
  
  // Check for principal/loan amount
  const principalIds = ['loanamount', 'principal', 'loan-amount'];
  for (const id of principalIds) {
    const count = await page.locator(`#${id}`).count();
    if (count > 0) {
      console.log(`Principal input found with ID: ${id}`);
    }
  }
  
  // Check for interest rate
  const rateIds = ['loaninterest', 'rate', 'interest', 'interest-rate'];
  for (const id of rateIds) {
    const count = await page.locator(`#${id}`).count();
    if (count > 0) {
      console.log(`Rate input found with ID: ${id}`);
    }
  }
  
  // Check for tenure
  const tenureIds = ['loanterm', 'tenure', 'loan-tenure'];
  for (const id of tenureIds) {
    const count = await page.locator(`#${id}`).count();
    if (count > 0) {
      console.log(`Tenure input found with ID: ${id}`);
    }
  }
  
  console.log('=== CHECKING HEADER AND FOOTER ===');
  console.log(`Header count: ${await page.locator('header').count()}`);
  console.log(`Footer count: ${await page.locator('footer').count()}`);
});
