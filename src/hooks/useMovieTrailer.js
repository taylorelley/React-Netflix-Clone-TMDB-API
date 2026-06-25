import { useState, useEffect } from 'react';
import { getMovieTrailer } from '../lib/tmdb';

/**
 * Fetches YouTube trailer key for a movie.
 * @param {number|string} id
 * @returns {{ trailerKey: string|null, loading: boolean, error: Error|null }}
 */
export function useMovieTrailer(id) {
  const [trailerKey, setTrailerKey] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getMovieTrailer(id)
      .then(setTrailerKey)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [id]);

  return { trailerKey, loading, error };
}