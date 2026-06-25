import { useState, useEffect } from 'react';
import { getUpcomingMovies } from '../lib/tmdb';
import type { Movie } from '../types/tmdb';

export interface UseUpcomingMoviesResult {
  movies: Movie[];
  loading: boolean;
  error: Error | null;
}

/**
 * Fetches upcoming movies.
 */
export function useUpcomingMovies(): UseUpcomingMoviesResult {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setLoading(true);
    getUpcomingMovies()
      .then(setMovies)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return { movies, loading, error };
}
