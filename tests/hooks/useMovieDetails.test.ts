import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import * as tmdb from '@/lib/tmdb';

vi.mock('@/lib/tmdb', () => import('../mocks/tmdb'));

import { useMovieDetails } from '@/hooks/useMovieDetails';

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(tmdb.getMovieDetails).mockResolvedValue({
    id: 550,
    title: 'Fight Club',
    vote_average: 8.4,
    poster_path: '/p.jpg',
    genre_ids: [],
    overview: '',
    backdrop_path: null,
    release_date: '',
  });
});

describe('useMovieDetails', () => {
  it('starts in loading state', () => {
    vi.mocked(tmdb.getMovieDetails).mockReturnValueOnce(new Promise(() => {}));
    const { result } = renderHook(() => useMovieDetails(550));
    expect(result.current.loading).toBe(true);
    expect(result.current.movie).toBeNull();
    expect(result.current.error).toBeNull();
  });

  it('returns details on resolve', async () => {
    const { result } = renderHook(() => useMovieDetails(550));
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.movie?.id).toBe(550);
    expect(result.current.movie?.title).toBe('Fight Club');
    expect(result.current.error).toBeNull();
  });

  it('accepts string id', async () => {
    renderHook(() => useMovieDetails('550'));
    await waitFor(() => expect(vi.mocked(tmdb.getMovieDetails)).toHaveBeenCalledWith('550'));
  });

  it('skips fetch when id is null', () => {
    const { result } = renderHook(() => useMovieDetails(null));
    expect(result.current.loading).toBe(true);
    expect(result.current.movie).toBeNull();
    expect(vi.mocked(tmdb.getMovieDetails)).not.toHaveBeenCalled();
  });

  it('captures error on reject', async () => {
    vi.mocked(tmdb.getMovieDetails).mockRejectedValueOnce(new Error('boom'));
    const { result } = renderHook(() => useMovieDetails(550));
    await waitFor(() => expect(result.current.error).toBeTruthy());
    expect(result.current.loading).toBe(false);
  });

  it('refetches when id changes', async () => {
    const { rerender } = renderHook(
      ({ id }: { id: number | string | null }) => useMovieDetails(id),
      {
        initialProps: { id: 1 as number | string | null },
      },
    );
    await waitFor(() => expect(vi.mocked(tmdb.getMovieDetails)).toHaveBeenCalledWith(1));
    rerender({ id: 2 });
    await waitFor(() => expect(vi.mocked(tmdb.getMovieDetails)).toHaveBeenCalledWith(2));
  });
});
