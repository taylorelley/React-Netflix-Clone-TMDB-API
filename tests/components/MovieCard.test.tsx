import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import MovieCard from '@/components/MovieCard/MovieCard';
import type { Movie } from '@/types/tmdb';

const pushMock = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: pushMock, replace: vi.fn() }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}));

const movie: Movie = {
  id: 42,
  title: 'Inception',
  vote_average: 8.4,
  overview: '',
  poster_path: null,
  backdrop_path: null,
  release_date: '',
  genre_ids: [],
};

const renderCard = (props: Partial<React.ComponentProps<typeof MovieCard>> = {}) =>
  render(<MovieCard data={movie} imageUrl="/inc.jpg" cardStyle="popular-card" {...props} />);

describe('MovieCard', () => {
  it('renders movie title', () => {
    renderCard();
    expect(screen.getByText('Inception')).toBeInTheDocument();
  });

  it('renders rating display', () => {
    renderCard();
    // vote_average 8.4 → Math.round(8.4/2) = 4 → displayed as "4.0"
    expect(screen.getByText('4.0')).toBeInTheDocument();
  });

  it('navigates to /moviedetails/{id} on click', () => {
    pushMock.mockClear();
    const { container } = renderCard();
    const card = container.querySelector('[data-testid="movie-card"]');
    expect(card).toBeTruthy();
    if (card) fireEvent.click(card);
    expect(pushMock).toHaveBeenCalledWith('/moviedetails/42');
  });

  it('renders without data prop (rating 0)', () => {
    const { container } = render(<MovieCard imageUrl="/x.jpg" cardStyle="popular-card" />);
    // Ratings component renders with value "0.0"
    expect(container.textContent).toContain('0.0');
  });
});
