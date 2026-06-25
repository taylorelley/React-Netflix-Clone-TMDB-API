import { useContext, useState } from 'react';
import { useParams } from 'react-router-dom';
import ReactPlayer from 'react-player';
import { ThemeContext } from '../../context/ThemeContext';
import { useMovieDetails } from '../../hooks/useMovieDetails';
import { useMovieTrailer } from '../../hooks/useMovieTrailer';
import { useMovieReviews } from '../../hooks/useMovieReviews';
import Review from '../../components/Review/Review';
import Genres from '../../components/Genres/Genres';
import Ratings from '../../components/Ratings/Ratings';
import './movie.css';

/**
 * Movie detail page with trailer, info, and reviews.
 * Reads movieid from URL params. No props.
 */
function MovieDetails() {
    const { movieid } = useParams();
    const { movie } = useMovieDetails(movieid);
    const { trailerKey } = useMovieTrailer(movieid);
    const { reviews, totalReviews } = useMovieReviews(movieid);
    const [reviewNumber, setReviewNumber] = useState(3);
    const { darkMode } = useContext(ThemeContext);

    return (
        <div className={darkMode ? 'movie-details-container' : 'movie-details-container details-light'}>
            {trailerKey
                ? <div className="trailer-container">
                    <ReactPlayer className="trailer-player" url={`https://www.youtube.com/watch?v=${trailerKey}`}
                        config={{
                            youtube: {
                                playerVars: { showinfo: 1, origin: 'http://localhost:3000' }
                            }
                        }}
                        width='100%'
                        height='100%'
                        controls={true}
                    />
                </div>
                : <div className="trailer-container-blank" style={{
                    backgroundImage: `url("https://image.tmdb.org/t/p/original/${movie?.poster_path}")`,
                    backgroundPosition: 'center',
                    backgroundSize: 'cover'
                }}><h1>No Trailers Released Yet</h1></div>
            }

            <div className={darkMode ? 'details-container' : 'details-container details-light'}>
                <div className="title-container">
                    <h1>{movie?.title}</h1>
                </div>
                <Ratings movieRating={movie?.vote_average / 2} />
                <div className="info-container">
                    <img src={`https://image.tmdb.org/t/p/w500/${movie?.poster_path}`} className="details-poster" />
                    <div className="movie-info">
                        <h2>{movie?.tagline}</h2>
                        <h4>{movie?.overview}</h4>
                        <h4>Status: <span>{movie?.status}</span></h4>
                        <h4>Runtime: <span>{movie?.runtime} min.</span></h4>
                        <h4>Budget: <span>{movie?.budget}</span></h4>
                        <Genres movieGenres={movie?.genres} />
                    </div>
                </div>
                <div className="review-container">
                    <p className="reviews-title">Reviews</p>
                    {(reviews || []).slice(0, reviewNumber).map(item => {
                        return <Review key={item.id} review={item} />;
                    })}
                    {reviewNumber >= totalReviews
                        ? <p className="review-number" onClick={() => setReviewNumber(3)}><em>End of reviews.Collapse</em></p>
                        : <p className="review-number" onClick={() => setReviewNumber(reviewNumber + 3)}><em>Read more reviews</em></p>
                    }
                </div>
            </div>
        </div>
    );
}

export default MovieDetails;