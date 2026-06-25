'use client';

import { useContext, useState } from 'react';
import Link from 'next/link';
import { ThemeContext } from '@/context/ThemeContext';
import { useSearch } from '@/hooks/useSearch';
import SearchResults from '../SearchResults/SearchResults';
import { MdOutlineDarkMode, MdOutlineLightMode } from 'react-icons/md';
import styles from './Header.module.css';

export default function Header() {
  const ctx = useContext(ThemeContext);
  const darkMode = ctx?.darkMode ?? true;
  const setDarkMode = ctx?.setDarkMode ?? (() => {});
  const [query, setQuery] = useState<string>('');
  const { results: searchResults } = useSearch(query);

  const handleTheme = (): void => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('darkMode', JSON.stringify(newDarkMode));
    }
  };

  const containerClass = darkMode
    ? styles.headerContainer
    : `${styles.headerContainer} ${styles.headerLight}`;

  return (
    <div className={containerClass}>
      <Link className={styles.logo} href="/">
        Cinetrail
      </Link>
      <div className={styles.searchContainer}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className={`${styles.searchInput} ${query ? styles.inputActive : ''}`}
          placeholder="Search movies..."
        />

        {query.trim() !== '' && (
          <div className={styles.searchResultsContainer}>
            {searchResults.map((movie) => (
              <SearchResults setQuery={setQuery} key={movie.id} movie={movie} />
            ))}
          </div>
        )}
      </div>

      <div className={styles.headerButtonsContainer}>
        <div className={styles.themeButtons}>
          {darkMode ? (
            <>
              <MdOutlineLightMode
                onClick={handleTheme}
                className={styles.themeIcon}
              />
              <MdOutlineDarkMode className={`${styles.themeIcon} ${styles.themeIconActive}`} />
            </>
          ) : (
            <>
              <MdOutlineLightMode className={`${styles.themeIcon} ${styles.themeIconActive}`} />
              <MdOutlineDarkMode onClick={handleTheme} className={styles.themeIcon} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
