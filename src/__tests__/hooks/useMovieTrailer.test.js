import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';

vi.mock('../../lib/tmdb', () => import('../../test/mocks/tmdb'));

import { useMovieTrailer } from '../../hooks/useMovieTrailer';
import * as tmdbMocks from '../../test/mocks/tmdb';

beforeEach(() => {
  tmdbMocks.getMovieTrailer.mockReset();
  tmdbMocks.getMovieTrailer.mockResolvedValue('abc123key');
});

describe('useMovieTrailer', () => {
  it('returns trailer key on resolve', async () => {
    const { result } = renderHook(() => useMovieTrailer(550));
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.trailerKey).toBe('abc123key');
  });

  it('returns null when no trailer match', async () => {
    tmdbMocks.getMovieTrailer.mockResolvedValueOnce(null);
    const { result } = renderHook(() => useMovieTrailer(550));
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.trailerKey).toBeNull();
  });

  it('skips fetch when no id', () => {
    const { result } = renderHook(() => useMovieTrailer(null));
    expect(result.current.trailerKey).toBeNull();
  });
});