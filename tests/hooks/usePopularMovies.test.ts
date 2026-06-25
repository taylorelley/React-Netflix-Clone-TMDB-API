import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import * as tmdb from '@/lib/tmdb';

vi.mock('@/lib/tmdb', () => import('../mocks/tmdb'));

import { usePopularMovies } from '@/hooks/usePopularMovies';

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(tmdb.getPopularMovies).mockResolvedValue([
    {
      id: 1,
      title: 'Movie 1',
      vote_average: 7,
      poster_path: '/x.jpg',
      genre_ids: [28],
      overview: '',
      backdrop_path: null,
      release_date: '',
    },
    {
      id: 2,
      title: 'Movie 2',
      vote_average: 8,
      poster_path: '/y.jpg',
      genre_ids: [35],
      overview: '',
      backdrop_path: null,
      release_date: '',
    },
  ]);
});

describe('usePopularMovies', () => {
  it('starts in loading state with empty movies', () => {
    vi.mocked(tmdb.getPopularMovies).mockReturnValueOnce(new Promise(() => {}));
    const { result } = renderHook(() => usePopularMovies());
    expect(result.current.loading).toBe(true);
    expect(result.current.movies).toEqual([]);
    expect(result.current.error).toBeNull();
  });

  it('returns movies on resolve', async () => {
    const { result } = renderHook(() => usePopularMovies());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.movies).toHaveLength(2);
    expect(result.current.movies[0]?.id).toBe(1);
    expect(result.current.error).toBeNull();
  });

  it('passes page argument to getPopularMovies', async () => {
    renderHook(() => usePopularMovies(3));
    await waitFor(() => expect(vi.mocked(tmdb.getPopularMovies)).toHaveBeenCalledWith(3));
  });

  it('defaults page to 1 when no argument given', async () => {
    renderHook(() => usePopularMovies());
    await waitFor(() => expect(vi.mocked(tmdb.getPopularMovies)).toHaveBeenCalledWith(1));
  });

  it('refetches when page changes', async () => {
    const { rerender } = renderHook(({ p }: { p: number }) => usePopularMovies(p), {
      initialProps: { p: 1 },
    });
    await waitFor(() => expect(vi.mocked(tmdb.getPopularMovies)).toHaveBeenCalledWith(1));
    rerender({ p: 2 });
    await waitFor(() => expect(vi.mocked(tmdb.getPopularMovies)).toHaveBeenCalledWith(2));
  });

  it('captures error when fetch rejects', async () => {
    vi.mocked(tmdb.getPopularMovies).mockRejectedValueOnce(new Error('boom'));
    const { result } = renderHook(() => usePopularMovies());
    await waitFor(() => expect(result.current.error).toBeTruthy());
    expect(result.current.loading).toBe(false);
  });
});
