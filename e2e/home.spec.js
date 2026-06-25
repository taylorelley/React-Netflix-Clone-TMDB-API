import { test, expect } from '@playwright/test';
import { mockTmdbApi } from './mocks/setup';

const popularResponse = {
  page: 1,
  results: [
    { id: 1, title: 'Inception', vote_average: 8.4, poster_path: '/inception.jpg', genre_ids: [28] },
    { id: 2, title: 'The Matrix', vote_average: 8.7, poster_path: '/matrix.jpg', genre_ids: [28] },
  ],
  total_pages: 10,
  total_results: 20,
};

const topRatedResponse = {
  page: 1,
  results: [
    { id: 550, title: 'Fight Club', vote_average: 8.4, backdrop_path: '/fc.jpg', genre_ids: [18] },
  ],
  total_pages: 1,
  total_results: 1,
};

const upcomingResponse = {
  page: 1,
  results: [
    { id: 1001, title: 'Upcoming 1', overview: 'Upcoming 1 overview.', backdrop_path: '/up1.jpg', genre_ids: [28], vote_average: 7, release_date: '2026-12-01' },
  ],
  total_pages: 1,
  total_results: 1,
};

const genres = { genres: [{ id: 28, name: 'Action' }] };

test.describe('Home page', () => {
  test.beforeEach(async ({ page }) => {
    await mockTmdbApi(page, {
      '**/movie/popular*': popularResponse,
      '**/movie/top_rated*': topRatedResponse,
      '**/movie/upcoming*': upcomingResponse,
      '**/genre/movie/list*': genres,
    });
  });

  test('renders hero slider with upcoming movie', async ({ page }) => {
    await page.goto('/');
    // Slider h1 is in the slider-info block
    await expect(page.locator('.slider-info h1')).toHaveText('Upcoming 1');
  });

  test('renders popular section title and cards', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('Popular Movies')).toBeVisible();
    // MovieCards exist in DOM; CSS hides text until hover
    await expect(page.locator('.popular-card')).toHaveCount(2);
  });

  test('renders top rated section title', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('Top Rated Movies')).toBeVisible();
  });

  test('renders 10 pagination numbers', async ({ page }) => {
    await page.goto('/');
    const tens = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
    for (const n of tens) {
      await expect(page.getByText(n, { exact: true })).toBeVisible();
    }
  });

  test('clicking page 2 sets page state (page-2 highlighted)', async ({ page }) => {
    await page.goto('/');
    await page.getByText('2', { exact: true }).click();
    await expect(page.getByText('2', { exact: true })).toHaveClass(/current-page/);
  });
});