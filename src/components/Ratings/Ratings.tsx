import StarRatings from 'react-star-ratings';

interface RatingsProps {
  movieRating: number;
}

/**
 * Star rating display component.
 * @param props.movieRating Rating out of 5
 */
function Ratings({ movieRating }: RatingsProps) {
  const rating = Number.isFinite(movieRating) ? movieRating : 0;
  return (
    <div className="rating">
      <StarRatings
        rating={rating}
        numberOfStars={5}
        name="rating"
        starDimension="15px"
        starSpacing="1px"
        starRatedColor="red"
        starEmptyColor="grey"
      />
    </div>
  );
}

export default Ratings;
