import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';

vi.mock('../../lib/tmdb', () => import('../../test/mocks/tmdb'));

import { useGenres } from '../../hooks/useGenres';
import * as tmdbMocks from '../../test/mocks/tmdb';

beforeEach(() => {
  tmdbMocks.getGenres.mockReset();
  tmdbMocks.getGenres.mockResolvedValue([
    { id: 28, name: 'Action' },
    { id: 35, name: 'Comedy' },
  ]);
});

describe('useGenres', () => {
  it('returns genre array', async () => {
    const { result } = renderHook(() => useGenres());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.genres).toContainEqual({ id: 28, name: 'Action' });
    expect(result.current.genres).toContainEqual({ id: 35, name: 'Comedy' });
  });
});
