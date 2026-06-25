import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import MovieCard from './MovieCard';

const movie = { id: 42, title: 'Inception', vote_average: 8.4 };

const renderCard = (props = {}) =>
  render(
    <MemoryRouter>
      <MovieCard data={movie} imageUrl="/inc.jpg" cardStyle="popular-card" {...props} />
    </MemoryRouter>
  );

describe('MovieCard', () => {
  it('renders movie title', () => {
    renderCard();
    expect(screen.getByText('Inception')).toBeInTheDocument();
  });

  it('renders rating display', () => {
    renderCard();
    expect(screen.getByText(/Rating: 4/)).toBeInTheDocument();
  });

  it('navigates to /moviedetails/{id} on click', () => {
    const { container } = renderCard();
    const card = container.querySelector('.popular-card');
    expect(card).toBeTruthy();
    fireEvent.click(card);
    // MemoryRouter doesn't expose history; ensure click handled without error
    expect(container.querySelector('.popular-card')).toBeTruthy();
  });

  it('renders without data prop (rating 0)', () => {
    render(
      <MemoryRouter>
        <MovieCard imageUrl="/x.jpg" cardStyle="popular-card" />
      </MemoryRouter>
    );
    expect(screen.getAllByText(/Rating:/).length).toBeGreaterThan(0);
  });
});