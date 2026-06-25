import { describe, it, expect, beforeEach } from 'vitest';
import {
  getPopularMovies,
  getTopRatedMovies,
  getUpcomingMovies,
  getMovieDetails,
  getMovieTrailer,
  getMovieReviews,
  getGenres,
  searchMovies,
} from '../test/mocks/tmdb';

beforeEach(() => {
  // Re-establish mock return values after clearAllMocks in other suites
  getPopularMovies.mockResolvedValue([
    { id: 1, title: 'Test Movie', vote_average: 7, poster_path: '/x.jpg', genre_ids: [28] },
    { id: 2, title: 'Another Movie', vote_average: 8.5, poster_path: '/y.jpg', genre_ids: [35] },
  ]);
  getTopRatedMovies.mockResolvedValue([]);
  getUpcomingMovies.mockResolvedValue([
    { id: 2026, title: 'Future Movie 1', overview: 'Overview text 1', backdrop_path: '/u1.jpg', genre_ids: [28], vote_average: 8, release_date: '2026-12-01' },
    { id: 2027, title: 'Future Movie 2', overview: 'Overview text 2', backdrop_path: '/u2.jpg', genre_ids: [35], vote_average: 7.5, release_date: '2026-12-15' },
  ]);
  getMovieDetails.mockResolvedValue({
    id: 550,
    title: 'Fight Club',
    overview: 'A group of young men meets in prison...',
    poster_path: '/z.jpg',
    backdrop_path: '/b.jpg',
    vote_average: 8.4,
    genres: [{ id: 18, name: 'Drama' }, { id: 35, name: 'Comedy' }],
    runtime: 139,
    budget: 63000000,
    tagline: 'Mischief. Mayhem. Soap.',
    status: 'Released',
    release_date: '1999-10-15',
  });
  getMovieTrailer.mockResolvedValue('dQw4w9WgXcQ');
  getMovieReviews.mockResolvedValue({
    results: [
      { id: '1', author: 'John Doe', content: 'Great movie! Very entertaining.', author_details: { avatar_path: '/a1.jpg' } },
      { id: '2', author: 'Jane Smith', content: 'I really enjoyed this film. Highly recommended!', author_details: { avatar_path: '/a2.jpg' } },
    ],
    total_results: 2,
  });
  getGenres.mockResolvedValue([
    { id: 28, name: 'Action' },
    { id: 35, name: 'Comedy' },
    { id: 18, name: 'Drama' },
    { id: 27, name: 'Horror' },
    { id: 10749, name: 'Romance' },
  ]);
  searchMovies.mockResolvedValue([
    { id: 1, title: 'Test Movie', vote_average: 7, poster_path: '/x.jpg', genre_ids: [28] },
  ]);
});

describe('TMDB API client functions (using test mocks)', () => {
  it('returns mocked popular movies', async () => {
    const result = await getPopularMovies();
    expect(result).toEqual([
      { id: 1, title: 'Test Movie', vote_average: 7, poster_path: '/x.jpg', genre_ids: [28] },
      { id: 2, title: 'Another Movie', vote_average: 8.5, poster_path: '/y.jpg', genre_ids: [35] },
    ]);
  });

  it('returns mocked top-rated movies', async () => {
    const result = await getTopRatedMovies();
    expect(result).toEqual([]);
  });

  it('returns mocked upcoming movies', async () => {
    const result = await getUpcomingMovies();
    expect(result).toHaveLength(2);
  });

  it('returns mocked movie details', async () => {
    const result = await getMovieDetails(550);
    expect(result.id).toBe(550);
    expect(result.title).toBe('Fight Club');
  });

  it('returns mocked movie trailer', async () => {
    const result = await getMovieTrailer(550);
    expect(result).toBe('dQw4w9WgXcQ');
  });

  it('returns mocked movie reviews', async () => {
    const result = await getMovieReviews(550);
    expect(result.total_results).toBe(2);
    expect(result.results).toHaveLength(2);
  });

  it('returns mocked genres', async () => {
    const result = await getGenres();
    expect(Array.isArray(result)).toBe(true);
    expect(result).toContainEqual({ id: 28, name: 'Action' });
  });

  it('returns mocked search results', async () => {
    const result = await searchMovies('action');
    expect(result).toEqual([{ id: 1, title: 'Test Movie', vote_average: 7, poster_path: '/x.jpg', genre_ids: [28] }]);
  });
});
