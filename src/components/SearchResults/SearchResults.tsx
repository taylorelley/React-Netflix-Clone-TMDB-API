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

/**
 * Single search result item with click navigation.
 */
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
    <div className={styles.searchResultsItem} onClick={handleNavigation}>
      <Image
        className={styles.resultImg}
        src={src}
        onError={() => setImageError(true)}
        alt=""
        width={100}
        height={80}
        unoptimized
      />
      <p>{movie.title}</p>
    </div>
  );
}
