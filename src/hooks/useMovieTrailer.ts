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
export function useMovieTrailer(id: number | string | null): UseMovieTrailerResult {
  const [trailerKey, setTrailerKey] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!id) return;
    let ignore = false;
    setLoading(true);
    setError(null);
    setTrailerKey(null);
    getMovieTrailer(id)
      .then((data) => {
        if (!ignore) setTrailerKey(data);
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

  return { trailerKey, loading, error };
}
