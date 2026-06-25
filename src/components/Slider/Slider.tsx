'use client';

import { useState, type CSSProperties } from 'react';
import { useRouter } from 'next/navigation';
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md';
import { useUpcomingMovies } from '@/hooks/useUpcomingMovies';
import Genres from '../Genres/Genres';
import Ratings from '../Ratings/Ratings';
import styles from './Slider.module.css';

function formatDate(iso: string | null | undefined): string {
  if (!iso) return '';
  const [y, m, d] = iso.split('-');
  return `${d}-${m}-${y}`;
}

/**
 * Hero carousel for upcoming movies.
 * No props — uses useUpcomingMovies hook internally.
 */
export default function Slider() {
  const { movies: upcomingMovies } = useUpcomingMovies();
  const [index, setIndex] = useState<number>(0);
  const imageBaseUrl = 'https://image.tmdb.org/t/p/original';
  const router = useRouter();

  const handlePage = (): void => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    }
    const current = upcomingMovies[index];
    if (current) {
      router.push(`/moviedetails/${current.id}`);
    }
  };

  const handleRight = (): void => {
    if (upcomingMovies.length === 0) return;
    if (index === upcomingMovies.length - 1) {
      setIndex(0);
    } else {
      setIndex(index + 1);
    }
  };

  const handleLeft = (): void => {
    if (upcomingMovies.length === 0) return;
    if (index === 0) {
      setIndex(upcomingMovies.length - 1);
    } else {
      setIndex(index - 1);
    }
  };

  const current = upcomingMovies[index];

  const sliderStyle: CSSProperties = {
    backgroundImage: current?.backdrop_path
      ? `url("${imageBaseUrl}${current.backdrop_path}")`
      : undefined,
    backgroundSize: 'cover',
    backgroundPosition: 'top',
    backgroundRepeat: 'no-repeat',
    height: '60vh',
    position: 'relative',
  };

  return (
    <div style={sliderStyle}>
      <div className={styles.sliderOverlay} />
      <MdKeyboardArrowLeft onClick={handleLeft} className={styles.leftArrow} />
      <MdKeyboardArrowRight onClick={handleRight} className={styles.rightArrow} />
      <div className={styles.sliderInfo}>
        <h1>{current?.title}</h1>
        <p className={styles.sliderDescription}>
          {current?.overview?.slice(0, 130)}..
        </p>
        <Genres moviesGenres={current?.genre_ids} />
        <p>Release Date: {formatDate(current?.release_date)}</p>
        <Ratings movieRating={current ? current.vote_average / 2 : 0} />
        <p className={styles.seeMoreBtn} onClick={handlePage}>
          See Details
        </p>
      </div>
    </div>
  );
}
