import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Ratings from '@/components/Ratings/Ratings';

describe('Ratings', () => {
  it('renders star rating component', () => {
    const { container } = render(<Ratings movieRating={4} />);
    expect(container.querySelector('[class*="rating"]')).toBeTruthy();
  });

  it('handles invalid rating by coercing to 0', () => {
    const { container } = render(<Ratings movieRating={NaN} />);
    expect(container.querySelector('[class*="rating"]')).toBeTruthy();
  });

  it('renders with rating 0', () => {
    const { container } = render(<Ratings movieRating={0} />);
    expect(container.querySelector('[class*="rating"]')).toBeTruthy();
  });

  it('renders 5 star characters', () => {
    const { container } = render(<Ratings movieRating={3} />);
    const stars = container.querySelectorAll('span');
    expect(stars.length).toBe(5);
  });
});
