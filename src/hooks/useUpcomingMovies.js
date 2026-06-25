import { useState, useEffect } from 'react';
import { getUpcomingMovies } from '../lib/tmdb';

/**
 * Fetches upcoming movies.
 * @returns {{ movies: Movie[], loading: boolean, error: Error|null }}
 */
export function useUpcomingMovies() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    getUpcomingMovies()
      .then(setMovies)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return { movies, loading, error };
}