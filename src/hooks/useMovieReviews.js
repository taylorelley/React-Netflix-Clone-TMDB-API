import { useState, useEffect } from 'react';
import { getMovieReviews } from '../lib/tmdb';

/**
 * Fetches reviews for a movie.
 * @param {number|string} id
 * @returns {{ reviews: Review[], totalReviews: number, loading: boolean, error: Error|null }}
 */
export function useMovieReviews(id) {
  const [reviews, setReviews] = useState([]);
  const [totalReviews, setTotalReviews] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getMovieReviews(id)
      .then(data => {
        setReviews(data.results);
        setTotalReviews(data.total_results);
      })
      .catch(setError)
      .finally(() => setLoading(false));
  }, [id]);

  return { reviews, totalReviews, loading, error };
}