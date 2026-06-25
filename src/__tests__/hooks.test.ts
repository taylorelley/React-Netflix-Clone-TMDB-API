import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { usePopularMovies } from '../hooks/usePopularMovies';
import { useUpcomingMovies } from '../hooks/useUpcomingMovies';
import { useMovieDetails } from '../hooks/useMovieDetails';
import { useMovieTrailer } from '../hooks/useMovieTrailer';
import { useMovieReviews } from '../hooks/useMovieReviews';
import { useGenres } from '../hooks/useGenres';
import { useTopRatedMovies } from '../hooks/useTopRatedMovies';
import { useSearch } from '../hooks/useSearch';

vi.mock('../lib/tmdb', async () => await import('../test/mocks/tmdb'));

beforeEach(async () => {
  vi.clearAllMocks();
  const m = await import('../test/mocks/tmdb');
  m.getPopularMovies.mockResolvedValue([
    {
      id: 1,
      title: 'Test Movie',
      vote_average: 7,
      poster_path: '/x.jpg',
      overview: '',
      backdrop_path: null,
      release_date: '',
      genre_ids: [28],
    },
    {
      id: 2,
      title: 'Another Movie',
      vote_average: 8.5,
      poster_path: '/y.jpg',
      overview: '',
      backdrop_path: null,
      release_date: '',
      genre_ids: [35],
    },
  ] as never);
  m.getTopRatedMovies.mockResolvedValue([] as never);
  m.getUpcomingMovies.mockResolvedValue([
    {
      id: 2026,
      title: 'Future Movie 1',
      overview: 'Overview text 1',
      backdrop_path: '/u1.jpg',
      poster_path: null,
      genre_ids: [28],
      vote_average: 8,
      release_date: '2026-12-01',
    },
    {
      id: 2027,
      title: 'Future Movie 2',
      overview: 'Overview text 2',
      backdrop_path: '/u2.jpg',
      poster_path: null,
      genre_ids: [35],
      vote_average: 7.5,
      release_date: '2026-12-15',
    },
  ] as never);
  m.getMovieDetails.mockResolvedValue({
    id: 550,
    title: 'Fight Club',
    overview: '',
    poster_path: null,
    backdrop_path: null,
    vote_average: 0,
    release_date: '',
    genre_ids: [],
  } as never);
  m.getMovieTrailer.mockResolvedValue('dQw4w9WgXcQ' as never);
  m.getMovieReviews.mockResolvedValue({
    results: [
      {
        id: '1',
        author: 'John Doe',
        content: '',
        author_details: { avatar_path: null },
      },
      {
        id: '2',
        author: 'Jane Smith',
        content: '',
        author_details: { avatar_path: null },
      },
    ],
    total_results: 2,
  } as never);
  m.getGenres.mockResolvedValue([{ id: 28, name: 'Action' }] as never);
  m.searchMovies.mockResolvedValue([
    {
      id: 1,
      title: 'Test Movie',
      vote_average: 7,
      poster_path: '/x.jpg',
      overview: '',
      backdrop_path: null,
      release_date: '',
      genre_ids: [28],
    },
  ] as never);
});

describe('usePopularMovies', () => {
  it('returns movies on resolve', async () => {
    const { result } = renderHook(() => usePopularMovies());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.movies).toHaveLength(2);
    expect(result.current.error).toBeNull();
  });

  it('passes page param', async () => {
    const { result } = renderHook(() => usePopularMovies(3));
    await waitFor(() => expect(result.current.loading).toBe(false));
    const { getPopularMovies } = await import('../test/mocks/tmdb');
    expect(getPopularMovies).toHaveBeenCalledWith(3);
  });
});

describe('useUpcomingMovies', () => {
  it('returns upcoming movies', async () => {
    const { result } = renderHook(() => useUpcomingMovies());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.movies).toHaveLength(2);
  });
});

describe('useTopRatedMovies', () => {
  it('returns top rated movies', async () => {
    const { result } = renderHook(() => useTopRatedMovies());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.movies).toEqual([]);
  });
});

describe('useMovieDetails', () => {
  it('returns details on resolve', async () => {
    const { result } = renderHook(() => useMovieDetails(550));
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.movie?.id).toBe(550);
  });

  it('skips fetch when no id', () => {
    const { result } = renderHook(() => useMovieDetails(null));
    expect(result.current.movie).toBeNull();
  });
});

describe('useMovieTrailer', () => {
  it('returns trailer key', async () => {
    const { result } = renderHook(() => useMovieTrailer(550));
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.trailerKey).toBe('dQw4w9WgXcQ');
  });
});

describe('useMovieReviews', () => {
  it('returns reviews + total', async () => {
    const { result } = renderHook(() => useMovieReviews(550));
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.reviews).toHaveLength(2);
    expect(result.current.totalReviews).toBe(2);
  });
});

describe('useGenres', () => {
  it('returns genre array', async () => {
    const { result } = renderHook(() => useGenres());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.genres).toContainEqual({ id: 28, name: 'Action' });
  });
});

describe('useSearch', () => {
  it('skips call on empty query', async () => {
    const { result } = renderHook(() => useSearch(''));
    await waitFor(() => expect(result.current.results).toEqual([]));
    const { searchMovies } = await import('../test/mocks/tmdb');
    expect(searchMovies).not.toHaveBeenCalled();
  });

  it('returns results after debounce', async () => {
    const { result } = renderHook(() => useSearch('action', 0));
    await waitFor(() => expect(result.current.results).toHaveLength(1));
  });
});
