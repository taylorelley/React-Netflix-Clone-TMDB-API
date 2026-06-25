'use client';

import { useContext, useState, type CSSProperties } from 'react';
import { useParams } from 'next/navigation';
import ReactPlayer from 'react-player';
import Image from 'next/image';
import { ThemeContext } from '@/context/ThemeContext';
import { useMovieDetails } from '@/hooks/useMovieDetails';
import { useMovieTrailer } from '@/hooks/useMovieTrailer';
import { useMovieReviews } from '@/hooks/useMovieReviews';
import Review from '@/components/Review/Review';
import Genres from '@/components/Genres/Genres';
import Ratings from '@/components/Ratings/Ratings';
import styles from './MovieDetails.module.css';

/**
 * Movie detail page with trailer, info, and reviews.
 * Reads movieid from URL params. No props.
 */
export default function MovieDetails() {
  const params = useParams<{ movieid: string }>();
  const movieid = params?.movieid ?? null;
  const { movie } = useMovieDetails(movieid);
  const { trailerKey } = useMovieTrailer(movieid);
  const { reviews, totalReviews } = useMovieReviews(movieid);
  const [reviewNumber, setReviewNumber] = useState<number>(3);
  const ctx = useContext(ThemeContext);
  const darkMode = ctx?.darkMode ?? true;

  const blankStyle: CSSProperties = {
    backgroundImage: movie?.poster_path
      ? `url("https://image.tmdb.org/t/p/original/${movie.poster_path}")`
      : undefined,
    backgroundPosition: 'center',
    backgroundSize: 'cover',
  };

  const containerClass = darkMode
    ? styles.movieDetailsContainer
    : `${styles.movieDetailsContainer} ${styles.detailsLight}`;
  const detailsClass = darkMode
    ? styles.detailsContainer
    : `${styles.detailsContainer} ${styles.detailsLight}`;

  return (
    <div className={containerClass}>
      {trailerKey ? (
        <div className={styles.trailerContainer}>
          <ReactPlayer
            className={styles.trailerPlayer}
            url={`https://www.youtube.com/watch?v=${trailerKey}`}
            config={{
              youtube: { playerVars: { showinfo: 1 } },
            }}
            width="100%"
            height="100%"
            controls={true}
          />
        </div>
      ) : (
        <div className={styles.trailerContainerBlank} style={blankStyle}>
          <h1>No Trailers Released Yet</h1>
        </div>
      )}

      <div className={detailsClass}>
        <div className={styles.titleContainer}>
          <h1>{movie?.title}</h1>
        </div>
        <Ratings movieRating={movie ? movie.vote_average / 2 : 0} />
        <div className={styles.infoContainer}>
          {movie?.poster_path ? (
            <Image
              src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
              className={styles.detailsPoster}
              alt={movie.title}
              width={280}
              height={420}
              unoptimized
            />
          ) : null}
          <div className={styles.movieInfo}>
            <h2>{movie?.tagline}</h2>
            <h4>{movie?.overview}</h4>
            <h4>
              Status: <span>{movie?.status}</span>
            </h4>
            <h4>
              Runtime: <span>{movie?.runtime} min.</span>
            </h4>
            <h4>
              Budget: <span>{movie?.budget}</span>
            </h4>
            <Genres moviesGenres={movie?.genres?.map((g) => g.id)} />
          </div>
        </div>
        <div className={styles.reviewContainer}>
          <p className={styles.reviewsTitle}>Reviews</p>
          {(reviews || []).slice(0, reviewNumber).map((item) => (
            <Review key={item.id} review={item} />
          ))}
          {reviewNumber >= totalReviews ? (
            <p className={styles.reviewNumber} onClick={() => setReviewNumber(3)}>
              <em>End of reviews.Collapse</em>
            </p>
          ) : (
            <p
              className={styles.reviewNumber}
              onClick={() => setReviewNumber(reviewNumber + 3)}
            >
              <em>Read more reviews</em>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
