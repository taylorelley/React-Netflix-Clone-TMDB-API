'use client';

import { useGenres } from '@/hooks/useGenres';
import styles from './Genres.module.css';

interface GenresProps {
  moviesGenres?: number[];
}

export default function Genres({ moviesGenres }: GenresProps) {
  const { genres: allGenres } = useGenres();

  return (
    <div className={styles.genres}>
      {(moviesGenres || []).map((id) => {
        const genre = allGenres.find((g) => g.id === id);
        if (!genre) return null;
        return (
          <span key={id} className={styles.genreTag}>
            {genre.name}
          </span>
        );
      })}
    </div>
  );
}
