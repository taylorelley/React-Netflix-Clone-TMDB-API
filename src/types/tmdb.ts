export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  release_date: string;
  genre_ids: number[];
  runtime?: number;
  budget?: number;
  tagline?: string;
  status?: string;
  genres?: Genre[];
}

export interface Genre {
  id: number;
  name: string;
}

export interface Video {
  key: string;
  site: string;
  type: string;
}

export interface Review {
  id: string;
  author: string;
  content: string;
  author_details: {
    avatar_path: string | null;
  };
}

export interface TMDBResponse<T> {
  results: T[];
  total_results: number;
  page: number;
  total_pages: number;
}
