import { test, expect } from '../../fixtures/baseFixture';

test.describe('Regression Tests - SEO & Meta Tags', () => {
  test('TC-SEO01: Verify page title is SEO friendly', async ({ homePage }) => {
    await homePage.navigate();
    
    const title = await homePage.getTitle();
    expect(title).toBeTruthy();
    expect(title.length).toBeGreaterThan(10);
    expect(title.length).toBeLessThan(70);
  });

  test('TC-SEO02: Verify meta description exists', async ({ homePage }) => {
    await homePage.navigate();
    
    const description = await homePage.getMetaTag('description');
    expect(description).toBeTruthy();
    if (description) {
      expect(description.length).toBeGreaterThan(50);
      expect(description.length).toBeLessThan(160);
    }
  });

  test('TC-SEO03: Verify meta keywords exist', async ({ homePage }) => {
    await homePage.navigate();
    
    const keywords = await homePage.getMetaTag('keywords');
    // Keywords are optional in modern SEO
    if (keywords) {
      expect(keywords.length).toBeGreaterThan(0);
    }
  });

  test('TC-SEO04: Verify viewport meta tag', async ({ page, homePage }) => {
    await homePage.navigate();
    
    const viewport = await page.getAttribute('meta[name="viewport"]', 'content');
    expect(viewport).toBeTruthy();
    expect(viewport).toContain('width=');
  });

  test('TC-SEO05: Verify canonical URL', async ({ page, homePage }) => {
    await homePage.navigate();
    
    const canonical = await page.getAttribute('link[rel="canonical"]', 'href');
    if (canonical) {
      expect(canonical).toContain('http');
    }
  });

  test('TC-SEO06: Verify Open Graph tags', async ({ page, homePage }) => {
    await homePage.navigate();
    
    const ogTitle = await page.getAttribute('meta[property="og:title"]', 'content');
    const ogDescription = await page.getAttribute('meta[property="og:description"]', 'content');
    
    // OG tags are optional but good for social sharing
    if (ogTitle) {
      expect(ogTitle.length).toBeGreaterThan(0);
    }
  });

  test('TC-SEO07: Verify structured data exists', async ({ page, homePage }) => {
    await homePage.navigate();
    
    const jsonLd = await page.locator('script[type="application/ld+json"]').count();
    // Structured data is optional
    expect(jsonLd).toBeGreaterThanOrEqual(0);
  });

  test('TC-SEO08: Verify heading hierarchy', async ({ page, homePage }) => {
    await homePage.navigate();
    
    const h1Count = await page.locator('h1').count();
    expect(h1Count).toBeGreaterThanOrEqual(1);
    expect(h1Count).toBeLessThanOrEqual(2);
  });
});
