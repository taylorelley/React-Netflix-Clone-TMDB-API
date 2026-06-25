import { test, expect } from '@playwright/test';
import { mockTmdbApi } from './mocks/setup';

const popularResponse = { results: [], total_results: 0, page: 1, total_pages: 1 };
const topRatedResponse = { results: [], total_results: 0, page: 1, total_pages: 1 };
const upcomingResponse = { results: [], total_results: 0, page: 1, total_pages: 1 };
const genres = { genres: [] };

const searchResponse = {
  results: [
    { id: 1, title: 'Inception Result', backdrop_path: '/search1.jpg', vote_average: 8.4, genre_ids: [28] },
    { id: 2, title: 'Inception 2', backdrop_path: '/search2.jpg', vote_average: 7.5, genre_ids: [12] },
  ],
  total_results: 2,
};

test.describe('Search', () => {
  test.beforeEach(async ({ page }) => {
    await mockTmdbApi(page, {
      '**/movie/popular*': popularResponse,
      '**/movie/top_rated*': topRatedResponse,
      '**/movie/upcoming*': upcomingResponse,
      '**/genre/movie/list*': genres,
      '**/search/movie*': searchResponse,
    });
  });

  test('typing in search input shows dropdown with results', async ({ page }) => {
    await page.goto('/');
    const input = page.getByPlaceholder('Search movies...');
    await input.fill('incep');
    await expect(page.getByText('Inception Result')).toBeVisible();
    await expect(page.getByText('Inception 2')).toBeVisible();
  });

  test('clicking a search result navigates to movie details', async ({ page }) => {
    // Mock the detail endpoint
    await page.route('**/movie/1*', (route) =>
      route.fulfill({
        contentType: 'application/json',
        body: JSON.stringify({
          id: 1,
          title: 'Inception Result',
          overview: 'Dream heist.',
          poster_path: '/search1.jpg',
          vote_average: 8.4,
          genres: [{ id: 28, name: 'Action' }],
          runtime: 148,
          budget: 160000000,
          tagline: 'Your mind is the scene of the crime.',
          status: 'Released',
        }),
      })
    );
    await page.route('**/movie/1/videos*', (route) =>
      route.fulfill({
        contentType: 'application/json',
        body: JSON.stringify({ results: [{ key: 'k', site: 'YouTube', type: 'Trailer' }] }),
      })
    );
    await page.route('**/movie/1/reviews*', (route) =>
      route.fulfill({ contentType: 'application/json', body: JSON.stringify({ results: [], total_results: 0 }) })
    );

    await page.goto('/');
    const input = page.getByPlaceholder('Search movies...');
    await input.fill('incep');
    await page.getByText('Inception Result').click();
    await expect(page).toHaveURL(/\/moviedetails\/1$/);
  });
});