import { test as base } from '@playwright/test';

/**
 * Mock the TMDB API endpoints by intercepting requests in the Playwright page.
 * Uses page.route() (more reliable than MSW service worker in E2E for these tests).
 *
 * @param {import('@playwright/test').Page} page
 * @param {Record<string, any>} mocks - glob pattern → JSON body
 */
export async function mockTmdbApi(page, mocks) {
  for (const [pattern, body] of Object.entries(mocks)) {
    await page.route(pattern, (route) =>
      route.fulfill({
        contentType: 'application/json',
        body: JSON.stringify(body),
      }),
    );
  }
}

export const test = base;
