import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import SearchResults from '@/components/SearchResults/SearchResults';
import type { Movie } from '@/types/tmdb';

const pushMock = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: pushMock, replace: vi.fn() }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}));

const movie: Movie = {
  id: 7,
  title: 'Search Hit',
  backdrop_path: '/hit.jpg',
  vote_average: 7,
  overview: '',
  poster_path: null,
  release_date: '',
  genre_ids: [],
};

const renderResult = (props: Partial<React.ComponentProps<typeof SearchResults>> = {}) =>
  render(<SearchResults movie={movie} setQuery={() => {}} {...props} />);

describe('SearchResults', () => {
  it('renders title', () => {
    renderResult();
    expect(screen.getByText('Search Hit')).toBeInTheDocument();
  });

  it('renders image', () => {
    const { container } = renderResult();
    expect(container.querySelector('img')).toBeTruthy();
  });

  it('calls setQuery with empty string on click', () => {
    const setQuery = vi.fn();
    const { container } = renderResult({ setQuery });
    fireEvent.click(container.querySelector('[class*="searchResultsItem"]')!);
    expect(setQuery).toHaveBeenCalledWith('');
  });

  it('falls back to noImage on image error', () => {
    const { container } = renderResult();
    const img = container.querySelector('img');
    fireEvent.error(img!);
    expect(img!.getAttribute('src')).toContain('no-image');
  });

  it('navigates to movie details on click', () => {
    pushMock.mockClear();
    const { container } = renderResult();
    fireEvent.click(container.querySelector('[class*="searchResultsItem"]')!);
    expect(pushMock).toHaveBeenCalledWith('/moviedetails/7');
  });
});
