/**
 * TMDB API client. Centralizes all API calls to themoviedb.org.
 * Every module imports from here — no direct axios calls elsewhere.
 *
 * To use, set VITE_TMDB_API_KEY and VITE_TMDB_BASE_URL in .env.
 */
import axios, { type AxiosInstance } from 'axios';
import type { Movie, Genre, Review } from '../types/tmdb';

const BASE_URL: string =
  (import.meta.env.VITE_TMDB_BASE_URL as string | undefined) ??
  'https://api.themoviedb.org/3';
const API_KEY: string = import.meta.env.VITE_TMDB_API_KEY as string;

const client: AxiosInstance = axios.create({ baseURL: BASE_URL });

/**
 * Fetches a paginated list of popular movies.
 * @param page Page number, defaults to 1
 * @returns Array of movie objects
 */
export const getPopularMovies = (page: number = 1): Promise<Movie[]> =>
  client
    .get('/movie/popular', { params: { api_key: API_KEY, page } })
    .then((r) => r.data.results);

/**
 * Fetches top-rated movies (first page, first 10 results).
 * @returns Array of up to 10 top-rated movie objects
 */
export const getTopRatedMovies = (): Promise<Movie[]> =>
  client
    .get('/movie/top_rated', { params: { api_key: API_KEY, page: 1 } })
    .then((r) => (r.data.results ?? []).slice(0, 10));

/**
 * Fetches upcoming movies.
 * @returns Array of upcoming movie objects
 */
export const getUpcomingMovies = (): Promise<Movie[]> =>
  client
    .get('/movie/upcoming', { params: { api_key: API_KEY } })
    .then((r) => r.data.results);

/**
 * Fetches full movie details by ID.
 * @param id TMDB movie id (number or numeric string)
 * @returns Movie object with detail fields populated
 */
export const getMovieDetails = (id: number | string): Promise<Movie> =>
  client
    .get(`/movie/${id}`, { params: { api_key: API_KEY } })
    .then((r) => r.data);

/**
 * Fetches YouTube trailer key for a movie.
 * @param id TMDB movie id
 * @returns YouTube video key, or null when no YouTube+Trailer match
 */
export const getMovieTrailer = (id: number | string): Promise<string | null> =>
  client
    .get(`/movie/${id}/videos`, {
      params: { api_key: API_KEY, language: 'en-US' },
    })
    .then(
      (r) =>
        r.data.results.find(
          (v: { site: string; type: string; key: string }) =>
            v.site === 'YouTube' && v.type === 'Trailer',
        )?.key ?? null,
    );

/**
 * Fetches reviews for a movie.
 * @param id TMDB movie id
 * @returns Object containing reviews array and total count
 */
export const getMovieReviews = (
  id: number | string,
): Promise<{ results: Review[]; total_results: number }> =>
  client
    .get(`/movie/${id}/reviews`, { params: { api_key: API_KEY } })
    .then((r) => r.data);

/**
 * Fetches the full genre list.
 * @returns Array of genre objects
 */
export const getGenres = (): Promise<Genre[]> =>
  client
    .get('/genre/movie/list', { params: { api_key: API_KEY } })
    .then((r) => r.data.genres);

/**
 * Searches movies by query string.
 * @param query Search query
 * @returns Array of movie objects matching the query
 */
export const searchMovies = (query: string): Promise<Movie[]> =>
  client
    .get('/search/movie', { params: { api_key: API_KEY, query } })
    .then((r) => r.data.results);
