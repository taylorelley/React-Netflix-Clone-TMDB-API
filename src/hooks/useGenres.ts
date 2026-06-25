import { useState, useEffect } from 'react';
import { getGenres } from '../lib/tmdb';
import type { Genre } from '../types/tmdb';

export interface UseGenresResult {
  genres: Genre[];
  loading: boolean;
  error: Error | null;
}

/**
 * Fetches the full genre list from TMDB.
 */
export function useGenres(): UseGenresResult {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setLoading(true);
    getGenres()
      .then(setGenres)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return { genres, loading, error };
}
