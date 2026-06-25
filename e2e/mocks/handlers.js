import { http, HttpResponse } from 'msw';

const BASE = 'https://api.themoviedb.org/3';

const popularResponse = {
  page: 1,
  results: [
    {
      id: 1,
      title: 'Inception',
      vote_average: 8.4,
      poster_path: '/inception.jpg',
      genre_ids: [28, 12],
      release_date: '2010-07-15',
    },
    {
      id: 2,
      title: 'The Matrix',
      vote_average: 8.7,
      poster_path: '/matrix.jpg',
      genre_ids: [28],
      release_date: '1999-03-30',
    },
    {
      id: 3,
      title: 'Interstellar',
      vote_average: 8.6,
      poster_path: '/inter.jpg',
      genre_ids: [12, 18],
      release_date: '2014-11-07',
    },
  ],
  total_pages: 10,
  total_results: 30,
};

const topRatedResponse = {
  page: 1,
  results: [
    {
      id: 550,
      title: 'Fight Club',
      vote_average: 8.4,
      poster_path: '/fc.jpg',
      backdrop_path: '/fc-bd.jpg',
      genre_ids: [18],
    },
    {
      id: 155,
      title: 'The Dark Knight',
      vote_average: 9.0,
      poster_path: '/dk.jpg',
      backdrop_path: '/dk-bd.jpg',
      genre_ids: [28, 80],
    },
  ],
  total_pages: 5,
  total_results: 10,
};

const upcomingResponse = {
  page: 1,
  results: [
    {
      id: 1001,
      title: 'Upcoming 1',
      overview: 'An upcoming movie 1.',
      backdrop_path: '/up1.jpg',
      genre_ids: [28],
      vote_average: 7,
      release_date: '2026-12-01',
    },
    {
      id: 1002,
      title: 'Upcoming 2',
      overview: 'An upcoming movie 2.',
      backdrop_path: '/up2.jpg',
      genre_ids: [35],
      vote_average: 8,
      release_date: '2026-12-15',
    },
  ],
  total_pages: 1,
  total_results: 2,
};

const detail550 = {
  id: 550,
  title: 'Fight Club',
  overview: 'An insomniac office worker...',
  poster_path: '/fc.jpg',
  backdrop_path: '/fc-bd.jpg',
  vote_average: 8.4,
  genres: [{ id: 18, name: 'Drama' }],
  runtime: 139,
  budget: 63000000,
  tagline: 'Mischief. Mayhem. Soap.',
  status: 'Released',
  release_date: '1999-10-15',
};

const reviews550 = {
  results: [
    {
      id: 'r1',
      author: 'Alice',
      content: 'Great movie! ' + 'a'.repeat(310),
      author_details: { avatar_path: '/av1.jpg' },
    },
    {
      id: 'r2',
      author: 'Bob',
      content: 'Brilliant. ' + 'b'.repeat(310),
      author_details: { avatar_path: '/av2.jpg' },
    },
    { id: 'r3', author: 'Carol', content: 'Mind-bending.', author_details: { avatar_path: null } },
  ],
  total_results: 3,
};

const videos550 = {
  results: [
    { key: 'dQw4w9WgXcQ', site: 'YouTube', type: 'Trailer' },
    { key: 'other', site: 'YouTube', type: 'Teaser' },
  ],
};

const genres = {
  genres: [
    { id: 28, name: 'Action' },
    { id: 35, name: 'Comedy' },
    { id: 18, name: 'Drama' },
    { id: 12, name: 'Adventure' },
  ],
};

const searchResults = {
  results: [
    {
      id: 1,
      title: 'Inception',
      backdrop_path: '/inception-bd.jpg',
      vote_average: 8.4,
      genre_ids: [28],
    },
  ],
  total_results: 1,
};

export const handlers = [
  http.get(`${BASE}/movie/popular`, () => HttpResponse.json(popularResponse)),
  http.get(`${BASE}/movie/top_rated`, () => HttpResponse.json(topRatedResponse)),
  http.get(`${BASE}/movie/upcoming`, () => HttpResponse.json(upcomingResponse)),
  http.get(`${BASE}/movie/550`, () => HttpResponse.json(detail550)),
  http.get(`${BASE}/movie/550/videos`, () => HttpResponse.json(videos550)),
  http.get(`${BASE}/movie/550/reviews`, () => HttpResponse.json(reviews550)),
  http.get(`${BASE}/genre/movie/list`, () => HttpResponse.json(genres)),
  http.get(`${BASE}/search/movie`, () => HttpResponse.json(searchResults)),
];
