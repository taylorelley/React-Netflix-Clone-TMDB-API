import { useState, useEffect } from 'react';
import { getMovieDetails } from '../lib/tmdb';
import type { Movie } from '../types/tmdb';

export interface UseMovieDetailsResult {
  movie: Movie | null;
  loading: boolean;
  error: Error | null;
}

/**
 * Fetches full movie details by ID.
 * @param id TMDB movie id
 */
export function useMovieDetails(
  id: number | string | null,
): UseMovieDetailsResult {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getMovieDetails(id)
      .then(setMovie)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [id]);

  return { movie, loading, error };
}
