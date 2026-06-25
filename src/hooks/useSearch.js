import { useState, useEffect } from 'react';
import { searchMovies } from '../lib/tmdb';

/**
 * Debounced movie search hook.
 * @param {string} query
 * @param {number} [delay=300]
 * @returns {{ results: Movie[], loading: boolean }}
 */
export function useSearch(query, delay = 300) {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) { setResults([]); return; }
    setLoading(true);
    const timer = setTimeout(() =>
      searchMovies(query)
        .then(setResults)
        .catch(() => setResults([]))
        .finally(() => setLoading(false)),
      delay
    );
    return () => clearTimeout(timer);
  }, [query, delay]);

  return { results, loading };
}