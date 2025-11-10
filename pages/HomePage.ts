import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
  // Selectors
  private readonly logo = 'img[alt*="logo"], .logo, [class*="logo"]';
  private readonly pageTitle = 'h1, .page-title, [class*="title"]';
  private readonly calculatorSection = '[class*="calculator"], .calculator-container';
  private readonly principalInput = '#input-principal';
  private readonly rateInput = '#input-annual-rate';
  private readonly tenureInput = '#input-tenure-years';
  private readonly tenureMonthsInput = '#input-tenure-months';
  private readonly calculateButton = 'button:has-text("Apply Preset")';
  private readonly emiSummary = 'aside'; // The actual summary section
  private readonly emiResult = 'aside strong:has-text("₹")'; // Will get the first ₹ value which is the calculated EMI
  private readonly totalInterest = 'aside strong:has-text("₹"):nth-child(4)'; // 4th ₹ value is total interest
  private readonly totalAmount = 'aside strong:has-text("₹"):nth-child(5)'; // 5th ₹ value is total payment
  private readonly chartContainer = 'canvas, .chart, [class*="chart"]';
  private readonly amortizationTable = 'table, .amortization-table, [class*="amortization"]';
  private readonly footer = 'footer >> nth=1';
  private readonly header = 'header >> nth=1';

  constructor(page: Page) {
    super(page, 'HomePage');
  }

  async navigate(): Promise<void> {
    await this.goto('/');
    this.logger.step('Navigated to home page');
  }

  async verifyPageLoaded(): Promise<void> {
    await this.waitForLoadState('networkidle');
    const title = await this.getTitle();
    expect(title).toBeTruthy();
    this.logger.step('Home page loaded successfully', { title });
  }

  async verifyLogoPresent(): Promise<boolean> {
    try {
      const isVisible = await this.isVisible(this.logo);
      this.logger.step(`Logo visible: ${isVisible}`);
      return isVisible;
    } catch {
      this.logger.warn('Logo not found with standard selectors');
      return false;
    }
  }

  async verifyCalculatorSectionPresent(): Promise<boolean> {
    try {
      const principalVisible = await this.isVisible(this.principalInput);
      const rateVisible = await this.isVisible(this.rateInput);
      const tenureVisible = await this.isVisible(this.tenureInput);
      
      const allVisible = principalVisible && rateVisible && tenureVisible;
      this.logger.step(`Calculator inputs visible: ${allVisible}`);
      return allVisible;
    } catch (error) {
      this.logger.error('Calculator section verification failed', error);
      return false;
    }
  }

  async enterPrincipal(amount: number): Promise<void> {
    await this.fill(this.principalInput, amount.toString());
    this.logger.step(`Entered principal: ${amount}`);
  }

  async enterRate(rate: number): Promise<void> {
    await this.fill(this.rateInput, rate.toString());
    this.logger.step(`Entered rate: ${rate}%`);
  }

  async enterTenure(months: number): Promise<void> {
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    
    // Set only one field at a time - prefer years if possible, otherwise use months
    if (years > 0 && remainingMonths === 0) {
      // Only set years, leave months as is
      const yearsLocator = this.page.locator(this.tenureInput);
      await yearsLocator.waitFor({ state: 'visible' });
      await yearsLocator.fill(years.toString());
      await yearsLocator.blur();
      await this.page.waitForTimeout(1000);
      this.logger.step(`Entered tenure: ${years} years (${months} total months)`);
    } else if (years === 0 && remainingMonths > 0) {
      // Only set months
      const monthsLocator = this.page.locator(this.tenureMonthsInput);
      await monthsLocator.waitFor({ state: 'visible' });
      await monthsLocator.fill(remainingMonths.toString());
      await monthsLocator.blur();
      await this.page.waitForTimeout(1000);
      this.logger.step(`Entered tenure: ${remainingMonths} months`);
    } else {
      // Need both - convert to total months and use months field only
      const monthsLocator = this.page.locator(this.tenureMonthsInput);
      await monthsLocator.waitFor({ state: 'visible' });
      await monthsLocator.fill(months.toString());
      await monthsLocator.blur();
      await this.page.waitForTimeout(1000);
      this.logger.step(`Entered tenure: ${months} total months`);
    }
  }

  async clickCalculate(): Promise<void> {
    // The calculator auto-calculates, so just wait for results
    await this.page.waitForTimeout(500);
    this.logger.step('Waiting for auto-calculation');
  }

  async calculateEMI(principal: number, rate: number, tenure: number): Promise<void> {
    await this.enterPrincipal(principal);
    await this.enterRate(rate);
    await this.enterTenure(tenure);
    // Wait for the EMI summary to be attached (might be hidden)
    await this.page.waitForTimeout(1000);
    await this.page.locator(this.emiSummary).waitFor({ state: 'attached', timeout: 5000 }).catch(() => {
      this.logger.warn('EMI summary not found');
    });
    this.logger.step('EMI calculation completed', { principal, rate, tenure });
  }

  async getEMIResult(): Promise<number> {
    try {
      // Wait for the summary section to be attached
      await this.page.locator(this.emiSummary).waitFor({ state: 'attached', timeout: 10000 });
      
      // Look for "Calculated EMI:" label and get its sibling strong element
      const emiText = await this.page.locator('aside >> text=/Calculated EMI:?/').textContent();
      // Extract the value from the text "Calculated EMI: ₹ 12,399"
      const match = emiText?.match(/₹\s*([\d,]+)/);
      if (match) {
        const emi = parseFloat(match[1].replace(/,/g, ''));
        this.logger.step(`EMI Result retrieved: ${emi}`);
        return emi;
      }
      throw new Error('EMI result value not found in text');
    } catch (error) {
      this.logger.error('Failed to get EMI result', error);
      throw error;
    }
  }

  async getTotalInterest(): Promise<number> {
    try {
      // Get all strong elements with ₹ symbol
      const strongElements = await this.page.locator('aside strong:has-text("₹")').all();
      // The 8th element (index 7) contains the Total Interest value
      if (strongElements.length >= 8) {
        const text = await strongElements[7].textContent();
        const interest = parseFloat((text || '').replace(/[₹,\s]/g, ''));
        this.logger.step(`Total Interest: ${interest}`);
        return interest;
      }
      this.logger.warn('Total interest element not found');
      return 0;
    } catch (error) {
      this.logger.warn('Could not retrieve total interest');
      return 0;
    }
  }

  async getTotalAmount(): Promise<number> {
    try {
      // Get all strong elements with ₹ symbol
      const strongElements = await this.page.locator('aside strong:has-text("₹")').all();
      // The 9th element (index 8) contains the Total Payment value
      if (strongElements.length >= 9) {
        const text = await strongElements[8].textContent();
        const total = parseFloat((text || '').replace(/[₹,\s]/g, ''));
        this.logger.step(`Total Amount: ${total}`);
        return total;
      }
      this.logger.warn('Total amount element not found');
      return 0;
    } catch (error) {
      this.logger.warn('Could not retrieve total amount');
      return 0;
    }
  }

  async isChartVisible(): Promise<boolean> {
    try {
      const visible = await this.isVisible(this.chartContainer);
      this.logger.step(`Chart visible: ${visible}`);
      return visible;
    } catch {
      return false;
    }
  }

  async isAmortizationTableVisible(): Promise<boolean> {
    try {
      const visible = await this.isVisible(this.amortizationTable);
      this.logger.step(`Amortization table visible: ${visible}`);
      return visible;
    } catch {
      return false;
    }
  }

  async verifyFooterPresent(): Promise<boolean> {
    const visible = await this.isVisible(this.footer);
    this.logger.step(`Footer visible: ${visible}`);
    return visible;
  }

  async verifyHeaderPresent(): Promise<boolean> {
    const visible = await this.isVisible(this.header);
    this.logger.step(`Header visible: ${visible}`);
    return visible;
  }

  async clearAllInputs(): Promise<void> {
    await this.fill(this.principalInput, '');
    await this.fill(this.rateInput, '');
    await this.fill(this.tenureInput, '');
    await this.fill(this.tenureMonthsInput, '');
    this.logger.step('Cleared all inputs');
  }

  async getPrincipalValue(): Promise<string> {
    return await this.page.locator(this.principalInput).inputValue();
  }

  async getRateValue(): Promise<string> {
    return await this.page.locator(this.rateInput).inputValue();
  }

  async getTenureValue(): Promise<string> {
    const years = await this.page.locator(this.tenureInput).inputValue();
    const months = await this.page.locator(this.tenureMonthsInput).inputValue();
    const yearsNum = parseInt(years || '0');
    const monthsNum = parseInt(months || '0');
    const totalMonths = yearsNum * 12 + monthsNum;
    return totalMonths.toString();
  }

  async verifyInputValidation(): Promise<boolean> {
    try {
      await this.clickCalculate();
      const errorMessages = await this.page.locator('.error, .invalid, [class*="error"]').count();
      this.logger.step(`Validation errors displayed: ${errorMessages > 0}`);
      return errorMessages > 0;
    } catch {
      return false;
    }
  }
}

export default HomePage;
