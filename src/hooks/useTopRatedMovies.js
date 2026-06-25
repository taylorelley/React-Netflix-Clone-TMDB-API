import { useState, useEffect } from 'react';
import { getTopRatedMovies } from '../lib/tmdb';

/**
 * Fetches top-rated movies (first 10).
 * @returns {{ movies: Movie[], loading: boolean, error: Error|null }}
 */
export function useTopRatedMovies() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    getTopRatedMovies()
      .then(setMovies)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return { movies, loading, error };
}