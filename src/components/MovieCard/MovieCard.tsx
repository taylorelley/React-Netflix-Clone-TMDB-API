import './movie.css';
import { type CSSProperties } from 'react';
import { useNavigate } from 'react-router-dom';
import Ratings from '../Ratings/Ratings';
import type { Movie } from '../../types/tmdb';

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
 * @param props Movie data + display options
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
  const navigate = useNavigate();

  const imageStyle: CSSProperties = {
    backgroundImage: `url("https://image.tmdb.org/t/p/w500/${imageUrl ?? ''}")`,
    width: width,
    height: height,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    position: 'relative',
    borderRadius: radius,
    boxShadow:
      cardStyle === 'popular-card'
        ? '0px 0px 10px 0px rgba(118,118,118,0.75)'
        : undefined,
  };

  const handleClick = (): void => {
    if (data) {
      navigate(`/moviedetails/${data.id}`);
    }
  };

  return (
    <div className={cardStyle} onClick={handleClick}>
      <div style={imageStyle}>
        <div className="movie-info-top">
          <Ratings movieRating={rating} />
        </div>
        <div className="movie-info-bottom">
          <p>{data?.title}</p>
          <p>Rating: {rating}</p>
        </div>
      </div>
      {cardStyle === 'top-rated-card' ? <p>{data?.title}</p> : null}
    </div>
  );
}
