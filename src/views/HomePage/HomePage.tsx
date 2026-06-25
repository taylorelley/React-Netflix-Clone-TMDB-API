'use client';

import { useContext, useState, type CSSProperties } from 'react';
import Slider from '@/components/Slider/Slider';
import MovieCard from '@/components/MovieCard/MovieCard';
import { usePopularMovies } from '@/hooks/usePopularMovies';
import { useTopRatedMovies } from '@/hooks/useTopRatedMovies';
import { ThemeContext } from '@/context/ThemeContext';
import styles from './HomePage.module.css';

/**
 * Home page with popular and top-rated movie sections.
 * No props — data fetched via hooks.
 */
export default function HomePage() {
  const ctx = useContext(ThemeContext);
  const darkMode = ctx?.darkMode ?? true;
  const [page, setPage] = useState<number>(1);
  const { movies: popularMovies } = usePopularMovies(page);
  const { movies: topRatedMovies } = useTopRatedMovies();
  const pageNumbers: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  const handlePage = (p: number): void => {
    setPage(p);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    }
  };

  const pageColorStyle: CSSProperties = darkMode ? { color: 'white' } : { color: 'black' };

  const containerClass = darkMode
    ? styles.homepageContainer
    : `${styles.homepageContainer} ${styles.homeLight}`;

  return (
    <div className={containerClass}>
      <Slider />
      <div className={styles.moviesWrapper}>
        <div className={styles.popularContainer}>
          <h3>Popular Movies</h3>
          <div className={styles.popularCardsWrapper}>
            {popularMovies?.map((movie) => (
              <MovieCard
                key={movie.id}
                radius="16px"
                cardStyle="popular-card"
                width="200px"
                height="300px"
                imageUrl={movie.poster_path}
                data={movie}
              />
            ))}
          </div>
          <div className={styles.pageNumbers} style={pageColorStyle}>
            <p> Select Page</p>
            {pageNumbers.map((item) => (
              <p
                className={item === page ? styles.currentPage : styles.page}
                key={item}
                onClick={() => handlePage(item)}
              >
                {item}
              </p>
            ))}
          </div>
        </div>

        <div className={styles.topRatedContainer}>
          <h3>Top Rated Movies</h3>
          <div className={styles.topRatedCardsWrapper}>
            {topRatedMovies?.map((movie) => (
              <MovieCard
                key={movie.id}
                radius="8px"
                cardStyle="top-rated-card"
                width="200px"
                height="100px"
                imageUrl={movie.backdrop_path}
                data={movie}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
