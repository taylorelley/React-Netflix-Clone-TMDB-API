import { useState, useEffect } from 'react';
import { getMovieDetails } from '../lib/tmdb';

/**
 * Fetches full movie details by ID.
 * @param {number|string} id
 * @returns {{ movie: MovieDetails|null, loading: boolean, error: Error|null }}
 */
export function useMovieDetails(id) {
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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