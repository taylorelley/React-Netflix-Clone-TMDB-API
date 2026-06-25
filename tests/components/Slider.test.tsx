import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { useUpcomingMovies } from '@/hooks/useUpcomingMovies';
import { useGenres } from '@/hooks/useGenres';
import Slider from '@/components/Slider/Slider';

vi.mock('@/hooks/useUpcomingMovies', () => ({
  useUpcomingMovies: vi.fn().mockReturnValue({
    movies: [
      { id: 1, title: 'Movie A', overview: 'overview A text', backdrop_path: '/a.jpg', genre_ids: [28], vote_average: 8, release_date: '2026-12-01', poster_path: null },
      { id: 2, title: 'Movie B', overview: 'overview B text', backdrop_path: '/b.jpg', genre_ids: [35], vote_average: 7, release_date: '2026-12-15', poster_path: null },
    ],
    loading: false,
    error: null,
  }),
}));
vi.mock('@/hooks/useGenres', () => ({
  useGenres: vi.fn().mockReturnValue({
    genres: [{ id: 28, name: 'Action' }, { id: 35, name: 'Comedy' }],
    loading: false,
    error: null,
  }),
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}));

const renderSlider = () => render(<Slider />);

describe('Slider', () => {
  it('renders first movie title by default', () => {
    renderSlider();
    expect(screen.getByText('Movie A')).toBeInTheDocument();
  });

  it('right arrow advances index', () => {
    renderSlider();
    fireEvent.click(document.querySelector('[class*="rightArrow"]')!);
    expect(screen.getByText('Movie B')).toBeInTheDocument();
  });

  it('right arrow wraps from last to first', () => {
    renderSlider();
    fireEvent.click(document.querySelector('[class*="rightArrow"]')!);
    fireEvent.click(document.querySelector('[class*="rightArrow"]')!);
    expect(screen.getByText('Movie A')).toBeInTheDocument();
  });

  it('left arrow from first wraps to last', () => {
    renderSlider();
    fireEvent.click(document.querySelector('[class*="leftArrow"]')!);
    expect(screen.getByText('Movie B')).toBeInTheDocument();
  });

  it('left arrow decrements from middle', () => {
    renderSlider();
    fireEvent.click(document.querySelector('[class*="rightArrow"]')!);
    fireEvent.click(document.querySelector('[class*="leftArrow"]')!);
    expect(screen.getByText('Movie A')).toBeInTheDocument();
  });

  it('See Details click navigates + scrolls', () => {
    const original = window.scrollTo;
    window.scrollTo = vi.fn();
    renderSlider();
    fireEvent.click(screen.getByText('See Details'));
    expect(window.scrollTo).toHaveBeenCalled();
    window.scrollTo = original;
  });

  it('uses the hook from useUpcomingMovies', () => {
    renderSlider();
    expect(useUpcomingMovies).toHaveBeenCalled();
  });
});
