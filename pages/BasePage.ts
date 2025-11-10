import { Page, Locator, expect } from '@playwright/test';
import { Helpers } from '../utils/helpers';
import Logger from '../utils/logger';

export class BasePage {
  readonly page: Page;
  readonly logger: Logger;

  constructor(page: Page, loggerContext: string = 'BasePage') {
    this.page = page;
    this.logger = new Logger(loggerContext);
  }

  async goto(url: string): Promise<void> {
    await this.page.goto(url);
    await Helpers.waitForPageLoad(this.page);
    this.logger.step(`Navigated to ${url}`);
  }

  async getTitle(): Promise<string> {
    return await this.page.title();
  }

  async getURL(): Promise<string> {
    return this.page.url();
  }

  async waitForSelector(selector: string, timeout: number = 10000): Promise<void> {
    await this.page.waitForSelector(selector, { state: 'visible', timeout });
  }

  async click(selector: string): Promise<void> {
    await Helpers.clickElement(this.page, selector);
  }

  async fill(selector: string, value: string): Promise<void> {
    await Helpers.fillInput(this.page, selector, value);
  }

  async getText(selector: string): Promise<string> {
    return await Helpers.getElementText(this.page, selector);
  }

  async isVisible(selector: string): Promise<boolean> {
    return await Helpers.isElementVisible(this.page, selector);
  }

  async takeScreenshot(name: string): Promise<void> {
    await Helpers.takeScreenshot(this.page, name);
  }

  async scrollToElement(selector: string): Promise<void> {
    await Helpers.scrollToElement(this.page, selector);
  }

  async waitForLoadState(state: 'load' | 'domcontentloaded' | 'networkidle' = 'networkidle'): Promise<void> {
    await this.page.waitForLoadState(state);
  }

  async reload(): Promise<void> {
    await this.page.reload();
    await this.waitForLoadState();
  }

  async goBack(): Promise<void> {
    await this.page.goBack();
    await this.waitForLoadState();
  }

  async getMetaTag(name: string): Promise<string | null> {
    return await this.page.getAttribute(`meta[name="${name}"]`, 'content');
  }

  async verifyMetaTags(): Promise<void> {
    const title = await this.getTitle();
    const description = await this.getMetaTag('description');
    
    expect(title).toBeTruthy();
    expect(description).toBeTruthy();
    
    this.logger.step('Meta tags verified', { title, description });
  }

  async getPageLoadMetrics(): Promise<any> {
    return await this.page.evaluate(() => {
      const perfData = performance.timing;
      return {
        loadTime: perfData.loadEventEnd - perfData.navigationStart,
        domReadyTime: perfData.domContentLoadedEventEnd - perfData.navigationStart,
        responseTime: perfData.responseEnd - perfData.requestStart,
      };
    });
  }
}

export default BasePage;
