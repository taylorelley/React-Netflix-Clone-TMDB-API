'use client';

import { useState, useEffect, useContext } from 'react';
import MovieCard from '@/components/MovieCard/MovieCard';
import type { Movie } from '@/types/tmdb';
import { UserContext } from '@/context/UserContext';
import styles from './MyFavorites.module.css';

interface FavoriteEntry {
  movie: Array<{
    _id: string;
    poster_path: string | null;
    title: string;
    vote_average: number;
  }>;
}

/**
 * My Favorites page.
 */
export default function MyFavorites() {
  const [movies, setMovies] = useState<FavoriteEntry[]>([]);
  const userCtx = useContext(UserContext);
  const user = userCtx?.user ?? null;
  const token = userCtx?.token ?? '';

  useEffect(() => {
    if (!user?._id) return;
    let cancelled = false;
    fetch(`/api/favoriteMovies/user/${user._id}`)
      .then((r) => (r.ok ? r.json() : { favorites: [] }))
      .then((data: { favorites?: FavoriteEntry[] }) => {
        if (!cancelled) setMovies(data.favorites || []);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [user]);

  return (
    <div className={styles.favoritesContainer}>
      {token ? (
        movies.map((item) => {
          const movie = item.movie[0];
          if (!movie) return null;
          const cardData: Movie = {
            id: Number(movie._id),
            title: movie.title,
            poster_path: movie.poster_path,
            vote_average: movie.vote_average,
            overview: '',
            backdrop_path: null,
            release_date: '',
            genre_ids: [],
          };
          return (
            <MovieCard
              key={movie._id}
              radius="16px"
              cardStyle="popular-card"
              width="200px"
              height="300px"
              imageUrl={movie.poster_path}
              data={cardData}
            />
          );
        })
      ) : (
        <p style={{ color: 'white' }}>
          Signin to save movies to your favorites.
        </p>
      )}
    </div>
  );
}
