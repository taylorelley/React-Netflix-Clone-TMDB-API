import { useState, useEffect } from 'react';
import { getPopularMovies } from '../lib/tmdb';

/**
 * Fetches and returns paginated popular movies.
 * @param {number} [page=1]
 * @returns {{ movies: Movie[], loading: boolean, error: Error|null }}
 */
export function usePopularMovies(page = 1) {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    getPopularMovies(page)
      .then(setMovies)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [page]);

  return { movies, loading, error };
}