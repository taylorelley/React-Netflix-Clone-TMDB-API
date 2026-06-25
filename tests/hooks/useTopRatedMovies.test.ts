import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import * as tmdb from '@/lib/tmdb';

vi.mock('@/lib/tmdb', () => import('../mocks/tmdb'));

import { useTopRatedMovies } from '@/hooks/useTopRatedMovies';

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(tmdb.getTopRatedMovies).mockResolvedValue([
    {
      id: 1,
      title: 'Top 1',
      vote_average: 9,
      backdrop_path: '/t.jpg',
      genre_ids: [],
      overview: '',
      poster_path: null,
      release_date: '',
    },
  ]);
});

describe('useTopRatedMovies', () => {
  it('starts in loading state with empty movies', () => {
    vi.mocked(tmdb.getTopRatedMovies).mockReturnValueOnce(new Promise(() => {}));
    const { result } = renderHook(() => useTopRatedMovies());
    expect(result.current.loading).toBe(true);
    expect(result.current.movies).toEqual([]);
    expect(result.current.error).toBeNull();
  });

  it('returns movies on resolve', async () => {
    const { result } = renderHook(() => useTopRatedMovies());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.movies).toHaveLength(1);
    expect(result.current.movies[0]?.id).toBe(1);
    expect(result.current.error).toBeNull();
  });

  it('returns empty array when no top rated', async () => {
    vi.mocked(tmdb.getTopRatedMovies).mockResolvedValueOnce([]);
    const { result } = renderHook(() => useTopRatedMovies());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.movies).toEqual([]);
  });

  it('captures error on reject', async () => {
    vi.mocked(tmdb.getTopRatedMovies).mockRejectedValueOnce(new Error('boom'));
    const { result } = renderHook(() => useTopRatedMovies());
    await waitFor(() => expect(result.current.error).toBeTruthy());
    expect(result.current.loading).toBe(false);
  });
});
