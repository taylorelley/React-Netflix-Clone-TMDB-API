'use client';

import { useRouter } from 'next/navigation';
import { type CSSProperties } from 'react';
import Ratings from '../Ratings/Ratings';
import type { Movie } from '@/types/tmdb';
import styles from './MovieCard.module.css';

interface MovieCardProps {
  data?: Movie;
  imageUrl?: string | null;
  width?: string;
  height?: string;
  cardStyle?: string;
  radius?: string;
}

/**
 * Reusable movie card with poster image, rating, and click navigation.
 */
export default function MovieCard({
  data,
  imageUrl,
  width,
  height,
  cardStyle,
  radius,
}: MovieCardProps) {
  const rating = data ? Math.round(data.vote_average / 2) : 0;
  const router = useRouter();

  const wrapperClass = cardStyle === 'top-rated-card' ? styles.topRatedCard : styles.popularCard;

  const imageStyle: CSSProperties = {
    backgroundImage: imageUrl ? `url("https://image.tmdb.org/t/p/w500/${imageUrl}")` : undefined,
    width: width,
    height: height,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    position: 'relative',
    borderRadius: radius,
    boxShadow: cardStyle === 'popular-card' ? '0px 0px 10px 0px rgba(118,118,118,0.75)' : undefined,
  };

  const handleClick = (): void => {
    if (data) {
      router.push(`/moviedetails/${data.id}`);
    }
  };

  return (
    <div className={wrapperClass} onClick={handleClick} data-testid="movie-card">
      <div style={imageStyle}>
        <div className={styles.movieInfoTop}>
          <Ratings movieRating={rating} />
        </div>
        <div className={styles.movieInfoBottom}>
          <p>{data?.title}</p>
          <p>Rating: {rating}</p>
        </div>
      </div>
      {cardStyle === 'top-rated-card' ? <p>{data?.title}</p> : null}
    </div>
  );
}
