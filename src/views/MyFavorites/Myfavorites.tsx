'use client';

import { useState, useEffect, useContext, useRef } from 'react';
import gsap from 'gsap';
import MovieCard from '@/components/MovieCard/MovieCard';
import type { Movie } from '@/types/tmdb';
import { UserContext } from '@/context/UserContext';
import styles from './MyFavorites.module.css';

interface FavoriteEntry {
  movie: Array<{
    _id: string;
    tmdb_id: number;
    poster_path: string | null;
    title: string;
    vote_average: number;
  }>;
}

export default function MyFavorites() {
  const [movies, setMovies] = useState<FavoriteEntry[]>([]);
  const userCtx = useContext(UserContext);
  const user = userCtx?.user ?? null;
  const token = userCtx?.token ?? '';
  const gridRef = useRef<HTMLDivElement>(null);

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

  // GSAP stagger animation
  useEffect(() => {
    if (!gridRef.current || movies.length === 0) return;
    gsap.from(gridRef.current.querySelectorAll('[data-testid="movie-card"]'), {
      y: 40,
      opacity: 0,
      stagger: 0.08,
      duration: 0.8,
      ease: 'power3.out',
      delay: 0.3,
    });
  }, [movies]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>My Favorites</h1>
        <p className={styles.subtitle}>Your curated collection</p>
      </div>
      {token ? (
        movies.length > 0 ? (
          <div ref={gridRef} className={styles.grid}>
            {movies.map((item) => {
              const movie = item.movie[0];
              if (!movie) return null;
              const cardData: Movie = {
                id: movie.tmdb_id || Number(movie._id),
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
                  radius="12px"
                  cardStyle="popular-card"
                  imageUrl={movie.poster_path}
                  data={cardData}
                />
              );
            })}
          </div>
        ) : (
          <div className={styles.empty}>
            <div className={styles.emptyContent}>
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
              </svg>
              <p>No favorites yet. Start exploring movies!</p>
            </div>
          </div>
        )
      ) : (
        <div className={styles.empty}>
          <div className={styles.emptyContent}>
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
            </svg>
            <p>Sign in to save your favorite movies</p>
          </div>
        </div>
      )}
    </div>
  );
}
