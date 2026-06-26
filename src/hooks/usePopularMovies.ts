import { useState, useEffect } from 'react';
import { getPopularMovies } from '../lib/tmdb';
import type { Movie } from '../types/tmdb';

export interface UsePopularMoviesResult {
  movies: Movie[];
  loading: boolean;
  error: Error | null;
  totalPages: number;
}

/**
 * Fetches and returns paginated popular movies.
 * @param page Page number, defaults to 1
 */
export function usePopularMovies(page: number = 1): UsePopularMoviesResult {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [totalPages, setTotalPages] = useState<number>(1);

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    setError(null);
    getPopularMovies(page)
      .then((data) => {
        if (!ignore) {
          setMovies(data.movies);
          setTotalPages(data.totalPages);
        }
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
  }, [page]);

  return { movies, loading, error, totalPages };
}
