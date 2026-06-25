import { describe, it, expect, vi, beforeEach } from 'vitest';

const { mockClient } = vi.hoisted(() => ({ mockClient: { get: vi.fn() } }));

vi.mock('axios', () => ({
  default: {
    create: vi.fn(() => mockClient),
  },
}));

beforeEach(() => {
  mockClient.get.mockReset();
  mockClient.get.mockResolvedValue({ data: { results: [] } });
});

import {
  getPopularMovies,
  getTopRatedMovies,
  getUpcomingMovies,
  getMovieDetails,
  getMovieTrailer,
  getMovieReviews,
  getGenres,
  searchMovies,
} from '../lib/tmdb';

describe('lib/tmdb.js — real axios call paths', () => {
  it('getPopularMovies hits /movie/popular with api_key + page', async () => {
    mockClient.get.mockResolvedValue({ data: { results: [{ id: 1 }] } });
    const result = await getPopularMovies(2);
    expect(mockClient.get).toHaveBeenCalledWith('/movie/popular', {
      params: expect.objectContaining({ page: 2 }),
    });
    expect(result).toEqual([{ id: 1 }]);
  });

  it('getPopularMovies defaults page to 1', async () => {
    await getPopularMovies();
    expect(mockClient.get).toHaveBeenCalledWith('/movie/popular', {
      params: expect.objectContaining({ page: 1 }),
    });
  });

  it('getTopRatedMovies hits /movie/top_rated + slices to 10', async () => {
    mockClient.get.mockResolvedValue({
      data: { results: Array.from({ length: 20 }, (_, i) => ({ id: i })) },
    });
    const result = await getTopRatedMovies();
    expect(mockClient.get).toHaveBeenCalledWith('/movie/top_rated', {
      params: expect.objectContaining({ page: 1 }),
    });
    expect(result).toHaveLength(10);
  });

  it('getTopRatedMovies handles missing results', async () => {
    mockClient.get.mockResolvedValue({ data: {} });
    const result = await getTopRatedMovies();
    expect(result).toEqual([]);
  });

  it('getUpcomingMovies hits /movie/upcoming', async () => {
    mockClient.get.mockResolvedValue({ data: { results: [{ id: 99 }] } });
    const result = await getUpcomingMovies();
    expect(mockClient.get).toHaveBeenCalledWith('/movie/upcoming', {
      params: expect.any(Object),
    });
    expect(result).toEqual([{ id: 99 }]);
  });

  it('getMovieDetails hits /movie/:id', async () => {
    mockClient.get.mockResolvedValue({ data: { id: 550 } });
    const result = await getMovieDetails(550);
    expect(mockClient.get).toHaveBeenCalledWith('/movie/550', {
      params: expect.any(Object),
    });
    expect(result.id).toBe(550);
  });

  it('getMovieTrailer filters YouTube+Trailer and returns key', async () => {
    mockClient.get.mockResolvedValue({
      data: {
        results: [
          { key: 'k1', site: 'Vimeo', type: 'Trailer' },
          { key: 'k2', site: 'YouTube', type: 'Clip' },
          { key: 'real', site: 'YouTube', type: 'Trailer' },
        ],
      },
    });
    const result = await getMovieTrailer(550);
    expect(mockClient.get).toHaveBeenCalledWith('/movie/550/videos', {
      params: expect.objectContaining({ language: 'en-US' }),
    });
    expect(result).toBe('real');
  });

  it('getMovieTrailer returns null when no YouTube+Trailer match', async () => {
    mockClient.get.mockResolvedValue({
      data: {
        results: [
          { key: 'k1', site: 'YouTube', type: 'Clip' },
          { key: 'k2', site: 'Vimeo', type: 'Trailer' },
        ],
      },
    });
    const result = await getMovieTrailer(550);
    expect(result).toBeNull();
  });

  it('getMovieReviews hits /movie/:id/reviews', async () => {
    mockClient.get.mockResolvedValue({ data: { results: [{ id: 'r1' }], total_results: 1 } });
    const result = await getMovieReviews(550);
    expect(mockClient.get).toHaveBeenCalledWith('/movie/550/reviews', {
      params: expect.any(Object),
    });
    expect(result.total_results).toBe(1);
  });

  it('getGenres hits /genre/movie/list and unwraps .genres', async () => {
    mockClient.get.mockResolvedValue({ data: { genres: [{ id: 28, name: 'Action' }] } });
    const result = await getGenres();
    expect(mockClient.get).toHaveBeenCalledWith('/genre/movie/list', {
      params: expect.any(Object),
    });
    expect(result).toEqual([{ id: 28, name: 'Action' }]);
  });

  it('searchMovies hits /search/movie with query', async () => {
    mockClient.get.mockResolvedValue({ data: { results: [{ id: 7 }] } });
    const result = await searchMovies('matrix');
    expect(mockClient.get).toHaveBeenCalledWith('/search/movie', {
      params: expect.objectContaining({ query: 'matrix' }),
    });
    expect(result).toEqual([{ id: 7 }]);
  });
});