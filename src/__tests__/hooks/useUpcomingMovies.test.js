import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';

vi.mock('../../lib/tmdb', () => import('../../test/mocks/tmdb'));

import { useUpcomingMovies } from '../../hooks/useUpcomingMovies';
import * as tmdbMocks from '../../test/mocks/tmdb';

beforeEach(() => {
  tmdbMocks.getUpcomingMovies.mockReset();
  tmdbMocks.getUpcomingMovies.mockResolvedValue([
    { id: 1, title: 'Upcoming 1', overview: 'ov1', backdrop_path: '/u1.jpg', genre_ids: [28], vote_average: 8, release_date: '2026-12-01' },
    { id: 2, title: 'Upcoming 2', overview: 'ov2', backdrop_path: '/u2.jpg', genre_ids: [35], vote_average: 7, release_date: '2026-12-15' },
  ]);
});

describe('useUpcomingMovies', () => {
  it('returns upcoming movies', async () => {
    const { result } = renderHook(() => useUpcomingMovies());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.movies).toHaveLength(2);
  });

  it('returns movies with release_date used in Slider context', async () => {
    const { result } = renderHook(() => useUpcomingMovies());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.movies[0].release_date).toBe('2026-12-01');
  });
});