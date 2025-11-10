import * as dotenv from 'dotenv';
dotenv.config();

export const config = {
  env: process.env.ENV || 'dev',
  baseURL: getBaseURL(),
  timeout: parseInt(process.env.TIMEOUT || '30000'),
  retries: parseInt(process.env.RETRIES || '2'),
  workers: parseInt(process.env.WORKERS || '4'),
  headless: process.env.HEADLESS === 'true',
  
  urls: {
    home: '/',
    homeLoan: '/',
    carLoan: '/',
    personalLoan: '/',
  },
  
  testData: {
    defaultPrincipal: 1000000,
    defaultRate: 8.5,
    defaultTenure: 120,
    minPrincipal: 10000,
    maxPrincipal: 100000000,
    minRate: 0.1,
    maxRate: 30,
    minTenure: 1,
    maxTenure: 360,
  },
  
  performance: {
    maxLoadTime: 3000,
    maxResponseTime: 2000,
  },
  
  reporting: {
    screenshotOnFailure: process.env.SCREENSHOT_ON_FAILURE === 'true',
    videoOnFailure: process.env.VIDEO_ON_FAILURE === 'true',
    traceOnFailure: process.env.TRACE_ON_FAILURE === 'true',
  },
};

function getBaseURL(): string {
  const env = process.env.ENV || 'dev';
  const envVar = `${env.toUpperCase()}_BASE_URL`;
  return process.env[envVar] || 'https://www.calculateyouremi.in';
}

export default config;
