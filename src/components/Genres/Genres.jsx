import { useGenres } from '../../hooks/useGenres';

/**
 * Maps genre IDs to display names from TMDB genre list.
 * @param {Object} props
 * @param {number[]} props.moviesGenres
 */
function Genres({ moviesGenres }) {
    const { genres: allGenres } = useGenres();

    return (
        <div style={{ display: 'flex' }}>
            <p>Genres: </p>
            {moviesGenres?.map((id, index) => {
                const genre = allGenres.find((genre) => genre.id === id);
                return (
                    <p key={id}><span>&nbsp;</span>{genre?.name}{index !== moviesGenres.length - 1 && ','}</p>
                );
            })}
        </div>
    );
}

export default Genres;