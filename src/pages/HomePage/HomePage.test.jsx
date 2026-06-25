import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

vi.mock('../../hooks/usePopularMovies', () => ({
  usePopularMovies: vi.fn().mockReturnValue({
    movies: [
      { id: 1, title: 'Popular 1', vote_average: 7, poster_path: '/p1.jpg', genre_ids: [28] },
      { id: 2, title: 'Popular 2', vote_average: 8, poster_path: '/p2.jpg', genre_ids: [35] },
    ],
    loading: false,
    error: null,
  }),
}));
vi.mock('../../hooks/useTopRatedMovies', () => ({
  useTopRatedMovies: vi.fn().mockReturnValue({
    movies: [
      { id: 100, title: 'Top 1', vote_average: 9, backdrop_path: '/t1.jpg', genre_ids: [18] },
    ],
    loading: false,
    error: null,
  }),
}));

import HomePage from './HomePage';
import ThemeContextProvider from '../../context/ThemeContext';

const renderHome = () =>
  render(
    <MemoryRouter>
      <ThemeContextProvider>
        <HomePage />
      </ThemeContextProvider>
    </MemoryRouter>
  );

describe('HomePage', () => {
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
    // After click, page 2 should have 'current-page' class
    expect(screen.getByText('2').className).toContain('current-page');
  });

  it('renders popular movie cards', () => {
    renderHome();
    expect(screen.getByText('Popular 1')).toBeInTheDocument();
    expect(screen.getByText('Popular 2')).toBeInTheDocument();
  });

  it('renders light theme class when darkMode is false', () => {
    localStorage.setItem('darkMode', JSON.stringify(false));
    const { container } = renderHome();
    expect(container.querySelector('.home-light')).toBeTruthy();
  });
});