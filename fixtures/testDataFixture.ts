import { test as base } from './baseFixture';
import testData from '../utils/testData.json';

type TestDataFixtures = {
  validTestData: typeof testData.validTestCases;
  edgeCaseData: typeof testData.edgeCases;
  negativeTestData: typeof testData.negativeTestCases;
};

export const test = base.extend<TestDataFixtures>({
  validTestData: async ({}, use) => {
    await use(testData.validTestCases);
  },

  edgeCaseData: async ({}, use) => {
    await use(testData.edgeCases);
  },

  negativeTestData: async ({}, use) => {
    await use(testData.negativeTestCases);
  },
});

export { expect } from '@playwright/test';
