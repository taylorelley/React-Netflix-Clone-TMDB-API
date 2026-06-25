import { vi } from 'vitest';

// Mock implementation of TMDB API client for testing
// This file mocks all TMDB API calls used in hooks and components

export const getPopularMovies = vi.fn().mockResolvedValue([
  { id: 1, title: 'Test Movie', vote_average: 7, poster_path: '/x.jpg', genre_ids: [28] },
  { id: 2, title: 'Another Movie', vote_average: 8.5, poster_path: '/y.jpg', genre_ids: [35] },
]);

export const getTopRatedMovies = vi.fn().mockResolvedValue([]);

export const getUpcomingMovies = vi.fn().mockResolvedValue([
  { id: 2026, title: 'Future Movie 1', overview: 'Overview text 1', backdrop_path: '/u1.jpg', genre_ids: [28], vote_average: 8, release_date: '2026-12-01' },
  { id: 2027, title: 'Future Movie 2', overview: 'Overview text 2', backdrop_path: '/u2.jpg', genre_ids: [35], vote_average: 7.5, release_date: '2026-12-15' },
]);

export const getMovieDetails = vi.fn().mockResolvedValue({
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
  release_date: '1999-10-15'
});

export const getMovieTrailer = vi.fn().mockResolvedValue('dQw4w9WgXcQ');

export const getMovieReviews = vi.fn().mockResolvedValue({
  results: [
    {
      id: '1',
      author: 'John Doe',
      content: 'Great movie! Very entertaining.',
      author_details: { avatar_path: '/a1.jpg' }
    },
    {
      id: '2',
      author: 'Jane Smith',
      content: 'I really enjoyed this film. Highly recommended!',
      author_details: { avatar_path: '/a2.jpg' }
    }
  ],
  total_results: 2
});

export const getGenres = vi.fn().mockResolvedValue([
  { id: 28, name: 'Action' },
  { id: 35, name: 'Comedy' },
  { id: 18, name: 'Drama' },
  { id: 27, name: 'Horror' },
  { id: 10749, name: 'Romance' },
]);

export const searchMovies = vi.fn().mockResolvedValue([
  { id: 1, title: 'Test Movie', vote_average: 7, poster_path: '/x.jpg', genre_ids: [28] }
]);
