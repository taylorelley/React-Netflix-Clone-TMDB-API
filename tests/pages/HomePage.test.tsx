import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { usePopularMovies } from '@/hooks/usePopularMovies';
import { useTopRatedMovies } from '@/hooks/useTopRatedMovies';
import HomePage from '@/views/HomePage/HomePage';
import ThemeContextProvider from '@/context/ThemeContext';
import type { Movie } from '@/types/tmdb';

vi.mock('@/hooks/usePopularMovies', () => ({
  usePopularMovies: vi.fn().mockReturnValue({
    movies: [
      { id: 1, title: 'Popular 1', vote_average: 7, poster_path: '/p1.jpg', genre_ids: [28], overview: '', backdrop_path: null, release_date: '' },
      { id: 2, title: 'Popular 2', vote_average: 8, poster_path: '/p2.jpg', genre_ids: [35], overview: '', backdrop_path: null, release_date: '' },
    ] as Movie[],
    loading: false,
    error: null,
  }),
}));
vi.mock('@/hooks/useTopRatedMovies', () => ({
  useTopRatedMovies: vi.fn().mockReturnValue({
    movies: [
      { id: 100, title: 'Top 1', vote_average: 9, backdrop_path: '/t1.jpg', genre_ids: [18], overview: '', poster_path: null, release_date: '' },
    ] as Movie[],
    loading: false,
    error: null,
  }),
}));

const renderHome = () =>
  render(
    <ThemeContextProvider>
      <HomePage />
    </ThemeContextProvider>
  );

describe('HomePage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders popular section title', () => {
    renderHome();
    expect(screen.getByText('Popular Movies')).toBeInTheDocument();
  });

  it('renders top-rated section title', () => {
    renderHome();
    expect(screen.getByText('Top Rated Movies')).toBeInTheDocument();
  });

  it('renders 10 page numbers', () => {
    renderHome();
    const pages = screen.getAllByText(/^[1-9]$|^10$/);
    expect(pages.length).toBeGreaterThanOrEqual(10);
  });

  it('clicking page 2 sets page state', () => {
    renderHome();
    fireEvent.click(screen.getByText('2'));
    const currentPageEl = document.querySelector('[class*="currentPage"]');
    expect(currentPageEl).toBeTruthy();
    expect(currentPageEl?.textContent).toBe('2');
  });

  it('renders popular movie cards', () => {
    renderHome();
    expect(screen.getByText('Popular 1')).toBeInTheDocument();
    expect(screen.getByText('Popular 2')).toBeInTheDocument();
  });

  it('renders light theme class when darkMode is false', () => {
    localStorage.setItem('darkMode', JSON.stringify(false));
    const { container } = renderHome();
    expect(container.querySelector('[class*="homeLight"]')).toBeTruthy();
  });

  it('uses the hook from usePopularMovies', () => {
    renderHome();
    expect(usePopularMovies).toHaveBeenCalled();
  });
});
