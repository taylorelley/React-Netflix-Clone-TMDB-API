import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

let fetchMock: ReturnType<typeof vi.fn>;

beforeEach(() => {
  fetchMock = vi.fn();
  global.fetch = fetchMock as unknown as typeof fetch;
  fetchMock.mockResolvedValue({
    ok: true,
    status: 200,
    json: () => Promise.resolve({ results: [] }),
  });
});

afterEach(() => {
  delete (global as { fetch?: unknown }).fetch;
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
} from '@/lib/tmdb';

describe('lib/tmdb.ts — fetch call paths', () => {
  it('getPopularMovies hits /api/tmdb/movie/popular with page', async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () => Promise.resolve({ results: [{ id: 1 }], total_pages: 5 }),
    });
    const result = await getPopularMovies(2);
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringMatching(/\/api\/tmdb\/movie\/popular\?.*page=2/),
    );
    expect(result.movies).toEqual([{ id: 1 }]);
    expect(result.totalPages).toBe(5);
  });

  it('getPopularMovies defaults page to 1', async () => {
    await getPopularMovies();
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringMatching(/\/api\/tmdb\/movie\/popular\?.*page=1/),
    );
  });

  it('getTopRatedMovies hits /api/tmdb/movie/top_rated + slices to 10', async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () => Promise.resolve({ results: Array.from({ length: 20 }, (_, i) => ({ id: i })) }),
    });
    const result = await getTopRatedMovies();
    expect(fetchMock).toHaveBeenCalledWith(expect.stringMatching(/\/api\/tmdb\/movie\/top_rated/));
    expect(result).toHaveLength(10);
  });

  it('getTopRatedMovies handles missing results', async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () => Promise.resolve({}),
    });
    const result = await getTopRatedMovies();
    expect(result).toEqual([]);
  });

  it('getUpcomingMovies hits /api/tmdb/movie/upcoming', async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () => Promise.resolve({ results: [{ id: 99 }] }),
    });
    const result = await getUpcomingMovies();
    expect(fetchMock).toHaveBeenCalledWith(expect.stringMatching(/\/api\/tmdb\/movie\/upcoming/));
    expect(result).toEqual([{ id: 99 }]);
  });

  it('getMovieDetails hits /api/tmdb/movie/:id', async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () => Promise.resolve({ id: 550 }),
    });
    const result = await getMovieDetails(550);
    expect(fetchMock).toHaveBeenCalledWith(expect.stringMatching(/\/api\/tmdb\/movie\/550/));
    expect(result.id).toBe(550);
  });

  it('getMovieTrailer filters YouTube+Trailer and returns key', async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () =>
        Promise.resolve({
          results: [
            { key: 'k1', site: 'Vimeo', type: 'Trailer' },
            { key: 'k2', site: 'YouTube', type: 'Clip' },
            { key: 'real', site: 'YouTube', type: 'Trailer' },
          ],
        }),
    });
    const result = await getMovieTrailer(550);
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringMatching(/\/api\/tmdb\/movie\/550\/videos\?.*language=en-US/),
    );
    expect(result).toBe('real');
  });

  it('getMovieTrailer returns null when no YouTube+Trailer match', async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () =>
        Promise.resolve({
          results: [
            { key: 'k1', site: 'YouTube', type: 'Clip' },
            { key: 'k2', site: 'Vimeo', type: 'Trailer' },
          ],
        }),
    });
    const result = await getMovieTrailer(550);
    expect(result).toBeNull();
  });

  it('getMovieReviews hits /api/tmdb/movie/:id/reviews', async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () => Promise.resolve({ results: [{ id: 'r1' }], total_results: 1 }),
    });
    const result = await getMovieReviews(550);
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringMatching(/\/api\/tmdb\/movie\/550\/reviews/),
    );
    expect(result.total_results).toBe(1);
  });

  it('getGenres hits /api/tmdb/genre/movie/list and unwraps .genres', async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () => Promise.resolve({ genres: [{ id: 28, name: 'Action' }] }),
    });
    const result = await getGenres();
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringMatching(/\/api\/tmdb\/genre\/movie\/list/),
    );
    expect(result).toEqual([{ id: 28, name: 'Action' }]);
  });

  it('searchMovies hits /api/tmdb/search/movie with query', async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () => Promise.resolve({ results: [{ id: 7 }] }),
    });
    const result = await searchMovies('matrix');
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringMatching(/\/api\/tmdb\/search\/movie\?.*query=matrix/),
    );
    expect(result).toEqual([{ id: 7 }]);
  });

  it('throws when fetch returns non-ok status', async () => {
    fetchMock.mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: () => Promise.resolve({}),
    });
    await expect(getPopularMovies()).rejects.toThrow('TMDB request failed: 500');
  });
});
