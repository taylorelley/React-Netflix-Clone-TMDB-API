'use client';

import { useContext, useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Slider from '@/components/Slider/Slider';
import MovieCard from '@/components/MovieCard/MovieCard';
import { usePopularMovies } from '@/hooks/usePopularMovies';
import { useTopRatedMovies } from '@/hooks/useTopRatedMovies';
import { ThemeContext } from '@/context/ThemeContext';
import styles from './HomePage.module.css';

gsap.registerPlugin(ScrollTrigger);

export default function HomePage() {
  const ctx = useContext(ThemeContext);
  const darkMode = ctx?.darkMode ?? true;
  const [page, setPage] = useState<number>(1);
  const { movies: popularMovies, loading } = usePopularMovies(page);
  const { movies: topRatedMovies } = useTopRatedMovies();
  const pageNumbers: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  const popularRef = useRef<HTMLDivElement>(null);
  const topRatedRef = useRef<HTMLDivElement>(null);
  const popularHeadingRef = useRef<HTMLHeadingElement>(null);
  const topRatedHeadingRef = useRef<HTMLHeadingElement>(null);

  const handlePage = (p: number): void => {
    setPage(p);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    }
  };

  // GSAP scroll-triggered animations
  useEffect(() => {
    const safeCtx = gsap.context(() => {
      // Popular heading
      if (popularHeadingRef.current) {
        gsap.from(popularHeadingRef.current, {
          y: 40,
          opacity: 0,
          duration: 1,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: popularHeadingRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        });
      }

      // Popular cards stagger
      if (popularRef.current && popularMovies.length > 0) {
        gsap.from(popularRef.current.querySelectorAll('[data-testid="movie-card"]'), {
          y: 60,
          opacity: 0,
          stagger: 0.06,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: popularRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        });
      }

      // Top rated heading
      if (topRatedHeadingRef.current) {
        gsap.from(topRatedHeadingRef.current, {
          y: 40,
          opacity: 0,
          duration: 1,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: topRatedHeadingRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        });
      }

      // Top rated cards
      if (topRatedRef.current && topRatedMovies.length > 0) {
        gsap.from(topRatedRef.current.querySelectorAll('[data-testid="movie-card"]'), {
          y: 40,
          opacity: 0,
          stagger: 0.08,
          duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: topRatedRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        });
      }
    });

    return () => safeCtx.revert();
  }, [popularMovies, topRatedMovies]);

  const containerClass = darkMode
    ? styles.homepageContainer
    : `${styles.homepageContainer} ${styles.homeLight}`;

  return (
    <div className={containerClass}>
      <Slider />
      <div className={styles.moviesWrapper}>
        <div className={styles.popularContainer}>
          <h3 ref={popularHeadingRef} className={styles.sectionHeading}>
            Popular Movies
          </h3>
          {loading ? (
            <div className={styles.skeletonGrid}>
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className={styles.skeletonCard} />
              ))}
            </div>
          ) : (
            <div ref={popularRef} className={styles.popularGrid}>
              {popularMovies?.map((movie) => (
                <MovieCard
                  key={movie.id}
                  radius="12px"
                  cardStyle="popular-card"
                  imageUrl={movie.poster_path}
                  data={movie}
                />
              ))}
            </div>
          )}
          <div className={styles.pagination}>
            {pageNumbers.map((item) => (
              <button
                className={`${styles.pageBtn} ${item === page ? styles.pageBtnActive : ''}`}
                key={item}
                onClick={() => handlePage(item)}
                data-cursor-hover
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.topRatedContainer}>
          <h3 ref={topRatedHeadingRef} className={styles.sectionHeading}>
            Top Rated
          </h3>
          <div ref={topRatedRef} className={styles.topRatedGrid}>
            {topRatedMovies?.map((movie) => (
              <MovieCard
                key={movie.id}
                radius="12px"
                cardStyle="top-rated-card"
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
