import { useState, useEffect } from 'react';
import { searchMovies } from '../lib/tmdb';
import type { Movie } from '../types/tmdb';

export interface UseSearchResult {
  results: Movie[];
  loading: boolean;
}

/**
 * Debounced movie search hook.
 * @param query Search query string
 * @param delay Debounce delay in ms (default 300)
 */
export function useSearch(query: string, delay: number = 300): UseSearchResult {
  const [results, setResults] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }
    let ignore = false;
    setLoading(true);
    const timer = setTimeout(() => {
      searchMovies(query)
        .then((data) => {
          if (!ignore) setResults(data);
        })
        .catch(() => {
          if (!ignore) setResults([]);
        })
        .finally(() => {
          if (!ignore) setLoading(false);
        });
    }, delay);
    return () => {
      ignore = true;
      clearTimeout(timer);
    };
  }, [query, delay]);

  return { results, loading };
}
