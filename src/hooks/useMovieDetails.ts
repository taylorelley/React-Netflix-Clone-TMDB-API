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
export function useMovieDetails(id: number | string | null): UseMovieDetailsResult {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!id) return;
    let ignore = false;
    setLoading(true);
    setError(null);
    getMovieDetails(id)
      .then((data) => {
        if (!ignore) setMovie(data);
      })
      .catch((err) => {
        if (!ignore) setError(err);
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });
    return () => {
      ignore = true;
    };
  }, [id]);

  return { movie, loading, error };
}
