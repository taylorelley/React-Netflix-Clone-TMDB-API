import { useState, useEffect } from 'react';
import { getGenres } from '../lib/tmdb';

/**
 * Fetches the full genre list from TMDB.
 * @returns {{ genres: Genre[], loading: boolean, error: Error|null }}
 */
export function useGenres() {
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    getGenres()
      .then(setGenres)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return { genres, loading, error };
}