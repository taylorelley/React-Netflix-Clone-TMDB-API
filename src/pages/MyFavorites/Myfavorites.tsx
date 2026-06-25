import { useState, useEffect, useContext } from 'react';
import MovieCard from '../../components/MovieCard/MovieCard';
import './fav.css';
import axios from 'axios';
import { UserContext } from '../../context/UserContext';

/**
 * My Favorites page.
 * @deprecated Route is commented out in App.jsx. Kept for reference.
 */
function MyFavorites() {
  const [movies, setMovies] = useState<
    {
      movie: {
        _id: string;
        poster_path: string | null;
        title: string;
        vote_average: number;
      }[];
    }[]
  >([]);
  const { user, token } = useContext(UserContext);
  const serverUrl: string | undefined = import.meta.env.VITE_SERVER_URL;

  useEffect(() => {
    axios
      .get(`${serverUrl}favoriteMovies/user/${user?._id}`)
      .then((res) => {
        console.log(res.data);
        setMovies(res.data.favorites);
      })
      .catch((err) => console.log(err));
  }, [user, serverUrl]);

  return (
    <div className="favorites-container">
      {token ? (
        movies.map((item) => {
          const movie = item.movie[0];
          return (
            <MovieCard
              radius={'16px'}
              cardStyle={'popular-card'}
              width={'200px'}
              height={'300px'}
              imageUrl={movie?.poster_path}
              key={movie?._id}
              data={
                movie
                  ? {
                      id: Number(movie._id),
                      title: movie.title,
                      poster_path: movie.poster_path,
                      vote_average: movie.vote_average,
                      overview: '',
                      backdrop_path: null,
                      release_date: '',
                      genre_ids: [],
                    }
                  : undefined
              }
            />
          );
        })
      ) : (
        <p style={{ color: 'white' }}>
          Signin to save movies to your favorites.
        </p>
      )}
    </div>
  );
}

export default MyFavorites;
