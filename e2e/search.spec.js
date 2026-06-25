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
      '**/api/tmdb/movie/popular*': popularResponse,
      '**/api/tmdb/movie/top_rated*': topRatedResponse,
      '**/api/tmdb/movie/upcoming*': upcomingResponse,
      '**/api/tmdb/genre/movie/list*': genres,
      '**/api/tmdb/search/movie*': searchResponse,
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
    await mockTmdbApi(page, {
      '**/api/tmdb/movie/1*': {
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
      },
    });

    await page.goto('/');
    const input = page.getByPlaceholder('Search movies...');
    await input.fill('incep');
    await page.getByText('Inception Result').click();
    await expect(page).toHaveURL(/\/moviedetails\/1$/);
  });
});
