import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';

vi.mock('../../lib/tmdb', () => import('../../test/mocks/tmdb'));

import { useMovieDetails } from '../../hooks/useMovieDetails';
import * as tmdbMocks from '../../test/mocks/tmdb';

beforeEach(() => {
  tmdbMocks.getMovieDetails.mockReset();
  tmdbMocks.getMovieDetails.mockResolvedValue({
    id: 550,
    title: 'Fight Club',
    overview: '',
    poster_path: null,
    backdrop_path: null,
    vote_average: 0,
    release_date: '',
    genre_ids: [],
  });
});

describe('useMovieDetails', () => {
  it('returns details on resolve', async () => {
    const { result } = renderHook(() => useMovieDetails(550));
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.movie?.id).toBe(550);
    expect(result.current.movie?.title).toBe('Fight Club');
  });

  it('passes id param to getMovieDetails', async () => {
    renderHook(() => useMovieDetails(42));
    await waitFor(() =>
      expect(tmdbMocks.getMovieDetails).toHaveBeenCalledWith(42),
    );
  });

  it('skips fetch when no id', () => {
    const { result } = renderHook(() => useMovieDetails(null));
    expect(result.current.movie).toBeNull();
    expect(result.current.loading).toBe(true);
  });
});
