import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

vi.mock('../../hooks/useGenres', () => ({
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

import Genres from './Genres';

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

  it('renders comma between multiple genres', () => {
    const { container } = render(<Genres moviesGenres={[28, 35]} />);
    expect(container.textContent).toMatch(/,/);
  });
});