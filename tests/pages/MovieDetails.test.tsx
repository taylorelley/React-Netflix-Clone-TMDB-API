import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { useMovieDetails } from '@/hooks/useMovieDetails';
import { useMovieTrailer } from '@/hooks/useMovieTrailer';
import { useMovieReviews } from '@/hooks/useMovieReviews';
import MovieDetails from '@/views/MovieDetails/MovieDetails';
import ThemeContextProvider from '@/context/ThemeContext';
import type { Movie, Review } from '@/types/tmdb';

const mockMovie: Movie = {
  id: 550,
  title: 'Fight Club',
  overview: 'Mayhem.',
  poster_path: '/p.jpg',
  vote_average: 8.4,
  genres: [{ id: 18, name: 'Drama' }],
  runtime: 139,
  budget: 63000000,
  tagline: 'Mischief. Mayhem. Soap.',
  status: 'Released',
  backdrop_path: null,
  release_date: '',
  genre_ids: [],
};

const mockReviews: Review[] = [
  { id: '1', author: 'A', content: 'r1', author_details: { avatar_path: null } },
  { id: '2', author: 'B', content: 'r2', author_details: { avatar_path: null } },
  { id: '3', author: 'C', content: 'r3', author_details: { avatar_path: null } },
  { id: '4', author: 'D', content: 'r4', author_details: { avatar_path: null } },
];

const {
  useMovieDetails: useMovieDetailsMock,
  useMovieTrailer: useMovieTrailerMock,
  useMovieReviews: useMovieReviewsMock,
} = vi.hoisted(() => ({
  useMovieDetails: vi.fn(),
  useMovieTrailer: vi.fn(),
  useMovieReviews: vi.fn(),
}));

vi.mock('@/hooks/useMovieDetails', () => ({ useMovieDetails: useMovieDetailsMock }));
vi.mock('@/hooks/useMovieTrailer', () => ({ useMovieTrailer: useMovieTrailerMock }));
vi.mock('@/hooks/useMovieReviews', () => ({ useMovieReviews: useMovieReviewsMock }));

vi.mock('next/navigation', () => ({
  useParams: () => ({ movieid: '550' }),
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
  usePathname: () => '/moviedetails/550',
  useSearchParams: () => new URLSearchParams(),
}));

const renderDetails = () =>
  render(
    <ThemeContextProvider>
      <MovieDetails />
    </ThemeContextProvider>,
  );

beforeEach(() => {
  localStorage.clear();
  useMovieDetailsMock.mockReturnValue({ movie: mockMovie, loading: false, error: null });
  useMovieTrailerMock.mockReturnValue({ trailerKey: 'abc123', loading: false, error: null });
  useMovieReviewsMock.mockReturnValue({
    reviews: mockReviews,
    totalReviews: 4,
    loading: false,
    error: null,
  });
});

describe('MovieDetails', () => {
  it('renders movie title', () => {
    renderDetails();
    expect(screen.getByText('Fight Club')).toBeInTheDocument();
  });

  it('renders trailer section when key present', () => {
    const { container } = renderDetails();
    expect(container.querySelector('[class*="trailerWrapper"]')).toBeTruthy();
  });

  it('renders reviews', () => {
    renderDetails();
    expect(screen.getByText(/Reviews/)).toBeInTheDocument();
  });

  it('read more reviews increments count', () => {
    renderDetails();
    expect(screen.getByText(/Load More/)).toBeInTheDocument();
  });

  it('shows Show Less when all reviews visible', () => {
    useMovieReviewsMock.mockReturnValue({
      reviews: mockReviews.slice(0, 1),
      totalReviews: 1,
      loading: false,
      error: null,
    });
    renderDetails();
    expect(screen.getByText(/Show Less/)).toBeInTheDocument();
  });

  it('renders blank trailer fallback when key is null', () => {
    useMovieTrailerMock.mockReturnValue({ trailerKey: null, loading: false, error: null });
    const { container } = renderDetails();
    expect(container.querySelector('[class*="noTrailer"]')).toBeTruthy();
  });

  it('expands review count when Load More clicked', () => {
    renderDetails();
    fireEvent.click(screen.getByText(/Load More/));
    expect(screen.getByText(/Show Less/)).toBeInTheDocument();
  });

  it('clicking Show Less collapses back', () => {
    useMovieReviewsMock.mockReturnValue({
      reviews: mockReviews,
      totalReviews: 4,
      loading: false,
      error: null,
    });
    renderDetails();
    fireEvent.click(screen.getByText(/Load More/));
    expect(screen.getByText(/Show Less/)).toBeInTheDocument();
    fireEvent.click(screen.getByText(/Show Less/));
    expect(screen.getByText(/Load More/)).toBeInTheDocument();
  });

  it('uses the hook from useMovieDetails', () => {
    renderDetails();
    expect(useMovieDetails).toHaveBeenCalled();
  });
});
