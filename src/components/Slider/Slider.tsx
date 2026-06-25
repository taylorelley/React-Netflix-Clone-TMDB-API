import { useState, type CSSProperties } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md';
import { useUpcomingMovies } from '../../hooks/useUpcomingMovies';
import Genres from '../Genres/Genres';
import Ratings from '../Ratings/Ratings';
import './slider.css';

/**
 * Hero carousel for upcoming movies.
 * No props — uses useUpcomingMovies hook internally.
 */
function Slider() {
  const { movies: upcomingMovies } = useUpcomingMovies();
  const [index, setIndex] = useState<number>(0);
  const imageBaseUrl = 'https://image.tmdb.org/t/p/original';
  const navigate = useNavigate();

  const handlePage = (): void => {
    scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    if (upcomingMovies[index]) {
      navigate(`/moviedetails/${upcomingMovies[index]?.id}`);
    }
  };

  const handleRight = (): void => {
    if (index === upcomingMovies.length - 1) {
      setIndex(0);
    } else {
      setIndex(index + 1);
    }
  };

  const handleLeft = (): void => {
    if (index === 0) {
      setIndex(upcomingMovies.length - 1);
    } else {
      setIndex(index - 1);
    }
  };

  const current = upcomingMovies[index];

  const sliderStyle: CSSProperties = {
    backgroundImage: `url("${imageBaseUrl}${current?.backdrop_path ?? ''}")`,
    backgroundSize: 'cover',
    backgroundPosition: 'top',
    backgroundRepeat: 'no-repeat',
    height: '60vh',
    position: 'relative',
  };

  return (
    <div style={sliderStyle}>
      <div className="slider-overlay"></div>
      <MdKeyboardArrowLeft onClick={handleLeft} className="left-arrow" />
      <MdKeyboardArrowRight onClick={handleRight} className="right-arrow" />
      <div className="slider-info">
        <h1>{current?.title}</h1>
        <p className="slider-description">
          {' '}
          {current?.overview?.slice(0, 130)}..
        </p>
        <Genres moviesGenres={current?.genre_ids} />
        <p>
          Release Date:{' '}
          {current?.release_date &&
            current.release_date
              .split('-')
              .reverse()
              .join('-')
              .replace(/(\d{2})-(\d{2})-(\d{4})/, '$2-$1-$3')}
        </p>
        <Ratings movieRating={current ? current.vote_average / 2 : 0} />
        <p className="see-more-btn" onClick={handlePage}>
          See Details
        </p>
      </div>
    </div>
  );
}

export default Slider;
