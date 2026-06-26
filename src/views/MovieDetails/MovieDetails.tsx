'use client';

import { useContext, useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import ReactPlayer from 'react-player';
import Image from 'next/image';
import gsap from 'gsap';
import { ThemeContext } from '@/context/ThemeContext';
import { useMovieDetails } from '@/hooks/useMovieDetails';
import { useMovieTrailer } from '@/hooks/useMovieTrailer';
import { useMovieReviews } from '@/hooks/useMovieReviews';
import Review from '@/components/Review/Review';
import Genres from '@/components/Genres/Genres';
import Ratings from '@/components/Ratings/Ratings';
import styles from './MovieDetails.module.css';

export default function MovieDetails() {
  const params = useParams<{ movieid: string }>();
  const movieid = params?.movieid ?? null;
  const { movie } = useMovieDetails(movieid);
  const { trailerKey } = useMovieTrailer(movieid);
  const { reviews, totalReviews } = useMovieReviews(movieid);
  const [reviewNumber, setReviewNumber] = useState<number>(3);
  const ctx = useContext(ThemeContext);
  const darkMode = ctx?.darkMode ?? true;

  const posterRef = useRef<HTMLDivElement>(null);

  // GSAP entrance animations
  useEffect(() => {
    if (!movie) return;
    const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });

    tl.fromTo(`.${styles.info} h1`, { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 1.2 })
      .fromTo(
        `.${styles.tagline}`,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8 },
        '-=0.8',
      )
      .fromTo(
        `.${styles.posterWrapper}`,
        { scale: 0.92, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1 },
        '-=0.8',
      )
      .fromTo(
        `.${styles.metaRow} > *`,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.08, duration: 0.5 },
        '-=0.6',
      )
      .fromTo(
        `.${styles.overview}`,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6 },
        '-=0.3',
      );

    return () => {
      tl.kill();
    };
  }, [movie]);

  // Parallax poster on scroll
  useEffect(() => {
    const onScroll = () => {
      if (posterRef.current) {
        const rect = posterRef.current.getBoundingClientRect();
        const progress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
        posterRef.current.style.transform = `translateY(${progress * -30}px)`;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const backdropStyle = movie?.backdrop_path
    ? {
        backgroundImage: `url("https://image.tmdb.org/t/p/original/${movie.backdrop_path}")`,
      }
    : {};

  const containerClass = darkMode ? styles.container : `${styles.container} ${styles.light}`;

  return (
    <div className={containerClass}>
      {/* Hero backdrop */}
      <div className={styles.hero} style={backdropStyle}>
        <div className={styles.heroGradient} />
        {trailerKey ? (
          <div className={styles.trailerWrapper}>
            <ReactPlayer
              url={`https://www.youtube.com/watch?v=${trailerKey}`}
              width="100%"
              height="100%"
              controls
              config={{ youtube: { playerVars: { showinfo: 1 } } }}
            />
          </div>
        ) : (
          <div className={styles.noTrailer}>
            <h2>No Trailer Available</h2>
          </div>
        )}
      </div>

      {/* Content */}
      <div className={styles.content}>
        <div className={styles.infoSection}>
          {/* Poster */}
          <div ref={posterRef} className={styles.posterWrapper}>
            {movie?.poster_path ? (
              <Image
                src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
                alt={movie.title}
                fill
                className={styles.poster}
                priority
              />
            ) : (
              <div className={styles.posterPlaceholder}>No Image</div>
            )}
          </div>

          {/* Info */}
          <div className={styles.info}>
            <h1>{movie?.title}</h1>
            {movie?.tagline && <p className={styles.tagline}>{movie.tagline}</p>}

            <div className={styles.metaRow}>
              <Ratings movieRating={movie ? movie.vote_average / 2 : 0} />
              <span className={styles.metaDivider}>|</span>
              <span>{movie?.release_date?.slice(0, 4)}</span>
              <span className={styles.metaDivider}>|</span>
              <span>{movie?.runtime} min</span>
              <span className={styles.metaDivider}>|</span>
              <span>{movie?.status}</span>
            </div>

            <div className={styles.overview}>
              <h3>Overview</h3>
              <p>{movie?.overview}</p>
            </div>

            <div className={styles.detailsGrid}>
              <div className={styles.detailItem}>
                <span className={styles.label}>Budget</span>
                <span className={styles.value}>
                  {movie?.budget ? `$${movie.budget.toLocaleString()}` : 'N/A'}
                </span>
              </div>
            </div>

            <div className={styles.genresSection}>
              <Genres moviesGenres={movie?.genres?.map((g) => g.id)} />
            </div>
          </div>
        </div>

        {/* Reviews */}
        <div className={styles.reviewsSection}>
          <h2 className={styles.reviewsTitle}>Reviews</h2>
          <p className={styles.reviewsCount}>
            {totalReviews} review{totalReviews !== 1 ? 's' : ''}
          </p>
          {(reviews || []).slice(0, reviewNumber).map((item) => (
            <Review key={item.id} review={item} />
          ))}
          {totalReviews > 0 && (
            <button
              className={styles.loadMoreBtn}
              onClick={() => setReviewNumber(reviewNumber >= totalReviews ? 3 : reviewNumber + 3)}
            >
              {reviewNumber >= totalReviews
                ? 'Show Less'
                : `Load More (${totalReviews - reviewNumber} remaining)`}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
