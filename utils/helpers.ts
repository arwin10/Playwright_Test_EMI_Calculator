import { Page, expect } from '@playwright/test';
import Logger from './logger';

const logger = new Logger('Helpers');

export class Helpers {
  static async waitForPageLoad(page: Page, timeout: number = 30000): Promise<void> {
    try {
      await page.waitForLoadState('domcontentloaded', { timeout });
      await page.waitForLoadState('networkidle', { timeout });
      logger.step('Page loaded successfully');
    } catch (error) {
      logger.error('Page load timeout', error);
      throw error;
    }
  }

  static async waitForElement(page: Page, selector: string, timeout: number = 10000): Promise<void> {
    await page.waitForSelector(selector, { state: 'visible', timeout });
  }

  static async getElementText(page: Page, selector: string): Promise<string> {
    await this.waitForElement(page, selector);
    const text = await page.locator(selector).textContent();
    return text?.trim() || '';
  }

  static async getElementValue(page: Page, selector: string): Promise<string> {
    await this.waitForElement(page, selector);
    const value = await page.locator(selector).inputValue();
    return value.trim();
  }

  static async clickElement(page: Page, selector: string): Promise<void> {
    await this.waitForElement(page, selector);
    await page.locator(selector).click();
    logger.step(`Clicked element: ${selector}`);
  }

  static async fillInput(page: Page, selector: string, value: string): Promise<void> {
    await this.waitForElement(page, selector);
    const locator = page.locator(selector).first();
    await locator.click();
    await locator.clear();
    await locator.fill(value);
    logger.step(`Filled input ${selector} with value: ${value}`);
  }

  static async takeScreenshot(page: Page, name: string): Promise<void> {
    const timestamp = this.getTimestamp();
    await page.screenshot({ 
      path: `reports/screenshots/${name}_${timestamp}.png`,
      fullPage: true 
    });
    logger.info(`Screenshot taken: ${name}_${timestamp}.png`);
  }

  static async scrollToElement(page: Page, selector: string): Promise<void> {
    await page.locator(selector).scrollIntoViewIfNeeded();
  }

  static async isElementVisible(page: Page, selector: string): Promise<boolean> {
    try {
      await page.waitForSelector(selector, { state: 'visible', timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  static async waitForNavigation(page: Page, action: () => Promise<void>): Promise<void> {
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle' }),
      action()
    ]);
  }

  static getTimestamp(): string {
    const now = new Date();
    return now.toISOString().replace(/[:.]/g, '-');
  }

  static async getPageLoadTime(page: Page): Promise<number> {
    const performanceTiming = JSON.parse(
      await page.evaluate(() => JSON.stringify(performance.timing))
    );
    return performanceTiming.loadEventEnd - performanceTiming.navigationStart;
  }

  static generateRandomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  static generateRandomDecimal(min: number, max: number, decimals: number = 2): number {
    const random = Math.random() * (max - min) + min;
    return parseFloat(random.toFixed(decimals));
  }

  static formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  }

  static parseNumber(text: string): number {
    const cleaned = text.replace(/[₹,\s]/g, '');
    return parseFloat(cleaned) || 0;
  }

  static async retryAction(
    action: () => Promise<void>,
    maxRetries: number = 3,
    delay: number = 1000
  ): Promise<void> {
    for (let i = 0; i < maxRetries; i++) {
      try {
        await action();
        return;
      } catch (error) {
        if (i === maxRetries - 1) throw error;
        logger.warn(`Retry attempt ${i + 1} of ${maxRetries}`);
        await this.sleep(delay);
      }
    }
  }

  static async sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  static async clearAllInputs(page: Page): Promise<void> {
    const inputs = await page.locator('input[type="text"], input[type="number"]').all();
    for (const input of inputs) {
      await input.clear();
    }
  }
}

export default Helpers;
