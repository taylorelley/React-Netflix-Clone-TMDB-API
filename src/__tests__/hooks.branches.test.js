import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';

vi.mock('../lib/tmdb', () => import('../test/mocks/tmdb'));

import { useMovieTrailer } from '../hooks/useMovieTrailer';
import { useMovieReviews } from '../hooks/useMovieReviews';
import { useSearch } from '../hooks/useSearch';
import * as m from '../test/mocks/tmdb';

describe('Hook branch coverage', () => {
  describe('useMovieTrailer', () => {
    it('skips fetch when id is null (if !id guard)', async () => {
      m.getMovieTrailer.mockResolvedValue('should-not-call');
      const { result } = renderHook(() => useMovieTrailer(null));
      // Wait a tick to ensure no fetch happens
      await new Promise((r) => setTimeout(r, 10));
      expect(m.getMovieTrailer).not.toHaveBeenCalled();
      expect(result.current.trailerKey).toBeNull();
    });

    it('sets error when fetch rejects', async () => {
      m.getMovieTrailer.mockRejectedValueOnce(new Error('boom'));
      const { result, rerender } = renderHook(() => useMovieTrailer(550));
      rerender();
      await new Promise((r) => setTimeout(r, 10));
      expect(result.current.error).toBeTruthy();
    });
  });

  describe('useMovieReviews', () => {
    it('skips fetch when id is null (if !id guard)', async () => {
      m.getMovieReviews.mockResolvedValue({ results: [], total_results: 0 });
      const { result } = renderHook(() => useMovieReviews(null));
      await new Promise((r) => setTimeout(r, 10));
      expect(m.getMovieReviews).not.toHaveBeenCalled();
      expect(result.current.reviews).toEqual([]);
    });

    it('sets error when fetch rejects', async () => {
      m.getMovieReviews.mockRejectedValueOnce(new Error('boom'));
      const { result } = renderHook(() => useMovieReviews(550));
      await new Promise((r) => setTimeout(r, 10));
      expect(result.current.error).toBeTruthy();
    });
  });

  describe('useSearch', () => {
    it('empty query returns empty results, no call', async () => {
      m.searchMovies.mockResolvedValue([{ id: 1 }]);
      const { result } = renderHook(() => useSearch(''));
      await new Promise((r) => setTimeout(r, 10));
      expect(m.searchMovies).not.toHaveBeenCalled();
      expect(result.current.results).toEqual([]);
    });

    it('whitespace-only query treated as empty', async () => {
      m.searchMovies.mockResolvedValue([{ id: 1 }]);
      const { result } = renderHook(() => useSearch('   '));
      await new Promise((r) => setTimeout(r, 10));
      expect(m.searchMovies).not.toHaveBeenCalled();
      expect(result.current.results).toEqual([]);
    });

    it('clears results on search error', async () => {
      m.searchMovies.mockRejectedValueOnce(new Error('boom'));
      const { result } = renderHook(() => useSearch('matrix', 0));
      await new Promise((r) => setTimeout(r, 50));
      expect(result.current.results).toEqual([]);
    });
  });
});