import { useState, useEffect } from 'react';
import { getMovieTrailer } from '../lib/tmdb';

export interface UseMovieTrailerResult {
  trailerKey: string | null;
  loading: boolean;
  error: Error | null;
}

/**
 * Fetches YouTube trailer key for a movie.
 * @param id TMDB movie id
 */
export function useMovieTrailer(
  id: number | string | null,
): UseMovieTrailerResult {
  const [trailerKey, setTrailerKey] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getMovieTrailer(id)
      .then(setTrailerKey)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [id]);

  return { trailerKey, loading, error };
}
