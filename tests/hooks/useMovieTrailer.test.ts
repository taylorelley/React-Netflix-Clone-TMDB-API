import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import * as tmdb from '@/lib/tmdb';

vi.mock('@/lib/tmdb', () => import('../mocks/tmdb'));

import { useMovieTrailer } from '@/hooks/useMovieTrailer';

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(tmdb.getMovieTrailer).mockResolvedValue('abc123key');
});

describe('useMovieTrailer', () => {
  it('starts in loading state', () => {
    vi.mocked(tmdb.getMovieTrailer).mockReturnValueOnce(new Promise(() => {}));
    const { result } = renderHook(() => useMovieTrailer(550));
    expect(result.current.loading).toBe(true);
    expect(result.current.trailerKey).toBeNull();
    expect(result.current.error).toBeNull();
  });

  it('returns trailer key on resolve', async () => {
    const { result } = renderHook(() => useMovieTrailer(550));
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.trailerKey).toBe('abc123key');
    expect(result.current.error).toBeNull();
  });

  it('returns null when no trailer match', async () => {
    vi.mocked(tmdb.getMovieTrailer).mockResolvedValueOnce(null);
    const { result } = renderHook(() => useMovieTrailer(550));
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.trailerKey).toBeNull();
  });

  it('accepts string id', async () => {
    renderHook(() => useMovieTrailer('550'));
    await waitFor(() => expect(vi.mocked(tmdb.getMovieTrailer)).toHaveBeenCalledWith('550'));
  });

  it('skips fetch when id is null', () => {
    const { result } = renderHook(() => useMovieTrailer(null));
    expect(result.current.loading).toBe(true);
    expect(result.current.trailerKey).toBeNull();
    expect(vi.mocked(tmdb.getMovieTrailer)).not.toHaveBeenCalled();
  });

  it('captures error on reject', async () => {
    vi.mocked(tmdb.getMovieTrailer).mockRejectedValueOnce(new Error('boom'));
    const { result } = renderHook(() => useMovieTrailer(550));
    await waitFor(() => expect(result.current.error).toBeTruthy());
    expect(result.current.loading).toBe(false);
  });
});
