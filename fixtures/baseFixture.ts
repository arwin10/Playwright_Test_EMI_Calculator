import { test as base, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import config from '../utils/config';
import Logger from '../utils/logger';

type TestFixtures = {
  homePage: HomePage;
  logger: Logger;
};

export const test = base.extend<TestFixtures>({
  logger: async ({}, use) => {
    const logger = new Logger('TestFixture');
    await use(logger);
  },

  homePage: async ({ page }, use) => {
    const homePage = new HomePage(page);
    await use(homePage);
  },
});

export { expect };
