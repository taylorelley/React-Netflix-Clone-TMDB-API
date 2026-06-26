'use client';

import styles from './Ratings.module.css';

interface RatingsProps {
  movieRating: number;
}

export default function Ratings({ movieRating }: RatingsProps) {
  const rating = Number.isFinite(movieRating) ? Math.max(0, Math.min(5, movieRating)) : 0;
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  const stars = [];
  for (let i = 1; i <= 5; i += 1) {
    let fill: 'full' | 'half' | 'empty' = 'empty';
    if (i <= full) fill = 'full';
    else if (i === full + 1 && half) fill = 'half';
    stars.push(
      <span key={i} className={`${styles.star} ${styles[fill]}`} aria-hidden>
        ★
      </span>,
    );
  }
  return (
    <div className={styles.rating}>
      <span className={styles.value}>{rating.toFixed(1)}</span>
      <div className={styles.stars}>{stars}</div>
    </div>
  );
}
