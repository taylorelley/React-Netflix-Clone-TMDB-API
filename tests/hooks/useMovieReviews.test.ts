import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import * as tmdb from '@/lib/tmdb';

vi.mock('@/lib/tmdb', () => import('../mocks/tmdb'));

import { useMovieReviews } from '@/hooks/useMovieReviews';

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(tmdb.getMovieReviews).mockResolvedValue({
    results: [
      {
        id: '1',
        author: 'A',
        content: 'r1',
        author_details: { avatar_path: null },
      },
    ],
    total_results: 1,
  });
});

describe('useMovieReviews', () => {
  it('starts in loading state', () => {
    vi.mocked(tmdb.getMovieReviews).mockReturnValueOnce(new Promise(() => {}));
    const { result } = renderHook(() => useMovieReviews(550));
    expect(result.current.loading).toBe(true);
    expect(result.current.reviews).toEqual([]);
    expect(result.current.totalReviews).toBe(0);
  });

  it('returns reviews and total', async () => {
    const { result } = renderHook(() => useMovieReviews(550));
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.reviews).toHaveLength(1);
    expect(result.current.reviews[0]?.id).toBe('1');
    expect(result.current.totalReviews).toBe(1);
  });

  it('handles zero results', async () => {
    vi.mocked(tmdb.getMovieReviews).mockResolvedValueOnce({
      results: [],
      total_results: 0,
    });
    const { result } = renderHook(() => useMovieReviews(550));
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.reviews).toEqual([]);
    expect(result.current.totalReviews).toBe(0);
  });

  it('accepts string id', async () => {
    renderHook(() => useMovieReviews('550'));
    await waitFor(() => expect(vi.mocked(tmdb.getMovieReviews)).toHaveBeenCalledWith('550'));
  });

  it('skips fetch when id is null', () => {
    const { result } = renderHook(() => useMovieReviews(null));
    expect(result.current.loading).toBe(true);
    expect(result.current.reviews).toEqual([]);
    expect(vi.mocked(tmdb.getMovieReviews)).not.toHaveBeenCalled();
  });

  it('captures error on reject', async () => {
    vi.mocked(tmdb.getMovieReviews).mockRejectedValueOnce(new Error('boom'));
    const { result } = renderHook(() => useMovieReviews(550));
    await waitFor(() => expect(result.current.error).toBeTruthy());
    expect(result.current.loading).toBe(false);
  });
});
