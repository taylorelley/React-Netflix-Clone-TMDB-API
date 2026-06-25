import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';

vi.mock('../../lib/tmdb', () => import('../../test/mocks/tmdb'));

import { useSearch } from '../../hooks/useSearch';
import * as tmdbMocks from '../../test/mocks/tmdb';

beforeEach(() => {
  tmdbMocks.searchMovies.mockReset();
  tmdbMocks.searchMovies.mockResolvedValue([{ id: 1, title: 'Result' }]);
});

describe('useSearch', () => {
  it('empty query skips call', async () => {
    const { result } = renderHook(() => useSearch(''));
    await waitFor(() => expect(result.current.results).toEqual([]));
    expect(tmdbMocks.searchMovies).not.toHaveBeenCalled();
  });

  it('debounces call (delay 0 returns results)', async () => {
    const { result } = renderHook(() => useSearch('matrix', 0));
    await waitFor(() => expect(result.current.results).toHaveLength(1));
    expect(result.current.results[0].title).toBe('Result');
  });

  it('debounce delays call when delay > 0', async () => {
    renderHook(() => useSearch('matrix', 100));
    await new Promise((r) => setTimeout(r, 30));
    expect(tmdbMocks.searchMovies).not.toHaveBeenCalled();
    await new Promise((r) => setTimeout(r, 100));
    expect(tmdbMocks.searchMovies).toHaveBeenCalledWith('matrix');
  });
});