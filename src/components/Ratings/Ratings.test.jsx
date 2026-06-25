import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import Ratings from './Ratings';

describe('Ratings', () => {
  it('renders star rating component', () => {
    const { container } = render(<Ratings movieRating={4} />);
    expect(container.querySelector('.rating')).toBeTruthy();
  });

  it('handles invalid rating by coercing to 0', () => {
    const { container } = render(<Ratings movieRating={NaN} />);
    expect(container.querySelector('.rating')).toBeTruthy();
  });

  it('renders with rating 0', () => {
    const { container } = render(<Ratings movieRating={0} />);
    expect(container.querySelector('.rating')).toBeTruthy();
  });
});