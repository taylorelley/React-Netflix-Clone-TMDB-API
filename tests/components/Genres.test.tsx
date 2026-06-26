import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Genres from '@/components/Genres/Genres';
import { useGenres } from '@/hooks/useGenres';

vi.mock('@/hooks/useGenres', () => ({
  useGenres: vi.fn().mockReturnValue({
    genres: [
      { id: 28, name: 'Action' },
      { id: 35, name: 'Comedy' },
      { id: 18, name: 'Drama' },
    ],
    loading: false,
    error: null,
  }),
}));

describe('Genres', () => {
  it('maps genre IDs to names', () => {
    render(<Genres moviesGenres={[28, 35]} />);
    expect(screen.getByText(/Action/)).toBeInTheDocument();
    expect(screen.getByText(/Comedy/)).toBeInTheDocument();
  });

  it('handles empty moviesGenres', () => {
    const { container } = render(<Genres moviesGenres={[]} />);
    expect(container.querySelector('div')).toBeTruthy();
  });

  it('handles undefined moviesGenres', () => {
    const { container } = render(<Genres />);
    expect(container.querySelector('div')).toBeTruthy();
  });

  it('renders multiple genre tags', () => {
    const { container } = render(<Genres moviesGenres={[28, 35]} />);
    const tags = container.querySelectorAll('[class*="genreTag"]');
    expect(tags.length).toBe(2);
  });

  it('uses the hook from useGenres', () => {
    render(<Genres />);
    expect(useGenres).toHaveBeenCalled();
  });
});
