import { useContext, useState } from 'react';
import { ThemeContext } from '../../context/ThemeContext';
import { Link } from 'react-router-dom';
import { useSearch } from '../../hooks/useSearch';
import SearchResults from '../SearchResults/SearchResults';
import { MdOutlineDarkMode, MdOutlineLightMode } from 'react-icons/md';
import './header.css';

function Header() {
    const { darkMode, setDarkMode } = useContext(ThemeContext);
    const [query, setQuery] = useState('');
    const { results: searchResults } = useSearch(query);

    const handleTheme = () => {
        const newDarkMode = !darkMode;
        setDarkMode(newDarkMode);
        localStorage.setItem('darkMode', newDarkMode);
    };

    return (
        <div className={darkMode ? 'header-container' : 'header-container header-light'}>
            <Link className="logo" to="/">Netflix</Link>
            <div className="search-container">
                <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className={`search-input ${query && 'input-active'} ${!query && !darkMode && query}`}
                    placeholder="Search movies..."
                />

                {query.trim() !== '' && (
                    <div className="search-results-container">
                        {searchResults.map((movie) => {
                            return <SearchResults setQuery={setQuery} key={movie.id} movie={movie} />;
                        })}
                    </div>
                )}
            </div>

            <div className="header-buttons-container">
                <div className="theme-button-container">
                    {darkMode
                        ? <div className="theme-buttons">
                            <MdOutlineLightMode onClick={handleTheme} className="theme-icon" />
                            <MdOutlineDarkMode className="theme-icon theme-icon-active" />
                        </div>
                        : <div className="theme-buttons">
                            <MdOutlineLightMode className="theme-icon theme-icon-active" />
                            <MdOutlineDarkMode onClick={handleTheme} className="theme-icon" />
                        </div>}
                </div>
            </div>
        </div>
    );
}

export default Header;