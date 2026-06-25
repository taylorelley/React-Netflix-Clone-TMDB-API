/**
 * TMDB API client. Centralizes all API calls to the local Next.js proxy.
 *
 * To use, set TMDB_API_KEY in `.env.local` (server-side only — never
 * exposed to the client). All hooks import from this module; no
 * direct fetch/axios calls live elsewhere.
 */
import type { Movie, Genre, Review } from '@/types/tmdb';

const BASE_URL = '/api/tmdb';

async function get<T>(
  path: string,
  params?: Record<string, string | number | undefined>,
): Promise<T> {
  const qs = new URLSearchParams();
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== null) qs.set(k, String(v));
    }
  }
  const url = qs.toString() ? `${BASE_URL}/${path}?${qs}` : `${BASE_URL}/${path}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`TMDB request failed: ${res.status}`);
  }
  return res.json() as Promise<T>;
}

/**
 * Fetches a paginated list of popular movies.
 */
export function getPopularMovies(page = 1): Promise<Movie[]> {
  return get('movie/popular', { page }).then((d) => (d as { results: Movie[] }).results);
}

/**
 * Fetches top-rated movies (first page, first 10 results).
 */
export function getTopRatedMovies(): Promise<Movie[]> {
  return get('movie/top_rated', { page: 1 }).then((d) =>
    ((d as { results?: Movie[] }).results || []).slice(0, 10),
  );
}

/**
 * Fetches upcoming movies.
 */
export function getUpcomingMovies(): Promise<Movie[]> {
  return get('movie/upcoming').then((d) => (d as { results: Movie[] }).results);
}

/**
 * Fetches full movie details by ID.
 */
export function getMovieDetails(id: string | number): Promise<Movie> {
  return get<Movie>(`movie/${id}`);
}

/**
 * Fetches YouTube trailer key for a movie.
 */
export function getMovieTrailer(id: string | number): Promise<string | null> {
  return get(`movie/${id}/videos`, { language: 'en-US' }).then((d) => {
    const results = (d as { results: { key: string; site: string; type: string }[] }).results;
    return results.find((v) => v.site === 'YouTube' && v.type === 'Trailer')?.key ?? null;
  });
}

/**
 * Fetches reviews for a movie.
 */
export function getMovieReviews(
  id: string | number,
): Promise<{ results: Review[]; total_results: number }> {
  return get<{ results: Review[]; total_results: number }>(`movie/${id}/reviews`);
}

/**
 * Fetches the full genre list.
 */
export function getGenres(): Promise<Genre[]> {
  return get('genre/movie/list').then((d) => (d as { genres: Genre[] }).genres);
}

/**
 * Searches movies by query string.
 */
export function searchMovies(query: string): Promise<Movie[]> {
  return get('search/movie', { query }).then((d) => (d as { results: Movie[] }).results);
}
