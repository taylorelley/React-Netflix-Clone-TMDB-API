import { useGenres } from '../../hooks/useGenres';

interface GenresProps {
  moviesGenres?: number[];
}

/**
 * Maps genre IDs to display names from TMDB genre list.
 * @param props.moviesGenres Array of TMDB genre IDs
 */
function Genres({ moviesGenres }: GenresProps) {
  const { genres: allGenres } = useGenres();

  return (
    <div style={{ display: 'flex' }}>
      <p>Genres: </p>
      {moviesGenres?.map((id, index) => {
        const genre = allGenres.find((g) => g.id === id);
        return (
          <p key={id}>
            <span>&nbsp;</span>
            {genre?.name}
            {index !== moviesGenres.length - 1 && ','}
          </p>
        );
      })}
    </div>
  );
}

export default Genres;
