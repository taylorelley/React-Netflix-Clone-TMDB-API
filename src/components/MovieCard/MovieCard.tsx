'use client';

import { useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import gsap from 'gsap';
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

export default function MovieCard({
  data,
  imageUrl,
  width,
  height,
  cardStyle,
  radius,
}: MovieCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const rating = data ? Math.round(data.vote_average / 2) : 0;

  // 3D tilt effect
  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const onMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -6;
      const rotateY = ((x - centerX) / centerX) * 6;

      gsap.to(card, {
        rotateX,
        rotateY,
        transformPerspective: 800,
        duration: 0.4,
        ease: 'power2.out',
      });

      // Move shine effect
      const shine = card.querySelector(`.${styles.cardShine}`) as HTMLElement;
      if (shine) {
        const pctX = (x / rect.width) * 100;
        const pctY = (y / rect.height) * 100;
        shine.style.background = `radial-gradient(circle at ${pctX}% ${pctY}%, rgba(255,255,255,0.12) 0%, transparent 60%)`;
      }
    };

    const onLeave = () => {
      gsap.to(card, {
        rotateX: 0,
        rotateY: 0,
        duration: 0.6,
        ease: 'expo.out',
      });
    };

    card.addEventListener('mousemove', onMove);
    card.addEventListener('mouseleave', onLeave);
    return () => {
      card.removeEventListener('mousemove', onMove);
      card.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  const handleClick = (): void => {
    if (data) {
      router.push(`/moviedetails/${data.id}`);
    }
  };

  const isTopRated = cardStyle === 'top-rated-card';

  return (
    <div
      ref={cardRef}
      className={`${styles.card} ${isTopRated ? styles.topRated : styles.popular}`}
      onClick={handleClick}
      data-testid="movie-card"
      data-cursor-hover
      style={{ width, height, borderRadius: radius }}
    >
      <div
        className={styles.cardImage}
        style={{
          backgroundImage: imageUrl
            ? `url("https://image.tmdb.org/t/p/w500/${imageUrl}")`
            : undefined,
        }}
      />
      <div className={styles.cardOverlay}>
        <div className={styles.cardTop}>
          <Ratings movieRating={rating} />
        </div>
        <div className={styles.cardBottom}>
          <h3>{data?.title}</h3>
          <div className={styles.cardMeta}>
            <span className={styles.cardRating}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              {data?.vote_average?.toFixed(1)}
            </span>
            {data?.release_date && <span>{data.release_date.slice(0, 4)}</span>}
          </div>
        </div>
      </div>
      <div className={styles.cardShine} />
    </div>
  );
}
