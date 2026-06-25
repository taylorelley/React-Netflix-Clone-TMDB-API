import { useState, useEffect } from 'react';
import { getMovieReviews } from '../lib/tmdb';
import type { Review } from '../types/tmdb';

export interface UseMovieReviewsResult {
  reviews: Review[];
  totalReviews: number;
  loading: boolean;
  error: Error | null;
}

/**
 * Fetches reviews for a movie.
 * @param id TMDB movie id
 */
export function useMovieReviews(id: number | string | null): UseMovieReviewsResult {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [totalReviews, setTotalReviews] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getMovieReviews(id)
      .then((data) => {
        setReviews(data.results);
        setTotalReviews(data.total_results);
      })
      .catch(setError)
      .finally(() => setLoading(false));
  }, [id]);

  return { reviews, totalReviews, loading, error };
}
