import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import * as tmdb from '@/lib/tmdb';

vi.mock('@/lib/tmdb', () => import('../mocks/tmdb'));

import { useSearch } from '@/hooks/useSearch';

beforeEach(() => {
  vi.useFakeTimers();
  vi.clearAllMocks();
  vi.mocked(tmdb.searchMovies).mockResolvedValue([
    {
      id: 1,
      title: 'Result',
      vote_average: 7,
      poster_path: '/x.jpg',
      genre_ids: [],
      overview: '',
      backdrop_path: null,
      release_date: '',
    },
  ]);
});

afterEach(() => {
  vi.useRealTimers();
});

describe('useSearch', () => {
  it('starts with empty results and loading false', () => {
    const { result } = renderHook(() => useSearch(''));
    expect(result.current.results).toEqual([]);
    expect(result.current.loading).toBe(false);
    expect(vi.mocked(tmdb.searchMovies)).not.toHaveBeenCalled();
  });

  it('skips call on whitespace-only query', () => {
    const { result } = renderHook(() => useSearch('   '));
    expect(result.current.results).toEqual([]);
    expect(vi.mocked(tmdb.searchMovies)).not.toHaveBeenCalled();
  });

  it('returns results after debounce (delay 0)', async () => {
    const { result } = renderHook(() => useSearch('matrix', 0));
    await act(async () => {
      await vi.runAllTimersAsync();
    });
    expect(result.current.results).toHaveLength(1);
    expect(result.current.results[0]?.title).toBe('Result');
  });

  it('debounces call when delay > 0', async () => {
    renderHook(() => useSearch('matrix', 100));
    await act(async () => {
      await vi.advanceTimersByTimeAsync(30);
    });
    expect(vi.mocked(tmdb.searchMovies)).not.toHaveBeenCalled();
    await act(async () => {
      await vi.advanceTimersByTimeAsync(100);
    });
    expect(vi.mocked(tmdb.searchMovies)).toHaveBeenCalledWith('matrix');
  });

  it('sets loading to true during debounce window', async () => {
    const { result } = renderHook(() => useSearch('matrix', 50));
    expect(result.current.loading).toBe(true);
    await act(async () => {
      await vi.advanceTimersByTimeAsync(60);
    });
    expect(result.current.loading).toBe(false);
  });

  it('clears results on search error', async () => {
    vi.mocked(tmdb.searchMovies).mockRejectedValueOnce(new Error('boom'));
    const { result } = renderHook(() => useSearch('matrix', 0));
    await act(async () => {
      await vi.runAllTimersAsync();
    });
    expect(result.current.results).toEqual([]);
  });

  it('clears results when query becomes empty', async () => {
    const { result, rerender } = renderHook(({ q }: { q: string }) => useSearch(q, 0), {
      initialProps: { q: 'matrix' },
    });
    await act(async () => {
      await vi.runAllTimersAsync();
    });
    expect(result.current.results).toHaveLength(1);
    rerender({ q: '' });
    expect(result.current.results).toEqual([]);
    expect(result.current.loading).toBe(false);
  });

  it('cancels pending call when query changes (latest query wins)', async () => {
    const { rerender } = renderHook(({ q }: { q: string }) => useSearch(q, 50), {
      initialProps: { q: 'matrix' },
    });
    await act(async () => {
      await vi.advanceTimersByTimeAsync(20);
    });
    rerender({ q: 'other' });
    await act(async () => {
      await vi.advanceTimersByTimeAsync(60);
    });
    expect(vi.mocked(tmdb.searchMovies)).toHaveBeenCalledTimes(1);
    expect(vi.mocked(tmdb.searchMovies)).toHaveBeenCalledWith('other');
  });
});
