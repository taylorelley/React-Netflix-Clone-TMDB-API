import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Review from '@/components/Review/Review';
import ThemeContextProvider from '@/context/ThemeContext';
import type { Review as ReviewType } from '@/types/tmdb';

const review: ReviewType = {
  id: 'r1',
  author: 'Alice',
  content: 'A'.repeat(400),
  author_details: { avatar_path: '/av.jpg' },
};

const shortReview: ReviewType = {
  id: 'r2',
  author: 'Bob',
  content: 'short text',
  author_details: { avatar_path: null },
};

const renderReview = (r: ReviewType = review) =>
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
    const img = document.querySelector('img');
    fireEvent.error(img!);
    expect(img!.getAttribute('src')).toContain('avatar.gif');
  });

  it('renders with short content (no separate path)', () => {
    renderReview(shortReview);
    expect(screen.getByText(/read more/)).toBeInTheDocument();
  });

  it('uses content-light class when darkMode is false', async () => {
    localStorage.setItem('darkMode', JSON.stringify(false));
    const { container } = renderReview();
    // Wait for the useEffect to read from localStorage
    await new Promise((r) => setTimeout(r, 10));
    expect(container.querySelector('[class*="contentLight"]')).toBeTruthy();
  });
});
