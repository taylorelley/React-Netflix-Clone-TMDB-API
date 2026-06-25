import { test, expect } from '@playwright/test';
import { mockTmdbApi } from './mocks/setup';

const empty = { results: [], total_results: 0, page: 1, total_pages: 1 };

const detail550 = {
  id: 550,
  title: 'Fight Club',
  overview: 'An insomniac office worker forms a fight club.',
  poster_path: '/fc.jpg',
  backdrop_path: '/fc-bd.jpg',
  vote_average: 8.4,
  genres: [{ id: 18, name: 'Drama' }],
  runtime: 139,
  budget: 63000000,
  tagline: 'Mischief. Mayhem. Soap.',
  status: 'Released',
};

const videos550 = { results: [{ key: 'abc', site: 'YouTube', type: 'Trailer' }] };
const reviews550 = {
  results: [
    { id: '1', author: 'Alice', content: 'A great movie with a stunning twist.', author_details: { avatar_path: '/av1.jpg' } },
    { id: '2', author: 'Bob', content: 'Brilliantly crafted narrative.', author_details: { avatar_path: '/av2.jpg' } },
  ],
  total_results: 2,
};

test.describe('Movie details page', () => {
  test.beforeEach(async ({ page }) => {
    await mockTmdbApi(page, {
      '**/movie/popular*': empty,
      '**/movie/top_rated*': empty,
      '**/movie/upcoming*': empty,
      '**/genre/movie/list*': { genres: [{ id: 18, name: 'Drama' }] },
      '**/movie/550': detail550,
      '**/movie/550/videos*': videos550,
      '**/movie/550/reviews*': reviews550,
    });
  });

  test('renders movie title', async ({ page }) => {
    await page.goto('/moviedetails/550');
    await expect(page.locator('.title-container h1')).toHaveText('Fight Club');
  });

  test('renders trailer section when key present', async ({ page }) => {
    await page.goto('/moviedetails/550');
    await expect(page.locator('.trailer-container')).toBeVisible();
  });

  test('renders reviews section', async ({ page }) => {
    await page.goto('/moviedetails/550');
    await expect(page.getByText('Reviews', { exact: true })).toBeVisible();
    // Review items exist in DOM
    await expect(page.locator('.review')).toHaveCount(2);
  });

  test('falls back to blank poster when trailer key is null', async ({ page }) => {
    await page.route('**/movie/550/videos*', (route) =>
      route.fulfill({
        contentType: 'application/json',
        body: JSON.stringify({ results: [] }),
      })
    );
    await page.goto('/moviedetails/550');
    await expect(page.locator('.trailer-container-blank')).toBeVisible();
  });
});