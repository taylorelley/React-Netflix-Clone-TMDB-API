import './movie.css';
import { useNavigate } from 'react-router-dom';
import Ratings from '../Ratings/Ratings';

/**
 * Reusable movie card with poster image, rating, and click navigation.
 * @param {Object} props
 * @param {Object} props.data - Movie data object
 * @param {string} props.imageUrl - TMDB image path fragment
 * @param {string} [props.width]
 * @param {string} [props.height]
 * @param {string} [props.cardStyle]
 * @param {string} [props.radius]
 */
export default function MovieCard({ data, imageUrl, width, height, cardStyle, radius }) {
  const rating = data ? Math.round(data.vote_average / 2) : 0;
  const navigate = useNavigate();

  const imageStyle = {
    backgroundImage: `url("https://image.tmdb.org/t/p/w500/${imageUrl}")`,
    width: width,
    height: height,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    position: 'relative',
    borderRadius: radius,
    boxShadow: cardStyle === 'popular-card' ? '0px 0px 10px 0px rgba(118,118,118,0.75)' : null,
  };

  const handleClick = () => {
    navigate(`/moviedetails/${data.id}`);
    // window.location.reload(); // Auto-refresh the page
    //  scrollTo({top: 0, left: 0, behavior: "smooth"})
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
