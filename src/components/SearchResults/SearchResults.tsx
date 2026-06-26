'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import noImage from '@/assets/no-image.svg.png';
import type { Movie } from '@/types/tmdb';
import styles from './SearchResults.module.css';

interface SearchResultsProps {
  movie: Movie;
  setQuery: (query: string) => void;
}

export default function SearchResults({ movie, setQuery }: SearchResultsProps) {
  const router = useRouter();
  const [imageError, setImageError] = useState<boolean>(false);

  const handleNavigation = (): void => {
    setQuery('');
    router.push(`/moviedetails/${movie.id}`);
  };

  const src: string =
    imageError || !movie.backdrop_path
      ? (noImage as unknown as string)
      : `https://image.tmdb.org/t/p/w500${movie.backdrop_path}`;

  return (
    <div className={styles.searchResultsItem} onClick={handleNavigation} data-cursor-hover>
      <Image
        className={styles.resultImg}
        src={src}
        onError={() => setImageError(true)}
        alt=""
        width={100}
        height={80}
        unoptimized
      />
      <div className={styles.resultInfo}>
        <p className={styles.resultTitle}>{movie.title}</p>
        {movie.release_date && (
          <span className={styles.resultYear}>{movie.release_date.slice(0, 4)}</span>
        )}
      </div>
    </div>
  );
}
