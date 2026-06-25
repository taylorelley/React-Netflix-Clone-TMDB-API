import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';

vi.mock('../../lib/tmdb', () => import('../../test/mocks/tmdb'));

import { useMovieReviews } from '../../hooks/useMovieReviews';
import * as tmdbMocks from '../../test/mocks/tmdb';

beforeEach(() => {
  tmdbMocks.getMovieReviews.mockReset();
  tmdbMocks.getMovieReviews.mockResolvedValue({
    results: [{ id: '1', author: 'A', content: 'r1' }],
    total_results: 1,
  });
});

describe('useMovieReviews', () => {
  it('returns reviews and total', async () => {
    const { result } = renderHook(() => useMovieReviews(550));
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.reviews).toHaveLength(1);
    expect(result.current.totalReviews).toBe(1);
  });

  it('skips fetch when no id', () => {
    const { result } = renderHook(() => useMovieReviews(null));
    expect(result.current.reviews).toEqual([]);
  });
});