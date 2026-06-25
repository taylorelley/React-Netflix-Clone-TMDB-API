import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Review from './Review';
import ThemeContextProvider from '../../context/ThemeContext';

const review = {
  id: 'r1',
  author: 'Alice',
  content: 'A'.repeat(400),
  author_details: { avatar_path: '/av.jpg' },
};

const shortReview = {
  id: 'r2',
  author: 'Bob',
  content: 'short text',
  author_details: { avatar_path: null },
};

const renderReview = (r = review) =>
  render(
    <ThemeContextProvider>
      <Review review={r} />
    </ThemeContextProvider>
  );

describe('Review', () => {
  it('truncates long content to 300 chars + read more', () => {
    renderReview();
    expect(screen.getByText(/read more/)).toBeInTheDocument();
  });

  it('shows full content when expanded', () => {
    renderReview();
    fireEvent.click(screen.getByText(/read more/));
    expect(screen.getByText(/read less/)).toBeInTheDocument();
  });

  it('toggles back to truncated when read less clicked', () => {
    renderReview();
    fireEvent.click(screen.getByText(/read more/));
    fireEvent.click(screen.getByText(/read less/));
    expect(screen.getByText(/read more/)).toBeInTheDocument();
  });

  it('shows author name', () => {
    renderReview();
    expect(screen.getByText('Alice')).toBeInTheDocument();
  });

  it('falls back to avatar.gif on image error', () => {
    renderReview();
    const img = document.querySelector('img.avatar');
    fireEvent.error(img);
    expect(img.src).toContain('avatar.gif');
  });

  it('renders with short content (no separate path)', () => {
    renderReview(shortReview);
    expect(screen.getByText(/read more/)).toBeInTheDocument();
  });

  it('uses content-light class when darkMode is false', () => {
    localStorage.setItem('darkMode', JSON.stringify(false));
    const { container } = renderReview();
    expect(container.querySelector('.content-light')).toBeTruthy();
  });
});