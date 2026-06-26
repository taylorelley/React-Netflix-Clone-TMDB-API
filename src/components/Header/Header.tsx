'use client';

import { useContext, useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
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
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);

  const handleTheme = (): void => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('darkMode', JSON.stringify(newDarkMode));
    }
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (headerRef.current) {
      gsap.from(headerRef.current, {
        y: -80,
        opacity: 0,
        duration: 1.2,
        ease: 'expo.out',
        delay: 0.2,
      });
    }
  }, []);

  const containerClass = [
    styles.headerContainer,
    scrolled ? styles.scrolled : '',
    darkMode ? '' : styles.headerLight,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div ref={headerRef} className={containerClass}>
      <Link className={styles.logo} href="/">
        <span className={styles.logoText}>Netflix</span>
      </Link>

      <nav className={`${styles.nav} ${menuOpen ? styles.navOpen : ''}`}>
        <Link href="/" className={styles.navLink} onClick={() => setMenuOpen(false)}>
          Home
        </Link>
        <Link href="/myfavorites" className={styles.navLink} onClick={() => setMenuOpen(false)}>
          Favorites
        </Link>
        <Link href="/signin" className={styles.navLink} onClick={() => setMenuOpen(false)}>
          Sign In
        </Link>
      </nav>

      <div className={styles.rightSection}>
        <div className={`${styles.searchContainer} ${searchFocused ? styles.searchExpanded : ''}`}>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
            className={styles.searchInput}
            placeholder="Search movies..."
          />
          <svg
            className={styles.searchIcon}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>

          {query.trim() !== '' && (
            <div className={styles.searchResultsContainer}>
              {searchResults.map((movie) => (
                <SearchResults setQuery={setQuery} key={movie.id} movie={movie} />
              ))}
            </div>
          )}
        </div>

        <div className={styles.themeToggle} onClick={handleTheme}>
          {darkMode ? (
            <MdOutlineLightMode className={styles.themeIcon} />
          ) : (
            <MdOutlineDarkMode className={styles.themeIcon} />
          )}
        </div>

        <button
          className={`${styles.hamburger} ${menuOpen ? styles.hamburgerOpen : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </div>
  );
}
