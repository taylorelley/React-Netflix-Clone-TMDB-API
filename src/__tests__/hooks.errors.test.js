import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';

vi.mock('../lib/tmdb', () => import('../test/mocks/tmdb'));

import { usePopularMovies } from '../hooks/usePopularMovies';
import { useUpcomingMovies } from '../hooks/useUpcomingMovies';
import { useTopRatedMovies } from '../hooks/useTopRatedMovies';
import { useGenres } from '../hooks/useGenres';
import * as m from '../test/mocks/tmdb';

beforeEach(async () => {
  m.getPopularMovies.mockResolvedValue([
    { id: 1, title: 'Test Movie', vote_average: 7, poster_path: '/x.jpg', genre_ids: [28] },
  ]);
  m.getUpcomingMovies.mockResolvedValue([]);
  m.getTopRatedMovies.mockResolvedValue([]);
  m.getGenres.mockResolvedValue([{ id: 28, name: 'Action' }]);
  m.getMovieDetails.mockResolvedValue({ id: 550 });
  m.getMovieTrailer.mockResolvedValue('k');
  m.getMovieReviews.mockResolvedValue({ results: [], total_results: 0 });
  m.searchMovies.mockResolvedValue([]);
});

describe('Hook error branches', () => {
  it('usePopularMovies sets error on reject', async () => {
    m.getPopularMovies.mockRejectedValueOnce(new Error('boom'));
    const { result } = renderHook(() => usePopularMovies());
    await new Promise((r) => setTimeout(r, 20));
    expect(result.current.error).toBeTruthy();
  });

  it('useUpcomingMovies sets error on reject', async () => {
    m.getUpcomingMovies.mockRejectedValueOnce(new Error('boom'));
    const { result } = renderHook(() => useUpcomingMovies());
    await new Promise((r) => setTimeout(r, 20));
    expect(result.current.error).toBeTruthy();
  });

  it('useTopRatedMovies sets error on reject', async () => {
    m.getTopRatedMovies.mockRejectedValueOnce(new Error('boom'));
    const { result } = renderHook(() => useTopRatedMovies());
    await new Promise((r) => setTimeout(r, 20));
    expect(result.current.error).toBeTruthy();
  });

  it('useGenres sets error on reject', async () => {
    m.getGenres.mockRejectedValueOnce(new Error('boom'));
    const { result } = renderHook(() => useGenres());
    await new Promise((r) => setTimeout(r, 20));
    expect(result.current.error).toBeTruthy();
  });
});