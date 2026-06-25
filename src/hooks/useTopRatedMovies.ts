import { useState, useEffect } from 'react';
import { getTopRatedMovies } from '../lib/tmdb';
import type { Movie } from '../types/tmdb';

export interface UseTopRatedMoviesResult {
  movies: Movie[];
  loading: boolean;
  error: Error | null;
}

/**
 * Fetches top-rated movies (first 10).
 */
export function useTopRatedMovies(): UseTopRatedMoviesResult {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setLoading(true);
    getTopRatedMovies()
      .then(setMovies)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return { movies, loading, error };
}
