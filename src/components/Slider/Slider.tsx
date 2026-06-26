'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import gsap from 'gsap';
import { useUpcomingMovies } from '@/hooks/useUpcomingMovies';
import Genres from '../Genres/Genres';
import Ratings from '../Ratings/Ratings';
import styles from './Slider.module.css';

function formatDate(iso: string | null | undefined): string {
  if (!iso) return '';
  const [y, m, d] = iso.split('-');
  return `${d}-${m}-${y}`;
}

export default function Slider() {
  const { movies: upcomingMovies } = useUpcomingMovies();
  const [index, setIndex] = useState<number>(0);
  const imageBaseUrl = 'https://image.tmdb.org/t/p/original';
  const router = useRouter();

  const heroRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const metaRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const tagRef = useRef<HTMLDivElement>(null);

  const current = upcomingMovies[index];

  const handlePage = (): void => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    }
    if (current) {
      router.push(`/moviedetails/${current.id}`);
    }
  };

  const handleRight = (): void => {
    if (upcomingMovies.length === 0) return;
    setIndex(index === upcomingMovies.length - 1 ? 0 : index + 1);
  };

  const handleLeft = (): void => {
    if (upcomingMovies.length === 0) return;
    setIndex(index === 0 ? upcomingMovies.length - 1 : index - 1);
  };

  const goToSlide = (i: number): void => {
    setIndex(i);
  };

  // Parallax on scroll
  useEffect(() => {
    const onScroll = () => {
      if (bgRef.current) {
        const scrollY = window.scrollY;
        bgRef.current.style.transform = `scale(1.08) translateY(${scrollY * 0.25}px)`;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // GSAP animations on slide change
  useEffect(() => {
    if (!current) return;

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    // Background crossfade
    if (bgRef.current) {
      gsap.fromTo(
        bgRef.current,
        { scale: 1.12, opacity: 0.5 },
        { scale: 1.08, opacity: 1, duration: 1.4, ease: 'power2.out' },
      );
    }

    tl.fromTo(tagRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 })
      .fromTo(
        titleRef.current,
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: 'expo.out' },
        '-=0.3',
      )
      .fromTo(descRef.current, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, '-=0.6')
      .fromTo(metaRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, '-=0.4')
      .fromTo(ctaRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, '-=0.3');

    return () => {
      tl.kill();
    };
  }, [index, current]);

  const bgStyle = current?.backdrop_path
    ? { backgroundImage: `url("${imageBaseUrl}${current.backdrop_path}")` }
    : {};

  return (
    <div ref={heroRef} className={styles.hero}>
      <div ref={bgRef} className={styles.heroBg} style={bgStyle} />
      <div className={styles.heroOverlay} />
      <div className={styles.heroOverlayBottom} />

      <div ref={contentRef} className={styles.heroContent}>
        <div ref={tagRef} className={styles.heroTag}>
          <span className={styles.tagDot} />
          FEATURED
        </div>
        <h1 ref={titleRef} className={styles.heroTitle}>
          {current?.title}
        </h1>
        <p ref={descRef} className={styles.heroDesc}>
          {current?.overview?.slice(0, 180)}
          {current?.overview && current.overview.length > 180 ? '...' : ''}
        </p>
        <div ref={metaRef} className={styles.heroMeta}>
          <Genres moviesGenres={current?.genre_ids} />
          <span className={styles.heroDivider}>•</span>
          <span>{formatDate(current?.release_date)}</span>
          <span className={styles.heroDivider}>•</span>
          <Ratings movieRating={current ? current.vote_average / 2 : 0} />
        </div>
        <div ref={ctaRef} className={styles.heroCta}>
          <button className={styles.ctaPrimary} onClick={handlePage} data-cursor-hover>
            <span>Explore</span>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Slide indicators */}
      <div className={styles.slideIndicators}>
        {upcomingMovies.map((_, i) => (
          <button
            key={i}
            className={`${styles.indicator} ${i === index ? styles.indicatorActive : ''}`}
            onClick={() => goToSlide(i)}
            data-cursor-hover
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>

      {/* Navigation arrows */}
      <button
        className={`${styles.arrow} ${styles.arrowLeft}`}
        onClick={handleLeft}
        data-cursor-hover
        aria-label="Previous"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m15 18-6-6 6-6" />
        </svg>
      </button>
      <button
        className={`${styles.arrow} ${styles.arrowRight}`}
        onClick={handleRight}
        data-cursor-hover
        aria-label="Next"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m9 18 6-6-6-6" />
        </svg>
      </button>
    </div>
  );
}
