import { useState, useEffect } from 'react';
import { getPopularMovies } from '../lib/tmdb';
import type { Movie } from '../types/tmdb';

export interface UsePopularMoviesResult {
  movies: Movie[];
  loading: boolean;
  error: Error | null;
}

/**
 * Fetches and returns paginated popular movies.
 * @param page Page number, defaults to 1
 */
export function usePopularMovies(page: number = 1): UsePopularMoviesResult {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setLoading(true);
    getPopularMovies(page)
      .then(setMovies)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [page]);

  return { movies, loading, error };
}
