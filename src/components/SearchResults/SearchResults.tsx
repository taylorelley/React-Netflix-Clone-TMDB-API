import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import noImage from '../../assets/no-image.svg.png';
import type { Movie } from '../../types/tmdb';

interface SearchResultsProps {
  movie: Movie;
  setQuery: (query: string) => void;
}

/**
 * Single search result item with click navigation.
 * @param props.movie Movie result
 * @param props.setQuery Setter to clear the search query
 */
function SearchResults({ movie, setQuery }: SearchResultsProps) {
  const navigate = useNavigate();
  const [imageError, setImageError] = useState<boolean>(false);

  const handleNavigation = (): void => {
    setQuery('');
    navigate(`/moviedetails/${movie.id}`);
  };

  return (
    <div className="search-results-item" onClick={handleNavigation}>
      <img
        className="result-img"
        src={
          imageError
            ? noImage
            : `https://image.tmdb.org/t/p/w500${movie.backdrop_path ?? ''}`
        }
        onError={() => setImageError(true)}
        alt=""
      />
      <p>{movie.title}</p>
    </div>
  );
}

export default SearchResults;
