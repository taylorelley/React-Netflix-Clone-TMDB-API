'use client';

import { useState, useContext } from 'react';
import Image from 'next/image';
import avatar from '@/assets/avatar.gif';
import { ThemeContext } from '@/context/ThemeContext';
import type { Review as ReviewType } from '@/types/tmdb';
import styles from './Review.module.css';

interface ReviewProps {
  review: ReviewType;
}

export default function Review({ review }: ReviewProps) {
  const [seeMore, setSeeMore] = useState<boolean>(false);
  const [imageError, setImageError] = useState<boolean>(false);
  const ctx = useContext(ThemeContext);
  const darkMode = ctx?.darkMode ?? true;

  const avatarSrc: string =
    imageError || !review.author_details?.avatar_path
      ? (avatar as unknown as string)
      : `https://image.tmdb.org/t/p/w500/${review.author_details.avatar_path}`;

  return (
    <div className={`${styles.review} details-review`}>
      <div className={styles.avatarContainer}>
        <Image
          className={styles.avatar}
          src={avatarSrc}
          alt="avatar"
          width={40}
          height={40}
          unoptimized
          onError={() => setImageError(true)}
        />
        <p className={styles.authorName}>{review.author}</p>
      </div>

      <div className={styles.contentWrapper}>
        {!seeMore ? (
          <p className={styles.content}>
            {review.content?.slice(0, 300)}
            {review.content && review.content.length > 300 && (
              <span onClick={() => setSeeMore(true)} className={styles.readMore}>
                {' '}
                read more
              </span>
            )}
          </p>
        ) : (
          <p className={styles.content}>
            {review.content}
            <span onClick={() => setSeeMore(false)} className={styles.readMore}>
              {' '}
              show less
            </span>
          </p>
        )}
      </div>
    </div>
  );
}
