/**
 * TMDB API client. Centralizes all API calls to themoviedb.org.
 * Every module imports from here — no direct axios calls elsewhere.
 *
 * To use, set VITE_TMDB_API_KEY and VITE_TMDB_BASE_URL in .env.
 */
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_TMDB_BASE_URL ?? 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const client = axios.create({ baseURL: BASE_URL });

/**
 * Fetches a paginated list of popular movies.
 * @param {number} page
 * @returns {Promise<Movie[]>}
 */
export const getPopularMovies = (page = 1) =>
  client.get('/movie/popular', { params: { api_key: API_KEY, page } }).then(r => r.data.results);

/**
 * Fetches top-rated movies (first page, first 10 results).
 * @returns {Promise<Movie[]>}
 */
export const getTopRatedMovies = () =>
  client.get('/movie/top_rated', { params: { api_key: API_KEY, page: 1 } }).then(r => (r.data.results || []).slice(0, 10));

/**
 * Fetches upcoming movies.
 * @returns {Promise<Movie[]>}
 */
export const getUpcomingMovies = () =>
  client.get('/movie/upcoming', { params: { api_key: API_KEY } }).then(r => r.data.results);

/**
 * Fetches full movie details by ID.
 * @param {number|string} id
 * @returns {Promise<MovieDetails>}
 */
export const getMovieDetails = (id) =>
  client.get(`/movie/${id}`, { params: { api_key: API_KEY } }).then(r => r.data);

/**
 * Fetches YouTube trailer key for a movie.
 * @param {number|string} id
 * @returns {Promise<string|null>}
 */
export const getMovieTrailer = (id) =>
  client.get(`/movie/${id}/videos`, { params: { api_key: API_KEY, language: 'en-US' } })
    .then(r => r.data.results.find(v => v.site === 'YouTube' && v.type === 'Trailer')?.key ?? null);

/**
 * Fetches reviews for a movie.
 * @param {number|string} id
 * @returns {Promise<{ results: Review[], total_results: number }>}
 */
export const getMovieReviews = (id) =>
  client.get(`/movie/${id}/reviews`, { params: { api_key: API_KEY } }).then(r => r.data);

/**
 * Fetches the full genre list.
 * @returns {Promise<Genre[]>}
 */
export const getGenres = () =>
  client.get('/genre/movie/list', { params: { api_key: API_KEY } }).then(r => r.data.genres);

/**
 * Searches movies by query string.
 * @param {string} query
 * @returns {Promise<Movie[]>}
 */
export const searchMovies = (query) =>
  client.get('/search/movie', { params: { api_key: API_KEY, query } }).then(r => r.data.results);