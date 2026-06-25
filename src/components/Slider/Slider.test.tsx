import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

vi.mock('../../hooks/useUpcomingMovies', () => ({
  useUpcomingMovies: vi.fn().mockReturnValue({
    movies: [
      {
        id: 1,
        title: 'Movie A',
        overview: 'overview A text',
        backdrop_path: '/a.jpg',
        genre_ids: [28],
        vote_average: 8,
        release_date: '2026-12-01',
        poster_path: null,
      },
      {
        id: 2,
        title: 'Movie B',
        overview: 'overview B text',
        backdrop_path: '/b.jpg',
        genre_ids: [35],
        vote_average: 7,
        release_date: '2026-12-15',
        poster_path: null,
      },
    ],
    loading: false,
    error: null,
  }),
}));
vi.mock('../../hooks/useGenres', () => ({
  useGenres: vi.fn().mockReturnValue({
    genres: [
      { id: 28, name: 'Action' },
      { id: 35, name: 'Comedy' },
    ],
    loading: false,
    error: null,
  }),
}));

import Slider from './Slider';

const renderSlider = () =>
  render(
    <MemoryRouter>
      <Slider />
    </MemoryRouter>,
  );

const clickIcon = (selector: string): void => {
  const el = document.querySelector(selector) as HTMLElement;
  fireEvent.click(el);
};

describe('Slider', () => {
  it('renders first movie title by default', () => {
    renderSlider();
    expect(screen.getByText('Movie A')).toBeInTheDocument();
  });

  it('right arrow advances index', () => {
    renderSlider();
    clickIcon('.right-arrow');
    expect(screen.getByText('Movie B')).toBeInTheDocument();
  });

  it('right arrow wraps from last to first', () => {
    renderSlider();
    clickIcon('.right-arrow');
    clickIcon('.right-arrow');
    expect(screen.getByText('Movie A')).toBeInTheDocument();
  });

  it('left arrow from first wraps to last', () => {
    renderSlider();
    clickIcon('.left-arrow');
    expect(screen.getByText('Movie B')).toBeInTheDocument();
  });

  it('left arrow decrements from middle', () => {
    renderSlider();
    clickIcon('.right-arrow');
    clickIcon('.left-arrow');
    expect(screen.getByText('Movie A')).toBeInTheDocument();
  });

  it('See Details click navigates + scrolls', () => {
    // Stub scrollTo to verify it gets called
    const original = window.scrollTo;
    window.scrollTo = vi.fn();
    renderSlider();
    fireEvent.click(screen.getByText('See Details'));
    expect(window.scrollTo).toHaveBeenCalled();
    window.scrollTo = original;
  });
});
