import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';

vi.mock('../../lib/tmdb', () => import('../../test/mocks/tmdb'));

import { usePopularMovies } from '../../hooks/usePopularMovies';
import * as tmdbMocks from '../../test/mocks/tmdb';

beforeEach(() => {
  tmdbMocks.getPopularMovies.mockReset();
  tmdbMocks.getPopularMovies.mockResolvedValue([
    { id: 1, title: 'Movie 1', vote_average: 7, poster_path: '/x.jpg', genre_ids: [28] },
    { id: 2, title: 'Movie 2', vote_average: 8, poster_path: '/y.jpg', genre_ids: [35] },
  ]);
});

describe('usePopularMovies', () => {
  it('starts in loading state with empty movies', () => {
    tmdbMocks.getPopularMovies.mockReturnValueOnce(new Promise(() => {}));
    const { result } = renderHook(() => usePopularMovies());
    expect(result.current.loading).toBe(true);
    expect(result.current.movies).toEqual([]);
  });

  it('returns movies on resolve', async () => {
    const { result } = renderHook(() => usePopularMovies());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.movies).toHaveLength(2);
    expect(result.current.error).toBeNull();
  });

  it('calls getPopularMovies with page', async () => {
    renderHook(() => usePopularMovies(3));
    await waitFor(() => expect(tmdbMocks.getPopularMovies).toHaveBeenCalledWith(3));
  });

  it('refetches when page changes', async () => {
    const { rerender } = renderHook(({ p }) => usePopularMovies(p), { initialProps: { p: 1 } });
    await waitFor(() => expect(tmdbMocks.getPopularMovies).toHaveBeenCalledWith(1));
    rerender({ p: 2 });
    await waitFor(() => expect(tmdbMocks.getPopularMovies).toHaveBeenCalledWith(2));
  });
});