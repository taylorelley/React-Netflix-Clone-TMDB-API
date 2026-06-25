import { useContext, useState } from 'react';
import './home.css';
import Slider from '../../components/Slider/Slider';
import MovieCard from '../../components/MovieCard/MovieCard';
import { usePopularMovies } from '../../hooks/usePopularMovies';
import { useTopRatedMovies } from '../../hooks/useTopRatedMovies';
import { ThemeContext } from '../../context/ThemeContext';

/**
 * Home page with popular and top-rated movie sections.
 * No props — data fetched via hooks.
 */
function HomePage() {
    const { darkMode } = useContext(ThemeContext);
    const [page, setPage] = useState(1);
    const { movies: popularMovies } = usePopularMovies(page);
    const { movies: topRatedMovies } = useTopRatedMovies();
    const pageNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    const handlePage = (page) => {
        setPage(page);
        scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    };

    return (
        <div className={darkMode ? 'homepage-container' : ' home-light'}>
            <Slider />
            <div className="movies-wrapper">
                <div className="popular-container">
                    <h3 className="popular-title">Popular Movies</h3>
                    <div className="popular-cards-wrapper">
                        {popularMovies?.map(movie => {
                            return <MovieCard radius={'16px'} cardStyle={'popular-card'} width={'200px'} height={'300px'}
                                imageUrl={movie.poster_path} key={movie.id} data={movie} />;
                        })}
                    </div>
                    <div className="page-numbers" style={darkMode ? { color: 'white' } : { color: 'black' }}>
                        <p> Select Page</p>
                        {pageNumbers.map((item) => (
                            <p className={item === page ? 'current-page' : 'page'}
                                key={item}
                                onClick={() => handlePage(item)}>
                                {item}
                            </p>
                        ))}
                    </div>
                </div>

                <div className="top-rated-container">
                    <h3>Top Rated Movies</h3>
                    <div className="top-rated-cards-wrapper">
                        {topRatedMovies?.map(movie => {
                            return <MovieCard radius={'8px'} cardStyle={'top-rated-card'} width={'200px'} height={'100px'}
                                imageUrl={movie.backdrop_path} key={movie.id} data={movie} />;
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HomePage;